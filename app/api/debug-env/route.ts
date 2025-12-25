import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Only show env var names and whether they exist, NOT their values
  const envVars = {
    COGNITO_REGION: !!process.env.COGNITO_REGION,
    COGNITO_USER_POOL_ID: !!process.env.COGNITO_USER_POOL_ID,
    COGNITO_CLIENT_ID: !!process.env.COGNITO_CLIENT_ID,
    COGNITO_CLIENT_SECRET: !!process.env.COGNITO_CLIENT_SECRET,
    DB_HOST: !!process.env.DB_HOST,
    DB_PORT: !!process.env.DB_PORT,
    DB_NAME: !!process.env.DB_NAME,
    DB_USER: !!process.env.DB_USER,
    DB_PASSWORD: !!process.env.DB_PASSWORD,
    AWS_REGION: !!process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV
  }

  return NextResponse.json({
    message: 'Environment variables check',
    env: envVars,
    cognitoClientIdExists: !!process.env.COGNITO_CLIENT_ID,
    cognitoClientIdValue: process.env.COGNITO_CLIENT_ID ?
      `${process.env.COGNITO_CLIENT_ID.substring(0, 5)}...` :
      'NOT SET'
  })
}
