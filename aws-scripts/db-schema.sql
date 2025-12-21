-- ========================================
-- Database Schema para Facturas
-- PostgreSQL 15 - RDS Aurora Serverless v2
-- ========================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- Para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- Para funciones de hash

-- ========================================
-- TABLA: facturas
-- Almacena toda la información de facturas procesadas
-- ========================================

CREATE TABLE IF NOT EXISTS facturas (
    -- =============== IDs y Referencias ===============
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id VARCHAR(100) NOT NULL,
    tenant_id VARCHAR(100) NOT NULL,
    invoice_id VARCHAR(200) NOT NULL, -- RUC-NumeroFactura (ej: 20517482472-F006-0171739)

    -- =============== Archivo S3 ===============
    s3_bucket VARCHAR(255) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    s3_url VARCHAR(1000) NOT NULL,
    nombre_archivo VARCHAR(255),
    tamano_bytes INTEGER,

    -- =============== Campos de Cabecera ===============
    numero_factura VARCHAR(50), -- Ej: F006-0171739
    tipo_documento VARCHAR(50) DEFAULT 'FACTURA',
    serie VARCHAR(10),
    correlativo VARCHAR(20),
    fecha_emision DATE NOT NULL,
    hora_emision TIME,
    fecha_vencimiento DATE,
    moneda VARCHAR(10) DEFAULT 'PEN',

    -- =============== Datos del Emisor ===============
    ruc_emisor VARCHAR(11) NOT NULL,
    nombre_proveedor TEXT,
    emisor_nombre_comercial TEXT,
    emisor_direccion TEXT,
    emisor_departamento VARCHAR(100),
    emisor_provincia VARCHAR(100),
    emisor_distrito VARCHAR(100),
    emisor_telefono VARCHAR(50),
    emisor_email VARCHAR(255),

    -- =============== Datos del Receptor ===============
    receptor_ruc VARCHAR(11),
    receptor_razon_social TEXT,
    receptor_direccion TEXT,
    receptor_departamento VARCHAR(100),
    receptor_provincia VARCHAR(100),
    receptor_distrito VARCHAR(100),

    -- =============== Montos (según imagen) ===============
    monto_subtotal DECIMAL(15, 2),
    monto_igv DECIMAL(15, 2),
    monto_total DECIMAL(15, 2) NOT NULL,

    -- =============== Condiciones de Pago ===============
    condicion_pago VARCHAR(100), -- Ej: "CONTADO", "CREDITO"
    medio_pago VARCHAR(100), -- Ej: "TRANSFERENCIA", "EFECTIVO"
    plazo_credito INTEGER, -- Días de crédito
    vendedor VARCHAR(255),
    numero_pedido VARCHAR(100),
    oc_asociada VARCHAR(100), -- Número de orden de compra
    guia_remision VARCHAR(100),
    observaciones TEXT,

    -- =============== Validación SUNAT ===============
    sunat_validado BOOLEAN DEFAULT FALSE,
    sunat_estado VARCHAR(50), -- VALIDO, INVALIDO, ERROR_TOKEN, NO_VALIDADO, etc.
    sunat_es_valido BOOLEAN DEFAULT NULL, -- true/false según validación
    sunat_motivo TEXT,
    sunat_estado_comprobante_codigo VARCHAR(10),
    sunat_estado_comprobante_descripcion TEXT,
    sunat_estado_ruc_codigo VARCHAR(10),
    sunat_estado_ruc_descripcion TEXT,
    sunat_condicion_domicilio_codigo VARCHAR(10),
    sunat_condicion_domicilio_descripcion TEXT,
    sunat_observaciones JSONB,
    sunat_timestamp_validacion TIMESTAMP WITH TIME ZONE,

    -- =============== Datos Completos (JSON completo de Claude) ===============
    data_completa JSONB NOT NULL, -- Todo el JSON estructurado de Claude

    -- =============== Metadata de Procesamiento ===============
    procesamiento_status VARCHAR(50) DEFAULT 'processed',
    procesamiento_motor VARCHAR(100) DEFAULT 'bedrock-claude',
    procesamiento_model_id VARCHAR(200),
    procesamiento_model_name VARCHAR(200),
    procesamiento_confidence VARCHAR(50),
    procesamiento_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    procesamiento_warnings JSONB,
    procesamiento_errores JSONB,

    -- =============== Validaciones de Claude ===============
    validacion_igv_correcto BOOLEAN,
    validacion_total_correcto BOOLEAN,
    validacion_ruc_valido BOOLEAN,
    validacion_requiere_revision BOOLEAN DEFAULT FALSE,

    -- =============== Aprobación del Cliente ===============
    aprobado_por_cliente BOOLEAN DEFAULT NULL,  -- NULL = pendiente, TRUE = aprobado, FALSE = rechazado
    aprobado_por_usuario VARCHAR(255),  -- Email o ID del usuario que aprobó/rechazó
    aprobado_fecha TIMESTAMP WITH TIME ZONE,  -- Fecha de aprobación/rechazo
    aprobado_comentario TEXT,  -- Comentario opcional del cliente

    -- =============== Auditoría ===============
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    creado_por VARCHAR(100) DEFAULT 'bedrock-claude-processor',
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_por VARCHAR(100),
    version_documento INTEGER DEFAULT 1,

    -- =============== Constraints ===============
    CONSTRAINT facturas_unique_invoice UNIQUE (tenant_id, invoice_id),
    CONSTRAINT facturas_ruc_emisor_length CHECK (LENGTH(ruc_emisor) = 11),
    CONSTRAINT facturas_receptor_ruc_length CHECK (LENGTH(receptor_ruc) = 11 OR receptor_ruc IS NULL),
    CONSTRAINT facturas_monto_positivo CHECK (monto_total > 0)
);

-- ========================================
-- INDICES para optimizar queries
-- ========================================

-- Índice para búsqueda por tenant + fecha
CREATE INDEX idx_facturas_tenant_fecha ON facturas(tenant_id, fecha_emision DESC);

-- Índice para búsqueda por RUC emisor
CREATE INDEX idx_facturas_ruc_emisor ON facturas(ruc_emisor, fecha_emision DESC);

-- Índice para búsqueda por estado SUNAT
CREATE INDEX idx_facturas_sunat_estado ON facturas(sunat_estado, sunat_validado);

-- Índice para búsqueda por serie y correlativo
CREATE INDEX idx_facturas_serie_correlativo ON facturas(serie, correlativo);

-- Índice para búsqueda por número de factura completo
CREATE INDEX idx_facturas_numero_factura ON facturas(numero_factura);

-- Índice para búsqueda por receptor RUC
CREATE INDEX idx_facturas_receptor_ruc ON facturas(receptor_ruc);

-- Índice para búsqueda por estado de aprobación del cliente
CREATE INDEX idx_facturas_aprobacion ON facturas(aprobado_por_cliente, tenant_id, fecha_emision DESC);

-- Índice GIN para búsquedas en JSON (data_completa)
CREATE INDEX idx_facturas_data_jsonb ON facturas USING GIN (data_completa);

-- Índice para búsqueda por rango de fechas
CREATE INDEX idx_facturas_fecha_emision ON facturas(fecha_emision DESC);

-- Índice para búsqueda por monto
CREATE INDEX idx_facturas_monto ON facturas(monto_total DESC);

-- Índice para S3 key (útil para evitar duplicados)
CREATE INDEX idx_facturas_s3_key ON facturas(s3_key);

-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger para actualizar campo actualizado_en automáticamente
CREATE OR REPLACE FUNCTION update_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_facturas_actualizado
    BEFORE UPDATE ON facturas
    FOR EACH ROW
    EXECUTE FUNCTION update_actualizado_en();

-- ========================================
-- MULTI-TENANT (RLS)
-- ========================================

ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS facturas_tenant_isolation ON facturas;

CREATE POLICY facturas_tenant_isolation ON facturas
    USING (tenant_id = current_setting('app.tenant_id', true))
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

-- ========================================
-- VISTAS útiles
-- ========================================

-- Vista: Facturas pendientes de aprobación del cliente
CREATE OR REPLACE VIEW facturas_pendientes_aprobacion AS
SELECT
    id,
    tenant_id,
    client_id,
    invoice_id,
    numero_factura,
    ruc_emisor,
    nombre_proveedor,
    receptor_ruc,
    receptor_razon_social,
    fecha_emision,
    monto_total,
    moneda,
    sunat_validado,
    sunat_es_valido,
    aprobado_por_cliente,
    creado_en
FROM facturas
WHERE aprobado_por_cliente IS NULL  -- Pendientes
ORDER BY fecha_emision DESC;

-- Vista: Facturas aprobadas por el cliente
CREATE OR REPLACE VIEW facturas_aprobadas AS
SELECT
    id,
    tenant_id,
    client_id,
    invoice_id,
    numero_factura,
    ruc_emisor,
    nombre_proveedor,
    fecha_emision,
    monto_total,
    aprobado_por_usuario,
    aprobado_fecha,
    aprobado_comentario
FROM facturas
WHERE aprobado_por_cliente = TRUE
ORDER BY aprobado_fecha DESC;

-- Vista: Facturas rechazadas por el cliente
CREATE OR REPLACE VIEW facturas_rechazadas AS
SELECT
    id,
    tenant_id,
    client_id,
    invoice_id,
    numero_factura,
    ruc_emisor,
    nombre_proveedor,
    fecha_emision,
    monto_total,
    aprobado_por_usuario,
    aprobado_fecha,
    aprobado_comentario
FROM facturas
WHERE aprobado_por_cliente = FALSE
ORDER BY aprobado_fecha DESC;

-- Vista: Facturas pendientes de validación SUNAT
CREATE OR REPLACE VIEW facturas_pendientes_validacion AS
SELECT
    id,
    tenant_id,
    client_id,
    invoice_id,
    ruc_emisor,
    nombre_proveedor,
    fecha_emision,
    monto_total,
    numero_factura,
    sunat_estado,
    creado_en
FROM facturas
WHERE sunat_validado = FALSE OR sunat_estado IN ('NO_VALIDADO', 'ERROR_TOKEN', 'ERROR_API')
ORDER BY fecha_emision DESC;

-- Vista: Facturas válidas según SUNAT
CREATE OR REPLACE VIEW facturas_validas_sunat AS
SELECT
    id,
    tenant_id,
    client_id,
    invoice_id,
    ruc_emisor,
    nombre_proveedor,
    fecha_emision,
    monto_total,
    numero_factura,
    sunat_estado_comprobante_descripcion,
    sunat_timestamp_validacion
FROM facturas
WHERE sunat_validado = TRUE AND sunat_es_valido = TRUE
ORDER BY fecha_emision DESC;

-- Vista: Resumen por proveedor (RUC)
CREATE OR REPLACE VIEW resumen_por_proveedor AS
SELECT
    ruc_emisor,
    nombre_proveedor,
    COUNT(*) as total_facturas,
    SUM(monto_total) as monto_total_acumulado,
    MIN(fecha_emision) as primera_factura,
    MAX(fecha_emision) as ultima_factura,
    SUM(CASE WHEN sunat_es_valido = TRUE THEN 1 ELSE 0 END) as facturas_validas,
    SUM(CASE WHEN validacion_requiere_revision = TRUE THEN 1 ELSE 0 END) as facturas_requieren_revision
FROM facturas
GROUP BY ruc_emisor, nombre_proveedor
ORDER BY monto_total_acumulado DESC;

-- Vista: Facturas por mes
CREATE OR REPLACE VIEW facturas_por_mes AS
SELECT
    DATE_TRUNC('month', fecha_emision) as mes,
    COUNT(*) as total_facturas,
    SUM(monto_total) as monto_total,
    COUNT(DISTINCT ruc_emisor) as proveedores_unicos
FROM facturas
GROUP BY DATE_TRUNC('month', fecha_emision)
ORDER BY mes DESC;

-- ========================================
-- FUNCIONES útiles
-- ========================================

-- Función: Buscar facturas por texto en JSON
CREATE OR REPLACE FUNCTION buscar_en_facturas(search_text TEXT)
RETURNS TABLE (
    id UUID,
    invoice_id VARCHAR,
    ruc_emisor VARCHAR,
    nombre_proveedor TEXT,
    monto_total DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        f.id,
        f.invoice_id,
        f.ruc_emisor,
        f.nombre_proveedor,
        f.monto_total
    FROM facturas f
    WHERE
        f.data_completa::text ILIKE '%' || search_text || '%'
        OR f.nombre_proveedor ILIKE '%' || search_text || '%'
        OR f.ruc_emisor ILIKE '%' || search_text || '%'
    ORDER BY f.fecha_emision DESC;
END;
$$ LANGUAGE plpgsql;

-- Función: Validar que no exista duplicado por S3 key
CREATE OR REPLACE FUNCTION check_s3_duplicado(s3_key_param VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    existe BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM facturas WHERE s3_key = s3_key_param) INTO existe;
    RETURN existe;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- GRANTS (ajustar según usuarios)
-- ========================================

-- Crear rol para Lambda (read/write)
-- CREATE ROLE lambda_facturas_rw WITH LOGIN PASSWORD 'secure_password_here';
-- GRANT CONNECT ON DATABASE facturas_db TO lambda_facturas_rw;
-- GRANT SELECT, INSERT, UPDATE ON facturas TO lambda_facturas_rw;
-- GRANT SELECT ON facturas_pendientes_validacion, facturas_validas_sunat, resumen_por_proveedor, facturas_por_mes TO lambda_facturas_rw;

-- ========================================
-- Datos de ejemplo (SOLO PARA TESTING)
-- ========================================

-- COMENTAR O ELIMINAR EN PRODUCCIÓN
/*
INSERT INTO facturas (
    client_id,
    invoice_id,
    s3_bucket,
    s3_key,
    s3_url,
    nombre_archivo,
    ruc_emisor,
    nombre_proveedor,
    tipo_documento,
    serie_numero,
    serie,
    correlativo,
    fecha_emision,
    fecha_vencimiento,
    moneda,
    monto_subtotal,
    monto_igv,
    monto_total,
    condicion_pago,
    oc_asociada,
    correo_proveedor,
    data_completa,
    procesamiento_model_id,
    procesamiento_model_name
) VALUES (
    'test-client-001',
    '20601234567-F001-123456',
    'facturas-dev',
    'test-client-001/factura-example.pdf',
    's3://facturas-dev/test-client-001/factura-example.pdf',
    'factura-example.pdf',
    '20601234567',
    'Gloria S.A.',
    'FACTURA',
    'F001-123456',
    'F001',
    '123456',
    '2025-10-17',
    '2025-10-31',
    'PEN',
    1500.00,
    270.00,
    1770.00,
    'Crédito 30 días',
    'OC-000234',
    'facturas@gloria.com.pe',
    '{"test": "data"}',
    'anthropic.claude-3-5-sonnet-20240620-v1:0',
    'Claude 3.5 Sonnet'
);
*/

-- ========================================
-- COMENTARIOS en la tabla
-- ========================================

COMMENT ON TABLE facturas IS 'Tabla principal de facturas procesadas con OCR mediante AWS Bedrock Claude';
COMMENT ON COLUMN facturas.id IS 'UUID único de la factura en el sistema';
COMMENT ON COLUMN facturas.invoice_id IS 'ID formato RUC-NumeroFactura (ej: 20517482472-F006-0171739)';
COMMENT ON COLUMN facturas.data_completa IS 'JSON completo extraído por Claude con toda la información de la factura';
COMMENT ON COLUMN facturas.sunat_validado IS 'Indica si se ejecutó la validación contra API SUNAT';
COMMENT ON COLUMN facturas.sunat_es_valido IS 'Resultado de validación SUNAT: true=válido, false=inválido, null=no validado';
COMMENT ON COLUMN facturas.aprobado_por_cliente IS 'Estado de aprobación del cliente: NULL=pendiente, TRUE=aprobado, FALSE=rechazado';
COMMENT ON COLUMN facturas.aprobado_por_usuario IS 'Email o ID del usuario que aprobó/rechazó la factura';
COMMENT ON COLUMN facturas.aprobado_fecha IS 'Timestamp de cuando el cliente aprobó/rechazó la factura';
COMMENT ON COLUMN facturas.aprobado_comentario IS 'Comentario opcional del cliente al aprobar/rechazar';
