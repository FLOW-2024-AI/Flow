import { NextRequest, NextResponse } from 'next/server'
import { AuthError, requireTenantContext } from '@/lib/auth'
import { withTenantClient } from '@/lib/db'
import {
  buildDynamoStats,
  fetchDynamoInvoices,
  shouldUseDynamoFallback
} from '@/lib/dynamo-facturas'

export async function GET(request: NextRequest) {
  let tenantId = ''
  try {
    tenantId = (await requireTenantContext(request)).tenantId
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

    if (shouldUseDynamoFallback() && tenantId) {
      try {
        const items = await fetchDynamoInvoices(tenantId)
        const stats = buildDynamoStats(items)
        return NextResponse.json({
          success: true,
          data: stats,
          fallback: 'dynamo'
        })
      } catch (dynamoError) {
        console.error('Error fetching Dynamo stats:', dynamoError)
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Error al obtener estadísticas',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
