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
  console.log('🚀 Starting Cancel Receipt Modal verification...');
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
  await page.waitForTimeout(1000);

  // Fetch received orders list to pick a real receipt for preview (read-only, no actual cancel!)
  const ordersResp = await page.evaluate(async () => {
    const r = await fetch('/api/wh/received-orders?site=K001&no-cache=1');
    return await r.json();
  });

  const firstOrder = ordersResp?.data?.orders?.[0];
  console.log('Sample received order:', firstOrder ? { id: firstOrder.id, po: firstOrder.po_number, code: firstOrder.receipt_code } : 'none');

  // Switch to wh-stock / received orders view if available, then open confirmCancelReceivedOrder
  await page.evaluate((o) => {
    if (o) {
      window.confirmCancelReceivedOrder(String(o.id || ''), o.po_number || '', o.receipt_code || '', Number(o.total_amount) || 0);
    } else {
      window.confirmCancelReceivedOrder('999999', 'PO-DEMO-001', 'PNK-DEMO-001', 1500000);
    }
  }, firstOrder);

  await page.waitForSelector('#modalConfirmCancelReceipt:not(.hidden)', { timeout: 10000 });
  await page.waitForTimeout(1200);

  const modalContent = await page.textContent('#modalConfirmCancelReceipt');
  if (!modalContent || !modalContent.includes('Xác nhận Hủy nhập kho')) {
    throw new Error('Modal content missing expected title');
  }

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'cancel_receipt_confirm_modal.png') });
  console.log('✅ Captured cancel_receipt_confirm_modal.png');

  await page.evaluate(() => window.closeConfirmCancelReceiptModal && window.closeConfirmCancelReceiptModal());
  console.log('✅ ALL CANCEL RECEIPT MODAL TESTS PASSED!');
  await browser.close();
}

run().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
