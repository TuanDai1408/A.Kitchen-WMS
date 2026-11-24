import { chromium } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17';

async function main() {
  console.log('--- STARTING MODULE 11 VERIFICATION: PORTAL VOUCHERS, CATERING REPORT & AUDIT ---');
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

    // --- STEP 1: Verify Portal Vouchers Form ---
    console.log('2. Testing Portal Vouchers Form (portal-vouchers)...');
    await page.evaluate(() => {
      if (typeof window.switchTab === 'function') {
        window.switchTab('portal-vouchers');
      }
      window.resetChungTuForm();
      // Add a test file to uploadedFiles
      window.uploadedFiles.push({
        name: 'HoaDon_K001_112026.pdf',
        size: 153600,
        type: 'DOCUMENT'
      });
      window.renderUploadedFiles();
    });
    await page.waitForTimeout(1000);

    const voucherFormStatus = await page.evaluate(() => {
      const fileList = document.getElementById('ctFileList');
      return {
        uploadedCount: window.uploadedFiles ? window.uploadedFiles.length : 0,
        renderedFileItems: fileList ? fileList.children.length : 0,
        firstFileName: fileList?.querySelector('span.truncate')?.textContent?.trim() || ''
      };
    });
    console.log('   Voucher Form Status:', voucherFormStatus);
    if (voucherFormStatus.renderedFileItems === 0) {
      throw new Error('File chip was not rendered into #ctFileList!');
    }

    // Test download template
    console.log('3. Testing Download Voucher Excel Template...');
    await page.evaluate(() => {
      window.taiTemplateChungTu();
    });

    const voucherScreenshotPath = path.join(ARTIFACT_DIR, 'ts_portal_vouchers_form.png');
    await page.screenshot({ path: voucherScreenshotPath });
    console.log('   Saved vouchers form screenshot:', voucherScreenshotPath);

    // --- STEP 2: Verify Search Vouchers Tab ---
    console.log('4. Testing Search Vouchers (portal-search)...');
    await page.evaluate(async () => {
      if (typeof window.switchTab === 'function') {
        window.switchTab('portal-search');
      }
      await window.searchVouchers();
    });
    await page.waitForTimeout(1200);

    const searchStatus = await page.evaluate(() => {
      const rows = document.querySelectorAll('#scBody tr');
      return {
        rowCount: rows.length,
        firstColText: rows[0]?.querySelector('td')?.textContent?.trim() || ''
      };
    });
    console.log('   Search Vouchers Status:', searchStatus);

    const searchScreenshotPath = path.join(ARTIFACT_DIR, 'ts_portal_search_vouchers.png');
    await page.screenshot({ path: searchScreenshotPath });
    console.log('   Saved search vouchers screenshot:', searchScreenshotPath);

    // --- STEP 3: Verify Catering Report Form ---
    console.log('5. Testing Catering Report Form (portal-baocao)...');
    await page.evaluate(() => {
      if (typeof window.switchTab === 'function') {
        window.switchTab('portal-baocao');
      }
      window.resetBaoCao();

      const sang = document.getElementById('bcSang'); if (sang) sang.value = '120';
      const trua = document.getElementById('bcTrua'); if (trua) trua.value = '250';
      const chieu = document.getElementById('bcChieu'); if (chieu) chieu.value = '80';
      const nv = document.getElementById('bcNhanVien'); if (nv) nv.value = '20';
      const huy = document.getElementById('bcHuy'); if (huy) huy.value = '5';
      window.tinhTongSuat();
    });
    await page.waitForTimeout(1000);

    const cateringStatus = await page.evaluate(() => {
      const tongEl = document.getElementById('bcTong');
      return {
        totalMealsValue: tongEl ? tongEl.value : ''
      };
    });
    console.log('   Catering Report Status (calculated total meals):', cateringStatus);
    if (!cateringStatus.totalMealsValue || cateringStatus.totalMealsValue === '0') {
      throw new Error('Total meals was not computed correctly in #bcTong!');
    }

    const cateringScreenshotPath = path.join(ARTIFACT_DIR, 'ts_portal_catering_report.png');
    await page.screenshot({ path: cateringScreenshotPath });
    console.log('   Saved catering report screenshot:', cateringScreenshotPath);

    // --- STEP 4: Verify Portal Audit ---
    console.log('6. Testing Portal Audit (portal-audit)...');
    await page.evaluate(async () => {
      if (typeof window.switchTab === 'function') {
        window.switchTab('portal-audit');
      }
      const kkSite = document.getElementById('kkSite');
      if (kkSite) kkSite.value = 'K001';
      await window.loadAudit();
    });
    await page.waitForTimeout(1500);

    const auditStatus = await page.evaluate(() => {
      const rows = document.querySelectorAll('#kkBody tr');
      return {
        rawItemsCount: window.auditRawItems ? window.auditRawItems.length : 0,
        renderedRows: rows.length,
        filteredCountText: document.getElementById('kkFilteredCount')?.textContent?.trim() || '',
        totalCountText: document.getElementById('kkTotalCount')?.textContent?.trim() || '',
        firstItemCode: rows[0]?.querySelector('td:nth-child(1)')?.textContent?.trim() || '',
        firstItemName: rows[0]?.querySelector('td:nth-child(2)')?.textContent?.trim() || ''
      };
    });
    console.log('   Audit Status:', auditStatus);
    if (auditStatus.rawItemsCount === 0) {
      throw new Error('No audit items loaded in window.auditRawItems!');
    }

    // Test Search filter in Audit
    console.log('7. Testing Audit Search Filter...');
    await page.evaluate(() => {
      const searchInput = document.getElementById('kkSearchInput');
      if (searchInput && window.auditRawItems && window.auditRawItems.length > 0) {
        searchInput.value = window.auditRawItems[0].item_code;
        window.filterAuditItems();
      }
    });
    await page.waitForTimeout(500);

    const filteredAuditCount = await page.evaluate(() => {
      return document.querySelectorAll('#kkBody tr').length;
    });
    console.log(`   Filtered audit rows count: ${filteredAuditCount}`);

    // Reset audit filters
    await page.evaluate(() => {
      window.resetAuditFilters();
    });
    await page.waitForTimeout(500);

    // Test Excel Export Audit
    console.log('8. Testing Export Audit Excel...');
    await page.evaluate(() => {
      window.exportAuditExcel();
    });

    const auditScreenshotPath = path.join(ARTIFACT_DIR, 'ts_portal_audit_table.png');
    await page.screenshot({ path: auditScreenshotPath });
    console.log('   Saved audit table screenshot:', auditScreenshotPath);

    // Check fatal errors
    if (consoleErrors.length > 0) {
      console.warn('⚠️ Console errors detected:', consoleErrors);
      throw new Error(`Fatal console errors found: ${consoleErrors.join(' | ')}`);
    }

    console.log('✅ MODULE 11 VERIFICATION PASSED SUCCESSFULLY WITH ZERO FATAL ERRORS!');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
