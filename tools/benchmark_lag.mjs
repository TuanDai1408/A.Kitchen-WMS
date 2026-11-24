import { chromium } from 'playwright-core';
import fs from 'fs';

const possiblePaths = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];
const executablePath = possiblePaths.find(p => fs.existsSync(p));

const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:8787', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);

// Benchmark tab switching
console.log('=== TAB SWITCH BENCHMARK ===');
const tabs = [
  'fnb-chain', 'fnb-pl', 'fnb-pos', 'wh-dashboard', 'fnb-counts',
  'fnb-receipts', 'fnb-waste', 'wh-stock', 'wh-reorder', 'wh-leadtime',
  'wh-posap', 'portal-voucher', 'portal-search', 'portal-order',
  'portal-history', 'portal-baocao', 'portal-kiemke', 'user-matrix'
];

for (const t of tabs) {
  // Give 150ms settle time before user clicks next tab
  await page.waitForTimeout(150);
  const result = await page.evaluate(async (tabName) => {
    const t0 = performance.now();
    switchTab(tabName);
    const switchSync = performance.now() - t0;
    // wait for next paint
    await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
    const totalTime = performance.now() - t0;
    return { switchSync, totalTime };
  }, t);
  console.log(`Tab [${t.padEnd(15)}] Sync: ${result.switchSync.toFixed(1).padStart(5)}ms | Frame Paint: ${result.totalTime.toFixed(1).padStart(5)}ms`);
}

// Benchmark filtering in portal-order
console.log('\n=== FILTER BENCHMARK ===');
await page.evaluate(() => switchTab('portal-order'));
await page.waitForTimeout(400);

const orderFilter = await page.evaluate(() => {
  const t0 = performance.now();
  if (typeof filterItems === 'function') filterItems();
  return performance.now() - t0;
});
console.log(`portal-order filterItems(): ${orderFilter.toFixed(1)}ms`);

// Benchmark filtering in wh-stock
await page.evaluate(() => switchTab('wh-stock'));
await page.waitForTimeout(400);
const fefoFilter = await page.evaluate(() => {
  const t0 = performance.now();
  if (typeof filterFefoLive === 'function') filterFefoLive();
  return performance.now() - t0;
});
console.log(`wh-stock filterFefoLive(): ${fefoFilter.toFixed(1)}ms`);

// Benchmark filtering in fnb-receipts
await page.evaluate(() => switchTab('fnb-receipts'));
await page.waitForTimeout(400);
const receiptsFilter = await page.evaluate(() => {
  const t0 = performance.now();
  if (typeof onFnbPoSearchInput === 'function') onFnbPoSearchInput();
  return performance.now() - t0;
});
console.log(`fnb-receipts onFnbPoSearchInput(): ${receiptsFilter.toFixed(1)}ms`);

// Benchmark filtering in user-matrix
await page.evaluate(() => switchTab('user-matrix'));
await page.waitForTimeout(400);
const rbacFilter = await page.evaluate(() => {
  const t0 = performance.now();
  if (typeof filterUserMatrix === 'function') filterUserMatrix();
  return performance.now() - t0;
});
console.log(`user-matrix filterUserMatrix(): ${rbacFilter.toFixed(1)}ms`);

await browser.close();
