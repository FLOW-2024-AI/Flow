import { NextRequest, NextResponse } from 'next/server'
import { AuthError, requireTenantContext } from '@/lib/auth'
import { withTenantClient } from '@/lib/db'
import {
  fetchDynamoInvoices,
  mapDynamoAprobadas,
  shouldUseDynamoFallback
} from '@/lib/dynamo-facturas'

export async function GET(request: NextRequest) {
  let tenantId = ''
  try {
    tenantId = (await requireTenantContext(request)).tenantId
    // Query simple y segura - solo campos esenciales
    const query = `
      SELECT *
      FROM facturas
      WHERE aprobado_por_cliente = TRUE
      ORDER BY fecha_emision DESC
      LIMIT 100
    `

    const result = await withTenantClient(tenantId, async (client) => client.query(query))

    // Transformar los datos al formato que espera el frontend
    const facturas = result.rows.map(row => {
      // Helper para convertir fechas de forma segura
      const formatFecha = (fecha: any) => {
        if (!fecha) return null
        try {
          if (fecha instanceof Date) return fecha.toISOString().split('T')[0]
          return new Date(fecha).toISOString().split('T')[0]
        } catch {
          return null
        }
      }

      return {
        id: row.invoice_id || row.numero_factura || row.id,
        proveedor: row.nombre_proveedor || row.proveedor || 'Sin nombre',
        ruc: row.ruc_emisor || row.ruc || '',
        fecha: formatFecha(row.fecha_emision) || formatFecha(row.fecha) || '',
        fechaVencimiento: formatFecha(row.fecha_vencimiento),
        plazoPago: row.plazo_pago || null,
        monto: parseFloat(row.monto_subtotal || row.subtotal || 0),
        impuesto: parseFloat(row.monto_igv || row.igv || 0),
        total: parseFloat(row.monto_total || row.total || 0),
        moneda: row.moneda || 'PEN',
        origen: row.procesamiento_motor?.includes?.('sunat') ? 'SUNAT' : 'Email',
        estadoSunat: row.sunat_estado || row.estado_sunat || 'N/A',
        estadoRuc: row.sunat_estado_ruc_descripcion || row.estado_ruc || 'N/A',
        s3_url: row.s3_url || null,
        aprobadoFecha: formatFecha(row.aprobado_fecha) || ''
      }
    })

    return NextResponse.json({
      success: true,
      data: facturas,
      count: facturas.length
    })

  } catch (error) {
    console.error('Error fetching facturas aprobadas:', error)
    if (error instanceof AuthError) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: error.status })
    }

    if (shouldUseDynamoFallback() && tenantId) {
      try {
        const items = await fetchDynamoInvoices(tenantId)
        const facturas = mapDynamoAprobadas(items)
        return NextResponse.json({
          success: true,
          data: facturas,
          count: facturas.length,
          fallback: 'dynamo'
        })
      } catch (dynamoError) {
        console.error('Error fetching Dynamo aprobadas:', dynamoError)
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Error al obtener facturas aprobadas',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
