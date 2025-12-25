const { Client } = require('pg');

async function updateTenants() {
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
    console.log('Connecting...');
    await client.connect();
    console.log('✓ Connected!\n');

    // Configurar tenant como 'unknown' para poder ver/actualizar esas facturas
    await client.query('SET row_security = on');
    await client.query("SET app.tenant_id = 'unknown'");

    console.log('Counting facturas with tenant_id = "unknown"...');
    const count = await client.query("SELECT COUNT(*) as count FROM facturas WHERE tenant_id = 'unknown'");
    console.log(`Found: ${count.rows[0].count} facturas\n`);

    if (count.rows[0].count > 0) {
      console.log('Updating tenant_id from "unknown" to "grupomast"...');
      const result = await client.query(`
        UPDATE facturas
        SET tenant_id = 'grupomast'
        WHERE tenant_id = 'unknown'
      `);

      console.log(`✅ Updated ${result.rowCount} facturas`);

      // Verificar
      console.log('\nVerifying with new tenant_id...');
      await client.query("SET app.tenant_id = 'grupomast'");
      const verify = await client.query("SELECT COUNT(*) as count FROM facturas");
      console.log(`Facturas visible with tenant_id='grupomast': ${verify.rows[0].count}`);
    }

    await client.end();
  } catch (err) {
    console.error('✗ Error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

updateTenants();
