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
    // Query para obtener estadísticas
    const query = `
      SELECT
        -- Total pendientes de validación
        COUNT(*) FILTER (WHERE aprobado_por_cliente IS NULL) as pendientes,

        -- Monto total pendiente en soles
        COALESCE(SUM(monto_total) FILTER (WHERE aprobado_por_cliente IS NULL AND moneda = 'PEN'), 0) as monto_pendiente_pen,

        -- Monto total pendiente en dólares
        COALESCE(SUM(monto_total) FILTER (WHERE aprobado_por_cliente IS NULL AND moneda = 'USD'), 0) as monto_pendiente_usd,

        -- Procesadas hoy (aprobadas hoy)
        COUNT(*) FILTER (
          WHERE aprobado_por_cliente = TRUE
          AND DATE(aprobado_fecha) = CURRENT_DATE
        ) as procesadas_hoy
      FROM facturas
    `

    const result = await pool.query(query)
    const stats = result.rows[0]

    return NextResponse.json({
      success: true,
      data: {
        pendientes: parseInt(stats.pendientes) || 0,
        montoPendientePen: parseFloat(stats.monto_pendiente_pen) || 0,
        montoPendienteUsd: parseFloat(stats.monto_pendiente_usd) || 0,
        procesadasHoy: parseInt(stats.procesadas_hoy) || 0
      }
    })

  } catch (error) {
    console.error('Error fetching stats:', error)

    return NextResponse.json({
      success: false,
      error: 'Error al obtener estadísticas',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
