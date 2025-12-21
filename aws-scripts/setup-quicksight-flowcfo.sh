#!/usr/bin/env bash
set -euo pipefail

# Configuración básica (ajusta si necesitas otra región o nombres)
AWS_REGION="us-east-1"
QUICKSIGHT_ACCOUNT="069662085753"
QUICKSIGHT_ROLE_ARN="arn:aws:iam::069662085753:role/service-role/aws-quicksight-service-role-v0"
QUICKSIGHT_SG="sg-0345dc869295a34ab"
VPC_ID="vpc-0b3841958c679a90c"
VPC_CONNECTION_ID="FlowcfoVpcConnection5"
VPC_CONNECTION_NAME="Flowcfo Aurora VPC"

VPC_DNS_RESOLVERS=(
  172.31.0.2
)

AURORA_CLUSTER="aurora-facturas-poc"
AURORA_INSTANCE="aurora-facturas-poc-instance"
NEW_AURORA_SG_NAME="aurora-quicksight-allow"

DATA_SOURCE_ID="facturas-aurora-ds"
DATA_SOURCE_NAME="Facturas Aurora Postgres"
DATASET_ID="facturas-ds"
DATASET_NAME="Facturas"
DATASET_TABLE="facturas"

QS_SUBNETS=(
  subnet-05200274f9cc34866
  subnet-05c9aa28de1d615c7
  subnet-0f174ac2909717ff8
  subnet-07543468b53b60f0a
  subnet-011b91681324ab2ef
  subnet-0d2068d7f00a45af6
)

function describe_sg() {
  aws ec2 describe-security-groups --region "${AWS_REGION}" \
    --filters "Name=group-name,Values=${NEW_AURORA_SG_NAME}" "Name=vpc-id,Values=${VPC_ID}" \
    --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || echo ""
}

function create_or_get_sg() {
  local sg_id
  sg_id=$(describe_sg)
  if [[ -n "${sg_id}" && "${sg_id}" != "None" ]]; then
    echo "${sg_id}"
    return
  fi

  sg_id=$(aws ec2 create-security-group \
    --region "${AWS_REGION}" \
    --description "Permite QuickSight sobre 5432" \
    --group-name "${NEW_AURORA_SG_NAME}" \
    --vpc-id "${VPC_ID}" \
    --query 'GroupId' \
    --output text)

  aws ec2 authorize-security-group-ingress \
    --region "${AWS_REGION}" \
    --group-id "${sg_id}" \
    --protocol tcp \
    --port 5432 \
    --source-group "${QUICKSIGHT_SG}" >/dev/null

  aws ec2 authorize-security-group-egress \
    --region "${AWS_REGION}" \
    --group-id "${sg_id}" \
    --ip-permissions '[{"IpProtocol":"-1","IpRanges":[{"CidrIp":"0.0.0.0/0"}]}]' >/dev/null 2>&1 || true

  echo "${sg_id}"
}

function update_rds_sg() {
  local sg_id="$1"
  aws rds modify-db-cluster \
    --region "${AWS_REGION}" \
    --db-cluster-identifier "${AURORA_CLUSTER}" \
    --vpc-security-group-ids "${sg_id}" \
    --apply-immediately >/dev/null

  aws rds wait db-cluster-available --region "${AWS_REGION}" --db-cluster-identifier "${AURORA_CLUSTER}"
}

function ensure_vpc_connection() {
  local status
  if status=$(aws quicksight describe-vpc-connection \
    --aws-account-id "${QUICKSIGHT_ACCOUNT}" \
    --vpc-connection-id "${VPC_CONNECTION_ID}" \
    --region "${AWS_REGION}" \
    --query 'VPCConnection.Status' \
    --output text 2>/dev/null); then
    if [[ "${status}" == "CREATION_SUCCESSFUL" ]]; then
      echo "VPC connection ${VPC_CONNECTION_ID} ya existe y está disponible."
      return
    fi
    if [[ "${status}" == "DELETED" ]]; then
      echo "VPC connection anterior borrada, se recreará."
    fi
  fi

  aws quicksight create-vpc-connection \
    --aws-account-id "${QUICKSIGHT_ACCOUNT}" \
    --vpc-connection-id "${VPC_CONNECTION_ID}" \
    --name "${VPC_CONNECTION_NAME}" \
    --subnet-ids "${QS_SUBNETS[@]}" \
    --security-group-ids "${QUICKSIGHT_SG}" \
    --dns-resolvers "${VPC_DNS_RESOLVERS[@]}" \
    --role-arn "${QUICKSIGHT_ROLE_ARN}" \
    --region "${AWS_REGION}"

  while true; do
    local status=$(aws quicksight describe-vpc-connection \
      --aws-account-id "${QUICKSIGHT_ACCOUNT}" \
      --vpc-connection-id "${VPC_CONNECTION_ID}" \
      --region "${AWS_REGION}" \
      --query 'VPCConnection.Status' \
      --output text)
    echo "VPC connection status: ${status}"
    if [[ "${status}" == "CREATION_SUCCESSFUL" ]]; then
      break
    fi
    if [[ "${status}" == "CREATION_FAILED" ]]; then
      echo "No se pudo crear la conexión VPC, revisa la consola."
      exit 1
    fi
    sleep 5
  done
}

function delete_data_source_if_exists() {
  local exists
  exists=$(aws quicksight list-data-sources \
    --aws-account-id "${QUICKSIGHT_ACCOUNT}" \
    --region "${AWS_REGION}" \
    --query "DataSources[?DataSourceId=='${DATA_SOURCE_ID}'].DataSourceId" \
    --output text)
  if [[ -n "${exists}" && "${exists}" != "None" ]]; then
    aws quicksight delete-data-source \
      --aws-account-id "${QUICKSIGHT_ACCOUNT}" \
      --data-source-id "${DATA_SOURCE_ID}" \
      --region "${AWS_REGION}"
  fi
}

function create_data_source() {
  aws quicksight create-data-source \
    --aws-account-id "${QUICKSIGHT_ACCOUNT}" \
    --data-source-id "${DATA_SOURCE_ID}" \
    --name "${DATA_SOURCE_NAME}" \
    --type AURORA_POSTGRESQL \
    --data-source-parameters "{\"AuroraPostgreSqlParameters\":{\"Host\":\"aurora-facturas-poc.cluster-cwx8i4i6gg10.us-east-1.rds.amazonaws.com\",\"Port\":5432,\"Database\":\"facturas_db\"}}" \
    --credentials '{"CredentialPair":{"Username":"postgres","Password":"TuClaveSegura123!"}}' \
    --vpc-connection-properties "{\"VpcConnectionArn\":\"arn:aws:quicksight:${AWS_REGION}:${QUICKSIGHT_ACCOUNT}:vpcConnection/${VPC_CONNECTION_ID}\"}" \
    --ssl-properties '{"DisableSsl":false}' \
    --region "${AWS_REGION}"

  while true; do
    local status=$(aws quicksight describe-data-source \
      --aws-account-id "${QUICKSIGHT_ACCOUNT}" \
      --data-source-id "${DATA_SOURCE_ID}" \
      --region "${AWS_REGION}" \
      --query 'DataSource.Status' \
      --output text)
    echo "Data source status: ${status}"
    if [[ "${status}" == "CREATION_SUCCESSFUL" ]]; then
      break
    fi
    if [[ "${status}" == "CREATION_FAILED" ]]; then
      local err=$(aws quicksight describe-data-source \
        --aws-account-id "${QUICKSIGHT_ACCOUNT}" \
        --data-source-id "${DATA_SOURCE_ID}" \
        --region "${AWS_REGION}" \
        --query 'DataSource.ErrorInfo.Message' \
        --output text)
      echo "ERROR: ${err}"
      exit 1
    fi
    sleep 5
  done
}

function delete_dataset_if_exists() {
  local exists
  exists=$(aws quicksight list-data-sets \
    --aws-account-id "${QUICKSIGHT_ACCOUNT}" \
    --region "${AWS_REGION}" \
    --query "DataSetSummaries[?DataSetId=='${DATASET_ID}'].DataSetId" \
    --output text)
  if [[ -n "${exists}" && "${exists}" != "None" ]]; then
    aws quicksight delete-data-set \
      --aws-account-id "${QUICKSIGHT_ACCOUNT}" \
      --data-set-id "${DATASET_ID}" \
      --region "${AWS_REGION}"
  fi
}

function create_dataset() {
  local ds_arn="arn:aws:quicksight:${AWS_REGION}:${QUICKSIGHT_ACCOUNT}:datasource/${DATA_SOURCE_ID}"
  read -r -d '' physical_map <<'EOF'
{
  "facturas": {
    "RelationalTable": {
      "DataSourceArn": "REPLACE_DATASOURCE_ARN",
      "Schema": "public",
      "Name": "facturas",
      "InputColumns": [
        {"Name":"invoice_id","Type":"STRING"},
        {"Name":"client_id","Type":"STRING"},
        {"Name":"monto_total","Type":"DECIMAL"},
        {"Name":"fecha_emision","Type":"DATETIME"},
        {"Name":"sunat_es_valido","Type":"BOOLEAN"}
      ]
    }
  }
}
EOF

  physical_map=${physical_map//REPLACE_DATASOURCE_ARN/${ds_arn}}

  aws quicksight create-data-set \
    --aws-account-id "${QUICKSIGHT_ACCOUNT}" \
    --data-set-id "${DATASET_ID}" \
    --name "${DATASET_NAME}" \
    --physical-table-map "${physical_map}" \
    --logical-table-map "{\"facturasLogical\":{\"Alias\":\"Facturas\",\"Source\":{\"PhysicalTableId\":\"facturas\"}}}" \
    --import-mode SPICE \
    --region "${AWS_REGION}"

  while true; do
    local status
    if ! status=$(
      aws quicksight describe-data-set \
        --aws-account-id "${QUICKSIGHT_ACCOUNT}" \
        --data-set-id "${DATASET_ID}" \
        --region "${AWS_REGION}" \
        --query 'DataSet.Status' \
        --output text 2>/dev/null
    ); then
      echo "Data set aún no aparece, reintentando..."
      sleep 5
      continue
    fi
    echo "Data set status: ${status}"
    if [[ "${status}" == "CREATION_SUCCESSFUL" ]]; then
      break
    fi
    if [[ "${status}" == "CREATION_FAILED" ]]; then
      echo "Fallo al crear el dataset."
      exit 1
    fi
    sleep 5
  done
}

sg_id=$(create_or_get_sg)
echo "Security group para Aurora creado/recuperado: ${sg_id}"

echo "Actualizando Aurora para usar ${sg_id}..."
update_rds_sg "${sg_id}"

echo "Recreando la conexión VPC de QuickSight..."
ensure_vpc_connection

echo "Eliminando datasource previo (si existiera)..."
delete_data_source_if_exists

echo "Creando datasource nuevo..."
create_data_source

echo "Eliminando dataset previo (si existiera)..."
delete_dataset_if_exists

echo "Creando dataset ‘${DATASET_NAME}’..."
create_dataset

cat <<'EOF'
+
Listo: ahora puedes abrir QuickSight en la consola, crear el dashboard desde el dataset "Facturas" y obtener la URL embebida.
Cuando tengas la URL, actualiza `app/apps/dashboard/page.tsx` y `components/QuickSightEmbed.tsx` con el iframe correspondiente.
EOF
