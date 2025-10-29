#!/bin/bash

# Script para agregar el registro MX necesario para recibir emails en SES
# Dominio: flow-cfo-facturas.com
# Región: us-east-1

HOSTED_ZONE_ID="Z0016351VEOM0OQ9HSX1"
DOMAIN="flow-cfo-facturas.com"
MX_ENDPOINT="inbound-smtp.us-east-1.amazonaws.com"

echo "Agregando registro MX para $DOMAIN..."

# Crear el archivo JSON temporal con la configuración del registro MX
cat > /tmp/mx-record.json << EOF
{
  "Changes": [{
    "Action": "UPSERT",
    "ResourceRecordSet": {
      "Name": "$DOMAIN",
      "Type": "MX",
      "TTL": 300,
      "ResourceRecords": [{
        "Value": "10 $MX_ENDPOINT"
      }]
    }
  }]
}
EOF

# Aplicar el cambio en Route 53
aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch file:///tmp/mx-record.json

echo "Registro MX agregado exitosamente!"
echo "El registro puede tardar unos minutos en propagarse."

# Verificar el registro
echo ""
echo "Verificando el registro MX..."
aws route53 list-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --query "ResourceRecordSets[?Type=='MX']" \
  --output table

# Limpiar archivo temporal
rm /tmp/mx-record.json
