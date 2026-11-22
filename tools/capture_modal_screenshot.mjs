import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/screenshots';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function capture() {
  const browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem('orbit_current_user', JSON.stringify({
      email: 'admin@akitchen.vn',
      name: 'Admin Test',
      role: 'ADMIN',
      site: 'K001'
    }));
  });

  await page.goto('http://localhost:8787');
  await page.waitForTimeout(2500);

  // 1. Capture Voucher Detail Modal Light
  await page.evaluate(async () => {
    document.documentElement.classList.remove('dark');
    if (typeof window.viewVoucherDetail === 'function') {
      await window.viewVoucherDetail('CT-20261117-012625-K001');
    }
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'modal_voucher_detail_light.png') });
  console.log('Saved modal_voucher_detail_light.png');

  // 2. Capture Voucher Detail Modal Dark
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'modal_voucher_detail_dark.png') });
  console.log('Saved modal_voucher_detail_dark.png');

  // Close General Modal and Open Site Selector
  await page.evaluate(() => {
    if (typeof window.closeGeneralModal === 'function') window.closeGeneralModal();
    if (typeof window.openSiteSelectorModal === 'function') window.openSiteSelectorModal();
    document.documentElement.classList.remove('dark');
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'modal_site_selector_light.png') });
  console.log('Saved modal_site_selector_light.png');

  await browser.close();
}

capture().catch(console.error);
