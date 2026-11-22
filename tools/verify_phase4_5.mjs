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
    { name: 'phase4_5_portal_search_desktop_light.png', width: 1440, height: 900, dark: false },
    { name: 'phase4_5_portal_search_desktop_dark.png', width: 1440, height: 900, dark: true },
    { name: 'phase4_5_portal_search_mobile_light.png', width: 390, height: 844, dark: false },
    { name: 'phase4_5_portal_search_mobile_dark.png', width: 390, height: 844, dark: true },
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

    // Trigger searchVouchers
    await page.evaluate(async () => {
      if (window.searchVouchers) await window.searchVouchers();
    });
    await page.waitForTimeout(600);

    if (cfg.name.includes('desktop_light')) {
      const audit = await page.evaluate(() => {
        // 1. Header heights
        const searchInputGroup = document.querySelector('[data-slot="input-group"]');
        const sitePill = document.querySelector('header div[onclick*="openSiteSelectorModal"]');
        const monthBtn = document.querySelector('header button[onclick*="globalMonthPicker"]');
        const themeBtn = document.querySelector('header button[onclick*="toggleTheme"]');
        const userBtn = document.querySelector('header button[onclick*="handleUserProfileClick"]');
        const sidebarToggle = document.querySelector('header button[onclick*="toggleSidebar"]');
        const mobileTitle = document.getElementById('mobileHeaderTitle');

        const heights = {
          searchInputGroup: searchInputGroup ? searchInputGroup.offsetHeight : null,
          sitePill: sitePill ? sitePill.offsetHeight : null,
          monthBtn: monthBtn ? monthBtn.offsetHeight : null,
          themeBtn: themeBtn ? themeBtn.offsetHeight : null,
          userBtn: userBtn ? userBtn.offsetHeight : null,
          sidebarToggle: sidebarToggle ? sidebarToggle.offsetHeight : null,
        };

        // 2. Search placeholder
        const searchInput = document.getElementById('globalHeaderSearch');
        const searchPlaceholder = searchInput ? searchInput.getAttribute('placeholder') : null;

        // 3. Sidebar category headers
        const catHeaders = Array.from(document.querySelectorAll('#sidebar .sidebar-category h3')).map(h => {
          const comp = window.getComputedStyle(h);
          return {
            text: h.textContent.trim(),
            textTransform: comp.textTransform,
            letterSpacing: comp.letterSpacing
          };
        });

        // 4. Portal badges in sidebar
        const portalBadgesCount = Array.from(document.querySelectorAll('#sidebar .sidebar-category span')).filter(s => s.textContent.trim().toLowerCase() === 'portal').length;

        // 5. Page header in portal-search
        const pageHeader = document.querySelector('#portal-search .page-header');
        const pageTitle = document.querySelector('#portal-search .page-title');
        const pageSubtitle = document.querySelector('#portal-search .page-subtitle');
        const pageTitleComp = pageTitle ? window.getComputedStyle(pageTitle) : null;
        const pageSubtitleComp = pageSubtitle ? window.getComputedStyle(pageSubtitle) : null;

        return {
          heights,
          mobileTitleHidden: mobileTitle ? (mobileTitle.offsetParent === null || mobileTitle.classList.contains('hidden')) : true,
          searchPlaceholder,
          catHeaders,
          portalBadgesCount,
          pageHeaderExists: !!pageHeader,
          pageTitle: pageTitle ? pageTitle.textContent.trim() : null,
          pageTitleFontSize: pageTitleComp ? pageTitleComp.fontSize : null,
          pageSubtitleFontSize: pageSubtitleComp ? pageSubtitleComp.fontSize : null,
        };
      });

      console.log('Phase 4 & 5 Audit Results:', JSON.stringify(audit, null, 2));
    }

    const outPath = path.join(SCREENSHOT_DIR, cfg.name);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved screenshot: ${cfg.name}`);

    await page.close();
  }

  await browser.close();
  console.log('Phase 4 & 5 verification completed successfully!');
}

run().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
