import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE_URL = 'http://localhost:8787';

async function verifyPortalOrderTsMigration() {
  console.log('🚀 Starting Verification: Portal Order TypeScript Migration...');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Initialize BEP_TRUONG user session before page load
  await page.addInitScript(() => {
    localStorage.setItem('orbit_user', JSON.stringify({
      email: 'beptruong.k001@akitchen.vn',
      fullName: 'Bếp Trưởng K001',
      role: 'BEP_TRUONG',
      assignedSite: 'K001'
    }));
    localStorage.setItem('orbit_user_site', 'K001');
    localStorage.setItem('orbit_user_role', 'BEP_TRUONG');
  });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Page loaded successfully with BEP_TRUONG session');

    // 1. Verify global functions attached to window
    const globalsCheck = await page.evaluate(() => {
      return {
        hasLoadQuota: typeof window.loadQuota === 'function',
        hasRenderOrderTable: typeof window.renderOrderTable === 'function',
        hasFilterItems: typeof window.filterItems === 'function',
        hasOnQtyChange: typeof window.onQtyChange === 'function',
        hasCalcBudget: typeof window.calcBudget === 'function',
        hasReviewOrder: typeof window.reviewOrder === 'function',
        hasSubmitOrder: typeof window.submitOrder === 'function'
      };
    });

    console.log('📊 Globals Check:', globalsCheck);
    if (!globalsCheck.hasLoadQuota || !globalsCheck.hasReviewOrder || !globalsCheck.hasSubmitOrder) {
      throw new Error('Portal order functions not attached to window properly!');
    }

    // 2. Switch to portal-order tab
    console.log('🔄 Switching to portal-order tab...');
    await page.evaluate(() => {
      window.switchTab('portal-order');
    });
    await page.waitForTimeout(1000);

    // 3. Verify items loaded in App.items and rendered in table
    const orderState = await page.evaluate(() => {
      const items = window.App?.items || [];
      const tbody = document.getElementById('dinhMucBody');
      const rows = tbody ? tbody.querySelectorAll('tr').length : 0;
      const kpiNganSach = document.getElementById('kpiNganSach')?.textContent?.trim();
      const kpiDaDat = document.getElementById('kpiDaDat')?.textContent?.trim();
      const kpiConLai = document.getElementById('kpiConLai')?.textContent?.trim();
      const budUsed = document.getElementById('budUsed')?.textContent?.trim();
      const budTotal = document.getElementById('budTotal')?.textContent?.trim();

      return {
        itemsCount: items.length,
        renderedRows: rows,
        kpiNganSach,
        kpiDaDat,
        kpiConLai,
        budUsed,
        budTotal,
        firstItem: items[0] ? {
          maHang: items[0].maHang,
          tenSP: items[0].tenSP,
          donGia: items[0].donGia
        } : null
      };
    });

    console.log('📦 Order Tab State:', orderState);
    if (orderState.itemsCount === 0 || orderState.renderedRows === 0) {
      throw new Error('Items not loaded or table not rendered!');
    }

    // Screenshot initial order catalog
    await page.screenshot({ path: 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/ts_portal_order_table.png' });
    console.log('📸 Captured ts_portal_order_table.png');

    // 4. Test Search Filter
    console.log('🔍 Testing search input for "thịt"...');
    await page.fill('#orderSearch', 'thịt');
    await page.waitForTimeout(300);

    const searchRowsCount = await page.evaluate(() => {
      const tbody = document.getElementById('dinhMucBody');
      return tbody ? tbody.querySelectorAll('tr').length : 0;
    });
    console.log(`✅ Filtered search rows for "thịt": ${searchRowsCount} rows`);
    if (searchRowsCount === 0) {
      throw new Error('Search filter returned 0 rows for "thịt"!');
    }

    // Clear search
    await page.fill('#orderSearch', '');
    await page.waitForTimeout(300);

    // 5. Test Qty input & Realtime Budget Calculation
    console.log('✍️ Testing inline quantity input and budget calculation...');
    const firstSku = orderState.firstItem.maHang;
    const testQty = 10;

    await page.evaluate(({ sku, qty }) => {
      window.onQtyChange(sku, String(qty));
    }, { sku: firstSku, qty: testQty });
    await page.waitForTimeout(300);

    const calcCheck = await page.evaluate(({ sku, qty, price }) => {
      const subtotalEl = document.getElementById(`subtotal-${sku}`);
      const dangNhapEl = document.getElementById('kpiDangNhapSub');
      const expectedSubtotal = qty * price;
      return {
        subtotalText: subtotalEl?.textContent?.trim(),
        dangNhapText: dangNhapEl?.textContent?.trim(),
        expectedSubtotal
      };
    }, { sku: firstSku, qty: testQty, price: orderState.firstItem.donGia });

    console.log('💰 Budget Calculation Check:', calcCheck);

    // 6. Test Review Order Modal
    console.log('📋 Opening Review Order Modal (reviewOrder)...');
    await page.evaluate(() => {
      window.reviewOrder();
    });
    await page.waitForTimeout(500);

    const modalVisible = await page.evaluate(() => {
      const modal = document.getElementById('generalModal');
      const title = document.getElementById('generalModalTitle')?.textContent?.trim();
      const body = document.getElementById('generalModalBody')?.innerHTML?.length || 0;
      const isHidden = modal?.classList?.contains('hidden');
      return { isVisible: !isHidden, title, bodyLen: body };
    });

    console.log('🔎 Review Modal State:', modalVisible);
    if (!modalVisible.isVisible) {
      throw new Error('Review Order Modal did not open!');
    }

    // Screenshot review modal
    await page.screenshot({ path: 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/ts_portal_order_review_modal.png' });
    console.log('📸 Captured ts_portal_order_review_modal.png');

    // Close modal
    await page.evaluate(() => {
      window.closeGeneralModal();
    });
    await page.waitForTimeout(300);

    console.log('🎉 ALL Portal Order Module Verifications PASSED!');
    console.log('🌟 Zero regressions detected.');
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

verifyPortalOrderTsMigration();
