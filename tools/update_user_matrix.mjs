import fs from 'fs';

const filePath = 'public/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const matrixStart = content.indexOf('<section id="user-matrix"');
const matrixEnd = content.indexOf('<section id="wh-dashboard"');

if (matrixStart === -1 || matrixEnd === -1) {
  console.error('Could not find user-matrix section boundaries');
  process.exit(1);
}

const newMatrixMarkup = `<section id="user-matrix" class="tab-panel space-y-4">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge badge-brand">RBAC Matrix</span>
              <h1 class="page-title">Ma trận phân quyền &amp; quản lý user</h1>
            </div>
            <p class="page-subtitle">Cấp quyền (Grant) hoặc thu hồi quyền (Revoke) trực tiếp cho từng nhân sự đối với từng chức năng trên toàn chuỗi</p>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <button onclick="openAddUserModal()" class="btn btn-primary">
              <i data-lucide="user-plus" class="w-4 h-4"></i>
              <span>+ Thêm tài khoản</span>
            </button>
            <button onclick="exportUserMatrixExcel()" class="btn btn-secondary" title="Xuất file Excel chuẩn Aptos">
              <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
              <span>Xuất Excel</span>
            </button>
            <button onclick="loadUserMatrix()" class="btn btn-secondary btn-icon" title="Tải lại dữ liệu">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Tổng tài khoản user</span>
                <p class="kpi-sub mt-0.5">Google Auth</p>
              </div>
              <div class="kpi-icon"><i data-lucide="users" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="userMatrixKpiTotal">—</span>
                <span class="kpi-unit">User</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Đang hoạt động</span>
                <p class="kpi-sub mt-0.5">Đã gán vai trò</p>
              </div>
              <div class="kpi-icon text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20"><i data-lucide="user-check" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num text-emerald-600 dark:text-emerald-400" id="userMatrixKpiActive">—</span>
                <span class="kpi-unit">User</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Quyền tùy chỉnh riêng</span>
                <p class="kpi-sub mt-0.5">Custom Overrides</p>
              </div>
              <div class="kpi-icon text-amber-600 bg-amber-50 dark:bg-amber-950/20"><i data-lucide="sliders" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num text-amber-600 dark:text-amber-400" id="userMatrixKpiCustomOverrides">—</span>
                <span class="kpi-unit">User</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Quản trị &amp; kho trưởng</span>
                <p class="kpi-sub mt-0.5">Đặc quyền cao</p>
              </div>
              <div class="kpi-icon text-brand-600 bg-brand-50 dark:bg-brand-950/20"><i data-lucide="shield" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="userMatrixKpiAdmins">—</span>
                <span class="kpi-unit">User</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Bar & Legend -->
        <div class="table-card p-4 space-y-3">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2.5">
              <div class="field w-52">
                <label class="field-label">Vai trò</label>
                <select id="userMatrixRoleFilter" onchange="filterUserMatrix()" class="select">
                  <option value="ALL">Tất cả vai trò</option>
                  <option value="ADMIN">Quản trị viên (ADMIN)</option>
                  <option value="KHO_TRUONG">Quản lý kho (KHO_TRUONG)</option>
                  <option value="BEP_TRUONG">Bếp trưởng (BEP_TRUONG)</option>
                  <option value="KE_TOAN">Kế toán chuỗi (KE_TOAN)</option>
                  <option value="QUAN_LY_VUNG">Quản lý vùng (QUAN_LY_VUNG)</option>
                  <option value="NHAN_VIEN">Nhân viên điểm bán (NHAN_VIEN)</option>
                </select>
              </div>

              <div class="field w-64">
                <label class="field-label">Nhóm tính năng</label>
                <select id="userMatrixGroupFilter" onchange="filterUserMatrix()" class="select">
                  <option value="ALL">Tất cả 5 nhóm (20 chức năng)</option>
                  <option value="fnb-finance">1. Doanh thu &amp; P&amp;L</option>
                  <option value="fnb-inventory">2. Bếp &amp; tồn kho điểm bán</option>
                  <option value="wh-wms">3. Kho tổng WMS</option>
                  <option value="portal-ops">4. Portal nghiệp vụ</option>
                  <option value="sys-admin">5. Hệ thống</option>
                </select>
              </div>
            </div>

            <div class="field flex-1 min-w-[220px]">
              <label class="field-label">Tìm kiếm user</label>
              <div class="relative">
                <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                <input type="text" id="userMatrixSearchInput" oninput="filterUserMatrix()" placeholder="Tìm tên user, email..." class="input pl-9 w-full">
              </div>
            </div>
          </div>

          <!-- Chú thích Legend -->
          <div class="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 select-none">
            <span class="font-medium text-gray-700 dark:text-gray-300">Quy ước:</span>
            <div class="flex items-center gap-1.5">
              <span class="inline-flex items-center justify-center size-4 rounded bg-emerald-500 text-white font-bold text-[9px]">✓</span>
              <span>Theo Role</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="inline-flex items-center justify-center size-4 rounded bg-brand-500 text-white font-bold text-[9px]">+</span>
              <span class="text-brand-600 dark:text-brand-400 font-medium">Cấp riêng</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="inline-flex items-center justify-center size-4 rounded bg-rose-500 text-white font-bold text-[9px]">✕</span>
              <span class="text-rose-600 dark:text-rose-400 font-medium">Bị thu hồi</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="inline-flex items-center justify-center size-4 rounded bg-gray-200 dark:bg-gray-700 text-gray-400 font-bold text-[9px]">-</span>
              <span>Không có quyền</span>
            </div>
            <span class="italic text-xs text-gray-400 ml-auto">Bấm vào ô toggle để cấp / cắt quyền tức thì</span>
          </div>
        </div>

        <!-- Desktop Matrix Table -->
        <div class="table-card p-5">
          <div class="table-scroll">
            <table class="data-table" id="userMatrixDesktopTable">
              <thead id="userMatrixTableHead">
              </thead>
              <tbody id="userMatrixTableBody">
              </tbody>
            </table>
          </div>
          <!-- Native Mobile Card View -->
          <div id="userMatrixMobileCards" class="block lg:hidden space-y-3 mt-4"></div>
        </div>

      </section>

      <!-- ====================================================================
           MODAL: THÊM TÀI KHOẢN MỚI
           ==================================================================== -->
      <div id="addUserModal" class="fixed inset-0 z-99999 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs hidden p-4">
        <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0">
                <i data-lucide="user-plus" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-semibold text-base text-gray-900 dark:text-white">Thêm tài khoản mới</h3>
                <p class="text-xs text-gray-400">Tạo tài khoản và phân quyền khởi tạo</p>
              </div>
            </div>
            <button onclick="closeAddUserModal()" class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form onsubmit="submitAddUser(event)" class="space-y-4">
            <div class="field">
              <label class="field-label">Email Google (*)</label>
              <input type="email" id="addUserInputEmail" required placeholder="example@gmail.com" class="input">
            </div>

            <div class="field">
              <label class="field-label">Họ và tên</label>
              <input type="text" id="addUserInputName" placeholder="Nguyễn Văn A" class="input">
            </div>

            <div class="field">
              <label class="field-label">Vai trò ban đầu</label>
              <select id="addUserInputRole" class="select">
                <option value="NHAN_VIEN">Nhân viên điểm bán (NHAN_VIEN)</option>
                <option value="KHO_TRUONG">Quản lý kho (KHO_TRUONG)</option>
                <option value="BEP_TRUONG">Bếp trưởng (BEP_TRUONG)</option>
                <option value="KE_TOAN">Kế toán chuỗi (KE_TOAN)</option>
                <option value="QUAN_LY_VUNG">Quản lý vùng (QUAN_LY_VUNG)</option>
                <option value="ADMIN">Quản trị viên (ADMIN)</option>
              </select>
            </div>

            <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button type="button" onclick="closeAddUserModal()" class="btn btn-secondary">Hủy</button>
              <button type="submit" class="btn btn-primary">Tạo tài khoản</button>
            </div>
          </form>
        </div>
      </div>

      <!-- ====================================================================
           MODAL: CHỈNH SỬA VAI TRÒ & RESET QUYỀN USER
           ==================================================================== -->
      <div id="editUserModal" class="fixed inset-0 z-99999 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs hidden p-4">
        <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0">
                <i data-lucide="shield" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-semibold text-base text-gray-900 dark:text-white">Điều chỉnh tài khoản</h3>
                <p id="editUserEmailDisplay" class="text-xs text-gray-400 code">user@gmail.com</p>
              </div>
            </div>
            <button onclick="closeEditUserModal()" class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form onsubmit="submitEditUserRole(event)" class="space-y-4">
            <input type="hidden" id="editUserTargetEmail">

            <div class="field">
              <label class="field-label">Vai trò hệ thống</label>
              <select id="editUserRoleSelect" class="select">
                <option value="ADMIN">Quản trị viên (ADMIN)</option>
                <option value="KHO_TRUONG">Quản lý kho (KHO_TRUONG)</option>
                <option value="BEP_TRUONG">Bếp trưởng (BEP_TRUONG)</option>
                <option value="KE_TOAN">Kế toán chuỗi (KE_TOAN)</option>
                <option value="QUAN_LY_VUNG">Quản lý vùng (QUAN_LY_VUNG)</option>
                <option value="NHAN_VIEN">Nhân viên điểm bán (NHAN_VIEN)</option>
              </select>
            </div>

            <div class="flex items-center justify-between pt-2">
              <button type="button" onclick="resetUserRolePermissions()" class="btn btn-secondary btn-sm" title="Khôi phục quyền mặc định theo vai trò">
                <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Reset quyền về mặc định
              </button>
            </div>

            <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button type="button" onclick="closeEditUserModal()" class="btn btn-secondary">Đóng</button>
              <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
            </div>
          </form>
        </div>
      </div>
`;

// Replace until the end of editUserModal
const editUserModalEnd = content.indexOf('</div>\n      </div>\n\n\n\n      <!-- ====================================================================\n           SECTION: TỔNG QUAN KHO VẬN (/wh/dashboard)', matrixStart);

if (editUserModalEnd !== -1) {
  content = content.substring(0, matrixStart) + newMatrixMarkup + content.substring(editUserModalEnd + '</div>\n      </div>'.length);
} else {
  // Let's find wh-dashboard start
  content = content.substring(0, matrixStart) + newMatrixMarkup + content.substring(matrixEnd);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated user-matrix in index.html');
