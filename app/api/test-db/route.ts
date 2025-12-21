import { NextRequest, NextResponse } from 'next/server';
import { AuthError, requireTenantContext } from '@/lib/auth';
import { withTenantClient } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await requireTenantContext(request);
    // Mostrar configuración (sin password)
    const config = {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      hasPassword: !!process.env.DB_PASSWORD,
      passwordLength: process.env.DB_PASSWORD?.length || 0
    };

    const result = await withTenantClient(tenantId, async (client) =>
      client.query('SELECT NOW() as current_time, current_database() as db_name')
    );

    return NextResponse.json({
      success: true,
      message: 'Conexión exitosa a la base de datos',
      config: config,
      dbResponse: result.rows[0]
    });

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: error.status });
    }
    return NextResponse.json({
      success: false,
      message: 'Error al conectar a la base de datos',
      config: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        hasPassword: !!process.env.DB_PASSWORD,
        passwordLength: process.env.DB_PASSWORD?.length || 0
      },
      error: error instanceof Error ? error.message : 'Error desconocido',
      errorStack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
