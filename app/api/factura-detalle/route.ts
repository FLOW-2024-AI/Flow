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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID de factura requerido'
      }, { status: 400 })
    }

    // Query para obtener la factura completa con todos los datos del proveedor
    const facturaQuery = `
      SELECT
        id,
        invoice_id,
        numero_factura,
        serie,
        correlativo,
        tipo_documento,
        fecha_emision,
        fecha_vencimiento,
        plazo_credito as plazo_pago,
        moneda,
        monto_subtotal,
        monto_igv,
        monto_total,
        -- Datos del proveedor/emisor
        ruc_emisor,
        nombre_proveedor,
        emisor_nombre_comercial,
        emisor_direccion,
        emisor_departamento,
        emisor_provincia,
        emisor_distrito,
        emisor_telefono,
        emisor_email,
        -- Estado SUNAT
        sunat_estado,
        sunat_estado_ruc_descripcion,
        sunat_estado_comprobante_descripcion,
        sunat_condicion_domicilio_descripcion,
        -- Condiciones de pago
        condicion_pago,
        medio_pago,
        vendedor,
        numero_pedido,
        oc_asociada,
        guia_remision,
        observaciones,
        -- Aprobación
        aprobado_por_cliente,
        aprobado_fecha,
        aprobado_por_usuario,
        aprobado_comentario,
        -- S3
        s3_url,
        -- Data completa para extraer items
        data_completa
      FROM facturas
      WHERE invoice_id = $1 OR id::text = $1
      LIMIT 1
    `

    const facturaResult = await pool.query(facturaQuery, [id])

    if (facturaResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Factura no encontrada'
      }, { status: 404 })
    }

    const factura = facturaResult.rows[0]

    // Obtener items desde la tabla detalles_facturas
    const itemsQuery = `
      SELECT
        numero_item,
        codigo as codigo_producto,
        descripcion,
        cantidad,
        unidad_medida,
        valor_unitario,
        precio_unitario,
        descuento,
        valor_venta as subtotal,
        igv,
        total,
        tipo_afectacion as tipo_afectacion_igv
      FROM detalles_facturas
      WHERE id = $1
      ORDER BY numero_item
    `

    const itemsResult = await pool.query(itemsQuery, [factura.id])

    const items = itemsResult.rows.map(item => ({
      numero_item: item.numero_item,
      codigo_producto: item.codigo_producto || '',
      descripcion: item.descripcion || '',
      cantidad: parseFloat(item.cantidad || 0),
      unidad_medida: item.unidad_medida || 'UND',
      precio_unitario: parseFloat(item.precio_unitario || 0),
      valor_unitario: parseFloat(item.valor_unitario || 0),
      descuento: parseFloat(item.descuento || 0),
      subtotal: parseFloat(item.subtotal || 0),
      igv: parseFloat(item.igv || 0),
      total: parseFloat(item.total || 0),
      tipo_afectacion_igv: item.tipo_afectacion_igv || ''
    }))

    // Helper para formatear fechas
    const formatFecha = (fecha: any) => {
      if (!fecha) return null
      try {
        if (fecha instanceof Date) return fecha.toISOString().split('T')[0]
        return new Date(fecha).toISOString().split('T')[0]
      } catch {
        return null
      }
    }

    // Construir la respuesta
    const response = {
      // Información básica de la factura
      factura: {
        id: factura.id,
        invoice_id: factura.invoice_id,
        numero_factura: factura.numero_factura,
        serie: factura.serie,
        correlativo: factura.correlativo,
        tipo_documento: factura.tipo_documento || 'FACTURA',
        fecha_emision: formatFecha(factura.fecha_emision),
        fecha_vencimiento: formatFecha(factura.fecha_vencimiento),
        plazo_pago: factura.plazo_pago,
        moneda: factura.moneda || 'PEN',
        subtotal: parseFloat(factura.monto_subtotal || 0),
        igv: parseFloat(factura.monto_igv || 0),
        total: parseFloat(factura.monto_total || 0),
        condicion_pago: factura.condicion_pago,
        medio_pago: factura.medio_pago,
        vendedor: factura.vendedor,
        numero_pedido: factura.numero_pedido,
        oc_asociada: factura.oc_asociada,
        guia_remision: factura.guia_remision,
        observaciones: factura.observaciones,
        s3_url: factura.s3_url
      },
      // Información del proveedor
      proveedor: {
        ruc: factura.ruc_emisor,
        razon_social: factura.nombre_proveedor,
        nombre_comercial: factura.emisor_nombre_comercial,
        direccion: factura.emisor_direccion,
        departamento: factura.emisor_departamento,
        provincia: factura.emisor_provincia,
        distrito: factura.emisor_distrito,
        telefono: factura.emisor_telefono,
        email: factura.emisor_email,
        estado_ruc: factura.sunat_estado_ruc_descripcion,
        condicion_domicilio: factura.sunat_condicion_domicilio_descripcion
      },
      // Estado SUNAT
      sunat: {
        estado_comprobante: factura.sunat_estado || 'N/A',
        descripcion_comprobante: factura.sunat_estado_comprobante_descripcion,
        estado_ruc: factura.sunat_estado_ruc_descripcion
      },
      // Aprobación
      aprobacion: {
        aprobado: factura.aprobado_por_cliente,
        fecha: formatFecha(factura.aprobado_fecha),
        por_usuario: factura.aprobado_por_usuario,
        comentario: factura.aprobado_comentario
      },
      // Items/productos
      items: items
    }

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error('Error fetching factura detalle:', error)

    return NextResponse.json({
      success: false,
      error: 'Error al obtener detalle de factura',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
