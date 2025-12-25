const { Client } = require('pg');

async function listTenants() {
  const client = new Client({
    host: 'aurora-facturas-poc.cluster-cwx8i4i6gg10.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'facturas_db',
    user: 'flow_app_rw',
    password: 'M(fs(x+X7DqP5*&37b&lyRh5',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();

    // Bypass RLS para ver todos los tenants
    await client.query('SET row_security = off');

    const result = await client.query(`
      SELECT tenant_id, COUNT(*) as count
      FROM facturas
      GROUP BY tenant_id
      ORDER BY count DESC
    `);

    console.log('Facturas por tenant_id en PostgreSQL:\n');
    result.rows.forEach(row => {
      console.log(`  ${row.tenant_id}: ${row.count} facturas`);
    });

    console.log(`\nTotal: ${result.rows.reduce((sum, r) => sum + parseInt(r.count), 0)} facturas`);

    await client.end();
  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exit(1);
  }
}

listTenants();
