import { chromium } from 'playwright-core';

const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function main() {
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage();

  const consoleLogs = [];
  const pageErrors = [];
  page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => pageErrors.push(err.message));

  // Set authenticated admin user in session
  await page.addInitScript(() => {
    const adminUser = {
      email: 'admin@akitchen.vn',
      name: 'Admin Test',
      role: 'ADMIN',
      roleName: 'Quản trị viên toàn hệ thống',
      site: 'K001',
      siteName: 'Bếp Ăn ĐH Hùng Vương',
      permissions: ['*']
    };
    localStorage.setItem('orbit_current_user', JSON.stringify(adminUser));
    localStorage.setItem('orbit_user_site', 'K001');
    localStorage.setItem('orbit_user_site_name', 'Bếp Ăn ĐH Hùng Vương');
  });

  console.log('Navigating to http://localhost:8787 ...');
  await page.goto('http://localhost:8787', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // List of tabs to test
  const tabs = [
    { id: 'portal-search', name: 'Tra cứu chứng từ', loader: 'searchVouchers', checkSelector: '#scBody tr' },
    { id: 'portal-order', name: 'Đặt hàng vật tư bếp', loader: 'loadQuota', checkSelector: '#dinhMucBody tr' },
    { id: 'portal-kiemke', name: 'Kiểm kê tồn kho', loader: 'loadAudit', checkSelector: '#kkBody tr' },
    { id: 'wh-stock', name: 'Hạn dùng & FEFO', loader: 'loadStockFEFO', checkSelector: '#fefoTableBody tr' },
    { id: 'wh-reorder', name: 'Cảnh báo ROP', loader: 'loadReorderROP', checkSelector: '#ropTableBody tr' },
    { id: 'wh-leadtime', name: 'Lead Time & NCC', loader: 'loadLeadTime', checkSelector: '#leadTimeTableBody tr' },
    { id: 'wh-posap', name: 'Quản lý tồn kho WMS', loader: 'loadWhInventory', checkSelector: '#whInventoryTableBody tr' },
    { id: 'fnb-counts', name: 'Kiểm kê hằng ngày', loader: 'loadFnbCounts', checkSelector: '#fnbCountsTableBody tr' },
    { id: 'fnb-chain', name: 'Tổng quan chuỗi', loader: 'loadFnbChain', checkSelector: '#fnbChainTableBody tr' },
    { id: 'user-matrix', name: 'Ma trận phân quyền', loader: 'loadUserMatrix', checkSelector: '#userMatrixTableBody tr' }
  ];

  const results = {};

  for (const t of tabs) {
    console.log(`Testing tab: ${t.name} (${t.id})...`);
    const tabResult = await page.evaluate(async (tabInfo) => {
      // 1. Switch tab
      if (typeof window.switchTab === 'function') {
        window.switchTab(tabInfo.id);
      }
      // 2. Call loader if needed
      if (typeof window[tabInfo.loader] === 'function') {
        await window[tabInfo.loader]();
      }
      await new Promise(r => setTimeout(r, 600));

      const rows = document.querySelectorAll(tabInfo.checkSelector);
      return {
        tabActive: document.getElementById(tabInfo.id)?.classList.contains('hidden') === false,
        rowCount: rows?.length || 0,
        firstRowText: rows?.[0]?.textContent?.trim().slice(0, 100) || null
      };
    }, t);

    results[t.id] = tabResult;
    console.log(`  -> ${t.id}: ${tabResult.rowCount} rows. Active: ${tabResult.tabActive}`);
  }

  console.log('\n--- FINAL TEST RESULTS ---');
  console.log(JSON.stringify(results, null, 2));
  console.log('Page Errors:', pageErrors);

  await browser.close();
}

main().catch(console.error);
