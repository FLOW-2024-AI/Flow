"""
Lambda Function: Setup Database Schema
Ejecuta el schema SQL en Aurora PostgreSQL una sola vez
"""

import json
import psycopg2
import os

def lambda_handler(event, context):
    """
    Ejecuta el schema SQL en Aurora PostgreSQL
    """

    # Credenciales hardcoded para POC
    DB_HOST = "aurora-facturas-poc.cluster-conucscyi4yb.us-east-1.rds.amazonaws.com"
    DB_PORT = 5432
    DB_NAME = "facturas_db"
    DB_USER = "postgres"
    DB_PASSWORD = "ChangeMe123456"

    # SQL Schema completo
    SQL_SCHEMA = """
-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TABLA: facturas
CREATE TABLE IF NOT EXISTS facturas (
    -- IDs y Referencias
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id VARCHAR(100) NOT NULL,
    tenant_id VARCHAR(100) NOT NULL,
    invoice_id VARCHAR(200) NOT NULL,

    -- Archivo S3
    s3_bucket VARCHAR(255) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    s3_url VARCHAR(1000) NOT NULL,
    nombre_archivo VARCHAR(255),
    tamano_bytes INTEGER,

    -- Campos de Cabecera
    numero_factura VARCHAR(50),
    tipo_documento VARCHAR(50) DEFAULT 'FACTURA',
    serie VARCHAR(10),
    correlativo VARCHAR(20),
    fecha_emision DATE NOT NULL,
    hora_emision TIME,
    fecha_vencimiento DATE,
    moneda VARCHAR(10) DEFAULT 'PEN',

    -- Datos del Emisor
    ruc_emisor VARCHAR(11) NOT NULL,
    nombre_proveedor TEXT,
    emisor_nombre_comercial TEXT,
    emisor_direccion TEXT,
    emisor_departamento VARCHAR(100),
    emisor_provincia VARCHAR(100),
    emisor_distrito VARCHAR(100),
    emisor_telefono VARCHAR(50),
    emisor_email VARCHAR(255),

    -- Datos del Receptor
    receptor_ruc VARCHAR(11),
    receptor_razon_social TEXT,
    receptor_direccion TEXT,
    receptor_departamento VARCHAR(100),
    receptor_provincia VARCHAR(100),
    receptor_distrito VARCHAR(100),

    -- Montos
    monto_subtotal DECIMAL(15, 2),
    monto_igv DECIMAL(15, 2),
    monto_total DECIMAL(15, 2) NOT NULL,

    -- Condiciones de Pago
    condicion_pago VARCHAR(100),
    medio_pago VARCHAR(100),
    plazo_credito INTEGER,
    vendedor VARCHAR(255),
    numero_pedido VARCHAR(100),
    oc_asociada VARCHAR(100),
    guia_remision VARCHAR(100),
    observaciones TEXT,

    -- Validación SUNAT
    sunat_validado BOOLEAN DEFAULT FALSE,
    sunat_estado VARCHAR(50),
    sunat_es_valido BOOLEAN DEFAULT NULL,
    sunat_motivo TEXT,
    sunat_estado_comprobante_codigo VARCHAR(10),
    sunat_estado_comprobante_descripcion TEXT,
    sunat_estado_ruc_codigo VARCHAR(10),
    sunat_estado_ruc_descripcion TEXT,
    sunat_condicion_domicilio_codigo VARCHAR(10),
    sunat_condicion_domicilio_descripcion TEXT,
    sunat_observaciones JSONB,
    sunat_timestamp_validacion TIMESTAMP WITH TIME ZONE,

    -- Datos Completos (JSON completo de Claude)
    data_completa JSONB NOT NULL,

    -- Metadata de Procesamiento
    procesamiento_status VARCHAR(50) DEFAULT 'processed',
    procesamiento_motor VARCHAR(100) DEFAULT 'bedrock-claude',
    procesamiento_model_id VARCHAR(200),
    procesamiento_model_name VARCHAR(200),
    procesamiento_confidence VARCHAR(50),
    procesamiento_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    procesamiento_warnings JSONB,
    procesamiento_errores JSONB,

    -- Validaciones de Claude
    validacion_igv_correcto BOOLEAN,
    validacion_total_correcto BOOLEAN,
    validacion_ruc_valido BOOLEAN,
    validacion_requiere_revision BOOLEAN DEFAULT FALSE,

    -- Aprobación del Cliente
    aprobado_por_cliente BOOLEAN DEFAULT NULL,
    aprobado_por_usuario VARCHAR(255),
    aprobado_fecha TIMESTAMP WITH TIME ZONE,
    aprobado_comentario TEXT,

    -- Auditoría
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    creado_por VARCHAR(100) DEFAULT 'bedrock-claude-processor',
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_por VARCHAR(100),
    version_documento INTEGER DEFAULT 1,

    -- Constraints
    CONSTRAINT facturas_unique_invoice UNIQUE (tenant_id, invoice_id),
    CONSTRAINT facturas_ruc_emisor_length CHECK (LENGTH(ruc_emisor) = 11),
    CONSTRAINT facturas_receptor_ruc_length CHECK (LENGTH(receptor_ruc) = 11 OR receptor_ruc IS NULL),
    CONSTRAINT facturas_monto_positivo CHECK (monto_total > 0)
);

-- INDICES
CREATE INDEX IF NOT EXISTS idx_facturas_tenant_fecha ON facturas(tenant_id, fecha_emision DESC);
CREATE INDEX IF NOT EXISTS idx_facturas_ruc_emisor ON facturas(ruc_emisor, fecha_emision DESC);
CREATE INDEX IF NOT EXISTS idx_facturas_sunat_estado ON facturas(sunat_estado, sunat_validado);
CREATE INDEX IF NOT EXISTS idx_facturas_serie_correlativo ON facturas(serie, correlativo);
CREATE INDEX IF NOT EXISTS idx_facturas_numero_factura ON facturas(numero_factura);
CREATE INDEX IF NOT EXISTS idx_facturas_receptor_ruc ON facturas(receptor_ruc);
CREATE INDEX IF NOT EXISTS idx_facturas_aprobacion ON facturas(aprobado_por_cliente, tenant_id, fecha_emision DESC);
CREATE INDEX IF NOT EXISTS idx_facturas_data_jsonb ON facturas USING GIN (data_completa);
CREATE INDEX IF NOT EXISTS idx_facturas_fecha_emision ON facturas(fecha_emision DESC);
CREATE INDEX IF NOT EXISTS idx_facturas_monto ON facturas(monto_total DESC);
CREATE INDEX IF NOT EXISTS idx_facturas_s3_key ON facturas(s3_key);

-- TRIGGER para actualizar campo actualizado_en
CREATE OR REPLACE FUNCTION update_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_facturas_actualizado ON facturas;
CREATE TRIGGER trigger_facturas_actualizado
    BEFORE UPDATE ON facturas
    FOR EACH ROW
    EXECUTE FUNCTION update_actualizado_en();

-- MULTI-TENANT (RLS)
ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS facturas_tenant_isolation ON facturas;
CREATE POLICY facturas_tenant_isolation ON facturas
    USING (tenant_id = current_setting('app.tenant_id', true))
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

-- VISTAS
CREATE OR REPLACE VIEW facturas_pendientes_aprobacion AS
SELECT id, tenant_id, client_id, invoice_id, numero_factura, ruc_emisor, nombre_proveedor,
       receptor_ruc, receptor_razon_social, fecha_emision, monto_total, moneda,
       sunat_validado, sunat_es_valido, aprobado_por_cliente, creado_en
FROM facturas
WHERE aprobado_por_cliente IS NULL
ORDER BY fecha_emision DESC;

CREATE OR REPLACE VIEW facturas_aprobadas AS
SELECT id, tenant_id, client_id, invoice_id, numero_factura, ruc_emisor, nombre_proveedor,
       fecha_emision, monto_total, aprobado_por_usuario, aprobado_fecha, aprobado_comentario
FROM facturas
WHERE aprobado_por_cliente = TRUE
ORDER BY aprobado_fecha DESC;

CREATE OR REPLACE VIEW facturas_rechazadas AS
SELECT id, tenant_id, client_id, invoice_id, numero_factura, ruc_emisor, nombre_proveedor,
       fecha_emision, monto_total, aprobado_por_usuario, aprobado_fecha, aprobado_comentario
FROM facturas
WHERE aprobado_por_cliente = FALSE
ORDER BY aprobado_fecha DESC;
"""

    try:
        print(f"🔌 Conectando a {DB_HOST}...")

        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            connect_timeout=30
        )

        print("✅ Conectado!")

        cursor = conn.cursor()

        print("🔧 Ejecutando schema SQL...")
        cursor.execute(SQL_SCHEMA)
        conn.commit()

        print("✅ Schema creado exitosamente!")

        # Verificar tablas
        cursor.execute("""
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        """)
        tables = cursor.fetchall()

        cursor.close()
        conn.close()

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Database schema created successfully!',
                'tables': [t[0] for t in tables],
                'endpoint': DB_HOST
            })
        }

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e),
                'type': type(e).__name__
            })
        }
