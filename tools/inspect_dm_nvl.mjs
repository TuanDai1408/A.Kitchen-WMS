import db from '../src/db/index.js';

const env = {
  DB_BACKEND: 'supabase',
  DATABASE_URL: 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres'
};

async function test() {
  const dmSamples = await db.query(env, `
    SELECT DISTINCT item_code 
    FROM wms.dinh_muc 
    WHERE item_code ~ '^[0-9]+'
    LIMIT 10
  `);
  console.log('dinh_muc item_codes:', dmSamples.rows.map(x => x.item_code));

  const nvlSamples = await db.query(env, `
    SELECT DISTINCT item_code 
    FROM wms.nvl_items 
    WHERE item_code LIKE '%.0'
    LIMIT 10
  `);
  console.log('nvl_items item_codes with .0:', nvlSamples.rows.map(x => x.item_code));

  // Check matching if we strip .0
  const matchRes = await db.query(env, `
    SELECT COUNT(*) as match_cnt
    FROM wms.nvl_items nvl
    JOIN wms.dinh_muc dm ON dm.item_code = regexp_replace(nvl.item_code, '\\.0$', '')
    WHERE nvl.item_code LIKE '%.0'
  `);
  console.log('Matches between dinh_muc and nvl_items when stripping .0:', matchRes.rows[0].match_cnt);

  process.exit(0);
}

test().catch(console.error);
