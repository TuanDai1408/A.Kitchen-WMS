import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/screenshots';

// Discover Chrome executable
const candidatePaths = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
  process.env.PROGRAMFILES + '/Google/Chrome/Application/chrome.exe',
];
let chromePath = candidatePaths.find(p => p && fs.existsSync(p));
if (!chromePath) {
  console.error('Chrome executable not found');
  process.exit(1);
}

const BASE_URL = 'http://localhost:8787';

async function run() {
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true
  });

  const configs = [
    { name: 'phase3_portal_search_desktop_light.png', width: 1440, height: 900, dark: false },
    { name: 'phase3_portal_search_desktop_dark.png', width: 1440, height: 900, dark: true },
    { name: 'phase3_portal_search_mobile_light.png', width: 390, height: 844, dark: false },
    { name: 'phase3_portal_search_mobile_dark.png', width: 390, height: 844, dark: true },
  ];

  for (const cfg of configs) {
    const page = await browser.newPage({
      viewport: { width: cfg.width, height: cfg.height }
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Set dark/light mode
    await page.evaluate((isDark) => {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }, cfg.dark);

    // Switch to tab portal-search
    await page.evaluate(() => {
      if (window.switchTab) {
        window.switchTab('portal-search');
      } else {
        const btn = document.querySelector('[data-tab="portal-search"]');
        if (btn) btn.click();
      }
    });

    // Trigger searchVouchers to populate table
    await page.evaluate(async () => {
      if (window.searchVouchers) await window.searchVouchers();
    });
    await page.waitForTimeout(600);

    if (cfg.name.includes('desktop_light')) {
      // Run audit checks
      const audit = await page.evaluate(() => {
        const theadThs = Array.from(document.querySelectorAll('#portal-search table thead th')).map(th => {
          const comp = window.getComputedStyle(th);
          return {
            text: th.textContent.trim(),
            textTransform: comp.textTransform,
            letterSpacing: comp.letterSpacing,
            fontSize: comp.fontSize,
            fontWeight: comp.fontWeight
          };
        });

        const rows = Array.from(document.querySelectorAll('#scBody tr')).map(tr => {
          const cells = Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim());
          const person = cells[6]; // Người nhập
          const files = cells[7]; // Tệp
          const badge = tr.querySelector('.badge');
          const fileChip = tr.querySelector('.file-chip');
          return {
            maCT: cells[0],
            person,
            files,
            badgeClass: badge ? badge.className : null,
            fileChipClass: fileChip ? fileChip.className : null
          };
        });

        const unknownPersons = rows.filter(r => r.person.toLowerCase() === 'unknown');
        const roseBadges = Array.from(document.querySelectorAll('#scBody .bg-rose-50, #scBody .text-rose-700')).length;

        return {
          theadThs,
          rowCount: rows.length,
          unknownPersonsCount: unknownPersons.length,
          roseBadgesCount: roseBadges,
          firstRow: rows[0]
        };
      });

      console.log('Phase 3 audit results:', JSON.stringify(audit, null, 2));
    }

    const outPath = path.join(SCREENSHOT_DIR, cfg.name);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved screenshot: ${cfg.name}`);

    await page.close();
  }

  await browser.close();
  console.log('Phase 3 verification completed successfully!');
}

run().catch(err => {
  console.error('Error during Phase 3 verification:', err);
  process.exit(1);
});
