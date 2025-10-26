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
  max: 20, // Máximo de conexiones en el pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export async function GET() {
  try {
    // Query para obtener facturas pendientes de aprobación del cliente
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
        procesamiento_motor,
        procesamiento_confidence,
        sunat_estado,
        sunat_estado_ruc_descripcion,
        creado_en
      FROM facturas
      WHERE aprobado_por_cliente IS NULL
      ORDER BY creado_en DESC
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
      confianza: row.procesamiento_confidence === 'high' ? 95 : row.procesamiento_confidence === 'medium' ? 75 : 50,
      campos: {
        proveedor: row.procesamiento_confidence === 'high' ? 95 : 75,
        ruc: 100,
        monto: row.procesamiento_confidence === 'high' ? 95 : 75,
        fecha: row.procesamiento_confidence === 'high' ? 95 : 75
      },
      origen: row.procesamiento_motor?.includes('sunat') ? 'SUNAT' : 'Email',
      estadoSunat: row.sunat_estado || 'N/A',
      estadoRuc: row.sunat_estado_ruc_descripcion || 'N/A'
    }))

    return NextResponse.json({
      success: true,
      data: facturas,
      count: facturas.length
    })

  } catch (error) {
    console.error('Error fetching facturas pendientes:', error)

    return NextResponse.json({
      success: false,
      error: 'Error al obtener facturas pendientes',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST endpoint para aprobar facturas
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { facturaIds } = body

    if (!facturaIds || !Array.isArray(facturaIds) || facturaIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere un array de IDs de facturas'
      }, { status: 400 })
    }

    // Actualizar facturas como aprobadas
    const query = `
      UPDATE facturas
      SET
        aprobado_por_cliente = TRUE,
        aprobado_fecha = NOW(),
        actualizado_en = NOW()
      WHERE invoice_id = ANY($1)
      RETURNING invoice_id
    `

    const result = await pool.query(query, [facturaIds])

    return NextResponse.json({
      success: true,
      message: `${result.rowCount} factura(s) aprobada(s)`,
      approvedIds: result.rows.map(r => r.invoice_id)
    })

  } catch (error) {
    console.error('Error aprobando facturas:', error)

    return NextResponse.json({
      success: false,
      error: 'Error al aprobar facturas',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
