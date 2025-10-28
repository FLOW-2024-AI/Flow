import { NextResponse } from 'next/server'
import { ChatBedrockConverse } from '@langchain/aws'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
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

// Configurar Bedrock con LangChain
const bedrockConfig: any = {
  region: process.env.AWS_REGION || 'us-east-1',
  model: 'anthropic.claude-3-haiku-20240307-v1:0',
  maxTokens: 2000,
  temperature: 0.7,
}

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  bedrockConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
}

// Obtener contexto de facturas
async function getFacturasContext() {
  try {
    // Obtener estadísticas generales
    const statsQuery = `
      SELECT
        COUNT(*) as total_facturas,
        COUNT(CASE WHEN aprobado_por_cliente = true THEN 1 END) as facturas_aprobadas,
        COUNT(CASE WHEN aprobado_por_cliente = false THEN 1 END) as facturas_pendientes,
        SUM(CASE WHEN moneda = 'PEN' THEN monto_total ELSE 0 END) as total_pen,
        SUM(CASE WHEN moneda = 'USD' THEN monto_total ELSE 0 END) as total_usd,
        COUNT(CASE WHEN fecha_vencimiento < CURRENT_DATE AND aprobado_por_cliente = false THEN 1 END) as facturas_vencidas
      FROM facturas
    `

    const statsResult = await pool.query(statsQuery)
    const stats = statsResult.rows[0]

    // Obtener facturas recientes
    const facturasQuery = `
      SELECT
        numero_factura,
        nombre_proveedor,
        ruc_emisor,
        fecha_emision,
        fecha_vencimiento,
        moneda,
        monto_total,
        aprobado_por_cliente,
        sunat_estado
      FROM facturas
      ORDER BY fecha_emision DESC
      LIMIT 50
    `

    const facturasResult = await pool.query(facturasQuery)

    return {
      stats,
      facturas: facturasResult.rows
    }
  } catch (error) {
    console.error('Error obteniendo contexto:', error)
    throw error
  }
}

// Prompt template con LangChain
const promptTemplate = PromptTemplate.fromTemplate(`
Eres un asistente especializado en facturas llamado "Agente IA". Tu trabajo es ayudar a los usuarios con consultas sobre sus facturas.

ESTADÍSTICAS GENERALES:
- Total de facturas: {total_facturas}
- Facturas aprobadas: {facturas_aprobadas}
- Facturas pendientes: {facturas_pendientes}
- Facturas vencidas: {facturas_vencidas}
- Total en Soles (PEN): S/ {total_pen}
- Total en Dólares (USD): $ {total_usd}

FACTURAS RECIENTES:
{facturas_recientes}

INSTRUCCIONES:
- Responde de manera concisa, profesional y amigable
- Si te preguntan por información específica que no está en el contexto, indícalo claramente
- Puedes hacer cálculos y análisis basados en los datos proporcionados
- Usa formato markdown con bullets, negritas y listas cuando sea apropiado
- Responde siempre en español
- Si te preguntan sobre proveedores, fechas o montos específicos, busca en las facturas recientes
- Sé específico con números y datos cuando sea posible

PREGUNTA DEL USUARIO:
{question}

RESPUESTA:
`)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere un mensaje'
      }, { status: 400 })
    }

    // Obtener contexto de facturas
    const context = await getFacturasContext()

    // Formatear facturas para el contexto
    const facturasFormateadas = context.facturas.map((f: any, i: number) => `
${i + 1}. ${f.numero_factura}
   - Proveedor: ${f.nombre_proveedor} (RUC: ${f.ruc_emisor})
   - Fecha emisión: ${f.fecha_emision}
   - Vencimiento: ${f.fecha_vencimiento || 'No especificada'}
   - Monto: ${f.moneda === 'USD' ? '$' : 'S/'} ${parseFloat(f.monto_total || 0).toFixed(2)}
   - Estado: ${f.aprobado_por_cliente ? 'Aprobada' : 'Pendiente'}
   - SUNAT: ${f.sunat_estado || 'N/A'}
`).join('\n')

    // Crear el modelo de Bedrock
    const model = new ChatBedrockConverse(bedrockConfig)

    // Crear la chain con LangChain
    const chain = RunnableSequence.from([
      promptTemplate,
      model,
      new StringOutputParser()
    ])

    // Invocar la chain
    const response = await chain.invoke({
      total_facturas: context.stats.total_facturas,
      facturas_aprobadas: context.stats.facturas_aprobadas,
      facturas_pendientes: context.stats.facturas_pendientes,
      facturas_vencidas: context.stats.facturas_vencidas,
      total_pen: parseFloat(context.stats.total_pen || 0).toFixed(2),
      total_usd: parseFloat(context.stats.total_usd || 0).toFixed(2),
      facturas_recientes: facturasFormateadas,
      question: message
    })

    return NextResponse.json({
      success: true,
      response: response
    })

  } catch (error) {
    console.error('Error en chat:', error)

    return NextResponse.json({
      success: false,
      error: 'Error al procesar tu pregunta',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
