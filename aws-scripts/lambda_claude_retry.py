"""
Lambda Function: Invoice Processor con Retry Logic
Procesa facturas con manejo robusto de errores y reintentos exponenciales
Trigger: SQS Queue (invoice-processing-retry-poc)
"""

import json
import boto3
import base64
import time
import os
from datetime import datetime
from decimal import Decimal
from botocore.exceptions import ClientError

# AWS Clients
s3 = boto3.client('s3')
bedrock_runtime = boto3.client('bedrock-runtime', region_name='us-east-1')
dynamodb = boto3.resource('dynamodb')
sqs = boto3.client('sqs')

# Configuration
TABLE_NAME = 'Facturas-dev'
MODEL_ID = 'anthropic.claude-3-5-sonnet-20240620-v1:0'
MAX_RETRIES = 5
INITIAL_BACKOFF = 1  # segundos
BASE_PREFIX = os.environ.get('BASE_PREFIX', '').strip().strip('/')

# DynamoDB table
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    """
    Handler principal - procesa mensajes de SQS
    """
    print(f"📥 Received {len(event['Records'])} message(s)")

    for record in event['Records']:
        try:
            # Parsear mensaje SQS
            body = json.loads(record['body'])

            # Si viene de S3, extraer información del evento
            if 'Records' in body:
                s3_record = body['Records'][0]
                bucket = s3_record['s3']['bucket']['name']
                key = s3_record['s3']['object']['key']
            else:
                # Mensaje de reintento manual
                bucket = body['bucket']
                key = body['key']

            print(f"📄 Processing: s3://{bucket}/{key}")

            # Procesar factura con retry exponencial
            result = process_invoice_with_retry(bucket, key)

            if result['success']:
                print(f"✅ SUCCESS - Invoice ID: {result['invoice_id']}")
                # Mensaje procesado exitosamente - SQS lo eliminará automáticamente
            else:
                print(f"❌ FAILED after all retries: {result['error']}")
                # SQS automáticamente moverá a DLQ después de maxReceiveCount
                raise Exception(result['error'])

        except Exception as e:
            print(f"❌ ERROR processing message: {str(e)}")
            # Re-raise para que SQS reintente
            raise


def process_invoice_with_retry(bucket, key, max_retries=MAX_RETRIES):
    """
    Procesa factura con exponential backoff para manejar throttling
    """
    attempt = 0
    last_error = None

    while attempt < max_retries:
        try:
            attempt += 1
            print(f"🔄 Attempt {attempt}/{max_retries}")

            # 1. Descargar PDF de S3
            pdf_data = download_pdf_from_s3(bucket, key)

            if not pdf_data or len(pdf_data) == 0:
                return {
                    'success': False,
                    'error': 'PDF file is empty or corrupted',
                    'invoice_id': None
                }

            # 2. Procesar con Bedrock Claude (con retry en throttling)
            invoice_data = invoke_claude_with_backoff(pdf_data, attempt)

            # 3. Extraer client_id del path S3
            client_id = extract_client_id(key)

            # 4. Guardar en DynamoDB
            save_to_dynamodb(client_id, invoice_data, bucket, key)

            return {
                'success': True,
                'invoice_id': f"{invoice_data['emisor']['numeroDocumento']}-{invoice_data['numeroFactura']}",
                'attempt': attempt
            }

        except ClientError as e:
            error_code = e.response['Error']['Code']

            if error_code == 'ThrottlingException':
                # Throttling - aplicar exponential backoff
                backoff = INITIAL_BACKOFF * (2 ** (attempt - 1))
                jitter = backoff * 0.1  # 10% jitter
                wait_time = backoff + jitter

                print(f"⏳ Throttled. Waiting {wait_time:.2f}s before retry {attempt + 1}/{max_retries}")
                time.sleep(wait_time)
                last_error = str(e)
                continue

            elif error_code == 'ValidationException':
                # PDF vacío o inválido - no reintentar
                return {
                    'success': False,
                    'error': f'Validation error: {str(e)}',
                    'invoice_id': None
                }
            else:
                # Otro error de AWS - reintentar
                print(f"⚠️ AWS Error: {error_code} - {str(e)}")
                last_error = str(e)
                time.sleep(INITIAL_BACKOFF * attempt)
                continue

        except Exception as e:
            print(f"⚠️ Unexpected error: {str(e)}")
            last_error = str(e)
            time.sleep(INITIAL_BACKOFF * attempt)
            continue

    # Todos los reintentos fallaron
    return {
        'success': False,
        'error': f'Failed after {max_retries} attempts. Last error: {last_error}',
        'invoice_id': None
    }


def download_pdf_from_s3(bucket, key):
    """
    Descarga PDF desde S3
    """
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        pdf_data = response['Body'].read()
        print(f"📦 Downloaded PDF: {len(pdf_data)} bytes")
        return pdf_data
    except Exception as e:
        print(f"❌ Error downloading from S3: {str(e)}")
        raise


def invoke_claude_with_backoff(pdf_data, attempt):
    """
    Invoca Claude con el PDF, con backoff si es necesario
    """
    pdf_base64 = base64.b64encode(pdf_data).decode('utf-8')

    prompt = """Analiza esta factura electrónica peruana y extrae TODA la información en formato JSON estructurado.

IMPORTANTE: Devuelve ÚNICAMENTE el JSON, sin texto adicional antes o después.

Estructura requerida:
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
    "razonSocial": "...",
    "nombreComercial": null,
    "direccion": "...",
    "departamento": "...",
    "provincia": "...",
    "distrito": "...",
    "telefono": "...",
    "email": "..."
  },
  "receptor": {
    "tipoDocumento": "RUC",
    "numeroDocumento": "...",
    "razonSocial": "...",
    "direccion": "...",
    "departamento": "...",
    "provincia": "...",
    "distrito": "..."
  },
  "montos": {
    "moneda": "PEN",
    "subtotal": 1305.17,
    "igv": 234.93,
    "total": 1540.10
  },
  "condiciones": {
    "formaPago": "CONTADO",
    "medioPago": "TRANSFERENCIA",
    "vendedor": "...",
    "numeroPedido": "...",
    "ordenCompra": null
  },
  "validaciones": {
    "rucEmisorValido": true,
    "igvCalculoCorrecto": true,
    "totalCalculoCorrecto": true,
    "errores": []
  }
}"""

    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 4096,
        "temperature": 0,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "media_type": "application/pdf",
                            "data": pdf_base64
                        }
                    },
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    }

    print(f"🤖 Invoking Claude (attempt {attempt})...")

    response = bedrock_runtime.invoke_model(
        modelId=MODEL_ID,
        body=json.dumps(request_body)
    )

    response_body = json.loads(response['body'].read())
    response_text = response_body['content'][0]['text']

    # Limpiar respuesta y parsear JSON
    json_text = response_text.strip()
    if json_text.startswith('```json'):
        json_text = json_text[7:]
    if json_text.endswith('```'):
        json_text = json_text[:-3]
    json_text = json_text.strip()

    invoice_data = json.loads(json_text)
    print(f"✅ Claude response parsed successfully")

    return invoice_data


def extract_client_id(s3_key):
    """
    Extrae client_id del path S3
    Formato esperado: client-id/archivo.pdf
    """
    parts = (s3_key or '').split('/')
    if BASE_PREFIX and parts and parts[0] == BASE_PREFIX:
        parts = parts[1:]
    if len(parts) >= 1 and parts[0]:
        return parts[0]
    return 'unknown-client'


def save_to_dynamodb(client_id, invoice_data, bucket, key):
    """
    Guarda factura en DynamoDB
    """
    # Convertir floats a Decimal para DynamoDB
    invoice_data_decimal = json.loads(
        json.dumps(invoice_data),
        parse_float=Decimal
    )

    emisor = invoice_data.get('emisor', {})
    receptor = invoice_data.get('receptor', {})
    montos = invoice_data.get('montos', {})

    ruc = emisor.get('numeroDocumento', 'UNKNOWN')
    numero_factura = invoice_data.get('numeroFactura', 'UNKNOWN')
    fecha = invoice_data.get('fechaEmision', datetime.now().strftime('%Y-%m-%d'))

    invoice_id = f"{ruc}-{numero_factura}"

    item = {
        'PK': f'CLIENT#{client_id}',
        'SK': f'INVOICE#{fecha}#{invoice_id}',
        'GSI1PK': f'EMISOR#{ruc}',
        'GSI1SK': fecha,
        'clientId': client_id,
        'tenantId': client_id,
        'invoiceId': invoice_id,
        'numeroFactura': numero_factura,
        'tipoComprobante': 'FACTURA',
        'fechaEmision': fecha,
        'emisorRUC': ruc,
        'emisorRazonSocial': emisor.get('razonSocial'),
        'receptorRUC': receptor.get('numeroDocumento'),
        'receptorRazonSocial': receptor.get('razonSocial'),
        'total': Decimal(str(montos.get('total', 0))),
        'moneda': montos.get('moneda', 'PEN'),
        'data': invoice_data_decimal,
        'archivo': {
            's3Bucket': bucket,
            's3Key': key,
            's3Url': f's3://{bucket}/{key}',
            'nombreArchivo': key.split('/')[-1]
        },
        'procesamiento': {
            'status': 'processed',
            'motor': 'bedrock-claude',
            'modelId': MODEL_ID,
            'timestampProcesado': datetime.utcnow().isoformat() + 'Z'
        },
        'audit': {
            'creadoEn': datetime.utcnow().isoformat() + 'Z',
            'creadoPor': 'bedrock-claude-processor'
        }
    }

    table.put_item(Item=item)
    print(f"💾 Saved to DynamoDB: {invoice_id}")
