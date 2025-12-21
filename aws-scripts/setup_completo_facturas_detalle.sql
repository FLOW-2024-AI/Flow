-- =====================================================
-- SETUP COMPLETO: Sistema de Detalles de Facturas
-- =====================================================
-- Este script hace todo:
-- 1. Crea la tabla facturas_detalle
-- 2. Crea índices y triggers
-- 3. Crea las vistas necesarias
-- 4. Inserta datos de ejemplo automáticamente
-- =====================================================

-- =====================================================
-- PASO 1: Crear tabla facturas_detalle
-- =====================================================

CREATE TABLE IF NOT EXISTS facturas_detalle (
    id SERIAL PRIMARY KEY,
    factura_id INTEGER NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,

    -- Información del producto/servicio
    numero_item INTEGER NOT NULL,
    codigo_producto VARCHAR(100),
    descripcion TEXT NOT NULL,

    -- Cantidades y medidas
    cantidad DECIMAL(12, 4) NOT NULL DEFAULT 1,
    unidad_medida VARCHAR(20) DEFAULT 'UND',

    -- Precios
    precio_unitario DECIMAL(12, 4) NOT NULL,
    valor_unitario DECIMAL(12, 4),

    -- Descuentos
    descuento_monto DECIMAL(12, 2) DEFAULT 0,
    descuento_porcentaje DECIMAL(5, 2) DEFAULT 0,

    -- Subtotales
    subtotal DECIMAL(12, 2) NOT NULL,
    igv_monto DECIMAL(12, 2) DEFAULT 0,
    total_item DECIMAL(12, 2) NOT NULL,

    -- Información adicional
    tipo_afectacion_igv VARCHAR(10) DEFAULT 'GRA',
    porcentaje_igv DECIMAL(5, 2) DEFAULT 18.00,

    -- Metadatos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_factura FOREIGN KEY (factura_id) REFERENCES facturas(id)
);

-- =====================================================
-- PASO 2: Crear índices
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_facturas_detalle_factura_id ON facturas_detalle(factura_id);
CREATE INDEX IF NOT EXISTS idx_facturas_detalle_codigo_producto ON facturas_detalle(codigo_producto);
CREATE INDEX IF NOT EXISTS idx_facturas_detalle_descripcion ON facturas_detalle USING gin(to_tsvector('spanish', descripcion));

-- =====================================================
-- PASO 3: Crear trigger para updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_facturas_detalle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_facturas_detalle_updated_at ON facturas_detalle;
CREATE TRIGGER trigger_update_facturas_detalle_updated_at
    BEFORE UPDATE ON facturas_detalle
    FOR EACH ROW
    EXECUTE FUNCTION update_facturas_detalle_updated_at();

-- =====================================================
-- PASO 4: Crear vistas
-- =====================================================

-- Vista: Facturas con detalle completo
CREATE OR REPLACE VIEW vw_facturas_con_detalle AS
SELECT
    f.id as factura_id,
    f.invoice_id,
    f.numero_factura,
    f.serie_numero,
    f.ruc_emisor,
    f.nombre_proveedor,
    f.fecha_emision,
    f.fecha_vencimiento,
    f.plazo_pago,
    f.moneda,
    f.monto_subtotal as factura_subtotal,
    f.monto_igv as factura_igv,
    f.monto_total as factura_total,
    f.sunat_estado,
    f.sunat_estado_ruc_descripcion,
    f.aprobado_por_cliente,
    f.aprobado_fecha,
    fd.id as detalle_id,
    fd.numero_item,
    fd.codigo_producto,
    fd.descripcion,
    fd.cantidad,
    fd.unidad_medida,
    fd.precio_unitario,
    fd.valor_unitario,
    fd.descuento_monto,
    fd.descuento_porcentaje,
    fd.subtotal as item_subtotal,
    fd.igv_monto as item_igv,
    fd.total_item,
    fd.tipo_afectacion_igv,
    fd.porcentaje_igv,
    COUNT(*) OVER (PARTITION BY f.id) as total_items,
    SUM(fd.total_item) OVER (PARTITION BY f.id) as suma_items
FROM facturas f
LEFT JOIN facturas_detalle fd ON f.id = fd.factura_id
WHERE f.aprobado_por_cliente = TRUE
ORDER BY f.fecha_emision DESC, fd.numero_item ASC;

-- Vista: Resumen de facturas
CREATE OR REPLACE VIEW vw_facturas_resumen AS
SELECT
    f.id as factura_id,
    f.invoice_id,
    f.numero_factura,
    f.serie_numero,
    f.nombre_proveedor,
    f.ruc_emisor,
    f.fecha_emision,
    f.fecha_vencimiento,
    f.moneda,
    f.monto_total,
    f.aprobado_por_cliente,
    COUNT(fd.id) as cantidad_items,
    COALESCE(SUM(fd.cantidad), 0) as cantidad_total_productos,
    f.created_at
FROM facturas f
LEFT JOIN facturas_detalle fd ON f.id = fd.factura_id
GROUP BY f.id, f.invoice_id, f.numero_factura, f.serie_numero,
         f.nombre_proveedor, f.ruc_emisor, f.fecha_emision, f.fecha_vencimiento,
         f.moneda, f.monto_total, f.aprobado_por_cliente, f.created_at
ORDER BY f.fecha_emision DESC;

-- =====================================================
-- PASO 5: Insertar datos de ejemplo automáticamente
-- =====================================================

DO $$
DECLARE
    factura_record RECORD;
    item_count INTEGER;
    total_factura DECIMAL(12,2);
    precio_base DECIMAL(12,4);
    cantidad_item DECIMAL(12,4);
    subtotal_item DECIMAL(12,2);
    igv_item DECIMAL(12,2);
    total_item DECIMAL(12,2);
    productos TEXT[] := ARRAY[
        'Laptop HP ProBook 450 G8, Intel Core i5, 8GB RAM',
        'Mouse inalámbrico Logitech MX Master 3',
        'Teclado mecánico Corsair K70 RGB',
        'Monitor LG 27" 4K UHD',
        'Servicio de soporte técnico',
        'Licencia de software Microsoft Office',
        'Consultoría en sistemas',
        'Mantenimiento preventivo de equipos',
        'Cable HDMI 2.1 certificado',
        'Disco duro externo 1TB'
    ];
    unidades TEXT[] := ARRAY['UND', 'UND', 'UND', 'UND', 'SER', 'UND', 'HOR', 'SER', 'UND', 'UND'];
BEGIN
    -- Iterar sobre las facturas aprobadas (máximo 10)
    FOR factura_record IN
        SELECT id, monto_subtotal, monto_igv, monto_total
        FROM facturas
        WHERE aprobado_por_cliente = TRUE
        ORDER BY id
        LIMIT 10
    LOOP
        -- Generar entre 1 y 4 items por factura
        item_count := floor(random() * 4 + 1)::INTEGER;
        total_factura := factura_record.monto_total;

        FOR i IN 1..item_count LOOP
            -- Calcular valores proporcionales
            cantidad_item := floor(random() * 5 + 1)::DECIMAL(12,4);

            -- Distribuir el total de la factura entre los items
            IF i < item_count THEN
                total_item := (total_factura / item_count)::DECIMAL(12,2);
            ELSE
                -- El último item toma el remanente para que sume exacto
                total_item := (factura_record.monto_total - (SELECT COALESCE(SUM(total_item), 0) FROM facturas_detalle WHERE factura_id = factura_record.id))::DECIMAL(12,2);
            END IF;

            -- Calcular precio unitario
            precio_base := (total_item / cantidad_item)::DECIMAL(12,4);

            -- Calcular subtotal e IGV (18%)
            subtotal_item := (total_item / 1.18)::DECIMAL(12,2);
            igv_item := (total_item - subtotal_item)::DECIMAL(12,2);

            -- Insertar el detalle
            INSERT INTO facturas_detalle (
                factura_id,
                numero_item,
                codigo_producto,
                descripcion,
                cantidad,
                unidad_medida,
                precio_unitario,
                valor_unitario,
                descuento_monto,
                descuento_porcentaje,
                subtotal,
                igv_monto,
                total_item,
                tipo_afectacion_igv,
                porcentaje_igv
            ) VALUES (
                factura_record.id,
                i,
                'PROD-' || LPAD((i * factura_record.id)::TEXT, 6, '0'),
                productos[(i % 10) + 1],
                cantidad_item,
                unidades[(i % 10) + 1],
                precio_base,
                (precio_base / 1.18)::DECIMAL(12,4),
                0.00,
                0.00,
                subtotal_item,
                igv_item,
                total_item,
                'GRA',
                18.00
            );
        END LOOP;

        RAISE NOTICE 'Factura ID %: insertados % items (Total: %)',
                     factura_record.id, item_count, factura_record.monto_total;
    END LOOP;

    RAISE NOTICE '✓ Proceso completado exitosamente';
END $$;

-- =====================================================
-- PASO 6: Verificación de datos
-- =====================================================

-- Ver resumen de facturas con detalles
SELECT
    f.numero_factura,
    f.nombre_proveedor,
    f.monto_total as total_factura,
    COUNT(fd.id) as items,
    COALESCE(SUM(fd.total_item), 0) as suma_items,
    (f.monto_total - COALESCE(SUM(fd.total_item), 0)) as diferencia
FROM facturas f
LEFT JOIN facturas_detalle fd ON f.id = fd.factura_id
WHERE f.aprobado_por_cliente = TRUE
GROUP BY f.id, f.numero_factura, f.nombre_proveedor, f.monto_total
ORDER BY f.numero_factura
LIMIT 10;

-- =====================================================
-- ✓ Setup completado
-- =====================================================

SELECT '✓ Setup completado correctamente' as mensaje,
       (SELECT COUNT(*) FROM facturas_detalle) as total_detalles_creados,
       (SELECT COUNT(DISTINCT factura_id) FROM facturas_detalle) as facturas_con_detalle;
