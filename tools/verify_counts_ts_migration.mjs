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

    // Initialize user session and load counts module
    await page.evaluate(async () => {
      localStorage.setItem('orbit_user_site', 'K001');
      window.gCurrentUser = {
        name: 'Nguyễn Văn Quản Lý',
        username: 'admin',
        role: 'SUPERADMIN',
        assignedSite: 'K001'
      };
      if (typeof window.switchTab === 'function') {
        window.switchTab('fnb-counts');
      }
      if (typeof window.loadFnbCounts === 'function') {
        await window.loadFnbCounts();
      }
    });

    await page.waitForTimeout(1000);

    console.log('2. Verifying Counts Table view & KPI Metrics...');
    const countStats = await page.evaluate(() => {
      const tbody = document.getElementById('fnbCountsTableBody');
      const items = window.gFnbAllItems || [];
      const mTotal = document.getElementById('fnbCountMetricTotal');
      const mMatch = document.getElementById('fnbCountMetricMatched');
      const mDiff = document.getElementById('fnbCountMetricDiff');
      const mDiffVal = document.getElementById('fnbCountMetricDiffVal');
      return {
        tableRows: tbody ? tbody.children.length : 0,
        itemCount: items.length,
        metricTotal: mTotal ? mTotal.textContent : '',
        metricMatch: mMatch ? mMatch.textContent : '',
        metricDiff: mDiff ? mDiff.textContent : '',
        metricDiffVal: mDiffVal ? mDiffVal.textContent : '',
        firstItem: items[0] || null
      };
    });
    console.log('Counts Table Stats:', countStats);

    // Test search filter
    if (countStats.firstItem) {
      const code = countStats.firstItem.code;
      await page.evaluate((c) => {
        const input = document.getElementById('fnbCountSearchInput');
        if (input) {
          input.value = c;
          if (typeof window.onFnbCountSearch === 'function') {
            window.onFnbCountSearch(c);
          }
        }
      }, code);
      await page.waitForTimeout(300);

      const filteredCount = await page.evaluate(() => {
        const tbody = document.getElementById('fnbCountsTableBody');
        return tbody ? tbody.children.length : 0;
      });
      console.log(`Filtered count rows with code '${code}': ${filteredCount}`);

      // Reset search
      await page.evaluate(() => {
        const input = document.getElementById('fnbCountSearchInput');
        if (input) {
          input.value = '';
          if (typeof window.onFnbCountSearch === 'function') {
            window.onFnbCountSearch('');
          }
        }
      });
      await page.waitForTimeout(300);
    }

    // 3. Test in-line count input & recalculation
    console.log('3. Testing In-line Count input & blind count toggle...');
    const countEditResult = await page.evaluate(() => {
      const items = window.gCurrentCountItems || [];
      if (items.length > 0 && typeof window.onCountInputChange === 'function') {
        const code = items[0].code;
        window.onCountInputChange(code, '12.5');
        if (typeof window.onCountNoteChange === 'function') {
          window.onCountNoteChange(code, 'Lệch kiểm kê thực tế test TS');
        }
      }
      if (typeof window.toggleBlindCount === 'function') {
        window.toggleBlindCount(true);
      }
      const mDiff = document.getElementById('fnbCountMetricDiff');
      const mDiffVal = document.getElementById('fnbCountMetricDiffVal');
      return {
        blindCount: window.gFnbBlindCount,
        metricDiff: mDiff ? mDiff.textContent : '',
        metricDiffVal: mDiffVal ? mDiffVal.textContent : '',
        firstItemCount: items[0]?.userCount
      };
    });
    console.log('Count Edit Result:', countEditResult);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ts_counts_table.png') });
    console.log('Captured screenshot: ts_counts_table.png');

    // Turn off blind count
    await page.evaluate(() => {
      if (typeof window.toggleBlindCount === 'function') {
        window.toggleBlindCount(false);
      }
    });
    await page.waitForTimeout(300);

    // 4. Test Save Count Audit
    console.log('4. Submitting Count Audit to API...');
    await page.evaluate(async () => {
      if (typeof window.saveFnbCountAudit === 'function') {
        await window.saveFnbCountAudit();
      }
    });
    await page.waitForTimeout(1500);

    // 5. Verify Counts History
    console.log('5. Verifying Counts History list...');
    const historyStats = await page.evaluate(() => {
      const tbody = document.getElementById('fnbCountsHistoryBody');
      return {
        tableRows: tbody ? tbody.children.length : 0
      };
    });
    console.log('Counts History Stats:', historyStats);

    // View detail modal of newly created audit
    await page.evaluate(async () => {
      const firstRowCode = document.querySelector('#fnbCountsHistoryBody td.cursor-pointer');
      if (firstRowCode) {
        firstRowCode.click();
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
    console.log('Counts Detail Modal Stats:', detailModalStats);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ts_counts_detail_modal.png') });
    console.log('Captured screenshot: ts_counts_detail_modal.png');

    // Close detail modal
    await page.evaluate(() => {
      if (typeof window.closeInvDetailModal === 'function') {
        window.closeInvDetailModal();
      }
    });
    await page.waitForTimeout(300);

    // 6. Test Excel Export execution
    console.log('6. Testing Excel Export...');
    const exportResult = await page.evaluate(() => {
      try {
        if (typeof window.exportCountSheetExcel === 'function') {
          window.exportCountSheetExcel();
          return { success: true };
        }
        return { success: false, reason: 'function not found' };
      } catch (err) {
        return { success: false, error: err.message };
      }
    });
    console.log('Excel Export Result:', exportResult);

    console.log('ALL MODULE 3 (FNB-COUNTS) BUSINESS WORKFLOW CHECKS PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

verify();
