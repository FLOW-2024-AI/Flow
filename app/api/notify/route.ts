import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, company, role, created_at } = body

    const webhookUrl = process.env.N8N_WEBHOOK_URL

    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL no está configurado')
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Enviar datos al webhook de n8n
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        company,
        role,
        created_at,
        source: 'finka-finance-landing'
      }),
    })

    if (!webhookResponse.ok) {
      console.error('Error al enviar al webhook de n8n:', webhookResponse.statusText)
    } else {
      console.log('Notificación enviada exitosamente a n8n')
    }

    // Siempre devolver 200 para no bloquear la UX del usuario
    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error('Error en /api/notify:', error)
    return NextResponse.json({ success: true }, { status: 200 })
  }
}
