import db from '../src/db/index.js';

const env = {
  DB_BACKEND: 'supabase',
  DATABASE_URL: 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres'
};

async function run() {
  console.log('--- STARTING UPDATE ITEM_CODE: REMOVE .0 IN SUPABASE POSTGRESQL ---');

  // 1. nvl_items
  const beforeNvl = await db.query(env, `SELECT count(*) as cnt FROM wms.nvl_items WHERE item_code LIKE '%.0'`);
  console.log(`nvl_items before: ${beforeNvl.rows[0].cnt} rows ending in .0`);

  const updateNvl = await db.query(env, `
    UPDATE wms.nvl_items 
    SET item_code = regexp_replace(item_code, '\\.0$', '') 
    WHERE item_code LIKE '%.0'
  `);
  console.log(`nvl_items updated: ${updateNvl.rowCount || 'done'}`);

  const afterNvl = await db.query(env, `SELECT count(*) as cnt FROM wms.nvl_items WHERE item_code LIKE '%.0'`);
  console.log(`nvl_items after: ${afterNvl.rows[0].cnt} rows ending in .0`);

  // 2. don_hang
  const beforeDh = await db.query(env, `SELECT count(*) as cnt FROM wms.don_hang WHERE item_code LIKE '%.0'`);
  console.log(`\ndon_hang before: ${beforeDh.rows[0].cnt} rows ending in .0`);

  const updateDh = await db.query(env, `
    UPDATE wms.don_hang 
    SET item_code = regexp_replace(item_code, '\\.0$', '') 
    WHERE item_code LIKE '%.0'
  `);
  console.log(`don_hang updated: ${updateDh.rowCount || 'done'}`);

  const afterDh = await db.query(env, `SELECT count(*) as cnt FROM wms.don_hang WHERE item_code LIKE '%.0'`);
  console.log(`don_hang after: ${afterDh.rows[0].cnt} rows ending in .0`);

  // 3. kiemke_tonkho
  const beforeKk = await db.query(env, `SELECT count(*) as cnt FROM wms.kiemke_tonkho WHERE item_code LIKE '%.0'`);
  console.log(`\nkiemke_tonkho before: ${beforeKk.rows[0].cnt} rows ending in .0`);

  const updateKk = await db.query(env, `
    UPDATE wms.kiemke_tonkho 
    SET item_code = regexp_replace(item_code, '\\.0$', '') 
    WHERE item_code LIKE '%.0'
  `);
  console.log(`kiemke_tonkho updated: ${updateKk.rowCount || 'done'}`);

  const afterKk = await db.query(env, `SELECT count(*) as cnt FROM wms.kiemke_tonkho WHERE item_code LIKE '%.0'`);
  console.log(`kiemke_tonkho after: ${afterKk.rows[0].cnt} rows ending in .0`);

  // 4. Also clean gl_account in kiemke_tonkho if any
  await db.query(env, `
    UPDATE wms.kiemke_tonkho 
    SET gl_account = regexp_replace(gl_account, '\\.0$', '') 
    WHERE gl_account LIKE '%.0'
  `);

  console.log('\n--- VERIFICATION OF SAMPLE CLEAN CODES ---');
  const sampleNvl = await db.query(env, `SELECT item_code, name FROM wms.nvl_items WHERE item_code IN ('3200000501', '3200001595', '3100001856') LIMIT 5`);
  console.log('Sample nvl_items:', sampleNvl.rows);

  const sampleDh = await db.query(env, `SELECT order_code, item_code, item_name FROM wms.don_hang WHERE item_code IN ('3200001060', '3200001393', '3200001062') LIMIT 5`);
  console.log('Sample don_hang:', sampleDh.rows);

  process.exit(0);
}

run().catch(console.error);
