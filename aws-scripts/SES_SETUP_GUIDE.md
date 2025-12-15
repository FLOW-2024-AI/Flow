# Guía de Configuración de AWS SES para Recepción de Facturas

## 📋 Resumen del Sistema

Este sistema permite recibir facturas por email y procesarlas automáticamente:

**Flujo**: Email → SES → SNS → Lambda → S3 (con validación OCR vía Textract)

## 🎯 Componentes del Sistema

### 1. **Route 53** (DNS)
- **Dominio**: `flow-cfo.com`
- **Hosted Zone ID**: `Z00045293VFM4AYD5PO7E`
- **Email receptor**: `demo@flow-cfo.com`

### 2. **AWS SES** (Simple Email Service)
- **Región**: `us-east-1`
- **Identidad verificada**: `flow-cfo.com`
- **Estado**: ✅ Success

### 3. **SNS Topic**
- **Nombre**: `facturas-lambda`
- **ARN**: `arn:aws:sns:us-east-1:069662085753:facturas-lambda`

### 4. **Lambda Function**
- **Nombre**: `extract-pdf-to-s3`
- **Runtime**: Python 3.x
- **Archivo**: `extract-pdf-to-s3.py`

### 5. **S3 Bucket**
- **Propósito**: Almacenar PDFs de facturas validadas
- **Estructura**: `BUCKET/YYYY/MM/DD/UUID_filename.pdf`

---

## 📝 Pasos de Configuración

### PASO 1: Configurar Registro MX en Route 53

**¿Por qué?** El registro MX le dice a los servidores de email dónde enviar los correos para tu dominio.

**Script**: `setup-ses-mx-record.sh`

```bash
# Ejecutar el script
chmod +x setup-ses-mx-record.sh
./setup-ses-mx-record.sh
```

**Resultado esperado**:
- Registro MX: `flow-cfo.com` → `10 inbound-smtp.us-east-1.amazonaws.com`
- TTL: 300 segundos

**Verificar**:
```bash
aws route53 list-resource-record-sets \
  --hosted-zone-id Z00045293VFM4AYD5PO7E \
  --query "ResourceRecordSets[?Type=='MX']" \
  --output table
```

---

### PASO 2: Crear S3 Bucket para facturas entrantes

**Nombre oficial**: `flow-facturas-prod` (ya lo creamos con Terraform)

```bash
# Crear bucket si aún no existe
aws s3 mb s3://flow-facturas-prod --region us-east-1

# Activar versionado para conservar historiales
aws s3api put-bucket-versioning \
  --bucket flow-facturas-prod \
  --versioning-configuration Status=Enabled

# Crear carpeta base (el script de SES usa incoming-emails/)
aws s3api put-object --bucket flow-facturas-prod --key incoming-emails/
```

Luego se deberá aplicar la política que permite a SES escribir en la ruta `incoming-emails/` (el script `configure-ses-s3-permissions.sh` lo hace automáticamente).

---

### PASO 3: Verificar/Crear SNS Topic

```bash
# Listar topics existentes
aws sns list-topics

# Si no existe, crear el topic
aws sns create-topic --name facturas-lambda
```

**ARN esperado**: `arn:aws:sns:us-east-1:069662085753:facturas-lambda`

---

### PASO 4: Crear IAM Role para Lambda

**Nombre**: `lambda-ses-facturas-role`

**Políticas necesarias**:

1. **S3 Access**:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "s3:PutObject",
      "s3:GetObject",
      "s3:HeadObject"
    ],
    "Resource": "arn:aws:s3:::flow-facturas-prod/*"
  }]
}
```

2. **Textract Access**:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "textract:DetectDocumentText"
    ],
    "Resource": "*"
  }]
}
```

3. **CloudWatch Logs** (AWS Managed):
- Adjuntar: `arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole`

---

### PASO 5: Crear Lambda Function

**Configuración**:
- **Nombre**: `extract-pdf-to-s3`
- **Runtime**: Python 3.11 o superior
- **Handler**: `extract-pdf-to-s3.handler`
- **Timeout**: 5 minutos (300 segundos)
- **Memory**: 512 MB (ajustar según necesidad)
- **IAM Role**: `lambda-ses-facturas-role`

**Variables de entorno**:
```bash
DEST_BUCKET=flow-facturas-prod
BASE_PREFIX=facturas
DELAY_SECONDS=15
DATE_TZ_OFFSET_MINUTES=-300
VALIDATION_MIN_MATCHES=2
```

**Código**: Subir `extract-pdf-to-s3.py` (ya modificado para SNS)

```bash
# Crear deployment package
cd aws-scripts
zip lambda-package.zip extract-pdf-to-s3.py

# Crear la función (asumiendo que el role ya existe)
aws lambda create-function \
  --function-name extract-pdf-to-s3 \
  --runtime python3.11 \
  --role arn:aws:iam::069662085753:role/lambda-ses-facturas-role \
  --handler extract-pdf-to-s3.handler \
  --zip-file fileb://lambda-package.zip \
  --timeout 300 \
  --memory-size 512 \
  --environment Variables='{
    "DEST_BUCKET":"flow-facturas-prod",
    "BASE_PREFIX":"facturas",
    "DELAY_SECONDS":"15",
    "DATE_TZ_OFFSET_MINUTES":"-300",
    "VALIDATION_MIN_MATCHES":"2"
  }'
```

---

### PASO 6: Suscribir Lambda al SNS Topic

```bash
# Suscribir Lambda al topic SNS
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:069662085753:facturas-lambda \
  --protocol lambda \
  --notification-endpoint arn:aws:lambda:us-east-1:069662085753:function:extract-pdf-to-s3

aws lambda add-permission \
  --function-name extract-pdf-to-s3 \
  --statement-id AllowSNSInvoke \
  --action lambda:InvokeFunction \
  --principal sns.amazonaws.com \
  --source-arn arn:aws:sns:us-east-1:069662085753:facturas-lambda
```

---

### PASO 7: Configurar SES Receipt Rule Set

#### 7.1. Crear Rule Set (si no existe)

```bash
# Crear rule set
aws ses create-receipt-rule-set --rule-set-name inbound-email-rule-set

# Activar rule set
aws ses set-active-receipt-rule-set --rule-set-name inbound-email-rule-set
```

#### 7.2. Crear Receipt Rule

**Configuración de la regla**:
- **Rule Name**: `inbound-email-rule`
- **Recipients**: `demo@flow-cfo.com`
- **Actions**: Guardar el mensaje en S3 y publicar en SNS

```bash
# Crear la regla si no existe todavía
aws ses create-receipt-rule \
  --rule-set-name inbound-email-rule-set \
  --rule '{
    "Name": "inbound-email-rule",
    "Enabled": true,
    "Recipients": ["demo@flow-cfo.com"],
    "Actions": [
      {
        "S3Action": {
          "BucketName": "flow-facturas-prod",
          "ObjectKeyPrefix": "incoming-emails/"
        }
      },
      {
        "SNSAction": {
          "TopicArn": "arn:aws:sns:us-east-1:069662085753:facturas-lambda",
          "Encoding": "UTF-8"
        }
      }
    ],
    "ScanEnabled": true
  }'
```

**Nota**: El script `configure-ses-s3-permissions.sh` también deja esta regla con la configuración correcta después de aplicar la política al bucket.

---

### PASO 8: Dar Permiso a SES para Publicar en SNS

```bash
# Crear política de acceso en el SNS topic
aws sns set-topic-attributes \
  --topic-arn arn:aws:sns:us-east-1:069662085753:facturas-lambda \
  --attribute-name Policy \
  --attribute-value '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {
        "Service": "ses.amazonaws.com"
      },
      "Action": "SNS:Publish",
      "Resource": "arn:aws:sns:us-east-1:069662085753:facturas-lambda",
      "Condition": {
        "StringEquals": {
          "AWS:SourceAccount": "069662085753"
        }
      }
    }]
  }'
```

---
## 🧪 Pruebas

### Prueba 1: Enviar Email de Prueba

```bash
# Enviar un email de prueba con un PDF adjunto a:
# demo@flow-cfo.com
```

### Prueba 2: Monitorear Lambda Logs

```bash
# Ver logs en tiempo real
aws logs tail /aws/lambda/extract-pdf-to-s3 --follow
```

### Prueba 3: Verificar S3

```bash
# Listar archivos subidos
aws s3 ls s3://flow-facturas-prod/incoming-emails/ --recursive
```

---

## 📊 Validaciones del Sistema

El Lambda realiza estas validaciones en cada PDF:

1. **RUC**: Detecta RUC peruano (formato: 10xxxxxxxxx o 20xxxxxxxxx)
2. **Serie**: Detecta número de factura/boleta (formato: F001-00000001)
3. **Monto Total**: Detecta montos en soles o dólares
4. **Keywords**: Busca palabras clave como "FACTURA", "BOLETA", "SUNAT"

**Mínimo requerido**: 2 de 4 validaciones (`VALIDATION_MIN_MATCHES=2`)

---

## 🔧 Comandos Útiles

### Ver identidades SES
```bash
aws ses list-identities
```

### Ver estado de verificación
```bash
aws ses get-identity-verification-attributes --identities flow-cfo.com
```

### Ver rule sets activos
```bash
aws ses describe-active-receipt-rule-set
```

### Ver todas las reglas
```bash
aws ses describe-receipt-rule-set --rule-set-name inbound-email-rule-set
```

### Ver suscripciones SNS
```bash
aws sns list-subscriptions-by-topic \
  --topic-arn arn:aws:sns:us-east-1:069662085753:facturas-lambda
```

### Ver logs del Lambda
```bash
aws logs tail /aws/lambda/extract-pdf-to-s3 --follow
```

---

## 🎯 Checklist de Configuración

- [ ] **Paso 1**: Registro MX en Route 53 ✅
- [ ] **Paso 2**: S3 Bucket creado
- [ ] **Paso 3**: SNS Topic verificado/creado
- [ ] **Paso 4**: IAM Role para Lambda creado
- [ ] **Paso 5**: Lambda Function desplegada con código y variables
- [ ] **Paso 6**: Lambda suscrito al SNS topic
- [ ] **Paso 7**: SES Receipt Rule configurada
- [ ] **Paso 8**: Permisos SES → SNS configurados
- [ ] **Paso 9**: Prueba end-to-end exitosa

---

## 📞 Troubleshooting

### Error: "No active receipt rule set"
```bash
aws ses set-active-receipt-rule-set --rule-set-name inbound-email-rule-set
```

### Error: Lambda no se ejecuta
1. Verificar que Lambda tenga permiso para ser invocado por SNS
2. Verificar suscripción SNS está confirmada
3. Ver logs de CloudWatch

### Error: PDFs no se suben a S3
1. Verificar permisos IAM del Lambda
2. Verificar variable `DEST_BUCKET` está correcta
3. Verificar el bucket existe

### Email no llega
1. Verificar registro MX con `dig flow-cfo.com MX`
2. Verificar Receipt Rule está activa (inbound-email-rule-set)
3. Verificar que el destinatario sea `demo@flow-cfo.com`

---

## 📝 Notas Importantes

1. **Región**: Todo debe estar en `us-east-1` para SES receiving
2. **Sandbox Mode**: Si SES está en sandbox, solo puede recibir emails de direcciones verificadas
3. **Límites**: Textract tiene límites de rate (por eso el `DELAY_SECONDS`)
4. **Costos**:
   - SES: $0.10 por 1000 emails recibidos
   - Textract: $1.50 por 1000 páginas
   - S3: Storage estándar
   - Lambda: Muy bajo (milisegundos de ejecución)

---

## 🔗 Referencias

- [SES Receiving Email](https://docs.aws.amazon.com/ses/latest/dg/receiving-email.html)
- [SES Receipt Rules](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-receipt-rules.html)
- [Textract DetectDocumentText](https://docs.aws.amazon.com/textract/latest/dg/API_DetectDocumentText.html)
- [Route 53 MX Records](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#MXFormat)

---

**Última actualización**: 2025-10-28
**Cuenta AWS**: 069662085753
**Usuario**: SES-FLOW
