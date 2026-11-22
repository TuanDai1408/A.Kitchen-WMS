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

async function verifyPhase1() {
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Measure computed width of "22/11/2026" at 14px with .num
  const testPage = await browser.newPage();
  await testPage.goto('http://127.0.0.1:8787/', { waitUntil: 'networkidle' });

  const measureData = await testPage.evaluate(async () => {
    await document.fonts.ready;
    const span = document.createElement('span');
    span.className = 'num';
    span.style.fontSize = '14px';
    span.textContent = '22/11/2026';
    document.body.appendChild(span);

    const width = span.getBoundingClientRect().width;
    const computedFont = window.getComputedStyle(span).fontFamily;
    span.remove();

    // Also measure code
    const codeSpan = document.createElement('span');
    codeSpan.className = 'code';
    codeSpan.textContent = 'CT-20261117-012625-K001';
    document.body.appendChild(codeSpan);
    const codeWidth = codeSpan.getBoundingClientRect().width;
    codeSpan.remove();

    return {
      dateWidth: width,
      dateFont: computedFont,
      codeWidth
    };
  });

  console.log('Measurement results:');
  console.log('- Width of "22/11/2026" (14px, .num):', measureData.dateWidth, 'px (Target: <= 90px)');
  console.log('- Font family for .num:', measureData.dateFont);
  console.log('- Width of "CT-20261117-012625-K001" (.code):', measureData.codeWidth, 'px');

  await testPage.close();

  // 2. Capture desktop and mobile screenshots for Phase 1
  const targets = [
    { name: 'phase1_portal_search_desktop_light.png', width: 1440, height: 900, dark: false },
    { name: 'phase1_portal_search_desktop_dark.png', width: 1440, height: 900, dark: true },
    { name: 'phase1_portal_search_mobile_light.png', width: 390, height: 844, dark: false },
    { name: 'phase1_portal_search_mobile_dark.png', width: 390, height: 844, dark: true }
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

    // Check if voucher codes and dates wrap into multiple lines on desktop
    if (t.width >= 1024) {
      const wrapCheck = await page.evaluate(() => {
        const rows = document.querySelectorAll('#scBody tr');
        let codeWrapped = 0;
        let dateWrapped = 0;
        rows.forEach(r => {
          const codeEl = r.querySelector('.code');
          if (codeEl) {
            const h = codeEl.getBoundingClientRect().height;
            if (h > 20) codeWrapped++;
          }
          const dateEls = r.querySelectorAll('.num');
          dateEls.forEach(d => {
            const h = d.getBoundingClientRect().height;
            if (h > 24) dateWrapped++;
          });
        });
        return { totalRows: rows.length, codeWrapped, dateWrapped };
      });
      console.log(`Desktop line-wrapping check (${t.name}):`, wrapCheck);
    }

    const shotPath = `${ARTIFACT_DIR}/${t.name}`;
    await page.screenshot({ path: shotPath });
    console.log(`Saved screenshot: ${t.name}`);

    await context.close();
  }

  await browser.close();
  console.log('Phase 1 verification completed successfully!');
}

verifyPhase1().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
