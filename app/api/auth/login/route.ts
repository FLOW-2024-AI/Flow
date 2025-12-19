import { NextRequest, NextResponse } from 'next/server'
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider'
import crypto from 'crypto'

const REGION = process.env.COGNITO_REGION || 'us-east-1'
const CLIENT_ID = process.env.COGNITO_CLIENT_ID
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET

const cognito = new CognitoIdentityProviderClient({ region: REGION })

const buildSecretHash = (username: string) => {
  if (!CLIENT_SECRET || !CLIENT_ID) return undefined
  return crypto
    .createHmac('sha256', CLIENT_SECRET)
    .update(`${username}${CLIENT_ID}`)
    .digest('base64')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = (body.email || '').trim()
    const password = body.password || ''

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Credenciales requeridas' }, { status: 400 })
    }
    if (!CLIENT_ID) {
      return NextResponse.json({ success: false, error: 'Cognito no configurado' }, { status: 500 })
    }

    const authParams: Record<string, string> = {
      USERNAME: email,
      PASSWORD: password
    }
    const secretHash = buildSecretHash(email)
    if (secretHash) {
      authParams.SECRET_HASH = secretHash
    }

    const result = await cognito.send(
      new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: CLIENT_ID,
        AuthParameters: authParams
      })
    )

    const tokens = result.AuthenticationResult
    if (!tokens?.IdToken || !tokens.AccessToken) {
      return NextResponse.json({ success: false, error: 'Autenticacion incompleta' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })

    const cookieOptions = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    }

    response.cookies.set('id_token', tokens.IdToken, {
      ...cookieOptions,
      maxAge: tokens.ExpiresIn || 3600
    })
    response.cookies.set('access_token', tokens.AccessToken, {
      ...cookieOptions,
      maxAge: tokens.ExpiresIn || 3600
    })
    if (tokens.RefreshToken) {
      response.cookies.set('refresh_token', tokens.RefreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60
      })
    }

    return response
  } catch (error) {
    console.error('Error login:', error)
    return NextResponse.json(
      { success: false, error: 'Credenciales invalidas' },
      { status: 401 }
    )
  }
}
