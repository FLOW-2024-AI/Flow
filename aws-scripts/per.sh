#!/bin/bash
set -e

# Elimina la política si ya existe (ignora error si no existe)
aws s3api put-bucket-notification-configuration \
  --bucket flow-facturas \
  --notification-configuration '{
    "LambdaFunctionConfigurations": [
      {
        "Id": "invoke-invoiceprocessor-on-create",
        "LambdaFunctionArn": "arn:aws:lambda:us-east-1:069662085753:function:InvoiceProcessor-dev",
        "Events": ["s3:ObjectCreated:*"]
      }
    ]
  }'
