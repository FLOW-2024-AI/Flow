import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb'

const REGION = process.env.AWS_REGION || 'us-east-1'
const TABLE_NAME = process.env.DYNAMODB_FACTURAS_TABLE || 'facturas'

// Cliente de DynamoDB
const dynamoClient = new DynamoDBClient({ region: REGION })
const docClient = DynamoDBDocumentClient.from(dynamoClient)

/**
 * Determina si se debe usar DynamoDB como fallback
 * Activado si la variable de entorno está configurada
 */
export function shouldUseDynamoFallback(): boolean {
  return process.env.USE_DYNAMO_FALLBACK === 'true'
}

/**
 * Obtiene todas las facturas de un tenant desde DynamoDB
 * @param tenantId - ID del tenant
 * @returns Array de items de DynamoDB
 */
export async function fetchDynamoInvoices(tenantId: string): Promise<any[]> {
  try {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'tenant_id = :tenantId',
      ExpressionAttributeValues: {
        ':tenantId': tenantId
      },
      // Ordenar por fecha de creación descendente
      ScanIndexForward: false
    })

    const response = await docClient.send(command)
    return response.Items || []
  } catch (error) {
    console.error('Error fetching from DynamoDB:', error)
    throw error
  }
}

/**
 * Obtiene una factura específica por ID desde DynamoDB
 * @param tenantId - ID del tenant
 * @param invoiceId - ID de la factura
 * @returns Item de DynamoDB o null si no se encuentra
 */
export async function fetchDynamoInvoiceById(
  tenantId: string,
  invoiceId: string
): Promise<any | null> {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        tenant_id: tenantId,
        invoice_id: invoiceId
      }
    })

    const response = await docClient.send(command)
    return response.Item || null
  } catch (error) {
    console.error('Error fetching invoice from DynamoDB:', error)
    throw error
  }
}

/**
 * Construye estadísticas a partir de items de DynamoDB
 * @param items - Array de items de DynamoDB
 * @returns Objeto con estadísticas
 */
export function buildDynamoStats(items: any[]): {
  pendientes: number
  montoPendientePen: number
  montoPendienteUsd: number
  procesadasHoy: number
} {
  const hoy = new Date().toISOString().split('T')[0]

  const stats = items.reduce(
    (acc, item) => {
      const isPendiente = item.aprobado_por_cliente === null || item.aprobado_por_cliente === undefined
      const moneda = item.moneda || 'PEN'
      const montoTotal = parseFloat(item.monto_total || 0)

      // Contar pendientes
      if (isPendiente) {
        acc.pendientes++
        if (moneda === 'PEN') {
          acc.montoPendientePen += montoTotal
        } else if (moneda === 'USD') {
          acc.montoPendienteUsd += montoTotal
        }
      }

      // Contar procesadas hoy
      const aprobadoFecha = item.aprobado_fecha
      if (aprobadoFecha && aprobadoFecha.startsWith(hoy)) {
        acc.procesadasHoy++
      }

      return acc
    },
    {
      pendientes: 0,
      montoPendientePen: 0,
      montoPendienteUsd: 0,
      procesadasHoy: 0
    }
  )

  return stats
}

/**
 * Mapea un item de DynamoDB al formato de detalle de factura
 * @param item - Item de DynamoDB
 * @returns Objeto con la estructura de detalle de factura
 */
export function mapDynamoDetalle(item: any): any {
  const formatFecha = (fecha: any) => {
    if (!fecha) return null
    try {
      return new Date(fecha).toISOString().split('T')[0]
    } catch {
      return null
    }
  }

  // Extraer items de la factura
  const items = (item.items || []).map((i: any, index: number) => ({
    numero_item: i.numero_item || index + 1,
    codigo_producto: i.codigo_producto || i.codigo || '',
    descripcion: i.descripcion || '',
    cantidad: parseFloat(i.cantidad || 0),
    unidad_medida: i.unidad_medida || 'UND',
    precio_unitario: parseFloat(i.precio_unitario || 0),
    valor_unitario: parseFloat(i.valor_unitario || i.precio_unitario || 0),
    descuento: parseFloat(i.descuento || 0),
    subtotal: parseFloat(i.subtotal || i.valor_venta || 0),
    igv: parseFloat(i.igv || 0),
    total: parseFloat(i.total || 0),
    tipo_afectacion_igv: i.tipo_afectacion_igv || i.tipo_afectacion || ''
  }))

  return {
    factura: {
      id: item.invoice_id,
      invoice_id: item.invoice_id,
      numero_factura: item.numero_factura || item.numero || '',
      serie: item.serie || '',
      correlativo: item.correlativo || '',
      tipo_documento: item.tipo_documento || 'FACTURA',
      fecha_emision: formatFecha(item.fecha_emision),
      fecha_vencimiento: formatFecha(item.fecha_vencimiento),
      plazo_pago: item.plazo_pago || item.plazo_credito,
      moneda: item.moneda || 'PEN',
      subtotal: parseFloat(item.monto_subtotal || 0),
      igv: parseFloat(item.monto_igv || 0),
      total: parseFloat(item.monto_total || 0),
      condicion_pago: item.condicion_pago,
      medio_pago: item.medio_pago,
      vendedor: item.vendedor,
      numero_pedido: item.numero_pedido,
      oc_asociada: item.oc_asociada,
      guia_remision: item.guia_remision,
      observaciones: item.observaciones,
      s3_url: item.archivo?.s3Url || item.s3_url
    },
    proveedor: {
      ruc: item.ruc_emisor || item.ruc || '',
      razon_social: item.nombre_proveedor || item.proveedor || '',
      nombre_comercial: item.emisor_nombre_comercial,
      direccion: item.emisor_direccion,
      departamento: item.emisor_departamento,
      provincia: item.emisor_provincia,
      distrito: item.emisor_distrito,
      telefono: item.emisor_telefono,
      email: item.emisor_email,
      estado_ruc: item.sunat_estado_ruc_descripcion,
      condicion_domicilio: item.sunat_condicion_domicilio_descripcion
    },
    sunat: {
      estado_comprobante: item.sunat_estado || 'N/A',
      descripcion_comprobante: item.sunat_estado_comprobante_descripcion,
      estado_ruc: item.sunat_estado_ruc_descripcion
    },
    aprobacion: {
      aprobado: item.aprobado_por_cliente,
      fecha: formatFecha(item.aprobado_fecha),
      por_usuario: item.aprobado_por_usuario,
      comentario: item.aprobado_comentario
    },
    items: items
  }
}

/**
 * Mapea items de DynamoDB al formato de facturas pendientes
 * @param items - Array de items de DynamoDB
 * @returns Array de facturas pendientes
 */
export function mapDynamoPendientes(items: any[]): any[] {
  return items
    .filter(item => item.aprobado_por_cliente === null || item.aprobado_por_cliente === undefined)
    .map(item => ({
      id: item.invoice_id,
      proveedor: item.nombre_proveedor || item.proveedor || 'Sin nombre',
      ruc: item.ruc_emisor || item.ruc || '',
      fecha: item.fecha_emision?.split?.('T')?.[0] || '',
      monto: parseFloat(item.monto_subtotal || 0),
      impuesto: parseFloat(item.monto_igv || 0),
      total: parseFloat(item.monto_total || 0),
      moneda: item.moneda || 'PEN',
      confianza: item.procesamiento_confidence === 'high' ? 95 : item.procesamiento_confidence === 'medium' ? 75 : 50,
      campos: {
        proveedor: item.procesamiento_confidence === 'high' ? 95 : 75,
        ruc: 100,
        monto: item.procesamiento_confidence === 'high' ? 95 : 75,
        fecha: item.procesamiento_confidence === 'high' ? 95 : 75
      },
      origen: item.procesamiento_motor?.includes?.('sunat') ? 'SUNAT' : 'Email',
      estadoSunat: item.sunat_estado || 'N/A',
      estadoRuc: item.sunat_estado_ruc_descripcion || 'N/A',
      s3_url: item.archivo?.s3Url || item.s3_url
    }))
}

/**
 * Mapea items de DynamoDB al formato de facturas aprobadas
 * @param items - Array de items de DynamoDB
 * @returns Array de facturas aprobadas
 */
export function mapDynamoAprobadas(items: any[]): any[] {
  const formatFecha = (fecha: any) => {
    if (!fecha) return null
    try {
      if (typeof fecha === 'string') return fecha.split('T')[0]
      return new Date(fecha).toISOString().split('T')[0]
    } catch {
      return null
    }
  }

  return items
    .filter(item => item.aprobado_por_cliente === true)
    .map(item => ({
      id: item.invoice_id || item.numero_factura,
      proveedor: item.nombre_proveedor || item.proveedor || 'Sin nombre',
      ruc: item.ruc_emisor || item.ruc || '',
      fecha: formatFecha(item.fecha_emision) || '',
      fechaVencimiento: formatFecha(item.fecha_vencimiento),
      plazoPago: item.plazo_pago || item.plazo_credito || null,
      monto: parseFloat(item.monto_subtotal || 0),
      impuesto: parseFloat(item.monto_igv || 0),
      total: parseFloat(item.monto_total || 0),
      moneda: item.moneda || 'PEN',
      origen: item.procesamiento_motor?.includes?.('sunat') ? 'SUNAT' : 'Email',
      estadoSunat: item.sunat_estado || 'N/A',
      estadoRuc: item.sunat_estado_ruc_descripcion || 'N/A',
      s3_url: item.archivo?.s3Url || item.s3_url,
      aprobadoFecha: formatFecha(item.aprobado_fecha) || ''
    }))
}
