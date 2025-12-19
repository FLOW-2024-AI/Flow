import os, re, time, uuid, boto3
from urllib.parse import unquote_plus
from datetime import datetime, timedelta, timezone
from email import policy
from email.parser import BytesParser
from email.utils import getaddresses
from botocore.exceptions import ClientError

s3 = boto3.client("s3")
textract = boto3.client("textract")

DEST_BUCKET = os.environ["DEST_BUCKET"]
BASE_PREFIX = os.environ.get("BASE_PREFIX", "").strip().strip("/")
TENANT_EMAIL_DOMAIN = os.environ.get("TENANT_EMAIL_DOMAIN", "flow-cfo.com").lower()
DEFAULT_TENANT_ID = os.environ.get("DEFAULT_TENANT_ID", "unknown").strip().lower()
DELAY_SECONDS = int(os.environ.get("DELAY_SECONDS", "15"))
TZ_OFFSET_MIN = int(os.environ.get("DATE_TZ_OFFSET_MINUTES", "-300"))
VALIDATION_MIN_MATCHES = int(os.environ.get("VALIDATION_MIN_MATCHES", "2"))
IMAGE_VALIDATION_MIN_MATCHES = int(os.environ.get("IMAGE_VALIDATION_MIN_MATCHES", "0"))
ALLOW_UNVALIDATED_ATTACHMENTS = os.environ.get("ALLOW_UNVALIDATED_ATTACHMENTS", "true").lower() == "true"

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png"}
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}

def _normalize_tenant_id(value: str) -> str:
    value = (value or "").strip().lower()
    if not value:
        return DEFAULT_TENANT_ID
    value = value.split("+", 1)[0]
    return re.sub(r"[^a-z0-9._-]+", "-", value) or DEFAULT_TENANT_ID


def _extract_tenant_id(recipients) -> str:
    for addr in recipients or []:
        addr = (addr or "").strip().lower()
        if "@" not in addr:
            continue
        local, _, domain = addr.partition("@")
        if domain == TENANT_EMAIL_DOMAIN:
            return _normalize_tenant_id(local)
    return DEFAULT_TENANT_ID


def _extract_recipients_from_headers(message) -> list:
    header_values = []
    for header in (
        "to",
        "cc",
        "bcc",
        "delivered-to",
        "x-original-to",
        "x-forwarded-to",
        "x-envelope-to",
    ):
        header_values.extend(message.get_all(header, []))
    addresses = [addr for _, addr in getaddresses(header_values) if addr]
    return addresses


def _today_prefix(tenant_id: str) -> str:
    tz = timezone(timedelta(minutes=TZ_OFFSET_MIN))
    now = datetime.now(tz)
    parts = [p for p in [BASE_PREFIX, tenant_id, f"{now.year:04d}", f"{now.month:02d}", f"{now.day:02d}"] if p]
    return "/".join(parts)

def _ensure_folder_marker(prefix: str):
    key = prefix.rstrip("/") + "/"
    try:
        # Just try to create it - if it exists, S3 will just overwrite with empty content
        s3.put_object(Bucket=DEST_BUCKET, Key=key, Body=b"")
    except ClientError as e:
        # Only raise if it's not a permission issue on an existing object
        if e.response.get("Error", {}).get("Code") not in ("AccessDenied", "Forbidden"):
            raise

def _sanitize(name: str) -> str:
    name = (name or "adjunto.pdf")
    return re.sub(r"[^A-Za-z0-9._-]+", "_", name)[:200]

def _is_pdf(part) -> bool:
    ctype = (part.get_content_type() or "").lower()
    fname = (part.get_filename() or "").lower()
    return (part.get_content_disposition() == "attachment") and (
        ctype == "application/pdf" or fname.endswith(".pdf")
    )

def _is_image(part) -> bool:
    ctype = (part.get_content_type() or "").lower()
    fname = (part.get_filename() or "").lower()
    disposition = part.get_content_disposition()
    if disposition not in ("attachment", "inline") and not fname:
        return False
    if ctype in ALLOWED_IMAGE_TYPES:
        return True
    return os.path.splitext(fname)[1] in ALLOWED_IMAGE_EXTENSIONS


def _guess_image_type(filename: str) -> str:
    ext = os.path.splitext(filename or "")[1].lower()
    if ext in {".jpg", ".jpeg"}:
        return "image/jpeg"
    if ext == ".png":
        return "image/png"
    return "image/jpeg"


def _attachments(msg):
    for part in msg.walk():
        if part.get_content_maintype() == "multipart":
            continue

        is_pdf = _is_pdf(part)
        is_image = _is_image(part)
        if not is_pdf and not is_image:
            continue

        data = part.get_payload(decode=True)
        if not data:
            continue

        filename = part.get_filename()
        if not filename:
            filename = "adjunto.pdf" if is_pdf else "imagen.jpg"

        content_type = (part.get_content_type() or "").lower()
        if is_image and content_type not in ALLOWED_IMAGE_TYPES:
            content_type = _guess_image_type(filename)
        if is_pdf:
            content_type = "application/pdf"

        kind = "pdf" if is_pdf else "image"
        yield filename, data, content_type, kind

# ---------- Validación simple ----------
RUC_RE    = re.compile(r"\b(1[07]\d{9}|20\d{9})\b")
SERIE_RE  = re.compile(r"\b[FB]\d{3}-\d{6,8}\b")
TOTAL_RE  = re.compile(r"(S\/\.|PEN|\sS\s|\$|USD|US\$)\s*\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?")
KEYWORDS  = re.compile(r"\b(FACTURA|BOLETA|SUNAT)\b", re.IGNORECASE)

def _extract_text(pdf_bytes: bytes) -> str:
    try:
        resp = textract.detect_document_text(Document={"Bytes": pdf_bytes})
        return " ".join(b["Text"] for b in resp.get("Blocks", []) if b.get("BlockType") == "LINE")
    except ClientError as e:
        print(f"Textract error: {e}")
        return ""

def _passes_simple_invoice_check(text: str, min_matches: int) -> bool:
    matches = 0
    matches += 1 if RUC_RE.search(text) else 0
    matches += 1 if SERIE_RE.search(text) else 0
    matches += 1 if TOTAL_RE.search(text) else 0
    matches += 1 if KEYWORDS.search(text) else 0
    return matches >= min_matches

def _extract_message_id(mail_data=None) -> str:
    """Get a stable messageId to avoid overwriting files; fallback to uuid4."""
    if mail_data and mail_data.get("messageId"):
        return mail_data["messageId"]
    return str(uuid.uuid4())

# ---------- Handler ----------
def handler(event, context):
    import json

    print(f"Event received: {json.dumps(event)}")

    record = event.get("Records", [{}])[0]

    # 1) S3 notification (incoming email object created)
    if record.get("eventSource") == "aws:s3":
        s3_bucket = record["s3"]["bucket"]["name"]
        s3_key = unquote_plus(record["s3"]["object"]["key"])
        print(f"S3 event -> fetching email from s3://{s3_bucket}/{s3_key}")
        s3_obj = s3.get_object(Bucket=s3_bucket, Key=s3_key)
        raw_bytes = s3_obj["Body"].read()
        message_id = _extract_message_id({"messageId": record["s3"]["object"].get("versionId")})

    # 2) SNS notification (SES -> SNS -> Lambda)
    elif "Sns" in record:
        sns_message = json.loads(record["Sns"]["Message"])
        print(f"SNS Message: {json.dumps(sns_message)}")

        receipt = sns_message.get("receipt", {})
        action = receipt.get("action", {})
        mail_data = sns_message.get("mail") or {}
        message_id = _extract_message_id(mail_data)

        if action.get("type") == "S3":
            s3_bucket = action["bucketName"]
            s3_key = action["objectKey"]
            print(f"Fetching email from s3://{s3_bucket}/{s3_key}")
            s3_obj = s3.get_object(Bucket=s3_bucket, Key=s3_key)
            raw_bytes = s3_obj["Body"].read()
        elif "content" in sns_message:
            raw_email = sns_message["content"]
            raw_bytes = raw_email.encode("utf-8") if isinstance(raw_email, str) else raw_email
        else:
            raise ValueError(f"Cannot find email content in SNS message. Message structure: {json.dumps(sns_message)}")

    # 3) Direct SES event (rare; SES -> Lambda)
    elif "ses" in record:
        ses_rec = record["ses"]
        mail_data = ses_rec.get("mail", {})
        raw_email = mail_data.get("content", "")
        raw_bytes = raw_email.encode("utf-8") if isinstance(raw_email, str) else raw_email
        message_id = _extract_message_id(mail_data)

    else:
        raise ValueError("Unsupported event source")

    msg = BytesParser(policy=policy.default).parsebytes(raw_bytes)
    recipients = []
    if "mail_data" in locals():
        recipients = mail_data.get("destination") or []
    if not recipients:
        recipients = _extract_recipients_from_headers(msg)
    tenant_id = _extract_tenant_id(recipients)
    print(f"Tenant ID: {tenant_id}")

    day_prefix = _today_prefix(tenant_id)
    _ensure_folder_marker(day_prefix)

    uploaded, uploaded_unvalidated, skipped = [], [], []
    for i, (fname, content, content_type, kind) in enumerate(_attachments(msg)):
        if i > 0 and DELAY_SECONDS > 0:
            time.sleep(DELAY_SECONDS)

        min_matches = VALIDATION_MIN_MATCHES if kind == "pdf" else IMAGE_VALIDATION_MIN_MATCHES
        if min_matches > 0:
            text = _extract_text(content)
            passes = text and _passes_simple_invoice_check(text, min_matches)
        else:
            passes = True

        if not passes and not ALLOW_UNVALIDATED_ATTACHMENTS:
            skipped.append({"file": fname, "reason": "no pasa validación simple"})
            continue

        key = f"{day_prefix}/{message_id}/{_sanitize(fname)}"
        s3.put_object(Bucket=DEST_BUCKET, Key=key, Body=content, ContentType=content_type)
        if passes:
            uploaded.append(key)
        else:
            uploaded_unvalidated.append(key)
        print(f"OK -> s3://{DEST_BUCKET}/{key}")

    return {
        "ok": True,
        "uploaded_count": len(uploaded),
        "uploaded_keys": uploaded,
        "uploaded_unvalidated": uploaded_unvalidated,
        "skipped": skipped,
        "dest_bucket": DEST_BUCKET,
        "day_prefix": day_prefix,
        "delay_seconds_between": DELAY_SECONDS,
        "min_matches": VALIDATION_MIN_MATCHES
    }
