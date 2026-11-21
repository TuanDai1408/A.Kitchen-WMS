import db from '../src/db/index.js';

const env = {
  DB_BACKEND: 'supabase',
  DATABASE_URL: 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres'
};

async function test() {
  // Check nvl_items
  const nvlDup = await db.query(env, `
    SELECT regexp_replace(item_code, '\\.0$', '') as clean_code, count(*) as cnt
    FROM wms.nvl_items
    GROUP BY regexp_replace(item_code, '\\.0$', '')
    HAVING count(*) > 1
  `);
  console.log('nvl_items duplicates if .0 stripped:', nvlDup.rows);

  // Check don_hang
  const dhSample = await db.query(env, `
    SELECT item_code FROM wms.don_hang WHERE item_code LIKE '%.0' LIMIT 5
  `);
  console.log('don_hang samples with .0:', dhSample.rows.map(x => x.item_code));

  // Check kiemke_tonkho
  const kkSample = await db.query(env, `
    SELECT item_code FROM wms.kiemke_tonkho WHERE item_code LIKE '%.0' LIMIT 5
  `);
  console.log('kiemke_tonkho samples with .0:', kkSample.rows.map(x => x.item_code));

  process.exit(0);
}

test().catch(console.error);
