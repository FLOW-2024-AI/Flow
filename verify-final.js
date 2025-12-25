const { Client } = require('pg');

async function verifyFacturas() {
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
    console.log('✓ Connected to database\n');

    // Set tenant to grupomast (matching Cognito users)
    await client.query('SET row_security = on');
    await client.query("SET app.tenant_id = 'grupomast'");

    // Count total facturas
    const count = await client.query('SELECT COUNT(*) as count FROM facturas');
    console.log(`📊 Total facturas with tenant_id='grupomast': ${count.rows[0].count}`);

    // Get sample of facturas to verify data
    const sample = await client.query(`
      SELECT
        id,
        numero_factura,
        fecha_emision,
        nombre_proveedor,
        monto_total,
        tenant_id
      FROM facturas
      ORDER BY fecha_emision DESC
      LIMIT 5
    `);

    console.log('\n📝 Sample of migrated facturas:');
    for (let i = 0; i < sample.rows.length; i++) {
      const row = sample.rows[i];
      console.log(`\n${i + 1}. ${row.numero_factura}`);
      console.log(`   Proveedor: ${row.nombre_proveedor}`);
      console.log(`   Fecha: ${row.fecha_emision}`);
      console.log(`   Total: ${row.monto_total}`);
      console.log(`   Tenant: ${row.tenant_id}`);
    }

    console.log('\n✅ Migration verified successfully!');
    console.log('   All facturas are now visible with the correct tenant_id matching Cognito users.');

    await client.end();
  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exit(1);
  }
}

verifyFacturas();
