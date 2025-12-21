# Infraestructura AWS WindSurf

## Contenido
- `rds-aurora-serverless.tf`: cluster Aurora PostgreSQL Serverless v2 + subnets.
- `sqs-retry-setup.tf`: cola principal + DLQ para reintentos.
- `terraform.tfvars`: define variables específicas del entorno.

## Pasos para desplegar

1. Instala Terraform (ya lo hiciste): `terraform -v`
2. Ajusta los valores en `terraform.tfvars` antes de aplicar (especialmente `db_master_password` y `environment`).
3. Corre los comandos:

```bash
cd ~/windsurf-aws-infra/infra
terraform init
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

4. Anota las salidas (`endpoint`, `puerto`, `usuario`, colas SQS) para usarlas en los próximos pasos.

5. Cuando termines, sigue la guía principal (`aws-scripts/db-schema.sql`, scripts de Lambdas, bucket, etc.) con esos datos.
