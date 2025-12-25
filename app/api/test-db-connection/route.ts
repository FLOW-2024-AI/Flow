import { NextResponse } from 'next/server'
import { Client } from 'pg'

export const dynamic = 'force-dynamic'

export async function GET() {
  const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false
    } : false,
    connectionTimeoutMillis: 10000,
  }

  const client = new Client(dbConfig)

  try {
    console.log('[DB-TEST] Attempting connection to:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      ssl: !!dbConfig.ssl
    })

    await client.connect()
    console.log('[DB-TEST] Connected successfully!')

    // Try a simple query
    const result = await client.query('SELECT NOW() as current_time, current_database() as db_name')

    await client.end()

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      config: {
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        user: dbConfig.user,
        sslEnabled: !!dbConfig.ssl
      },
      query: result.rows[0]
    })
  } catch (error: any) {
    console.error('[DB-TEST] Connection failed:', error)

    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      config: {
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        user: dbConfig.user,
        sslEnabled: !!dbConfig.ssl
      },
      details: {
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 3)
      }
    }, { status: 500 })
  } finally {
    try {
      await client.end()
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}
