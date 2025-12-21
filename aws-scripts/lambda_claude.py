"""
Lambda Function: Invoice Processor con AWS Bedrock
Trigger: S3 ObjectCreated
Flow: S3 PDF → Bedrock Claude 3.5 Sonnet → DynamoDB

Modelo: Claude 3.5 Sonnet v2 (mejor para documentos financieros)
"""

import json
import boto3
import os
import base64
import urllib3
from datetime import datetime
from decimal import Decimal, InvalidOperation
from email import policy
from email.parser import BytesParser
from botocore.exceptions import ClientError

# AWS Clients
s3_client = boto3.client('s3')
bedrock_runtime = boto3.client('bedrock-runtime')
textract_client = boto3.client('textract')
dynamodb = boto3.resource('dynamodb')

# Environment variables
TABLE_NAME = os.environ.get('DYNAMODB_TABLE', 'Facturas-dev')
table = dynamodb.Table(TABLE_NAME)
BASE_PREFIX = os.environ.get('BASE_PREFIX', '').strip().strip('/')

# SUNAT API credentials (from environment variables)
SUNAT_CLIENT_ID = os.environ.get('SUNAT_CLIENT_ID')
SUNAT_CLIENT_SECRET = os.environ.get('SUNAT_CLIENT_SECRET')
SUNAT_RUC = os.environ.get('SUNAT_RUC')  # RUC del consultante

# Bedrock model - Claude 3.5 Sonnet v2 (mejor para facturación)
# Usar inference profile en lugar de model ID directo
MODEL_ID = "us.anthropic.claude-3-5-sonnet-20241022-v2:0"

# HTTP client for SUNAT API
http = urllib3.PoolManager()

# Token cache (se reutiliza durante su vigencia)
sunat_token_cache = {
    'token': None,
    'expires_at': None
}

ALLOWED_PDF_MIME_TYPES = {'application/pdf'}
ALLOWED_IMAGE_MIME_TYPES = {'image/jpeg', 'image/png'}
ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png'}
MEDIA_TYPE_EXTENSION = {
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/png': '.png'
}

def extract_client_id(s3_key: str) -> str:
    parts = (s3_key or '').split('/')
    if BASE_PREFIX and parts and parts[0] == BASE_PREFIX:
        parts = parts[1:]
    return parts[0] if parts else 'unknown'


def lambda_handler(event, context):
    """
    Main handler - triggered by S3 upload
    """
    try:
        # 1. Get S3 event info
        record = event['Records'][0]
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        file_size = record['s3']['object']['size']
        
        print(f"📄 Processing: s3://{bucket}/{key}")
        print(f"📦 Size: {file_size} bytes")

        if key.endswith('/') or file_size == 0:
            print("⏭️ Skipping folder marker or empty object")
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Skipped empty object',
                    'key': key
                })
            }
        
        # 2. Extract client_id (tenant) from path
        client_id = extract_client_id(key)
        
        print(f"👤 Client ID: {client_id}")
        print(f"🏷️ Tenant ID: {client_id}")
        
        # 3. Download raw email from S3 and extract PDF attachment
        print("📥 Downloading raw SES email from S3...")
        email_obj = s3_client.get_object(Bucket=bucket, Key=key)
        raw_email = email_obj['Body'].read()

        print("🔍 Extracting attachment from email...")
        attachment = extract_attachment_from_email(raw_email, key)
        if not attachment:
            print("⚠️ No attachment found; treating S3 object as direct file")
            attachment = wrap_raw_object_as_attachment(raw_email, key, email_obj.get('ContentType'))

        print(f"📎 Attachment detected: {attachment['filename']} ({attachment['media_type']})")

        print("📤 Uploading debug copy to S3 for verification...")
        debug_key = upload_debug_attachment(bucket, attachment)

        # 4. Call Textract + Bedrock depending on media type
        print("🤖 Calling Bedrock Claude 3.5 Sonnet...")
        invoice_data, processing_overrides = process_attachment(attachment, bucket, debug_key)

        print(f"✅ Claude completed - Invoice: {invoice_data.get('numeroFactura')}")

        # 5. Validate invoice with SUNAT API
        print("🔍 Validating invoice with SUNAT...")
        sunat_validation = validate_invoice_with_sunat(invoice_data)

        print(f"✅ SUNAT validation: {sunat_validation['estado']}")

        # 6. Build DynamoDB item (including SUNAT validation)
        dynamo_item = build_item(
            client_id,
            invoice_data,
            bucket,
            key,
            file_size,
            sunat_validation,
            processing_overrides
        )
        
        # 6. Save to DynamoDB
        print("💾 Saving to DynamoDB...")
        table.put_item(Item=dynamo_item)
        
        print(f"✅ SUCCESS - Invoice ID: {dynamo_item['invoiceId']}")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Invoice processed successfully',
                'invoiceId': dynamo_item['invoiceId'],
                'clientId': client_id,
                'total': safe_float(invoice_data.get('montos', {}).get('total', 0)),
                'numeroFactura': invoice_data.get('numeroFactura')
            })
        }
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e),
                'type': type(e).__name__
            })
        }


def get_sunat_token():
    """
    Obtiene token de autenticación de SUNAT API
    Usa cache para evitar solicitar token en cada invocación
    """
    global sunat_token_cache

    # Verificar si hay credenciales configuradas
    if not SUNAT_CLIENT_ID or not SUNAT_CLIENT_SECRET:
        print("⚠️ SUNAT credentials not configured, skipping validation")
        return None

    # Verificar si el token en cache sigue válido
    now = datetime.now().timestamp()
    if sunat_token_cache['token'] and sunat_token_cache['expires_at']:
        if now < sunat_token_cache['expires_at']:
            print("🔑 Using cached SUNAT token")
            return sunat_token_cache['token']

    # Solicitar nuevo token
    print("🔑 Requesting new SUNAT token...")

    try:
        url = f"https://api-seguridad.sunat.gob.pe/v1/clientesextranet/{SUNAT_CLIENT_ID}/oauth2/token/"

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        body = urllib3.request.urlencode({
            'grant_type': 'client_credentials',
            'scope': 'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes',
            'client_id': SUNAT_CLIENT_ID,
            'client_secret': SUNAT_CLIENT_SECRET
        })

        response = http.request(
            'POST',
            url,
            headers=headers,
            body=body
        )

        if response.status == 200:
            data = json.loads(response.data.decode('utf-8'))
            token = data.get('access_token')
            expires_in = data.get('expires_in', 3600)  # Default 1 hora

            # Guardar en cache (restar 60 segundos para evitar usar token expirado)
            sunat_token_cache['token'] = token
            sunat_token_cache['expires_at'] = now + expires_in - 60

            print(f"✅ SUNAT token obtained (expires in {expires_in}s)")
            return token
        else:
            print(f"❌ Failed to get SUNAT token: {response.status}")
            print(f"Response: {response.data.decode('utf-8')}")
            return None

    except Exception as e:
        print(f"❌ Error getting SUNAT token: {str(e)}")
        return None


def validate_invoice_with_sunat(invoice_data):
    """
    Valida la factura contra la API de SUNAT
    Retorna el estado de validación y detalles
    """

    # Verificar si hay RUC consultante configurado
    if not SUNAT_RUC:
        print("⚠️ SUNAT_RUC not configured, skipping SUNAT validation")
        return {
            'validado': False,
            'estado': 'NO_VALIDADO',
            'motivo': 'Credenciales SUNAT no configuradas',
            'estadoSunat': None,
            'timestampValidacion': datetime.now().isoformat() + 'Z'
        }

    # Obtener token
    token = get_sunat_token()
    if not token:
        return {
            'validado': False,
            'estado': 'ERROR_TOKEN',
            'motivo': 'No se pudo obtener token de SUNAT',
            'estadoSunat': None,
            'timestampValidacion': datetime.now().isoformat() + 'Z'
        }

    # Extraer datos necesarios de la factura
    try:
        ruc_emisor = invoice_data.get('emisor', {}).get('numeroDocumento')
        numero_factura = invoice_data.get('numeroFactura', '')
        serie = invoice_data.get('serie', '')
        correlativo = invoice_data.get('correlativo', '')
        fecha_emision = invoice_data.get('fechaEmision', '')
        monto_total = invoice_data.get('montos', {}).get('total', 0)

        # Determinar código de tipo de comprobante según SUNAT
        tipo_comprobante = normalize_tipo_comprobante(invoice_data.get('tipoComprobante'), serie, numero_factura)
        invoice_data['tipoComprobante'] = tipo_comprobante

        if tipo_comprobante == 'RECIBO_HONORARIOS':
            return validate_rhe_with_sunat(
                token,
                invoice_data,
                ESTADOS_COMPROBANTE,
                ESTADOS_RUC,
                CONDICIONES_DOMICILIO
            )

        codigo_comprobante = {
            'FACTURA': '01',
            'BOLETA': '03',
            'NOTA_CREDITO': '07',
            'NOTA_DEBITO': '08'
        }.get(tipo_comprobante)

        if not codigo_comprobante:
            return {
                'validado': False,
                'estado': 'NO_VALIDADO',
                'motivo': f'Tipo de comprobante no soportado por SUNAT: {tipo_comprobante}',
                'estadoSunat': None,
                'timestampValidacion': datetime.now().isoformat() + 'Z'
            }

        if numero_factura and (not serie or not correlativo):
            parsed = parse_serie_correlativo(numero_factura)
            if parsed:
                serie = serie or parsed[0]
                correlativo = correlativo or parsed[1]

        if not ruc_emisor or not numero_factura:
            print("⚠️ Missing required data for SUNAT validation")
            return {
                'validado': False,
                'estado': 'DATOS_INCOMPLETOS',
                'motivo': 'Faltan datos requeridos (RUC o número de factura)',
                'estadoSunat': None,
                'timestampValidacion': datetime.now().isoformat() + 'Z'
            }

        print(f"🔍 Validating invoice with SUNAT: {ruc_emisor}-{numero_factura}")

        # Construir URL del endpoint
        url = f"https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/{SUNAT_RUC}/validarcomprobante"

        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

        # Convertir fecha de YYYY-MM-DD a DD/MM/YYYY
        if fecha_emision and '-' in fecha_emision:
            parts = fecha_emision.split('-')
            if len(parts) == 3:
                fecha_sunat = f"{parts[2]}/{parts[1]}/{parts[0]}"
            else:
                fecha_sunat = fecha_emision
        else:
            fecha_sunat = fecha_emision

        # Cuerpo de la solicitud según documentación SUNAT
        try:
            numero_int = int(correlativo) if correlativo else 0
        except ValueError:
            numero_int = 0

        body = json.dumps({
            'numRuc': ruc_emisor,
            'codComp': codigo_comprobante,
            'numeroSerie': serie,
            'numero': numero_int,  # numero debe ser int
            'fechaEmision': fecha_sunat,  # Formato DD/MM/YYYY
            'monto': float(monto_total) if monto_total is not None else 0
        })

        response = http.request(
            'POST',
            url,
            headers=headers,
            body=body
        )

        if response.status == 200:
            data = json.loads(response.data.decode('utf-8'))

            # Interpretar respuesta de SUNAT
            estado_cp = data.get('estadoCp')  # Estado del comprobante
            estado_ruc = data.get('estadoRuc')  # Estado del RUC emisor
            condicion_domicilio = data.get('condDomiRuc')  # Condición domicilio

            # Determinar si es válido
            es_valido = (
                estado_cp in ['1', '0'] and  # 1=Aceptado, 0=Anulado (pero existió)
                estado_ruc == '00'  # 00=Activo
            )

            print(f"✅ SUNAT validation completed: {estado_cp}")

            return {
                'validado': True,
                'estado': 'VALIDO' if es_valido else 'INVALIDO',
                'motivo': 'Comprobante validado exitosamente' if es_valido else 'Comprobante no válido en SUNAT',
                'estadoSunat': {
                    'estadoComprobante': estado_cp,
                    'estadoRuc': estado_ruc,
                    'condicionDomicilio': condicion_domicilio,
                    'observaciones': data.get('observaciones', [])
                },
                'timestampValidacion': datetime.now().isoformat() + 'Z'
            }
        else:
            error_msg = response.data.decode('utf-8')
            print(f"❌ SUNAT validation failed: {response.status}")
            print(f"Response: {error_msg}")

            return {
                'validado': False,
                'estado': 'ERROR_API',
                'motivo': f'Error al consultar SUNAT: HTTP {response.status}',
                'estadoSunat': None,
                'timestampValidacion': datetime.now().isoformat() + 'Z',
                'errorDetalle': error_msg
            }

    except Exception as e:
        print(f"❌ Error validating with SUNAT: {str(e)}")
        import traceback
        traceback.print_exc()

        return {
            'validado': False,
            'estado': 'ERROR_EXCEPCION',
            'motivo': f'Excepción al validar: {str(e)}',
            'estadoSunat': None,
            'timestampValidacion': datetime.now().isoformat() + 'Z'
        }


def normalize_media_type(content_type, filename):
    """
    Normaliza el tipo MIME usando el filename si el content_type es genérico.
    """
    content_type = (content_type or '').split(';', 1)[0].strip().lower()
    extension = os.path.splitext(filename or '')[1].lower()

    if content_type in ALLOWED_PDF_MIME_TYPES | ALLOWED_IMAGE_MIME_TYPES:
        return content_type
    if extension in ALLOWED_IMAGE_EXTENSIONS:
        return 'image/jpeg' if extension in {'.jpg', '.jpeg'} else 'image/png'
    if extension == '.pdf':
        return 'application/pdf'
    return content_type


def detect_media_type_by_signature(raw_bytes):
    if not raw_bytes:
        return None
    if raw_bytes.startswith(b'%PDF'):
        return 'application/pdf'
    if raw_bytes.startswith(b'\xff\xd8\xff'):
        return 'image/jpeg'
    if raw_bytes.startswith(b'\x89PNG\r\n\x1a\n'):
        return 'image/png'
    return None


def normalize_tipo_comprobante(tipo_raw, serie='', numero_factura=''):
    raw = (tipo_raw or '').strip().upper()
    raw = (raw.replace('Á', 'A')
              .replace('É', 'E')
              .replace('Í', 'I')
              .replace('Ó', 'O')
              .replace('Ú', 'U')
              .replace('Ñ', 'N'))

    if 'CREDITO' in raw or raw in {'NC', 'NOTA_CREDITO', 'NOTA DE CREDITO'}:
        return 'NOTA_CREDITO'
    if 'DEBITO' in raw or raw in {'ND', 'NOTA_DEBITO', 'NOTA DE DEBITO'}:
        return 'NOTA_DEBITO'
    if 'BOLETA' in raw:
        return 'BOLETA'
    if 'FACTURA' in raw:
        return 'FACTURA'
    if 'HONORARIO' in raw:
        return 'RECIBO_HONORARIOS'

    candidate = (serie or '').strip().upper()
    if not candidate and numero_factura and '-' in numero_factura:
        candidate = numero_factura.split('-', 1)[0].strip().upper()

    if candidate.startswith(('FC', 'BC')):
        return 'NOTA_CREDITO'
    if candidate.startswith(('FD', 'BD')):
        return 'NOTA_DEBITO'
    if candidate.startswith('F'):
        return 'FACTURA'
    if candidate.startswith('B'):
        return 'BOLETA'

    return raw or 'OTRO'


def parse_serie_correlativo(numero_factura):
    if not numero_factura:
        return None
    numero = str(numero_factura).strip().upper()
    if '-' not in numero:
        return None
    serie, correlativo = numero.split('-', 1)
    serie = serie.strip()
    correlativo = correlativo.strip()
    if not serie or not correlativo:
        return None
    return serie, correlativo


def normalize_tipo_documento(tipo_raw):
    raw = (tipo_raw or '').strip().upper()
    raw = (raw.replace('Á', 'A')
              .replace('É', 'E')
              .replace('Í', 'I')
              .replace('Ó', 'O')
              .replace('Ú', 'U')
              .replace('Ñ', 'N'))

    if raw in {'DNI', '01', '1'}:
        return '1'
    if raw in {'RUC', '06', '6'}:
        return '6'
    if raw in {'CE', 'CARNET DE EXTRANJERIA', 'CARNET DE EXTRANJERIA', '04', '4'}:
        return '4'
    if raw in {'PASAPORTE', '07', '7'}:
        return '7'
    if raw in {'PTP', '09', '9'}:
        return '9'
    return None


def validate_rhe_with_sunat(token, invoice_data, estado_cp_descriptions, estado_ruc_descriptions, condicion_domicilio_descriptions):
    ruc_emisor = invoice_data.get('emisor', {}).get('numeroDocumento')
    numero_factura = invoice_data.get('numeroFactura', '')
    serie = invoice_data.get('serie', '')
    correlativo = invoice_data.get('correlativo', '')
    fecha_emision = invoice_data.get('fechaEmision', '')
    monto_total = invoice_data.get('montos', {}).get('total', 0)
    receptor = invoice_data.get('receptor', {}) or {}
    receptor_tipo = normalize_tipo_documento(receptor.get('tipoDocumento'))
    receptor_num = receptor.get('numeroDocumento')

    if numero_factura and (not serie or not correlativo):
        parsed = parse_serie_correlativo(numero_factura)
        if parsed:
            serie = serie or parsed[0]
            correlativo = correlativo or parsed[1]

    if not ruc_emisor or not numero_factura or not receptor_tipo or not receptor_num:
        print("⚠️ Missing required data for RHE SUNAT validation")
        return {
            'validado': False,
            'estado': 'DATOS_INCOMPLETOS',
            'motivo': 'Faltan datos requeridos (RUC emisor, tipo/num doc receptor o número)',
            'estadoSunat': None,
            'timestampValidacion': datetime.now().isoformat() + 'Z'
        }

    # Convertir fecha de YYYY-MM-DD a DD/MM/YYYY
    if fecha_emision and '-' in fecha_emision:
        parts = fecha_emision.split('-')
        if len(parts) == 3:
            fecha_sunat = f"{parts[2]}/{parts[1]}/{parts[0]}"
        else:
            fecha_sunat = fecha_emision
    else:
        fecha_sunat = fecha_emision

    try:
        numero_int = int(correlativo) if correlativo else 0
    except ValueError:
        numero_int = 0

    url = f"https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/{SUNAT_RUC}/validarreciboporhonorario"
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    body = json.dumps({
        'numRuc': ruc_emisor,
        'codTipDoc': receptor_tipo,
        'numDoc': receptor_num,
        'numSerie': serie,
        'numRec': numero_int,
        'fechaEmision': fecha_sunat,
        'monto': float(monto_total)
    })

    response = http.request('POST', url, headers=headers, body=body)

    if response.status == 200:
        data = json.loads(response.data.decode('utf-8'))
        if data.get('success') is False:
            return {
                'validado': False,
                'estado': 'ERROR_API',
                'motivo': data.get('message', 'Error desconocido de SUNAT'),
                'estadoSunat': None,
                'timestampValidacion': datetime.now().isoformat() + 'Z',
                'errorDetalle': json.dumps(data)
            }

        response_data = data.get('data', data)
        estado_cp = str(response_data.get('estadoCp', ''))
        estado_ruc = str(response_data.get('estadoRuc', ''))
        cond_dom = str(response_data.get('condDomicilio', ''))

        desc_comprobante = estado_cp_descriptions.get(estado_cp, 'DESCONOCIDO')
        desc_ruc = estado_ruc_descriptions.get(estado_ruc, 'DESCONOCIDO')

        es_valido = estado_cp in {'1', '0'} and estado_ruc == '00'

        return {
            'validado': es_valido,
            'estado': 'VALIDO' if es_valido else 'NO_VALIDO',
            'motivo': 'Comprobante validado exitosamente' if es_valido else 'Comprobante no válido en SUNAT',
            'timestampValidacion': datetime.now().isoformat() + 'Z',
            'esValido': es_valido,
            'estadoSunat': {
                'estadoComprobante': {
                    'codigo': estado_cp,
                    'descripcion': desc_comprobante
                },
                'estadoRuc': {
                    'codigo': estado_ruc,
                    'descripcion': desc_ruc
                },
                'condicionDomicilio': {
                    'codigo': cond_dom,
                    'descripcion': condicion_domicilio_descriptions.get(cond_dom, 'DESCONOCIDO')
                },
                'observaciones': response_data.get('observaciones', [])
            }
        }

    print(f"❌ SUNAT RHE validation failed: {response.status}")
    return {
        'validado': False,
        'estado': 'ERROR_API',
        'motivo': f'Error al consultar SUNAT (RHE): HTTP {response.status}',
        'estadoSunat': None,
        'timestampValidacion': datetime.now().isoformat() + 'Z'
    }


def wrap_raw_object_as_attachment(raw_bytes, key, content_type=None):
    """
    Trata el objeto S3 como un archivo directo (no email) y lo envuelve como adjunto.
    """
    filename = os.path.basename(key) or 'archivo'
    media_type = normalize_media_type(content_type or '', filename)

    signature_type = detect_media_type_by_signature(raw_bytes)
    if signature_type:
        media_type = signature_type

    if media_type not in ALLOWED_PDF_MIME_TYPES | ALLOWED_IMAGE_MIME_TYPES:
        raise ValueError(f"Tipo de archivo no soportado para {filename}")

    return {
        'bytes': raw_bytes,
        'media_type': media_type,
        'filename': filename
    }


def extract_attachment_from_email(raw_email_bytes, key):
    """
    Busca el primer adjunto PDF o imagen dentro del correo SES y retorna metadata + bytes.
    """
    parser = BytesParser(policy=policy.default)
    msg = parser.parsebytes(raw_email_bytes)

    candidates = []
    for part in msg.walk():
        if part.get_content_maintype() == 'multipart':
            continue

        content_type = part.get_content_type()
        filename = part.get_filename('')
        disposition = part.get_content_disposition()

        if not filename and disposition not in {'attachment', 'inline'}:
            continue

        payload = part.get_content()
        if isinstance(payload, str):
            payload = payload.encode('utf-8')

        normalized_type = normalize_media_type(content_type, filename)
        signature_type = detect_media_type_by_signature(payload)
        if signature_type:
            normalized_type = signature_type
        if normalized_type not in ALLOWED_PDF_MIME_TYPES | ALLOWED_IMAGE_MIME_TYPES:
            continue

        if not filename:
            filename = f"attachment{MEDIA_TYPE_EXTENSION.get(normalized_type, '')}"

        candidates.append({
            'bytes': payload,
            'media_type': normalized_type,
            'filename': filename
        })

    if not candidates:
        return None

    for candidate in candidates:
        if candidate['media_type'] == 'application/pdf':
            print(f"📎 PDF encontrado en el correo ({len(candidates)} candidato(s)); usando el primero.")
            return candidate

    print(f"🖼️ Imagen encontrada en el correo ({len(candidates)} candidato(s)); usando la primera.")
    return candidates[0]


def upload_debug_attachment(bucket, attachment):
    """
    Guarda una copia de depuración del adjunto extraído en la carpeta debug.
    """
    filename = attachment.get('filename') or f"attachment{MEDIA_TYPE_EXTENSION.get(attachment['media_type'], '')}"
    safe_filename = filename.replace('/', '_')
    timestamp = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    debug_key = f"debug/{timestamp}-{safe_filename}"
    tmp_path = f"/tmp/{timestamp}-{safe_filename}"

    with open(tmp_path, 'wb') as tmp_file:
        tmp_file.write(attachment['bytes'])

    try:
        s3_client.upload_file(tmp_path, bucket, debug_key)
        print(f"📤 Copia de depuración subida a s3://{bucket}/{debug_key}")
    except ClientError as err:
        print(f"⚠️ No se pudo subir la copia de depuración: {str(err)}")

    return debug_key


def extract_raw_text_from_textract(textract_response):
    """
    Extrae texto plano de Textract para reducir tokens.
    """
    text = []
    for doc in textract_response.get('ExpenseDocuments', []):
        for block in doc.get('Blocks', []):
            if block.get('BlockType') == 'LINE':
                text.append(block.get('Text', ''))
    return "\n".join(line for line in text if line)


def is_low_text_coverage(text, min_chars=200, min_lines=10):
    """
    Heurística simple para identificar PDFs escaneados.
    """
    if not text:
        return True
    lines = [line for line in text.splitlines() if line.strip()]
    return len(text.strip()) < min_chars or len(lines) < min_lines


def process_attachment(attachment, bucket, debug_key):
    """
    Decide el pipeline: PDF con Textract+Bedrock o imagen con Bedrock.
    """
    media_type = attachment['media_type']
    processing_overrides = {}

    if media_type == 'application/pdf':
        print("🔍 Running Textract AnalyzeExpense for PDF...")
        textract_text = ""
        textract_error = None
        try:
            textract_response = textract_client.analyze_expense(
                Document={
                    'S3Object': {
                        'Bucket': bucket,
                        'Name': debug_key
                    }
                }
            )
            textract_text = extract_raw_text_from_textract(textract_response)
            print(f"🧾 Textract text length: {len(textract_text)} chars")
        except ClientError as err:
            textract_error = str(err)
            print(f"⚠️ Textract AnalyzeExpense failed: {textract_error}")
        except Exception as err:
            textract_error = str(err)
            print(f"⚠️ Textract AnalyzeExpense error: {textract_error}")

        if textract_error:
            extra_context = (
                "NOTA: Textract falló al procesar este PDF. "
                "Haz un esfuerzo adicional para leer el documento; si no es legible, usa null "
                "y agrega un warning en validaciones.warnings."
            )
            invoice_data = analyze_invoice_with_bedrock_document(
                attachment['bytes'],
                media_type,
                extra_context=extra_context,
                max_tokens=8000
            )
            processing_overrides = {
                'motor': 'bedrock-claude-image',
                'ruta': 'pdf-textract-error',
                'textractError': textract_error[:200]
            }
        elif is_low_text_coverage(textract_text):
            print("🖼️ PDF parece escaneado; usando Bedrock con documento completo.")
            extra_context = (
                "NOTA: La factura proviene de un escaneo/imagen dentro de un PDF. "
                "Haz un esfuerzo adicional para leer texto borroso; si no es legible, usa null "
                "y agrega un warning en validaciones.warnings."
            )
            invoice_data = analyze_invoice_with_bedrock_document(
                attachment['bytes'],
                media_type,
                extra_context=extra_context,
                max_tokens=8000
            )
            processing_overrides = {
                'motor': 'bedrock-claude-image',
                'ruta': 'pdf-imagen'
            }
        else:
            extra_context = (
                "TEXTO OCR (puede tener errores):\n"
                f"{textract_text}\n\n"
                "Usa el texto OCR como fuente principal y corrige errores evidentes."
            )
            invoice_data = analyze_invoice_with_bedrock_text(
                extra_context,
                max_tokens=4000
            )
            processing_overrides = {
                'motor': 'bedrock-claude+textract',
                'ruta': 'pdf-textract-texto',
                'textractChars': len(textract_text)
            }
    elif media_type in ALLOWED_IMAGE_MIME_TYPES:
        extra_context = (
            "NOTA: La factura es una foto/imagen. Haz un esfuerzo adicional para leer texto borroso; "
            "si no es legible, usa null y agrega un warning en validaciones.warnings."
        )
        invoice_data = analyze_invoice_with_bedrock_document(
            attachment['bytes'],
            media_type,
            extra_context=extra_context,
            max_tokens=8000
        )
        processing_overrides = {
            'motor': 'bedrock-claude-image',
            'ruta': 'imagen'
        }
    else:
        raise ValueError(f"Tipo de archivo no soportado: {media_type}")

    return invoice_data, processing_overrides


def invoke_bedrock(request_body):
    """
    Ejecuta la llamada a Bedrock con retries y parsea el JSON resultante.
    """
    # Reintentos con backoff exponencial para manejar throttling
    max_retries = 5
    base_delay = 2  # segundos

    for attempt in range(max_retries):
        try:
            if attempt > 0:
                print(f"🔄 Retry {attempt}/{max_retries} - Invoking Bedrock model: {MODEL_ID}")
            else:
                print(f"🔄 Invoking Bedrock model: {MODEL_ID}")

            response = bedrock_runtime.invoke_model(
                modelId=MODEL_ID,
                body=json.dumps(request_body)
            )
            break
        except ClientError as e:
            error_code = e.response['Error']['Code']

            if error_code == 'ThrottlingException':
                if attempt < max_retries - 1:
                    delay = base_delay * (2 ** attempt)
                    print(f"⚠️ Throttling detected. Waiting {delay}s before retry...")
                    time.sleep(delay)
                    continue
                print("❌ Max retries reached after throttling")
                raise
            raise

    try:
        response_body = json.loads(response['body'].read())

        content = response_body.get('content', [])
        if not content:
            raise ValueError("Empty response from Bedrock")

        response_text = content[0].get('text', '')

        print(f"📝 Claude response length: {len(response_text)} chars")

        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1

        if json_start == -1 or json_end == 0:
            print(f"⚠️ Response text: {response_text[:500]}")
            raise ValueError("No JSON found in Claude response")

        invoice_json = response_text[json_start:json_end]
        invoice_data = json.loads(invoice_json)

        print("✅ Successfully parsed invoice data")
        print(f"📊 Items extracted: {len(invoice_data.get('items', []))}")
        print(f"💰 Total: {invoice_data.get('montos', {}).get('total', 0)}")

        validations = invoice_data.get('validaciones', {})
        if validations.get('warnings'):
            print(f"⚠️ Warnings: {validations['warnings']}")
        if validations.get('errores'):
            print(f"❌ Errors: {validations['errores']}")

        return invoice_data

    except json.JSONDecodeError as e:
        print(f"❌ JSON parse error: {str(e)}")
        print(f"Response text: {response_text[:1000]}")
        raise ValueError(f"Invalid JSON from Claude: {str(e)}")

    except Exception as e:
        print(f"❌ Bedrock invocation error: {str(e)}")
        raise


def get_expert_prompt():
    """
    Prompt base para extracción de comprobantes peruanos.
    """
    return """Eres un Contador Público Colegiado peruano con 15 años de experiencia en auditoría tributaria y comprobantes electrónicos. 

Eres experto en:
- Normativa SUNAT y sistema de comprobantes de pago electrónicos (CPE)
- Ley del IGV (Decreto Legislativo N° 821)
- Reglamento de Comprobantes de Pago (Resolución de Superintendencia N° 007-99/SUNAT)
- Validación de documentos tributarios según estándares peruanos

Tu tarea es analizar este comprobante electrónico peruano con máxima precisión y extraer TODOS los datos en formato JSON estructurado.

ESTRUCTURA JSON REQUERIDA (retorna SOLO este JSON, sin texto adicional):

{
  "numeroFactura": "F006-0171739",
  "serie": "F006",
  "correlativo": "0171739",
  "tipoComprobante": "FACTURA",
  "fechaEmision": "2025-09-22",
  "horaEmision": "10:30:00",
  
  "emisor": {
    "tipoDocumento": "RUC",
    "numeroDocumento": "20517482472",
    "razonSocial": "CORPORACION LIDER PERU S.A.",
    "nombreComercial": null,
    "direccion": "Calle Leoncio Prado 446 - SURQUILLO - LIMA",
    "ubigeo": null,
    "departamento": "LIMA",
    "provincia": "LIMA",
    "distrito": "SURQUILLO",
    "telefono": "924956748",
    "email": "ventas@corporacionliderperu.com",
    "web": "www.corporacionliderperu.com"
  },
  
  "receptor": {
    "tipoDocumento": "RUC",
    "numeroDocumento": "20604163642",
    "razonSocial": "EL HELADERO S.A.C.",
    "direccion": "AV. MARISCAL ELOY URETA 185 URB. EL PINO",
    "departamento": "LIMA",
    "provincia": "LIMA",
    "distrito": "SAN LUIS"
  },
  
  "montos": {
    "moneda": "PEN",
    "tipoMoneda": "SOLES",
    "subtotal": 1305.17,
    "descuentoGlobal": 0.00,
    "baseImponible": 1305.17,
    "igv": 234.93,
    "igvPorcentaje": 18.00,
    "isc": 0.00,
    "icbper": 0.00,
    "otrosTributos": 0.00,
    "percepcion": 0.96,
    "percepcionPorcentaje": 2.00,
    "retencion": 0.00,
    "detraccion": 0.00,
    "opGravadas": 1305.17,
    "opExoneradas": 0.00,
    "opInafectas": 0.00,
    "opGratuitas": 0.00,
    "anticipos": 0.00,
    "redondeo": 0.00,
    "total": 1540.10,
    "montoTotal": 1541.06,
    "totalLetras": "MIL QUINIENTOS CUARENTA Y 10/100 SOLES"
  },
  
  "items": [
    {
      "linea": 1,
      "codigo": "BEB0094",
      "codigoSunat": null,
      "cantidad": 6.000,
      "unidadMedida": "UNI",
      "descripcion": "CIELO AGUA MINERAL X 7 LT SIN GAS",
      "valorUnitario": 6.78,
      "precioUnitario": 8.00,
      "descuento": 0.00,
      "valorVenta": 40.68,
      "igv": 7.32,
      "icbper": 0.00,
      "total": 48.00,
      "tipoAfectacion": "GRAVADO"
    }
  ],
  
  "condiciones": {
    "formaPago": "CONTADO",
    "medioPago": "TRANSFERENCIA",
    "plazoCredito": null,
    "cuotas": null,
    "vendedor": "CHRISTIAN",
    "numeroPedido": "0006-2849",
    "ordenCompra": null,
    "guiaRemision": null,
    "observaciones": "NO ACEPTAMOS DEVOLUCIONES NI CAMBIOS DESPUES DE 48 HORAS"
  },
  
  "datosBancarios": [
    {
      "banco": "BCP",
      "tipoCuenta": "CORRIENTE",
      "moneda": "PEN",
      "numeroCuenta": "194-2522444-0-31",
      "cci": "002-19400252244403190",
      "titular": "CORPORACION LIDER PERU SA"
    },
    {
      "banco": "SCOTIABANK",
      "tipoCuenta": "CORRIENTE",
      "moneda": "PEN",
      "numeroCuenta": "000-6309240",
      "cci": "009-29000006309240-57",
      "titular": "CORPORACION LIDER PERU SA"
    }
  ],
  
  "sunat": {
    "codigoHash": null,
    "firmaDigital": null,
    "qr": null,
    "urlConsulta": "https://cpe.facilerp.com/comprobantes/consultar/20517482472",
    "sistemaEmision": "FACILERP",
    "autorizacionSunat": "034-005-007244/SUNAT",
    "agenteRetencion": true,
    "resolucionAgenteRetencion": "R.S.186-2023",
    "tipoOperacion": "VENTA_INTERNA",
    "leyendas": [
      "Operación Sujeta al 2.00% de Percepción del IGV"
    ]
  },
  
  "validaciones": {
    "rucEmisorValido": true,
    "rucReceptorValido": true,
    "formatoNumeroFacturaValido": true,
    "fechaValida": true,
    "igvCalculoCorrecto": true,
    "totalCalculoCorrecto": true,
    "serieValida": true,
    "todosItemsTienenCodigo": true,
    "warnings": [],
    "errores": []
  }
}

INSTRUCCIONES CRÍTICAS:

1. VALIDACIONES MATEMÁTICAS:
   - IGV debe ser exactamente subtotal * 0.18 (tolerancia ±0.50 por redondeo)
   - Total debe ser: subtotal + IGV + ICBPER + percepción - descuentos
   - Suma de items debe coincidir con subtotal
   - Si hay diferencias, reportar en validaciones.warnings

2. FORMATO DE DATOS:
   - RUC: exactamente 11 dígitos numéricos
   - Números SIN comillas: usar float o int
   - Fechas: formato YYYY-MM-DD
   - Hora: formato HH:MM:SS (si no existe, usar null)
   - Montos: máximo 2 decimales
   - Si un campo no existe: usar null (NO string vacío)

3. TIPO DE COMPROBANTE (CRÍTICO):
   - Debe ser UNO de: FACTURA, BOLETA, NOTA_CREDITO, NOTA_DEBITO, RECIBO_HONORARIOS, OTRO
   - Si el documento dice "NOTA DE CRÉDITO" -> NOTA_CREDITO
   - Si el documento dice "NOTA DE DÉBITO" -> NOTA_DEBITO
   - Si el documento dice "RECIBO POR HONORARIOS" -> RECIBO_HONORARIOS
   - Si no se puede determinar con certeza -> OTRO

4. EXTRACCIÓN DE ITEMS:
   - Extraer TODOS los productos/servicios listados
   - Incluir códigos de producto si existen
   - Calcular valor unitario sin IGV si solo aparece precio con IGV
   - Identificar tipo de afectación (GRAVADO/EXONERADO/INAFECTO/GRATUITO)

5. DATOS BANCARIOS:
   - Extraer TODAS las cuentas bancarias mencionadas
   - Identificar tipo de cuenta (CORRIENTE/AHORRO/DETRACCION)
   - Incluir CCI si está disponible

6. VALIDACIONES SUNAT:
   - Verificar que RUC tenga 11 dígitos
   - Verificar formato de serie (1-2 letras + 2-3 dígitos, ej: F001, B001, FC01, BC01, FD01, BD01)
   - Validar que correlativo sea numérico
   - Identificar si es agente de retención/percepción

7. PLAZO DE CRÉDITO Y FECHA DE VENCIMIENTO (CRÍTICO):
   - plazoCredito: DEBE ser un NÚMERO ENTERO (días), NO texto como "30 dias" o "15 días"
   - fechaVencimiento: DEBE ser formato YYYY-MM-DD
   - LÓGICA A SEGUIR:
     * Si encuentras AMBOS (plazo y fecha): extraer ambos como están
     * Si solo encuentras plazo (ej: "crédito 30 días"): extraer SOLO el número (30) en plazoCredito, fechaVencimiento = null
     * Si solo encuentras fecha de vencimiento: extraerla en fechaVencimiento, plazoCredito = null
     * Si es CONTADO: plazoCredito = null, fechaVencimiento = null
   - EJEMPLOS:
     * "Crédito 30 días" → plazoCredito: 30, fechaVencimiento: null
     * "Vencimiento: 2025-10-30" → plazoCredito: null, fechaVencimiento: "2025-10-30"
     * "Contado" → plazoCredito: null, fechaVencimiento: null
     * "15 dias" → plazoCredito: 15, fechaVencimiento: null
   - NUNCA pongas texto en plazoCredito, SOLO números enteros o null

8. WARNINGS Y ERRORES:
   - En validaciones.warnings: inconsistencias menores (ej: IGV difiere por redondeo)
   - En validaciones.errores: problemas graves (ej: RUC inválido, total no cuadra)

9. RESPUESTA:
   - Retornar ÚNICAMENTE el JSON
   - NO agregar texto explicativo antes o después
   - NO usar markdown (```json)
   - JSON válido y bien formateado

Analiza la factura con máximo rigor profesional y precisión contable.
"""


def analyze_invoice_with_bedrock_document(file_bytes, media_type, extra_context=None, max_tokens=8000):
    """
    Envía PDF o imagen a Claude via Bedrock y obtiene JSON estructurado.
    """
    expert_prompt = get_expert_prompt()

    context_prefix = f"{extra_context}\n\n" if extra_context else ""
    full_prompt = f"{context_prefix}{expert_prompt}"
    media_type = (media_type or '').split(';', 1)[0].strip().lower()
    if media_type in ALLOWED_IMAGE_MIME_TYPES:
        content_type = "image"
    elif media_type in ALLOWED_PDF_MIME_TYPES:
        content_type = "document"
    else:
        raise ValueError(f"Tipo de archivo no soportado: {media_type}")

    # Construir request para Bedrock
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": max_tokens,
        "temperature": 0.1,  # Baja temperatura para mayor precisión
        "top_p": 0.9,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": content_type,
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": base64.standard_b64encode(file_bytes).decode('utf-8')
                        }
                    },
                    {
                        "type": "text",
                        "text": full_prompt
                    }
                ]
            }
        ]
    }
    return invoke_bedrock(request_body)


def analyze_invoice_with_bedrock_text(context_text, max_tokens=4000):
    """
    Envía solo texto OCR a Claude para reducir tokens.
    """
    context_prefix = f"{context_text}\n\n" if context_text else ""
    expert_prompt = get_expert_prompt()
    full_prompt = f"{context_prefix}{expert_prompt}"

    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": max_tokens,
        "temperature": 0.1,
        "top_p": 0.9,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": full_prompt
                    }
                ]
            }
        ]
    }

    return invoke_bedrock(request_body)


def build_item(client_id, invoice_data, bucket, key, file_size, sunat_validation=None, processing_overrides=None):
    """
    Build DynamoDB item from Claude's structured response
    Includes SUNAT validation data if provided
    """
    
    # Generate invoice ID
    ruc = invoice_data.get('emisor', {}).get('numeroDocumento') or 'UNKNOWN'
    numero = invoice_data.get('numeroFactura') or 'UNKNOWN'
    invoice_id = f"{ruc}-{numero}"
    
    # Get date
    fecha = invoice_data.get('fechaEmision', datetime.now().strftime('%Y-%m-%d'))
    
    # Convert all floats to Decimal for DynamoDB
    def convert_to_decimal(obj):
        """Recursively convert floats to Decimal for DynamoDB"""
        if isinstance(obj, dict):
            return {k: convert_to_decimal(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_to_decimal(i) for i in obj]
        elif isinstance(obj, float):
            return Decimal(str(obj))
        return obj

    def safe_decimal(value, default=Decimal("0")):
        """
        Normaliza valores a Decimal y evita errores cuando faltan montos
        """
        if value is None:
            return default
        if isinstance(value, Decimal):
            return value
        try:
            return Decimal(str(value))
        except (InvalidOperation, ValueError, TypeError) as exc:
            print(f"⚠️ Decimal conversion fallback for {value}: {exc}")
            return default

    invoice_data_decimal = convert_to_decimal(invoice_data)

    montos = invoice_data.get('montos', {})
    total_value = safe_decimal(montos.get('total'))
    
    # Build DynamoDB item
    item = {
        # Primary keys
        'PK': f'CLIENT#{client_id}',
        'SK': f'INVOICE#{fecha}#{invoice_id}',
        
        # Identifiers
        'clientId': client_id,
        'tenantId': client_id,
        'invoiceId': invoice_id,
        'numeroFactura': invoice_data.get('numeroFactura'),
        'tipoComprobante': invoice_data.get('tipoComprobante', 'FACTURA'),
        
        # Flat fields for queries
        'fechaEmision': fecha,
        'emisorRUC': ruc,
        'emisorRazonSocial': invoice_data.get('emisor', {}).get('razonSocial'),
        'receptorRUC': invoice_data.get('receptor', {}).get('numeroDocumento'),
        'receptorRazonSocial': invoice_data.get('receptor', {}).get('razonSocial'),
        'total': total_value,
        'moneda': invoice_data.get('montos', {}).get('moneda', 'PEN'),
        
        # Complete structured data from Claude (with Decimals)
        'data': invoice_data_decimal,
        
        # S3 metadata
        'archivo': {
            's3Bucket': bucket,
            's3Key': key,
            's3Url': f's3://{bucket}/{key}',
            'nombreArchivo': key.split('/')[-1],
            'tamanoBytes': file_size
        },
        
        # Processing metadata
        'procesamiento': {
            'status': 'processed',
            'motor': 'bedrock-claude',
            'modelId': MODEL_ID,
            'modelName': 'Claude 3.5 Sonnet v2',
            'confidence': 'high',
            'timestampProcesado': datetime.utcnow().isoformat() + 'Z',
            'warnings': invoice_data.get('validaciones', {}).get('warnings', []),
            'errores': invoice_data.get('validaciones', {}).get('errores', [])
        },
        
        # Validations from Claude
        'validado': {
            'igvCorrecto': invoice_data.get('validaciones', {}).get('igvCalculoCorrecto', False),
            'totalCorrecto': invoice_data.get('validaciones', {}).get('totalCalculoCorrecto', False),
            'rucValido': invoice_data.get('validaciones', {}).get('rucEmisorValido', False),
            'requiereRevision': len(invoice_data.get('validaciones', {}).get('errores', [])) > 0
        },

        # SUNAT Validation (if performed)
        'validacionSunat': convert_to_decimal(sunat_validation) if sunat_validation else {
            'validado': False,
            'estado': 'NO_VALIDADO',
            'motivo': 'Validación SUNAT no ejecutada'
        },
        
        # GSI keys
        'GSI1PK': f'EMISOR#{ruc}',
        'GSI1SK': fecha,
        
        # Audit trail
        'audit': {
            'creadoEn': datetime.utcnow().isoformat() + 'Z',
            'creadoPor': 'bedrock-claude-processor',
            'versionDocumento': 1
        }
    }

    if processing_overrides:
        item['procesamiento'].update(processing_overrides)
    
    return item

def safe_decimal(value, default=0):
    """
    Convierte valores a Decimal de forma segura.
    """
    try:
        if value is None:
            return Decimal(str(default))
        return Decimal(str(value))
    except (InvalidOperation, ValueError, TypeError):
        return Decimal(str(default))


def safe_float(value, default=0.0):
    """
    Convierte valores a float de forma segura.
    """
    try:
        if value is None:
            return default
        return float(value)
    except (ValueError, TypeError):
        return default
