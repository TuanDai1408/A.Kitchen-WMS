import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE_URL = 'http://localhost:8787';

async function verifyPortalHistoryTsMigration() {
  console.log('🚀 Starting Verification: Portal History & Journey Tracking TypeScript Migration...');

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
        hasLoadHistory: typeof window.loadHistory === 'function',
        hasRenderHsOrdersList: typeof window.renderHsOrdersList === 'function',
        hasFilterHsOrders: typeof window.filterHsOrders === 'function',
        hasViewOrderDetail: typeof window.viewOrderDetail === 'function',
        hasOpenOrderJourneyModal: typeof window.openOrderJourneyModal === 'function',
        hasCloseOrderJourneyModal: typeof window.closeOrderJourneyModal === 'function',
        hasSubmitJourneyStep: typeof window.submitJourneyStep === 'function',
        hasOpenEditOrderModal: typeof window.openEditOrderModal === 'function',
        hasCloseEditOrderModal: typeof window.closeEditOrderModal === 'function',
        hasSaveEditOrder: typeof window.saveEditOrder === 'function',
        hasConfirmDeleteOrder: typeof window.confirmDeleteOrder === 'function',
        hasCloseDeleteOrderModal: typeof window.closeDeleteOrderModal === 'function',
        hasExecuteDeleteOrder: typeof window.executeDeleteOrder === 'function'
      };
    });

    console.log('📊 Globals Check:', globalsCheck);
    for (const [fnName, isPresent] of Object.entries(globalsCheck)) {
      if (!isPresent) {
        throw new Error(`Expected global function ${fnName} to be defined!`);
      }
    }

    // 2. Switch to portal-history tab
    console.log('🔄 Switching to portal-history tab...');
    await page.evaluate(() => {
      window.switchTab('portal-history');
    });
    await page.waitForTimeout(1000);

    // 3. Verify history orders loaded
    const historyState = await page.evaluate(() => {
      const orders = window.App?.historyOrders || [];
      const tbody = document.getElementById('hsBody');
      const rows = tbody ? tbody.querySelectorAll('tr').length : 0;
      const firstOrder = orders[0] ? {
        maDon: orders[0].maDon,
        site: orders[0].site,
        tongTien: orders[0].tongTien,
        soDong: orders[0].soDong,
        currentStep: orders[0].currentStep
      } : null;

      return {
        ordersCount: orders.length,
        renderedRows: rows,
        firstOrder
      };
    });

    console.log('📦 History State:', historyState);
    if (historyState.ordersCount === 0 || historyState.renderedRows === 0) {
      throw new Error('History orders not loaded or table not rendered!');
    }

    // Screenshot initial history table
    await page.screenshot({ path: 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/ts_portal_history_table.png' });
    console.log('📸 Captured ts_portal_history_table.png');

    const testOrderCode = historyState.firstOrder.maDon;

    // 4. Test View Order Detail Modal
    console.log(`🔎 Opening Order Detail for ${testOrderCode}...`);
    await page.evaluate(async (code) => {
      await window.viewOrderDetail(code);
    }, testOrderCode);
    await page.waitForTimeout(500);

    const detailModalState = await page.evaluate(() => {
      const modal = document.getElementById('generalModal');
      const isHidden = modal?.classList?.contains('hidden');
      const title = document.getElementById('generalModalTitle')?.textContent?.trim();
      const bodyLen = document.getElementById('generalModalBody')?.innerHTML?.length || 0;
      return { isVisible: !isHidden, title, bodyLen };
    });

    console.log('📋 Order Detail Modal State:', detailModalState);
    if (!detailModalState.isVisible) {
      throw new Error('Order Detail Modal did not open!');
    }

    await page.screenshot({ path: 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/ts_portal_history_detail_modal.png' });
    console.log('📸 Captured ts_portal_history_detail_modal.png');

    await page.evaluate(() => {
      window.closeGeneralModal();
    });
    await page.waitForTimeout(300);

    // 5. Test 7-Step Order Journey Modal
    console.log(`🚀 Opening 7-Step Journey Modal for ${testOrderCode}...`);
    await page.evaluate(async (code) => {
      await window.openOrderJourneyModal(code);
    }, testOrderCode);
    await page.waitForTimeout(500);

    const journeyModalState = await page.evaluate(() => {
      const modal = document.getElementById('modalOrderJourney');
      const isHidden = modal?.classList?.contains('hidden');
      const sub = document.getElementById('journeyOrderSubtitle')?.textContent?.trim();
      const timelineCards = document.getElementById('journeyTimelineContainer')?.children?.length || 0;
      const currentStepText = document.getElementById('journeyCurrentStepText')?.textContent?.trim();
      return { isVisible: !isHidden, sub, timelineCards, currentStepText };
    });

    console.log('🗺️ Journey Modal State:', journeyModalState);
    if (!journeyModalState.isVisible || journeyModalState.timelineCards !== 7) {
      throw new Error(`Journey modal invalid! Expected 7 timeline steps, got ${journeyModalState.timelineCards}`);
    }

    await page.screenshot({ path: 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/ts_portal_history_journey_modal.png' });
    console.log('📸 Captured ts_portal_history_journey_modal.png');

    await page.evaluate(() => {
      window.closeOrderJourneyModal();
    });
    await page.waitForTimeout(300);

    // 6. Test Edit Order Modal
    console.log(`✏️ Opening Edit Order Modal for ${testOrderCode}...`);
    await page.evaluate(async (code) => {
      await window.openEditOrderModal(code);
    }, testOrderCode);
    await page.waitForTimeout(500);

    const editModalState = await page.evaluate(() => {
      const modal = document.getElementById('modalEditOrder');
      const isHidden = modal?.classList?.contains('hidden');
      const orderCodeInput = document.getElementById('editOrderCode')?.value;
      const itemsRows = document.getElementById('editOrderItemsBody')?.querySelectorAll('tr')?.length || 0;
      return { isVisible: !isHidden, orderCodeInput, itemsRows };
    });

    console.log('📝 Edit Order Modal State:', editModalState);
    if (!editModalState.isVisible || editModalState.itemsRows === 0) {
      throw new Error('Edit Order Modal failed to open with items!');
    }

    await page.screenshot({ path: 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/ts_portal_history_edit_modal.png' });
    console.log('📸 Captured ts_portal_history_edit_modal.png');

    await page.evaluate(() => {
      window.closeEditOrderModal();
    });
    await page.waitForTimeout(300);

    console.log('🎉 ALL Portal History & Journey Tracking Module Verifications PASSED!');
    console.log('🌟 Zero regressions detected.');
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

verifyPortalHistoryTsMigration();
