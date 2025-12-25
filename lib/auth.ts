import { NextRequest } from 'next/server'
import { jwtDecrypt, decodeJwt } from 'jose'

export class AuthError extends Error {
  status: number

  constructor(message: string, status: number = 401) {
    super(message)
    this.name = 'AuthError'
    this.status = status
  }
}

export interface TenantContext {
  tenantId: string
  email?: string
  username?: string
}

/**
 * Extrae y valida el contexto del tenant desde el token JWT
 * @param request - NextRequest con cookies que contienen el id_token
 * @returns TenantContext con tenantId, email, y username
 * @throws AuthError si no hay token válido
 */
export async function requireTenantContext(request: NextRequest): Promise<TenantContext> {
  try {
    const idToken = request.cookies.get('id_token')?.value

    if (!idToken) {
      throw new AuthError('No autenticado - Token no encontrado', 401)
    }

    // Decodificar el JWT (sin verificación de firma por ahora)
    // En producción, deberías verificar la firma usando las JWKS keys de Cognito
    const payload = decodeJwt(idToken)

    // Extraer información del usuario
    const email = payload.email as string | undefined
    const username = payload['cognito:username'] as string | undefined || payload.username as string | undefined

    // El tenant_id puede venir de diferentes lugares dependiendo de la configuración
    // Puede ser un atributo custom, el sub, o derivado del username/email
    let tenantId = payload['custom:tenant_id'] as string | undefined
      || payload.tenant_id as string | undefined
      || payload.tenantId as string | undefined
      || payload.sub as string // Usar sub (user ID) como fallback

    if (!tenantId) {
      throw new AuthError('Token inválido - No se encontró tenant_id', 401)
    }

    return {
      tenantId,
      email,
      username
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error
    }
    console.error('Error al procesar autenticación:', error)
    throw new AuthError('Token inválido o expirado', 401)
  }
}

/**
 * Función helper para obtener solo el tenantId
 */
export async function getTenantId(request: NextRequest): Promise<string> {
  const context = await requireTenantContext(request)
  return context.tenantId
}
