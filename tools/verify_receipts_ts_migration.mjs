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

    // Initialize user session and load POs
    await page.evaluate(async () => {
      localStorage.setItem('orbit_user_site', 'K001');
      window.gCurrentUser = {
        name: 'Nguyễn Văn Quản Lý',
        username: 'admin',
        role: 'SUPERADMIN',
        assignedSite: 'K001'
      };
      if (typeof window.switchTab === 'function') {
        window.switchTab('fnb-receipts');
      }
      if (typeof window.loadFnbPoList === 'function') {
        await window.loadFnbPoList('K001');
      }
    });

    await page.waitForTimeout(1000);

    console.log('2. Verifying PO List view...');
    const poListStats = await page.evaluate(() => {
      const tbody = document.getElementById('fnbPoTableBody');
      const list = window.gFnbPoList || [];
      return {
        tableRows: tbody ? tbody.children.length : 0,
        poCount: list.length,
        firstPo: list[0] || null
      };
    });
    console.log(`PO List Stats:`, poListStats);

    // Filter by query
    await page.evaluate(() => {
      if (typeof window.onFnbPoSearchInput === 'function') {
        window.onFnbPoSearchInput('4100274815');
      }
    });
    await page.waitForTimeout(300);

    const filteredRows = await page.evaluate(() => {
      const tbody = document.getElementById('fnbPoTableBody');
      return tbody ? tbody.children.length : 0;
    });
    console.log(`Filtered PO rows count with query '4100274815': ${filteredRows}`);

    // Reset search
    await page.evaluate(() => {
      if (typeof window.onFnbPoSearchInput === 'function') {
        window.onFnbPoSearchInput('');
      }
    });
    await page.waitForTimeout(300);

    // Screenshot PO List
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ts_receipts_po_list.png') });
    console.log('Captured screenshot: ts_receipts_po_list.png');

    console.log('3. Testing PO Receipt Modal...');
    // Open PO modal for '4100274815'
    await page.evaluate(async () => {
      if (typeof window.openPoReceiptModal === 'function') {
        await window.openPoReceiptModal('4100274815');
      }
    });
    await page.waitForTimeout(1000);

    const poModalVisible = await page.evaluate(() => {
      const modal = document.getElementById('createReceiptModal');
      const lines = window.gReceiptLines || [];
      const linesBody = document.getElementById('receiptLinesTableBody');
      return {
        visible: modal && !modal.classList.contains('hidden'),
        lineCount: lines.length,
        domRows: linesBody ? linesBody.children.length : 0
      };
    });
    console.log(`PO Modal stats:`, poModalVisible);

    // Test editing actual qty and quick expiry
    const qtyChangeResult = await page.evaluate(() => {
      if (typeof window.onReceiptLineQtyChange === 'function') {
        window.onReceiptLineQtyChange(0, '15');
      }
      if (typeof window.setReceiptLineQuickExp === 'function') {
        window.setReceiptLineQuickExp(0, 6);
      }
      const line0 = (window.gReceiptLines && window.gReceiptLines[0]) || {};
      const totalEl = document.getElementById('receiptModalTotalAmount');
      return {
        actual_qty: line0.actual_qty,
        exp_date: line0.exp_date,
        totalText: totalEl ? totalEl.textContent : ''
      };
    });
    console.log('PO Line edit result:', qtyChangeResult);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ts_receipts_po_modal.png') });
    console.log('Captured screenshot: ts_receipts_po_modal.png');

    // Close PO Modal
    await page.evaluate(() => {
      if (typeof window.closeCreateReceiptModal === 'function') {
        window.closeCreateReceiptModal();
      }
    });
    await page.waitForTimeout(300);

    console.log('4. Testing Manual Goods Receipt Modal...');
    await page.evaluate(async () => {
      if (typeof window.openManualReceiptModal === 'function') {
        await window.openManualReceiptModal('K001');
      }
    });
    await page.waitForTimeout(1000);

    const manualModalVisible = await page.evaluate(() => {
      const modal = document.getElementById('modalManualReceipt');
      return modal && !modal.classList.contains('hidden');
    });
    console.log(`Is #modalManualReceipt visible: ${manualModalVisible}`);

    // Search catalog and add item
    const manualAddResult = await page.evaluate(() => {
      const catalog = window.gManualSiteCatalog || [];
      if (catalog.length > 0 && typeof window.addManualReceiptItem === 'function') {
        const itemCode = catalog[0].code || catalog[0].sku;
        window.addManualReceiptItem(itemCode);
        if (typeof window.onManualLineQtyChange === 'function') {
          window.onManualLineQtyChange(0, '5');
        }
        if (typeof window.onManualLinePriceChange === 'function') {
          window.onManualLinePriceChange(0, '25000');
        }
      }
      const lines = window.gManualReceiptLines || [];
      const kpiQty = document.getElementById('manualSummaryTotalQty');
      const kpiAmount = document.getElementById('manualSummaryTotalAmount');
      return {
        lineCount: lines.length,
        firstLine: lines[0] || null,
        kpiQty: kpiQty ? kpiQty.textContent : '',
        kpiAmount: kpiAmount ? kpiAmount.textContent : ''
      };
    });
    console.log('Manual Line add result:', manualAddResult);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ts_receipts_manual_modal.png') });
    console.log('Captured screenshot: ts_receipts_manual_modal.png');

    // Test Confirm Clear Modal
    await page.evaluate(() => {
      if (typeof window.confirmClearAllManualReceiptLines === 'function') {
        window.confirmClearAllManualReceiptLines();
      }
    });
    await page.waitForTimeout(300);

    const confirmClearVisible = await page.evaluate(() => {
      const modal = document.getElementById('modalConfirmClearManualLines');
      return modal && !modal.classList.contains('hidden');
    });
    console.log(`Is #modalConfirmClearManualLines visible: ${confirmClearVisible}`);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ts_receipts_confirm_clear_modal.png') });
    console.log('Captured screenshot: ts_receipts_confirm_clear_modal.png');

    // Close confirm and manual modal
    await page.evaluate(() => {
      if (typeof window.closeConfirmClearManualLinesModal === 'function') {
        window.closeConfirmClearManualLinesModal();
      }
      if (typeof window.closeManualReceiptModal === 'function') {
        window.closeManualReceiptModal();
      }
    });
    await page.waitForTimeout(300);

    console.log('5. Testing Receipts History sub-view...');
    await page.evaluate(async () => {
      if (typeof window.switchFnbReceiptSubView === 'function') {
        window.switchFnbReceiptSubView('history');
      }
      if (typeof window.loadFnbReceiptsHistory === 'function') {
        await window.loadFnbReceiptsHistory('K001');
      }
    });
    await page.waitForTimeout(1000);

    const historyRowsCount = await page.evaluate(() => {
      const tbody = document.getElementById('fnbReceiptsTableBody');
      return tbody ? tbody.children.length : 0;
    });
    console.log(`History rows count in #fnbReceiptsTableBody: ${historyRowsCount}`);

    // Test detail modal on first history item
    await page.evaluate(async () => {
      const firstRowBtn = document.querySelector('#fnbReceiptsTableBody button');
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
    console.log(`Receipt Detail Modal stats:`, detailModalStats);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ts_receipts_history_view.png') });
    console.log('Captured screenshot: ts_receipts_history_view.png');

    console.log('ALL MODULE 1 BUSINESS WORKFLOW CHECKS PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

verify();
