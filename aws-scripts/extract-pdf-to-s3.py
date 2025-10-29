import os, re, time, boto3
from datetime import datetime, timedelta, timezone
from email import policy
from email.parser import BytesParser
from botocore.exceptions import ClientError

s3 = boto3.client("s3")
textract = boto3.client("textract")

DEST_BUCKET = os.environ["DEST_BUCKET"]
BASE_PREFIX = os.environ.get("BASE_PREFIX", "").strip().strip("/")
DELAY_SECONDS = int(os.environ.get("DELAY_SECONDS", "15"))
TZ_OFFSET_MIN = int(os.environ.get("DATE_TZ_OFFSET_MINUTES", "-300"))
VALIDATION_MIN_MATCHES = int(os.environ.get("VALIDATION_MIN_MATCHES", "2"))

def _today_prefix() -> str:
    tz = timezone(timedelta(minutes=TZ_OFFSET_MIN))
    now = datetime.now(tz)
    parts = [p for p in [BASE_PREFIX, f"{now.year:04d}", f"{now.month:02d}", f"{now.day:02d}"] if p]
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

def _pdf_attachments(msg):
    for part in msg.walk():
        if _is_pdf(part):
            data = part.get_payload(decode=True)
            if data:
                yield part.get_filename() or "adjunto.pdf", data

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

def _passes_simple_invoice_check(text: str) -> bool:
    matches = 0
    matches += 1 if RUC_RE.search(text) else 0
    matches += 1 if SERIE_RE.search(text) else 0
    matches += 1 if TOTAL_RE.search(text) else 0
    matches += 1 if KEYWORDS.search(text) else 0
    return matches >= VALIDATION_MIN_MATCHES

# ---------- Handler ----------
def handler(event, context):
    import json

    print(f"Event received: {json.dumps(event)}")

    # Check if event comes from SNS (SES -> SNS -> Lambda)
    if "Records" in event and event["Records"] and "Sns" in event["Records"][0]:
        # Extract SES notification from SNS message
        sns_message = json.loads(event["Records"][0]["Sns"]["Message"])
        print(f"SNS Message: {json.dumps(sns_message)}")

        # Get the S3 location of the email
        receipt = sns_message.get("receipt", {})
        action = receipt.get("action", {})

        if action.get("type") == "S3":
            # Email was stored in S3, fetch it
            s3_bucket = action["bucketName"]
            s3_key = action["objectKey"]

            print(f"Fetching email from s3://{s3_bucket}/{s3_key}")
            s3_obj = s3.get_object(Bucket=s3_bucket, Key=s3_key)
            raw_bytes = s3_obj["Body"].read()
        elif "content" in sns_message:
            # Inline email content in the notification
            raw_email = sns_message["content"]
            raw_bytes = raw_email.encode("utf-8") if isinstance(raw_email, str) else raw_email
        else:
            raise ValueError(f"Cannot find email content in SNS message. Message structure: {json.dumps(sns_message)}")
    else:
        # Direct SES event (SES -> Lambda)
        ses_rec = event["Records"][0]["ses"]
        raw_email = ses_rec["mail"]["content"]
        raw_bytes = raw_email.encode("utf-8") if isinstance(raw_email, str) else raw_email

    msg = BytesParser(policy=policy.default).parsebytes(raw_bytes)

    day_prefix = _today_prefix()
    _ensure_folder_marker(day_prefix)

    uploaded, skipped = [], []
    for i, (fname, content) in enumerate(_pdf_attachments(msg)):
        if i > 0 and DELAY_SECONDS > 0:
            time.sleep(DELAY_SECONDS)

        text = _extract_text(content)
        if not text or not _passes_simple_invoice_check(text):
            skipped.append({"file": fname, "reason": "no pasa validación simple"})
            continue

        key = f"{day_prefix}/{_sanitize(fname)}"
        s3.put_object(Bucket=DEST_BUCKET, Key=key, Body=content, ContentType="application/pdf")
        uploaded.append(key)
        print(f"OK -> s3://{DEST_BUCKET}/{key}")

    return {
        "ok": True,
        "uploaded_count": len(uploaded),
        "uploaded_keys": uploaded,
        "skipped": skipped,
        "dest_bucket": DEST_BUCKET,
        "day_prefix": day_prefix,
        "delay_seconds_between": DELAY_SECONDS,
        "min_matches": VALIDATION_MIN_MATCHES
    }
