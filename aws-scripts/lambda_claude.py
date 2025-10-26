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
import time
from urllib.parse import unquote_plus
from datetime import datetime
from decimal import Decimal
from botocore.exceptions import ClientError

# AWS Clients
s3_client = boto3.client('s3')
bedrock_runtime = boto3.client('bedrock-runtime')
dynamodb = boto3.resource('dynamodb')

# Environment variables
TABLE_NAME = os.environ.get('DYNAMODB_TABLE', 'Facturas-dev')
table = dynamodb.Table(TABLE_NAME)

# SUNAT API credentials (from environment variables)
SUNAT_CLIENT_ID = os.environ.get('SUNAT_CLIENT_ID')
SUNAT_CLIENT_SECRET = os.environ.get('SUNAT_CLIENT_SECRET')
SUNAT_RUC = os.environ.get('SUNAT_RUC')  # RUC del consultante

# Bedrock model - Claude 3.5 Sonnet (estable y probado)
# TODO: Cambiar a Claude 4.5 cuando tengamos acceso aprobado
MODEL_ID = "anthropic.claude-3-5-sonnet-20240620-v1:0"

# HTTP client for SUNAT API
http = urllib3.PoolManager()

# Token cache (se reutiliza durante su vigencia)
sunat_token_cache = {
    'token': None,
    'expires_at': None
}


def lambda_handler(event, context):
    """
    Main handler - triggered by S3 upload
    """
    try:
        # 1. Get S3 event info
        record = event['Records'][0]
        bucket = record['s3']['bucket']['name']
        key = unquote_plus(record['s3']['object']['key'])  # Decode URL-encoded characters
        file_size = record['s3']['object']['size']

        print(f"📄 Processing: s3://{bucket}/{key}")
        print(f"📦 Size: {file_size} bytes")
        
        # 2. Extract client_id from path
        parts = key.split('/')
        client_id = parts[0] if len(parts) > 0 else 'unknown'
        
        print(f"👤 Client ID: {client_id}")
        
        # 3. Download PDF from S3
        print("📥 Downloading PDF from S3...")
        pdf_obj = s3_client.get_object(Bucket=bucket, Key=key)
        pdf_bytes = pdf_obj['Body'].read()
        
        # Convert to base64 for Bedrock
        pdf_base64 = base64.standard_b64encode(pdf_bytes).decode('utf-8')
        
        print(f"📦 PDF encoded: {len(pdf_base64)} characters")
        
        # 4. Call Bedrock Claude to analyze invoice
        print("🤖 Calling Bedrock Claude 3.5 Sonnet...")
        
        invoice_data = analyze_invoice_with_bedrock(pdf_base64)

        print(f"✅ Claude completed - Invoice: {invoice_data.get('numeroFactura')}")

        # 5. Validate invoice with SUNAT API
        print("🔍 Validating invoice with SUNAT...")
        sunat_validation = validate_invoice_with_sunat(invoice_data)

        print(f"✅ SUNAT validation: {sunat_validation['estado']}")

        # 6. Build DynamoDB item (including SUNAT validation)
        dynamo_item = build_item(client_id, invoice_data, bucket, key, file_size, sunat_validation)
        
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
                'total': float(invoice_data.get('montos', {}).get('total', 0)),
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
    Retorna el estado de validación y detalles completos
    Incluye descripciones oficiales de cada código según documentación SUNAT
    """

    # Catálogo de códigos según documentación oficial SUNAT
    ESTADOS_COMPROBANTE = {
        '0': 'NO EXISTE - Comprobante no informado',
        '1': 'ACEPTADO - Comprobante aceptado',
        '2': 'ANULADO - Comunicado en una baja',
        '3': 'AUTORIZADO - Con autorización de imprenta',
        '4': 'NO AUTORIZADO - No autorizado por imprenta'
    }

    ESTADOS_RUC = {
        '00': 'ACTIVO',
        '01': 'BAJA PROVISIONAL',
        '02': 'BAJA PROV. POR OFICIO',
        '03': 'SUSPENSION TEMPORAL',
        '10': 'BAJA DEFINITIVA',
        '11': 'BAJA DE OFICIO',
        '22': 'INHABILITADO-VENT.UNICA'
    }

    CONDICIONES_DOMICILIO = {
        '00': 'HABIDO',
        '09': 'PENDIENTE',
        '11': 'POR VERIFICAR',
        '12': 'NO HABIDO',
        '20': 'NO HALLADO'
    }

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
        tipo_comprobante = invoice_data.get('tipoComprobante', 'FACTURA')
        codigo_comprobante = '01' if tipo_comprobante == 'FACTURA' else '03'  # 01=Factura, 03=Boleta

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

        # Convertir fecha de YYYY-MM-DD a DD/MM/YYYY (formato SUNAT)
        if fecha_emision and '-' in fecha_emision:
            # fecha_emision viene como "2025-10-07"
            parts = fecha_emision.split('-')
            if len(parts) == 3:
                fecha_sunat = f"{parts[2]}/{parts[1]}/{parts[0]}"  # DD/MM/YYYY
            else:
                fecha_sunat = fecha_emision
        else:
            fecha_sunat = fecha_emision

        # Cuerpo de la solicitud según documentación SUNAT
        body = json.dumps({
            'numRuc': ruc_emisor,
            'codComp': codigo_comprobante,
            'numeroSerie': serie,
            'numero': int(correlativo) if correlativo else 0,  # numero debe ser int
            'fechaEmision': fecha_sunat,  # Formato DD/MM/YYYY
            'monto': float(monto_total)
        })

        response = http.request(
            'POST',
            url,
            headers=headers,
            body=body
        )

        if response.status == 200:
            data = json.loads(response.data.decode('utf-8'))

            # Verificar si la respuesta fue exitosa
            if not data.get('success'):
                # API respondió 200 pero con success=false
                return {
                    'validado': False,
                    'estado': 'ERROR_API',
                    'motivo': data.get('message', 'Error desconocido de SUNAT'),
                    'estadoSunat': None,
                    'timestampValidacion': datetime.now().isoformat() + 'Z',
                    'errorDetalle': json.dumps(data)
                }

            # Extraer datos de la respuesta
            response_data = data.get('data', {})
            estado_cp = response_data.get('estadoCp', '')
            estado_ruc = response_data.get('estadoRuc', '')
            condicion_domicilio = response_data.get('condDomiRuc', '')
            observaciones = response_data.get('observaciones', [])

            # Obtener descripciones oficiales
            desc_comprobante = ESTADOS_COMPROBANTE.get(estado_cp, f'Código desconocido: {estado_cp}')
            desc_ruc = ESTADOS_RUC.get(estado_ruc, f'Código desconocido: {estado_ruc}')
            desc_domicilio = CONDICIONES_DOMICILIO.get(condicion_domicilio, f'Código desconocido: {condicion_domicilio}')

            # Determinar si es válido (mantener la lógica original)
            es_valido = (
                estado_cp in ['1', '0'] and  # 1=Aceptado, 0=Anulado (pero existió)
                estado_ruc == '00'  # 00=Activo
            )

            print(f"✅ SUNAT validation completed: {estado_cp} - {desc_comprobante}")

            return {
                'validado': True,
                'esValido': es_valido,
                'estado': 'VALIDO' if es_valido else 'INVALIDO',
                'motivo': 'Comprobante validado exitosamente' if es_valido else 'Comprobante no válido en SUNAT',
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
                        'codigo': condicion_domicilio,
                        'descripcion': desc_domicilio
                    },
                    'observaciones': observaciones
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


def analyze_invoice_with_bedrock(pdf_base64):
    """
    Send PDF to Claude via Bedrock and get structured JSON
    Uses expert prompt for maximum accuracy
    """
    
    # Prompt de contador experto peruano
    expert_prompt = """Eres un Contador Público Colegiado peruano con 15 años de experiencia en auditoría tributaria y facturación electrónica. 

Eres experto en:
- Normativa SUNAT y sistema de comprobantes de pago electrónicos (CPE)
- Ley del IGV (Decreto Legislativo N° 821)
- Reglamento de Comprobantes de Pago (Resolución de Superintendencia N° 007-99/SUNAT)
- Validación de documentos tributarios según estándares peruanos

Tu tarea es analizar esta factura electrónica peruana con máxima precisión y extraer TODOS los datos en formato JSON estructurado.

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

3. EXTRACCIÓN DE ITEMS:
   - Extraer TODOS los productos/servicios listados
   - Incluir códigos de producto si existen
   - Calcular valor unitario sin IGV si solo aparece precio con IGV
   - Identificar tipo de afectación (GRAVADO/EXONERADO/INAFECTO/GRATUITO)

4. DATOS BANCARIOS:
   - Extraer TODAS las cuentas bancarias mencionadas
   - Identificar tipo de cuenta (CORRIENTE/AHORRO/DETRACCION)
   - Incluir CCI si está disponible

5. VALIDACIONES SUNAT:
   - Verificar que RUC tenga 11 dígitos
   - Verificar formato de serie (letra + 3 dígitos)
   - Validar que correlativo sea numérico
   - Identificar si es agente de retención/percepción

6. WARNINGS Y ERRORES:
   - En validaciones.warnings: inconsistencias menores (ej: IGV difiere por redondeo)
   - En validaciones.errores: problemas graves (ej: RUC inválido, total no cuadra)

7. RESPUESTA:
   - Retornar ÚNICAMENTE el JSON
   - NO agregar texto explicativo antes o después
   - NO usar markdown (```json)
   - JSON válido y bien formateado

Analiza la factura con máximo rigor profesional y precisión contable.
"""
    
    # Construir request para Bedrock
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 8000,
        "temperature": 0.1,  # Baja temperatura para mayor precisión
        "top_p": 0.9,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_base64
                        }
                    },
                    {
                        "type": "text",
                        "text": expert_prompt
                    }
                ]
            }
        ]
    }
    
    # Reintentos con backoff exponencial para manejar throttling
    max_retries = 5
    base_delay = 2  # segundos

    for attempt in range(max_retries):
        try:
            # Call Bedrock
            if attempt > 0:
                print(f"🔄 Retry {attempt}/{max_retries} - Invoking Bedrock model: {MODEL_ID}")
            else:
                print(f"🔄 Invoking Bedrock model: {MODEL_ID}")

            response = bedrock_runtime.invoke_model(
                modelId=MODEL_ID,
                body=json.dumps(request_body)
            )

            # Si llegamos aquí, la llamada fue exitosa
            break

        except ClientError as e:
            error_code = e.response['Error']['Code']

            if error_code == 'ThrottlingException':
                if attempt < max_retries - 1:
                    # Backoff exponencial: 2s, 4s, 8s, 16s, 32s
                    delay = base_delay * (2 ** attempt)
                    print(f"⚠️ Throttling detected. Waiting {delay}s before retry...")
                    time.sleep(delay)
                    continue
                else:
                    print(f"❌ Max retries reached after throttling")
                    raise
            else:
                # Otro tipo de error, no reintentar
                raise

    try:
        
        # Parse response
        response_body = json.loads(response['body'].read())
        
        # Extract text from Claude response
        content = response_body.get('content', [])
        if not content:
            raise ValueError("Empty response from Bedrock")
        
        response_text = content[0].get('text', '')
        
        print(f"📝 Claude response length: {len(response_text)} chars")
        
        # Extract JSON from response
        # Claude might add explanatory text, so we extract the JSON block
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        
        if json_start == -1 or json_end == 0:
            print(f"⚠️ Response text: {response_text[:500]}")
            raise ValueError("No JSON found in Claude response")
        
        invoice_json = response_text[json_start:json_end]
        
        # Parse JSON
        invoice_data = json.loads(invoice_json)
        
        print(f"✅ Successfully parsed invoice data")
        print(f"📊 Items extracted: {len(invoice_data.get('items', []))}")
        print(f"💰 Total: {invoice_data.get('montos', {}).get('total', 0)}")
        
        # Check validations
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


def build_item(client_id, invoice_data, bucket, key, file_size, sunat_validation=None):
    """
    Build DynamoDB item from Claude's structured response
    Includes SUNAT validation data if provided
    """
    
    # Generate invoice ID
    ruc = invoice_data.get('emisor', {}).get('numeroDocumento', 'UNKNOWN')
    numero = invoice_data.get('numeroFactura', 'UNKNOWN')
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
    
    invoice_data_decimal = convert_to_decimal(invoice_data)
    
    # Build DynamoDB item
    item = {
        # Primary keys
        'PK': f'CLIENT#{client_id}',
        'SK': f'INVOICE#{fecha}#{invoice_id}',
        
        # Identifiers
        'clientId': client_id,
        'invoiceId': invoice_id,
        'numeroFactura': invoice_data.get('numeroFactura'),
        'tipoComprobante': invoice_data.get('tipoComprobante', 'FACTURA'),
        
        # Flat fields for queries
        'fechaEmision': fecha,
        'emisorRUC': ruc,
        'emisorRazonSocial': invoice_data.get('emisor', {}).get('razonSocial'),
        'receptorRUC': invoice_data.get('receptor', {}).get('numeroDocumento'),
        'receptorRazonSocial': invoice_data.get('receptor', {}).get('razonSocial'),
        'total': Decimal(str(invoice_data.get('montos', {}).get('total', 0))),
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
            'modelName': 'Claude 3.5 Sonnet',
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
    
    return item