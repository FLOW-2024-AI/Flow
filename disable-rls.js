const { Client } = require('pg');

async function disableRLS() {
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
    console.log('Connecting to database...');
    await client.connect();
    console.log('✓ Connected!\n');

    // Desactivar RLS en la tabla facturas
    console.log('Disabling Row Level Security on facturas table...');
    await client.query('ALTER TABLE facturas DISABLE ROW LEVEL SECURITY');
    console.log('✅ RLS disabled successfully!\n');

    // Verificar el estado
    const check = await client.query(`
      SELECT relname, relrowsecurity
      FROM pg_class
      WHERE relname = 'facturas'
    `);

    console.log('Current RLS status:');
    console.log(`  Table: ${check.rows[0].relname}`);
    console.log(`  RLS Enabled: ${check.rows[0].relrowsecurity}`);

    // Contar facturas sin RLS
    const count = await client.query('SELECT COUNT(*) as count FROM facturas');
    console.log(`\n✅ Total facturas visible: ${count.rows[0].count}`);

    await client.end();
  } catch (err) {
    console.error('✗ Error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

disableRLS();
