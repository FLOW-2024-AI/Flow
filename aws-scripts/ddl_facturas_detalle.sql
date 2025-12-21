-- =====================================================
-- DDL: Tabla de Detalles de Facturas (Subproductos) - MVP
-- =====================================================

-- Tabla para almacenar el detalle/líneas de cada factura
CREATE TABLE IF NOT EXISTS facturas_detalle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factura_id UUID NOT NULL,

    -- Información del producto/servicio
    numero_item INTEGER NOT NULL,
    descripcion TEXT NOT NULL,

    -- Cantidades y medidas
    cantidad DECIMAL(12, 2) NOT NULL DEFAULT 1,
    unidad_medida VARCHAR(20) DEFAULT 'UND',

    -- Precios
    precio_unitario DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    igv_monto DECIMAL(12, 2) DEFAULT 0,
    total_item DECIMAL(12, 2) NOT NULL,

    -- Metadatos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice simple para búsquedas por factura
CREATE INDEX IF NOT EXISTS idx_facturas_detalle_factura_id ON facturas_detalle(factura_id);

-- =====================================================
-- Vista: Facturas con Detalle (Simple)
-- =====================================================

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
