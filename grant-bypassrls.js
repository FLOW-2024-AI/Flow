const { Client } = require('pg');

async function grantBypassRLS() {
  const client = new Client({
    host: 'aurora-facturas-poc.cluster-cwx8i4i6gg10.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'facturas_db',
    user: 'postgres',
    password: 'M(fs(x+X7DqP5*&37b&lyRh5',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting as postgres...');
    await client.connect();
    console.log('✓ Connected!\n');

    console.log('Granting BYPASSRLS permission to flow_app_rw...');
    await client.query('ALTER USER flow_app_rw WITH BYPASSRLS;');
    console.log('✅ BYPASSRLS permission granted!\n');

    // Verificar
    const result = await client.query(`
      SELECT rolname, rolbypassrls
      FROM pg_roles
      WHERE rolname = 'flow_app_rw'
    `);

    console.log('Verification:');
    console.log(result.rows[0]);

    await client.end();
  } catch (err) {
    console.error('✗ Error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

grantBypassRLS();
