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

  await page.evaluate(() => window.switchTab && window.switchTab('user-matrix'));
  await page.waitForTimeout(1200);

  await page.evaluate(() => window.openEditUserModal && window.openEditUserModal('longchaulabeling2@gmail.com'));
  await page.waitForSelector('#editUserModal:not(.hidden)', { timeout: 8000 });
  await page.waitForTimeout(500);

  const rowCount = await page.evaluate(() => document.querySelectorAll('#editUserGranularTableBody tr').length);
  console.log('Granular permission rows rendered:', rowCount);
  if (rowCount < 10) throw new Error('Expected at least 10 granular permission rows, got ' + rowCount);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'edit_user_granular_permissions_modal.png') });
  console.log('✅ Granular permission modal verified!');
  await browser.close();
}

run().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
