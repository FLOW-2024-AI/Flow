#!/bin/bash

# Script para desplegar la función Lambda FacturasPostgresWriter-poc
# Requiere Docker y AWS CLI configurados

set -e

echo "🚀 Desplegando FacturasPostgresWriter-poc Lambda..."

# Variables
AWS_ACCOUNT_ID="886436955626"
AWS_REGION="us-east-1"
ECR_REPO="facturas-postgres-writer"
IMAGE_TAG="latest"
LAMBDA_FUNCTION_NAME="FacturasPostgresWriter-poc"

# Full image name
ECR_IMAGE="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}"

echo "📦 Construyendo imagen Docker..."
docker build -t ${ECR_REPO}:${IMAGE_TAG} -f Dockerfile.postgres-writer .

echo "🔐 Autenticando con ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

echo "🏷️  Etiquetando imagen..."
docker tag ${ECR_REPO}:${IMAGE_TAG} ${ECR_IMAGE}

echo "⬆️  Subiendo imagen a ECR..."
docker push ${ECR_IMAGE}

echo "🔄 Actualizando función Lambda..."
aws lambda update-function-code \
    --function-name ${LAMBDA_FUNCTION_NAME} \
    --image-uri ${ECR_IMAGE}

echo "⏳ Esperando que la actualización se complete..."
aws lambda wait function-updated --function-name ${LAMBDA_FUNCTION_NAME}

echo "✅ Despliegue completado exitosamente!"
echo "📝 Nueva versión de ${LAMBDA_FUNCTION_NAME} desplegada"
