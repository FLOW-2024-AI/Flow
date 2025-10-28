-- =====================================================
-- Script de Diagnóstico: Estructura del JSON data_completa
-- =====================================================
-- Ejecuta este script para entender cómo está estructurado
-- tu campo data_completa y ajustar la vista según necesites
-- =====================================================

-- PASO 1: Ver una muestra del JSON completo
SELECT
    invoice_id,
    numero_factura,
    data_completa
FROM facturas
WHERE aprobado_por_cliente = TRUE
  AND data_completa IS NOT NULL
LIMIT 1;

-- PASO 2: Ver las claves principales del JSON
SELECT DISTINCT
    jsonb_object_keys(data_completa) as claves_json
FROM facturas
WHERE aprobado_por_cliente = TRUE
  AND data_completa IS NOT NULL
LIMIT 20;

-- PASO 3: Verificar dónde están los items/productos
SELECT
    invoice_id,
    numero_factura,
    CASE
        WHEN data_completa ? 'items' THEN 'items'
        WHEN data_completa ? 'productos' THEN 'productos'
        WHEN data_completa ? 'detalle' THEN 'detalle'
        WHEN data_completa ? 'lineas' THEN 'lineas'
        WHEN data_completa ? 'lines' THEN 'lines'
        ELSE 'NO ENCONTRADO'
    END as campo_items,
    CASE
        WHEN jsonb_typeof(data_completa->'items') = 'array'
            THEN jsonb_array_length(data_completa->'items')
        WHEN jsonb_typeof(data_completa->'productos') = 'array'
            THEN jsonb_array_length(data_completa->'productos')
        WHEN jsonb_typeof(data_completa->'detalle') = 'array'
            THEN jsonb_array_length(data_completa->'detalle')
        ELSE 0
    END as cantidad_items
FROM facturas
WHERE aprobado_por_cliente = TRUE
  AND data_completa IS NOT NULL
LIMIT 10;

-- PASO 4: Ver la estructura de un item individual
SELECT
    invoice_id,
    numero_factura,
    item
FROM facturas f
CROSS JOIN LATERAL (
    SELECT
        CASE
            WHEN jsonb_typeof(f.data_completa->'items') = 'array'
                THEN f.data_completa->'items'->0
            WHEN jsonb_typeof(f.data_completa->'productos') = 'array'
                THEN f.data_completa->'productos'->0
            WHEN jsonb_typeof(f.data_completa->'detalle') = 'array'
                THEN f.data_completa->'detalle'->0
            ELSE NULL
        END as item
) sub
WHERE f.aprobado_por_cliente = TRUE
  AND f.data_completa IS NOT NULL
  AND item IS NOT NULL
LIMIT 1;

-- PASO 5: Ver las claves de un item
SELECT DISTINCT
    jsonb_object_keys(item) as claves_item
FROM facturas f
CROSS JOIN LATERAL (
    SELECT value as item
    FROM jsonb_array_elements(
        CASE
            WHEN jsonb_typeof(f.data_completa->'items') = 'array'
                THEN f.data_completa->'items'
            WHEN jsonb_typeof(f.data_completa->'productos') = 'array'
                THEN f.data_completa->'productos'
            WHEN jsonb_typeof(f.data_completa->'detalle') = 'array'
                THEN f.data_completa->'detalle'
            ELSE '[]'::jsonb
        END
    )
) sub
WHERE f.aprobado_por_cliente = TRUE
  AND f.data_completa IS NOT NULL
LIMIT 50;

-- =====================================================
-- PASO 6: Ejemplo completo de extracción
-- =====================================================
-- Una vez que identifiques la estructura, ajusta esta query:

SELECT
    f.invoice_id,
    f.numero_factura,
    f.monto_total,
    -- Ajusta estos campos según lo que encuentres en el diagnóstico
    item->>'descripcion' as producto,
    item->>'cantidad' as cantidad,
    item->>'precio' as precio,
    item->>'total' as total
FROM facturas f
CROSS JOIN LATERAL jsonb_array_elements(
    -- Ajusta 'items' por el campo correcto que encontraste
    f.data_completa->'items'
) as item
WHERE f.aprobado_por_cliente = TRUE
  AND f.data_completa IS NOT NULL
LIMIT 10;

-- =====================================================
-- Instrucciones:
-- =====================================================
-- 1. Ejecuta cada SELECT por separado
-- 2. Observa la estructura del JSON
-- 3. Identifica dónde están los items (items, productos, detalle, etc.)
-- 4. Identifica los campos de cada item (descripcion, cantidad, precio, etc.)
-- 5. Ajusta la vista principal según lo que encuentres
-- =====================================================
