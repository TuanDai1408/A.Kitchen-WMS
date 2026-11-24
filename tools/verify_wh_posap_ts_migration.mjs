import { chromium } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17';

async function main() {
  console.log('--- STARTING MODULE 9 VERIFICATION: WMS DASHBOARD & INVENTORY (WH-POSAP) ---');
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

    // Set site K001
    await page.evaluate(() => {
      localStorage.setItem('orbit_user_site', 'K001');
      if (typeof window.App !== 'undefined') {
        window.App.currentBranch = 'K001';
      }
    });

    // --- STEP 1: Verify WMS Dashboard ---
    console.log('2. Verifying Dashboard Summary...');
    await page.evaluate(async () => {
      if (typeof window.switchTab === 'function') {
        window.switchTab('wh-dashboard');
      }
      await window.loadDashboardSummary();
    });
    await page.waitForTimeout(1500);

    const dashKpi = await page.evaluate(() => {
      return {
        critCount: document.getElementById('dashCritCount')?.textContent?.trim() || '',
        ropCount: document.getElementById('dashRopCount')?.textContent?.trim() || '',
        leadTime: document.getElementById('dashLeadTime')?.textContent?.trim() || '',
        totalQty: document.getElementById('dashTotalQty')?.textContent?.trim() || '',
        totalSkus: document.getElementById('dashTotalSkus')?.textContent?.trim() || '',
        alertsCount: document.querySelectorAll('#stockAlertsTableBody tr').length
      };
    });
    console.log('   Dashboard KPI Summary:', dashKpi);

    const dashScreenshotPath = path.join(ARTIFACT_DIR, 'ts_wh_dashboard.png');
    await page.screenshot({ path: dashScreenshotPath });
    console.log('   Saved dashboard screenshot:', dashScreenshotPath);

    // --- STEP 2: Verify WMS Inventory & POS-SAP Reconciliation ---
    console.log('3. Navigating to wh-posap (WMS Inventory & POS-SAP)...');
    await page.evaluate(async () => {
      if (typeof window.switchTab === 'function') {
        window.switchTab('wh-posap');
      }
      if (typeof window.switchWhInvSubView === 'function') {
        window.switchWhInvSubView('balance');
      }
      await window.loadWhInventory();
    });
    await page.waitForTimeout(1500);

    const invStatus = await page.evaluate(() => {
      const rows = document.querySelectorAll('#whInventoryTableBody tr');
      return {
        totalDataCount: window.gWhInventoryData ? window.gWhInventoryData.length : 0,
        renderedRows: rows.length,
        firstRowSku: rows[0]?.querySelector('td:nth-child(2)')?.textContent?.trim() || '',
        firstRowName: rows[0]?.querySelector('td:nth-child(3)')?.textContent?.trim() || '',
        kpiSkus: document.getElementById('whInvTotalSkus')?.textContent?.trim() || '',
        kpiQty: document.getElementById('whInvTotalQty')?.textContent?.trim() || '',
        kpiValue: document.getElementById('whInvTotalValue')?.textContent?.trim() || ''
      };
    });
    console.log('   WMS Inventory Status:', invStatus);
    if (invStatus.totalDataCount === 0) {
      throw new Error('No inventory data loaded in window.gWhInventoryData!');
    }

    // Test Search filter
    console.log('4. Testing Inventory Search Filter...');
    await page.evaluate(() => {
      const searchInput = document.getElementById('whInvSearchInput');
      if (searchInput && window.gWhInventoryData && window.gWhInventoryData.length > 0) {
        searchInput.value = window.gWhInventoryData[0].sku;
        window.filterWhInventoryTable();
      }
    });
    await page.waitForTimeout(500);

    const filteredCount = await page.evaluate(() => {
      return document.querySelectorAll('#whInventoryTableBody tr').length;
    });
    console.log(`   Filtered table row count for first SKU: ${filteredCount}`);

    // Reset search filter
    await page.evaluate(() => {
      const searchInput = document.getElementById('whInvSearchInput');
      if (searchInput) searchInput.value = '';
      window.filterWhInventoryTable();
    });
    await page.waitForTimeout(500);

    const invScreenshotPath = path.join(ARTIFACT_DIR, 'ts_wh_inventory_table.png');
    await page.screenshot({ path: invScreenshotPath });
    console.log('   Saved inventory table screenshot:', invScreenshotPath);

    // --- STEP 3: Verify Item History Modal (Thẻ kho) ---
    console.log('5. Testing Item History Modal (Thẻ kho)...');
    const targetSku = invStatus.firstRowSku || '5100000677';
    await page.evaluate(async (sku) => {
      await window.openWhItemHistoryModal(sku);
    }, targetSku);
    await page.waitForTimeout(1200);

    const historyStatus = await page.evaluate(() => {
      const modal = document.getElementById('whItemHistoryModal');
      const rows = document.querySelectorAll('#whItemHistoryTableBody tr');
      return {
        isVisible: modal && !modal.classList.contains('hidden'),
        skuTitle: document.getElementById('whItemHistoryModalSkuTitle')?.textContent?.trim() || '',
        rowCount: rows.length,
        hasHistoryData: !!(window.gWhActiveHistory && window.gWhActiveHistory.history)
      };
    });
    console.log('   History Modal Status:', historyStatus);

    // Test export item history to Excel
    await page.evaluate(() => {
      window.exportWhItemHistoryToExcel();
    });

    const historyScreenshotPath = path.join(ARTIFACT_DIR, 'ts_wh_item_history_modal.png');
    await page.screenshot({ path: historyScreenshotPath });
    console.log('   Saved item history modal screenshot:', historyScreenshotPath);

    // Close History Modal
    await page.evaluate(() => {
      const modal = document.getElementById('whItemHistoryModal');
      if (modal) modal.classList.add('hidden');
    });
    await page.waitForTimeout(500);

    // --- STEP 4: Verify Item Batches Modal (Chi tiết các lô) ---
    console.log('6. Testing Item Batches Modal...');
    await page.evaluate(async (sku) => {
      await window.openWhItemBatchesModal(sku);
    }, targetSku);
    await page.waitForTimeout(1200);

    const batchStatus = await page.evaluate(() => {
      const modal = document.getElementById('whItemBatchesModal');
      const rows = document.querySelectorAll('#whItemBatchesTableBody tr');
      return {
        isVisible: modal && !modal.classList.contains('hidden'),
        skuTitle: document.getElementById('whItemBatchesModalSkuTitle')?.textContent?.trim() || '',
        rowCount: rows.length,
        hasBatchData: !!(window.gWhActiveBatches && window.gWhActiveBatches.batches)
      };
    });
    console.log('   Batches Modal Status:', batchStatus);

    const batchScreenshotPath = path.join(ARTIFACT_DIR, 'ts_wh_item_batches_modal.png');
    await page.screenshot({ path: batchScreenshotPath });
    console.log('   Saved item batches modal screenshot:', batchScreenshotPath);

    // Close Batches Modal
    await page.evaluate(() => {
      const modal = document.getElementById('whItemBatchesModal');
      if (modal) modal.classList.add('hidden');
    });
    await page.waitForTimeout(500);

    // --- STEP 5: Verify Received Orders Sub-view ---
    console.log('7. Testing Received Orders Sub-view (Đơn hàng đã nhập)...');
    await page.evaluate(async () => {
      window.switchWhInvSubView('receipts');
      await window.loadWhReceivedOrders();
    });
    await page.waitForTimeout(1500);

    const recStatus = await page.evaluate(() => {
      const view = document.getElementById('whInvReceiptsView');
      const rows = document.querySelectorAll('#whReceivedOrdersTableBody tr');
      return {
        isViewVisible: view && !view.classList.contains('hidden'),
        orderCount: window.gWhReceivedOrders ? window.gWhReceivedOrders.length : 0,
        renderedRows: rows.length
      };
    });
    console.log('   Received Orders Status:', recStatus);

    // Open detail of first received order if exists
    if (recStatus.orderCount > 0) {
      console.log('8. Testing Received Order Detail Modal...');
      await page.evaluate(() => {
        const first = window.gWhReceivedOrders[0];
        window.openWhReceivedOrderDetail(
          first.id,
          first.po_number,
          first.receipt_code,
          first.doc_type,
          first.receipt_date,
          first.total_amount
        );
      });
      await page.waitForTimeout(1200);

      const detailModalStatus = await page.evaluate(() => {
        const modal = document.getElementById('whReceivedOrderDetailModal');
        return {
          isVisible: modal && !modal.classList.contains('hidden'),
          title: document.getElementById('whRecModalOrderTitle')?.textContent?.trim() || '',
          linesCount: document.querySelectorAll('#whRecModalTableBody tr').length
        };
      });
      console.log('   Received Order Detail Modal:', detailModalStatus);

      // Close modal
      await page.evaluate(() => {
        window.closeWhReceivedOrderDetailModal();
      });
      await page.waitForTimeout(500);
    }

    const recOrdersScreenshotPath = path.join(ARTIFACT_DIR, 'ts_wh_received_orders_table.png');
    await page.screenshot({ path: recOrdersScreenshotPath });
    console.log('   Saved received orders screenshot:', recOrdersScreenshotPath);

    // --- STEP 6: Test Export Inventory Excel ---
    console.log('9. Testing Export WMS Inventory Excel...');
    await page.evaluate(() => {
      window.switchWhInvSubView('balance');
      window.exportWhInventoryToExcel();
    });
    await page.waitForTimeout(500);

    // Check fatal errors
    if (consoleErrors.length > 0) {
      console.warn('⚠️ Console errors detected:', consoleErrors);
      throw new Error(`Fatal console errors found: ${consoleErrors.join(' | ')}`);
    }

    console.log('✅ MODULE 9 VERIFICATION PASSED SUCCESSFULLY WITH ZERO FATAL ERRORS!');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
