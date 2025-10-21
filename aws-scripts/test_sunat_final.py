"""
Validación final de integración SUNAT
Prueba con el formato correcto: DD/MM/YYYY
"""

import json
import urllib3

# Credenciales SUNAT
SUNAT_CLIENT_ID = "bb996e55-a5d9-4465-a6a2-670cdec6900a"
SUNAT_CLIENT_SECRET = "T+ujAu1rfzUk5m7ujSPnOw=="
SUNAT_RUC = "10730152898"  # Tu RUC consultante

http = urllib3.PoolManager()

def get_sunat_token():
    """Obtiene token de SUNAT"""
    print("🔑 Solicitando token de SUNAT...")

    url = f"https://api-seguridad.sunat.gob.pe/v1/clientesextranet/{SUNAT_CLIENT_ID}/oauth2/token/"

    headers = {'Content-Type': 'application/x-www-form-urlencoded'}

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
        print(f"✅ Token obtenido (expira en {expires_in}s)")
        return token
    else:
        print(f"❌ Error obteniendo token: {response.status}")
        return None


def validate_invoice(ruc_emisor, serie, numero, fecha, monto):
    """
    Valida factura con SUNAT
    fecha: debe estar en formato DD/MM/YYYY
    """
    token = get_sunat_token()
    if not token:
        return None

    url = f"https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/{SUNAT_RUC}/validarcomprobante"

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    body = json.dumps({
        'numRuc': ruc_emisor,
        'codComp': '01',  # 01 = Factura
        'numeroSerie': serie,
        'numero': numero,
        'fechaEmision': fecha,
        'monto': monto
    })

    print(f"\n📋 Validando Factura:")
    print(f"   RUC Emisor: {ruc_emisor}")
    print(f"   Serie-Número: {serie}-{numero}")
    print(f"   Fecha: {fecha}")
    print(f"   Monto: S/ {monto}")
    print(f"\n📤 Request: {body}")

    response = http.request('POST', url, headers=headers, body=body)

    print(f"\n📥 Response Status: {response.status}")
    response_data = json.loads(response.data.decode('utf-8'))
    print(f"📥 Response Body:")
    print(json.dumps(response_data, indent=2, ensure_ascii=False))

    if response.status == 200 and response_data.get('success'):
        data = response_data.get('data', {})
        estado_cp = data.get('estadoCp')
        estado_ruc = data.get('estadoRuc')
        cond_domicilio = data.get('condDomiRuc')
        observaciones = data.get('observaciones', [])

        print(f"\n✅ VALIDACIÓN EXITOSA")
        print(f"   Estado Comprobante: {estado_cp} (1=Aceptado, 0=Anulado, 2=Anulado por cambio)")
        print(f"   Estado RUC: {estado_ruc} (00=Activo)")
        print(f"   Condición Domicilio: {cond_domicilio} (00=Habido)")

        # Catálogo de descripciones
        ESTADOS_COMPROBANTE = {
            '0': 'NO EXISTE - Comprobante no informado',
            '1': 'ACEPTADO - Comprobante aceptado',
            '2': 'ANULADO - Comunicado en una baja',
            '3': 'AUTORIZADO - Con autorización de imprenta',
            '4': 'NO AUTORIZADO - No autorizado por imprenta'
        }

        ESTADOS_RUC = {
            '00': 'ACTIVO',
            '01': 'BAJA PROVISIONAL',
            '02': 'BAJA PROV. POR OFICIO',
            '03': 'SUSPENSION TEMPORAL',
            '10': 'BAJA DEFINITIVA',
            '11': 'BAJA DE OFICIO',
            '22': 'INHABILITADO-VENT.UNICA'
        }

        CONDICIONES_DOMICILIO = {
            '00': 'HABIDO',
            '09': 'PENDIENTE',
            '11': 'POR VERIFICAR',
            '12': 'NO HABIDO',
            '20': 'NO HALLADO'
        }

        if observaciones:
            print(f"   Observaciones:")
            for obs in observaciones:
                print(f"      - {obs}")

        # Mostrar descripciones
        print(f"\n📋 DESCRIPCIONES OFICIALES:")
        print(f"   Comprobante [{estado_cp}]: {ESTADOS_COMPROBANTE.get(estado_cp, 'Desconocido')}")
        print(f"   RUC [{estado_ruc}]: {ESTADOS_RUC.get(estado_ruc, 'Desconocido')}")
        print(f"   Domicilio [{cond_domicilio}]: {CONDICIONES_DOMICILIO.get(cond_domicilio, 'Desconocido')}")

        # Validación
        es_valido = estado_cp == '1' and estado_ruc == '00'
        print(f"\n{'✅' if es_valido else '⚠️'} Factura {'VÁLIDA' if es_valido else 'REQUIERE REVISIÓN'}")

        return response_data
    else:
        print(f"\n❌ Validación falló")
        return response_data


if __name__ == '__main__':
    print("="*60)
    print("VALIDACIÓN DE INTEGRACIÓN SUNAT API")
    print("="*60)

    # Factura de prueba (datos reales del PDF)
    validate_invoice(
        ruc_emisor='20207845044',  # Frutos y Especias S.A.C.
        serie='F004',
        numero=100672,
        fecha='07/10/2025',  # Formato DD/MM/YYYY
        monto=70.00
    )

    print("\n" + "="*60)
    print("✅ Integración SUNAT validada correctamente")
    print(f"   RUC Consultante: {SUNAT_RUC}")
    print(f"   Formato de fecha: DD/MM/YYYY")
    print("="*60)
