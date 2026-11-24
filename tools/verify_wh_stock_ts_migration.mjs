import { chromium } from 'playwright-core';
import path from 'path';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE_URL = 'http://localhost:8787';
const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17';

async function verifyWhStockTsMigration() {
  console.log('🚀 Starting Verification: FEFO Stock Management (wh-stock) TypeScript Migration...');

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
        hasLoadStockFEFO: typeof window.loadStockFEFO === 'function',
        hasRenderFefoRows: typeof window.renderFefoRows === 'function',
        hasFilterFefoLive: typeof window.filterFefoLive === 'function',
        hasChangeStockPage: typeof window.changeStockPage === 'function',
        hasSortStockBy: typeof window.sortStockBy === 'function',
        hasResetFefoFilters: typeof window.resetFefoFilters === 'function',
        hasToggleSelectAllStock: typeof window.toggleSelectAllStock === 'function',
        hasToggleStockItemSelect: typeof window.toggleStockItemSelect === 'function',
        hasUpdateStockBulkBar: typeof window.updateStockBulkBar === 'function',
        hasClearStockSelection: typeof window.clearStockSelection === 'function',
        hasExportFefoToExcel: typeof window.exportFefoToExcel === 'function',
        hasExportSelectedStockExcel: typeof window.exportSelectedStockExcel === 'function',
        hasOpenReceiptModal: typeof window.openReceiptModal === 'function',
        hasOpenIssueModal: typeof window.openIssueModal === 'function',
        hasSubmitReceiptToBackend: typeof window.submitReceiptToBackend === 'function',
        hasSubmitIssueToBackend: typeof window.submitIssueToBackend === 'function',
        hasOpenEditItemModal: typeof window.openEditItemModal === 'function',
        hasSaveItemSpecs: typeof window.saveItemSpecs === 'function',
        hasOpenItemDetailModal: typeof window.openItemDetailModal === 'function'
      };
    });

    console.log('📊 Globals Check:', globalsCheck);
    for (const [fnName, isPresent] of Object.entries(globalsCheck)) {
      if (!isPresent) {
        throw new Error(`Expected global function ${fnName} to be defined!`);
      }
    }

    // 2. Switch to wh-stock tab & wait for loadStockFEFO
    console.log('🔄 Switching to wh-stock tab & loading FEFO stock...');
    await page.evaluate(async () => {
      window.switchTab('wh-stock');
      await window.loadStockFEFO();
    });
    await page.waitForTimeout(1000);

    // 3. Verify stock items loaded and rendered in table
    const stockState = await page.evaluate(() => {
      const items = window.App?.fefoItems || [];
      const tbody = document.getElementById('fefoTableBody');
      const rows = tbody ? tbody.querySelectorAll('tr').length : 0;
      const totalCountEl = document.getElementById('stockTotalCount');
      const pageBadgeEl = document.getElementById('stockCurrentPageBadge');

      const firstItem = items[0] ? {
        sku: items[0].sku,
        item_name: items[0].item_name,
        category: items[0].category,
        qty: items[0].qty,
        exp_date: items[0].exp_date,
        fefo_priority: items[0].fefo_priority,
        danger_level: items[0].danger_level
      } : null;

      return {
        itemsCount: items.length,
        renderedRows: rows,
        totalCountText: totalCountEl ? totalCountEl.textContent : null,
        pageBadgeText: pageBadgeEl ? pageBadgeEl.textContent : null,
        firstItem
      };
    });

    console.log('📦 FEFO Stock State:', stockState);
    if (stockState.itemsCount === 0 || stockState.renderedRows === 0) {
      throw new Error('FEFO stock items not loaded or table not rendered!');
    }
    console.log(`✅ Loaded ${stockState.itemsCount} FEFO stock items, rendered ${stockState.renderedRows} items on page 1.`);

    // Screenshot main stock table
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'ts_wh_stock_table.png'),
      fullPage: false
    });

    // 4. Test Search Filter
    console.log('🔍 Testing Search Filter ("Thịt")...');
    await page.fill('#fefoSearchInput', 'Thịt');
    await page.waitForTimeout(400);

    const searchState = await page.evaluate(() => {
      const tbody = document.getElementById('fefoTableBody');
      const rows = tbody ? Array.from(tbody.querySelectorAll('tr')) : [];
      const texts = rows.map(r => r.textContent || '');
      return {
        rowCount: rows.length,
        allMatch: texts.every(t => t.toLowerCase().includes('thịt'))
      };
    });

    console.log('🔍 Search Results:', searchState);
    if (searchState.rowCount === 0 || !searchState.allMatch) {
      throw new Error('Search filter did not correctly filter items!');
    }
    console.log(`✅ Search correctly returned ${searchState.rowCount} matching rows.`);

    // Reset search
    await page.evaluate(() => {
      window.resetFefoFilters();
    });
    await page.waitForTimeout(300);

    // 5. Test Sorting (by QTY)
    console.log('🔄 Testing Sorting by QTY...');
    await page.evaluate(() => {
      window.sortStockBy('qty');
    });
    await page.waitForTimeout(300);

    // 6. Test Pagination
    console.log('📄 Testing Pagination Next/Prev...');
    await page.evaluate(() => {
      window.changeStockPage(1);
    });
    await page.waitForTimeout(300);

    const page2Badge = await page.evaluate(() => {
      return document.getElementById('stockCurrentPageBadge')?.textContent;
    });
    console.log('📄 Page 2 Badge:', page2Badge);
    if (!page2Badge || !page2Badge.startsWith('2/')) {
      throw new Error(`Expected page 2, got: ${page2Badge}`);
    }

    await page.evaluate(() => {
      window.changeStockPage(-1);
    });
    await page.waitForTimeout(300);

    // 7. Test Row Selection & Bulk Action Bar
    console.log('☑️ Testing Row Selection & Bulk Bar...');
    await page.evaluate(() => {
      window.toggleSelectAllStock(true);
    });
    await page.waitForTimeout(200);

    const bulkState = await page.evaluate(() => {
      const bar = document.getElementById('stockBulkActionBar');
      const countEl = document.getElementById('selectedStockCount');
      return {
        barVisible: bar && !bar.classList.contains('hidden'),
        selectedCount: countEl ? parseInt(countEl.textContent || '0', 10) : 0,
        selectedSetSize: window.selectedStockSkus ? window.selectedStockSkus.size : 0
      };
    });

    console.log('☑️ Bulk State:', bulkState);
    if (!bulkState.barVisible || bulkState.selectedCount === 0) {
      throw new Error('Bulk selection bar failed to appear or count is 0!');
    }
    console.log(`✅ Bulk selection verified with ${bulkState.selectedCount} selected rows.`);

    // Clear selection
    await page.evaluate(() => {
      window.clearStockSelection();
    });
    await page.waitForTimeout(200);

    // 8. Test Item Detail Modal
    console.log(`🔍 Testing Item Detail Modal for SKU: ${stockState.firstItem.sku}...`);
    await page.evaluate(async (sku) => {
      await window.openItemDetailModal(sku);
    }, stockState.firstItem.sku);
    await page.waitForTimeout(800);

    const detailModalState = await page.evaluate(() => {
      const modal = document.getElementById('modalInventoryDetail');
      const skuEl = document.getElementById('detailItemSku');
      const nameEl = document.getElementById('detailItemName');
      const costEl = document.getElementById('detailStandardCost');
      return {
        visible: modal && !modal.classList.contains('hidden'),
        sku: skuEl ? skuEl.textContent : '',
        name: nameEl ? nameEl.textContent : '',
        cost: costEl ? costEl.textContent : ''
      };
    });

    console.log('📋 Detail Modal State:', detailModalState);
    if (!detailModalState.visible || !detailModalState.sku) {
      throw new Error('Item Detail Modal failed to open or populate SKU!');
    }
    console.log(`✅ Item Detail Modal verified for ${detailModalState.sku} (${detailModalState.name})`);

    // Screenshot Detail Modal
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'ts_wh_stock_detail_modal.png'),
      fullPage: false
    });

    // Close detail modal
    await page.evaluate(() => {
      window.closeModal('modalInventoryDetail');
    });
    await page.waitForTimeout(300);

    // 9. Test Edit Item Specs Modal
    console.log('✏️ Testing Edit Item Specs Modal...');
    await page.evaluate((sku) => {
      window.openEditItemModal(sku);
    }, stockState.firstItem.sku);
    await page.waitForTimeout(400);

    const editModalState = await page.evaluate(() => {
      const modal = document.getElementById('modalEditItem');
      const skuInput = document.getElementById('editItemSku');
      const nameInput = document.getElementById('editItemName');
      const safetyInput = document.getElementById('editItemSafetyStock');
      return {
        visible: modal && !modal.classList.contains('hidden'),
        sku: skuInput ? skuInput.value : '',
        name: nameInput ? nameInput.value : '',
        safety: safetyInput ? safetyInput.value : ''
      };
    });

    console.log('✏️ Edit Modal State:', editModalState);
    if (!editModalState.visible || !editModalState.sku) {
      throw new Error('Edit Item Modal failed to open or populate fields!');
    }
    console.log(`✅ Edit Item Modal verified for ${editModalState.sku}`);

    // Screenshot Edit Modal
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'ts_wh_stock_edit_modal.png'),
      fullPage: false
    });

    // Close edit modal
    await page.evaluate(() => {
      window.closeModal('modalEditItem');
    });
    await page.waitForTimeout(300);

    // 10. Test Fast Issue Modal
    console.log('📦 Testing Fast Issue Modal...');
    await page.evaluate((item) => {
      window.openIssueModal(item.sku, item.item_name, 'LÔ-261122-A1', 10);
    }, stockState.firstItem);
    await page.waitForTimeout(400);

    const issueModalState = await page.evaluate(() => {
      const modal = document.getElementById('modalFastIssue');
      const skuInput = document.getElementById('issueSku');
      const batchLabel = document.getElementById('issueBatchLabel');
      return {
        visible: modal && !modal.classList.contains('hidden'),
        sku: skuInput ? skuInput.value : '',
        labelContent: batchLabel ? batchLabel.textContent : ''
      };
    });

    console.log('📦 Fast Issue Modal State:', issueModalState);
    if (!issueModalState.visible || !issueModalState.sku) {
      throw new Error('Fast Issue Modal failed to open or populate SKU!');
    }
    console.log('✅ Fast Issue Modal verified.');

    // Screenshot Fast Issue Modal
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'ts_wh_stock_issue_modal.png'),
      fullPage: false
    });

    // Close issue modal
    await page.evaluate(() => {
      window.closeModal('modalFastIssue');
    });
    await page.waitForTimeout(300);

    // 11. Test Excel Export execution (prevent download pop-up blocking)
    console.log('📊 Testing exportFefoToExcel function execution...');
    const exportResult = await page.evaluate(() => {
      try {
        // Mock XLSX.writeFile to capture workbook without triggering browser download
        const originalWrite = window.XLSX.writeFile;
        let interceptedFileName = null;
        let interceptedSheets = null;
        window.XLSX.writeFile = (wb, fName) => {
          interceptedFileName = fName;
          interceptedSheets = wb.SheetNames;
        };

        window.exportFefoToExcel();

        window.XLSX.writeFile = originalWrite;
        return { success: true, fileName: interceptedFileName, sheets: interceptedSheets };
      } catch (e) {
        return { success: false, error: e.message };
      }
    });

    console.log('📊 Excel Export Result:', exportResult);
    if (!exportResult.success || !exportResult.fileName) {
      throw new Error(`Export Excel failed: ${exportResult.error || 'No file generated'}`);
    }
    console.log(`✅ Excel export verified: ${exportResult.fileName} [${exportResult.sheets?.join(', ')}]`);

    // 12. Check Console Errors
    console.log('🩺 Verifying console health...');
    if (consoleErrors.length > 0) {
      console.warn('⚠️ Console errors detected:', consoleErrors);
      const fatalErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('404') && !e.includes('403') && !e.includes('GSI_LOGGER'));
      if (fatalErrors.length > 0) {
        throw new Error(`Fatal console errors found during verification: ${fatalErrors.join('; ')}`);
      }
    } else {
      console.log('✅ Zero console errors detected.');
    }

    console.log('🎉 ALL BUSINESS FLOW CHECKS PASSED FOR MODULE 7: WH-STOCK!');
  } finally {
    await browser.close();
  }
}

verifyWhStockTsMigration().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
