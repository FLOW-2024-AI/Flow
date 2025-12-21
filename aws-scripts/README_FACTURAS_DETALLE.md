# Sistema de Detalles de Facturas (Subproductos)

## 📋 Descripción

Este sistema permite gestionar el detalle completo de cada factura, almacenando información de cada producto o servicio incluido en la factura (líneas de detalle).

## 🗂️ Estructura de Archivos

- **`ddl_facturas_detalle.sql`**: Contiene la definición de la tabla, índices, triggers y vistas
- **`insert_facturas_detalle_ejemplo.sql`**: Scripts de ejemplo para insertar datos de prueba
- **`README_FACTURAS_DETALLE.md`**: Este archivo con la documentación

## 🚀 Instalación

### Paso 1: Crear la tabla y vistas

Ejecuta el archivo DDL en tu base de datos PostgreSQL:

```bash
psql -h TU_HOST -U TU_USUARIO -d TU_DATABASE -f ddl_facturas_detalle.sql
```

O desde la consola de PostgreSQL:

```sql
\i /ruta/completa/ddl_facturas_detalle.sql
```

### Paso 2: Insertar datos de ejemplo (Opción 1 - Manual)

Si quieres insertar datos manualmente, edita el archivo `insert_facturas_detalle_ejemplo.sql` y reemplaza los `factura_id` con los IDs reales de tus facturas:

```sql
-- Primero, obtén los IDs de tus facturas
SELECT id, invoice_id, numero_factura, nombre_proveedor
FROM facturas
WHERE aprobado_por_cliente = TRUE
ORDER BY fecha_emision DESC
LIMIT 10;

-- Luego ejecuta el script de inserción
\i /ruta/completa/insert_facturas_detalle_ejemplo.sql
```

### Paso 2: Generar datos automáticamente (Opción 2 - Automático)

El archivo `insert_facturas_detalle_ejemplo.sql` incluye un bloque `DO` que genera automáticamente datos de ejemplo para las primeras 5 facturas aprobadas:

```sql
-- Ejecuta solo la sección del cursor (líneas 145-194 del archivo)
-- Esto generará entre 1 y 3 items por cada factura
```

## 📊 Estructura de la Tabla `facturas_detalle`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL | ID único del detalle |
| `factura_id` | INTEGER | ID de la factura principal (FK) |
| `numero_item` | INTEGER | Número de línea en la factura |
| `codigo_producto` | VARCHAR(100) | Código del producto/servicio |
| `descripcion` | TEXT | Descripción del producto/servicio |
| `cantidad` | DECIMAL(12,4) | Cantidad |
| `unidad_medida` | VARCHAR(20) | Unidad (UND, KG, LT, etc.) |
| `precio_unitario` | DECIMAL(12,4) | Precio con IGV |
| `valor_unitario` | DECIMAL(12,4) | Precio sin IGV |
| `descuento_monto` | DECIMAL(12,2) | Monto del descuento |
| `descuento_porcentaje` | DECIMAL(5,2) | Porcentaje de descuento |
| `subtotal` | DECIMAL(12,2) | Subtotal sin IGV |
| `igv_monto` | DECIMAL(12,2) | Monto del IGV |
| `total_item` | DECIMAL(12,2) | Total del item |
| `tipo_afectacion_igv` | VARCHAR(10) | GRA/EXO/INA |
| `porcentaje_igv` | DECIMAL(5,2) | Porcentaje de IGV (18%) |

## 🔍 Vistas Disponibles

### 1. `vw_facturas_con_detalle`

Vista completa que une facturas con sus detalles:

```sql
-- Consultar todas las facturas con sus detalles
SELECT *
FROM vw_facturas_con_detalle
ORDER BY fecha_emision DESC, numero_item ASC;

-- Consultar detalle de una factura específica
SELECT *
FROM vw_facturas_con_detalle
WHERE invoice_id = 'TU_INVOICE_ID';
```

### 2. `vw_facturas_resumen`

Vista resumen que muestra cantidad de items por factura:

```sql
-- Ver resumen de facturas con cantidad de items
SELECT
    numero_factura,
    nombre_proveedor,
    monto_total,
    cantidad_items,
    cantidad_total_productos
FROM vw_facturas_resumen
ORDER BY fecha_emision DESC;
```

## 💡 Consultas Útiles

### Consultar facturas con sus detalles

```sql
SELECT
    f.numero_factura,
    f.nombre_proveedor,
    f.fecha_emision,
    f.monto_total,
    fd.numero_item,
    fd.descripcion,
    fd.cantidad,
    fd.precio_unitario,
    fd.total_item
FROM facturas f
INNER JOIN facturas_detalle fd ON f.id = fd.factura_id
WHERE f.aprobado_por_cliente = TRUE
ORDER BY f.fecha_emision DESC, fd.numero_item ASC;
```

### Facturas con cantidad de items

```sql
SELECT
    f.numero_factura,
    f.nombre_proveedor,
    f.monto_total,
    COUNT(fd.id) as cantidad_items,
    SUM(fd.cantidad) as total_productos
FROM facturas f
LEFT JOIN facturas_detalle fd ON f.id = fd.factura_id
WHERE f.aprobado_por_cliente = TRUE
GROUP BY f.id, f.numero_factura, f.nombre_proveedor, f.monto_total
ORDER BY f.fecha_emision DESC;
```

### Top productos más facturados

```sql
SELECT
    fd.codigo_producto,
    fd.descripcion,
    COUNT(*) as veces_facturado,
    SUM(fd.cantidad) as cantidad_total,
    SUM(fd.total_item) as monto_total
FROM facturas_detalle fd
INNER JOIN facturas f ON fd.factura_id = f.id
WHERE f.aprobado_por_cliente = TRUE
GROUP BY fd.codigo_producto, fd.descripcion
ORDER BY cantidad_total DESC
LIMIT 10;
```

### Detalles con descuentos aplicados

```sql
SELECT
    f.numero_factura,
    f.nombre_proveedor,
    fd.descripcion,
    fd.cantidad,
    fd.precio_unitario,
    fd.descuento_monto,
    fd.descuento_porcentaje,
    fd.total_item
FROM facturas f
INNER JOIN facturas_detalle fd ON f.id = fd.factura_id
WHERE fd.descuento_monto > 0
ORDER BY fd.descuento_monto DESC;
```

## 🔧 Insertar Detalles Manualmente

```sql
-- Ejemplo: Insertar detalle de una factura
INSERT INTO facturas_detalle (
    factura_id,
    numero_item,
    codigo_producto,
    descripcion,
    cantidad,
    unidad_medida,
    precio_unitario,
    valor_unitario,
    subtotal,
    igv_monto,
    total_item,
    tipo_afectacion_igv,
    porcentaje_igv
) VALUES (
    123, -- ID de la factura
    1,
    'PROD-001',
    'Laptop HP ProBook 450 G8',
    2,
    'UND',
    3500.00,
    2966.10,
    5932.20,
    1067.80,
    7000.00,
    'GRA',
    18.00
);
```

## 📈 Validaciones y Constraints

- **Foreign Key**: `factura_id` debe existir en la tabla `facturas`
- **Cascade Delete**: Al eliminar una factura, se eliminan automáticamente sus detalles
- **Índices**: Búsquedas optimizadas por factura_id, codigo_producto y descripción
- **Trigger**: `updated_at` se actualiza automáticamente en cada modificación

## 🎯 Tipos de Afectación IGV

| Código | Descripción |
|--------|-------------|
| `GRA` | Gravado - Operación Onerosa (18% IGV) |
| `EXO` | Exonerado - No paga IGV por ley |
| `INA` | Inafecto - No está afecto al IGV |

## 📝 Notas Importantes

1. **Validación de totales**: Asegúrate de que la suma de `total_item` de todos los detalles coincida con el `monto_total` de la factura
2. **Cálculo de IGV**: Por defecto es 18%, pero puede variar según el tipo de producto
3. **Unidades de medida**: Usa códigos estándar (UND, KG, LT, M, SER, HOR, etc.)
4. **Performance**: Los índices están optimizados para búsquedas frecuentes

## 🚨 Troubleshooting

### Error: factura_id no existe

```sql
-- Verifica que la factura exista
SELECT id, invoice_id, numero_factura
FROM facturas
WHERE id = TU_FACTURA_ID;
```

### Error: La suma de items no coincide con el total

```sql
-- Verificar diferencias
SELECT
    f.id,
    f.numero_factura,
    f.monto_total as total_factura,
    COALESCE(SUM(fd.total_item), 0) as suma_items,
    f.monto_total - COALESCE(SUM(fd.total_item), 0) as diferencia
FROM facturas f
LEFT JOIN facturas_detalle fd ON f.id = fd.factura_id
WHERE f.aprobado_por_cliente = TRUE
GROUP BY f.id, f.numero_factura, f.monto_total
HAVING ABS(f.monto_total - COALESCE(SUM(fd.total_item), 0)) > 0.01;
```

## 📞 Soporte

Para más información o soporte, contacta al equipo de desarrollo.
