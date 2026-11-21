import db from '../src/db/index.js';

const mockEnvPg = {
  DB_BACKEND: 'supabase',
  DATABASE_URL: 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres',
};

async function runTests() {
  console.log("1. Testing isPg...");
  if (!db.isPg(mockEnvPg)) throw new Error("Expected isPg to be true");
  console.log("   ✔ isPg OK");

  console.log("2. Testing translatePlaceholders...");
  const translated = db.translatePlaceholders("SELECT * FROM tbl WHERE a = ? AND b = ?");
  if (translated !== "SELECT * FROM tbl WHERE a = $1 AND b = $2") {
    throw new Error(`Unexpected translated string: ${translated}`);
  }
  console.log("   ✔ translatePlaceholders OK");

  console.log("3. Testing query against Supabase wms.app_roles...");
  const { rows } = await db.query(mockEnvPg, "SELECT role_code, role_name FROM app_roles ORDER BY role_code");
  console.log(`   ✔ query OK, retrieved ${rows.length} roles:`, rows.map(r => r.role_code));

  console.log("4. Testing queryOne...");
  const adminRole = await db.queryOne(mockEnvPg, "SELECT * FROM app_roles WHERE role_code = ?", ["ADMIN"]);
  if (!adminRole || adminRole.role_code !== 'ADMIN') throw new Error("Failed to query ADMIN role");
  console.log("   ✔ queryOne OK:", adminRole.role_name);

  console.log("5. Testing withTransaction...");
  await db.withTransaction(mockEnvPg, async (tx) => {
    const r = await tx.queryOne("SELECT count(*) as cnt FROM app_roles");
    console.log("   ✔ Transaction query count:", r.cnt);
  });

  console.log("\n ALL ADAPTER TESTS PASSED!");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
