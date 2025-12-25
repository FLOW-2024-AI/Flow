const { Client } = require('pg');

async function cleanFacturas() {
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

    // Primero, configurar para ver facturas con tenant 'unknown'
    await client.query('SET row_security = on');
    await client.query("SET app.tenant_id = 'unknown'");

    const countUnknown = await client.query("SELECT COUNT(*) as count FROM facturas WHERE tenant_id = 'unknown'");
    console.log(`Facturas with tenant_id='unknown': ${countUnknown.rows[0].count}`);

    if (countUnknown.rows[0].count > 0) {
      console.log('Deleting facturas with tenant_id=unknown...');
      const result1 = await client.query("DELETE FROM facturas WHERE tenant_id = 'unknown'");
      console.log(`✅ Deleted ${result1.rowCount} facturas\n`);
    }

    // Luego, configurar para ver facturas con tenant 'grupomast'
    await client.query("SET app.tenant_id = 'grupomast'");

    const countGrupomast = await client.query("SELECT COUNT(*) as count FROM facturas WHERE tenant_id = 'grupomast'");
    console.log(`Facturas with tenant_id='grupomast': ${countGrupomast.rows[0].count}`);

    if (countGrupomast.rows[0].count > 0) {
      console.log('Deleting facturas with tenant_id=grupomast...');
      const result2 = await client.query("DELETE FROM facturas WHERE tenant_id = 'grupomast'");
      console.log(`✅ Deleted ${result2.rowCount} facturas\n`);
    }

    // Verificar que esté vacío
    const finalCount = await client.query("SELECT COUNT(*) as count FROM facturas");
    console.log(`Total facturas remaining: ${finalCount.rows[0].count}`);

    if (finalCount.rows[0].count === 0) {
      console.log('\n✅ All facturas deleted successfully!');
    } else {
      console.log('\n⚠️  Warning: Some facturas still remain');
    }

    await client.end();
  } catch (err) {
    console.error('✗ Error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

cleanFacturas();
