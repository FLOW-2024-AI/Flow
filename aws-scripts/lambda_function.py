"""
Lambda Function: Invoice Processor
Trigger: S3 ObjectCreated
Flow: S3 PDF → Textract → DynamoDB
"""

import json
import boto3
import os
import re
from datetime import datetime
from decimal import Decimal
from urllib.parse import unquote_plus

# AWS Clients
s3_client = boto3.client('s3')
textract_client = boto3.client('textract')
dynamodb = boto3.resource('dynamodb')

# Environment variables
TABLE_NAME = os.environ.get('DYNAMODB_TABLE', 'Facturas-dev')
table = dynamodb.Table(TABLE_NAME)


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
        # Path format: cliente-test/20251017/factura.pdf
        parts = key.split('/')
        client_id = parts[0] if len(parts) > 0 else 'unknown'
        
        print(f"👤 Client ID: {client_id}")
        
        # 3. Call Textract to analyze invoice
        print("🔍 Calling Textract AnalyzeExpense...")
        
        textract_response = textract_client.analyze_expense(
            Document={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': key
                }
            }
        )
        
        print("✅ Textract completed")
        
        # 4. Parse Textract response
        print("📊 Parsing invoice data...")
        invoice_data = parse_invoice(textract_response)
        
        # 5. Build DynamoDB item
        dynamo_item = build_item(client_id, invoice_data, bucket, key, file_size)
        
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
                'total': float(invoice_data.get('total', 0))
            })
        }
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


def parse_invoice(textract_response):
    """
    Parse Textract response to extract invoice fields
    """
    data = {
        'numero_factura': None,
        'fecha': None,
        'ruc': None,
        'razon_social': None,
        'total': 0,
        'subtotal': 0,
        'igv': 0,
        'items': []
    }
    
    try:
        # Extract summary fields
        for doc in textract_response.get('ExpenseDocuments', []):
            
            # Summary fields (totals, dates, vendor)
            for field in doc.get('SummaryFields', []):
                field_type = field.get('Type', {}).get('Text', '')
                value = field.get('ValueDetection', {}).get('Text', '')
                
                if 'INVOICE' in field_type or 'RECEIPT' in field_type:
                    data['numero_factura'] = value
                    
                elif 'DATE' in field_type:
                    data['fecha'] = parse_date(value)
                    
                elif 'VENDOR' in field_type or 'NAME' in field_type:
                    data['razon_social'] = value
                    
                elif 'TOTAL' in field_type:
                    data['total'] = parse_amount(value)
                    
                elif 'SUBTOTAL' in field_type:
                    data['subtotal'] = parse_amount(value)
                    
                elif 'TAX' in field_type:
                    data['igv'] = parse_amount(value)
            
            # Line items (products/services)
            for line_group in doc.get('LineItemGroups', []):
                for idx, line_item in enumerate(line_group.get('LineItems', []), 1):
                    item = {'linea': idx}
                    
                    for field in line_item.get('LineItemExpenseFields', []):
                        field_type = field.get('Type', {}).get('Text', '')
                        value = field.get('ValueDetection', {}).get('Text', '')
                        
                        if 'ITEM' in field_type or 'DESCRIPTION' in field_type:
                            item['descripcion'] = value
                        elif 'QUANTITY' in field_type:
                            item['cantidad'] = parse_amount(value)
                        elif 'UNIT_PRICE' in field_type:
                            item['precio_unitario'] = parse_amount(value)
                        elif 'PRICE' in field_type or 'AMOUNT' in field_type:
                            item['precio_total'] = parse_amount(value)
                    
                    if item.get('descripcion'):
                        data['items'].append(item)
        
        # Extract additional data from raw text
        raw_text = extract_raw_text(textract_response)
        data = enrich_with_patterns(data, raw_text)
        
    except Exception as e:
        print(f"⚠️ Error parsing: {str(e)}")
    
    return data


def extract_raw_text(textract_response):
    """
    Extract all text from Textract blocks
    """
    text = ""
    for doc in textract_response.get('ExpenseDocuments', []):
        for block in doc.get('Blocks', []):
            if block.get('BlockType') == 'LINE':
                text += block.get('Text', '') + "\n"
    return text


def enrich_with_patterns(data, raw_text):
    """
    Use regex to find Peruvian invoice specific fields
    """
    # RUC (11 digits)
    ruc_match = re.search(r'R\.?U\.?C\.?\s*:?\s*(\d{11})', raw_text, re.IGNORECASE)
    if ruc_match:
        data['ruc'] = ruc_match.group(1)
    
    # Invoice number (F###-#######)
    factura_match = re.search(r'([FBE]\d{3}-\d+)', raw_text)
    if factura_match and not data['numero_factura']:
        data['numero_factura'] = factura_match.group(1)
    
    # IGV 18%
    igv_match = re.search(r'I\.?G\.?V\.?.*?(\d+\.?\d*)', raw_text, re.IGNORECASE)
    if igv_match and data['igv'] == 0:
        data['igv'] = parse_amount(igv_match.group(1))
    
    # Total
    total_match = re.search(r'TOTAL\s+(?:S/\s*)?(\d+[,\.]?\d*\.?\d*)', raw_text, re.IGNORECASE)
    if total_match and data['total'] == 0:
        data['total'] = parse_amount(total_match.group(1))
    
    # Subtotal
    subtotal_match = re.search(r'SUBTOTAL\s+(?:S/\s*)?(\d+[,\.]?\d*\.?\d*)', raw_text, re.IGNORECASE)
    if subtotal_match and data['subtotal'] == 0:
        data['subtotal'] = parse_amount(subtotal_match.group(1))
    
    return data


def build_item(client_id, invoice_data, bucket, key, file_size):
    """
    Build DynamoDB item structure
    """
    # Generate unique invoice ID
    ruc = invoice_data.get('ruc', 'UNKNOWN')
    numero = invoice_data.get('numero_factura', 'UNKNOWN')
    invoice_id = f"{ruc}-{numero}"
    
    # Get date
    fecha = invoice_data.get('fecha') or datetime.now().strftime('%Y-%m-%d')
    
    # Build item
    item = {
        # Keys
        'PK': f'CLIENT#{client_id}',
        'SK': f'INVOICE#{fecha}#{invoice_id}',
        
        # IDs
        'clientId': client_id,
        'invoiceId': invoice_id,
        'numeroFactura': numero,
        
        # Main fields (for queries)
        'fechaEmision': fecha,
        'emisorRUC': ruc,
        'emisorRazonSocial': invoice_data.get('razon_social'),
        'total': Decimal(str(invoice_data.get('total', 0))),
        'moneda': 'PEN',
        
        # Complete data
        'data': {
            'emisor': {
                'ruc': ruc,
                'razonSocial': invoice_data.get('razon_social')
            },
            'montos': {
                'total': Decimal(str(invoice_data.get('total', 0))),
                'subtotal': Decimal(str(invoice_data.get('subtotal', 0))),
                'igv': Decimal(str(invoice_data.get('igv', 0)))
            },
            'items': convert_items_to_decimal(invoice_data.get('items', []))
        },
        
        # S3 metadata
        'archivo': {
            's3Bucket': bucket,
            's3Key': key,
            's3Url': f's3://{bucket}/{key}',
            'nombreArchivo': key.split('/')[-1],
            'tamanoBytes': file_size
        },
        
        # Processing info
        'procesamiento': {
            'status': 'processed',
            'motor': 'textract',
            'timestampProcesado': datetime.utcnow().isoformat() + 'Z'
        },
        
        # GSI keys
        'GSI1PK': f'EMISOR#{ruc}',
        'GSI1SK': fecha,
        
        # Audit
        'audit': {
            'creadoEn': datetime.utcnow().isoformat() + 'Z',
            'creadoPor': 'lambda-processor'
        }
    }
    
    return item


def convert_items_to_decimal(items):
    """
    Convert all numeric values in items to Decimal
    """
    converted_items = []
    for item in items:
        converted_item = {}
        for key, value in item.items():
            if isinstance(value, (int, float)):
                converted_item[key] = Decimal(str(value))
            else:
                converted_item[key] = value
        converted_items.append(converted_item)
    return converted_items


def parse_amount(value):
    """
    Convert string to float (handles commas and periods)
    """
    if not value:
        return 0.0

    # Remove currency symbols and spaces
    cleaned = re.sub(r'[^\d.,]', '', str(value))
    # Replace comma with period
    cleaned = cleaned.replace(',', '.')

    try:
        return float(cleaned)
    except:
        return 0.0


def parse_date(date_str):
    """
    Parse date to ISO format (YYYY-MM-DD)
    """
    if not date_str:
        return datetime.now().strftime('%Y-%m-%d')
    
    # Try common Peruvian formats
    formats = ['%d/%m/%Y', '%d-%m-%Y', '%Y-%m-%d']
    
    for fmt in formats:
        try:
            date_obj = datetime.strptime(date_str, fmt)
            return date_obj.strftime('%Y-%m-%d')
        except:
            continue
    
    # If all fail, return current date
    return datetime.now().strftime('%Y-%m-%d')