import pg from 'pg';
const { Pool } = pg;

const connectionString = 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const client = await pool.connect();
  try {
    console.log('Connected to Supabase PostgreSQL. Beginning transaction...');
    await client.query('BEGIN;');
    await client.query('SET search_path TO wms, public;');

    // 1. Delete test chung_tu
    console.log('1. Deleting test vouchers/chung_tu...');
    const ctFileRes = await client.query(`
      DELETE FROM chung_tu_file 
      WHERE voucher_code IN ('CT-20261117-012453-K001', 'CT-20261117-012625-K001');
    `);
    console.log(`   Deleted ${ctFileRes.rowCount} chung_tu_file records.`);

    const ctRes = await client.query(`
      DELETE FROM chung_tu 
      WHERE voucher_code IN ('CT-20261117-012453-K001', 'CT-20261117-012625-K001')
         OR supplier_name ILIKE '%TEST%' 
         OR note ILIKE '%TEST%'
         OR created_by ILIKE '%TEST%';
    `);
    console.log(`   Deleted ${ctRes.rowCount} test chung_tu records.`);

    // 2. Delete test stock count lines and count headers
    console.log('2. Deleting test stock counts & lines...');
    const clRes = await client.query(`
      DELETE FROM fnb_stock_count_lines 
      WHERE item_code ~ '^[A-Z]{2}-\\d+' OR item_code ILIKE '%TEST%';
    `);
    console.log(`   Deleted ${clRes.rowCount} test count lines.`);

    const cRes = await client.query(`
      DELETE FROM fnb_stock_counts 
      WHERE id IN ('1', '2', '3') 
         OR count_code ILIKE '%TEST%' 
         OR notes ILIKE '%TEST%'
         OR id NOT IN (SELECT DISTINCT count_id FROM fnb_stock_count_lines);
    `);
    console.log(`   Deleted ${cRes.rowCount} test count headers.`);

    // 3. Delete test stock waste lines and waste headers
    console.log('3. Deleting test stock wastes & lines...');
    const wlRes = await client.query(`
      DELETE FROM fnb_stock_waste_lines 
      WHERE item_code ~ '^[A-Z]{2}-\\d+' OR item_code ILIKE '%TEST%';
    `);
    console.log(`   Deleted ${wlRes.rowCount} test waste lines.`);

    const wRes = await client.query(`
      DELETE FROM fnb_stock_wastes 
      WHERE id IN ('1', '2', '3') 
         OR waste_code ILIKE '%TEST%' 
         OR notes ILIKE '%TEST%'
         OR id NOT IN (SELECT DISTINCT waste_id FROM fnb_stock_waste_lines);
    `);
    console.log(`   Deleted ${wRes.rowCount} test waste headers.`);

    // 4. Delete test stock receipt lines and receipt headers
    console.log('4. Deleting test stock receipts & lines...');
    const rlRes = await client.query(`
      DELETE FROM fnb_stock_receipt_lines 
      WHERE item_code ~ '^[A-Z]{2}-\\d+' OR item_code ILIKE '%TEST%';
    `);
    console.log(`   Deleted ${rlRes.rowCount} test receipt lines.`);

    const rRes = await client.query(`
      DELETE FROM fnb_stock_receipts 
      WHERE id IN ('1', '2', '3', '4') 
         OR receipt_code ILIKE '%TEST%' 
         OR supplier ILIKE '%TEST%' 
         OR notes ILIKE '%TEST%'
         OR id NOT IN (SELECT DISTINCT receipt_id FROM fnb_stock_receipt_lines);
    `);
    console.log(`   Deleted ${rRes.rowCount} test receipt headers.`);

    // 5. Delete test stock balances
    console.log('5. Deleting test stock balances...');
    const balRes = await client.query(`
      DELETE FROM fnb_stock_balances 
      WHERE item_code ~ '^[A-Z]{2}-\\d+' OR item_code ILIKE '%TEST%';
    `);
    console.log(`   Deleted ${balRes.rowCount} test stock balances.`);

    // 6. Delete test items in fnb_stock_items
    console.log('6. Deleting test items in fnb_stock_items...');
    const itemsRes = await client.query(`
      DELETE FROM fnb_stock_items 
      WHERE code ~ '^[A-Z]{2}-\\d+' OR code ILIKE '%TEST%' OR name ILIKE '%TEST%';
    `);
    console.log(`   Deleted ${itemsRes.rowCount} test items.`);

    // 7. Populate fnb_stock_items with real production items from dim_article_stock
    console.log('7. Populating fnb_stock_items from dim_article_stock...');
    const populateRes = await client.query(`
      INSERT INTO fnb_stock_items (id, code, name, item_group, unit, unit_price, min_stock, is_active, created_at)
      SELECT 
        1000 + ROW_NUMBER() OVER (ORDER BY material) as id,
        material as code,
        MAX(material_desc) as name,
        COALESCE(MAX(nhom_hang), 'HANG_HOA') as item_group,
        COALESCE(MAX(entry_unit), 'Phần') as unit,
        COALESCE(MAX(price), 0) as unit_price,
        10 as min_stock,
        true as is_active,
        NOW() as created_at
      FROM dim_article_stock
      WHERE material IS NOT NULL AND material != ''
      GROUP BY material
      ON CONFLICT (code) DO UPDATE 
      SET name = EXCLUDED.name,
          item_group = EXCLUDED.item_group,
          unit = EXCLUDED.unit,
          unit_price = EXCLUDED.unit_price;
    `);
    console.log(`   Populated ${populateRes.rowCount} real items into fnb_stock_items.`);

    await client.query('COMMIT;');
    console.log('Transaction committed successfully!');

    // 8. Verification query
    console.log('\n--- VERIFICATION AFTER PURGE ---');
    const remainingTestRes = await client.query(`
      SELECT 'fnb_stock_items' as tbl, COUNT(*) as test_count FROM fnb_stock_items WHERE code ~ '^[A-Z]{2}-\\d+'
      UNION ALL
      SELECT 'fnb_stock_balances' as tbl, COUNT(*) as test_count FROM fnb_stock_balances WHERE item_code ~ '^[A-Z]{2}-\\d+'
      UNION ALL
      SELECT 'fnb_stock_receipt_lines' as tbl, COUNT(*) as test_count FROM fnb_stock_receipt_lines WHERE item_code ~ '^[A-Z]{2}-\\d+'
      UNION ALL
      SELECT 'fnb_stock_count_lines' as tbl, COUNT(*) as test_count FROM fnb_stock_count_lines WHERE item_code ~ '^[A-Z]{2}-\\d+'
      UNION ALL
      SELECT 'fnb_stock_waste_lines' as tbl, COUNT(*) as test_count FROM fnb_stock_waste_lines WHERE item_code ~ '^[A-Z]{2}-\\d+'
      UNION ALL
      SELECT 'chung_tu' as tbl, COUNT(*) as test_count FROM chung_tu WHERE supplier_name ILIKE '%TEST%' OR note ILIKE '%TEST%';
    `);
    console.table(remainingTestRes.rows);

    const totalRealItems = await client.query(`SELECT COUNT(*) as real_items_count FROM fnb_stock_items;`);
    console.log('Total real items in fnb_stock_items:', totalRealItems.rows[0].real_items_count);

    const totalRealBalances = await client.query(`SELECT COUNT(*) as real_balances_count FROM fnb_stock_balances;`);
    console.log('Total real balances in fnb_stock_balances:', totalRealBalances.rows[0].real_balances_count);

    const sampleBalances = await client.query(`
      SELECT b.site_code, b.item_code, i.name, b.book_qty 
      FROM fnb_stock_balances b
      LEFT JOIN fnb_stock_items i ON b.item_code = i.code
      LIMIT 10;
    `);
    console.log('\nSample active balances:');
    console.table(sampleBalances.rows);

  } catch (err) {
    await client.query('ROLLBACK;');
    console.error('Error during purge, rolled back:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
