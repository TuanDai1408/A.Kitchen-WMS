import fs from 'fs';

const filePath = 'public/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const chainStart = content.indexOf('<section id="fnb-chain"');
const chainEnd = content.indexOf('<section id="fnb-pl"');
const plEnd = content.indexOf('<section id="fnb-pos"');
const posEnd = content.indexOf('<section id="fnb-sites"');

if (chainStart === -1 || chainEnd === -1 || plEnd === -1 || posEnd === -1) {
  console.error('Could not find fnb finance sections boundaries');
  process.exit(1);
}

// 1. New fnb-chain
const newChainMarkup = `<section id="fnb-chain" class="tab-panel active space-y-4">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Hiệu quả &amp; xếp hạng toàn chuỗi</h1>
            <p class="page-subtitle">Theo dõi doanh thu, tỷ suất EBITDA, Food Cost &amp; Labor Cost trên toàn hệ thống 14 điểm bán</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs text-gray-600 dark:text-gray-300 font-medium shadow-xs">
              <i data-lucide="calendar" class="w-3.5 h-3.5 text-brand-600"></i>
              Kỳ báo cáo: <strong id="fnbChainPeriodLabel" class="text-gray-900 dark:text-white font-semibold">Tháng 11/2026</strong>
            </span>
            <button id="btnSyncFnbSummary" onclick="triggerSyncFnbMonthlySummary()" class="btn btn-secondary" title="Cập nhật số liệu mới nhất của tháng này vào bảng tổng hợp">
              <i id="syncFnbIcon" data-lucide="refresh-cw" class="w-3.5 h-3.5 text-brand-600 dark:text-brand-400"></i>
              <span id="syncFnbLabel">Đồng bộ số liệu</span>
            </button>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <!-- Card 1: Tổng Doanh Thu Chuỗi (Hero) -->
          <div class="kpi-card-hero">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Tổng doanh thu chuỗi</span>
                <p class="kpi-sub mt-0.5">14 điểm bán toàn hệ thống</p>
              </div>
              <div class="kpi-icon"><i data-lucide="bar-chart-3" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value-hero num" id="chainTotalRevenue" title="—">—</span>
                <span class="kpi-unit" id="chainTotalRevenueUnit"></span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-delta-good" id="chainTotalRevenueDelta">
                  <svg class="size-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg>
                  <span>105,8% KH</span>
                </span>
                <span class="kpi-sub">vượt kế hoạch tháng</span>
              </div>
            </div>
          </div>

          <!-- Card 2: Lợi Nhuận EBITDA -->
          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Lợi nhuận EBITDA</span>
                <p class="kpi-sub mt-0.5">Lợi nhuận gộp toàn chuỗi</p>
              </div>
              <div class="kpi-icon text-brand-600 bg-brand-50 dark:bg-brand-950/20"><i data-lucide="dollar-sign" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="chainTotalProfit" title="—">—</span>
                <span class="kpi-unit" id="chainTotalProfitUnit"></span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-delta-neutral" id="chainAvgMargin">
                  <span>—</span>
                </span>
                <span class="kpi-sub">biên EBITDA TB</span>
              </div>
            </div>
          </div>

          <!-- Card 3: Food Cost TB Chuỗi -->
          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Food Cost TB chuỗi</span>
                <p class="kpi-sub mt-0.5">Mục tiêu trần ≤ 43,0%</p>
              </div>
              <div class="kpi-icon"><i data-lucide="pie-chart" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="chainAvgFoodCost">—</span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-delta-good" title="Đạt chuẩn định mức">
                  <svg class="size-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg>
                  <span>Đạt chuẩn</span>
                </span>
                <span class="kpi-sub">dưới ngưỡng 43%</span>
              </div>
            </div>
          </div>

          <!-- Card 4: Labor Cost (COL) -->
          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Labor Cost (COL)</span>
                <p class="kpi-sub mt-0.5">Mục tiêu nhân công ≤ 19,0%</p>
              </div>
              <div class="kpi-icon"><i data-lucide="users" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="chainAvgLaborCost">—</span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-delta-good">
                  <svg class="size-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg>
                  <span>Tối ưu</span>
                </span>
                <span class="kpi-sub">dưới ngưỡng 19%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-700 dark:text-gray-300 text-xs">Vùng vận hành:</span>
            <div class="inline-flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800 text-xs font-medium">
              <button onclick="filterFnbChainByRegion('ALL')" id="filterRegALL" class="rounded-md bg-white px-3 py-1 text-gray-900 shadow-xs dark:bg-white/10 dark:text-white transition-all font-semibold">Tất cả (14)</button>
              <button onclick="filterFnbChainByRegion('Miền Nam')" id="filterRegMN" class="rounded-md px-3 py-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all">Miền Nam (10)</button>
              <button onclick="filterFnbChainByRegion('Miền Bắc')" id="filterRegMB" class="rounded-md px-3 py-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all">Miền Bắc (4)</button>
            </div>
          </div>
          <div class="relative flex-1 min-w-[220px]">
            <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
            <input type="text" id="searchChainSiteInput" oninput="onSearchChainSite(this.value)" placeholder="Tìm mã SAP hoặc tên điểm bán..." class="input pl-9 w-full">
          </div>
        </div>

        <!-- Rankings Table -->
        <div class="table-card p-5">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
            <div class="flex items-center gap-2">
              <i data-lucide="list-ordered" class="w-4 h-4 text-brand-600"></i>
              <h2 class="font-semibold text-sm text-gray-900 dark:text-white">Bảng xếp hạng 14 điểm bán theo doanh thu &amp; hiệu quả chi phí</h2>
            </div>
            <span class="text-xs text-gray-400">Dữ liệu cập nhật thời gian thực</span>
          </div>

          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="text-center w-12">Hạng</th>
                  <th>Điểm bán &amp; Mã SAP</th>
                  <th class="text-center">Vùng</th>
                  <th class="col-num text-right">Doanh thu thuần</th>
                  <th class="col-num text-right">Mục tiêu</th>
                  <th class="col-num text-center">% Đạt</th>
                  <th class="col-num text-center">Food Cost %</th>
                  <th class="col-num text-center">Labor Cost %</th>
                  <th class="col-num text-right">EBITDA</th>
                  <th class="col-badge text-center">Trạng thái</th>
                  <th class="col-actions text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody id="fnbChainTableBody">
              </tbody>
            </table>
          </div>
          <!-- Native Mobile Card View -->
          <div id="fnbChainMobileCards" class="block lg:hidden space-y-3 mt-4"></div>
        </div>
      </section>
`;

// 2. New fnb-pl
const newPlMarkup = `<section id="fnb-pl" class="tab-panel space-y-4">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge badge-brand">P&amp;L Report</span>
              <h1 class="page-title" id="plSiteTitle">Báo cáo P&amp;L: K001 - MN Bếp Ăn ĐH Hùng Vương</h1>
            </div>
            <p class="page-subtitle">Chi tiết doanh thu thuần, Prime Cost (Food Cost + Labor Cost), chi phí cố định và EBITDA</p>
          </div>
          <div class="flex items-center gap-2">
            <select id="plSiteSelector" class="hidden"></select>
            <div class="field w-56">
              <select id="plFocusFilter" onchange="filterPlBreakdown(this.value)" class="select">
                <option value="ALL">Toàn bộ cấu trúc P&amp;L</option>
                <option value="COGS">Chi phí giá vốn (Food Cost)</option>
                <option value="LABOR">Chi phí nhân công (Labor)</option>
                <option value="OPEX">Chi phí vận hành &amp; mặt bằng</option>
                <option value="EBITDA">Lợi nhuận gộp &amp; EBITDA</option>
              </select>
            </div>
            <button onclick="exportFnbPLExcel()" class="btn btn-secondary">
              <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
              <span>Xuất Excel P&amp;L</span>
            </button>
            <button onclick="loadFnbPL()" class="btn btn-secondary btn-icon" title="Tải lại">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Doanh thu thuần</span>
                <p class="kpi-sub mt-0.5">Sau chiết khấu</p>
              </div>
              <div class="kpi-icon"><i data-lucide="trending-up" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="plNetRev" title="—">—</span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-delta-good" id="plAchievement">
                  <svg class="size-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg>
                  <span>—%</span>
                </span>
                <span class="kpi-sub">so với mục tiêu</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Prime Cost %</span>
                <p class="kpi-sub mt-0.5">Trần ≤ 62,0%</p>
              </div>
              <div class="kpi-icon"><i data-lucide="pie-chart" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline justify-between">
                <span class="kpi-value num" id="plPrimeCostPct">—</span>
                <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Trần 62%</span>
              </div>
              <div class="kpi-progress-track mt-2">
                <div id="plPrimeCostBar" class="kpi-progress-bar" style="width: 0%;"></div>
              </div>
              <div class="kpi-footer justify-between text-xs text-gray-500">
                <span>Food: <b id="plFoodCostPct" class="num font-semibold text-gray-900 dark:text-white">—</b> <span id="plFoodCostVal" class="hidden"></span></span>
                <span>Labor: <b id="plLaborCostPct" class="num font-semibold text-gray-900 dark:text-white">—</b> <span id="plLaborCostVal" class="hidden"></span></span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Lợi nhuận EBITDA</span>
                <p class="kpi-sub mt-0.5">Lợi nhuận hoạt động</p>
              </div>
              <div class="kpi-icon text-brand-600 bg-brand-50 dark:bg-brand-950/20"><i data-lucide="dollar-sign" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="plProfitVal" title="—">—</span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-delta-good" id="plProfitMargin">
                  <svg class="size-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg>
                  <span>—</span>
                </span>
                <span class="kpi-sub">biên EBITDA</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Điểm hòa vốn</span>
                <p class="kpi-sub mt-0.5">Doanh thu an toàn tối thiểu</p>
              </div>
              <div class="kpi-icon"><i data-lucide="target" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="plBreakEven" title="—">—</span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-delta-neutral">
                  <span>Mức sàn</span>
                </span>
                <span class="kpi-sub">Cố định tháng</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2 Columns Grid: P&L Statement on Left, Analytics on Right -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <!-- Column Left: P&L Breakdown Table (7 Cols) -->
          <div class="lg:col-span-7 table-card p-5">
            <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <div class="flex items-center gap-2">
                <i data-lucide="file-text" class="w-4 h-4 text-brand-600"></i>
                <h2 class="font-semibold text-sm text-gray-900 dark:text-white">Báo cáo kết quả hoạt động (P&amp;L Statement)</h2>
              </div>
              <span class="text-xs text-gray-400">Đơn vị: VNĐ</span>
            </div>

            <div class="table-scroll">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Khoản mục P&amp;L</th>
                    <th class="col-num text-right">Số tiền (VNĐ)</th>
                    <th class="col-num text-right">% Doanh thu</th>
                    <th class="col-badge text-center">Đánh giá</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                    <td class="font-semibold text-gray-900 dark:text-white">1. Doanh thu gộp (Gross Sales)</td>
                    <td class="col-num text-right num font-semibold" id="plRowGross">485,000,000 ₫</td>
                    <td class="col-num text-right num text-gray-500">103.1%</td>
                    <td class="col-badge text-center"><span class="badge badge-neutral">Trước KM</span></td>
                  </tr>
                  <tr class="text-gray-500">
                    <td class="pl-8">(-) Chiết khấu / Khuyến mãi POS</td>
                    <td class="col-num text-right num text-rose-600 dark:text-rose-400" id="plRowDiscount">-14,550,000 ₫</td>
                    <td class="col-num text-right num">-3.1%</td>
                    <td class="col-badge text-center"><span class="badge badge-warning">&lt; 4%</span></td>
                  </tr>
                  <tr class="bg-brand-50/40 dark:bg-brand-950/20 font-semibold text-brand-700 dark:text-brand-300">
                    <td class="font-semibold">2. DOANH THU THUẦN (Net Sales = 100%)</td>
                    <td class="col-num text-right num font-bold text-brand-700 dark:text-brand-300" id="plRowNet">470,450,000 ₫</td>
                    <td class="col-num text-right num font-semibold">100.0%</td>
                    <td class="col-badge text-center"><span class="badge badge-brand">Căn cứ</span></td>
                  </tr>
                  <tr class="text-gray-500 text-xs">
                    <td class="pl-8">• Ăn tại chỗ (Dine-in ~72%)</td>
                    <td class="col-num text-right num" id="plRowDineIn">338,724,000 ₫</td>
                    <td class="col-num text-right num">72.0%</td>
                    <td class="col-badge text-center text-gray-400">Chủ lực</td>
                  </tr>
                  <tr class="text-gray-500 text-xs">
                    <td class="pl-8">• Mang đi (Takeaway ~20%)</td>
                    <td class="col-num text-right num" id="plRowTakeaway">94,090,000 ₫</td>
                    <td class="col-num text-right num">20.0%</td>
                    <td class="col-badge text-center text-gray-400">Ổn định</td>
                  </tr>
                  <tr class="text-gray-500 text-xs">
                    <td class="pl-8">• Suất ăn công nghiệp (8%)</td>
                    <td class="col-num text-right num" id="plRowCatering">37,636,000 ₫</td>
                    <td class="col-num text-right num">8.0%</td>
                    <td class="col-badge text-center text-gray-400">Hợp đồng</td>
                  </tr>
                  <tr>
                    <td class="font-semibold text-gray-900 dark:text-white">3. Chi phí nguyên vật liệu (Food Cost)</td>
                    <td class="col-num text-right num font-semibold text-blue-600 dark:text-blue-400" id="plRowFoodCost">201,352,600 ₫</td>
                    <td class="col-num text-right num font-semibold text-blue-600 dark:text-blue-400" id="plRowFoodCostPct">42.8%</td>
                    <td class="col-badge text-center"><span class="badge badge-success">Mục tiêu ≤43%</span></td>
                  </tr>
                  <tr>
                    <td class="font-semibold text-gray-900 dark:text-white">4. Chi phí nhân công (Labor Cost)</td>
                    <td class="col-num text-right num font-semibold text-purple-600 dark:text-purple-400" id="plRowLaborCost">87,033,250 ₫</td>
                    <td class="col-num text-right num font-semibold text-purple-600 dark:text-purple-400" id="plRowLaborCostPct">18.5%</td>
                    <td class="col-badge text-center"><span class="badge badge-success">Mục tiêu ≤19%</span></td>
                  </tr>
                  <tr class="bg-amber-50/60 dark:bg-amber-950/20 font-semibold text-amber-800 dark:text-amber-300">
                    <td>5. PRIME COST (Food + Labor)</td>
                    <td class="col-num text-right num font-bold" id="plRowPrimeCost">288,385,850 ₫</td>
                    <td class="col-num text-right num font-bold" id="plRowPrimeCostPct">61.3%</td>
                    <td class="col-badge text-center"><span class="badge badge-success">Đạt chỉ tiêu (≤62%)</span></td>
                  </tr>
                  <tr class="text-gray-600 dark:text-gray-400">
                    <td class="pl-8">6. Chi phí mặt bằng &amp; khấu hao</td>
                    <td class="col-num text-right num" id="plRowRent">28,000,000 ₫</td>
                    <td class="col-num text-right num">5.9%</td>
                    <td class="col-badge text-center text-gray-400">Cố định</td>
                  </tr>
                  <tr class="text-gray-600 dark:text-gray-400">
                    <td class="pl-8">7. Điện, nước &amp; gas</td>
                    <td class="col-num text-right num" id="plRowUtilities">15,054,400 ₫</td>
                    <td class="col-num text-right num">3.2%</td>
                    <td class="col-badge text-center text-gray-400">≤3.5%</td>
                  </tr>
                  <tr class="text-gray-600 dark:text-gray-400">
                    <td class="pl-8">8. Vật tư tiêu hao &amp; CCDC</td>
                    <td class="col-num text-right num" id="plRowSupplies">9,879,450 ₫</td>
                    <td class="col-num text-right num">2.1%</td>
                    <td class="col-badge text-center"><span class="badge badge-success">&lt; 10tr</span></td>
                  </tr>
                  <tr class="text-gray-600 dark:text-gray-400">
                    <td class="pl-8">9. Hao hụt &amp; hỏng hủy</td>
                    <td class="col-num text-right num" id="plRowWaste">3,763,600 ₫</td>
                    <td class="col-num text-right num">0.8%</td>
                    <td class="col-badge text-center text-gray-400">≤1%</td>
                  </tr>
                  <tr class="text-gray-600 dark:text-gray-400">
                    <td class="pl-8">10. Tiếp thị &amp; bán lẻ POS</td>
                    <td class="col-num text-right num" id="plRowMarketing">5,645,400 ₫</td>
                    <td class="col-num text-right num">1.2%</td>
                    <td class="col-badge text-center text-gray-400">≤1.5%</td>
                  </tr>
                  <tr class="bg-gray-100 dark:bg-gray-800/60 font-semibold text-gray-900 dark:text-white">
                    <td>TỔNG CHI PHÍ HOẠT ĐỘNG</td>
                    <td class="col-num text-right num font-bold" id="plRowTotalCost">350,728,700 ₫</td>
                    <td class="col-num text-right num font-bold">74.5%</td>
                    <td class="col-badge text-center text-gray-500">Toàn bộ</td>
                  </tr>
                  <tr class="bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold border-t-2 border-emerald-500">
                    <td class="text-sm font-bold">LỢI NHUẬN VẬN HÀNH (EBITDA)</td>
                    <td class="col-num text-right num text-sm font-bold" id="plRowEBITDA">119,721,300 ₫</td>
                    <td class="col-num text-right num text-sm font-bold" id="plRowEBITDAPct">25.5%</td>
                    <td class="col-badge text-center"><span class="badge badge-success">Vượt kế hoạch</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Column Right: Analytics, Trends, Top Dishes -->
          <div class="lg:col-span-5 space-y-4">
            <!-- Weekly Trends -->
            <div class="table-card p-5">
              <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800 mb-3">
                <div class="flex items-center gap-2">
                  <i data-lucide="trending-up" class="w-4 h-4 text-brand-600"></i>
                  <h3 class="font-semibold text-xs text-gray-900 dark:text-white">Xu hướng 8 tuần gần nhất</h3>
                </div>
                <span class="text-xs text-gray-400">Doanh thu &amp; Food Cost %</span>
              </div>
              <div class="table-scroll">
                <table class="data-table text-xs">
                  <thead>
                    <tr>
                      <th>Tuần</th>
                      <th class="col-num text-right">Doanh thu</th>
                      <th class="col-num text-center">FC %</th>
                      <th class="col-num text-center">COL %</th>
                      <th class="col-num text-right">EBITDA %</th>
                    </tr>
                  </thead>
                  <tbody id="plWeeklyTrendBody">
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Core Operational Metrics -->
            <div class="table-card p-5">
              <div class="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800 mb-3">
                <i data-lucide="activity" class="w-4 h-4 text-blue-600"></i>
                <h3 class="font-semibold text-xs text-gray-900 dark:text-white">Chỉ số vận hành điểm bán</h3>
              </div>
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div class="text-[11px] text-gray-500">Số hóa đơn / ngày</div>
                  <div class="text-sm font-bold text-gray-900 dark:text-white num mt-0.5" id="plOpBillCount">450 bill</div>
                </div>
                <div class="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div class="text-[11px] text-gray-500">Giá trị bill TB (AOV)</div>
                  <div class="text-sm font-bold text-gray-900 dark:text-white num mt-0.5" id="plOpAvgBill">35,000 ₫</div>
                </div>
                <div class="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div class="text-[11px] text-gray-500">Doanh thu / ghế / ngày</div>
                  <div class="text-sm font-bold text-gray-900 dark:text-white num mt-0.5" id="plOpRevSeat">135,000 ₫</div>
                </div>
                <div class="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div class="text-[11px] text-gray-500">Lấp đầy giờ vàng</div>
                  <div class="text-sm font-bold text-emerald-600 num mt-0.5" id="plOpOccupancy">92.5%</div>
                </div>
              </div>
            </div>

            <!-- Top Dishes & Action Plans -->
            <div class="table-card p-5 space-y-3">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <i data-lucide="award" class="w-4 h-4 text-amber-500"></i>
                  <h3 class="font-semibold text-xs text-gray-900 dark:text-white">Top món bán chạy nhất</h3>
                </div>
                <div id="plTopDishesList" class="space-y-1.5 text-xs">
                </div>
              </div>

              <div class="pt-3 border-t border-gray-100 dark:border-gray-800">
                <div class="flex items-center gap-2 mb-2">
                  <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500"></i>
                  <h3 class="font-semibold text-xs text-gray-900 dark:text-white">Kế hoạch hành động tuần tới</h3>
                </div>
                <div id="plActionPlansList" class="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
`;

// 3. New fnb-pos
const newPosMarkup = `<section id="fnb-pos" class="tab-panel space-y-4">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge badge-brand">POS Metrics</span>
              <h1 class="page-title">Doanh thu máy POS &amp; hiệu suất bán lẻ</h1>
            </div>
            <p class="page-subtitle">Giám sát doanh số theo khung giờ cao điểm, lưu lượng hóa đơn và phương thức thanh toán</p>
          </div>
          <div class="flex items-center gap-2">
            <input type="date" id="posDatePicker" value="2026-11-17" onchange="loadFnbPOS()" class="input w-40 text-xs">
            <button onclick="loadFnbPOS()" class="btn btn-secondary btn-icon" title="Tải lại">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Doanh thu POS hôm nay</span>
                <p class="kpi-sub mt-0.5">Điểm bán hiện tại</p>
              </div>
              <div class="kpi-icon"><i data-lucide="receipt" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="posDailyRevenue" title="—">—</span>
                <span class="kpi-unit" id="posDailyRevenueUnit"></span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-delta-good">
                  <svg class="size-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg>
                  <span>+12,4%</span>
                </span>
                <span class="kpi-sub">so với TB tuần</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Tổng số hóa đơn POS</span>
                <p class="kpi-sub mt-0.5">Số giao dịch thanh toán</p>
              </div>
              <div class="kpi-icon"><i data-lucide="file-text" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="posDailyBills">—</span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-delta-neutral">
                  <span>Cao điểm trưa</span>
                </span>
                <span class="kpi-sub">61,2% lượng bill</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Giá trị TB / Bill (AOV)</span>
                <p class="kpi-sub mt-0.5">Mức chi tiêu trung bình</p>
              </div>
              <div class="kpi-icon text-brand-600 bg-brand-50 dark:bg-brand-950/20"><i data-lucide="circle-dollar-sign" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="posDailyAOV" title="—">—</span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-delta-neutral">
                  <span>Chuẩn suất ăn</span>
                </span>
                <span class="kpi-sub">Suất trưa công sở</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Peak Hours Distribution & Payment Breakdown -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="table-card p-5">
            <h3 class="font-semibold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <i data-lucide="clock" class="w-4 h-4 text-brand-600"></i>
              <span>Phân bổ doanh thu theo khung giờ</span>
            </h3>
            <div id="posHourlyList" class="space-y-3 text-xs">
            </div>
          </div>

          <div class="table-card p-5">
            <h3 class="font-semibold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <i data-lucide="credit-card" class="w-4 h-4 text-emerald-600"></i>
              <span>Cơ cấu phương thức thanh toán</span>
            </h3>
            <div class="space-y-3 text-xs">
              <div>
                <div class="flex justify-between font-medium mb-1">
                  <span>Mã QR VNPAY / MoMo / Ngân hàng</span>
                  <span class="num text-emerald-600 font-semibold">68.5% (11,540,000 ₫)</span>
                </div>
                <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div class="bg-emerald-500 h-2 rounded-full" style="width: 68.5%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between font-medium mb-1">
                  <span>Tiền mặt (Cash)</span>
                  <span class="num text-gray-600 dark:text-gray-300 font-semibold">22.0% (3,707,000 ₫)</span>
                </div>
                <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div class="bg-gray-400 h-2 rounded-full" style="width: 22%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between font-medium mb-1">
                  <span>Thẻ ngân hàng (POS Napas/Visa)</span>
                  <span class="num text-blue-600 font-semibold">9.5% (1,603,000 ₫)</span>
                </div>
                <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 9.5%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
`;

content = content.substring(0, chainStart) + newChainMarkup + newPlMarkup + newPosMarkup + content.substring(posEnd);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated fnb-chain, fnb-pl, fnb-pos in index.html');
