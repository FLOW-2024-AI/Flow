-- =====================================================
-- Inserción Manual de Detalles - Ejemplos Simples
-- =====================================================

-- PASO 1: Obtener el ID de tu factura
-- Ejecuta esto primero para ver tus facturas:
SELECT id, invoice_id, numero_factura, nombre_proveedor, monto_total
FROM facturas
WHERE aprobado_por_cliente = TRUE
ORDER BY created_at DESC
LIMIT 5;

-- PASO 2: Copia el ID (UUID) de la factura que quieres y úsalo abajo

-- =====================================================
-- Ejemplo 1: Factura con 2 productos
-- =====================================================

-- Reemplaza 'TU-UUID-AQUI' con el ID real de tu factura
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
) VALUES
(
    'TU-UUID-AQUI',  -- ← CAMBIAR ESTE UUID
    1,
    'Laptop HP ProBook 450 G8, Intel Core i5, 8GB RAM',
    2,
    'UND',
    3500.00,
    5932.20,  -- 2 * 2966.10 (sin IGV)
    1067.80,  -- 18% IGV
    7000.00   -- 2 * 3500
),
(
    'TU-UUID-AQUI',  -- ← CAMBIAR ESTE UUID (el mismo de arriba)
    2,
    'Mouse inalámbrico Logitech MX Master 3',
    5,
    'UND',
    250.00,
    1059.32,
    190.68,
    1250.00
);

-- =====================================================
-- Ejemplo 2: Factura de servicios
-- =====================================================

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
) VALUES
(
    'OTRO-UUID-AQUI',  -- ← CAMBIAR ESTE UUID
    1,
    'Servicio de consultoría empresarial - 20 horas',
    20,
    'HOR',
    20.00,
    338.98,
    61.02,
    400.00
);

-- =====================================================
-- PASO 3: Verificar que se insertaron correctamente
-- =====================================================

-- Ver detalles de una factura específica
SELECT
    fd.numero_item,
    fd.descripcion,
    fd.cantidad,
    fd.unidad_medida,
    fd.precio_unitario,
    fd.total_item
FROM facturas_detalle fd
WHERE fd.factura_id = 'TU-UUID-AQUI'  -- ← CAMBIAR ESTE UUID
ORDER BY fd.numero_item;

-- Ver resumen de todas las facturas con detalles
SELECT
    f.numero_factura,
    f.nombre_proveedor,
    COUNT(fd.id) as cantidad_items,
    f.monto_total as total_factura,
    COALESCE(SUM(fd.total_item), 0) as suma_items
FROM facturas f
LEFT JOIN facturas_detalle fd ON f.id = fd.factura_id
WHERE f.aprobado_por_cliente = TRUE
GROUP BY f.numero_factura, f.nombre_proveedor, f.monto_total
ORDER BY f.numero_factura;
