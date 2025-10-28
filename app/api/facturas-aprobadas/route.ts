import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export async function GET() {
  try {
    // Query para obtener facturas aprobadas por el cliente
    const query = `
      SELECT
        id,
        invoice_id,
        numero_factura,
        ruc_emisor,
        nombre_proveedor,
        fecha_emision,
        monto_subtotal,
        monto_igv,
        monto_total,
        moneda,
        procesamiento_motor,
        procesamiento_confidence,
        sunat_estado,
        sunat_estado_ruc_descripcion,
        s3_url,
        aprobado_fecha,
        creado_en
      FROM facturas
      WHERE aprobado_por_cliente = TRUE
      ORDER BY aprobado_fecha DESC
    `

    const result = await pool.query(query)

    // Transformar los datos al formato que espera el frontend
    const facturas = result.rows.map(row => ({
      id: row.invoice_id || row.id,
      proveedor: row.nombre_proveedor || 'Sin nombre',
      ruc: row.ruc_emisor,
      fecha: row.fecha_emision?.toISOString().split('T')[0] || '',
      monto: parseFloat(row.monto_subtotal) || 0,
      impuesto: parseFloat(row.monto_igv) || 0,
      total: parseFloat(row.monto_total) || 0,
      moneda: row.moneda || 'PEN',
      confianza: row.procesamiento_confidence === 'high' ? 95 : row.procesamiento_confidence === 'medium' ? 75 : 50,
      campos: {
        proveedor: row.procesamiento_confidence === 'high' ? 95 : 75,
        ruc: 100,
        monto: row.procesamiento_confidence === 'high' ? 95 : 75,
        fecha: row.procesamiento_confidence === 'high' ? 95 : 75
      },
      origen: row.procesamiento_motor?.includes('sunat') ? 'SUNAT' : 'Email',
      estadoSunat: row.sunat_estado || 'N/A',
      estadoRuc: row.sunat_estado_ruc_descripcion || 'N/A',
      s3_url: row.s3_url,
      aprobadoFecha: row.aprobado_fecha?.toISOString().split('T')[0] || ''
    }))

    return NextResponse.json({
      success: true,
      data: facturas,
      count: facturas.length
    })

  } catch (error) {
    console.error('Error fetching facturas aprobadas:', error)

    return NextResponse.json({
      success: false,
      error: 'Error al obtener facturas aprobadas',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
