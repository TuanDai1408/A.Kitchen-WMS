import fs from 'fs';

const filePath = 'public/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const stockStart = content.indexOf('<section id="wh-stock"');
const stockEnd = content.indexOf('<section id="wh-reorder"');

if (stockStart === -1 || stockEnd === -1) {
  console.error('Could not find wh-stock section boundaries');
  process.exit(1);
}

const newStockMarkup = `<section id="wh-stock" class="tab-panel space-y-4">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Hạn dùng &amp; xuất FEFO</h1>
            <p class="page-subtitle">Tự động ưu tiên xuất theo hạn dùng tăng dần (FEFO). Cảnh báo cận date ≤ 7 ngày theo chuẩn an toàn thực phẩm.</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="exportFefoToExcel()" class="btn btn-secondary">
              <i data-lucide="file-spreadsheet" class="w-4 h-4"></i> Xuất Excel
            </button>
            <button onclick="openReceiptModal()" class="btn btn-primary">
              <i data-lucide="plus" class="w-4 h-4"></i> Nhập lô mới
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar">
          <div class="relative flex-1 min-w-[240px]">
            <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
            <input 
              type="text" 
              id="fefoSearchInput" 
              oninput="filterFefoLive()" 
              placeholder="Tìm SKU, tên gia vị, mã lô..." 
              class="input pl-9 w-full"
            />
          </div>

          <div class="w-full sm:w-48">
            <select id="fefoCategoryFilter" onchange="filterFefoLive()" class="select">
              <option value="">Tất cả nhóm hàng</option>
              <option value="Gia vị">Gia vị</option>
              <option value="Vật tư tiêu hao">Vật tư tiêu hao</option>
              <option value="CCDC">CCDC</option>
            </select>
          </div>

          <div class="w-full sm:w-52">
            <select id="fefoStatusFilter" onchange="filterFefoLive()" class="select">
              <option value="">Tất cả trạng thái</option>
              <option value="safe">An toàn</option>
              <option value="yellow">Cận Date (≤ 15 ngày)</option>
              <option value="red">Nguy cơ FEFO (≤ 7 ngày)</option>
            </select>
          </div>

          <button onclick="resetFefoFilters()" class="btn btn-secondary btn-icon" title="Đặt lại bộ lọc">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Bulk Selection Indicator -->
        <div id="stockBulkActionBar" class="hidden p-3 rounded-lg bg-brand-50 dark:bg-brand-500/15 border border-brand-200 dark:border-brand-500/30 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2 text-brand-700 dark:text-brand-400 font-medium">
            <span id="selectedStockCount" class="font-bold num">0</span> mặt hàng đã được chọn
          </div>
          <div class="flex items-center gap-2">
            <button onclick="exportSelectedStockExcel()" class="btn btn-primary btn-sm">
              <i data-lucide="download" class="w-3.5 h-3.5"></i> Xuất các dòng đã chọn
            </button>
            <button onclick="clearStockSelection()" class="btn btn-secondary btn-sm">
              Bỏ chọn
            </button>
          </div>
        </div>

        <!-- Table Card -->
        <div class="table-card p-5">
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="text-center w-10">
                    <input type="checkbox" id="selectAllStockCheckbox" onchange="toggleSelectAllStock(this.checked)" class="rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer">
                  </th>
                  <th class="text-center w-16 cursor-pointer hover:text-gray-900 dark:hover:text-white" onclick="sortStockBy('fefo_priority')">Ưu tiên</th>
                  <th class="col-code cursor-pointer hover:text-gray-900 dark:hover:text-white" onclick="sortStockBy('sku')">Mã SKU</th>
                  <th class="cursor-pointer hover:text-gray-900 dark:hover:text-white min-w-[180px]" onclick="sortStockBy('item_name')">Tên mặt hàng</th>
                  <th class="col-code">Mã lô</th>
                  <th class="col-date cursor-pointer hover:text-gray-900 dark:hover:text-white" onclick="sortStockBy('exp_date')">Hạn dùng (EXP)</th>
                  <th class="col-num text-right cursor-pointer hover:text-gray-900 dark:hover:text-white" onclick="sortStockBy('qty')">Số lượng tồn</th>
                  <th class="col-num text-right cursor-pointer hover:text-gray-900 dark:hover:text-white" onclick="sortStockBy('days_remaining')">Ngày còn</th>
                  <th class="col-badge text-center">Trạng thái</th>
                  <th class="col-actions text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody id="fefoTableBody">
                <tr><td colspan="10" class="p-8 text-center text-gray-400 dark:text-gray-500">Đang nạp dữ liệu tồn kho...</td></tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 gap-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 mt-4">
            <div id="stockPaginationInfo">
              Hiển thị <span class="font-bold text-gray-800 dark:text-white num">1</span> - <span id="stockPageEnd" class="font-bold text-gray-800 dark:text-white num">10</span> trên tổng số <span id="stockTotalCount" class="font-bold text-gray-800 dark:text-white num">0</span> mặt hàng
            </div>
            <div class="inline-flex items-center gap-1.5 self-end sm:self-auto">
              <button id="stockPrevBtn" onclick="changeStockPage(-1)" class="btn btn-secondary btn-sm">
                Trước
              </button>
              <span id="stockCurrentPageBadge" class="badge badge-brand num px-3 py-1">1</span>
              <button id="stockNextBtn" onclick="changeStockPage(1)" class="btn btn-secondary btn-sm">
                Sau
              </button>
            </div>
          </div>

          <!-- Native Mobile Card View -->
          <div id="fefoMobileCards" class="block lg:hidden space-y-3 mt-4"></div>
        </div>
      </section>
`;

content = content.substring(0, stockStart) + newStockMarkup + content.substring(stockEnd);

// Also update window.renderFefoRows
const oldFefoRenderStart = content.indexOf('window.renderFefoRows = function(items) {');
const oldFefoRenderEnd = content.indexOf('// 5. Action Handlers for Stock Table', oldFefoRenderStart);

if (oldFefoRenderStart !== -1 && oldFefoRenderEnd !== -1) {
  const newFefoRender = `window.renderFefoRows = function(items) {
  const tbody = document.getElementById('fefoTableBody');
  const mob = document.getElementById('fefoMobileCards');

  if (!items || !items.length) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="10" class="p-8 text-center text-gray-400 dark:text-gray-500">Không tìm thấy mặt hàng nào phù hợp với bộ lọc.</td></tr>';
    if (mob) mob.innerHTML = '<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không tìm thấy mặt hàng nào phù hợp với bộ lọc.</div>';
    return;
  }

  // 1. Desktop Table
  if (tbody) {
    tbody.innerHTML = items.map(r => {
      let badgeType = 'badge-success';
      if (r.danger_level === 'red') badgeType = 'badge-danger';
      else if (r.danger_level === 'yellow') badgeType = 'badge-warning';

      const isChecked = typeof selectedStockSkus !== 'undefined' && selectedStockSkus.has(r.sku);
      const batchDisp = r.batch_code || r.batch_no || r.site_code || 'KHO';
      const uomDisp = r.unit || r.uom || 'Phần';
      const expDisp = r.exp_date ? fmtDate(r.exp_date) : '—';
      const qtyNum = typeof r.qty === 'number' ? r.qty : (parseFloat(r.qty) || 0);
      const daysLeft = r.days_remaining !== undefined ? r.days_remaining : (r.days_left !== undefined ? r.days_left : 45);
      const daysText = daysLeft <= 0 ? (qtyNum < 0 ? 'Tồn âm' : 'Hết hàng') : \`\${daysLeft} ngày\`;

      return \`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="text-center">
            <input type="checkbox" class="stock-row-checkbox rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer" data-sku="\${r.sku}" onchange="toggleStockItemSelect('\${r.sku}', this.checked)" \${isChecked ? 'checked' : ''}>
          </td>
          <td class="text-center">
            <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center code text-xs mx-auto">\${r.fefo_priority}</span>
          </td>
          <td class="col-code">
            <a href="javascript:void(0)" onclick="openItemDetailModal('\${r.sku}')" class="text-brand-600 dark:text-brand-400 hover:underline" title="Xem chi tiết kỹ thuật">
              \${cellCode(r.sku)}
            </a>
          </td>
          <td class="font-medium text-gray-900 dark:text-white min-w-[180px]">\${r.item_name}</td>
          <td class="col-code">\${cellCode(batchDisp)}</td>
          <td class="col-date">\${cellDate(expDisp)}</td>
          <td class="col-num text-right num font-semibold text-gray-900 dark:text-white">
            \${typeof fmtNum === 'function' ? fmtNum(qtyNum) : qtyNum} <span class="text-gray-400 text-xs font-normal">\${uomDisp}</span>
          </td>
          <td class="col-num text-right num font-semibold \${r.danger_level === 'red' ? 'text-rose-600 dark:text-rose-400' : (r.danger_level === 'yellow' ? 'text-amber-600 dark:text-amber-400' : 'text-brand-600 dark:text-brand-400')}">\${daysText}</td>
          <td class="col-badge text-center">
            \${cellBadge(r.status_text || 'An toàn', badgeType)}
          </td>
          <td class="col-actions text-right">
            <div class="inline-flex items-center gap-1 justify-end">
              <button onclick="openItemDetailModal('\${r.sku}')" class="btn btn-secondary btn-icon h-8 w-8" title="Xem chi tiết kỹ thuật">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="openEditItemModal('\${r.sku}')" class="btn btn-secondary btn-icon h-8 w-8" title="Chỉnh sửa định mức an toàn">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="openIssueModal('\${r.sku}', '\${(r.item_name || '').replace(/'/g, "\\\\'")}', '\${batchDisp}', \${qtyNum})" class="btn btn-primary btn-sm h-8" title="Xuất bếp">
                <i data-lucide="package-minus" class="w-3.5 h-3.5"></i> Xuất bếp
              </button>
            </div>
          </td>
        </tr>
      \`;
    }).join('');
  }

  // 2. Mobile Cards
  if (mob) {
    mob.innerHTML = items.map(r => {
      let badgeType = 'badge-success';
      if (r.danger_level === 'red') badgeType = 'badge-danger';
      else if (r.danger_level === 'yellow') badgeType = 'badge-warning';

      const batchDisp = r.batch_code || r.batch_no || r.site_code || 'KHO';
      const uomDisp = r.unit || r.uom || 'Phần';
      const expDisp = r.exp_date ? fmtDate(r.exp_date) : '—';
      const qtyNum = typeof r.qty === 'number' ? r.qty : (parseFloat(r.qty) || 0);
      const daysLeft = r.days_remaining !== undefined ? r.days_remaining : (r.days_left !== undefined ? r.days_left : 45);
      const daysText = daysLeft <= 0 ? (qtyNum < 0 ? 'Tồn âm' : 'Hết hàng') : \`Còn \${daysLeft} ngày\`;

      return \`
        <div class="data-card space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center code text-xs shrink-0">P\${r.fefo_priority}</span>
              <span class="font-medium text-sm text-gray-900 dark:text-white truncate">\${r.item_name}</span>
            </div>
            \${cellBadge(r.status_text || daysText, badgeType)}
          </div>
          <div class="grid grid-cols-2 gap-2.5 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs">
            <div class="space-y-0.5 min-w-0">
              <div class="text-[11px] text-gray-500 dark:text-gray-400">Mã SKU</div>
              <div class="code font-semibold text-gray-900 dark:text-white truncate">\${r.sku}</div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-[11px] text-gray-500 dark:text-gray-400">Mã Lô / Điểm Bán</div>
              <div class="code text-gray-900 dark:text-white truncate">\${batchDisp}</div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-[11px] text-gray-500 dark:text-gray-400">Hạn dùng (EXP)</div>
              <div class="date font-medium text-gray-900 dark:text-white">\${expDisp}</div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-[11px] text-gray-500 dark:text-gray-400">Số lượng tồn</div>
              <div class="num font-bold text-gray-900 dark:text-white">\${fmtNum(qtyNum)} <span class="font-normal text-gray-400 text-xs">\${uomDisp}</span></div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
            <button onclick="openItemDetailModal('\${r.sku}')" class="btn btn-secondary btn-sm">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Chi tiết
            </button>
            <button onclick="openIssueModal('\${r.sku}', '\${(r.item_name || '').replace(/'/g, "\\\\'")}', '\${batchDisp}', \${qtyNum})" class="btn btn-primary btn-sm">
              <i data-lucide="package-minus" class="w-3.5 h-3.5"></i> Xuất bếp
            </button>
          </div>
        </div>
      \`;
    }).join('');
  }
}

`;
  content = content.substring(0, oldFefoRenderStart) + newFefoRender + content.substring(oldFefoRenderEnd);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated wh-stock in index.html');
