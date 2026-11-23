import { chromium } from 'playwright-core';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17';
const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function testTabs() {
  const browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.addInitScript(() => {
    const user = {
      email: 'admin@akitchen.vn',
      fullName: 'Tuấn Đại',
      role: 'ADMIN',
      roles: ['ADMIN'],
      assignedSite: 'K001',
      site: 'K001'
    };
    localStorage.setItem('orbit_user', JSON.stringify(user));
    localStorage.setItem('orbit_user_site', 'K001');
    localStorage.setItem('orbit_token', 'mock_jwt_token');
    localStorage.setItem('orbit_user_email', 'admin@akitchen.vn');
    sessionStorage.setItem('orbit_user', JSON.stringify(user));
  });

  await page.goto('http://localhost:8787', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Close login modal if open
  await page.evaluate(() => {
    const lm = document.getElementById('loginModal');
    if (lm) lm.classList.add('hidden');
    const bd = document.getElementById('loginBackdrop');
    if (bd) bd.classList.add('hidden');
  });

  const tabsToTest = ['wh-stock', 'fnb-counts', 'fnb-receipts', 'fnb-waste', 'portal-search'];

  for (const tab of tabsToTest) {
    console.log(`Testing tab: ${tab}...`);
    await page.evaluate((t) => {
      if (typeof switchTab === 'function') switchTab(t);
    }, tab);
    await page.waitForTimeout(1500);

    // Check if test codes appear in text
    const hasTestCodes = await page.evaluate(() => {
      const text = document.body.innerText;
      const testPatterns = ['HB-001', 'HB-002', 'HB-003', 'VT-001', 'VT-002', 'TH-001', 'NCC Test'];
      return testPatterns.filter(p => text.includes(p));
    });

    console.log(`  Tab ${tab} test code matches found:`, hasTestCodes);
    if (hasTestCodes.length > 0) {
      console.warn(`  WARNING: Found test codes in ${tab}:`, hasTestCodes);
    }

    const shotPath = `${ARTIFACT_DIR}/desktop_${tab}_verified.png`;
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`  Screenshot saved: ${shotPath}`);
  }

  // Also test mobile view
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1000);
  console.log('Testing mobile view for wh-stock and fnb-counts...');
  for (const tab of ['wh-stock', 'fnb-counts']) {
    await page.evaluate((t) => {
      if (typeof switchTab === 'function') switchTab(t);
    }, tab);
    await page.waitForTimeout(1500);
    const shotPath = `${ARTIFACT_DIR}/mobile_${tab}_verified.png`;
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`  Mobile screenshot saved: ${shotPath}`);
  }

  console.log('Console errors during run:', errors.filter(e => !e.includes('favicon') && !e.includes('accounts.google.com')));
  await browser.close();
}

testTabs().catch(err => {
  console.error(err);
  process.exit(1);
});
