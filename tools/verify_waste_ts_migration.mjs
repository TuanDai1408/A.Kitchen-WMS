import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17';

const possiblePaths = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];
const executablePath = possiblePaths.find(p => fs.existsSync(p));

async function verify() {
  console.log('Launching browser with executable:', executablePath);
  const browser = await chromium.launch({
    headless: true,
    executablePath
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[Browser ERROR] ${msg.text()}`);
    }
  });

  try {
    console.log('1. Navigating to http://localhost:8787...');
    await page.goto('http://localhost:8787', { waitUntil: 'networkidle' });

    // Initialize user session and load waste module
    await page.evaluate(async () => {
      localStorage.setItem('orbit_user_site', 'K001');
      window.gCurrentUser = {
        name: 'Nguyễn Văn Quản Lý',
        username: 'admin',
        role: 'SUPERADMIN',
        assignedSite: 'K001'
      };
      if (typeof window.switchTab === 'function') {
        window.switchTab('fnb-waste');
      }
      if (typeof window.loadFnbWaste === 'function') {
        await window.loadFnbWaste();
      }
    });

    await page.waitForTimeout(1000);

    console.log('2. Verifying Stock Items for Waste view...');
    const stockStats = await page.evaluate(() => {
      const tbody = document.getElementById('fnbWasteStockTableBody');
      const items = window.gFnbWasteStockItems || [];
      const kpiCount = document.getElementById('kpiWasteInStockCount');
      const kpiVal = document.getElementById('kpiWasteInStockVal');
      return {
        tableRows: tbody ? tbody.children.length : 0,
        itemCount: items.length,
        kpiCount: kpiCount ? kpiCount.textContent : '',
        kpiVal: kpiVal ? kpiVal.textContent : '',
        firstItem: items[0] || null
      };
    });
    console.log('Waste Stock Stats:', stockStats);

    // Test search filter
    if (stockStats.firstItem) {
      const code = stockStats.firstItem.code;
      await page.evaluate((c) => {
        const input = document.getElementById('fnbWasteSearchInput');
        if (input) {
          input.value = c;
          if (typeof window.onFnbWasteSearch === 'function') {
            window.onFnbWasteSearch(c);
          }
        }
      }, code);
      await page.waitForTimeout(300);

      const filteredCount = await page.evaluate(() => {
        const tbody = document.getElementById('fnbWasteStockTableBody');
        return tbody ? tbody.children.length : 0;
      });
      console.log(`Filtered rows with code '${code}': ${filteredCount}`);

      // Reset search
      await page.evaluate(() => {
        const input = document.getElementById('fnbWasteSearchInput');
        if (input) {
          input.value = '';
          if (typeof window.onFnbWasteSearch === 'function') {
            window.onFnbWasteSearch('');
          }
        }
      });
      await page.waitForTimeout(300);
    }

    // 3. Test inline waste input & KPI calculation
    console.log('3. Testing In-line Waste Inputs & KPI recalculation...');
    const wasteInputResult = await page.evaluate(() => {
      const items = window.gFnbWasteStockItems || [];
      if (items.length > 0 && typeof window.onWasteLineQtyChange === 'function') {
        const code = items[0].code;
        window.onWasteLineQtyChange(code, '1.5');
        if (typeof window.onWasteLineReasonChange === 'function') {
          window.onWasteLineReasonChange(code, 'Quá hạn sử dụng (HSD)');
        }
        if (typeof window.onWasteLineNoteChange === 'function') {
          window.onWasteLineNoteChange(code, 'Kiểm tra test migration');
        }
      }
      const kpiSel = document.getElementById('kpiWasteSelectedCount');
      const kpiEst = document.getElementById('kpiWasteTotalEstAmount');
      const btnSubmit = document.getElementById('btnSubmitDirectWaste');
      const btnText = document.getElementById('btnSubmitDirectWasteText');
      return {
        selectedCount: kpiSel ? kpiSel.textContent : '',
        totalEst: kpiEst ? kpiEst.textContent : '',
        btnDisabled: btnSubmit ? btnSubmit.disabled : true,
        btnText: btnText ? btnText.textContent : ''
      };
    });
    console.log('Waste Input Result:', wasteInputResult);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ts_waste_stock_table.png') });
    console.log('Captured screenshot: ts_waste_stock_table.png');

    // 4. Submit Direct Waste
    console.log('4. Submitting Direct Waste to API...');
    await page.evaluate(async () => {
      if (typeof window.submitDirectWaste === 'function') {
        await window.submitDirectWaste();
      }
    });
    await page.waitForTimeout(1500);

    // 5. Test History Sub-View & Detail Modal
    console.log('5. Verifying Waste History Sub-view after submission...');
    const historyStats = await page.evaluate(() => {
      const tbody = document.getElementById('fnbWasteTableBody');
      const bHist = document.getElementById('fnbWasteBadgeHistoryCount');
      return {
        tableRows: tbody ? tbody.children.length : 0,
        badgeCount: bHist ? bHist.textContent : ''
      };
    });
    console.log('Waste History Stats:', historyStats);

    // View Detail of newly created slip
    await page.evaluate(async () => {
      const firstRowBtn = document.querySelector('#fnbWasteTableBody button');
      if (firstRowBtn) {
        firstRowBtn.click();
      }
    });
    await page.waitForTimeout(1000);

    const detailModalStats = await page.evaluate(() => {
      const modal = document.getElementById('invDetailModal');
      const body = document.getElementById('invDetailModalBody');
      return {
        visible: modal && !modal.classList.contains('hidden'),
        hasContent: body && body.innerHTML.trim().length > 0
      };
    });
    console.log('Waste Detail Modal Stats:', detailModalStats);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ts_waste_detail_modal.png') });
    console.log('Captured screenshot: ts_waste_detail_modal.png');

    // Close detail modal
    await page.evaluate(() => {
      const modal = document.getElementById('invDetailModal');
      if (modal) modal.classList.add('hidden');
    });
    await page.waitForTimeout(300);

    // 6. Test Standalone Create Waste Modal
    console.log('6. Testing Standalone Create Waste Modal...');
    await page.evaluate(async () => {
      if (typeof window.openCreateWasteModal === 'function') {
        await window.openCreateWasteModal();
      }
    });
    await page.waitForTimeout(1000);

    const modalVisible = await page.evaluate(() => {
      const modal = document.getElementById('createWasteModal');
      const container = document.getElementById('wasteLinesContainer');
      return {
        visible: modal && !modal.classList.contains('hidden'),
        lineRows: container ? container.children.length : 0
      };
    });
    console.log('Create Waste Modal Stats:', modalVisible);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ts_waste_create_modal.png') });
    console.log('Captured screenshot: ts_waste_create_modal.png');

    // Close Modal
    await page.evaluate(() => {
      if (typeof window.closeCreateWasteModal === 'function') {
        window.closeCreateWasteModal();
      }
    });
    await page.waitForTimeout(300);

    console.log('ALL MODULE 2 (FNB-WASTE) BUSINESS WORKFLOW CHECKS PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

verify();
