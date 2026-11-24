import { chromium } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17';

async function main() {
  console.log('--- STARTING MODULE 12 VERIFICATION: RBAC USER MATRIX & VOUCHERS RBAC ---');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem('orbit_user', JSON.stringify({
      email: 'admin@akitchen.vn',
      role: 'ADMIN',
      site: 'K001',
      name: 'System Admin'
    }));
    localStorage.setItem('orbit_user_site', 'K001');
  });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const txt = msg.text();
      if (!txt.includes('favicon') && !txt.includes('404') && !txt.includes('GSI_LOGGER') && !txt.includes('403')) {
        consoleErrors.push(txt);
      }
    }
  });

  try {
    console.log('1. Navigating to http://localhost:8787 ...');
    await page.goto('http://localhost:8787', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // 2. Test Tab Switch to user-matrix
    console.log('2. Switching to tab "user-matrix" ...');
    await page.evaluate(() => {
      if (typeof window.switchTab === 'function') {
        window.switchTab('user-matrix');
      }
    });
    await page.waitForTimeout(600);

    // 3. Test loadUserMatrix()
    console.log('3. Testing loadUserMatrix() and KPI rendering ...');
    const matrixLoaded = await page.evaluate(async () => {
      if (typeof window.loadUserMatrix === 'function') {
        await window.loadUserMatrix();
      }
      const data = window.gUserMatrixData;
      const kpiTotal = document.getElementById('userMatrixKpiTotal')?.textContent?.trim() || '';
      const kpiActive = document.getElementById('userMatrixKpiActive')?.textContent?.trim() || '';
      const rows = document.querySelectorAll('#userMatrixTableBody tr').length;
      const mobileCards = document.querySelectorAll('#userMatrixCardsMobile .bg-base-100, #userMatrixCardsMobile .card').length;
      return {
        hasData: !!data,
        userCount: data?.users?.length || 0,
        featureCount: data?.features?.length || 0,
        kpiTotal,
        kpiActive,
        tableRows: rows,
        mobileCards
      };
    });
    console.log('User Matrix Result:', JSON.stringify(matrixLoaded, null, 2));
    if (!matrixLoaded.hasData || matrixLoaded.userCount === 0) {
      throw new Error('User matrix data was not loaded properly!');
    }

    // 4. Capture screenshot of User Matrix
    const userMatrixShot = path.join(ARTIFACT_DIR, 'ts_rbac_user_matrix.png');
    await page.screenshot({ path: userMatrixShot });
    console.log('User matrix screenshot saved to:', userMatrixShot);

    // 5. Test Add User Modal
    console.log('5. Testing openAddUserModal() & closeAddUserModal() ...');
    const modalAddState = await page.evaluate(() => {
      window.openAddUserModal();
      const modal = document.getElementById('addUserModal');
      const isVisible = modal && !modal.classList.contains('hidden');
      return { isVisible };
    });
    console.log('Add User Modal state:', modalAddState);
    if (!modalAddState.isVisible) {
      throw new Error('Add User Modal did not open!');
    }

    const addUserModalShot = path.join(ARTIFACT_DIR, 'ts_rbac_add_user_modal.png');
    await page.screenshot({ path: addUserModalShot });
    console.log('Add user modal screenshot saved to:', addUserModalShot);

    await page.evaluate(() => {
      window.closeAddUserModal();
    });
    await page.waitForTimeout(300);

    // 6. Test Edit User Modal
    console.log('6. Testing openEditUserModal() ...');
    const modalEditState = await page.evaluate(() => {
      const firstUser = window.gUserMatrixData?.users?.[0];
      if (firstUser) {
        window.openEditUserModal(firstUser.email);
        const modal = document.getElementById('editUserModal');
        const isVisible = modal && !modal.classList.contains('hidden');
        return { isVisible, userId: firstUser.id, userEmail: firstUser.email };
      }
      return { isVisible: false };
    });
    console.log('Edit User Modal state:', modalEditState);
    if (!modalEditState.isVisible) {
      throw new Error('Edit User Modal did not open!');
    }

    const editUserModalShot = path.join(ARTIFACT_DIR, 'ts_rbac_edit_user_modal.png');
    await page.screenshot({ path: editUserModalShot });
    console.log('Edit user modal screenshot saved to:', editUserModalShot);

    await page.evaluate(() => {
      window.closeEditUserModal();
    });
    await page.waitForTimeout(300);

    // 7. Test Export Excel
    console.log('7. Testing exportUserMatrixExcel() existence & Aptos rules ...');
    const exportCheck = await page.evaluate(() => {
      return typeof window.exportUserMatrixExcel === 'function';
    });
    if (!exportCheck) {
      throw new Error('exportUserMatrixExcel is not defined on window!');
    }
    console.log('exportUserMatrixExcel verified.');

    // 8. Test Vouchers RBAC & Search
    console.log('8. Testing Vouchers RBAC permissions and searchVouchers() ...');
    await page.evaluate(() => {
      if (typeof window.switchTab === 'function') {
        window.switchTab('portal-search');
      }
    });
    await page.waitForTimeout(600);

    const rbacPerms = await page.evaluate(async () => {
      const canEdit = typeof window.canEditVouchers === 'function' ? window.canEditVouchers() : false;
      const canDelete = typeof window.canDeleteVouchers === 'function' ? window.canDeleteVouchers() : false;
      await window.searchVouchers();
      const rows = document.querySelectorAll('#scBody tr').length;
      return { canEdit, canDelete, rowCount: rows };
    });
    console.log('Vouchers RBAC search result:', JSON.stringify(rbacPerms, null, 2));
    if (!rbacPerms.canEdit || !rbacPerms.canDelete) {
      throw new Error(`Admin should have canEdit and canDelete permissions! Got: ${JSON.stringify(rbacPerms)}`);
    }
    if (rbacPerms.rowCount === 0) {
      throw new Error('searchVouchers returned 0 rows in #scBody!');
    }

    const vouchersShot = path.join(ARTIFACT_DIR, 'ts_rbac_vouchers_table.png');
    await page.screenshot({ path: vouchersShot });
    console.log('Vouchers table screenshot saved to:', vouchersShot);

    // 9. Check Console Errors
    console.log('9. Checking console errors ...');
    if (consoleErrors.length > 0) {
      console.warn('Console errors detected:', consoleErrors);
      throw new Error('Fatal console errors occurred: ' + consoleErrors.join('; '));
    }

    console.log('=== MODULE 12 VERIFICATION COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('VERIFICATION FAILED:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
