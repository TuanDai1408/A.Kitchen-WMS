import db from '../src/db/index.js';

const env = {
  DB_BACKEND: 'supabase',
  DATABASE_URL: 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres'
};

async function main() {
  const colsRes = await db.query(env, `
    SELECT table_name, column_name 
    FROM information_schema.columns 
    WHERE table_schema = 'wms' 
      AND data_type IN ('text', 'character varying')
    ORDER BY table_name, column_name
  `);

  console.log(`Checking ${colsRes.rows.length} text columns in schema 'wms'...`);

  const results = [];
  for (const r of colsRes.rows) {
    try {
      const checkRes = await db.query(env, `
        SELECT COUNT(*) as cnt 
        FROM wms.${r.table_name} 
        WHERE ${r.column_name} LIKE '%.0'
      `);
      const cnt = Number(checkRes.rows[0]?.cnt || 0);
      if (cnt > 0) {
        const sample = await db.query(env, `
          SELECT DISTINCT ${r.column_name} as val 
          FROM wms.${r.table_name} 
          WHERE ${r.column_name} LIKE '%.0' 
          LIMIT 5
        `);
        console.log(`FOUND ${cnt} rows in ${r.table_name}.${r.column_name} ending in .0`);
        console.log(`   Sample:`, sample.rows.map(x => x.val));
        results.push({ table: r.table_name, column: r.column_name, count: cnt, sample: sample.rows.map(x => x.val) });
      }
    } catch (e) {
      // Ignore column errors
    }
  }

  console.log('\n--- Summary of Columns Ending in .0 ---');
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

main().catch(console.error);
