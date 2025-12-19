import { NextRequest, NextResponse } from 'next/server'
import { AuthError, requireTenantContext } from '@/lib/auth'
import { withTenantClient } from '@/lib/db'
import {
  fetchDynamoInvoices,
  mapDynamoPendientes,
  shouldUseDynamoFallback
} from '@/lib/dynamo-facturas'

export async function GET(request: NextRequest) {
  let tenantId = ''
  try {
    tenantId = (await requireTenantContext(request)).tenantId
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
        moneda,
        procesamiento_motor,
        procesamiento_confidence,
        sunat_estado,
        sunat_estado_ruc_descripcion,
        s3_url,
        creado_en
      FROM facturas
      WHERE aprobado_por_cliente IS NULL
      ORDER BY creado_en DESC
    `

    const result = await withTenantClient(tenantId, async (client) => client.query(query))

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
      s3_url: row.s3_url
    }))

    return NextResponse.json({
      success: true,
      data: facturas,
      count: facturas.length
    })

  } catch (error) {
    console.error('Error fetching facturas pendientes:', error)
    if (error instanceof AuthError) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: error.status })
    }

    if (shouldUseDynamoFallback() && tenantId) {
      try {
        const items = await fetchDynamoInvoices(tenantId)
        const facturas = mapDynamoPendientes(items)
        return NextResponse.json({
          success: true,
          data: facturas,
          count: facturas.length,
          fallback: 'dynamo'
        })
      } catch (dynamoError) {
        console.error('Error fetching Dynamo pendientes:', dynamoError)
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Error al obtener facturas pendientes',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST endpoint para aprobar facturas
export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantContext(request)
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

    const result = await withTenantClient(tenantId, async (client) => client.query(query, [facturaIds]))

    return NextResponse.json({
      success: true,
      message: `${result.rowCount} factura(s) aprobada(s)`,
      approvedIds: result.rows.map(r => r.invoice_id)
    })

  } catch (error) {
    console.error('Error aprobando facturas:', error)
    if (error instanceof AuthError) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: error.status })
    }

    return NextResponse.json({
      success: false,
      error: 'Error al aprobar facturas',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
