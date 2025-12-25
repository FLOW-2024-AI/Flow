import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { AuthError, requireTenantContext } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Configurar el cliente S3
// Si no hay credenciales en las variables de entorno, usará las credenciales por defecto del sistema
const s3ClientConfig: any = {
  region: process.env.AWS_REGION || 'us-east-1',
}

// Solo agregar credenciales explícitas si están definidas en el .env
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3ClientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
}

const s3Client = new S3Client(s3ClientConfig)

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantContext(request)
    const body = await request.json()
    const { s3Url } = body

    if (!s3Url) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere s3Url'
      }, { status: 400 })
    }

    // Parsear la URL de S3 (formato: s3://bucket-name/key)
    const s3UrlMatch = s3Url.match(/^s3:\/\/([^/]+)\/(.+)$/)

    if (!s3UrlMatch) {
      return NextResponse.json({
        success: false,
        error: 'Formato de URL S3 inválido'
      }, { status: 400 })
    }

    const bucket = s3UrlMatch[1]
    const key = s3UrlMatch[2]
    const basePrefix = (process.env.BASE_PREFIX || '').trim().replace(/^\/|\/$/g, '')
    const expectedPrefix = basePrefix ? `${basePrefix}/${tenantId}/` : `${tenantId}/`

    if (!key.startsWith(expectedPrefix) && process.env.ALLOW_S3_TENANT_BYPASS !== 'true') {
      return NextResponse.json({
        success: false,
        error: 'Acceso denegado para este tenant'
      }, { status: 403 })
    }

    // Generar URL firmada con expiración de 1 hora
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hora
    })

    return NextResponse.json({
      success: true,
      url: signedUrl,
      expiresIn: 3600
    })

  } catch (error) {
    console.error('Error generando URL firmada:', error)
    if (error instanceof AuthError) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: error.status })
    }

    return NextResponse.json({
      success: false,
      error: 'Error al generar URL del PDF',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
