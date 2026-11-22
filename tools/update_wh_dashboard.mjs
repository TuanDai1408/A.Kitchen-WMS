import fs from 'fs';

const filePath = 'public/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const dashStart = content.indexOf('<section id="wh-dashboard"');
const dashEnd = content.indexOf('<section id="fnb-counts"');

if (dashStart === -1 || dashEnd === -1) {
  console.error('Could not find wh-dashboard section boundaries');
  process.exit(1);
}

const newDashMarkup = `<section id="wh-dashboard" class="tab-panel space-y-4">
        <!-- Sub-nav bar -->
        <div class="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 w-fit max-w-full overflow-x-auto shadow-theme-xs select-none">
          <button onclick="switchTab('wh-dashboard')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shrink-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs border border-gray-200 dark:border-gray-700">
            <i data-lucide="layout-dashboard" class="w-4 h-4 text-emerald-500"></i>
            <span>Tổng quan kho vận</span>
          </button>
          <button onclick="switchTab('fnb-counts')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <i data-lucide="clipboard-check" class="w-4 h-4 text-brand-600"></i>
            <span>Kiểm kê hằng ngày</span>
          </button>
          <button onclick="switchTab('fnb-receipts')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <i data-lucide="package-plus" class="w-4 h-4 text-indigo-500"></i>
            <span>Nhập hàng điểm bán</span>
          </button>
          <button onclick="switchTab('fnb-waste')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <i data-lucide="trash-2" class="w-4 h-4 text-rose-500"></i>
            <span>Hủy hàng &amp; hao hụt</span>
          </button>
        </div>

        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Tổng quan kho vận (WMS Dashboard)</h1>
            <p class="page-subtitle">Trung tâm điều hành kho hàng, cảnh báo tồn kho, hạn dùng FEFO và biến động nhập xuất</p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <span id="dashBranchTitle" class="hidden"></span>
            <div class="field w-56">
              <select id="whDashScopeFilter" onchange="if(typeof onWhDashScopeChange==='function')onWhDashScopeChange(this.value)" class="select">
                <option value="ALL">Toàn bộ danh mục kho</option>
                <option value="NEAR_EXP">Lô cận date (≤ 7 ngày)</option>
                <option value="MIN_STOCK">Chạm ngưỡng an toàn (ROP)</option>
                <option value="SLOW_MOVING">Tồn chậm luân chuyển (&gt; 20 ngày)</option>
              </select>
            </div>

            <button onclick="openReceiptModal()" class="btn btn-primary">
              <i data-lucide="plus" class="w-4 h-4"></i> Nhập kho lô mới
            </button>

            <button onclick="switchTab('wh-stock')" class="btn btn-secondary">
              <i data-lucide="scan" class="w-4 h-4 text-amber-500"></i> Xuất kho FEFO
            </button>
          </div>
        </div>

        <!-- TailAdmin Unified KPI Grid: Warehouse Overview -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
          <!-- Metric 1: Giá Trị Tồn Kho (Hero Card - Span 2 Cols) -->
          <div class="kpi-card-hero">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Giá trị tồn kho (SAP)</span>
                <p class="kpi-sub mt-0.5">Theo giá bình quân kho tổng</p>
              </div>
              <div class="kpi-icon"><i data-lucide="circle-dollar-sign" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value-hero num" id="dashMetricValue" title="—">—</span>
                <span class="kpi-unit" id="dashMetricValueUnit"></span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-delta-neutral" id="dashMetricValueDelta">
                  <span class="size-1.5 rounded-full bg-gray-400"></span>
                  <span>Thời gian thực</span>
                </span>
                <span class="kpi-sub">D1/Supabase live</span>
              </div>
            </div>
          </div>

          <!-- Metric 2: Tổng SKU Quản Lý -->
          <div class="kpi-card cursor-pointer" role="button" tabindex="0" onclick="switchTab('wh-stock')" title="Bấm để xem toàn bộ danh mục tồn kho">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Tổng SKU quản lý</span>
                <p class="kpi-sub mt-0.5">Toàn bộ danh mục</p>
              </div>
              <div class="kpi-icon"><i data-lucide="boxes" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="dashMetricSkus">—</span>
              </div>
            </div>
          </div>

          <!-- Metric 3: Cảnh Báo ROP / Dưới Mức Tối Thiểu -->
          <div class="kpi-card cursor-pointer" role="button" tabindex="0" onclick="switchTab('wh-reorder')" title="Bấm để xem danh sách cần đặt hàng bổ sung">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Dưới mức tối thiểu</span>
                <p class="kpi-sub mt-0.5">Ngưỡng an toàn ROP</p>
              </div>
              <div class="kpi-icon-warning"><i data-lucide="alert-triangle" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="dashMetricRop">—</span>
              </div>
            </div>
          </div>

          <!-- Metric 4: Cận Date (≤ 7 Ngày) -->
          <div class="kpi-card cursor-pointer" role="button" tabindex="0" onclick="switchTab('wh-stock')" title="Bấm để xem danh sách cận date xuất FEFO">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Cận Date (≤ 7 ngày)</span>
                <p class="kpi-sub mt-0.5">Ưu tiên FEFO</p>
              </div>
              <div class="kpi-icon-error"><i data-lucide="clock" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="dashMetricExp">—</span>
              </div>
            </div>
          </div>

          <!-- Metric 5: Tồn Chậm Luân Chuyển -->
          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Chậm luân chuyển</span>
                <p class="kpi-sub mt-0.5">&gt; 20 ngày tồn</p>
              </div>
              <div class="kpi-icon"><i data-lucide="shield-alert" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value num" id="dashMetricSlow">—</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 1 Charts: Inbound/Outbound Monthly Bar Chart (8 cols) + Safety Stock Radial Gauge (4 cols) -->
        <div class="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <!-- Cột Trái (8 cols): Biểu đồ Cột Nhập - Xuất theo tháng -->
          <div class="table-card p-5 md:p-6 xl:col-span-8">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <i data-lucide="bar-chart-3" class="w-4 h-4 text-brand-600"></i>
                  Biến động nhập – xuất kho hàng tháng
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  So sánh giá trị tổng nhập và xuất kho trong 12 tháng qua (Đơn vị: Triệu VNĐ)
                </p>
              </div>
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span class="h-2.5 w-2.5 rounded-full bg-brand-600"></span> Nhập kho
                </span>
                <span class="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Xuất kho
                </span>
              </div>
            </div>
            <div class="mt-4">
              <div id="inboundOutboundChart" class="min-h-[280px]"></div>
            </div>
          </div>

          <!-- Cột Phải (4 cols): Biểu đồ Tỷ lệ An Toàn Kho -->
          <div class="table-card p-5 md:p-6 xl:col-span-4 flex flex-col justify-between">
            <div class="border-b border-gray-100 pb-4 dark:border-gray-800">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i>
                Tỷ lệ đáp ứng an toàn kho
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Tỷ lệ mặt hàng đạt ngưỡng Safety Stock theo tiêu chuẩn
              </p>
            </div>
            <div class="my-auto py-2 flex flex-col items-center justify-center">
              <div id="safetyStockGaugeChart" class="w-full flex justify-center"></div>
              <div class="text-center mt-[-15px]">
                <span class="badge badge-success">
                  <i data-lucide="check-circle" class="w-3.5 h-3.5 inline mr-1"></i> Vận hành an toàn
                </span>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Mục tiêu chuẩn hóa chuỗi: ≥ 90.0%</p>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2 text-center text-xs">
              <div class="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <span class="text-gray-400 block text-[11px]">Lead Time PO</span>
                <span id="dashLeadTimeText" class="font-semibold text-gray-900 dark:text-white num">24.5h</span>
              </div>
              <div class="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <span class="text-gray-400 block text-[11px]">Độ lệch kiểm kê</span>
                <span class="font-semibold text-emerald-600 num">0.8%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 2 Chart: Xu Hướng Giá Trị Tồn Kho -->
        <div class="table-card p-5 md:p-6">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
            <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i data-lucide="trending-up" class="w-4 h-4 text-brand-600"></i>
                Xu hướng biến động giá trị tồn kho theo thời gian
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Theo dõi tổng giá trị tồn kho so với hạn mức ngân sách và định mức tối thiểu
              </p>
            </div>

            <!-- Controls: Tabs + Date Range Picker -->
            <div class="flex items-center gap-2.5 flex-wrap">
              <div class="inline-flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800 text-xs font-medium">
                <button onclick="changeTrendPeriod('week', this)" class="trend-btn active rounded-md bg-white px-3 py-1.5 text-gray-900 shadow-xs dark:bg-white/10 dark:text-white transition-all">
                  Tuần
                </button>
                <button onclick="changeTrendPeriod('month', this)" class="trend-btn rounded-md px-3 py-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all">
                  Tháng
                </button>
                <button onclick="changeTrendPeriod('quarter', this)" class="trend-btn rounded-md px-3 py-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all">
                  Quý
                </button>
              </div>

              <div class="relative">
                <i data-lucide="calendar" class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                <input 
                  type="text" 
                  id="inventoryTrendDatePicker" 
                  placeholder="Chọn khoảng ngày..." 
                  class="input pl-8 w-48 text-xs cursor-pointer"
                  readonly
                />
              </div>
            </div>
          </div>

          <div class="mt-4">
            <div id="inventoryValueTrendChart" class="min-h-[300px]"></div>
          </div>
        </div>

        <!-- Row 3 Table: Bảng Cảnh Báo Tồn Kho Cần Xử Lý Ngay -->
        <div class="table-card p-5">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
            <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i data-lucide="alert-octagon" class="w-4 h-4 text-rose-500"></i>
                Danh sách cảnh báo tồn kho &amp; cận date cần xử lý ngay
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Các mặt hàng vi phạm định mức an toàn hoặc có lô cận date cần ưu tiên xuất FEFO
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button id="btnViewAllStockCatalog" onclick="switchTab('wh-stock')" class="btn btn-secondary btn-sm">
                <span>Xem toàn bộ danh mục</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- Table Container -->
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="col-code">Mã SKU</th>
                  <th>Tên mặt hàng</th>
                  <th>Mã lô &amp; Hạn dùng</th>
                  <th class="col-num text-right">Tồn hiện tại</th>
                  <th class="col-num text-right">Ngưỡng an toàn</th>
                  <th class="col-badge text-center">Trạng thái</th>
                  <th class="col-actions text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody id="stockAlertsTableBody">
                <tr>
                  <td colspan="7" class="px-5 py-8 text-center text-gray-400 dark:text-gray-500">
                    <div class="flex items-center justify-center gap-2">
                      <span class="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></span>
                      <span>Đang quét các cảnh báo tồn kho...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </section>
`;

content = content.substring(0, dashStart) + newDashMarkup + content.substring(dashEnd);

// Update renderStockAlertsTable in JS
const oldAlertsStart = content.indexOf('function renderStockAlertsTable(alerts) {');
const oldAlertsEnd = content.indexOf('// --------------------------------------------------------------------------\n// SECTION 3: APEXCHARTS INITIALIZATION', oldAlertsStart);

if (oldAlertsStart !== -1 && oldAlertsEnd !== -1) {
  const newAlertsRender = `function renderStockAlertsTable(alerts) {
  const tbody = document.getElementById('stockAlertsTableBody');
  if (!tbody) return;

  if (!alerts || alerts.length === 0) {
    tbody.innerHTML = \`
      <tr>
        <td colspan="7" class="px-5 py-6 text-center text-gray-400 dark:text-gray-500">
          <i data-lucide="check-circle" class="w-5 h-5 text-emerald-500 inline-block mb-1"></i>
          <p class="font-medium text-xs">Hiện tại không có cảnh báo vi phạm an toàn kho!</p>
        </td>
      </tr>
    \`;
    lucide.createIcons();
    return;
  }

  tbody.innerHTML = alerts.map(item => {
    let badgeType = 'badge-success';
    let badgeText = 'Bình thường';

    if (item.alert_level === 'OUT_OF_STOCK') {
      badgeType = 'badge-danger';
      badgeText = 'Hết hàng';
    } else if (item.alert_level === 'NEAR_EXPIRY') {
      badgeType = 'badge-warning';
      badgeText = \`Cận Date (\${item.days_left || 0}d)\`;
    } else if (item.alert_level === 'LOW_STOCK') {
      badgeType = 'badge-warning';
      badgeText = 'Dưới mức an toàn';
    }

    return \`
      <tr class="hover:bg-gray-50/60 dark:hover:bg-white/2 transition-colors">
        <td class="col-code">
          <a href="javascript:void(0)" onclick="openItemDetailModal('\${item.sku}')" class="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            \${cellCode(item.sku)}
          </a>
        </td>
        <td class="font-medium text-gray-900 dark:text-white min-w-[160px]">
          <div>\${item.item_name || item.sku}</div>
          <span class="text-xs text-gray-400 font-normal">\${item.category || 'Gia vị'} • \${item.unit || 'Đơn vị'}</span>
        </td>
        <td class="min-w-[155px]">
          <div class="code text-gray-900 dark:text-white font-medium">\${item.batch_code || 'Lô kho'}</div>
          <div class="code text-rose-600 dark:text-rose-400 text-xs mt-0.5">
            EXP: \${item.exp_date ? fmtDate(item.exp_date) : 'Chưa có'}
          </div>
        </td>
        <td class="col-num text-right num font-semibold text-gray-900 dark:text-white">
          \${fmtNum(item.qty)} <span class="text-gray-400 font-normal text-xs">\${item.unit || ''}</span>
        </td>
        <td class="col-num text-right num text-gray-500 dark:text-gray-400">
          \${fmtNum(item.safety_stock || 5.0)} <span class="text-gray-400 font-normal text-xs">\${item.unit || ''}</span>
        </td>
        <td class="col-badge text-center">
          \${cellBadge(badgeText, badgeType)}
        </td>
        <td class="col-actions text-right">
          <button onclick="openIssueModal('\${item.sku}', '\${(item.item_name || '').replace(/'/g, "\\\\'")}', '\${item.batch_code || ''}', \${item.qty})" class="btn btn-primary btn-sm">
            <i data-lucide="package-minus" class="w-3.5 h-3.5"></i> Xuất ngay
          </button>
        </td>
      </tr>
    \`;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

`;
  content = content.substring(0, oldAlertsStart) + newAlertsRender + content.substring(oldAlertsEnd);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated wh-dashboard in index.html');
