-- Crear tabla 'public.facturas' para almacenar datos de facturas desde n8n
CREATE TABLE IF NOT EXISTS public.facturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Información básica de la factura
  proveedor TEXT NOT NULL,
  empresa TEXT,
  monto DECIMAL(15,2) NOT NULL DEFAULT 0,
  estado TEXT DEFAULT 'Pendiente',
  fecha DATE DEFAULT CURRENT_DATE,
  
  -- Detalles adicionales
  descripcion TEXT,
  concepto TEXT,
  numero_factura TEXT,
  numero TEXT,
  
  -- Metadatos del procesamiento
  origen TEXT DEFAULT 'n8n',
  procesada_por TEXT DEFAULT 'n8n-workflow',
  
  -- Campos adicionales que n8n podría necesitar
  raw_data JSONB,
  notas TEXT
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_facturas_fecha ON facturas(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_facturas_proveedor ON facturas(proveedor);
CREATE INDEX IF NOT EXISTS idx_facturas_estado ON facturas(estado);
CREATE INDEX IF NOT EXISTS idx_facturas_created_at ON facturas(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura pública (ajusta según tus necesidades de seguridad)
CREATE POLICY "Allow public read access" ON facturas
  FOR SELECT USING (true);

-- Crear política para permitir inserción pública (para n8n)
CREATE POLICY "Allow public insert access" ON facturas
  FOR INSERT WITH CHECK (true);

-- Crear política para permitir actualización pública
CREATE POLICY "Allow public update access" ON facturas
  FOR UPDATE USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_facturas_updated_at 
    BEFORE UPDATE ON facturas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos datos de ejemplo para probar
INSERT INTO facturas (proveedor, monto, estado, descripcion, numero_factura) VALUES
  ('Proveedor ABC S.A.', 15750.00, 'Procesada', 'Servicios de consultoría', 'FAC-001'),
  ('Servicios XYZ Ltda.', 8420.50, 'Pendiente', 'Mantenimiento equipos', 'FAC-002'),
  ('Materiales DEF Corp.', 32100.75, 'Procesada', 'Compra de materiales', 'FAC-003'),
  ('Tecnología GHI S.A.S.', 12500.00, 'Revision', 'Licencias software', 'FAC-004'),
  ('Logística JKL Ltda.', 5800.25, 'Procesada', 'Transporte mercancías', 'FAC-005');

-- Verificar que los datos se insertaron correctamente
SELECT 
  id,
  proveedor,
  monto,
  estado,
  fecha,
  created_at
FROM facturas 
ORDER BY created_at DESC
LIMIT 10;
