import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const possiblePaths = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];
const executablePath = possiblePaths.find(p => fs.existsSync(p));

const artifactDir = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17';

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage({ viewport: { width: 1600, height: 960 } });

  page.on('console', msg => console.log('[BROWSER]', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('[PAGE ERROR]', err.message));

  console.log('Navigating to http://localhost:8787...');
  await page.goto('http://localhost:8787', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Authenticate & Dismiss auth modal
  await page.evaluate(() => {
    localStorage.setItem('orbit_user_site', 'K001');
    localStorage.setItem('orbit_user_email', 'trantuandai2508@gmail.com');
    localStorage.setItem('orbit_user_role', 'ADMIN');
    window.isForceAuthModal = false;
    const authModal = document.getElementById('googleAuthModal');
    if (authModal) authModal.classList.add('hidden');
    
    window.gCurrentUser = {
      email: 'trantuandai2508@gmail.com',
      name: 'Trần Tuấn Đại',
      role: 'ADMIN',
      assignedSite: 'K001',
      permissions: ['*']
    };
  });
  await page.waitForTimeout(500);

  // 1. Check sidebar text for fnb-receipts
  const tabNameCheck = await page.evaluate(() => {
    const navBtn = document.querySelector('[data-tab="fnb-receipts"]');
    const headerTitle = document.querySelector('#pageTitle');
    return {
      sidebarText: navBtn ? navBtn.textContent.trim() : null,
      headerTitleText: headerTitle ? headerTitle.textContent.trim() : null
    };
  });
  console.log('Tab name check:', tabNameCheck);

  // 2. Switch to fnb-receipts tab
  await page.evaluate(() => {
    if (typeof switchTab === 'function') {
      switchTab('fnb-receipts');
    }
  });
  await page.waitForTimeout(1000);

  // Check header title after switch
  const receiptTitle = await page.evaluate(() => {
    const h1 = document.querySelector('#view-fnb-receipts h1');
    return h1 ? h1.textContent.trim() : null;
  });
  console.log('fnb-receipts H1 title:', receiptTitle);

  // 3. Open manual receipt modal and add items to test table width
  await page.evaluate(async () => {
    if (typeof openManualReceiptModal === 'function') {
      await openManualReceiptModal('K001');
    } else {
      const modal = document.getElementById('modalManualReceipt');
      if (modal) modal.classList.remove('hidden');
    }
    // Add 2 mock lines to test table layout
    window.gManualReceiptLines = [
      {
        item_code: 'GV-001',
        item_name: 'Dầu ăn thực vật cao cấp Simply 5L',
        unit: 'Can 5L',
        qty: 10,
        unit_price: 245000,
        batch_code: 'LOT20261125-01',
        exp_date: '2027-11-25',
        storage_loc: 'Kệ A1 - Tầng 2'
      },
      {
        item_code: 'GV-002',
        item_name: 'Nước mắm cá cơm truyền thống Phan Thiết 40 độ đạm chai 500ml',
        unit: 'Chai',
        qty: 24,
        unit_price: 55000,
        batch_code: 'LOT20261125-02',
        exp_date: '2027-05-15',
        storage_loc: 'Kệ B2 - Tầng 1'
      }
    ];
    if (typeof renderManualReceiptLinesTable === 'function') {
      renderManualReceiptLinesTable();
    }
  });
  await page.waitForTimeout(1000);

  // Check manual modal layout metrics
  const manualModalMetrics = await page.evaluate(() => {
    const modal = document.getElementById('modalManualReceipt');
    const innerCard = modal ? modal.querySelector('div') : null;
    const tableWrapper = document.getElementById('manualLinesTableWrapper');
    const table = tableWrapper ? tableWrapper.querySelector('table') : null;
    return {
      modalVisible: modal && !modal.classList.contains('hidden'),
      cardWidth: innerCard ? innerCard.offsetWidth : 0,
      wrapperWidth: tableWrapper ? tableWrapper.offsetWidth : 0,
      tableWidth: table ? table.offsetWidth : 0,
      scrollWidth: tableWrapper ? tableWrapper.scrollWidth : 0,
      clientWidth: tableWrapper ? tableWrapper.clientWidth : 0,
      hasHorizontalScroll: tableWrapper ? tableWrapper.scrollWidth > tableWrapper.clientWidth + 2 : false
    };
  });
  console.log('Manual Receipt Modal metrics:', manualModalMetrics);

  const manualScreenshotPath = path.join(artifactDir, 'manual_receipt_modal_expanded.png');
  await page.screenshot({ path: manualScreenshotPath });
  console.log('Saved screenshot:', manualScreenshotPath);

  // Close manual modal
  await page.evaluate(() => {
    if (typeof closeManualReceiptModal === 'function') {
      closeManualReceiptModal();
    } else {
      const modal = document.getElementById('modalManualReceipt');
      if (modal) modal.classList.add('hidden');
    }
  });
  await page.waitForTimeout(500);

  // 4. Check tabVisibilityModal
  await page.evaluate(() => {
    if (typeof openTabVisibilityModal === 'function') {
      openTabVisibilityModal();
    } else {
      const m = document.getElementById('tabVisibilityModal');
      if (m) m.classList.remove('hidden');
    }
  });
  await page.waitForTimeout(1000);

  const tabVisMetrics = await page.evaluate(() => {
    const m = document.getElementById('tabVisibilityModal');
    const card = m ? m.querySelector('.animate-scale-up') : null;
    return {
      visible: m && !m.classList.contains('hidden'),
      cardWidth: card ? card.offsetWidth : 0
    };
  });
  console.log('Tab Visibility Modal metrics:', tabVisMetrics);
  const tabVisScreenshotPath = path.join(artifactDir, 'tab_visibility_modal_expanded.png');
  await page.screenshot({ path: tabVisScreenshotPath });

  await page.evaluate(() => {
    if (typeof closeTabVisibilityModal === 'function') {
      closeTabVisibilityModal();
    } else {
      const m = document.getElementById('tabVisibilityModal');
      if (m) m.classList.add('hidden');
    }
  });
  await page.waitForTimeout(500);

  // 5. Check createWasteModal
  await page.evaluate(() => {
    if (typeof openCreateWasteModal === 'function') {
      openCreateWasteModal();
    } else {
      const m = document.getElementById('createWasteModal');
      if (m) m.classList.remove('hidden');
    }
  });
  await page.waitForTimeout(1000);

  const wasteMetrics = await page.evaluate(() => {
    const m = document.getElementById('createWasteModal');
    const card = m ? m.querySelector('.animate-scale-up') : null;
    return {
      visible: m && !m.classList.contains('hidden'),
      cardWidth: card ? card.offsetWidth : 0
    };
  });
  console.log('Create Waste Modal metrics:', wasteMetrics);
  const wasteScreenshotPath = path.join(artifactDir, 'create_waste_modal_expanded.png');
  await page.screenshot({ path: wasteScreenshotPath });

  await page.evaluate(() => {
    if (typeof closeCreateWasteModal === 'function') {
      closeCreateWasteModal();
    } else {
      const m = document.getElementById('createWasteModal');
      if (m) m.classList.add('hidden');
    }
  });
  await page.waitForTimeout(500);

  // 6. Check modalKitchenIssueDetail
  await page.evaluate(() => {
    const m = document.getElementById('modalKitchenIssueDetail');
    if (m) m.classList.remove('hidden');
  });
  await page.waitForTimeout(1000);
  const kitchenMetrics = await page.evaluate(() => {
    const m = document.getElementById('modalKitchenIssueDetail');
    const card = m ? m.querySelector('.animate-scale-up') : null;
    return {
      visible: m && !m.classList.contains('hidden'),
      cardWidth: card ? card.offsetWidth : 0
    };
  });
  console.log('Kitchen Issue Modal metrics:', kitchenMetrics);
  const kitchenScreenshotPath = path.join(artifactDir, 'kitchen_issue_modal_expanded.png');
  await page.screenshot({ path: kitchenScreenshotPath });

  await browser.close();
  console.log('ALL CHECKS FINISHED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
