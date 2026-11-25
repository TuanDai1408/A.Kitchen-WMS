import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const possiblePaths = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];
const executablePath = possiblePaths.find(p => fs.existsSync(p));

const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17';

async function run() {
  console.log('🚀 Starting RBAC Action Guards verification...');
  const browser = await chromium.launch({ headless: true, executablePath });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Test 1: Bếp trưởng / User thông thường (không có quyền edit/delete user-matrix, không có quyền hủy nhập kho)
  await page.addInitScript(() => {
    const regularUser = {
      email: 'longchaulabeling2@gmail.com',
      full_name: 'Long Châu Kế Toán',
      role: 'KE_TOAN',
      role_code: 'KE_TOAN',
      assignedSite: 'K001',
      status: 'ACTIVE',
      permissions: {
        'portal-voucher': { canView: true, canCreate: true, canEdit: true, canDelete: false },
        'user-matrix': { canView: false, canCreate: false, canEdit: false, canDelete: false, isRevoked: true }
      }
    };
    localStorage.setItem('orbit_user', JSON.stringify(regularUser));
    localStorage.setItem('orbit_user_site', 'K001');
  });

  await page.goto('http://127.0.0.1:8787', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Test 1.1: Kiểm tra canUserEdit & canUserDelete
  const test1Results = await page.evaluate(() => {
    const w = window;
    return {
      canEditUserMatrix: w.canUserEdit ? w.canUserEdit('user-matrix') : null,
      canDeleteUserMatrix: w.canUserDelete ? w.canUserDelete('user-matrix') : null,
      canManageUsers: w.canUserManageUsers ? w.canUserManageUsers() : null,
      canDeleteReceipts: w.canUserDelete ? w.canUserDelete('fnb-receipts') : null,
      canEditCounts: w.canUserEdit ? w.canUserEdit('fnb-counts') : null,
      canDeleteCounts: w.canUserDelete ? w.canUserDelete('fnb-counts') : null
    };
  });
  console.log('Test 1 Results (Bếp trưởng non-admin):', test1Results);

  if (test1Results.canManageUsers !== false || test1Results.canDeleteReceipts !== false) {
    throw new Error('FAILED: Bếp trưởng không được phép có quyền canManageUsers hoặc canDeleteReceipts!');
  }

  // Test 1.2: Bếp trưởng gọi hàm mở modal sửa user hoặc toggle phân quyền -> Phải bị chặn
  await page.evaluate(() => {
    if (typeof window.openEditUserModal === 'function') {
      window.openEditUserModal('someone@akitchen.vn');
    }
  });
  await page.waitForTimeout(300);

  const isEditUserModalOpen = await page.evaluate(() => {
    const el = document.getElementById('editUserModal');
    return el && !el.classList.contains('hidden');
  });
  console.log('Is editUserModal open for Bếp trưởng?:', isEditUserModalOpen);
  if (isEditUserModalOpen) {
    throw new Error('FAILED: Modal editUserModal không được phép mở khi user không có quyền!');
  }

  // Chụp ảnh bằng chứng chặn quyền sửa user
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'regular_user_edit_user_blocked.png') });

  // Test 1.3: Thử gọi API Backend DELETE /api/order khi gửi header x-user-email của non-admin
  const apiBlockedResp = await page.evaluate(async () => {
    const res = await fetch('/api/order?orderCode=TEST-FAKE-999', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': 'longchaulabeling2@gmail.com'
      }
    });
    return { status: res.status, json: await res.json() };
  });
  console.log('API Delete Order Response for Non-Admin:', apiBlockedResp);
  if (apiBlockedResp.status !== 403) {
    throw new Error(`FAILED: Backend phải trả về 403 Forbidden nhưng nhận được ${apiBlockedResp.status}!`);
  }

  // Test 2: Admin (ADMIN role hoặc Master Account)
  console.log('\n--- Switching to Admin Test ---');
  const context2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const adminPage = await context2.newPage();
  await adminPage.addInitScript(() => {
    const adminUser = {
      email: 'trantuandai2508@gmail.com',
      full_name: 'Trần Tuấn Đại',
      role: 'ADMIN',
      role_code: 'ADMIN',
      assignedSite: 'K001',
      status: 'ACTIVE'
    };
    localStorage.setItem('orbit_user', JSON.stringify(adminUser));
    localStorage.setItem('orbit_user_site', 'K001');
  });

  await adminPage.goto('http://127.0.0.1:8787', { waitUntil: 'networkidle' });
  await adminPage.waitForTimeout(1000);

  const test2Results = await adminPage.evaluate(() => {
    const w = window;
    return {
      canEditUserMatrix: w.canUserEdit ? w.canUserEdit('user-matrix') : null,
      canDeleteUserMatrix: w.canUserDelete ? w.canUserDelete('user-matrix') : null,
      canManageUsers: w.canUserManageUsers ? w.canUserManageUsers() : null,
      canDeleteReceipts: w.canUserDelete ? w.canUserDelete('fnb-receipts') : null,
      canEditCounts: w.canUserEdit ? w.canUserEdit('fnb-counts') : null,
      canDeleteCounts: w.canUserDelete ? w.canUserDelete('fnb-counts') : null
    };
  });
  console.log('Test 2 Results (Admin):', test2Results);

  if (!test2Results.canManageUsers || !test2Results.canDeleteReceipts) {
    throw new Error('FAILED: Admin phải có đầy đủ quyền canManageUsers và canDeleteReceipts!');
  }

  // Admin mở tab Phân quyền và kiểm tra các nút
  await adminPage.evaluate(() => {
    if (typeof window.switchTab === 'function') {
      window.switchTab('user-matrix');
    }
  });
  await adminPage.waitForTimeout(1000);

  // Chụp ảnh giao diện User Matrix có đầy đủ nút thao tác của Admin
  await adminPage.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_user_matrix_actions_enabled.png') });

  console.log('✅ ALL RBAC ACTION GUARDS VERIFICATION TESTS PASSED SUCCESSFULLY!');
  await browser.close();
}

run().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
