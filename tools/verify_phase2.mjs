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

async function verifyPhase2() {
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const targets = [
    { name: 'phase2_portal_search_desktop_light.png', width: 1440, height: 900, dark: false },
    { name: 'phase2_portal_search_desktop_dark.png', width: 1440, height: 900, dark: true },
    { name: 'phase2_portal_search_mobile_light.png', width: 390, height: 844, dark: false },
    { name: 'phase2_portal_search_mobile_dark.png', width: 390, height: 844, dark: true }
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

    await page.evaluate(({ dark }) => {
      const m = document.getElementById('googleAuthModal');
      if (m) m.classList.add('hidden');
      window.isForceAuthModal = false;

      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      if (typeof window.switchTab === 'function') {
        window.switchTab('portal-search');
      }
    }, { dark: t.dark });

    await page.waitForTimeout(1000);

    // Call searchVouchers
    await page.evaluate(async () => {
      if (typeof window.searchVouchers === 'function') {
        await window.searchVouchers();
      }
    });

    await page.waitForTimeout(1500);

    // Check heights and controls in filter-bar
    if (t.width >= 1024) {
      const auditResult = await page.evaluate(() => {
        const scAudit = document.getElementById('scAuditFilter');
        const scLoai = document.getElementById('scLoai');
        const scTu = document.getElementById('scTu');
        const scDen = document.getElementById('scDen');
        const btnExcel = document.querySelector('#portal-search button[onclick*="exportVouchersExcel"]');
        const globalMonthDisplay = document.getElementById('globalMonthDisplay');

        const heights = {
          scAudit: scAudit ? scAudit.offsetHeight : null,
          scLoai: scLoai ? scLoai.offsetHeight : null,
          scTu: scTu ? scTu.offsetHeight : null,
          scDen: scDen ? scDen.offsetHeight : null,
          btnExcel: btnExcel ? btnExcel.offsetHeight : null
        };

        const all40px = Object.values(heights).every(h => h === 40);
        const monthText = globalMonthDisplay ? globalMonthDisplay.textContent.trim() : null;

        return {
          heights,
          all40px,
          monthText,
          btnClass: btnExcel ? btnExcel.className : null
        };
      });

      console.log(`Phase 2 audit results (${t.name}):`, JSON.stringify(auditResult, null, 2));
    }

    const shotPath = `${ARTIFACT_DIR}/${t.name}`;
    await page.screenshot({ path: shotPath });
    console.log(`Saved screenshot: ${t.name}`);

    await context.close();
  }

  await browser.close();
  console.log('Phase 2 verification completed successfully!');
}

verifyPhase2().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
