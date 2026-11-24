import { chromium } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17';

async function main() {
  console.log('--- STARTING MODULE 10 VERIFICATION: CHAIN RANKINGS, P&L, POS & SITES MASTER ---');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem('orbit_user', JSON.stringify({
      email: 'khotruong.k001@akitchen.vn',
      role: 'KHO_TRUONG',
      site: 'K001'
    }));
    localStorage.setItem('orbit_user_site', 'K001');
  });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const txt = msg.text();
      if (!txt.includes('favicon') && !txt.includes('404') && !txt.includes('GSI_LOGGER') && !txt.includes('403')) {
        consoleErrors.push(txt);
      }
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  try {
    console.log('1. Navigating to http://localhost:8787 ...');
    await page.goto('http://localhost:8787', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);

    // --- STEP 1: Test F&B Chain Rankings ---
    console.log('2. Testing F&B Chain Rankings (fnb-chain)...');
    await page.evaluate(async () => {
      if (typeof window.switchTab === 'function') {
        window.switchTab('fnb-chain');
      }
      await window.loadFnbChain();
    });
    await page.waitForTimeout(1500);

    const chainStatus = await page.evaluate(() => {
      const rows = document.querySelectorAll('#fnbChainTableBody tr');
      return {
        rankingsCount: window.gChainRankings ? window.gChainRankings.length : 0,
        renderedRows: rows.length,
        firstSiteCode: rows[0]?.querySelector('td:nth-child(2) .tabular-nums')?.textContent?.trim() || '',
        totalRevenue: document.getElementById('chainTotalRevenue')?.textContent?.trim() || '',
        totalProfit: document.getElementById('chainTotalProfit')?.textContent?.trim() || '',
        avgMargin: document.getElementById('chainAvgMargin')?.textContent?.trim() || ''
      };
    });
    console.log('   Chain Rankings Status:', chainStatus);
    if (chainStatus.renderedRows === 0) {
      throw new Error('No chain ranking rows rendered in #fnbChainTableBody!');
    }

    // Test Region filter
    console.log('3. Testing Region Filter (Miền Nam)...');
    await page.evaluate(() => {
      window.filterFnbChainByRegion('Miền Nam');
    });
    await page.waitForTimeout(500);

    const mnCount = await page.evaluate(() => {
      return document.querySelectorAll('#fnbChainTableBody tr').length;
    });
    console.log(`   Miền Nam rows count: ${mnCount}`);

    // Reset region filter & test Search
    await page.evaluate(() => {
      window.filterFnbChainByRegion('ALL');
      window.onSearchChainSite('K001');
    });
    await page.waitForTimeout(500);

    const searchCount = await page.evaluate(() => {
      return document.querySelectorAll('#fnbChainTableBody tr').length;
    });
    console.log(`   Search K001 rows count: ${searchCount}`);

    // Reset search
    await page.evaluate(() => {
      window.onSearchChainSite('');
    });
    await page.waitForTimeout(500);

    // Test Excel Export Chain Rankings
    console.log('4. Testing Export Chain Rankings Excel...');
    await page.evaluate(() => {
      window.exportFnbChainExcel();
    });

    const chainScreenshotPath = path.join(ARTIFACT_DIR, 'ts_chain_rankings_table.png');
    await page.screenshot({ path: chainScreenshotPath });
    console.log('   Saved chain rankings screenshot:', chainScreenshotPath);

    // --- STEP 2: Test F&B P&L Report ---
    console.log('5. Testing Site P&L Report (fnb-pl)...');
    await page.evaluate(async () => {
      window.viewSitePL('K001');
    });
    await page.waitForTimeout(1500);

    const plStatus = await page.evaluate(() => {
      return {
        title: document.getElementById('plSiteTitle')?.textContent?.trim() || '',
        hasData: !!window.currentPLData,
        netRev: document.getElementById('plNetRev')?.textContent?.trim() || '',
        foodCostVal: document.getElementById('plFoodCostVal')?.textContent?.trim() || '',
        laborCostVal: document.getElementById('plLaborCostVal')?.textContent?.trim() || '',
        weeklyTrendsCount: document.querySelectorAll('#plWeeklyTrendBody tr').length
      };
    });
    console.log('   P&L Report Status:', plStatus);

    // Test Breakdown filter
    console.log('6. Testing P&L Breakdown Filter (COGS)...');
    await page.evaluate(() => {
      window.filterPlBreakdown('COGS');
    });
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      window.filterPlBreakdown('ALL');
    });
    await page.waitForTimeout(500);

    // Test Export P&L Excel
    console.log('7. Testing Export P&L Excel...');
    await page.evaluate(() => {
      window.exportFnbPLExcel();
    });

    const plScreenshotPath = path.join(ARTIFACT_DIR, 'ts_chain_pl_report.png');
    await page.screenshot({ path: plScreenshotPath });
    console.log('   Saved P&L report screenshot:', plScreenshotPath);

    // --- STEP 3: Test POS Metrics ---
    console.log('8. Testing POS Metrics (fnb-pos)...');
    await page.evaluate(async () => {
      if (typeof window.switchTab === 'function') {
        window.switchTab('fnb-pos');
      }
      await window.loadFnbPOS();
    });
    await page.waitForTimeout(1500);

    const posStatus = await page.evaluate(() => {
      return {
        dailyRevenue: document.getElementById('posDailyRevenue')?.textContent?.trim() || '',
        dailyBills: document.getElementById('posDailyBills')?.textContent?.trim() || '',
        dailyAOV: document.getElementById('posDailyAOV')?.textContent?.trim() || '',
        hourlyItems: document.querySelectorAll('#posHourlyList > div').length
      };
    });
    console.log('   POS Status:', posStatus);

    const posScreenshotPath = path.join(ARTIFACT_DIR, 'ts_chain_pos_metrics.png');
    await page.screenshot({ path: posScreenshotPath });
    console.log('   Saved POS metrics screenshot:', posScreenshotPath);

    // --- STEP 4: Test Master 14 Sites ---
    console.log('9. Testing Master Sites (fnb-sites)...');
    await page.evaluate(async () => {
      if (typeof window.switchTab === 'function') {
        window.switchTab('fnb-sites');
      }
      await window.loadFnbSites();
    });
    await page.waitForTimeout(1500);

    const sitesStatus = await page.evaluate(() => {
      const rows = document.querySelectorAll('#fnbSitesMasterTableBody tr');
      return {
        countBadge: document.getElementById('fnbSitesCountBadge')?.textContent?.trim() || '',
        renderedRows: rows.length
      };
    });
    console.log('   Master Sites Status:', sitesStatus);
    if (sitesStatus.renderedRows === 0) {
      throw new Error('No master sites rendered in #fnbSitesMasterTableBody!');
    }

    const sitesScreenshotPath = path.join(ARTIFACT_DIR, 'ts_chain_master_sites.png');
    await page.screenshot({ path: sitesScreenshotPath });
    console.log('   Saved master sites screenshot:', sitesScreenshotPath);

    // Check fatal errors
    if (consoleErrors.length > 0) {
      console.warn('⚠️ Console errors detected:', consoleErrors);
      throw new Error(`Fatal console errors found: ${consoleErrors.join(' | ')}`);
    }

    console.log('✅ MODULE 10 VERIFICATION PASSED SUCCESSFULLY WITH ZERO FATAL ERRORS!');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
