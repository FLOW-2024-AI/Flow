import { NextRequest, NextResponse } from 'next/server'
import { AuthError, requireTenantContext } from '@/lib/auth'
import { withTenantClient } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('[API-STATS] Fetching stats...')
    const { tenantId } = await requireTenantContext(request)
    console.log('[API-STATS] Tenant:', tenantId)

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

    const result = await withTenantClient(tenantId, async (client) => client.query(query))
    const stats = result.rows[0]

    console.log('[API-STATS] Stats:', stats)

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

    if (error instanceof AuthError) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: error.status })
    }

    return NextResponse.json({
      success: false,
      error: 'Error al obtener estadísticas',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
