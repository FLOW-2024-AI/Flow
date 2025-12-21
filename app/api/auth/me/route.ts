import { NextRequest, NextResponse } from 'next/server'
import { AuthError, requireTenantContext } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const context = await requireTenantContext(request)
    return NextResponse.json({
      success: true,
      tenantId: context.tenantId,
      email: context.email || null,
      username: context.username || null
    })
  } catch (error) {
    console.error('Error obteniendo contexto de usuario:', error)
    if (error instanceof AuthError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status })
    }
    return NextResponse.json(
      { success: false, error: 'Error al obtener usuario' },
      { status: 500 }
    )
  }
}
