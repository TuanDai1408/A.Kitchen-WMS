import { chromium } from 'playwright-core';
import fs from 'fs';

const possiblePaths = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];
const executablePath = possiblePaths.find(p => fs.existsSync(p));

async function main() {
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const logs = [];
  const errors = [];
  const failedRequests = [];

  page.on('console', msg => {
    logs.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push(err.message + '\n' + err.stack);
    console.log('PAGE UNCAUGHT ERROR:', err.message, err.stack);
  });

  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), failure: req.failure() });
    console.log('REQUEST FAILED:', req.url(), req.failure());
  });

  page.on('response', res => {
    if (res.status() >= 400) {
      console.log('HTTP ERROR RESPONSE:', res.status(), res.url());
    }
  });

  console.log('Navigating to http://localhost:8787 ...');
  await page.goto('http://localhost:8787', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(4000);

  // Check state in page
  const pageState = await page.evaluate(() => {
    return {
      activeTab: document.querySelector('.tab-content:not(.hidden)')?.id,
      tableRows: document.querySelectorAll('#portalSearchTableBody tr')?.length,
      vouchersData: typeof window.vouchersData !== 'undefined' ? (Array.isArray(window.vouchersData) ? window.vouchersData.length : typeof window.vouchersData) : 'undefined',
      state: typeof window.state !== 'undefined' ? Object.keys(window.state) : 'undefined',
      activeTabGlobal: window.currentTab || window.activeTab
    };
  });
  console.log('Page State:', JSON.stringify(pageState, null, 2));

  console.log('Total console logs:', logs.length);
  console.log('Total page errors:', errors.length);
  console.log('Total failed requests:', failedRequests.length);

  await browser.close();
}

main().catch(console.error);
