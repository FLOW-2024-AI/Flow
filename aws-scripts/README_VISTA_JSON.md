# Vista de Detalles desde JSON - data_completa

## 📋 Descripción

Sistema para extraer el detalle de facturas (items/productos) directamente desde el campo JSON `data_completa`, **sin crear tablas adicionales**.

## 🎯 Solución Simple - Solo Vistas

En lugar de crear tablas, usamos el JSON que ya tienes en `facturas.data_completa` para obtener la granularidad de cada factura.

## 📄 Archivos

1. **`diagnostico_json.sql`** ⭐ **EJECUTA PRIMERO**
   - Analiza tu estructura JSON
   - Te muestra cómo están organizados los datos
   - 6 queries de diagnóstico

2. **`vista_facturas_detalle_json.sql`**
   - Crea las vistas que extraen items del JSON
   - 2 vistas: detalle completo y resumen

## 🚀 Pasos de Implementación

### Paso 1: Diagnóstico (REQUERIDO)

Ejecuta el script de diagnóstico para entender tu estructura JSON:

```bash
psql -h TU_HOST -U TU_USUARIO -d TU_DATABASE -f diagnostico_json.sql
```

O ejecuta cada query individualmente para ver:
1. ✅ Una muestra del JSON completo
2. ✅ Las claves principales del JSON
3. ✅ Dónde están los items (¿`items`?, ¿`productos`?, ¿`detalle`?)
4. ✅ Estructura de un item individual
5. ✅ Claves disponibles en cada item
6. ✅ Ejemplo de extracción

### Paso 2: Ajustar la Vista

Según lo que encuentres en el diagnóstico, ajusta la vista en `vista_facturas_detalle_json.sql`:

**Ejemplo:** Si tus items están en `data_completa->productos`:
```sql
-- Cambiar esto:
CROSS JOIN LATERAL jsonb_array_elements(f.data_completa->'items')

-- Por esto:
CROSS JOIN LATERAL jsonb_array_elements(f.data_completa->'productos')
```

**Ejemplo:** Si los campos tienen nombres diferentes:
```sql
-- Si en tu JSON es "descripcion_producto" en lugar de "descripcion":
item->>'descripcion_producto' as descripcion
```

### Paso 3: Crear las Vistas

Una vez ajustado, ejecuta:

```bash
psql -h TU_HOST -U TU_USUARIO -d TU_DATABASE -f vista_facturas_detalle_json.sql
```

## 📊 Vistas Creadas

### 1. `vw_facturas_detalle_completo`

Extrae cada item/producto de cada factura:

```sql
SELECT
    invoice_id,
    numero_factura,
    nombre_proveedor,
    numero_item,
    descripcion,
    cantidad,
    precio_unitario,
    total_item
FROM vw_facturas_detalle_completo
ORDER BY fecha_emision DESC, numero_item ASC;
```

**Campos incluidos:**
- Información de la factura (proveedor, RUC, fecha, montos)
- Información de cada item (descripción, cantidad, precio, total)
- Descuentos, IGV, tipo de afectación

### 2. `vw_facturas_resumen_items`

Resumen con cantidad de items por factura:

```sql
SELECT
    numero_factura,
    nombre_proveedor,
    monto_total,
    cantidad_items
FROM vw_facturas_resumen_items
ORDER BY fecha_emision DESC;
```

## 💡 Consultas Útiles

### Ver detalle de una factura específica
```sql
SELECT
    numero_item,
    descripcion,
    cantidad,
    unidad_medida,
    precio_unitario,
    total_item
FROM vw_facturas_detalle_completo
WHERE invoice_id = 'TU-INVOICE-ID'
ORDER BY numero_item;
```

### Top 10 productos más facturados
```sql
SELECT
    descripcion,
    COUNT(*) as veces_facturado,
    SUM(cantidad) as cantidad_total,
    SUM(total_item) as monto_total_vendido
FROM vw_facturas_detalle_completo
GROUP BY descripcion
ORDER BY cantidad_total DESC
LIMIT 10;
```

### Facturas con más items
```sql
SELECT
    numero_factura,
    nombre_proveedor,
    cantidad_items,
    monto_total
FROM vw_facturas_resumen_items
ORDER BY cantidad_items DESC
LIMIT 10;
```

### Items con descuentos
```sql
SELECT
    numero_factura,
    descripcion,
    cantidad,
    precio_unitario,
    descuento,
    total_item
FROM vw_facturas_detalle_completo
WHERE descuento > 0
ORDER BY descuento DESC;
```

### Productos por proveedor
```sql
SELECT
    nombre_proveedor,
    COUNT(DISTINCT descripcion) as productos_diferentes,
    SUM(cantidad) as cantidad_total_comprada
FROM vw_facturas_detalle_completo
GROUP BY nombre_proveedor
ORDER BY cantidad_total_comprada DESC;
```

## 🔍 Estructura JSON Esperada

La vista busca items en estos posibles campos (en orden):
1. `data_completa->items`
2. `data_completa->productos`
3. `data_completa->detalle`

Cada item debería tener campos como:
```json
{
  "numero_item": 1,
  "codigo_producto": "PROD-001",
  "descripcion": "Laptop HP ProBook",
  "cantidad": 2,
  "unidad_medida": "UND",
  "precio_unitario": 3500.00,
  "valor_unitario": 2966.10,
  "descuento": 0,
  "subtotal": 5932.20,
  "igv": 1067.80,
  "total": 7000.00,
  "tipo_afectacion_igv": "GRA"
}
```

## ⚠️ Notas Importantes

1. **Sin Tablas Adicionales**: Solo crea vistas, no modifica la estructura de datos
2. **Rendimiento**: Las vistas consultan JSON en cada query, puede ser más lento con muchos datos
3. **Flexibilidad**: Fácil de ajustar según tu estructura JSON real
4. **Compatibilidad**: Funciona con PostgreSQL 9.4+

## 🔧 Troubleshooting

### Error: "cannot extract elements from a scalar"
**Causa:** El campo no es un array
**Solución:** Verifica con el diagnóstico dónde están realmente tus items

### Error: "operator does not exist: jsonb ->> unknown"
**Causa:** Intentas acceder a un campo que no existe
**Solución:** Usa el diagnóstico (Paso 5) para ver los campos reales

### No se muestran resultados
**Causa:** El filtro `data_completa IS NOT NULL` no encuentra datos
**Solución:** Verifica que tus facturas tengan el campo `data_completa` poblado

## 📈 Ventajas de Esta Solución

✅ **Sin migración de datos**: Usa lo que ya tienes
✅ **Sin tablas adicionales**: No complica tu esquema
✅ **Fácil de ajustar**: Solo modifica la vista
✅ **MVP rápido**: Funciona de inmediato
✅ **Reversible**: Puedes eliminar las vistas cuando quieras

## 📞 Siguiente Paso

1. Ejecuta `diagnostico_json.sql` para ver tu estructura
2. Comparte los resultados si necesitas ayuda para ajustar
3. Crea las vistas con `vista_facturas_detalle_json.sql`

¡Listo! 🎉
