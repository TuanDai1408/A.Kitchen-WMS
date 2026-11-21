import db from '../src/db/index.js';

const env = {
  DB_BACKEND: 'supabase',
  DATABASE_URL: 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres'
};

async function test() {
  const tables = [
    'don_hang',
    'nvl_items',
    'kiemke_tonkho',
    'dinh_muc',
    'dim_article_stock',
    'fnb_stock_items',
    'fnb_stock_balances',
    'fnb_stock_count_lines',
    'fnb_stock_receipt_lines',
    'fnb_stock_waste_lines',
    'purchase_order_items',
    'inventory_batches',
    'items'
  ];

  for (const t of tables) {
    const cols = await db.query(env, `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'wms' AND table_name = '${t}'
        AND (column_name LIKE '%item%' OR column_name LIKE '%code%' OR column_name LIKE '%material%' OR column_name LIKE '%sku%')
    `);
    for (const c of cols.rows) {
      const colName = c.column_name;
      const countRes = await db.query(env, `
        SELECT count(*) as cnt 
        FROM wms.${t} 
        WHERE ${colName}::text LIKE '%.0'
      `);
      const cnt = Number(countRes.rows[0].cnt);
      if (cnt > 0) {
        console.log(`Table ${t}.${colName}: ${cnt} rows ending with .0`);
      }
    }
  }
  process.exit(0);
}

test().catch(console.error);
