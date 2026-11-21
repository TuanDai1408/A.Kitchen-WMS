import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright-core';

const PORT = 3456;
const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/screenshots';

// Ensure artifact screenshot dir exists
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

// 1. Simple HTTP server for public/
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(process.cwd(), 'public', reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mimes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': mimes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found: ' + reqPath);
  }
});

await new Promise(resolve => server.listen(PORT, resolve));
console.log(`Test server running at http://localhost:${PORT}`);

const possiblePaths = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];
const executablePath = possiblePaths.find(p => fs.existsSync(p));
console.log('Using browser executable:', executablePath);

const browser = await chromium.launch({
  headless: true,
  executablePath
});

const results = {
  fontChecks: [],
  kpiCardsChecked: 0,
  overflowIssues: [],
  heightDifferences: [],
  invalidStrings: [],
  screenshots: []
};

try {
  // Test 1: Desktop Viewport & Font Verification
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://localhost:${PORT}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Check body font
  const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  console.log('Body font-family:', bodyFont);
  if (!bodyFont.toLowerCase().includes('inter')) {
    results.fontChecks.push(`Body font does not include Inter: ${bodyFont}`);
  }

  // Check KPI values font
  const kpiFontResults = await page.evaluate(() => {
    const kpiEls = document.querySelectorAll('.kpi-value, .kpi-value-compact, .kpi-value-hero');
    const samples = [];
    let allInter = true;
    kpiEls.forEach((el, idx) => {
      const ff = getComputedStyle(el).fontFamily.toLowerCase();
      if (!ff.includes('inter')) allInter = false;
      if (idx < 5) samples.push({ id: el.id, text: el.textContent.trim(), font: ff });
    });
    return { count: kpiEls.length, allInter, samples };
  });
  console.log(`KPI value elements checked: ${kpiFontResults.count}, all Inter: ${kpiFontResults.allInter}`);
  results.kpiCardsChecked = kpiFontResults.count;
  if (!kpiFontResults.allInter) {
    results.fontChecks.push('Some KPI values do not compute to Inter');
  }

  // Check for NaN, undefined, Infinity, [object Object]
  const badStrings = await page.evaluate(() => {
    const text = document.body.innerText;
    const found = [];
    ['NaN', 'undefined', 'Infinity', '[object Object]'].forEach(s => {
      if (text.includes(s)) found.push(s);
    });
    return found;
  });
  if (badStrings.length > 0) {
    console.warn('Found bad strings in initial DOM:', badStrings);
    results.invalidStrings = badStrings;
  } else {
    console.log('Zero bad strings (NaN, undefined, Infinity, [object Object]) in DOM');
  }

  // Test tabs & take screenshots
  const tabsToTest = [
    { id: 'wh-dashboard', name: 'wh_dashboard' },
    { id: 'fnb-pl', name: 'fnb_pl' },
    { id: 'fnb-chain', name: 'fnb_chain' },
    { id: 'portal-order', name: 'portal_order' },
    { id: 'portal-kiemke', name: 'portal_kiemke' }
  ];

  for (const tab of tabsToTest) {
    // Switch to tab
    await page.evaluate(tId => {
      if (typeof switchTab === 'function') switchTab(tId);
    }, tab.id);
    await page.waitForTimeout(500);

    // Verify row height equality in kpi-grid
    const rowHeights = await page.evaluate(tId => {
      const panel = document.getElementById(tId);
      if (!panel) return [];
      const grids = panel.querySelectorAll('.kpi-grid, .grid');
      const diffs = [];
      grids.forEach(g => {
        const cards = Array.from(g.querySelectorAll('.kpi-card, .kpi-card-compact'));
        if (cards.length >= 2) {
          const heights = cards.map(c => c.getBoundingClientRect().height);
          const max = Math.max(...heights);
          const min = Math.min(...heights);
          diffs.push({ max, min, diff: Math.abs(max - min) });
        }
      });
      return diffs;
    }, tab.id);

    const maxDiff = rowHeights.reduce((m, r) => Math.max(m, r.diff), 0);
    if (maxDiff > 1.5) {
      results.heightDifferences.push({ tab: tab.id, maxDiff });
    }

    // Capture Light screenshot
    const lightPath = path.join(ARTIFACT_DIR, `verify_${tab.name}_light.png`);
    await page.screenshot({ path: lightPath, fullPage: false });
    results.screenshots.push(`verify_${tab.name}_light.png`);

    // Toggle Dark mode
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(300);

    // Capture Dark screenshot
    const darkPath = path.join(ARTIFACT_DIR, `verify_${tab.name}_dark.png`);
    await page.screenshot({ path: darkPath, fullPage: false });
    results.screenshots.push(`verify_${tab.name}_dark.png`);

    // Reset Dark mode
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
  }

  await page.close();

  // Test 2: Mobile Viewport 360px & 390px (Horizontal Overflow Check)
  for (const width of [360, 390]) {
    const mPage = await browser.newPage({ viewport: { width, height: 780 } });
    await mPage.goto(`http://localhost:${PORT}`, { waitUntil: 'domcontentloaded' });
    await mPage.waitForTimeout(600);

    for (const tab of tabsToTest) {
      await mPage.evaluate(tId => {
        if (typeof switchTab === 'function') switchTab(tId);
      }, tab.id);
      await mPage.waitForTimeout(300);

      const overflow = await mPage.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
        };
      });

      if (overflow.hasOverflow) {
        results.overflowIssues.push({ width, tab: tab.id, ...overflow });
      }
    }

    // Capture mobile screenshot of wh-dashboard & portal-order
    await mPage.evaluate(() => switchTab('wh-dashboard'));
    await mPage.screenshot({ path: path.join(ARTIFACT_DIR, `verify_mobile_${width}_dashboard.png`) });
    results.screenshots.push(`verify_mobile_${width}_dashboard.png`);

    await mPage.evaluate(() => switchTab('portal-order'));
    await mPage.screenshot({ path: path.join(ARTIFACT_DIR, `verify_mobile_${width}_order.png`) });
    results.screenshots.push(`verify_mobile_${width}_order.png`);

    await mPage.close();
  }

} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

console.log('\n================ VERIFICATION SUMMARY ================');
console.log('KPI cards checked:', results.kpiCardsChecked);
console.log('Font errors:', results.fontChecks.length === 0 ? '0 (ALL INTER PASSED)' : results.fontChecks);
console.log('Overflow issues:', results.overflowIssues.length === 0 ? '0 (PASSED 360px & 390px)' : results.overflowIssues);
console.log('Height differences (>1.5px):', results.heightDifferences.length === 0 ? '0 (ALL EQUAL HEIGHT)' : results.heightDifferences);
console.log('Invalid strings:', results.invalidStrings.length === 0 ? '0 (CLEAN)' : results.invalidStrings);
console.log('Screenshots captured:', results.screenshots.length);
console.log('======================================================');
