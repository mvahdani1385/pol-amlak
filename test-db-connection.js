const { Client } = require('pg');

async function testConnection(connectionString, name) {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    const result = await client.query('SELECT 1 as test');
    if (result.rows[0].test === 1) {
      console.log(`✅ ${name}: Connected successfully`);
    }
    await client.end();
  } catch (error) {
    console.log(`❌ ${name}: Failed - ${error.message}`);
  }
}

// دیتابیس لیارا
const liaraUrl = "postgresql://root:hTRs6bxFpOsXrdXhkco8yq7H@rainier.liara.cloud:30924/postgres";

// دیتابیس Neon
const neonUrl = "postgresql://neondb_owner:npg_goLjQhbmSi32@ep-long-morning-alwuo620-pooler.c-3.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

console.log("Testing connections...\n");
testConnection(liaraUrl, "Liara DB (Old)");
testConnection(neonUrl, "Neon DB (New)");