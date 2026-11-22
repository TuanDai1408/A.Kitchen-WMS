import { chromium } from 'playwright-core';

const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function main() {
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage();

  await page.addInitScript(() => {
    localStorage.setItem('orbit_current_user', JSON.stringify({
      email: 'admin@akitchen.vn',
      name: 'Admin Test',
      role: 'ADMIN',
      site: 'K001'
    }));
  });

  await page.goto('http://localhost:8787', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const measurements = await page.evaluate(async () => {
    const report = {};

    // 1. Test General Modal (viewVoucherDetail)
    if (typeof window.viewVoucherDetail === 'function') {
      await window.viewVoucherDetail('CT-20261117-012625-K001');
      await new Promise(r => setTimeout(r, 400));
      
      const titleEl = document.getElementById('modalTitle');
      const bodyEl = document.getElementById('modalBody');
      const firstLabel = bodyEl?.querySelector('span.text-xs');
      const firstVal = bodyEl?.querySelector('.code, strong, span.font-medium');

      report.generalModal = {
        titleFontSize: titleEl ? window.getComputedStyle(titleEl).fontSize : null,
        titleFontWeight: titleEl ? window.getComputedStyle(titleEl).fontWeight : null,
        bodyFontSize: bodyEl ? window.getComputedStyle(bodyEl).fontSize : null,
        labelFontSize: firstLabel ? window.getComputedStyle(firstLabel).fontSize : null,
        valFontSize: firstVal ? window.getComputedStyle(firstVal).fontSize : null
      };
      if (typeof window.closeGeneralModal === 'function') window.closeGeneralModal();
    }

    // 2. Test Site Selector Modal
    if (typeof window.openSiteSelectorModal === 'function') {
      window.openSiteSelectorModal();
      await new Promise(r => setTimeout(r, 400));

      const modal = document.getElementById('siteSelectorModal');
      const titleEl = modal?.querySelector('h3');
      const firstCard = modal?.querySelector('.site-option-card');
      const cardTitle = firstCard?.querySelector('.font-semibold, .font-bold');

      report.siteSelectorModal = {
        titleFontSize: titleEl ? window.getComputedStyle(titleEl).fontSize : null,
        cardTitleFontSize: cardTitle ? window.getComputedStyle(cardTitle).fontSize : null
      };
      if (typeof window.closeSiteSelectorModal === 'function') window.closeSiteSelectorModal();
    }

    // 3. Test Create Receipt Modal
    const receiptModal = document.getElementById('createReceiptModal');
    if (receiptModal) {
      receiptModal.classList.remove('hidden');
      await new Promise(r => setTimeout(r, 400));

      const titleEl = document.getElementById('receiptModalTitle');
      const tableTh = receiptModal.querySelector('table th');
      const tableTd = receiptModal.querySelector('table td');

      report.createReceiptModal = {
        titleFontSize: titleEl ? window.getComputedStyle(titleEl).fontSize : null,
        tableThFontSize: tableTh ? window.getComputedStyle(tableTh).fontSize : null,
        tableTdFontSize: tableTd ? window.getComputedStyle(tableTd).fontSize : null
      };
      receiptModal.classList.add('hidden');
    }

    // 4. Test Table across main tabs
    const mainTableTh = document.querySelector('.data-table th');
    const mainTableTd = document.querySelector('.data-table td');
    report.mainTable = {
      thFontSize: mainTableTh ? window.getComputedStyle(mainTableTh).fontSize : null,
      tdFontSize: mainTableTd ? window.getComputedStyle(mainTableTd).fontSize : null
    };

    return report;
  });

  console.log('--- MODAL & TAB FONT MEASUREMENTS ---');
  console.log(JSON.stringify(measurements, null, 2));

  await browser.close();
}

main().catch(console.error);
