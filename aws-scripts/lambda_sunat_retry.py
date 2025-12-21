import os
import re
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Any, Dict, Optional, Tuple

import boto3
import urllib3


TABLE_NAME = os.environ.get('DYNAMODB_TABLE', 'Facturas-dev')
REGION = os.environ.get('AWS_REGION', 'us-east-1')

MAX_ITEMS = int(os.environ.get('SUNAT_RETRY_MAX_ITEMS', '100'))
MAX_RETRIES = int(os.environ.get('SUNAT_RETRY_MAX_ATTEMPTS', '5'))
BACKOFF_MINUTES = [
    int(value)
    for value in os.environ.get('SUNAT_RETRY_BACKOFF_MINUTES', '1,5,15,60').split(',')
    if value.strip()
]

RETRYABLE_STATUSES = {'ERROR_TOKEN', 'ERROR_API', 'ERROR_EXCEPCION', 'NO_VALIDADO'}
NON_RETRY_STATUSES = {'INVALIDO', 'VALIDO', 'DATOS_INCOMPLETOS'}
RETRYABLE_HTTP = {429, 500, 502, 503, 504}

SUNAT_CLIENT_ID = os.environ.get('SUNAT_CLIENT_ID')
SUNAT_CLIENT_SECRET = os.environ.get('SUNAT_CLIENT_SECRET')
SUNAT_RUC = os.environ.get('SUNAT_RUC')

http = urllib3.PoolManager()
sunat_token_cache = {'token': None, 'expires_at': None}

dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(TABLE_NAME)


def convert_to_decimal(obj: Any) -> Any:
    if isinstance(obj, dict):
        return {k: convert_to_decimal(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [convert_to_decimal(v) for v in obj]
    if isinstance(obj, float):
        return Decimal(str(obj))
    return obj


def parse_iso_datetime(value: str) -> Optional[datetime]:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace('Z', '+00:00'))
    except Exception:
        return None


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def isoformat_z(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat().replace('+00:00', 'Z')


def extract_http_code(text: str) -> Optional[int]:
    if not text:
        return None
    match = re.search(r'HTTP\\s+(\\d{3})', text)
    if match:
        try:
            return int(match.group(1))
        except ValueError:
            return None
    return None


def get_sunat_token() -> Optional[str]:
    if not SUNAT_CLIENT_ID or not SUNAT_CLIENT_SECRET:
        return None

    now = datetime.now().timestamp()
    if sunat_token_cache['token'] and sunat_token_cache['expires_at']:
        if now < sunat_token_cache['expires_at']:
            return sunat_token_cache['token']

    url = (
        f"https://api-seguridad.sunat.gob.pe/v1/clientesextranet/"
        f"{SUNAT_CLIENT_ID}/oauth2/token/"
    )
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    body = urllib3.request.urlencode(
        {
            'grant_type': 'client_credentials',
            'scope': 'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes',
            'client_id': SUNAT_CLIENT_ID,
            'client_secret': SUNAT_CLIENT_SECRET,
        }
    )

    response = http.request('POST', url, headers=headers, body=body)
    if response.status != 200:
        return None

    data = response.data.decode('utf-8')
    token_data = eval_json(data)
    token = token_data.get('access_token')
    expires_in = token_data.get('expires_in', 3600)
    sunat_token_cache['token'] = token
    sunat_token_cache['expires_at'] = now + expires_in - 60
    return token


def eval_json(raw: str) -> Dict[str, Any]:
    try:
        import json
        return json.loads(raw)
    except Exception:
        return {}


def validate_invoice_with_sunat(invoice_data: Dict[str, Any]) -> Dict[str, Any]:
    estados_comprobante = {
        '0': 'NO EXISTE - Comprobante no informado',
        '1': 'ACEPTADO - Comprobante aceptado',
        '2': 'ANULADO - Comunicado en una baja',
        '3': 'AUTORIZADO - Con autorizacion de imprenta',
        '4': 'NO AUTORIZADO - No autorizado por imprenta',
    }

    estados_ruc = {
        '00': 'ACTIVO',
        '01': 'BAJA PROVISIONAL',
        '02': 'BAJA PROV. POR OFICIO',
        '03': 'SUSPENSION TEMPORAL',
        '10': 'BAJA DEFINITIVA',
        '11': 'BAJA DE OFICIO',
        '22': 'INHABILITADO-VENT.UNICA',
    }

    condiciones_domicilio = {
        '00': 'HABIDO',
        '09': 'PENDIENTE',
        '11': 'POR VERIFICAR',
        '12': 'NO HABIDO',
        '20': 'NO HALLADO',
    }

    if not SUNAT_RUC:
        return {
            'validado': False,
            'estado': 'NO_VALIDADO',
            'motivo': 'Credenciales SUNAT no configuradas',
            'estadoSunat': None,
            'timestampValidacion': datetime.utcnow().isoformat() + 'Z',
        }

    token = get_sunat_token()
    if not token:
        return {
            'validado': False,
            'estado': 'ERROR_TOKEN',
            'motivo': 'No se pudo obtener token de SUNAT',
            'estadoSunat': None,
            'timestampValidacion': datetime.utcnow().isoformat() + 'Z',
        }

    ruc_emisor = invoice_data.get('emisor', {}).get('numeroDocumento')
    numero_factura = invoice_data.get('numeroFactura', '')
    serie = invoice_data.get('serie', '')
    correlativo = invoice_data.get('correlativo', '')
    fecha_emision = invoice_data.get('fechaEmision', '')
    monto_total = invoice_data.get('montos', {}).get('total', 0)

    tipo_comprobante = invoice_data.get('tipoComprobante', 'FACTURA')
    codigo_comprobante = '01' if tipo_comprobante == 'FACTURA' else '03'

    if not ruc_emisor or not numero_factura:
        return {
            'validado': False,
            'estado': 'DATOS_INCOMPLETOS',
            'motivo': 'Faltan datos requeridos (RUC o numero de factura)',
            'estadoSunat': None,
            'timestampValidacion': datetime.utcnow().isoformat() + 'Z',
        }

    if fecha_emision and '-' in fecha_emision:
        parts = fecha_emision.split('-')
        if len(parts) == 3:
            fecha_sunat = f"{parts[2]}/{parts[1]}/{parts[0]}"
        else:
            fecha_sunat = fecha_emision
    else:
        fecha_sunat = fecha_emision

    url = f"https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/{SUNAT_RUC}/validarcomprobante"
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

    try:
        numero_int = int(correlativo) if correlativo else 0
    except Exception:
        numero_int = 0

    body = {
        'numRuc': ruc_emisor,
        'codComp': codigo_comprobante,
        'numeroSerie': serie,
        'numero': numero_int,
        'fechaEmision': fecha_sunat,
        'monto': float(monto_total) if monto_total is not None else 0,
    }

    import json
    response = http.request('POST', url, headers=headers, body=json.dumps(body))

    if response.status != 200:
        return {
            'validado': False,
            'estado': 'ERROR_API',
            'motivo': f'Error al consultar SUNAT: HTTP {response.status}',
            'estadoSunat': None,
            'timestampValidacion': datetime.utcnow().isoformat() + 'Z',
            'errorDetalle': response.data.decode('utf-8'),
        }

    data = eval_json(response.data.decode('utf-8'))
    if not data.get('success'):
        return {
            'validado': False,
            'estado': 'ERROR_API',
            'motivo': data.get('message', 'Error desconocido de SUNAT'),
            'estadoSunat': None,
            'timestampValidacion': datetime.utcnow().isoformat() + 'Z',
            'errorDetalle': response.data.decode('utf-8'),
        }

    response_data = data.get('data', {})
    estado_cp = response_data.get('estadoCp', '')
    estado_ruc = response_data.get('estadoRuc', '')
    condicion_domicilio = response_data.get('condDomiRuc', '')
    observaciones = response_data.get('observaciones', [])

    desc_comprobante = estados_comprobante.get(estado_cp, f'Codigo desconocido: {estado_cp}')
    desc_ruc = estados_ruc.get(estado_ruc, f'Codigo desconocido: {estado_ruc}')
    desc_domicilio = condiciones_domicilio.get(
        condicion_domicilio, f'Codigo desconocido: {condicion_domicilio}'
    )

    es_valido = estado_cp in ['1', '0'] and estado_ruc == '00'

    return {
        'validado': True,
        'esValido': es_valido,
        'estado': 'VALIDO' if es_valido else 'INVALIDO',
        'motivo': 'Comprobante validado exitosamente'
        if es_valido
        else 'Comprobante no valido en SUNAT',
        'estadoSunat': {
            'estadoComprobante': {'codigo': estado_cp, 'descripcion': desc_comprobante},
            'estadoRuc': {'codigo': estado_ruc, 'descripcion': desc_ruc},
            'condicionDomicilio': {
                'codigo': condicion_domicilio,
                'descripcion': desc_domicilio,
            },
            'observaciones': observaciones,
        },
        'timestampValidacion': datetime.utcnow().isoformat() + 'Z',
    }


def parse_serie_correlativo(invoice_data: Dict[str, Any]) -> None:
    if invoice_data.get('serie') and invoice_data.get('correlativo'):
        return

    numero_factura = (invoice_data.get('numeroFactura') or '').strip().upper()
    if not numero_factura:
        return

    match = re.match(r'^([A-Z0-9]{1,4})[- ]?0*([0-9]{1,12})$', numero_factura)
    if not match:
        return

    invoice_data.setdefault('serie', match.group(1))
    invoice_data.setdefault('correlativo', match.group(2))


def build_invoice_data(item: Dict[str, Any]) -> Dict[str, Any]:
    data = item.get('data') if isinstance(item.get('data'), dict) else {}
    invoice_data: Dict[str, Any] = dict(data)

    invoice_data.setdefault('emisor', {})
    invoice_data.setdefault('receptor', {})
    invoice_data.setdefault('montos', {})

    if not invoice_data.get('numeroFactura') and item.get('numeroFactura'):
        invoice_data['numeroFactura'] = item.get('numeroFactura')
    if not invoice_data.get('fechaEmision') and item.get('fechaEmision'):
        invoice_data['fechaEmision'] = item.get('fechaEmision')
    if not invoice_data.get('tipoComprobante') and item.get('tipoComprobante'):
        invoice_data['tipoComprobante'] = item.get('tipoComprobante')

    if not invoice_data['emisor'].get('numeroDocumento') and item.get('emisorRUC'):
        invoice_data['emisor']['numeroDocumento'] = str(item.get('emisorRUC'))
    if not invoice_data['emisor'].get('razonSocial') and item.get('emisorRazonSocial'):
        invoice_data['emisor']['razonSocial'] = item.get('emisorRazonSocial')

    if not invoice_data['receptor'].get('numeroDocumento') and item.get('receptorRUC'):
        invoice_data['receptor']['numeroDocumento'] = str(item.get('receptorRUC'))
    if not invoice_data['receptor'].get('razonSocial') and item.get('receptorRazonSocial'):
        invoice_data['receptor']['razonSocial'] = item.get('receptorRazonSocial')

    if invoice_data['montos'].get('total') is None and item.get('total') is not None:
        invoice_data['montos']['total'] = item.get('total')
    if not invoice_data['montos'].get('moneda') and item.get('moneda'):
        invoice_data['montos']['moneda'] = item.get('moneda')

    parse_serie_correlativo(invoice_data)
    return invoice_data


def should_validate(invoice_data: Dict[str, Any]) -> Tuple[bool, str]:
    ruc_emisor = invoice_data.get('emisor', {}).get('numeroDocumento')
    numero_factura = invoice_data.get('numeroFactura')
    fecha_emision = invoice_data.get('fechaEmision')
    total = invoice_data.get('montos', {}).get('total')
    serie = invoice_data.get('serie')
    correlativo = invoice_data.get('correlativo')

    if not ruc_emisor or not numero_factura:
        return False, 'missing_ruc_or_numero'
    if not fecha_emision:
        return False, 'missing_fecha'
    if total is None:
        return False, 'missing_total'

    try:
        if float(total) <= 0:
            return False, 'total_zero'
    except Exception:
        return False, 'invalid_total'

    if not serie or not correlativo:
        return False, 'missing_serie_correlativo'
    if not str(correlativo).isdigit():
        return False, 'invalid_correlativo'

    return True, 'ok'


def should_retry(item: Dict[str, Any]) -> Tuple[bool, str]:
    sunat = item.get('validacionSunat') or {}
    estado = sunat.get('estado') or 'NO_VALIDADO'

    if estado in NON_RETRY_STATUSES:
        return False, estado.lower()

    if estado not in RETRYABLE_STATUSES:
        return False, 'unknown_status'

    if estado == 'ERROR_API':
        code = extract_http_code(sunat.get('motivo', ''))
        if code == 422:
            return False, 'http_422'
        if code and code in RETRYABLE_HTTP:
            return True, 'http_retryable'
        if code and code >= 500:
            return True, 'http_retryable'
        if code and code < 500:
            return False, f'http_{code}'

    return True, estado.lower()


def build_retry_metadata(
    current_count: int,
    result: Dict[str, Any],
    allow_retry: bool
) -> Tuple[int, Optional[str], Optional[str], Optional[str]]:
    new_count = current_count
    next_retry_at = None

    if allow_retry:
        new_count = current_count + 1
        if new_count <= MAX_RETRIES and BACKOFF_MINUTES:
            index = min(new_count - 1, len(BACKOFF_MINUTES) - 1)
            delay = BACKOFF_MINUTES[index]
            next_retry_at = isoformat_z(now_utc() + timedelta(minutes=delay))

    error_code = result.get('estado')
    motivo = result.get('motivo')
    http_code = extract_http_code(motivo or '')
    if http_code:
        error_code = str(http_code)

    return new_count, next_retry_at, error_code, motivo


def update_item(
    key: Dict[str, Any],
    result: Dict[str, Any],
    retry_count: int,
    next_retry_at: Optional[str],
    last_error_code: Optional[str],
    last_error_msg: Optional[str],
) -> None:
    expression = (
        'SET validacionSunat = :v, '
        'sunatRetryCount = :c, '
        'sunatLastErrorCode = :e, '
        'sunatLastErrorMsg = :m'
    )
    values: Dict[str, Any] = {
        ':v': convert_to_decimal(result),
        ':c': retry_count,
        ':e': last_error_code or '',
        ':m': last_error_msg or '',
    }

    if next_retry_at:
        expression += ', sunatNextRetryAt = :n'
        values[':n'] = next_retry_at
    else:
        expression += ' REMOVE sunatNextRetryAt'

    table.update_item(
        Key=key,
        UpdateExpression=expression,
        ExpressionAttributeValues=values,
    )


def handler(event, context):
    processed = 0
    scanned = 0
    last_key = None

    while processed < MAX_ITEMS:
        scan_kwargs: Dict[str, Any] = {}
        if last_key:
            scan_kwargs['ExclusiveStartKey'] = last_key
        scan_kwargs['Limit'] = min(200, MAX_ITEMS - processed)

        response = table.scan(**scan_kwargs)
        items = response.get('Items', [])
        scanned += len(items)

        for item in items:
            if processed >= MAX_ITEMS:
                break

            key = {
                'clientId': item.get('clientId'),
                'invoiceId': item.get('invoiceId'),
            }
            if not key['clientId'] or not key['invoiceId']:
                continue

            sunat = item.get('validacionSunat') or {}
            estado = sunat.get('estado') or 'NO_VALIDADO'

            if estado in {'VALIDO', 'INVALIDO'}:
                continue

            retry_allowed, reason = should_retry(item)
            retry_count = int(item.get('sunatRetryCount', 0) or 0)

            if retry_count >= MAX_RETRIES:
                retry_allowed = False
                reason = 'max_retries'

            next_retry_at = item.get('sunatNextRetryAt')
            due_at = parse_iso_datetime(next_retry_at) if next_retry_at else None
            if due_at and now_utc() < due_at:
                continue

            invoice_data = build_invoice_data(item)
            can_validate, validate_reason = should_validate(invoice_data)
            if not can_validate:
                result = {
                    'validado': False,
                    'estado': 'DATOS_INCOMPLETOS',
                    'motivo': 'Faltan datos requeridos (RUC o numero de factura)',
                    'estadoSunat': None,
                    'timestampValidacion': datetime.utcnow().isoformat() + 'Z',
                }
                new_count, new_next, error_code, error_msg = build_retry_metadata(
                    retry_count,
                    result,
                    False,
                )
                update_item(key, result, new_count, new_next, error_code, error_msg)
                processed += 1
                continue

            if not retry_allowed and estado in NON_RETRY_STATUSES:
                continue

            if not retry_allowed:
                result = sunat or {
                    'validado': False,
                    'estado': estado,
                    'motivo': sunat.get('motivo', ''),
                    'estadoSunat': sunat.get('estadoSunat'),
                    'timestampValidacion': datetime.utcnow().isoformat() + 'Z',
                }
                new_count, new_next, error_code, error_msg = build_retry_metadata(
                    retry_count,
                    result,
                    False,
                )
                update_item(key, result, new_count, new_next, error_code, error_msg)
                processed += 1
                continue

            result = validate_invoice_with_sunat(invoice_data)
            allow_retry = result.get('estado') in RETRYABLE_STATUSES

            if result.get('estado') == 'ERROR_API':
                code = extract_http_code(result.get('motivo', '') or '')
                if code == 422:
                    allow_retry = False

            if result.get('estado') in {'VALIDO', 'INVALIDO'}:
                retry_count = 0

            new_count, new_next, error_code, error_msg = build_retry_metadata(
                retry_count,
                result,
                allow_retry,
            )
            update_item(key, result, new_count, new_next, error_code, error_msg)
            processed += 1

        last_key = response.get('LastEvaluatedKey')
        if not last_key:
            break

    return {
        'statusCode': 200,
        'body': {
            'processed': processed,
            'scanned': scanned,
            'table': TABLE_NAME,
        },
    }
