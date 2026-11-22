import fs from 'fs';

const filePath = 'public/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const wasteStart = content.indexOf('<section id="fnb-waste"');
const wasteEnd = content.indexOf('<section id="wh-stock"');

if (wasteStart === -1 || wasteEnd === -1) {
  console.error('Could not find fnb-waste section boundaries');
  process.exit(1);
}

const newWasteMarkup = `<section id="fnb-waste" class="tab-panel space-y-4">
        <!-- Sub-nav bar -->
        <div class="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 w-fit max-w-full overflow-x-auto shadow-theme-xs select-none">
          <button onclick="switchTab('wh-dashboard')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><i data-lucide="layout-dashboard" class="w-4 h-4 text-emerald-500"></i><span>Tổng quan kho</span></button>
          <button onclick="switchTab('fnb-counts')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><i data-lucide="clipboard-check" class="w-4 h-4 text-brand-600"></i><span>Kiểm kê hằng ngày</span></button>
          <button onclick="switchTab('fnb-receipts')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><i data-lucide="package-plus" class="w-4 h-4 text-indigo-500"></i><span>Nhập hàng</span></button>
          <button onclick="switchTab('fnb-waste')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shrink-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs border border-gray-200 dark:border-gray-700"><i data-lucide="trash-2" class="w-4 h-4 text-rose-500"></i><span>Hủy hàng &amp; hao hụt</span></button>
        </div>

        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Biên bản hủy hàng &amp; hao hụt</h1>
            <p class="page-subtitle">Ghi nhận hư hỏng, quá hạn, dập nát cho các mặt hàng tồn kho (&gt; 0) và tự động trừ tồn kho thực tế</p>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <button onclick="openCreateWasteModal()" class="btn btn-primary">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>+ Ghi biên bản hủy hàng</span>
            </button>
            <button onclick="loadFnbWaste()" class="btn btn-secondary btn-icon" title="Làm mới">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Mặt hàng tồn &gt; 0</span>
                <p class="kpi-sub mt-0.5">Khả dụng tại điểm bán</p>
              </div>
              <div class="kpi-icon text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20"><i data-lucide="package" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span id="kpiWasteInStockCount" class="kpi-value num">—</span>
                <span class="kpi-unit">Mã</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Giá trị tồn khả dụng</span>
                <p class="kpi-sub mt-0.5">Theo giá vốn thực tế</p>
              </div>
              <div class="kpi-icon text-brand-600 bg-brand-50 dark:bg-brand-950/20"><i data-lucide="badge-dollar-sign" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span id="kpiWasteInStockVal" class="kpi-value num">—</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Mặt hàng chọn hủy</span>
                <p class="kpi-sub mt-0.5">Đang nhập số lượng</p>
              </div>
              <div class="kpi-icon text-amber-600 bg-amber-50 dark:bg-amber-950/20"><i data-lucide="alert-triangle" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span id="kpiWasteSelectedCount" class="kpi-value num text-amber-600 dark:text-amber-400">0</span>
                <span class="kpi-unit">Mã</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Tiền hủy dự kiến</span>
                <p class="kpi-sub mt-0.5">Trừ tồn khi xác nhận</p>
              </div>
              <div class="kpi-icon text-rose-600 bg-rose-50 dark:bg-rose-950/20"><i data-lucide="trash-2" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span id="kpiWasteTotalEstAmount" class="kpi-value num text-rose-600 dark:text-rose-400">0 ₫</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sub-View Navigation: Hàng Tồn > 0 vs Lịch Sử Biên Bản Hủy -->
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
            <button type="button" id="subtab-fnb-waste-stock" onclick="switchFnbWasteSubView('stock')" class="btn btn-primary btn-sm">
              <i data-lucide="package-check" class="w-4 h-4"></i>
              <span>Mặt hàng tồn kho (Tồn &gt; 0)</span>
              <span id="fnbWasteBadgeInStockCount" class="badge badge-neutral px-2 py-0.5 num">0</span>
            </button>
            <button type="button" id="subtab-fnb-waste-history" onclick="switchFnbWasteSubView('history')" class="btn btn-secondary btn-sm">
              <i data-lucide="history" class="w-4 h-4"></i>
              <span>Lịch sử biên bản hủy</span>
              <span id="fnbWasteBadgeHistoryCount" class="badge badge-neutral px-2 py-0.5 num">0</span>
            </button>
          </div>

          <button type="button" id="btnSubmitDirectWaste" onclick="submitDirectWaste()" disabled class="btn btn-primary btn-sm">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
            <span id="btnSubmitDirectWasteText">Xác nhận tạo biên bản hủy (0)</span>
          </button>
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar">
          <select id="fnbWasteFilterSite" class="hidden"><option value="K001">K001</option></select>
          <div class="field w-48">
            <select id="fnbWasteReasonFilter" onchange="onFnbWasteFilterChange()" class="select">
              <option value="">Tất cả lý do hủy</option>
              <option value="EXP">Quá hạn sử dụng (EXP)</option>
              <option value="DAMAGE">Rách / vỡ / hỏng bao bì</option>
              <option value="QUALITY">Cảm quan / biến chất</option>
              <option value="COOK">Khét / cháy / lỗi chế biến</option>
              <option value="OTHER">Khác / hao hụt rã đông</option>
            </select>
          </div>

          <div class="field w-44">
            <select id="fnbWasteNganhHangFilter" onchange="onFnbWasteNganhHangChange()" class="select">
              <option value="">Tất cả ngành hàng</option>
            </select>
          </div>

          <div class="field w-44">
            <select id="fnbWasteNhomHangFilter" onchange="onFnbWasteFilterChange()" class="select">
              <option value="">Tất cả nhóm hàng</option>
            </select>
          </div>

          <div class="relative flex-1 min-w-[200px]">
            <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            <input type="text" id="fnbWasteSearchInput" oninput="onFnbWasteSearch(this.value)" placeholder="Tìm mã, tên mặt hàng..." class="input pl-9 w-full">
          </div>

          <button onclick="loadFnbWaste()" class="btn btn-secondary">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i> Làm mới
          </button>
        </div>

        <!-- SUB-VIEW 1: MẶT HÀNG TỒN KHO (TỒN > 0) -->
        <div id="fnbWasteSubViewStock" class="space-y-4">
          <div class="table-card p-5">
            <div id="fnbWasteSummary" class="text-xs text-gray-500 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800 num">
              Đang tải dữ liệu...
            </div>
            <div class="table-scroll">
              <table class="data-table">
                <thead>
                  <tr>
                    <th class="text-center w-12">STT</th>
                    <th class="col-code">Mã hàng</th>
                    <th class="min-w-[180px]">Tên mặt hàng</th>
                    <th class="text-center w-16">ĐVT</th>
                    <th class="col-num text-right w-24">Đơn giá</th>
                    <th class="col-num text-right w-28 text-emerald-600 dark:text-emerald-400">Tồn sách (&gt;0)</th>
                    <th class="col-num text-right w-28">Giá trị tồn</th>
                    <th class="text-center w-32 text-rose-600 dark:text-rose-400">SL cần hủy *</th>
                    <th class="w-44">Lý do hủy</th>
                    <th class="col-num text-right w-28 text-rose-600 dark:text-rose-400">Tiền hủy</th>
                    <th class="w-36">Ghi chú</th>
                  </tr>
                </thead>
                <tbody id="fnbWasteStockTableBody">
                </tbody>
              </table>
            </div>

            <!-- Empty State -->
            <div id="fnbWasteStockEmptyState" class="hidden p-12 text-center rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
              <div class="inline-flex size-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400">
                <i data-lucide="package-search" class="size-7"></i>
              </div>
              <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">Không có mặt hàng nào có tồn kho &gt; 0</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Điểm bán này hiện chưa có mặt hàng nào có số lượng tồn khả dụng lớn hơn 0 hoặc không khớp bộ lọc đã chọn.
              </p>
            </div>

            <!-- Mobile Cards -->
            <div id="fnbWasteStockMobileCards" class="block lg:hidden space-y-3 mt-4"></div>
          </div>
        </div>

        <!-- SUB-VIEW 2: LỊCH SỬ BIÊN BẢN HỦY -->
        <div id="fnbWasteSubViewHistory" class="hidden space-y-4">
          <div class="table-card p-5">
            <div class="table-scroll">
              <table class="data-table">
                <thead>
                  <tr>
                    <th class="col-code">Mã biên bản</th>
                    <th>Điểm bán</th>
                    <th class="col-date">Ngày hủy</th>
                    <th>Lý do hủy</th>
                    <th>Người xác nhận</th>
                    <th class="col-num text-right">Giá trị hủy (VNĐ)</th>
                    <th>Ghi chú</th>
                    <th class="col-actions text-center w-24">Thao tác</th>
                  </tr>
                </thead>
                <tbody id="fnbWasteTableBody">
                </tbody>
              </table>
            </div>

            <!-- Mobile Cards -->
            <div id="fnbWasteMobileCards" class="block lg:hidden space-y-3 mt-4"></div>
          </div>
        </div>
      </section>
`;

content = content.substring(0, wasteStart) + newWasteMarkup + content.substring(wasteEnd);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated fnb-waste in index.html');
