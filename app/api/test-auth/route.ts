import { NextRequest, NextResponse } from 'next/server'
import { AuthError, requireTenantContext } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('[TEST-AUTH] Endpoint called')
    const { tenantId, email, username } = await requireTenantContext(request)

    console.log('[TEST-AUTH] Auth successful:', { tenantId, email, username })

    return NextResponse.json({
      success: true,
      message: 'Authentication working',
      tenantId,
      email,
      username
    })
  } catch (error) {
    console.error('[TEST-AUTH] Error:', error)

    if (error instanceof AuthError) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: error.status })
    }

    return NextResponse.json({
      success: false,
      error: 'Unknown error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
