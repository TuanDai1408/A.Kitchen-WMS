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

  page.on('console', msg => {
    logs.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push(err.message);
    console.log('PAGE ERROR:', err.message);
  });

  // Set fake logged in user before load
  await page.addInitScript(() => {
    const adminUser = {
      email: 'admin@akitchen.vn',
      name: 'Admin Test',
      role: 'ADMIN',
      roleName: 'Quản trị viên toàn hệ thống',
      site: 'K001',
      siteName: 'Bếp Ăn ĐH Hùng Vương',
      permissions: ['*']
    };
    localStorage.setItem('orbit_current_user', JSON.stringify(adminUser));
    localStorage.setItem('orbit_user_site', 'K001');
    localStorage.setItem('orbit_user_site_name', 'Bếp Ăn ĐH Hùng Vương');
  });

  console.log('Navigating to http://localhost:8787 ...');
  await page.goto('http://localhost:8787', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Check state
  const state = await page.evaluate(async () => {
    // Test clicking tabs
    return {
      user: window.gCurrentUser?.email,
      sitesCount: window.App?.sites?.length,
      currentBranch: window.App?.currentBranch,
      vouchersCount: window.vouchersData?.length
    };
  });
  console.log('App state after init:', state);

  // Test loading portal-search
  console.log('Testing searchVouchers()...');
  const searchResult = await page.evaluate(async () => {
    try {
      if (typeof window.searchVouchers === 'function') {
        await window.searchVouchers();
        const rows = document.querySelectorAll('#scTableBody tr')?.length;
        return { success: true, rows };
      }
      return { success: false, reason: 'searchVouchers not a function' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  console.log('searchVouchers result:', searchResult);

  // Test loading wh-stock (FEFO)
  console.log('Testing loadStockFEFO()...');
  const fefoResult = await page.evaluate(async () => {
    try {
      if (typeof window.loadStockFEFO === 'function') {
        await window.loadStockFEFO();
        const rows = document.querySelectorAll('#fefoBody tr')?.length;
        return { success: true, rows };
      }
      return { success: false, reason: 'loadStockFEFO not a function' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  console.log('loadStockFEFO result:', fefoResult);

  // Test loading wh-leadtime
  console.log('Testing loadLeadTime()...');
  const ltResult = await page.evaluate(async () => {
    try {
      if (typeof window.loadLeadTime === 'function') {
        await window.loadLeadTime();
        const rows = document.querySelectorAll('#leadTimeBody tr')?.length;
        return { success: true, rows };
      }
      return { success: false, reason: 'loadLeadTime not a function' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  console.log('loadLeadTime result:', ltResult);

  // Test loading fnb-counts
  console.log('Testing loadFnbCounts()...');
  const countResult = await page.evaluate(async () => {
    try {
      if (typeof window.loadFnbCounts === 'function') {
        await window.loadFnbCounts();
        const rows = document.querySelectorAll('#fnbCountTableBody tr')?.length;
        return { success: true, rows };
      }
      return { success: false, reason: 'loadFnbCounts not a function' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  console.log('loadFnbCounts result:', countResult);

  console.log('Total page errors:', errors.length);
  await browser.close();
}

main().catch(console.error);
