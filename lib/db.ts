import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg'

// Pool de conexiones por tenant
const pools = new Map<string, Pool>()

/**
 * Obtiene o crea un pool de conexiones para un tenant específico
 * @param tenantId - ID del tenant
 * @returns Pool de conexiones PostgreSQL
 */
function getPool(tenantId: string): Pool {
  let pool = pools.get(tenantId)

  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: 20, // Máximo de conexiones en el pool
      idleTimeoutMillis: 30000, // Tiempo antes de cerrar conexiones inactivas
      connectionTimeoutMillis: 10000, // Tiempo máximo de espera para obtener una conexión (10 segundos)
      // SSL configuration for RDS
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
      } : undefined
    })

    // Manejar errores del pool
    pool.on('error', (err) => {
      console.error(`Error en pool de DB para tenant ${tenantId}:`, err)
    })

    pools.set(tenantId, pool)
  }

  return pool
}

/**
 * Ejecuta una función con un cliente de base de datos para un tenant específico
 * @param tenantId - ID del tenant
 * @param callback - Función que recibe el cliente y retorna una promesa
 * @returns Resultado de la función callback
 */
export async function withTenantClient<T>(
  tenantId: string,
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const pool = getPool(tenantId)
  let client: PoolClient | null = null

  try {
    console.log(`[DB] Connecting to database for tenant: ${tenantId}`)
    client = await pool.connect()
    console.log(`[DB] Successfully connected for tenant: ${tenantId}`)

    // Desactivar RLS si está configurado en variables de entorno (desarrollo)
    if (process.env.DB_DISABLE_RLS === 'true') {
      console.log(`[DB] Disabling RLS for session`)
      await client.query('SET row_security = off')
    } else {
      // Configurar el tenant_id en la sesión para Row Level Security (RLS)
      await client.query('SET row_security = on')
      await client.query(`SET app.tenant_id = '${tenantId.replace(/'/g, "''")}'`)
      console.log(`[DB] RLS enabled for tenant: ${tenantId}`)
    }

    const result = await callback(client)
    return result
  } catch (error) {
    console.error(`[DB] Error for tenant ${tenantId}:`, error)
    throw error
  } finally {
    // Siempre liberar el cliente de vuelta al pool
    if (client) {
      client.release()
      console.log(`[DB] Connection released for tenant: ${tenantId}`)
    }
  }
}

/**
 * Cierra todos los pools de conexiones
 * Útil para limpieza durante el shutdown de la aplicación
 */
export async function closeAllPools(): Promise<void> {
  const closePromises = Array.from(pools.values()).map(pool => pool.end())
  await Promise.all(closePromises)
  pools.clear()
}

/**
 * Cierra el pool de un tenant específico
 * @param tenantId - ID del tenant
 */
export async function closeTenantPool(tenantId: string): Promise<void> {
  const pool = pools.get(tenantId)
  if (pool) {
    await pool.end()
    pools.delete(tenantId)
  }
}

/**
 * Helper para ejecutar queries directamente sin transacciones
 * @param tenantId - ID del tenant
 * @param query - Query SQL
 * @param values - Valores para la query parametrizada
 * @returns Resultado de la query
 */
export async function query<T extends QueryResultRow = any>(
  tenantId: string,
  query: string,
  values?: any[]
): Promise<QueryResult<T>> {
  return withTenantClient(tenantId, async (client) => {
    return client.query<T>(query, values)
  })
}
