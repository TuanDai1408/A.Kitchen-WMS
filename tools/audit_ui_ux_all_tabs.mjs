import { chromium } from 'playwright-core';
import fs from 'fs';

const possiblePaths = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];
const executablePath = possiblePaths.find(p => fs.existsSync(p));

const TABS = [
  'wh-dashboard', 'fnb-stock', 'fnb-counts', 'fnb-receipts',
  'fnb-kitchen-issue', 'fnb-waste', 'wh-stock',
  'portal-voucher', 'portal-search', 'portal-order',
  'portal-history', 'portal-kiemke', 'user-matrix'
];

async function auditViewport(browser, name, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  await page.addInitScript(() => {
    localStorage.setItem('orbit_user', JSON.stringify({
      email: 'trantuandai2508@gmail.com',
      full_name: 'Trần Tuấn Đại',
      role: 'ADMIN',
      role_code: 'ADMIN',
      assignedSite: 'K001',
      status: 'ACTIVE'
    }));
    localStorage.setItem('orbit_user_site', 'K001');
  });

  await page.goto('http://127.0.0.1:8787', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const results = [];
  for (const tab of TABS) {
    await page.evaluate((t) => window.switchTab && window.switchTab(t), tab);
    await page.waitForTimeout(350);
    const metrics = await page.evaluate(() => {
      const docEl = document.documentElement;
      const body = document.body;
      return {
        innerW: window.innerWidth,
        scrollW: Math.max(docEl.scrollWidth, body.scrollWidth),
        overflowX: Math.max(docEl.scrollWidth, body.scrollWidth) > window.innerWidth + 1
      };
    });
    if (metrics.overflowX) {
      results.push({ tab, ...metrics });
    }
  }

  console.log(`\n=== ${name} (${viewport.width}x${viewport.height}) ===`);
  console.log('Page errors:', errors.length ? errors : 'None');
  console.log('Tabs with horizontal overflow:', results.length ? results : 'None');
  await context.close();
}

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath });
  await auditViewport(browser, 'DESKTOP', { width: 1440, height: 900 });
  await auditViewport(browser, 'MOBILE', { width: 390, height: 844 });
  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
