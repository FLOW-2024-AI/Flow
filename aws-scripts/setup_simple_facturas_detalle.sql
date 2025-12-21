-- =====================================================
-- SETUP SIMPLE: Sistema de Detalles de Facturas - MVP
-- =====================================================
-- Script simplificado sin constraints complejos
-- Compatible con UUID
-- =====================================================

-- Crear tabla facturas_detalle
CREATE TABLE IF NOT EXISTS facturas_detalle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factura_id UUID NOT NULL,
    numero_item INTEGER NOT NULL,
    descripcion TEXT NOT NULL,
    cantidad DECIMAL(12, 2) NOT NULL DEFAULT 1,
    unidad_medida VARCHAR(20) DEFAULT 'UND',
    precio_unitario DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    igv_monto DECIMAL(12, 2) DEFAULT 0,
    total_item DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas por factura
CREATE INDEX IF NOT EXISTS idx_facturas_detalle_factura_id ON facturas_detalle(factura_id);

-- Vista simple
CREATE OR REPLACE VIEW vw_facturas_con_detalle AS
SELECT
    f.id as factura_id,
    f.invoice_id,
    f.numero_factura,
    f.nombre_proveedor,
    f.ruc_emisor,
    f.fecha_emision,
    f.monto_total as factura_total,
    fd.id as detalle_id,
    fd.numero_item,
    fd.descripcion,
    fd.cantidad,
    fd.unidad_medida,
    fd.precio_unitario,
    fd.subtotal,
    fd.igv_monto,
    fd.total_item
FROM facturas f
LEFT JOIN facturas_detalle fd ON f.id = fd.factura_id
WHERE f.aprobado_por_cliente = TRUE
ORDER BY f.fecha_emision DESC, fd.numero_item ASC;

-- Insertar datos de ejemplo automáticamente
DO $$
DECLARE
    factura_record RECORD;
    item_count INTEGER;
    total_item DECIMAL(12,2);
    subtotal_item DECIMAL(12,2);
    igv_item DECIMAL(12,2);
    productos TEXT[] := ARRAY[
        'Laptop HP ProBook 450 G8',
        'Mouse inalámbrico Logitech',
        'Monitor LG 27" 4K',
        'Servicio de soporte técnico',
        'Consultoría en sistemas',
        'Mantenimiento de equipos',
        'Licencia de software',
        'Teclado mecánico',
        'Cable HDMI certificado',
        'Disco duro externo 1TB'
    ];
BEGIN
    FOR factura_record IN
        SELECT id, monto_total
        FROM facturas
        WHERE aprobado_por_cliente = TRUE
        ORDER BY created_at DESC
        LIMIT 10
    LOOP
        item_count := floor(random() * 3 + 1)::INTEGER;

        FOR i IN 1..item_count LOOP
            IF i < item_count THEN
                total_item := (factura_record.monto_total / item_count)::DECIMAL(12,2);
            ELSE
                total_item := (factura_record.monto_total -
                    (SELECT COALESCE(SUM(total_item), 0)
                     FROM facturas_detalle
                     WHERE factura_id = factura_record.id))::DECIMAL(12,2);
            END IF;

            subtotal_item := (total_item / 1.18)::DECIMAL(12,2);
            igv_item := (total_item - subtotal_item)::DECIMAL(12,2);

            INSERT INTO facturas_detalle (
                factura_id,
                numero_item,
                descripcion,
                cantidad,
                unidad_medida,
                precio_unitario,
                subtotal,
                igv_monto,
                total_item
            ) VALUES (
                factura_record.id,
                i,
                productos[(i % 10) + 1],
                floor(random() * 5 + 1)::DECIMAL(12,2),
                'UND',
                (total_item / floor(random() * 5 + 1))::DECIMAL(12,2),
                subtotal_item,
                igv_item,
                total_item
            );
        END LOOP;

        RAISE NOTICE 'Factura ID %: % items', factura_record.id, item_count;
    END LOOP;
END $$;

-- Verificar
SELECT
    f.numero_factura,
    f.nombre_proveedor,
    f.monto_total,
    COUNT(fd.id) as items,
    COALESCE(SUM(fd.total_item), 0) as suma_items
FROM facturas f
LEFT JOIN facturas_detalle fd ON f.id = fd.factura_id
WHERE f.aprobado_por_cliente = TRUE
GROUP BY f.numero_factura, f.nombre_proveedor, f.monto_total
ORDER BY f.numero_factura
LIMIT 10;

SELECT '✓ Setup completado' as status,
       (SELECT COUNT(*) FROM facturas_detalle) as total_detalles;
