import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE_URL = 'http://localhost:8787';

async function verifyStockTsMigration() {
  console.log('🚀 Starting Verification: F&B Chain Stock TypeScript Migration...');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Page loaded successfully');

    // 1. Verify global functions attached to window
    const globalsCheck = await page.evaluate(() => {
      return {
        hasLoadFnbStock: typeof window.loadFnbStock === 'function',
        hasRenderFnbStock: typeof window.renderFnbStock === 'function',
        hasExportFnbStockExcel: typeof window.exportFnbStockExcel === 'function',
        hasOnFnbStockFilterChange: typeof window.onFnbStockFilterChange === 'function',
        hasOnFnbStockSearch: typeof window.onFnbStockSearch === 'function',
        hasOnFnbStockToggleValue: typeof window.onFnbStockToggleValue === 'function',
        hasFilterObj: typeof window.gFnbStockFilter === 'object'
      };
    });

    console.log('📊 Globals Check:', globalsCheck);
    if (!globalsCheck.hasLoadFnbStock || !globalsCheck.hasExportFnbStockExcel) {
      throw new Error('Stock functions are not attached to window properly!');
    }

    // 2. Test loadFnbStock API execution
    console.log('🔄 Calling window.loadFnbStock()...');
    const apiResult = await page.evaluate(async () => {
      await window.loadFnbStock();
      const data = window.gFnbStockData;
      return {
        hasData: !!data,
        sitesCount: data?.sites?.length || 0,
        rowsCount: data?.rows?.length || 0,
        sampleRow: data?.rows?.[0] ? {
          code: data.rows[0].code,
          name: data.rows[0].name,
          unit: data.rows[0].unit
        } : null
      };
    });

    console.log('✅ loadFnbStock() Execution Result:', apiResult);
    if (!apiResult.hasData || apiResult.sitesCount < 10 || apiResult.rowsCount === 0) {
      throw new Error('loadFnbStock did not populate gFnbStockData correctly!');
    }

    // 3. Test onFnbStockSearch filter
    console.log('🔍 Testing onFnbStockSearch("muối")...');
    const searchResult = await page.evaluate(() => {
      window.onFnbStockSearch('muối');
      return window.gFnbStockSearchTerm;
    });
    console.log('✅ Search term set to:', searchResult);

    // 4. Test Excel Export execution safely
    console.log('📑 Testing window.exportFnbStockExcel()...');
    const exportResult = await page.evaluate(() => {
      try {
        window.exportFnbStockExcel();
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    });
    console.log('✅ Export Excel result:', exportResult);
    if (!exportResult.success) {
      throw new Error('exportFnbStockExcel failed: ' + exportResult.error);
    }

    console.log('🎉 ALL F&B Chain Stock Module Verifications PASSED!');

    if (consoleErrors.length > 0) {
      console.warn('⚠️ Console errors noticed during run:', consoleErrors);
    } else {
      console.log('🌟 Zero console errors detected.');
    }
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

verifyStockTsMigration();
