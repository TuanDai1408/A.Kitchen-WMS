import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/screenshots';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

const possiblePaths = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];
const executablePath = possiblePaths.find(p => fs.existsSync(p));
console.log('Using browser executable:', executablePath);

async function capture() {
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const targets = [
    { name: 'baseline_portal_search_desktop_light.png', width: 1440, height: 900, dark: false },
    { name: 'baseline_portal_search_desktop_dark.png', width: 1440, height: 900, dark: true },
    { name: 'baseline_portal_search_mobile_light.png', width: 390, height: 844, dark: false },
    { name: 'baseline_portal_search_mobile_dark.png', width: 390, height: 844, dark: true }
  ];

  for (const t of targets) {
    const context = await browser.newContext({
      viewport: { width: t.width, height: t.height }
    });

    await context.addInitScript(({ dark }) => {
      localStorage.setItem('orbit_user', JSON.stringify({
        email: 'admin@akitchen.vn',
        fullName: 'Trần Văn Quản Trị',
        role: 'ADMIN',
        permissions: {}
      }));
      localStorage.setItem('orbit_user_site', 'ALL');
      if (dark) {
        localStorage.setItem('darkMode', 'true');
        localStorage.setItem('orbit_theme', 'dark');
      } else {
        localStorage.setItem('darkMode', 'false');
        localStorage.setItem('orbit_theme', 'light');
      }
    }, { dark: t.dark });

    const page = await context.newPage();
    await page.goto('http://127.0.0.1:8787/', { waitUntil: 'networkidle', timeout: 30000 });

    // Dismiss any modal
    await page.evaluate(({ dark }) => {
      const m = document.getElementById('googleAuthModal');
      if (m) m.classList.add('hidden');
      window.isForceAuthModal = false;

      // Set dark/light class
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Switch to portal-search
      if (typeof window.switchTab === 'function') {
        window.switchTab('portal-search');
      }
    }, { dark: t.dark });

    await page.waitForTimeout(1000);

    // Call searchVouchers if available to populate table
    await page.evaluate(async () => {
      if (typeof window.searchVouchers === 'function') {
        try {
          await window.searchVouchers();
        } catch (e) {
          console.error(e);
        }
      }
    });

    await page.waitForTimeout(1500);

    const shotPath = `${ARTIFACT_DIR}/${t.name}`;
    await page.screenshot({ path: shotPath });
    console.log(`Saved screenshot: ${t.name}`);

    await context.close();
  }

  await browser.close();
  console.log('All baseline screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
