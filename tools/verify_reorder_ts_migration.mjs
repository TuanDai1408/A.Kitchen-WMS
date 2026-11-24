import { chromium } from 'playwright-core';
import path from 'path';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE_URL = 'http://localhost:8787';
const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17';

async function verifyReorderTsMigration() {
  console.log('🚀 Starting Verification: ROP Reorder & Lead Time (Module 8) TypeScript Migration...');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Initialize KHO_TRUONG user session before page load with valid site K001
  await page.addInitScript(() => {
    localStorage.setItem('orbit_user', JSON.stringify({
      email: 'khotruong.k001@akitchen.vn',
      fullName: 'Kho Trưởng K001',
      role: 'KHO_TRUONG',
      assignedSite: 'K001'
    }));
    localStorage.setItem('orbit_user_site', 'K001');
    localStorage.setItem('orbit_user_role', 'KHO_TRUONG');
  });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Page loaded successfully with KHO_TRUONG session');

    // 1. Verify global functions attached to window
    const globalsCheck = await page.evaluate(() => {
      return {
        hasLoadReorderROP: typeof window.loadReorderROP === 'function',
        hasRenderRopTable: typeof window.renderRopTable === 'function',
        hasLoadLeadTime: typeof window.loadLeadTime === 'function',
        hasRenderLeadTimeTable: typeof window.renderLeadTimeTable === 'function',
        hasFilterLeadTimeSla: typeof window.filterLeadTimeSla === 'function',
        hasDownloadRopExcel: typeof window.downloadRopExcel === 'function'
      };
    });

    console.log('📊 Globals Check:', globalsCheck);
    for (const [fnName, isPresent] of Object.entries(globalsCheck)) {
      if (!isPresent) {
        throw new Error(`Expected global function ${fnName} to be defined!`);
      }
    }

    // ==========================================
    // 2. Test wh-reorder Tab & ROP Workflow
    // ==========================================
    console.log('🔄 Switching to wh-reorder tab & calculating ROP...');
    await page.evaluate(async () => {
      window.switchTab('wh-reorder');
      await window.loadReorderROP();
    });
    await page.waitForTimeout(1000);

    const ropState = await page.evaluate(() => {
      const items = window.App?.ropItems || [];
      const tbody = document.getElementById('ropTableBody');
      const rows = tbody ? tbody.querySelectorAll('tr').length : 0;
      const badgeText = document.getElementById('whRopCurrentSiteBadge')?.textContent;
      const firstItem = items[0] ? {
        sku: items[0].sku,
        name: items[0].item_name,
        current_stock: items[0].current_stock,
        rop: items[0].rop,
        suggested: items[0].suggested_order,
        status: items[0].status
      } : null;

      return {
        itemsCount: items.length,
        renderedRows: rows,
        badgeText,
        firstItem
      };
    });

    console.log('📦 ROP State:', ropState);
    if (ropState.itemsCount === 0 || ropState.renderedRows === 0) {
      throw new Error('ROP items not loaded or table not rendered!');
    }
    console.log(`✅ Loaded ${ropState.itemsCount} ROP reorder items for site ${ropState.badgeText}.`);

    // Screenshot ROP table
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'ts_wh_reorder_table.png'),
      fullPage: false
    });

    // 3. Test ROP Excel Export
    console.log('📊 Testing downloadRopExcel execution...');
    const ropExportResult = await page.evaluate(() => {
      try {
        const originalWrite = window.XLSX.writeFile;
        let interceptedFileName = null;
        let interceptedSheets = null;
        window.XLSX.writeFile = (wb, fName) => {
          interceptedFileName = fName;
          interceptedSheets = wb.SheetNames;
        };

        window.downloadRopExcel();

        window.XLSX.writeFile = originalWrite;
        return { success: true, fileName: interceptedFileName, sheets: interceptedSheets };
      } catch (e) {
        return { success: false, error: e.message };
      }
    });

    console.log('📊 ROP Excel Export Result:', ropExportResult);
    if (!ropExportResult.success || !ropExportResult.fileName) {
      throw new Error(`Export ROP Excel failed: ${ropExportResult.error || 'No file generated'}`);
    }
    console.log(`✅ ROP Excel export verified: ${ropExportResult.fileName} [${ropExportResult.sheets?.join(', ')}]`);

    // ==========================================
    // 4. Test wh-leadtime Tab & SLA Workflow
    // ==========================================
    console.log('🔄 Switching to wh-leadtime tab & fetching PO Lead Time...');
    await page.evaluate(async () => {
      window.switchTab('wh-leadtime');
      await window.loadLeadTime();
    });
    await page.waitForTimeout(1000);

    const leadTimeState = await page.evaluate(() => {
      const items = window.App?.leadTimeRawData || [];
      const tbody = document.getElementById('leadTimeTableBody');
      const rows = tbody ? tbody.querySelectorAll('tr').length : 0;
      const firstItem = items[0] ? {
        po: items[0].po_number,
        supplier: items[0].supplier_name,
        orderDate: items[0].order_date,
        status: items[0].status,
        slaStatus: items[0].sla_status
      } : null;

      return {
        itemsCount: items.length,
        renderedRows: rows,
        firstItem
      };
    });

    console.log('🚚 Lead Time State:', leadTimeState);
    if (leadTimeState.itemsCount === 0 || leadTimeState.renderedRows === 0) {
      throw new Error('Lead Time records not loaded or table not rendered!');
    }
    console.log(`✅ Loaded ${leadTimeState.itemsCount} Lead Time PO records, rendered ${leadTimeState.renderedRows} rows.`);

    // Screenshot Lead Time table
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'ts_wh_leadtime_table.png'),
      fullPage: false
    });

    // 5. Test SLA Filtering
    console.log('🔍 Testing SLA Filter: ON_TIME...');
    await page.evaluate(() => {
      window.filterLeadTimeSla('ON_TIME');
    });
    await page.waitForTimeout(300);

    const onTimeCheck = await page.evaluate(() => {
      const tbody = document.getElementById('leadTimeTableBody');
      const rows = tbody ? Array.from(tbody.querySelectorAll('tr')) : [];
      return {
        rowCount: rows.length,
        allOnTime: rows.every(r => r.textContent?.includes('ĐÚNG HẠN') || r.textContent?.includes('Đạt SLA'))
      };
    });
    console.log('🔍 ON_TIME Filter Check:', onTimeCheck);
    if (onTimeCheck.rowCount === 0 || !onTimeCheck.allOnTime) {
      throw new Error('ON_TIME SLA filter failed!');
    }
    console.log(`✅ ON_TIME filter correctly displayed ${onTimeCheck.rowCount} rows.`);

    console.log('🔍 Testing SLA Filter: LATE...');
    await page.evaluate(() => {
      window.filterLeadTimeSla('LATE');
    });
    await page.waitForTimeout(300);

    const lateCheck = await page.evaluate(() => {
      const tbody = document.getElementById('leadTimeTableBody');
      const rows = tbody ? Array.from(tbody.querySelectorAll('tr')) : [];
      return {
        rowCount: rows.length,
        allLate: rows.every(r => r.textContent?.includes('TRỄ HẠN') || r.textContent?.includes('Trễ hẹn'))
      };
    });
    console.log('🔍 LATE Filter Check:', lateCheck);
    if (lateCheck.rowCount === 0 || !lateCheck.allLate) {
      throw new Error('LATE SLA filter failed!');
    }
    console.log(`✅ LATE filter correctly displayed ${lateCheck.rowCount} rows.`);

    // Reset SLA filter to ALL
    await page.evaluate(() => {
      window.filterLeadTimeSla('ALL');
    });
    await page.waitForTimeout(300);

    // 6. Check Console Health
    console.log('🩺 Verifying console health...');
    if (consoleErrors.length > 0) {
      console.warn('⚠️ Console errors detected:', consoleErrors);
      const fatalErrors = consoleErrors.filter(e =>
        !e.includes('favicon') &&
        !e.includes('404') &&
        !e.includes('403') &&
        !e.includes('GSI_LOGGER')
      );
      if (fatalErrors.length > 0) {
        throw new Error(`Fatal console errors found during verification: ${fatalErrors.join('; ')}`);
      }
    } else {
      console.log('✅ Zero console errors detected.');
    }

    console.log('🎉 ALL BUSINESS FLOW CHECKS PASSED FOR MODULE 8: WH-REORDER & WH-LEADTIME!');
  } finally {
    await browser.close();
  }
}

verifyReorderTsMigration().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
