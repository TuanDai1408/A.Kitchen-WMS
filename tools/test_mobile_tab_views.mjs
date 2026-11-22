import { chromium } from 'playwright-core';

const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function main() {
  const browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.error('PAGE ERROR:', msg.text());
  });

  await page.addInitScript(() => {
    localStorage.setItem('orbit_current_user', JSON.stringify({
      email: 'admin@akitchen.vn',
      name: 'Admin Test',
      role: 'ADMIN',
      site: 'K001'
    }));
    localStorage.setItem('orbit_user_site', 'K001');
  });

  await page.goto('http://localhost:8787', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  const tabsToTest = [
    { id: 'wh-dashboard', loader: 'loadDashboardSummary' },
    { id: 'portal-search', loader: 'searchVouchers' },
    { id: 'portal-order', loader: 'filterItems' },
    { id: 'portal-history', loader: 'loadHistory' },
    { id: 'portal-kiemke', loader: 'loadAudit' },
    { id: 'wh-stock', loader: 'loadStockFEFO' },
    { id: 'wh-reorder', loader: 'loadReorderROP' },
    { id: 'wh-leadtime', loader: 'loadLeadTime' },
    { id: 'wh-posap', loader: 'loadWhInventory' },
    { id: 'fnb-chain', loader: 'loadFnbChain' },
    { id: 'fnb-counts', loader: 'loadFnbCounts' },
    { id: 'fnb-receipts', loader: 'loadFnbReceipts' },
    { id: 'fnb-waste', loader: 'loadFnbWaste' },
    { id: 'fnb-sites', loader: 'loadFnbSites' },
    { id: 'user-matrix', loader: 'loadUserMatrix' },
    { id: 'fnb-pl', loader: 'loadFnbPL' }
  ];

  const results = [];

  for (const t of tabsToTest) {
    const report = await page.evaluate(async (tabInfo) => {
      if (typeof window.switchTab === 'function') window.switchTab(tabInfo.id);
      if (tabInfo.loader && typeof window[tabInfo.loader] === 'function') {
        try {
          await window[tabInfo.loader]();
        } catch(e) {
          console.error('Error in loader ' + tabInfo.loader, e);
        }
      }
      await new Promise(r => setTimeout(r, 600));

      const sec = document.getElementById(tabInfo.id);
      if (!sec) return { id: tabInfo.id, found: false };

      // Find tables in this section
      const tables = sec.querySelectorAll('table');
      const tableVisibility = Array.from(tables).map(tbl => {
        const style = window.getComputedStyle(tbl);
        let parent = tbl.parentElement;
        let parentVisible = true;
        while (parent && parent !== sec) {
          if (window.getComputedStyle(parent).display === 'none') {
            parentVisible = false;
            break;
          }
          parent = parent.parentElement;
        }
        return {
          visible: style.display !== 'none' && parentVisible
        };
      });

      // Find mobile card containers
      const mobileCardContainers = sec.querySelectorAll('[id*="Mob"], [id*="mob"], [class*="lg:hidden"]');
      const cardVisibility = Array.from(mobileCardContainers).map(c => {
        const style = window.getComputedStyle(c);
        let parent = c.parentElement;
        let parentVisible = true;
        while (parent && parent !== sec) {
          if (window.getComputedStyle(parent).display === 'none') {
            parentVisible = false;
            break;
          }
          parent = parent.parentElement;
        }
        const cardsCount = c.children?.length || 0;
        return {
          id: c.id,
          visible: style.display !== 'none' && parentVisible,
          childCount: cardsCount
        };
      });

      // Check section horizontal overflow
      const hasHorizontalScroll = sec.scrollWidth > sec.clientWidth + 5;

      const visibleCardContainers = cardVisibility.filter(c => c.visible);
      const totalCards = visibleCardContainers.reduce((sum, c) => sum + c.childCount, 0);

      return {
        tab: tabInfo.id,
        visibleTablesOnMobile: tableVisibility.filter(v => v.visible).length,
        mobileCardsVisible: visibleCardContainers.length > 0,
        mobileCardCount: totalCards,
        hasHorizontalScroll,
        scrollWidth: sec.scrollWidth,
        clientWidth: sec.clientWidth
      };
    }, t);

    results.push(report);

    // Also take screenshot of key tabs
    await page.screenshot({ path: `screenshots/mobile_after_${t.id}.png`, fullPage: false });
  }

  console.log('\n--- MOBILE 390px POST-OPTIMIZATION AUDIT REPORT ---');
  console.table(results.map(r => ({
    tab: r.tab,
    visibleTablesOnMobile: r.visibleTablesOnMobile,
    mobileCardsVisible: r.mobileCardsVisible,
    mobileCardCount: r.mobileCardCount,
    hasHorizontalScroll: r.hasHorizontalScroll
  })));

  await browser.close();
}

main().catch(console.error);
