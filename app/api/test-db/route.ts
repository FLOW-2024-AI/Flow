import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  try {
    // Mostrar configuración (sin password)
    const config = {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      hasPassword: !!process.env.DB_PASSWORD,
      passwordLength: process.env.DB_PASSWORD?.length || 0
    };

    // Intentar conexión
    const pool = new Pool({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432'),
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 5000,
    });

    const result = await pool.query('SELECT NOW() as current_time, current_database() as db_name');
    await pool.end();

    return NextResponse.json({
      success: true,
      message: 'Conexión exitosa a la base de datos',
      config: config,
      dbResponse: result.rows[0]
    });

  } catch (error) {
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
