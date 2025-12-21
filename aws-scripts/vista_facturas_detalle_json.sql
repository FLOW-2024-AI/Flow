-- =====================================================
-- Vista: Detalles de Facturas usando data_completa (JSON)
-- =====================================================
-- Esta vista extrae los items/productos de cada factura
-- desde el campo JSON 'data_completa'
-- =====================================================

CREATE OR REPLACE VIEW vw_facturas_detalle_completo AS
SELECT
    -- Información de la factura
    f.id as factura_id,
    f.invoice_id,
    f.numero_factura,
    f.nombre_proveedor,
    f.ruc_emisor,
    f.fecha_emision,
    f.fecha_vencimiento,
    f.plazo_credito,
    f.moneda,
    f.monto_subtotal as factura_subtotal,
    f.monto_igv as factura_igv,
    f.monto_total as factura_total,
    f.sunat_estado,
    f.sunat_estado_ruc_descripcion,
    f.aprobado_por_cliente,
    f.aprobado_fecha,

    -- Extraer información de cada item del JSON
    (item->>'numero_item')::INTEGER as numero_item,
    item->>'codigo_producto' as codigo_producto,
    item->>'descripcion' as descripcion,
    (item->>'cantidad')::DECIMAL(12,2) as cantidad,
    item->>'unidad_medida' as unidad_medida,
    (item->>'precio_unitario')::DECIMAL(12,2) as precio_unitario,
    (item->>'valor_unitario')::DECIMAL(12,2) as valor_unitario,
    (item->>'descuento')::DECIMAL(12,2) as descuento,
    (item->>'subtotal')::DECIMAL(12,2) as subtotal,
    (item->>'igv')::DECIMAL(12,2) as igv,
    (item->>'total')::DECIMAL(12,2) as total_item,
    item->>'tipo_afectacion_igv' as tipo_afectacion_igv

FROM facturas f
CROSS JOIN LATERAL jsonb_array_elements(
    CASE
        WHEN jsonb_typeof(f.data_completa->'items') = 'array' THEN f.data_completa->'items'
        WHEN jsonb_typeof(f.data_completa->'productos') = 'array' THEN f.data_completa->'productos'
        WHEN jsonb_typeof(f.data_completa->'detalle') = 'array' THEN f.data_completa->'detalle'
        ELSE '[]'::jsonb
    END
) as item
WHERE f.aprobado_por_cliente = TRUE
  AND f.data_completa IS NOT NULL
ORDER BY f.fecha_emision DESC, (item->>'numero_item')::INTEGER ASC;

-- =====================================================
-- Vista Resumen: Facturas con cantidad de items
-- =====================================================

CREATE OR REPLACE VIEW vw_facturas_resumen_items AS
SELECT
    f.id as factura_id,
    f.invoice_id,
    f.numero_factura,
    f.nombre_proveedor,
    f.ruc_emisor,
    f.fecha_emision,
    f.moneda,
    f.monto_total,
    f.aprobado_por_cliente,
    -- Contar items del JSON
    CASE
        WHEN jsonb_typeof(f.data_completa->'items') = 'array'
            THEN jsonb_array_length(f.data_completa->'items')
        WHEN jsonb_typeof(f.data_completa->'productos') = 'array'
            THEN jsonb_array_length(f.data_completa->'productos')
        WHEN jsonb_typeof(f.data_completa->'detalle') = 'array'
            THEN jsonb_array_length(f.data_completa->'detalle')
        ELSE 0
    END as cantidad_items,
    f.creado_en
FROM facturas f
WHERE f.aprobado_por_cliente = TRUE
  AND f.data_completa IS NOT NULL
ORDER BY f.fecha_emision DESC;

-- =====================================================
-- Ejemplos de Uso
-- =====================================================

-- Ver todos los detalles de facturas
-- SELECT * FROM vw_facturas_detalle_completo;

-- Ver detalles de una factura específica
-- SELECT * FROM vw_facturas_detalle_completo
-- WHERE invoice_id = 'TU_INVOICE_ID';

-- Ver facturas con cantidad de items
-- SELECT * FROM vw_facturas_resumen_items;

-- Top productos más facturados
-- SELECT
--     descripcion,
--     COUNT(*) as veces_facturado,
--     SUM(cantidad) as cantidad_total,
--     SUM(total_item) as monto_total
-- FROM vw_facturas_detalle_completo
-- GROUP BY descripcion
-- ORDER BY cantidad_total DESC
-- LIMIT 10;

-- =====================================================
-- Notas:
-- =====================================================
-- Esta vista busca items en varios posibles campos JSON:
-- - data_completa->items
-- - data_completa->productos
-- - data_completa->detalle
--
-- Ajusta los nombres de campos según tu estructura JSON real
-- =====================================================
