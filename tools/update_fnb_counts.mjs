import fs from 'fs';

const filePath = 'public/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const countsStart = content.indexOf('<section id="fnb-counts"');
const countsEnd = content.indexOf('<section id="fnb-receipts"');

if (countsStart === -1 || countsEnd === -1) {
  console.error('Could not find fnb-counts section boundaries');
  process.exit(1);
}

const newCountsMarkup = `<section id="fnb-counts" class="tab-panel space-y-4">
        <!-- Sub-nav bar -->
        <div class="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 w-fit max-w-full overflow-x-auto shadow-theme-xs select-none">
          <button onclick="switchTab('wh-dashboard')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><i data-lucide="layout-dashboard" class="w-4 h-4 text-emerald-500"></i><span>Tổng quan kho</span></button>
          <button onclick="switchTab('fnb-counts')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shrink-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs border border-gray-200 dark:border-gray-700"><i data-lucide="clipboard-check" class="w-4 h-4 text-brand-600"></i><span>Kiểm kê hằng ngày</span></button>
          <button onclick="switchTab('fnb-receipts')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><i data-lucide="package-plus" class="w-4 h-4 text-indigo-500"></i><span>Nhập hàng</span></button>
          <button onclick="switchTab('fnb-waste')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><i data-lucide="trash-2" class="w-4 h-4 text-rose-500"></i><span>Hủy hàng &amp; hao hụt</span></button>
        </div>

        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Kiểm kê tồn kho hằng ngày</h1>
            <p class="page-subtitle">Kiểm ngày nhóm trọng yếu (thịt, rau, gia vị), đối chiếu số liệu tồn sổ sách và hao hụt ca</p>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <button onclick="exportCountSheetExcel()" class="btn btn-secondary">
              <i data-lucide="printer" class="w-4 h-4"></i>
              <span>Xuất mẫu Excel</span>
            </button>
            <button onclick="saveFnbCountAudit()" id="btnSaveFnbCount" class="btn btn-primary">
              <i data-lucide="check-circle" class="w-4 h-4"></i>
              <span>Lưu kiểm kê</span>
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar">
          <select id="fnbCountSiteSelect" class="hidden"><option value="K001">K001</option></select>
          <div class="field flex-1 min-w-[170px]">
            <label class="field-label">Chênh lệch</label>
            <select id="fnbCountStatusFilter" onchange="onFnbCountFilterChange()" class="select">
              <option value="all">Tất cả mặt hàng</option>
              <option value="diff">Lệch tồn (Thừa / Thiếu)</option>
              <option value="matched">Khớp 100% sổ sách</option>
              <option value="counted">Đã kiểm đếm</option>
              <option value="uncounted">Chưa kiểm đếm</option>
            </select>
          </div>

          <div class="field flex-1 min-w-[170px]">
            <label class="field-label">Ngành hàng</label>
            <select id="fnbCountNganhHangFilter" onchange="onFnbCountNganhHangChange()" class="select">
              <option value="">Tất cả ngành hàng</option>
            </select>
          </div>

          <div class="field flex-1 min-w-[170px]">
            <label class="field-label">Nhóm hàng</label>
            <select id="fnbCountNhomHangFilter" onchange="onFnbCountFilterChange()" class="select">
              <option value="">Tất cả nhóm hàng</option>
            </select>
          </div>

          <div class="field flex-1 min-w-[160px]">
            <label class="field-label">Ngày kiểm</label>
            <input type="date" id="fnbCountDatePicker" onchange="onFnbCountDateChange()" class="input">
          </div>

          <div class="field flex-1 min-w-[200px]">
            <label class="field-label">Tìm kiếm</label>
            <div class="relative">
              <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
              <input type="text" id="fnbCountSearchInput" oninput="onFnbCountSearch(this.value)" placeholder="Tìm tên, mã, ngành..." class="input pl-9 w-full">
            </div>
          </div>

          <div class="flex items-center self-end pb-1.5">
            <label class="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-gray-700 dark:text-gray-300" title="Ẩn cột tồn sổ sách khi đang đếm">
              <input type="checkbox" id="fnbCountBlindToggle" onchange="toggleBlindCount(this.checked)" class="rounded border-gray-300 text-brand-600 focus:ring-brand-500">
              <span>Kiểm mù</span>
            </label>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Mặt hàng kiểm</span>
                <p class="kpi-sub mt-0.5">Tổng số danh mục</p>
              </div>
              <div class="kpi-icon"><i data-lucide="clipboard-list" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="fnbCountMetricTotal">—</span>
                <span class="kpi-unit">Mã</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Khớp sổ sách</span>
                <p class="kpi-sub mt-0.5">Không chênh lệch</p>
              </div>
              <div class="kpi-icon text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20"><i data-lucide="check-circle" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num text-emerald-600 dark:text-emerald-400" id="fnbCountMetricMatched">—</span>
                <span class="kpi-unit">Mã</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Lệch thừa / thiếu</span>
                <p class="kpi-sub mt-0.5">Chênh lệch số lượng</p>
              </div>
              <div class="kpi-icon text-rose-600 bg-rose-50 dark:bg-rose-950/20"><i data-lucide="alert-triangle" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num text-rose-600 dark:text-rose-400" id="fnbCountMetricDiff">—</span>
                <span class="kpi-unit">Mã</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Tổng tiền lệch</span>
                <p class="kpi-sub mt-0.5">Quy đổi giá vốn</p>
              </div>
              <div class="kpi-icon"><i data-lucide="circle-dollar-sign" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="fnbCountMetricDiffVal" title="—">—</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Counting Table -->
        <div class="table-card p-5">
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="text-center w-12">STT</th>
                  <th class="min-w-[200px]">Mặt hàng F&amp;B</th>
                  <th class="text-center w-16">ĐVT</th>
                  <th class="col-num text-right w-28 fnb-count-book-col">Tồn sách</th>
                  <th class="text-center w-36">SL đếm thực tế</th>
                  <th class="col-num text-right w-28">Chênh lệch</th>
                  <th class="col-num text-right w-32">Tiền lệch</th>
                  <th>Ghi chú lý do</th>
                </tr>
              </thead>
              <tbody id="fnbCountsTableBody">
              </tbody>
            </table>
          </div>

          <!-- Mobile Card View -->
          <div id="fnbCountsMobileCards" class="block lg:hidden space-y-3 mt-4"></div>
        </div>

        <!-- Recent Audit History -->
        <div class="table-card p-5 space-y-3 mt-4">
          <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
            <h3 class="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <i data-lucide="history" class="w-4 h-4 text-brand-600"></i> Lịch sử các đợt kiểm kê gần đây
            </h3>
            <span class="text-xs text-gray-400">Lưu tự động trên hệ thống</span>
          </div>
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="col-code">Mã phiếu</th>
                  <th>Điểm bán</th>
                  <th class="col-date">Ngày kiểm</th>
                  <th>Loại phiếu</th>
                  <th class="col-num text-right">Tổng món</th>
                  <th class="col-num text-right">Số lệch</th>
                  <th class="col-num text-right">Giá trị lệch</th>
                  <th>Người kiểm</th>
                </tr>
              </thead>
              <tbody id="fnbCountsHistoryBody">
              </tbody>
            </table>
          </div>
        </div>
      </section>
`;

content = content.substring(0, countsStart) + newCountsMarkup + content.substring(countsEnd);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated fnb-counts in index.html');
