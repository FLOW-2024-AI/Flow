#!/usr/bin/env python3
"""
Script para migrar datos de DynamoDB (Facturas-dev) a PostgreSQL
Usa las funciones del lambda_postgres_writer.py para procesar cada item
"""

import sys
import os
import boto3
import psycopg2
from botocore.exceptions import ClientError
import time
import json
from decimal import Decimal

# Agregar el directorio actual al path para importar lambda_postgres_writer
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Importar funciones del lambda writer
from lambda_postgres_writer import (
    from_dynamodb,
    normalize_invoice_data,
    prepare_factura_record,
    insert_factura
)

# Configuración
DYNAMODB_TABLE = os.environ.get('DYNAMODB_TABLE', 'Facturas-dev')
AWS_REGION = os.environ.get('AWS_REGION', 'us-east-1')
DB_HOST = os.environ.get('DB_HOST')
DB_PORT = int(os.environ.get('DB_PORT', '5432'))
DB_NAME = os.environ.get('DB_NAME')
DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')

# Configuración de migración
BATCH_SIZE = 25  # Número de items a procesar por lote


def convert_decimal(obj):
    """
    Convierte objetos Decimal a float/int recursivamente
    """
    if isinstance(obj, list):
        return [convert_decimal(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimal(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        # Convertir a int si no tiene decimales, sino a float
        if obj % 1 == 0:
            return int(obj)
        else:
            return float(obj)
    else:
        return obj


def scan_dynamodb_table(table_name, region):
    """
    Escanea toda la tabla de DynamoDB y retorna todos los items
    """
    print(f"📊 Scanning DynamoDB table: {table_name}")

    dynamodb = boto3.resource('dynamodb', region_name=region)
    table = dynamodb.Table(table_name)

    items = []
    scan_kwargs = {}

    try:
        done = False
        start_key = None

        while not done:
            if start_key:
                scan_kwargs['ExclusiveStartKey'] = start_key

            response = table.scan(**scan_kwargs)
            items.extend(response.get('Items', []))

            start_key = response.get('LastEvaluatedKey', None)
            done = start_key is None

            print(f"  📥 Scanned {len(items)} items so far...")

        print(f"✅ Total items found: {len(items)}")
        return items

    except ClientError as e:
        print(f"❌ Error scanning DynamoDB: {e}")
        raise


def convert_dynamodb_item_to_event(item):
    """
    Convierte un item de DynamoDB al formato de evento esperado por lambda_handler
    """
    # Convertir todos los Decimals a float/int
    item = convert_decimal(item)

    # Extraer client_id y tenant_id
    client_id = item.get('clientId')
    tenant_id = item.get('tenantId', client_id)

    # Extraer datos de la factura
    invoice_data = item.get('data', {})

    # Agregar campos top-level si existen
    top_level = {
        'invoiceId': item.get('invoiceId'),
        'numeroFactura': item.get('numeroFactura'),
        'fechaEmision': item.get('fechaEmision'),
        'emisorRUC': item.get('emisorRUC'),
        'emisorRazonSocial': item.get('emisorRazonSocial'),
        'total': item.get('total'),
        'moneda': item.get('moneda')
    }

    # Normalizar datos de factura
    invoice_data = normalize_invoice_data(invoice_data, top_level)

    # Extraer datos de archivo
    archivo = item.get('archivo', {})
    s3_data = {
        'bucket': archivo.get('s3Bucket'),
        'key': archivo.get('s3Key'),
        'size': archivo.get('tamanoBytes')
    }

    # Extraer validación SUNAT
    sunat_validation = item.get('validacionSunat', {})

    # Extraer procesamiento
    processing = item.get('procesamiento', {})

    return {
        'clientId': client_id,
        'tenantId': tenant_id,
        'invoiceData': invoice_data,
        's3Data': s3_data,
        'sunatValidation': sunat_validation,
        'processing': processing
    }


def migrate_items_to_postgres(items, conn, dry_run=False):
    """
    Migra los items de DynamoDB a PostgreSQL
    """
    total = len(items)
    success = 0
    errors = 0
    skipped = 0

    print(f"\n🚀 Starting migration of {total} items...")
    print(f"   DRY RUN: {dry_run}")
    print()

    for idx, item in enumerate(items, 1):
        try:
            # Convertir item a formato de evento
            event_data = convert_dynamodb_item_to_event(item)

            client_id = event_data['clientId']
            tenant_id = event_data['tenantId']
            invoice_data = event_data['invoiceData']

            if not client_id or not tenant_id or not invoice_data:
                print(f"⏭️  [{idx}/{total}] Skipping item - missing required fields")
                skipped += 1
                continue

            invoice_id = invoice_data.get('invoiceId', 'N/A')
            numero_factura = invoice_data.get('numeroFactura', 'N/A')

            # Preparar registro para PostgreSQL
            factura_record = prepare_factura_record(
                client_id=client_id,
                tenant_id=tenant_id,
                invoice_data=invoice_data,
                s3_data=event_data['s3Data'],
                sunat_validation=event_data['sunatValidation'],
                processing=event_data['processing']
            )

            # Validar monto total
            monto_total = factura_record.get('monto_total')
            if monto_total is None or monto_total <= 0:
                print(f"⏭️  [{idx}/{total}] Skipping {numero_factura} - invalid monto_total: {monto_total}")
                skipped += 1
                continue

            # Insertar en PostgreSQL
            if not dry_run:
                # Configurar tenant_id en la sesión
                with conn.cursor() as cursor:
                    cursor.execute("SET row_security = on")
                    cursor.execute("SET app.tenant_id = %s", (tenant_id,))

                factura_id = insert_factura(conn, factura_record)
                print(f"✅ [{idx}/{total}] Migrated: {numero_factura} (ID: {factura_id})")
            else:
                print(f"🔍 [{idx}/{total}] DRY RUN: Would migrate {numero_factura} (Total: {monto_total})")

            success += 1

            # Commit cada 10 items para evitar transacciones muy largas
            if not dry_run and idx % 10 == 0:
                conn.commit()
                print(f"   💾 Committed batch at {idx}/{total}")

        except Exception as e:
            errors += 1
            print(f"❌ [{idx}/{total}] Error processing item: {e}")
            if not dry_run:
                conn.rollback()
            continue

    # Commit final
    if not dry_run:
        conn.commit()

    print(f"\n📊 Migration Summary:")
    print(f"   Total items: {total}")
    print(f"   ✅ Successful: {success}")
    print(f"   ⏭️  Skipped: {skipped}")
    print(f"   ❌ Errors: {errors}")

    return success, errors, skipped


def main(dry_run=False):
    """
    Función principal
    """
    print("=" * 80)
    print("🔄 DynamoDB to PostgreSQL Migration")
    print("=" * 80)
    print()

    # Validar variables de entorno
    required_vars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']
    missing_vars = [var for var in required_vars if not os.environ.get(var)]

    if missing_vars:
        print(f"❌ Error: Missing required environment variables: {', '.join(missing_vars)}")
        print("\nPlease set the following variables:")
        print("  export DB_HOST=your-db-host")
        print("  export DB_NAME=your-db-name")
        print("  export DB_USER=your-db-user")
        print("  export DB_PASSWORD=your-db-password")
        print("  export DYNAMODB_TABLE=Facturas-dev (optional)")
        print("  export AWS_REGION=us-east-1 (optional)")
        return 1

    print(f"📝 Configuration:")
    print(f"   DynamoDB Table: {DYNAMODB_TABLE}")
    print(f"   AWS Region: {AWS_REGION}")
    print(f"   PostgreSQL Host: {DB_HOST}")
    print(f"   PostgreSQL Database: {DB_NAME}")
    print(f"   PostgreSQL User: {DB_USER}")
    print(f"   Batch Size: {BATCH_SIZE}")
    print(f"   DRY RUN: {dry_run}")
    print()

    try:
        # 1. Escanear DynamoDB
        start_time = time.time()
        items = scan_dynamodb_table(DYNAMODB_TABLE, AWS_REGION)

        if not items:
            print("⚠️  No items found in DynamoDB table")
            return 0

        # 2. Conectar a PostgreSQL
        print(f"\n🔌 Connecting to PostgreSQL...")
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            connect_timeout=10
        )
        print("✅ Connected to PostgreSQL")

        # 3. Migrar items
        success, errors, skipped = migrate_items_to_postgres(items, conn, dry_run)

        # 4. Cerrar conexión
        conn.close()

        elapsed_time = time.time() - start_time
        print(f"\n⏱️  Total time: {elapsed_time:.2f} seconds")
        print(f"   Average: {elapsed_time/len(items):.2f} seconds per item")

        if errors > 0:
            print(f"\n⚠️  Migration completed with {errors} errors")
            return 1
        else:
            print(f"\n✅ Migration completed successfully!")
            return 0

    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    # Check for --dry-run argument
    dry_run = '--dry-run' in sys.argv

    if dry_run:
        print("🔍 DRY RUN MODE ENABLED - No data will be inserted\n")

    exit_code = main(dry_run)
    sys.exit(exit_code)
