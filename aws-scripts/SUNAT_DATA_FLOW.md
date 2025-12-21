# 📊 Flujo de Datos: SUNAT API → DynamoDB

## 🔍 Respuesta Original de SUNAT

### Request que enviamos:
```json
{
  "numRuc": "20207845044",
  "codComp": "01",
  "numeroSerie": "F004",
  "numero": 100672,
  "fechaEmision": "07/10/2025",
  "monto": 70.00
}
```

### Respuesta que recibimos de SUNAT:
```json
{
  "success": true,
  "message": "Operation Success! ",
  "data": {
    "estadoCp": "1",
    "estadoRuc": "00",
    "condDomiRuc": "00",
    "observaciones": [
      "- El comprobante de pago consultado ha sido emitido a otro contribuyente."
    ]
  }
}
```

## 🔄 Transformación de Datos

### Función: `validate_invoice_with_sunat()` (línea 186-317)

La respuesta de SUNAT se transforma en:

```json
{
  "validado": true,
  "estado": "VALIDO",
  "motivo": "Comprobante validado exitosamente",
  "estadoSunat": {
    "estadoComprobante": "1",
    "estadoRuc": "00",
    "condicionDomicilio": "00",
    "observaciones": [
      "- El comprobante de pago consultado ha sido emitido a otro contribuyente."
    ]
  },
  "timestampValidacion": "2025-10-18T17:15:00Z"
}
```

### Lógica de Validación (línea 284-287):

```python
es_valido = (
    estado_cp in ['1', '0'] and  # 1=Aceptado, 0=Anulado (pero existió)
    estado_ruc == '00'           # 00=Activo
)
```

## 💾 Estructura Completa en DynamoDB

### Función: `build_item()` (línea 608-707)

```json
{
  // ========== CLAVES PRIMARIAS ==========
  "PK": "CLIENT#{client_id}",
  "SK": "INVOICE#2025-10-07#20207845044-F004-100672",

  // ========== IDENTIFICADORES ==========
  "clientId": "cliente123",
  "invoiceId": "20207845044-F004-100672",
  "numeroFactura": "F004-100672",
  "tipoComprobante": "FACTURA",

  // ========== CAMPOS PLANOS (para queries) ==========
  "fechaEmision": "2025-10-07",
  "emisorRUC": "20207845044",
  "emisorRazonSocial": "FRUTOS Y ESPECIAS S.A.C.",
  "receptorRUC": "20604163642",
  "receptorRazonSocial": "EL HELADERO S.A.C.",
  "total": 70.00,
  "moneda": "PEN",

  // ========== DATOS COMPLETOS DE CLAUDE ==========
  "data": {
    "numeroFactura": "F004-100672",
    "serie": "F004",
    "correlativo": "100672",
    "emisor": { /* ... */ },
    "receptor": { /* ... */ },
    "montos": { /* ... */ },
    "items": [ /* ... */ ],
    "condiciones": { /* ... */ },
    "datosBancarios": [ /* ... */ ],
    "sunat": { /* ... */ }
  },

  // ========== ARCHIVO S3 ==========
  "archivo": {
    "s3Bucket": "flow-facturas",
    "s3Key": "cliente123/factura.pdf",
    "s3Url": "s3://flow-facturas/cliente123/factura.pdf",
    "nombreArchivo": "factura.pdf",
    "tamanoBytes": 45678
  },

  // ========== PROCESAMIENTO ==========
  "procesamiento": {
    "status": "processed",
    "motor": "bedrock-claude",
    "modelId": "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    "modelName": "Claude 3.5 Sonnet v2",
    "confidence": "high",
    "timestampProcesado": "2025-10-18T17:15:00Z",
    "warnings": [],
    "errores": []
  },

  // ========== VALIDACIONES DE CLAUDE ==========
  "validado": {
    "igvCorrecto": true,
    "totalCorrecto": true,
    "rucValido": true,
    "requiereRevision": false
  },

  // ========== ⭐ VALIDACIÓN SUNAT (LO IMPORTANTE) ==========
  "validacionSunat": {
    "validado": true,
    "estado": "VALIDO",
    "motivo": "Comprobante validado exitosamente",
    "estadoSunat": {
      "estadoComprobante": "1",        // ← De SUNAT API
      "estadoRuc": "00",                // ← De SUNAT API
      "condicionDomicilio": "00",       // ← De SUNAT API
      "observaciones": [                // ← De SUNAT API
        "- El comprobante de pago consultado ha sido emitido a otro contribuyente."
      ]
    },
    "timestampValidacion": "2025-10-18T17:15:00Z"
  },

  // ========== GSI KEYS ==========
  "GSI1PK": "EMISOR#20207845044",
  "GSI1SK": "2025-10-07",

  // ========== AUDITORÍA ==========
  "audit": {
    "creadoEn": "2025-10-18T17:15:00Z",
    "creadoPor": "bedrock-claude-processor",
    "versionDocumento": 1
  }
}
```

## 📋 Mapeo de Campos SUNAT

| Campo SUNAT | Tipo | Guardamos en | Significado |
|-------------|------|--------------|-------------|
| `success` | boolean | NO (solo para control) | Indica si la API respondió correctamente |
| `message` | string | NO (solo para control) | Mensaje de la API |
| `data.estadoCp` | string | `validacionSunat.estadoSunat.estadoComprobante` | Estado del comprobante (1=Válido) |
| `data.estadoRuc` | string | `validacionSunat.estadoSunat.estadoRuc` | Estado del RUC emisor (00=Activo) |
| `data.condDomiRuc` | string | `validacionSunat.estadoSunat.condicionDomicilio` | Condición del domicilio (00=Habido) |
| `data.observaciones` | array | `validacionSunat.estadoSunat.observaciones` | Observaciones adicionales |

## 🎯 Campos Calculados

Además de guardar la respuesta de SUNAT, calculamos:

| Campo | Fuente | Lógica |
|-------|--------|--------|
| `validacionSunat.validado` | Interno | `true` si la API respondió 200, `false` si hubo error |
| `validacionSunat.estado` | Calculado | `"VALIDO"` si `estadoCp in ['1','0'] AND estadoRuc='00'` |
| `validacionSunat.motivo` | Calculado | Descripción en español del resultado |
| `validacionSunat.timestampValidacion` | Interno | Timestamp ISO 8601 de cuándo se validó |

## 🚨 Casos de Error

### Error de API (HTTP 422)
```json
{
  "validado": false,
  "estado": "ERROR_API",
  "motivo": "Error al consultar SUNAT: HTTP 422",
  "estadoSunat": null,
  "timestampValidacion": "2025-10-18T17:15:00Z",
  "errorDetalle": "{\"success\":false,\"message\":\"Fecha incorrecta\"}"
}
```

### Error de Token
```json
{
  "validado": false,
  "estado": "ERROR_TOKEN",
  "motivo": "No se pudo obtener token de SUNAT",
  "estadoSunat": null,
  "timestampValidacion": "2025-10-18T17:15:00Z"
}
```

### SUNAT no configurado
```json
{
  "validado": false,
  "estado": "NO_VALIDADO",
  "motivo": "Credenciales SUNAT no configuradas",
  "estadoSunat": null,
  "timestampValidacion": "2025-10-18T17:15:00Z"
}
```

## 📊 Códigos de Estado Completos

### Estado Comprobante (estadoCp)

| Código | Significado | ¿Es válido? |
|--------|-------------|-------------|
| `1` | Aceptado y emitido | ✅ SÍ |
| `0` | Anulado | ⚠️ Existió pero fue anulado |
| `2` | Anulado por cambio de destinatario | ⚠️ Existió pero fue anulado |
| `99` | No existe o error | ❌ NO |

### Estado RUC (estadoRuc)

| Código | Significado | ¿Es válido? |
|--------|-------------|-------------|
| `00` | Activo | ✅ SÍ |
| `01` | Suspendido temporalmente | ⚠️ NO ACTIVO |
| `02` | Suspendido definitivamente | ❌ NO |
| `03` | Baja de oficio | ❌ NO |
| `10` | No existe | ❌ NO |

### Condición Domicilio (condDomiRuc)

| Código | Significado | ¿Es válido? |
|--------|-------------|-------------|
| `00` | Habido | ✅ SÍ |
| `09` | No habido | ⚠️ NO |
| `11` | No hallado | ⚠️ NO |
| `20` | No habido - no hallado | ⚠️ NO |

## 🔍 Query de Ejemplo en DynamoDB

Para obtener la validación SUNAT de una factura:

```python
response = table.get_item(
    Key={
        'PK': 'CLIENT#cliente123',
        'SK': 'INVOICE#2025-10-07#20207845044-F004-100672'
    }
)

item = response['Item']
validacion = item['validacionSunat']

print(f"Estado: {validacion['estado']}")
print(f"Comprobante: {validacion['estadoSunat']['estadoComprobante']}")
print(f"RUC: {validacion['estadoSunat']['estadoRuc']}")
```

## 📝 Resumen

**Recibimos de SUNAT**: 4 campos principales
- `estadoCp`
- `estadoRuc`
- `condDomiRuc`
- `observaciones`

**Guardamos en DynamoDB**: Respuesta completa + 4 campos calculados
- ✅ Respuesta original de SUNAT
- ✅ Estado interpretado (`VALIDO`/`INVALIDO`)
- ✅ Motivo en español
- ✅ Timestamp de validación
- ✅ Manejo de errores completo

**Total**: ~700 líneas de código para gestionar todo el flujo end-to-end.
