-- =====================================================
-- Script de Inserción de Datos de Ejemplo
-- Detalles de Facturas (Subproductos)
-- =====================================================

-- IMPORTANTE: Este script asume que ya tienes facturas en la tabla 'facturas'
-- Necesitas reemplazar los IDs de factura con los IDs reales de tu base de datos

-- =====================================================
-- Ejemplo 1: Factura con múltiples productos
-- =====================================================

-- Para la primera factura (asumiendo ID=1)
-- Puedes obtener el ID real con: SELECT id FROM facturas WHERE invoice_id = 'TU_INVOICE_ID' LIMIT 1;

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
) VALUES
-- Item 1
(
    1, -- factura_id (CAMBIAR por ID real)
    1,
    'PROD-001',
    'Laptop HP ProBook 450 G8, Intel Core i5, 8GB RAM, 256GB SSD',
    2,
    'UND',
    3500.00,
    2966.10, -- sin IGV
    0.00,
    0.00,
    5932.20, -- 2 * 2966.10
    1067.80, -- 18% IGV
    7000.00, -- 2 * 3500
    'GRA',
    18.00
),
-- Item 2
(
    1, -- factura_id (CAMBIAR por ID real)
    2,
    'SERV-001',
    'Servicio de instalación y configuración de equipos',
    1,
    'UND',
    500.00,
    423.73,
    0.00,
    0.00,
    423.73,
    76.27,
    500.00,
    'GRA',
    18.00
),
-- Item 3
(
    1, -- factura_id (CAMBIAR por ID real)
    3,
    'ACC-045',
    'Mouse inalámbrico Logitech MX Master 3',
    5,
    'UND',
    250.00,
    211.86,
    50.00, -- descuento total
    4.00, -- 4% descuento
    1009.30,
    181.68,
    1190.98,
    'GRA',
    18.00
);

-- =====================================================
-- Ejemplo 2: Factura de servicios
-- =====================================================

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
) VALUES
(
    2, -- factura_id (CAMBIAR por ID real)
    1,
    'SERV-PREV-001',
    'Servicio de prevención en seguridad y salud ocupacional - Mes de Octubre',
    1,
    'SER',
    174.00,
    147.46,
    0.00,
    0.00,
    147.46,
    26.54,
    174.00,
    'GRA',
    18.00
),
(
    2, -- factura_id (CAMBIAR por ID real)
    2,
    'EXAM-001',
    'Exámenes médicos ocupacionales',
    1,
    'SER',
    31.32,
    26.54,
    0.00,
    0.00,
    26.54,
    4.78,
    31.32,
    'GRA',
    18.00
);

-- =====================================================
-- Ejemplo 3: Factura con productos y descuentos
-- =====================================================

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
) VALUES
(
    3, -- factura_id (CAMBIAR por ID real)
    1,
    'CONS-001',
    'Consultoría en gestión empresarial - 20 horas',
    20,
    'HOR',
    20.00,
    16.95,
    0.00,
    0.00,
    339.00,
    61.02,
    400.00,
    'GRA',
    18.00
),
(
    3, -- factura_id (CAMBIAR por ID real)
    2,
    'DOC-001',
    'Elaboración de documentos y procesos',
    1,
    'UND',
    72.00,
    61.02,
    0.00,
    0.00,
    61.02,
    10.98,
    72.00,
    'GRA',
    18.00
);

-- =====================================================
-- Ejemplo 4: Factura de productos alimenticios
-- =====================================================

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
) VALUES
(
    4, -- factura_id (CAMBIAR por ID real)
    1,
    'FRUTA-001',
    'Frutos y Especias - Manzanas Red Delicious',
    10,
    'KG',
    5.93,
    5.03,
    0.00,
    0.00,
    50.25,
    9.05,
    59.30,
    'GRA',
    18.00
),
(
    4, -- factura_id (CAMBIAR por ID real)
    2,
    'FRUTA-002',
    'Naranjas de Valencia',
    5,
    'KG',
    2.12,
    1.80,
    0.00,
    0.00,
    8.98,
    1.62,
    10.60,
    'GRA',
    18.00
);

-- =====================================================
-- Script alternativo usando un cursor para facturas existentes
-- =====================================================

-- Este script genera automáticamente detalles para las primeras 5 facturas aprobadas
-- NOTA: Ejecutar solo si quieres generar datos de prueba automáticamente

DO $$
DECLARE
    factura_record RECORD;
    item_count INTEGER;
BEGIN
    -- Iterar sobre las primeras 5 facturas aprobadas
    FOR factura_record IN
        SELECT id, monto_subtotal, monto_igv, monto_total
        FROM facturas
        WHERE aprobado_por_cliente = TRUE
        ORDER BY id
        LIMIT 5
    LOOP
        -- Generar entre 1 y 3 items aleatorios por factura
        item_count := floor(random() * 3 + 1)::INTEGER;

        FOR i IN 1..item_count LOOP
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
                factura_record.id,
                i,
                'PROD-' || LPAD(i::TEXT, 3, '0'),
                'Producto/Servicio de ejemplo ' || i || ' - Descripción detallada',
                floor(random() * 10 + 1)::DECIMAL, -- Cantidad entre 1 y 10
                'UND',
                (factura_record.monto_total / item_count / floor(random() * 10 + 1))::DECIMAL(12,2),
                (factura_record.monto_subtotal / item_count / floor(random() * 10 + 1))::DECIMAL(12,2),
                (factura_record.monto_subtotal / item_count)::DECIMAL(12,2),
                (factura_record.monto_igv / item_count)::DECIMAL(12,2),
                (factura_record.monto_total / item_count)::DECIMAL(12,2),
                'GRA',
                18.00
            );
        END LOOP;

        RAISE NOTICE 'Insertados % items para factura ID %', item_count, factura_record.id;
    END LOOP;
END $$;

-- =====================================================
-- Verificación de datos insertados
-- =====================================================

-- Consultar facturas con sus detalles
SELECT
    f.numero_factura,
    f.nombre_proveedor,
    f.monto_total as total_factura,
    COUNT(fd.id) as cantidad_items,
    SUM(fd.total_item) as suma_items
FROM facturas f
LEFT JOIN facturas_detalle fd ON f.id = fd.factura_id
WHERE f.aprobado_por_cliente = TRUE
GROUP BY f.id, f.numero_factura, f.nombre_proveedor, f.monto_total
ORDER BY f.numero_factura;

-- Consultar detalle completo de una factura específica
SELECT
    f.numero_factura,
    f.nombre_proveedor,
    fd.numero_item,
    fd.codigo_producto,
    fd.descripcion,
    fd.cantidad,
    fd.unidad_medida,
    fd.precio_unitario,
    fd.total_item
FROM facturas f
INNER JOIN facturas_detalle fd ON f.id = fd.factura_id
WHERE f.id = 1 -- Cambiar por el ID de la factura que quieras ver
ORDER BY fd.numero_item;
