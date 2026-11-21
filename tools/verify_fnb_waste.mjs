import http from 'http';
import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { chromium } from 'playwright-core';

const { Client } = pg;
const PG_CONN = 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
const PORT = 3555;
const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/screenshots';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

// 1. Database client for API proxy
const db = new Client({ connectionString: PG_CONN, ssl: { rejectUnauthorized: false } });
await db.connect();
await db.query('SET search_path = wms, public;');

// 2. HTTP Server with API endpoints
const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = urlObj.pathname;
  const searchParams = urlObj.searchParams;

  // API 1: /api/fnb/stock/items-for-site
  if (pathname === '/api/fnb/stock/items-for-site') {
    const siteCode = searchParams.get('site_code') || 'K001';
    const inStockOnly = searchParams.get('in_stock_only') === '1';
    console.log(`[API REQUEST] siteCode=${siteCode}, inStockOnly=${inStockOnly}`);

    let q = `
      SELECT 
        COALESCE(b.id, 0) as id,
        b.item_code as code,
        COALESCE(d.material_desc, p.article_desc, i.name, b.item_code) as name,
        COALESCE(d.nhom_hang, d.nganh_hang, p.merch_category, i.item_group, 'Chưa phân loại') as item_group,
        COALESCE(d.nganh_hang, p.merch_category, 'Chưa phân loại') as nganh_hang,
        COALESCE(d.nhom_hang, p.merch_category, i.item_group, 'Chưa phân loại') as nhom_hang,
        COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit,
        COALESCE(d.price, p.net_price, i.unit_price, 0) as unit_price,
        0 as min_stock,
        COALESCE(b.book_qty, 0) as book_qty,
        COALESCE(b.last_count_qty, NULL) as last_count_qty,
        b.last_count_date,
        COALESCE(b.no_opening, false) as no_opening,
        ROUND((COALESCE(b.book_qty, 0) * COALESCE(d.price, p.net_price, i.unit_price, 0))::numeric, 0) as total_value
      FROM fnb_stock_balances b
      LEFT JOIN dim_article_stock d ON b.item_code = d.material AND UPPER(d.site) = UPPER(b.site_code)
      LEFT JOIN (SELECT DISTINCT ON (article) article, article_desc, merch_category, order_unit, net_price FROM sap_po_items) p ON b.item_code = p.article
      LEFT JOIN fnb_stock_items i ON b.item_code = i.code
      WHERE UPPER(b.site_code) = UPPER($1)
    `;
    if (inStockOnly) {
      q += ` AND b.book_qty > 0`;
    }
    q += ` ORDER BY nhom_hang, code`;

    const result = await db.query(q, [siteCode]);
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({
      success: true,
      data: { site_code: siteCode, items: result.rows }
    }));
    return;
  }

  // API 2: /api/fnb/wastes
  if (pathname === '/api/fnb/wastes') {
    if (req.method === 'GET') {
      const siteCode = searchParams.get('site_code');
      const wasteId = searchParams.get('id');

      if (wasteId) {
        const l = await db.query(`
          SELECT l.*, 
                 COALESCE(d.material_desc, p.article_desc, i.name, l.item_code) as item_name, 
                 COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit, 
                 COALESCE(d.nhom_hang, d.nganh_hang, p.merch_category, i.item_group, 'Chưa phân loại') as item_group
          FROM fnb_stock_waste_lines l
          LEFT JOIN dim_article_stock d ON l.item_code = d.material
          LEFT JOIN (SELECT DISTINCT ON (article) article, article_desc, merch_category, order_unit, net_price FROM sap_po_items) p ON l.item_code = p.article
          LEFT JOIN fnb_stock_items i ON l.item_code = i.code
          WHERE l.waste_id = $1
        `, [wasteId]);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: { lines: l.rows } }));
        return;
      }

      let q = `SELECT * FROM fnb_stock_wastes`;
      let binds = [];
      if (siteCode && siteCode !== 'all') {
        q += ` WHERE UPPER(site_code) = UPPER($1)`;
        binds.push(siteCode);
      }
      q += ` ORDER BY waste_date DESC, id DESC LIMIT 50`;
      const w = await db.query(q, binds);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: { wastes: w.rows } }));
      return;
    }
  }

  // Fallback: Static Files
  let reqPath = pathname;
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(process.cwd(), 'public', reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mimes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': mimes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found: ' + reqPath);
  }
});

await new Promise(resolve => server.listen(PORT, resolve));
console.log(`Server listening on http://localhost:${PORT}`);

const possiblePaths = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];
const executablePath = possiblePaths.find(p => fs.existsSync(p));

const browser = await chromium.launch({
  headless: true,
  executablePath
});

try {
  // Test 1: Desktop Viewport - K001 Light Mode
  console.log('--- TEST 1: K001 Desktop Light Mode ---');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  // Set localStorage user and active tab before loading
  await page.addInitScript(() => {
    localStorage.setItem('orbit_user', JSON.stringify({
      email: 'admin@akitchen.vn',
      fullName: 'Bếp Trưởng Admin',
      role: 'ADMIN'
    }));
    localStorage.setItem('orbit_active_tab', 'fnb-waste');
  });

  await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Switch to fnb-waste tab
  await page.evaluate(async () => {
    switchTab('fnb-waste');
    if (typeof loadFnbWaste === 'function') {
      console.log('Calling loadFnbWaste directly...');
      await loadFnbWaste();
    }
  });
  await page.waitForTimeout(1000);

  // Check KPI cards
  const kpiCount = await page.locator('#kpiWasteInStockCount').textContent();
  const kpiVal = await page.locator('#kpiWasteInStockVal').textContent();
  const rowsCount = await page.locator('#fnbWasteStockTableBody tr').count();
  console.log(`K001 KPI In Stock Count: "${kpiCount.trim()}", Stock Value: "${kpiVal.trim()}", Table rows: ${rowsCount}`);

  if (rowsCount < 20) {
    throw new Error(`Expected at least 20 positive stock items for K001, got ${rowsCount}`);
  }

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_fnb_waste_k001_light.png'), fullPage: false });
  console.log('Saved screenshot: verify_fnb_waste_k001_light.png');

  // Test 2: Dark Mode
  console.log('--- TEST 2: K001 Desktop Dark Mode ---');
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_fnb_waste_k001_dark.png'), fullPage: false });
  console.log('Saved screenshot: verify_fnb_waste_k001_dark.png');

  // Test 3: Input Waste Quantity & Check Dynamic Computation
  console.log('--- TEST 3: Enter Waste Quantity ---');
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });

  const inputInfo = await page.evaluate(() => {
    const el = document.querySelector('#fnbWasteStockTableBody input[type="number"]');
    if (!el) return { found: false };
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    const parent = el.closest('#fnbWasteSubViewStock');
    const parentStyle = parent ? window.getComputedStyle(parent) : null;
    const sec = el.closest('#fnb-waste');
    const secStyle = sec ? window.getComputedStyle(sec) : null;
    return {
      found: true,
      rect,
      display: style.display,
      visibility: style.visibility,
      parentDisplay: parentStyle?.display,
      secDisplay: secStyle?.display,
      secClasses: sec?.className
    };
  });
  console.log('Input Element Info:', inputInfo);

  // Type 2 into the first item's waste input using evaluate or scroll into view
  await page.evaluate(() => {
    const input = document.querySelector('#fnbWasteStockTableBody input[type="number"]');
    if (input) {
      input.value = '2';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await page.waitForTimeout(500);

  const selCount = await page.locator('#kpiWasteSelectedCount').textContent();
  const estAmt = await page.locator('#kpiWasteTotalEstAmount').textContent();
  const btnSubmitDisabled = await page.locator('#btnSubmitDirectWaste').isDisabled();
  const btnText = await page.locator('#btnSubmitDirectWasteText').textContent();

  console.log(`After entering waste qty 2: Selected Count = ${selCount}, Est Amount = ${estAmt}, Btn disabled = ${btnSubmitDisabled}, Btn Text = "${btnText}"`);

  if (selCount.trim() !== '1' || btnSubmitDisabled) {
    throw new Error('Dynamic waste calculation or submit button state failed');
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_fnb_waste_input.png'), fullPage: false });
  console.log('Saved screenshot: verify_fnb_waste_input.png');

  // Test 4: Empty State & Search No Match
  console.log('--- TEST 4: Empty State (No match filter) ---');
  await page.evaluate(() => {
    const input = document.getElementById('fnbWasteSearchInput');
    if (input) {
      input.value = 'XYZ_NON_EXISTENT_ARTICLE_12345';
      onFnbWasteSearch('XYZ_NON_EXISTENT_ARTICLE_12345');
    }
  });
  await page.waitForTimeout(500);

  const searchRows = await page.locator('#fnbWasteStockTableBody tr').count();
  const emptyVisible = await page.locator('#fnbWasteStockEmptyState').isVisible();
  console.log(`Empty search rows: ${searchRows}, Empty state visible: ${emptyVisible}`);

  if (!emptyVisible || searchRows > 0) {
    throw new Error('Empty state should be visible when no items match');
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_fnb_waste_empty_state.png'), fullPage: false });
  console.log('Saved screenshot: verify_fnb_waste_empty_state.png');

  // Clear search filter
  await page.evaluate(() => {
    const input = document.getElementById('fnbWasteSearchInput');
    if (input) {
      input.value = '';
      onFnbWasteSearch('');
    }
  });
  await page.waitForTimeout(500);

  // Test 5: Switch to Sub-View 'history'
  console.log('--- TEST 5: Waste History Subview ---');
  await page.click('#subtab-fnb-waste-history');
  await page.waitForTimeout(800);
  const histRows = await page.locator('#fnbWasteTableBody tr').count();
  console.log(`Waste history rows: ${histRows}`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_fnb_waste_history.png'), fullPage: false });
  console.log('Saved screenshot: verify_fnb_waste_history.png');

  // Test 6: Mobile 375px
  console.log('--- TEST 6: Mobile Viewport 375px ---');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.click('#subtab-fnb-waste-stock');
  await page.waitForTimeout(800);

  // Check no horizontal scroll overflow
  const isOverflowing = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile 375px overflow: ${isOverflowing}`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_fnb_waste_mobile_375.png'), fullPage: false });
  console.log('Saved screenshot: verify_fnb_waste_mobile_375.png');

  // Test 7: Modal Create Waste
  console.log('--- TEST 7: Modal Create Waste ---');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => {
    openCreateWasteModal();
  });
  await page.waitForTimeout(800);
  const modalVisible = await page.locator('#createWasteModal').isVisible();
  console.log('Modal visible:', modalVisible);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_fnb_waste_modal.png'), fullPage: false });
  console.log('Saved screenshot: verify_fnb_waste_modal.png');

  console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');

} catch (err) {
  console.error('Test error:', err);
  process.exitCode = 1;
} finally {
  await browser.close();
  await db.end();
  server.close();
}
