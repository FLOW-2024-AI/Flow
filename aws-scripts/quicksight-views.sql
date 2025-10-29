-- ========================================
-- Vistas SQL para Dashboard QuickSight MVP
-- Database: facturas_db (Aurora PostgreSQL)
-- ========================================

-- ========================================
-- 1. VISTA: KPIs Principales
-- Métricas clave para tarjetas KPI
-- ========================================

CREATE OR REPLACE VIEW vw_kpis_principales AS
SELECT
    -- Total Facturado Este Mes
    (SELECT COALESCE(SUM(monto_total), 0)
     FROM facturas
     WHERE aprobado_por_cliente = TRUE
       AND EXTRACT(MONTH FROM fecha_emision) = EXTRACT(MONTH FROM CURRENT_DATE)
       AND EXTRACT(YEAR FROM fecha_emision) = EXTRACT(YEAR FROM CURRENT_DATE)
    ) as total_facturado_mes_actual,

    -- Total Facturado Mes Anterior
    (SELECT COALESCE(SUM(monto_total), 0)
     FROM facturas
     WHERE aprobado_por_cliente = TRUE
       AND EXTRACT(MONTH FROM fecha_emision) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')
       AND EXTRACT(YEAR FROM fecha_emision) = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month')
    ) as total_facturado_mes_anterior,

    -- Número Total de Facturas
    (SELECT COUNT(*)
     FROM facturas
     WHERE aprobado_por_cliente = TRUE
    ) as total_facturas,

    -- Número de Facturas Este Mes
    (SELECT COUNT(*)
     FROM facturas
     WHERE aprobado_por_cliente = TRUE
       AND EXTRACT(MONTH FROM fecha_emision) = EXTRACT(MONTH FROM CURRENT_DATE)
       AND EXTRACT(YEAR FROM fecha_emision) = EXTRACT(YEAR FROM CURRENT_DATE)
    ) as facturas_mes_actual,

    -- Ticket Promedio
    (SELECT COALESCE(AVG(monto_total), 0)
     FROM facturas
     WHERE aprobado_por_cliente = TRUE
    ) as ticket_promedio,

    -- Ticket Promedio Este Mes
    (SELECT COALESCE(AVG(monto_total), 0)
     FROM facturas
     WHERE aprobado_por_cliente = TRUE
       AND EXTRACT(MONTH FROM fecha_emision) = EXTRACT(MONTH FROM CURRENT_DATE)
       AND EXTRACT(YEAR FROM fecha_emision) = EXTRACT(YEAR FROM CURRENT_DATE)
    ) as ticket_promedio_mes_actual,

    -- Porcentaje Validado SUNAT
    (SELECT
        CASE
            WHEN COUNT(*) > 0 THEN
                ROUND((COUNT(CASE WHEN sunat_validado = TRUE THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
            ELSE 0
        END
     FROM facturas
     WHERE aprobado_por_cliente = TRUE
    ) as porcentaje_validado_sunat,

    -- Timestamp de actualización
    CURRENT_TIMESTAMP as actualizado_en;


-- ========================================
-- 2. VISTA: Evolución Mensual
-- Facturación y cantidad por mes
-- ========================================

CREATE OR REPLACE VIEW vw_evolucion_mensual AS
SELECT
    TO_CHAR(fecha_emision, 'YYYY-MM') as mes,
    EXTRACT(YEAR FROM fecha_emision) as anio,
    EXTRACT(MONTH FROM fecha_emision) as mes_numero,
    COUNT(*) as cantidad_facturas,
    SUM(monto_total) as facturacion_total,
    AVG(monto_total) as ticket_promedio,
    SUM(monto_subtotal) as subtotal,
    SUM(monto_igv) as igv_total,
    MIN(monto_total) as monto_minimo,
    MAX(monto_total) as monto_maximo
FROM facturas
WHERE aprobado_por_cliente = TRUE
  AND fecha_emision IS NOT NULL
GROUP BY
    TO_CHAR(fecha_emision, 'YYYY-MM'),
    EXTRACT(YEAR FROM fecha_emision),
    EXTRACT(MONTH FROM fecha_emision)
ORDER BY mes DESC;


-- ========================================
-- 3. VISTA: Top Proveedores
-- Ranking de proveedores por monto
-- ========================================

CREATE OR REPLACE VIEW vw_top_proveedores AS
SELECT
    COALESCE(nombre_proveedor, 'Sin nombre') as proveedor,
    ruc_emisor,
    COUNT(*) as num_facturas,
    SUM(monto_total) as monto_total,
    AVG(monto_total) as ticket_promedio,
    SUM(monto_subtotal) as subtotal,
    SUM(monto_igv) as igv_total,
    MIN(fecha_emision) as primera_factura,
    MAX(fecha_emision) as ultima_factura,
    COUNT(CASE WHEN sunat_validado = TRUE AND sunat_es_valido = TRUE THEN 1 END) as facturas_validas,
    ROUND((COUNT(CASE WHEN sunat_validado = TRUE AND sunat_es_valido = TRUE THEN 1 END)::NUMERIC /
           COUNT(*)::NUMERIC) * 100, 2) as porcentaje_validas
FROM facturas
WHERE aprobado_por_cliente = TRUE
  AND nombre_proveedor IS NOT NULL
GROUP BY nombre_proveedor, ruc_emisor
ORDER BY monto_total DESC;


-- ========================================
-- 4. VISTA: Distribución por Condición de Pago
-- CONTADO vs CRÉDITO
-- ========================================

CREATE OR REPLACE VIEW vw_condicion_pago AS
SELECT
    COALESCE(condicion_pago, 'No especificado') as condicion_pago,
    COUNT(*) as cantidad_facturas,
    SUM(monto_total) as monto_total,
    AVG(monto_total) as ticket_promedio,
    ROUND((COUNT(*)::NUMERIC / (SELECT COUNT(*) FROM facturas WHERE aprobado_por_cliente = TRUE)::NUMERIC) * 100, 2) as porcentaje,
    SUM(monto_subtotal) as subtotal,
    SUM(monto_igv) as igv_total
FROM facturas
WHERE aprobado_por_cliente = TRUE
GROUP BY condicion_pago
ORDER BY monto_total DESC;


-- ========================================
-- 5. VISTA: Top Productos/Servicios
-- Análisis de items más facturados
-- ========================================

CREATE OR REPLACE VIEW vw_top_productos AS
SELECT
    d.descripcion,
    COUNT(DISTINCT d.factura_id) as num_facturas,
    SUM(d.cantidad) as cantidad_total_vendida,
    SUM(d.total_item) as monto_total_facturado,
    AVG(d.precio_unitario) as precio_unitario_promedio,
    AVG(d.total_item) as valor_promedio_por_factura,
    SUM(d.subtotal) as subtotal,
    SUM(d.igv_monto) as igv_total,
    d.unidad_medida
FROM facturas_detalle d
INNER JOIN facturas f ON d.factura_id = f.id
WHERE f.aprobado_por_cliente = TRUE
  AND d.descripcion IS NOT NULL
  AND TRIM(d.descripcion) != ''
GROUP BY d.descripcion, d.unidad_medida
ORDER BY monto_total_facturado DESC;


-- ========================================
-- 6. VISTA: Estado Validación SUNAT
-- Clasificación de facturas por estado
-- ========================================

CREATE OR REPLACE VIEW vw_estado_validacion_sunat AS
SELECT
    estado_validacion,
    COUNT(*) as cantidad_facturas,
    SUM(monto_total) as monto_total,
    AVG(monto_total) as ticket_promedio,
    ROUND((COUNT(*)::NUMERIC / (SELECT COUNT(*) FROM facturas WHERE aprobado_por_cliente = TRUE)::NUMERIC) * 100, 2) as porcentaje,
    MIN(fecha_emision) as fecha_mas_antigua,
    MAX(fecha_emision) as fecha_mas_reciente
FROM (
    SELECT
        CASE
            WHEN sunat_validado = TRUE AND sunat_es_valido = TRUE THEN 'Válida'
            WHEN sunat_validado = TRUE AND sunat_es_valido = FALSE THEN 'Inválida'
            WHEN sunat_validado = FALSE THEN 'Pendiente Validación'
            ELSE 'No Validada'
        END as estado_validacion,
        monto_total,
        fecha_emision
    FROM facturas
    WHERE aprobado_por_cliente = TRUE
) sub
GROUP BY estado_validacion
ORDER BY
    CASE estado_validacion
        WHEN 'Válida' THEN 1
        WHEN 'Inválida' THEN 2
        WHEN 'Pendiente Validación' THEN 3
        ELSE 4
    END;


-- ========================================
-- 7. VISTA COMPLETA: Dashboard Principal
-- Vista maestra con toda la información para filtros
-- ========================================

CREATE OR REPLACE VIEW vw_dashboard_facturas AS
SELECT
    f.id,
    f.numero_factura,
    f.fecha_emision,
    f.fecha_vencimiento,
    TO_CHAR(f.fecha_emision, 'YYYY-MM') as mes,
    EXTRACT(YEAR FROM f.fecha_emision) as anio,
    EXTRACT(MONTH FROM f.fecha_emision) as mes_numero,
    TO_CHAR(f.fecha_emision, 'TMMonth') as mes_nombre,

    -- Emisor
    f.ruc_emisor,
    COALESCE(f.nombre_proveedor, 'Sin nombre') as proveedor,
    f.emisor_departamento,
    f.emisor_provincia,

    -- Receptor
    f.receptor_ruc,
    f.receptor_razon_social,

    -- Montos
    f.monto_subtotal,
    f.monto_igv,
    f.monto_total,
    f.moneda,

    -- Condiciones
    COALESCE(f.condicion_pago, 'No especificado') as condicion_pago,
    f.medio_pago,
    f.plazo_credito,

    -- Validación SUNAT
    CASE
        WHEN f.sunat_validado = TRUE AND f.sunat_es_valido = TRUE THEN 'Válida'
        WHEN f.sunat_validado = TRUE AND f.sunat_es_valido = FALSE THEN 'Inválida'
        WHEN f.sunat_validado = FALSE THEN 'Pendiente Validación'
        ELSE 'No Validada'
    END as estado_validacion_sunat,
    f.sunat_es_valido,
    f.sunat_estado,
    f.sunat_timestamp_validacion,

    -- Metadata
    f.client_id,
    f.procesamiento_timestamp,

    -- Días transcurridos
    CASE
        WHEN f.fecha_vencimiento IS NOT NULL THEN
            f.fecha_vencimiento - CURRENT_DATE
        ELSE NULL
    END as dias_para_vencimiento,

    -- Estado de vencimiento
    CASE
        WHEN f.condicion_pago = 'CREDITO' AND f.fecha_vencimiento IS NOT NULL THEN
            CASE
                WHEN f.fecha_vencimiento < CURRENT_DATE THEN 'Vencida'
                WHEN f.fecha_vencimiento BETWEEN CURRENT_DATE AND CURRENT_DATE + 7 THEN 'Por Vencer (7 días)'
                WHEN f.fecha_vencimiento BETWEEN CURRENT_DATE AND CURRENT_DATE + 15 THEN 'Por Vencer (15 días)'
                WHEN f.fecha_vencimiento BETWEEN CURRENT_DATE AND CURRENT_DATE + 30 THEN 'Por Vencer (30 días)'
                ELSE 'Vigente'
            END
        ELSE 'No Aplica'
    END as estado_vencimiento

FROM facturas f
WHERE f.aprobado_por_cliente = TRUE
ORDER BY f.fecha_emision DESC;


-- ========================================
-- 8. VISTA: Facturas con Detalle
-- Join completo para análisis detallado
-- ========================================

CREATE OR REPLACE VIEW vw_facturas_con_detalle AS
SELECT
    f.id as factura_id,
    f.numero_factura,
    f.fecha_emision,
    f.nombre_proveedor as proveedor,
    f.ruc_emisor,
    f.monto_total as monto_total_factura,
    f.condicion_pago,

    -- Detalle
    d.id as detalle_id,
    d.numero_item,
    d.descripcion as producto_servicio,
    d.cantidad,
    d.unidad_medida,
    d.precio_unitario,
    d.subtotal,
    d.igv_monto,
    d.total_item,

    -- Validación SUNAT
    CASE
        WHEN f.sunat_validado = TRUE AND f.sunat_es_valido = TRUE THEN 'Válida'
        WHEN f.sunat_validado = TRUE AND f.sunat_es_valido = FALSE THEN 'Inválida'
        WHEN f.sunat_validado = FALSE THEN 'Pendiente Validación'
        ELSE 'No Validada'
    END as estado_validacion

FROM facturas f
LEFT JOIN facturas_detalle d ON f.id = d.factura_id
WHERE f.aprobado_por_cliente = TRUE
ORDER BY f.fecha_emision DESC, d.numero_item ASC;


-- ========================================
-- 9. VISTA BONUS: Facturas Próximas a Vencer
-- Para alertas y seguimiento
-- ========================================

CREATE OR REPLACE VIEW vw_facturas_por_vencer AS
SELECT
    f.numero_factura,
    f.nombre_proveedor as proveedor,
    f.ruc_emisor,
    f.monto_total,
    f.fecha_emision,
    f.fecha_vencimiento,
    (f.fecha_vencimiento - CURRENT_DATE) as dias_restantes,
    CASE
        WHEN (f.fecha_vencimiento - CURRENT_DATE) < 0 THEN 'Vencida'
        WHEN (f.fecha_vencimiento - CURRENT_DATE) <= 7 THEN 'Crítico (<7 días)'
        WHEN (f.fecha_vencimiento - CURRENT_DATE) <= 15 THEN 'Urgente (7-15 días)'
        WHEN (f.fecha_vencimiento - CURRENT_DATE) <= 30 THEN 'Próximo (15-30 días)'
        ELSE 'Vigente'
    END as estado_urgencia,
    f.observaciones,
    f.sunat_es_valido
FROM facturas f
WHERE f.aprobado_por_cliente = TRUE
  AND f.condicion_pago = 'CREDITO'
  AND f.fecha_vencimiento IS NOT NULL
ORDER BY f.fecha_vencimiento ASC;


-- ========================================
-- 10. VISTA: Análisis por Proveedor y Mes
-- Para análisis temporal por proveedor
-- ========================================

CREATE OR REPLACE VIEW vw_proveedor_mensual AS
SELECT
    COALESCE(f.nombre_proveedor, 'Sin nombre') as proveedor,
    f.ruc_emisor,
    TO_CHAR(f.fecha_emision, 'YYYY-MM') as mes,
    EXTRACT(YEAR FROM f.fecha_emision) as anio,
    EXTRACT(MONTH FROM f.fecha_emision) as mes_numero,
    COUNT(*) as num_facturas,
    SUM(f.monto_total) as monto_total,
    AVG(f.monto_total) as ticket_promedio,
    SUM(f.monto_subtotal) as subtotal,
    SUM(f.monto_igv) as igv_total
FROM facturas f
WHERE f.aprobado_por_cliente = TRUE
  AND f.nombre_proveedor IS NOT NULL
  AND f.fecha_emision IS NOT NULL
GROUP BY
    f.nombre_proveedor,
    f.ruc_emisor,
    TO_CHAR(f.fecha_emision, 'YYYY-MM'),
    EXTRACT(YEAR FROM f.fecha_emision),
    EXTRACT(MONTH FROM f.fecha_emision)
ORDER BY mes DESC, monto_total DESC;


-- ========================================
-- COMENTARIOS FINALES
-- ========================================

-- Para usar estas vistas en QuickSight:
-- 1. Conéctate a tu base de datos Aurora PostgreSQL
-- 2. En lugar de escribir queries, selecciona las vistas creadas
-- 3. Las vistas ya traen los datos pre-calculados y optimizados

-- Vistas principales para el Dashboard MVP:
-- - vw_kpis_principales (KPI Cards)
-- - vw_evolucion_mensual (Line Chart)
-- - vw_top_proveedores (Horizontal Bar Chart)
-- - vw_condicion_pago (Donut Chart)
-- - vw_top_productos (Vertical Bar Chart)
-- - vw_estado_validacion_sunat (Pie Chart)

-- Vistas complementarias:
-- - vw_dashboard_facturas (Filtros y exploración detallada)
-- - vw_facturas_con_detalle (Análisis item por item)
-- - vw_facturas_por_vencer (Alertas y seguimiento)
-- - vw_proveedor_mensual (Análisis temporal por proveedor)

COMMENT ON VIEW vw_kpis_principales IS 'KPIs principales para tarjetas del dashboard';
COMMENT ON VIEW vw_evolucion_mensual IS 'Evolución temporal de facturación mensual';
COMMENT ON VIEW vw_top_proveedores IS 'Ranking de proveedores por monto facturado';
COMMENT ON VIEW vw_condicion_pago IS 'Distribución de facturas por condición de pago';
COMMENT ON VIEW vw_top_productos IS 'Productos y servicios más facturados';
COMMENT ON VIEW vw_estado_validacion_sunat IS 'Estado de validación SUNAT de facturas';
COMMENT ON VIEW vw_dashboard_facturas IS 'Vista maestra para dashboard con filtros';
COMMENT ON VIEW vw_facturas_con_detalle IS 'Facturas con detalle completo de items';
COMMENT ON VIEW vw_facturas_por_vencer IS 'Facturas próximas a vencer (CRÉDITO)';
COMMENT ON VIEW vw_proveedor_mensual IS 'Análisis mensual por proveedor';
