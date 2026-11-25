import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const possiblePaths = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];
const executablePath = possiblePaths.find(p => fs.existsSync(p));
const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17';

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    const adminUser = {
      email: 'trantuandai2508@gmail.com',
      full_name: 'Trần Tuấn Đại',
      role: 'ADMIN',
      role_code: 'ADMIN',
      assignedSite: 'K001',
      status: 'ACTIVE'
    };
    localStorage.setItem('orbit_user', JSON.stringify(adminUser));
    localStorage.setItem('orbit_user_site', 'K001');
  });

  await page.goto('http://127.0.0.1:8787', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  await page.evaluate(() => window.switchTab && window.switchTab('fnb-receipts'));
  await page.waitForTimeout(1200);

  const poSuppliers = await page.evaluate(() => {
    const sel = document.getElementById('fnbPoSupplierFilter');
    return sel ? Array.from(sel.options).map(o => o.value) : [];
  });
  console.log('PO supplier filter options:', poSuppliers);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'fnb_receipts_po_supplier_filter.png') });

  // Switch to History subview
  await page.evaluate(() => window.switchFnbReceiptSubView && window.switchFnbReceiptSubView('history'));
  await page.waitForTimeout(1200);

  const histSuppliers = await page.evaluate(() => {
    const sel = document.getElementById('fnbReceiptHistorySupplierFilter');
    return sel ? Array.from(sel.options).map(o => o.value) : [];
  });
  console.log('History supplier filter options:', histSuppliers);

  if (histSuppliers.length > 1) {
    await page.selectOption('#fnbReceiptHistorySupplierFilter', histSuppliers[1]);
    await page.waitForTimeout(300);
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'fnb_receipts_history_supplier_filter.png') });

  console.log('✅ Supplier filter verification passed!');
  await browser.close();
}

run().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
