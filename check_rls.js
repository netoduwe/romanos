const { Client } = require('pg');

const connectionString = 'postgres://postgres.mdttowcgbicevqlcnhit:EVLdH2EDn5SOaYir@aws-1-sa-east-1.pooler.supabase.com:5432/postgres';

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await client.connect();
    
    // Check policies
    const res = await client.query(`
      SELECT polname, polcmd, polroles, polqual, polwithcheck 
      FROM pg_policy 
      WHERE polrelid = 'romanos_data'::regclass;
    `);
    
    console.log(JSON.stringify(res.rows, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
