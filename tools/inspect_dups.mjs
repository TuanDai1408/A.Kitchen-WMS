import db from '../src/db/index.js';

const env = {
  DB_BACKEND: 'supabase',
  DATABASE_URL: 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres'
};

async function test() {
  const codes = ['3200000336', '3200000336.0', '3200001595', '3200001595.0'];
  const res = await db.query(env, `
    SELECT id, item_code, name, unit, unit_price, region 
    FROM wms.nvl_items 
    WHERE item_code = ANY($1)
    ORDER BY item_code
  `, [codes]);
  console.log(res.rows);
  process.exit(0);
}

test().catch(console.error);
