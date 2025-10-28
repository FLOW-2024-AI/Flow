"""
Lambda Function: Postgres Writer
Escribe datos de facturas procesadas a PostgreSQL (RDS Aurora Serverless v2)
Trigger: Invocado por lambda_claude.py después de procesar factura

Dependencies (requirements.txt):
- psycopg2-binary
- boto3
"""

import json
import os
import psycopg2
from psycopg2.extras import Json
from datetime import datetime, timedelta
import boto3
from botocore.exceptions import ClientError
import re

# Environment variables
DB_HOST = os.environ.get('DB_HOST')
DB_PORT = int(os.environ.get('DB_PORT', '5432'))
DB_NAME = os.environ.get('DB_NAME')
DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')


def calcular_plazo_y_vencimiento(fecha_emision_str, plazo_credito_raw, fecha_vencimiento_raw):
    """
    Calcula plazo_credito (días) y fecha_vencimiento basándose en los datos disponibles.

    Lógica:
    1. Si viene fecha_vencimiento y fecha_emision → calcular plazo_credito = diferencia en días
    2. Si viene solo plazo_credito (número o "30 dias") → calcular fecha_vencimiento = fecha_emision + plazo
    3. Si ambos vienen, validar consistencia y usar los datos

    Args:
        fecha_emision_str: Fecha de emisión en formato YYYY-MM-DD
        plazo_credito_raw: Puede ser int (30), string ("30 dias", "30"), o None
        fecha_vencimiento_raw: Puede ser fecha YYYY-MM-DD o None

    Returns:
        tuple: (plazo_credito_int, fecha_vencimiento_date)
    """
    plazo_credito = None
    fecha_vencimiento = None

    # Parsear fecha de emisión
    try:
        if fecha_emision_str:
            fecha_emision = datetime.strptime(fecha_emision_str, '%Y-%m-%d').date()
        else:
            return None, None
    except (ValueError, TypeError):
        return None, None

    # Parsear fecha de vencimiento si existe
    if fecha_vencimiento_raw:
        try:
            fecha_vencimiento = datetime.strptime(str(fecha_vencimiento_raw), '%Y-%m-%d').date()
        except (ValueError, TypeError):
            fecha_vencimiento = None

    # Parsear plazo_credito si existe (extraer número)
    if plazo_credito_raw:
        try:
            # Si es número directamente
            if isinstance(plazo_credito_raw, (int, float)):
                plazo_credito = int(plazo_credito_raw)
            # Si es string, extraer números
            elif isinstance(plazo_credito_raw, str):
                match = re.search(r'\d+', plazo_credito_raw)
                if match:
                    plazo_credito = int(match.group())
        except (ValueError, TypeError):
            plazo_credito = None

    # Lógica de cálculo
    if fecha_vencimiento and fecha_emision:
        # Calcular plazo desde las fechas
        plazo_calculado = (fecha_vencimiento - fecha_emision).days
        # Si ya teníamos plazo, validar consistencia (diferencia <= 2 días)
        if plazo_credito and abs(plazo_calculado - plazo_credito) > 2:
            print(f"⚠️ WARNING: Inconsistencia entre plazo ({plazo_credito}) y fechas ({plazo_calculado} días)")
        plazo_credito = plazo_calculado
    elif plazo_credito and fecha_emision:
        # Calcular fecha_vencimiento desde el plazo
        fecha_vencimiento = fecha_emision + timedelta(days=plazo_credito)

    return plazo_credito, fecha_vencimiento


def lambda_handler(event, context):
    """
    Main handler - Procesa eventos de DynamoDB Stream y guarda en PostgreSQL

    Soporta dos formatos:
    1. DynamoDB Stream event (automático)
    2. Invocación manual con datos directos
    """
    try:
        print("📥 Received event")

        # Detectar si es evento de DynamoDB Stream
        if 'Records' in event and event['Records']:
            print("📊 Processing DynamoDB Stream event")
            record = event['Records'][0]

            # Solo procesar INSERT y MODIFY
            if record['eventName'] not in ['INSERT', 'MODIFY']:
                print(f"⏭️ Skipping event type: {record['eventName']}")
                return {'statusCode': 200, 'body': 'Event skipped'}

            # Extraer datos del NewImage de DynamoDB
            dynamo_item = record['dynamodb']['NewImage']

            # Convertir de formato DynamoDB a Python
            client_id = dynamo_item.get('clientId', {}).get('S')
            invoice_data = from_dynamodb(dynamo_item.get('data', {}).get('M', {}))

            # Extraer archivo info
            archivo = from_dynamodb(dynamo_item.get('archivo', {}).get('M', {}))
            s3_data = {
                'bucket': archivo.get('s3Bucket'),
                'key': archivo.get('s3Key'),
                'size': archivo.get('tamanoBytes')
            }

            # Extraer validación SUNAT
            sunat_validation = from_dynamodb(dynamo_item.get('validacionSunat', {}).get('M', {}))

            # Extraer procesamiento
            processing = from_dynamodb(dynamo_item.get('procesamiento', {}).get('M', {}))

        else:
            # Formato manual/directo
            print("📝 Processing manual invocation")
            client_id = event.get('clientId')
            invoice_data = event.get('invoiceData', {})
            s3_data = event.get('s3Data', {})
            sunat_validation = event.get('sunatValidation', {})
            processing = event.get('processing', {})

        if not client_id or not invoice_data:
            raise ValueError("Missing required fields: clientId or invoiceData")

        print(f"👤 Client: {client_id}")
        print(f"📄 Invoice: {invoice_data.get('numeroFactura')}")

        # 2. Conectar a PostgreSQL usando variables de entorno
        print("🔌 Connecting to PostgreSQL...")
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            connect_timeout=10
        )

        print("✅ Connected to PostgreSQL")

        # 4. Preparar datos para inserción
        factura_record = prepare_factura_record(
            client_id=client_id,
            invoice_data=invoice_data,
            s3_data=s3_data,
            sunat_validation=sunat_validation,
            processing=processing
        )

        # 5. Insertar en la base de datos
        print("💾 Inserting into facturas table...")
        factura_id = insert_factura(conn, factura_record)

        # 6. Commit y cerrar
        conn.commit()
        conn.close()

        print(f"✅ SUCCESS - Factura ID: {factura_id}")

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Factura saved to PostgreSQL successfully',
                'facturaId': str(factura_id),
                'invoiceId': factura_record['invoice_id'],
                'clientId': client_id
            })
        }

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

        # Rollback si hay conexión activa
        try:
            if 'conn' in locals() and conn:
                conn.rollback()
                conn.close()
        except:
            pass

        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e),
                'type': type(e).__name__
            })
        }


def from_dynamodb(obj):
    """
    Convierte formato DynamoDB a Python nativo
    """
    if not isinstance(obj, dict):
        return obj

    # Si tiene un solo key que es un tipo de DynamoDB
    if len(obj) == 1:
        type_key = list(obj.keys())[0]
        value = obj[type_key]

        if type_key == 'S':  # String
            return value
        elif type_key == 'N':  # Number
            return float(value) if '.' in value else int(value)
        elif type_key == 'BOOL':  # Boolean
            return value
        elif type_key == 'NULL':  # Null
            return None
        elif type_key == 'M':  # Map
            return {k: from_dynamodb(v) for k, v in value.items()}
        elif type_key == 'L':  # List
            return [from_dynamodb(i) for i in value]

    # Si no, procesar recursivamente
    return {k: from_dynamodb(v) for k, v in obj.items()}


def prepare_factura_record(client_id, invoice_data, s3_data, sunat_validation, processing):
    """
    Prepara el registro de factura para inserción en PostgreSQL
    Mapea los campos del JSON de Claude a la estructura de la tabla
    """

    # Extraer datos principales
    emisor = invoice_data.get('emisor', {})
    receptor = invoice_data.get('receptor', {})
    montos = invoice_data.get('montos', {})
    condiciones = invoice_data.get('condiciones', {})
    sunat = invoice_data.get('sunat', {})

    # Construir invoice_id
    ruc_emisor = emisor.get('numeroDocumento', 'UNKNOWN')
    numero_factura = invoice_data.get('numeroFactura', 'UNKNOWN')
    invoice_id = f"{ruc_emisor}-{numero_factura}"

    # Extraer validación SUNAT
    sunat_estado_sunat = sunat_validation.get('estadoSunat', {})
    sunat_estado_comprobante = sunat_estado_sunat.get('estadoComprobante', {}) if sunat_estado_sunat else {}
    sunat_estado_ruc = sunat_estado_sunat.get('estadoRuc', {}) if sunat_estado_sunat else {}
    sunat_condicion_domicilio = sunat_estado_sunat.get('condicionDomicilio', {}) if sunat_estado_sunat else {}

    # Convertir fecha de emisión (YYYY-MM-DD)
    fecha_emision = invoice_data.get('fechaEmision')

    # Calcular plazo_credito y fecha_vencimiento
    plazo_credito_raw = condiciones.get('plazoCredito')
    fecha_vencimiento_raw = condiciones.get('fechaVencimiento') or invoice_data.get('fechaVencimiento')
    plazo_credito_final, fecha_vencimiento_final = calcular_plazo_y_vencimiento(
        fecha_emision, plazo_credito_raw, fecha_vencimiento_raw
    )

    # Construir S3 URL
    s3_bucket = s3_data.get('bucket', '')
    s3_key = s3_data.get('key', '')
    s3_url = f"s3://{s3_bucket}/{s3_key}"

    record = {
        # IDs y referencias
        'client_id': client_id,
        'invoice_id': invoice_id,

        # Archivo S3
        's3_bucket': s3_bucket,
        's3_key': s3_key,
        's3_url': s3_url,
        'nombre_archivo': s3_key.split('/')[-1] if s3_key else None,
        'tamano_bytes': s3_data.get('size'),

        # Campos de cabecera
        'numero_factura': numero_factura,
        'tipo_documento': invoice_data.get('tipoComprobante', 'FACTURA'),
        'serie': invoice_data.get('serie'),
        'correlativo': invoice_data.get('correlativo'),
        'fecha_emision': fecha_emision,
        'hora_emision': invoice_data.get('horaEmision'),
        'fecha_vencimiento': fecha_vencimiento_final,
        'moneda': montos.get('moneda', 'PEN'),

        # Datos del Emisor
        'ruc_emisor': ruc_emisor,
        'nombre_proveedor': emisor.get('razonSocial'),
        'emisor_nombre_comercial': emisor.get('nombreComercial'),
        'emisor_direccion': emisor.get('direccion'),
        'emisor_departamento': emisor.get('departamento'),
        'emisor_provincia': emisor.get('provincia'),
        'emisor_distrito': emisor.get('distrito'),
        'emisor_telefono': emisor.get('telefono'),
        'emisor_email': emisor.get('email'),

        # Datos del Receptor
        'receptor_ruc': receptor.get('numeroDocumento'),
        'receptor_razon_social': receptor.get('razonSocial'),
        'receptor_direccion': receptor.get('direccion'),
        'receptor_departamento': receptor.get('departamento'),
        'receptor_provincia': receptor.get('provincia'),
        'receptor_distrito': receptor.get('distrito'),

        # Montos
        'monto_subtotal': float(montos.get('subtotal', 0)) if montos.get('subtotal') else None,
        'monto_igv': float(montos.get('igv', 0)) if montos.get('igv') else None,
        'monto_total': float(montos.get('total', 0)),

        # Condiciones de pago
        'condicion_pago': condiciones.get('formaPago'),
        'medio_pago': condiciones.get('medioPago'),
        'plazo_credito': plazo_credito_final,
        'vendedor': condiciones.get('vendedor'),
        'numero_pedido': condiciones.get('numeroPedido'),
        'oc_asociada': condiciones.get('ordenCompra'),
        'guia_remision': condiciones.get('guiaRemision'),
        'observaciones': condiciones.get('observaciones'),

        # Validación SUNAT
        'sunat_validado': sunat_validation.get('validado', False),
        'sunat_estado': sunat_validation.get('estado'),
        'sunat_es_valido': sunat_validation.get('esValido'),
        'sunat_motivo': sunat_validation.get('motivo'),
        'sunat_estado_comprobante_codigo': sunat_estado_comprobante.get('codigo'),
        'sunat_estado_comprobante_descripcion': sunat_estado_comprobante.get('descripcion'),
        'sunat_estado_ruc_codigo': sunat_estado_ruc.get('codigo'),
        'sunat_estado_ruc_descripcion': sunat_estado_ruc.get('descripcion'),
        'sunat_condicion_domicilio_codigo': sunat_condicion_domicilio.get('codigo'),
        'sunat_condicion_domicilio_descripcion': sunat_condicion_domicilio.get('descripcion'),
        'sunat_observaciones': Json(sunat_estado_sunat.get('observaciones', [])) if sunat_estado_sunat else None,
        'sunat_timestamp_validacion': sunat_validation.get('timestampValidacion'),

        # Datos completos (JSON completo)
        'data_completa': Json(invoice_data),

        # Metadata de procesamiento
        'procesamiento_status': processing.get('status', 'processed'),
        'procesamiento_motor': processing.get('motor', 'bedrock-claude'),
        'procesamiento_model_id': processing.get('modelId'),
        'procesamiento_model_name': processing.get('modelName'),
        'procesamiento_confidence': processing.get('confidence'),
        'procesamiento_timestamp': processing.get('timestampProcesado'),
        'procesamiento_warnings': Json(processing.get('warnings', [])),
        'procesamiento_errores': Json(processing.get('errores', [])),

        # Validaciones de Claude
        'validacion_igv_correcto': invoice_data.get('validaciones', {}).get('igvCalculoCorrecto'),
        'validacion_total_correcto': invoice_data.get('validaciones', {}).get('totalCalculoCorrecto'),
        'validacion_ruc_valido': invoice_data.get('validaciones', {}).get('rucEmisorValido'),
        'validacion_requiere_revision': len(invoice_data.get('validaciones', {}).get('errores', [])) > 0,

        # Auditoría
        'creado_por': 'bedrock-claude-processor',
        'version_documento': 1
    }

    return record


def insert_factura(conn, record):
    """
    Inserta la factura en PostgreSQL
    Retorna el UUID generado
    """

    sql = """
        INSERT INTO facturas (
            client_id, invoice_id,
            s3_bucket, s3_key, s3_url, nombre_archivo, tamano_bytes,
            numero_factura, tipo_documento, serie, correlativo,
            fecha_emision, hora_emision, fecha_vencimiento, moneda,
            ruc_emisor, nombre_proveedor, emisor_nombre_comercial, emisor_direccion,
            emisor_departamento, emisor_provincia, emisor_distrito, emisor_telefono, emisor_email,
            receptor_ruc, receptor_razon_social, receptor_direccion,
            receptor_departamento, receptor_provincia, receptor_distrito,
            monto_subtotal, monto_igv, monto_total,
            condicion_pago, medio_pago, plazo_credito, vendedor, numero_pedido,
            oc_asociada, guia_remision, observaciones,
            sunat_validado, sunat_estado, sunat_es_valido, sunat_motivo,
            sunat_estado_comprobante_codigo, sunat_estado_comprobante_descripcion,
            sunat_estado_ruc_codigo, sunat_estado_ruc_descripcion,
            sunat_condicion_domicilio_codigo, sunat_condicion_domicilio_descripcion,
            sunat_observaciones, sunat_timestamp_validacion,
            data_completa,
            procesamiento_status, procesamiento_motor, procesamiento_model_id,
            procesamiento_model_name, procesamiento_confidence, procesamiento_timestamp,
            procesamiento_warnings, procesamiento_errores,
            validacion_igv_correcto, validacion_total_correcto, validacion_ruc_valido,
            validacion_requiere_revision,
            creado_por, version_documento
        ) VALUES (
            %(client_id)s, %(invoice_id)s,
            %(s3_bucket)s, %(s3_key)s, %(s3_url)s, %(nombre_archivo)s, %(tamano_bytes)s,
            %(numero_factura)s, %(tipo_documento)s, %(serie)s, %(correlativo)s,
            %(fecha_emision)s, %(hora_emision)s, %(fecha_vencimiento)s, %(moneda)s,
            %(ruc_emisor)s, %(nombre_proveedor)s, %(emisor_nombre_comercial)s, %(emisor_direccion)s,
            %(emisor_departamento)s, %(emisor_provincia)s, %(emisor_distrito)s, %(emisor_telefono)s, %(emisor_email)s,
            %(receptor_ruc)s, %(receptor_razon_social)s, %(receptor_direccion)s,
            %(receptor_departamento)s, %(receptor_provincia)s, %(receptor_distrito)s,
            %(monto_subtotal)s, %(monto_igv)s, %(monto_total)s,
            %(condicion_pago)s, %(medio_pago)s, %(plazo_credito)s, %(vendedor)s, %(numero_pedido)s,
            %(oc_asociada)s, %(guia_remision)s, %(observaciones)s,
            %(sunat_validado)s, %(sunat_estado)s, %(sunat_es_valido)s, %(sunat_motivo)s,
            %(sunat_estado_comprobante_codigo)s, %(sunat_estado_comprobante_descripcion)s,
            %(sunat_estado_ruc_codigo)s, %(sunat_estado_ruc_descripcion)s,
            %(sunat_condicion_domicilio_codigo)s, %(sunat_condicion_domicilio_descripcion)s,
            %(sunat_observaciones)s, %(sunat_timestamp_validacion)s,
            %(data_completa)s,
            %(procesamiento_status)s, %(procesamiento_motor)s, %(procesamiento_model_id)s,
            %(procesamiento_model_name)s, %(procesamiento_confidence)s, %(procesamiento_timestamp)s,
            %(procesamiento_warnings)s, %(procesamiento_errores)s,
            %(validacion_igv_correcto)s, %(validacion_total_correcto)s, %(validacion_ruc_valido)s,
            %(validacion_requiere_revision)s,
            %(creado_por)s, %(version_documento)s
        )
        ON CONFLICT (client_id, invoice_id) DO UPDATE SET
            -- En caso de duplicado, actualizar campos relevantes
            monto_total = EXCLUDED.monto_total,
            sunat_validado = EXCLUDED.sunat_validado,
            sunat_estado = EXCLUDED.sunat_estado,
            sunat_es_valido = EXCLUDED.sunat_es_valido,
            data_completa = EXCLUDED.data_completa,
            actualizado_en = NOW(),
            actualizado_por = 'bedrock-claude-processor',
            version_documento = facturas.version_documento + 1
        RETURNING id;
    """

    with conn.cursor() as cursor:
        cursor.execute(sql, record)
        factura_id = cursor.fetchone()[0]
        conn.commit()

        print(f"✅ Inserted/Updated factura with ID: {factura_id}")

        return factura_id


# Función auxiliar para testing local
def test_local():
    """
    Test function para probar localmente
    """
    event = {
        "clientId": "test-client-001",
        "invoiceData": {
            "numeroFactura": "F001-123456",
            "serie": "F001",
            "correlativo": "123456",
            "tipoComprobante": "FACTURA",
            "fechaEmision": "2025-10-17",
            "emisor": {
                "numeroDocumento": "20601234567",
                "razonSocial": "Test S.A.",
                "email": "test@test.com"
            },
            "receptor": {
                "numeroDocumento": "20601234568",
                "razonSocial": "Cliente Test S.A."
            },
            "montos": {
                "moneda": "PEN",
                "subtotal": 1500.00,
                "igv": 270.00,
                "total": 1770.00
            },
            "condiciones": {
                "formaPago": "CONTADO",
                "ordenCompra": "OC-001"
            },
            "validaciones": {
                "igvCalculoCorrecto": True,
                "totalCalculoCorrecto": True,
                "rucEmisorValido": True,
                "errores": []
            }
        },
        "s3Data": {
            "bucket": "facturas-dev",
            "key": "test-client-001/factura-test.pdf",
            "size": 123456
        },
        "sunatValidation": {
            "validado": True,
            "esValido": True,
            "estado": "VALIDO",
            "motivo": "Comprobante validado exitosamente",
            "timestampValidacion": "2025-10-22T10:30:00Z",
            "estadoSunat": {
                "estadoComprobante": {
                    "codigo": "1",
                    "descripcion": "ACEPTADO"
                },
                "estadoRuc": {
                    "codigo": "00",
                    "descripcion": "ACTIVO"
                },
                "condicionDomicilio": {
                    "codigo": "00",
                    "descripcion": "HABIDO"
                }
            }
        },
        "processing": {
            "status": "processed",
            "motor": "bedrock-claude",
            "modelId": "anthropic.claude-3-5-sonnet-20240620-v1:0",
            "modelName": "Claude 3.5 Sonnet",
            "confidence": "high",
            "timestampProcesado": "2025-10-22T10:30:00Z",
            "warnings": [],
            "errores": []
        }
    }

    result = lambda_handler(event, None)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    # Solo para testing local
    test_local()
