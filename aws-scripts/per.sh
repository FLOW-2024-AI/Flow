#!/bin/bash
set -e

# Configuración (sobrescribe con variables de entorno si corresponde)
BUCKET="${BUCKET:-flow-cfo-facturas-invoices}"
LAMBDA_ARN="${LAMBDA_ARN:-arn:aws:lambda:us-east-1:886436955626:function:InvoiceProcessor-dev}"

# Aplica notificación S3 → Lambda para nuevos objetos (ObjectCreated)
aws s3api put-bucket-notification-configuration \
  --bucket "$BUCKET" \
  --notification-configuration '{
    "LambdaFunctionConfigurations": [
      {
        "Id": "invoke-invoiceprocessor-on-create",
        "LambdaFunctionArn": "'"$LAMBDA_ARN"'",
        "Events": ["s3:ObjectCreated:*"]
      }
    ]
  }'

echo "✓ Notificación S3 configurada en bucket $BUCKET hacia $LAMBDA_ARN"
