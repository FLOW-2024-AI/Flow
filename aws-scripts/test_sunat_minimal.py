"""
Test SUNAT API con parámetros mínimos
Prueba diferentes formatos de fecha
"""

import json
import urllib3

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
        print(f"✅ Token obtained: {token[:50]}...")
        return token
    else:
        print(f"❌ Failed to get token: {response.status}")
        print(f"Response: {response.data.decode('utf-8')}")
        return None


def test_format(token, fecha_formato, descripcion):
    """Prueba un formato específico de fecha"""

    url = f"https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/{SUNAT_RUC}/validarcomprobante"

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    # Datos mínimos requeridos
    body = json.dumps({
        'numRuc': '20207845044',
        'codComp': '01',
        'numeroSerie': 'F004',
        'numero': 100672,
        'fechaEmision': fecha_formato,
        'monto': 70.00
    })

    print(f"\n📤 Probando formato: {descripcion}")
    print(f"   Fecha: {fecha_formato}")
    print(f"   Request body: {body}")

    response = http.request('POST', url, headers=headers, body=body)

    print(f"📥 Status: {response.status}")
    response_text = response.data.decode('utf-8')
    print(f"   Response: {response_text}")

    if response.status == 200:
        print(f"✅ ¡ÉXITO! Este formato funciona: {fecha_formato}")
        return True

    return False


if __name__ == '__main__':
    token = get_sunat_token()
    if not token:
        print("❌ No se pudo obtener token")
        exit(1)

    print("\n" + "="*60)
    print("Probando diferentes formatos de fecha...")
    print("="*60)

    # Diferentes formatos a probar
    formatos = [
        ('07/10/2025', 'DD/MM/YYYY con barras (tu formato)'),
        ('20251007', 'YYYYMMDD sin separadores'),
        ('2025-10-07', 'YYYY-MM-DD con guiones'),
        ('07-10-2025', 'DD-MM-YYYY con guiones'),
        ('10/07/2025', 'MM/DD/YYYY estilo US'),
        ('2025/10/07', 'YYYY/MM/DD con barras'),
    ]

    for fecha, desc in formatos:
        if test_format(token, fecha, desc):
            print(f"\n🎉 FORMATO CORRECTO ENCONTRADO: {fecha}")
            break
        print("-" * 60)
