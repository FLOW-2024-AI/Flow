#!/usr/bin/env python3
"""
Batch validate DynamoDB invoices against SUNAT and update validacionSunat.
Defaults to the same table/credentials used by the Lambda.
"""

from __future__ import annotations

import argparse
import os
import re
import time
from datetime import datetime
from decimal import Decimal
from typing import Any, Dict, Iterable, Optional, Tuple

import boto3
import urllib3


SUNAT_CLIENT_ID: Optional[str] = None
SUNAT_CLIENT_SECRET: Optional[str] = None
SUNAT_RUC: Optional[str] = None

http = urllib3.PoolManager()
sunat_token_cache = {
    "token": None,
    "expires_at": None,
}


def refresh_sunat_env() -> None:
    global SUNAT_CLIENT_ID, SUNAT_CLIENT_SECRET, SUNAT_RUC
    SUNAT_CLIENT_ID = os.environ.get("SUNAT_CLIENT_ID")
    SUNAT_CLIENT_SECRET = os.environ.get("SUNAT_CLIENT_SECRET")
    SUNAT_RUC = os.environ.get("SUNAT_RUC")


def load_env_from_lambda(function_name: str, region: str) -> None:
    lambda_client = boto3.client("lambda", region_name=region)
    response = lambda_client.get_function_configuration(FunctionName=function_name)
    variables = response.get("Environment", {}).get("Variables", {})

    for key in ("SUNAT_CLIENT_ID", "SUNAT_CLIENT_SECRET", "SUNAT_RUC", "DYNAMODB_TABLE", "AWS_REGION"):
        if variables.get(key) and not os.environ.get(key):
            os.environ[key] = variables[key]

    refresh_sunat_env()


def convert_to_decimal(obj: Any) -> Any:
    if isinstance(obj, dict):
        return {k: convert_to_decimal(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [convert_to_decimal(v) for v in obj]
    if isinstance(obj, float):
        return Decimal(str(obj))
    return obj


def get_sunat_token() -> Optional[str]:
    if not SUNAT_CLIENT_ID or not SUNAT_CLIENT_SECRET:
        print("SUNAT credentials not configured, skipping validation")
        return None

    now = datetime.now().timestamp()
    if sunat_token_cache["token"] and sunat_token_cache["expires_at"]:
        if now < sunat_token_cache["expires_at"]:
            return sunat_token_cache["token"]

    url = f"https://api-seguridad.sunat.gob.pe/v1/clientesextranet/{SUNAT_CLIENT_ID}/oauth2/token/"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    body = urllib3.request.urlencode(
        {
            "grant_type": "client_credentials",
            "scope": "https://api.sunat.gob.pe/v1/contribuyente/contribuyentes",
            "client_id": SUNAT_CLIENT_ID,
            "client_secret": SUNAT_CLIENT_SECRET,
        }
    )

    response = http.request("POST", url, headers=headers, body=body)
    if response.status != 200:
        print(f"Failed to get SUNAT token: HTTP {response.status}")
        return None

    data = response.data.decode("utf-8")
    token_data = eval_json(data)
    token = token_data.get("access_token")
    expires_in = token_data.get("expires_in", 3600)
    sunat_token_cache["token"] = token
    sunat_token_cache["expires_at"] = now + expires_in - 60
    return token


def eval_json(raw: str) -> Dict[str, Any]:
    try:
        import json
        return json.loads(raw)
    except Exception:
        return {}


def validate_invoice_with_sunat(invoice_data: Dict[str, Any]) -> Dict[str, Any]:
    estados_comprobante = {
        "0": "NO EXISTE - Comprobante no informado",
        "1": "ACEPTADO - Comprobante aceptado",
        "2": "ANULADO - Comunicado en una baja",
        "3": "AUTORIZADO - Con autorización de imprenta",
        "4": "NO AUTORIZADO - No autorizado por imprenta",
    }

    estados_ruc = {
        "00": "ACTIVO",
        "01": "BAJA PROVISIONAL",
        "02": "BAJA PROV. POR OFICIO",
        "03": "SUSPENSION TEMPORAL",
        "10": "BAJA DEFINITIVA",
        "11": "BAJA DE OFICIO",
        "22": "INHABILITADO-VENT.UNICA",
    }

    condiciones_domicilio = {
        "00": "HABIDO",
        "09": "PENDIENTE",
        "11": "POR VERIFICAR",
        "12": "NO HABIDO",
        "20": "NO HALLADO",
    }

    if not SUNAT_RUC:
        return {
            "validado": False,
            "estado": "NO_VALIDADO",
            "motivo": "Credenciales SUNAT no configuradas",
            "estadoSunat": None,
            "timestampValidacion": datetime.utcnow().isoformat() + "Z",
        }

    token = get_sunat_token()
    if not token:
        return {
            "validado": False,
            "estado": "ERROR_TOKEN",
            "motivo": "No se pudo obtener token de SUNAT",
            "estadoSunat": None,
            "timestampValidacion": datetime.utcnow().isoformat() + "Z",
        }

    ruc_emisor = invoice_data.get("emisor", {}).get("numeroDocumento")
    numero_factura = invoice_data.get("numeroFactura", "")
    serie = invoice_data.get("serie", "")
    correlativo = invoice_data.get("correlativo", "")
    fecha_emision = invoice_data.get("fechaEmision", "")
    monto_total = invoice_data.get("montos", {}).get("total", 0)

    tipo_comprobante = invoice_data.get("tipoComprobante", "FACTURA")
    codigo_comprobante = "01" if tipo_comprobante == "FACTURA" else "03"

    if not ruc_emisor or not numero_factura:
        return {
            "validado": False,
            "estado": "DATOS_INCOMPLETOS",
            "motivo": "Faltan datos requeridos (RUC o numero de factura)",
            "estadoSunat": None,
            "timestampValidacion": datetime.utcnow().isoformat() + "Z",
        }

    if fecha_emision and "-" in fecha_emision:
        parts = fecha_emision.split("-")
        if len(parts) == 3:
            fecha_sunat = f"{parts[2]}/{parts[1]}/{parts[0]}"
        else:
            fecha_sunat = fecha_emision
    else:
        fecha_sunat = fecha_emision

    url = f"https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/{SUNAT_RUC}/validarcomprobante"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    try:
        numero_int = int(correlativo) if correlativo else 0
    except Exception:
        numero_int = 0

    body = {
        "numRuc": ruc_emisor,
        "codComp": codigo_comprobante,
        "numeroSerie": serie,
        "numero": numero_int,
        "fechaEmision": fecha_sunat,
        "monto": float(monto_total) if monto_total is not None else 0,
    }

    import json
    response = http.request("POST", url, headers=headers, body=json.dumps(body))

    if response.status != 200:
        return {
            "validado": False,
            "estado": "ERROR_API",
            "motivo": f"Error al consultar SUNAT: HTTP {response.status}",
            "estadoSunat": None,
            "timestampValidacion": datetime.utcnow().isoformat() + "Z",
            "errorDetalle": response.data.decode("utf-8"),
        }

    data = eval_json(response.data.decode("utf-8"))
    if not data.get("success"):
        return {
            "validado": False,
            "estado": "ERROR_API",
            "motivo": data.get("message", "Error desconocido de SUNAT"),
            "estadoSunat": None,
            "timestampValidacion": datetime.utcnow().isoformat() + "Z",
            "errorDetalle": response.data.decode("utf-8"),
        }

    response_data = data.get("data", {})
    estado_cp = response_data.get("estadoCp", "")
    estado_ruc = response_data.get("estadoRuc", "")
    condicion_domicilio = response_data.get("condDomiRuc", "")
    observaciones = response_data.get("observaciones", [])

    desc_comprobante = estados_comprobante.get(estado_cp, f"Codigo desconocido: {estado_cp}")
    desc_ruc = estados_ruc.get(estado_ruc, f"Codigo desconocido: {estado_ruc}")
    desc_domicilio = condiciones_domicilio.get(
        condicion_domicilio, f"Codigo desconocido: {condicion_domicilio}"
    )

    es_valido = estado_cp in ["1", "0"] and estado_ruc == "00"

    return {
        "validado": True,
        "esValido": es_valido,
        "estado": "VALIDO" if es_valido else "INVALIDO",
        "motivo": "Comprobante validado exitosamente"
        if es_valido
        else "Comprobante no valido en SUNAT",
        "estadoSunat": {
            "estadoComprobante": {"codigo": estado_cp, "descripcion": desc_comprobante},
            "estadoRuc": {"codigo": estado_ruc, "descripcion": desc_ruc},
            "condicionDomicilio": {
                "codigo": condicion_domicilio,
                "descripcion": desc_domicilio,
            },
            "observaciones": observaciones,
        },
        "timestampValidacion": datetime.utcnow().isoformat() + "Z",
    }


def parse_serie_correlativo(invoice_data: Dict[str, Any]) -> None:
    if invoice_data.get("serie") and invoice_data.get("correlativo"):
        return

    numero_factura = (invoice_data.get("numeroFactura") or "").strip().upper()
    if not numero_factura:
        return

    match = re.match(r"^([A-Z0-9]{1,4})[- ]?0*([0-9]{1,12})$", numero_factura)
    if not match:
        return

    invoice_data.setdefault("serie", match.group(1))
    invoice_data.setdefault("correlativo", match.group(2))


def build_invoice_data(item: Dict[str, Any]) -> Dict[str, Any]:
    data = item.get("data") if isinstance(item.get("data"), dict) else {}
    invoice_data: Dict[str, Any] = dict(data)

    invoice_data.setdefault("emisor", {})
    invoice_data.setdefault("receptor", {})
    invoice_data.setdefault("montos", {})

    if not invoice_data.get("numeroFactura") and item.get("numeroFactura"):
        invoice_data["numeroFactura"] = item.get("numeroFactura")
    if not invoice_data.get("fechaEmision") and item.get("fechaEmision"):
        invoice_data["fechaEmision"] = item.get("fechaEmision")
    if not invoice_data.get("tipoComprobante") and item.get("tipoComprobante"):
        invoice_data["tipoComprobante"] = item.get("tipoComprobante")

    if not invoice_data["emisor"].get("numeroDocumento") and item.get("emisorRUC"):
        invoice_data["emisor"]["numeroDocumento"] = str(item.get("emisorRUC"))
    if not invoice_data["emisor"].get("razonSocial") and item.get("emisorRazonSocial"):
        invoice_data["emisor"]["razonSocial"] = item.get("emisorRazonSocial")

    if not invoice_data["receptor"].get("numeroDocumento") and item.get("receptorRUC"):
        invoice_data["receptor"]["numeroDocumento"] = str(item.get("receptorRUC"))
    if not invoice_data["receptor"].get("razonSocial") and item.get("receptorRazonSocial"):
        invoice_data["receptor"]["razonSocial"] = item.get("receptorRazonSocial")

    if invoice_data["montos"].get("total") is None and item.get("total") is not None:
        invoice_data["montos"]["total"] = item.get("total")
    if not invoice_data["montos"].get("moneda") and item.get("moneda"):
        invoice_data["montos"]["moneda"] = item.get("moneda")

    parse_serie_correlativo(invoice_data)
    return invoice_data


def should_validate(invoice_data: Dict[str, Any]) -> Tuple[bool, str]:
    ruc_emisor = invoice_data.get("emisor", {}).get("numeroDocumento")
    numero_factura = invoice_data.get("numeroFactura")
    fecha_emision = invoice_data.get("fechaEmision")
    total = invoice_data.get("montos", {}).get("total")
    serie = invoice_data.get("serie")
    correlativo = invoice_data.get("correlativo")

    if not ruc_emisor or not numero_factura:
        return False, "missing_ruc_or_numero"
    if not fecha_emision:
        return False, "missing_fecha"
    if total is None:
        return False, "missing_total"

    try:
        if float(total) <= 0:
            return False, "total_zero"
    except Exception:
        return False, "invalid_total"

    if not serie or not correlativo:
        return False, "missing_serie_correlativo"
    if not str(correlativo).isdigit():
        return False, "invalid_correlativo"

    return True, "ok"


def is_pending_validation(item: Dict[str, Any]) -> bool:
    sunat = item.get("validacionSunat") or {}
    estado = sunat.get("estado") or "NO_VALIDADO"
    if not sunat.get("validado"):
        return True
    return estado in {"NO_VALIDADO", "ERROR_TOKEN", "ERROR_API", "ERROR_EXCEPCION", "DATOS_INCOMPLETOS"}


def iter_scan(table, limit: Optional[int] = None) -> Iterable[Dict[str, Any]]:
    last_key = None
    scanned = 0
    while True:
        params: Dict[str, Any] = {}
        if last_key:
            params["ExclusiveStartKey"] = last_key
        if limit:
            params["Limit"] = min(200, max(limit - scanned, 1))

        response = table.scan(**params)
        items = response.get("Items", [])
        for item in items:
            yield item
            scanned += 1
            if limit and scanned >= limit:
                return

        last_key = response.get("LastEvaluatedKey")
        if not last_key:
            break


def build_item_key(table, item: Dict[str, Any]) -> Dict[str, Any]:
    key_schema = table.key_schema
    key: Dict[str, Any] = {}
    for entry in key_schema:
        attr = entry["AttributeName"]
        if attr not in item:
            raise KeyError(f"Missing key attribute: {attr}")
        key[attr] = item[attr]
    return key


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate DynamoDB invoices with SUNAT.")
    parser.add_argument("--table", default=os.environ.get("DYNAMODB_TABLE"))
    parser.add_argument("--region", default=os.environ.get("AWS_REGION", "us-east-1"))
    parser.add_argument("--lambda-function", default="lambda-claude-windsurf")
    parser.add_argument("--only-pending", action="store_true", help="Validate only pending/errored items.")
    parser.add_argument("--limit", type=int, default=0, help="Max items to process (0 = no limit).")
    parser.add_argument("--sleep", type=float, default=0.2, help="Seconds to sleep between requests.")
    parser.add_argument("--dry-run", action="store_true", help="Do not update DynamoDB.")
    args = parser.parse_args()

    load_env_from_lambda(args.lambda_function, args.region)
    refresh_sunat_env()

    table_name = args.table or os.environ.get("DYNAMODB_TABLE")
    if not table_name:
        raise SystemExit("Missing table name. Set --table or DYNAMODB_TABLE.")

    dynamodb = boto3.resource("dynamodb", region_name=args.region)
    table = dynamodb.Table(table_name)

    total_seen = 0
    total_validated = 0
    total_skipped = 0
    total_errors = 0

    for item in iter_scan(table, limit=args.limit or None):
        total_seen += 1

        if args.only_pending and not is_pending_validation(item):
            total_skipped += 1
            continue

        try:
            invoice_data = build_invoice_data(item)
            ok, reason = should_validate(invoice_data)
            if not ok:
                total_skipped += 1
                if total_seen % 50 == 0:
                    print(f"Skipped {total_skipped} items (last reason: {reason})")
                continue

            result = validate_invoice_with_sunat(invoice_data)
            result = convert_to_decimal(result)

            if not args.dry_run:
                key = build_item_key(table, item)
                table.update_item(
                    Key=key,
                    UpdateExpression="SET validacionSunat = :v",
                    ExpressionAttributeValues={":v": result},
                )

            total_validated += 1
        except Exception as exc:
            total_errors += 1
            invoice_id = item.get("invoiceId") or "unknown"
            print(f"Error processing {invoice_id}: {exc}")
            continue

        if total_validated % 10 == 0:
            print(
                f"Validated {total_validated} items (seen={total_seen}, skipped={total_skipped})"
            )

        time.sleep(max(args.sleep, 0))

    print(
        "Done. seen=%d validated=%d skipped=%d errors=%d"
        % (total_seen, total_validated, total_skipped, total_errors)
    )


if __name__ == "__main__":
    main()
