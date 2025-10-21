# 📊 Estructura Completa de Validación SUNAT

## ✅ Nueva Estructura (Actualizada)

### Datos que Guardamos en DynamoDB

```json
{
  "validacionSunat": {
    // ========== FLAGS DE VALIDACIÓN ==========
    "validado": true,              // ¿La consulta a SUNAT fue exitosa?
    "esValido": true,               // ¿La factura es válida? (lógica de negocio)
    "estado": "VALIDO",             // VALIDO | INVALIDO | ERROR_API | NO_VALIDADO
    "motivo": "Comprobante validado exitosamente",

    // ========== DATOS DE SUNAT (con códigos Y descripciones) ==========
    "estadoSunat": {
      "estadoComprobante": {
        "codigo": "1",
        "descripcion": "ACEPTADO - Comprobante aceptado"
      },
      "estadoRuc": {
        "codigo": "00",
        "descripcion": "ACTIVO"
      },
      "condicionDomicilio": {
        "codigo": "00",
        "descripcion": "HABIDO"
      },
      "observaciones": [
        "- El comprobante de pago consultado ha sido emitido a otro contribuyente."
      ]
    },

    // ========== METADATA ==========
    "timestampValidacion": "2025-10-18T18:20:00Z"
  }
}
```

## 📋 Catálogo Completo de Códigos

### Estado del Comprobante (estadoCp)

| Código | Descripción | ¿Es Válido? |
|--------|-------------|-------------|
| `0` | NO EXISTE - Comprobante no informado | ⚠️ Existió pero no reportado |
| `1` | ACEPTADO - Comprobante aceptado | ✅ SÍ |
| `2` | ANULADO - Comunicado en una baja | ⚠️ Fue válido, ahora anulado |
| `3` | AUTORIZADO - Con autorización de imprenta | ✅ SÍ (comprobantes físicos) |
| `4` | NO AUTORIZADO - No autorizado por imprenta | ❌ NO |

### Estado del RUC (estadoRuc)

| Código | Descripción | ¿Es Válido? |
|--------|-------------|-------------|
| `00` | ACTIVO | ✅ SÍ |
| `01` | BAJA PROVISIONAL | ⚠️ Suspendido temporalmente |
| `02` | BAJA PROV. POR OFICIO | ⚠️ Suspendido por SUNAT |
| `03` | SUSPENSION TEMPORAL | ⚠️ Suspendido |
| `10` | BAJA DEFINITIVA | ❌ NO |
| `11` | BAJA DE OFICIO | ❌ NO |
| `22` | INHABILITADO-VENT.UNICA | ❌ NO |

### Condición de Domicilio (condDomiRuc)

| Código | Descripción | ¿Es Válido? |
|--------|-------------|-------------|
| `00` | HABIDO | ✅ SÍ |
| `09` | PENDIENTE | ⚠️ En verificación |
| `11` | POR VERIFICAR | ⚠️ En proceso |
| `12` | NO HABIDO | ❌ NO |
| `20` | NO HALLADO | ❌ NO |

## 🎯 Lógica de Validación

```python
# Un comprobante es válido cuando:
es_valido = (
    estado_cp in ['1', '0'] and  # Comprobante existe (aceptado o informado)
    estado_ruc == '00'           # RUC está activo
)
```

**Nota**: No validamos `condicionDomicilio` porque puede ser temporal y no invalida la factura.

## 📊 Ejemplos de Respuestas

### ✅ Caso 1: Factura Válida

```json
{
  "validacionSunat": {
    "validado": true,
    "esValido": true,
    "estado": "VALIDO",
    "motivo": "Comprobante validado exitosamente",
    "estadoSunat": {
      "estadoComprobante": {
        "codigo": "1",
        "descripcion": "ACEPTADO - Comprobante aceptado"
      },
      "estadoRuc": {
        "codigo": "00",
        "descripcion": "ACTIVO"
      },
      "condicionDomicilio": {
        "codigo": "00",
        "descripcion": "HABIDO"
      },
      "observaciones": []
    },
    "timestampValidacion": "2025-10-18T18:20:00Z"
  }
}
```

### ⚠️ Caso 2: Factura Anulada

```json
{
  "validacionSunat": {
    "validado": true,
    "esValido": false,
    "estado": "INVALIDO",
    "motivo": "Comprobante no válido en SUNAT",
    "estadoSunat": {
      "estadoComprobante": {
        "codigo": "2",
        "descripcion": "ANULADO - Comunicado en una baja"
      },
      "estadoRuc": {
        "codigo": "00",
        "descripcion": "ACTIVO"
      },
      "condicionDomicilio": {
        "codigo": "00",
        "descripcion": "HABIDO"
      },
      "observaciones": [
        "El comprobante fue anulado por el emisor"
      ]
    },
    "timestampValidacion": "2025-10-18T18:20:00Z"
  }
}
```

### ❌ Caso 3: RUC Inactivo

```json
{
  "validacionSunat": {
    "validado": true,
    "esValido": false,
    "estado": "INVALIDO",
    "motivo": "Comprobante no válido en SUNAT",
    "estadoSunat": {
      "estadoComprobante": {
        "codigo": "1",
        "descripcion": "ACEPTADO - Comprobante aceptado"
      },
      "estadoRuc": {
        "codigo": "10",
        "descripcion": "BAJA DEFINITIVA"
      },
      "condicionDomicilio": {
        "codigo": "12",
        "descripcion": "NO HABIDO"
      },
      "observaciones": []
    },
    "timestampValidacion": "2025-10-18T18:20:00Z"
  }
}
```

### 🔴 Caso 4: Error de API

```json
{
  "validacionSunat": {
    "validado": false,
    "estado": "ERROR_API",
    "motivo": "Error al consultar SUNAT: HTTP 422",
    "estadoSunat": null,
    "timestampValidacion": "2025-10-18T18:20:00Z",
    "errorDetalle": "{\"success\":false,\"message\":\"Fecha incorrecta\"}"
  }
}
```

## 🔍 Cómo Interpretar los Datos

### Para UI/Frontend:

```javascript
// Verificar si la factura es válida
if (validacionSunat.esValido) {
  console.log("✅ Factura válida");
} else if (validacionSunat.validado) {
  console.log("⚠️ Factura consultada pero no válida");
  console.log(`Razón: ${validacionSunat.estadoSunat.estadoComprobante.descripcion}`);
} else {
  console.log("❌ Error al validar");
  console.log(`Motivo: ${validacionSunat.motivo}`);
}
```

### Para Reportes:

```python
# Obtener estado legible
estado_cp = item['validacionSunat']['estadoSunat']['estadoComprobante']
print(f"Estado: {estado_cp['descripcion']}")  # "ACEPTADO - Comprobante aceptado"
```

### Para Auditoría:

```sql
-- Buscar facturas con RUC inactivo (en DynamoDB scan)
filter_expression = "validacionSunat.estadoSunat.estadoRuc.codigo <> :activo"
expression_values = {":activo": "00"}
```

## 🎨 Badges de Estado

Puedes mostrar badges visuales basados en los códigos:

| Estado | Badge | Código |
|--------|-------|--------|
| Válida | 🟢 VÁLIDA | `esValido = true` |
| Anulada | 🟡 ANULADA | `estadoCp = "2"` |
| RUC Inactivo | 🔴 RUC INACTIVO | `estadoRuc != "00"` |
| No Existe | ⚫ NO EXISTE | `estadoCp = "0"` |
| Error | 🔴 ERROR | `validado = false` |

## 📝 Ventajas de Esta Estructura

1. **✅ Códigos + Descripciones**: No necesitas lookup table en frontend
2. **✅ Flag booleano**: `esValido` para decisiones rápidas
3. **✅ Trazabilidad**: Timestamp de cuándo se validó
4. **✅ Observaciones**: Notas adicionales de SUNAT
5. **✅ Manejo de errores**: Estados diferenciados (ERROR_API, NO_VALIDADO)
6. **✅ Backward compatible**: Puedes agregar más campos sin romper consultas existentes

## 🔄 Migración de Estructura Anterior

Si tenías datos con estructura antigua:

```python
# ANTES:
{
  "estadoSunat": {
    "estadoComprobante": "1",  # Solo código
    "estadoRuc": "00",
    "condicionDomicilio": "00"
  }
}

# AHORA:
{
  "estadoSunat": {
    "estadoComprobante": {
      "codigo": "1",
      "descripcion": "ACEPTADO - Comprobante aceptado"
    },
    "estadoRuc": {
      "codigo": "00",
      "descripcion": "ACTIVO"
    },
    "condicionDomicilio": {
      "codigo": "00",
      "descripcion": "HABIDO"
    }
  }
}
```

Script de migración disponible en: `migration_scripts/update_sunat_structure.py` (si lo necesitas)

## 📚 Referencias

- **Documentación SUNAT**: Anexo de códigos oficiales (imagen adjunta)
- **Lambda**: `lambda_claude.py` líneas 193-359
- **Pruebas**: `test_sunat_final.py`
- **Ejemplos**: `ejemplo_respuesta_sunat.json`

---

**Última actualización**: 2025-10-18 18:20 UTC
**Versión**: 2.0 (con descripciones completas)
