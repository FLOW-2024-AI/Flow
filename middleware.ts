import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // No procesar rutas de API ni login
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname === '/login'
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get('id_token')?.value
  const allowDev = process.env.ALLOW_DEV_TENANT === 'true'

  if (!token && !allowDev) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
}
