"""
Script de prueba para validar factura con SUNAT API
Prueba solo la función de validación sin depender de Bedrock
"""

import json
import urllib3
from datetime import datetime

# Credenciales SUNAT
SUNAT_CLIENT_ID = "bb996e55-a5d9-4465-a6a2-670cdec6900a"
SUNAT_CLIENT_SECRET = "T+ujAu1rfzUk5m7ujSPnOw=="
SUNAT_RUC = "10730152898"  # Tu RUC

http = urllib3.PoolManager()

def get_sunat_token():
    """Obtiene token de SUNAT"""
    print("🔑 Requesting SUNAT token...")

    url = f"https://api-seguridad.sunat.gob.pe/v1/clientesextranet/{SUNAT_CLIENT_ID}/oauth2/token/"

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    body = urllib3.request.urlencode({
        'grant_type': 'client_credentials',
        'scope': 'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes',
        'client_id': SUNAT_CLIENT_ID,
        'client_secret': SUNAT_CLIENT_SECRET
    })

    response = http.request('POST', url, headers=headers, body=body)

    if response.status == 200:
        data = json.loads(response.data.decode('utf-8'))
        token = data.get('access_token')
        expires_in = data.get('expires_in', 3600)
        print(f"✅ Token obtained (expires in {expires_in}s)")
        return token
    else:
        print(f"❌ Failed to get token: {response.status}")
        print(f"Response: {response.data.decode('utf-8')}")
        return None


def validate_invoice():
    """Valida una factura de prueba"""

    token = get_sunat_token()
    if not token:
        return

    # Datos de la factura de prueba (datos reales del PDF)
    invoice_data = {
        'emisor': {
            'numeroDocumento': '20207845044'  # Frutos y Especias S.A.C.
        },
        'numeroFactura': 'F004-100672',
        'serie': 'F004',
        'correlativo': '100672',
        'tipoComprobante': 'FACTURA',
        'fechaEmision': '2025-10-07',  # Formato YYYY-MM-DD (del PDF)
        'montos': {
            'total': 70.00  # Base: 59.32 + IGV: 10.68
        }
    }

    print(f"\n🔍 Validating invoice: {invoice_data['numeroFactura']}")
    print(f"   RUC Emisor: {invoice_data['emisor']['numeroDocumento']}")
    print(f"   Fecha: {invoice_data['fechaEmision']}")
    print(f"   Total: S/ {invoice_data['montos']['total']}")

    # Construir request (usa el RUC del consultante, no del emisor)
    url = f"https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/{SUNAT_RUC}/validarcomprobante"

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    body = json.dumps({
        'numRuc': invoice_data['emisor']['numeroDocumento'],
        'codComp': '01',  # 01=Factura
        'numeroSerie': invoice_data['serie'],
        'numero': invoice_data['correlativo'],
        'fechaEmision': invoice_data['fechaEmision'].replace('-', ''),  # YYYYMMDD
        'monto': invoice_data['montos']['total']
    })

    print(f"\n📤 Request body: {body}")

    response = http.request('POST', url, headers=headers, body=body)

    print(f"\n📥 Response status: {response.status}")
    print(f"Response body: {response.data.decode('utf-8')}")

    if response.status == 200:
        data = json.loads(response.data.decode('utf-8'))

        estado_cp = data.get('estadoCp')
        estado_ruc = data.get('estadoRuc')

        print(f"\n✅ Validation successful!")
        print(f"   Estado Comprobante: {estado_cp}")
        print(f"   Estado RUC: {estado_ruc}")
        print(f"   Condición Domicilio: {data.get('condDomiRuc')}")

        es_valido = estado_cp in ['1', '0'] and estado_ruc == '00'
        print(f"\n{'✅' if es_valido else '❌'} Factura {'VÁLIDA' if es_valido else 'NO VÁLIDA'}")
    else:
        print(f"\n❌ Validation failed")


def validate_invoice_with_date(fecha):
    """Valida con una fecha específica"""

    token = get_sunat_token()
    if not token:
        return

    invoice_data = {
        'emisor': {'numeroDocumento': '20207845044'},
        'numeroFactura': 'F004-100672',
        'serie': 'F004',
        'correlativo': '100672',
        'tipoComprobante': 'FACTURA',
        'fechaEmision': fecha,
        'montos': {'total': 70.00}
    }

    url = f"https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/{SUNAT_RUC}/validarcomprobante"
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    body = json.dumps({
        'numRuc': invoice_data['emisor']['numeroDocumento'],
        'codComp': '01',
        'numeroSerie': invoice_data['serie'],
        'numero': invoice_data['correlativo'],
        'fechaEmision': fecha.replace('-', ''),
        'monto': invoice_data['montos']['total']
    })

    response = http.request('POST', url, headers=headers, body=body)

    if response.status == 200:
        data = json.loads(response.data.decode('utf-8'))
        print(f"✅ ÉXITO! Estado: {data.get('estadoCp')}, RUC: {data.get('estadoRuc')}")
    else:
        print(f"❌ Error {response.status}: {response.data.decode('utf-8')}")


if __name__ == '__main__':
    # Probar con diferentes fechas
    fechas = ['2025-10-07', '2024-10-07', '2023-10-07', '2025-10-18', '2024-10-18']

    print("=" * 60)
    print("Probando diferentes fechas para encontrar la correcta...")
    print("=" * 60)

    for fecha in fechas:
        print(f"\n\n{'='*60}")
        print(f"Probando con fecha: {fecha}")
        print('='*60)
        validate_invoice_with_date(fecha)
