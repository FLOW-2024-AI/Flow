-- Multi-tenant migration: add tenant_id + RLS

ALTER TABLE facturas
  ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(100);

UPDATE facturas
SET tenant_id = COALESCE(tenant_id, client_id)
WHERE tenant_id IS NULL;

ALTER TABLE facturas
  ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE facturas
  DROP CONSTRAINT IF EXISTS facturas_unique_invoice;

ALTER TABLE facturas
  ADD CONSTRAINT facturas_unique_invoice UNIQUE (tenant_id, invoice_id);

DROP INDEX IF EXISTS idx_facturas_client_fecha;
CREATE INDEX IF NOT EXISTS idx_facturas_tenant_fecha
  ON facturas(tenant_id, fecha_emision DESC);

DROP INDEX IF EXISTS idx_facturas_aprobacion;
CREATE INDEX IF NOT EXISTS idx_facturas_aprobacion
  ON facturas(aprobado_por_cliente, tenant_id, fecha_emision DESC);

ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS facturas_tenant_isolation ON facturas;
CREATE POLICY facturas_tenant_isolation ON facturas
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

-- Optional: update views to include tenant_id
DROP VIEW IF EXISTS facturas_pendientes_aprobacion;
DROP VIEW IF EXISTS facturas_aprobadas;
DROP VIEW IF EXISTS facturas_rechazadas;
DROP VIEW IF EXISTS facturas_pendientes_validacion;
DROP VIEW IF EXISTS facturas_validas_sunat;

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
WHERE aprobado_por_cliente IS NULL
ORDER BY fecha_emision DESC;

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
