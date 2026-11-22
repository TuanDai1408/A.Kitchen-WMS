import fs from 'fs';

const filePath = 'public/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const posapStart = content.indexOf('<section id="wh-posap"');
const posapEnd = content.indexOf('<section id="portal-voucher"');

if (posapStart === -1 || posapEnd === -1) {
  console.error('Could not find wh-posap section boundaries');
  process.exit(1);
}

const newPosapMarkup = `<section id="wh-posap" class="tab-panel space-y-4">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Tồn kho</h1>
            <p class="page-subtitle">Theo dõi số lượng hàng hóa đã nhập kho, tồn kho thực tế, tra cứu thẻ kho và chi tiết các lô hàng</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="exportWhInventoryToExcel()" class="btn btn-secondary">
              <i data-lucide="file-spreadsheet" class="w-4 h-4"></i> Xuất Excel tồn kho
            </button>
            <button onclick="loadWhInventory()" class="btn btn-primary">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i> Làm mới
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar">
          <div class="field flex-1 min-w-[200px]">
            <label class="field-label">Điểm bán / Điểm kho</label>
            <select id="whInvSiteSelect" onchange="loadWhInventory()" class="select">
              <option value="ALL">Toàn hệ thống (Tất cả điểm)</option>
            </select>
          </div>
          <div class="field flex-1 min-w-[220px]">
            <label class="field-label">Tìm kiếm vật tư</label>
            <div class="relative">
              <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
              <input type="text" id="whInvSearchInput" oninput="filterWhInventoryTable()" placeholder="Nhập mã SKU hoặc tên hàng..." class="input pl-9 w-full">
            </div>
          </div>
          <div class="field flex-1 min-w-[180px]">
            <label class="field-label">Nhóm ngành hàng</label>
            <select id="whInvCategorySelect" onchange="filterWhInventoryTable()" class="select">
              <option value="">Tất cả nhóm ngành</option>
            </select>
          </div>
          <div class="field flex-1 min-w-[180px]">
            <label class="field-label">Trạng thái tồn kho</label>
            <select id="whInvStatusSelect" onchange="filterWhInventoryTable()" class="select">
              <option value="ALL">Tất cả mặt hàng</option>
              <option value="HAS_RECEIPT">Đã nhập trong kỳ (&gt; 0)</option>
              <option value="IN_STOCK">Còn tồn kho (&gt; 0)</option>
              <option value="HAS_BATCH">Có quản lý lô hàng</option>
              <option value="NEGATIVE">Âm kho / Cần kiểm tra</option>
            </select>
          </div>
        </div>

        <!-- 5 Summary KPI Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Tổng mặt hàng</span>
                <p class="kpi-sub mt-0.5">Danh mục vật tư</p>
              </div>
              <div class="kpi-icon"><i data-lucide="package" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value" id="whKpiTotalSkus">0</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Lượng đã nhập</span>
                <p class="kpi-sub mt-0.5">Hàng đã nhập kho</p>
              </div>
              <div class="kpi-icon"><i data-lucide="arrow-down-left" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value text-emerald-600 dark:text-emerald-400" id="whKpiTotalReceiptQty">0</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Tồn sổ sách</span>
                <p class="kpi-sub mt-0.5">Khối lượng tồn hiện tại</p>
              </div>
              <div class="kpi-icon"><i data-lucide="database" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value text-indigo-600 dark:text-indigo-400" id="whKpiTotalBookQty">0</span>
              </div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Tổng giá trị tồn</span>
                <p class="kpi-sub mt-0.5">Theo giá chuẩn</p>
              </div>
              <div class="kpi-icon"><i data-lucide="circle-dollar-sign" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value text-amber-600 dark:text-amber-400" id="whKpiTotalValue">0 ₫</span>
              </div>
            </div>
          </div>

          <div class="kpi-card col-span-2 sm:col-span-1">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Lô hàng quản lý</span>
                <p class="kpi-sub mt-0.5">Lô date lưu kho</p>
              </div>
              <div class="kpi-icon"><i data-lucide="layers" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value text-purple-600 dark:text-purple-400" id="whKpiTotalBatches">0</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Table & Mobile Cards -->
        <div class="table-card p-5 space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              Hiển thị <span id="whInvRowCount" class="font-bold text-gray-900 dark:text-white num">0</span> mặt hàng
            </div>
            <div class="text-xs text-gray-400 italic">
              Bấm "Thẻ kho" để xem lịch sử xuất nhập, hoặc "Lô hàng" để xem chi tiết lô date
            </div>
          </div>

          <div class="table-scroll">
            <table class="data-table" id="whInventoryTable">
              <thead>
                <tr>
                  <th class="text-center w-10">STT</th>
                  <th class="col-code">Mã SKU</th>
                  <th class="min-w-[160px]">Tên mặt hàng</th>
                  <th class="text-center w-28">Ngành hàng</th>
                  <th class="text-center w-16">ĐVT</th>
                  <th class="col-num text-right">Đã nhập</th>
                  <th class="col-num text-right">Tồn sách</th>
                  <th class="col-num text-right">Đơn giá</th>
                  <th class="col-num text-right">Giá trị tồn</th>
                  <th class="text-center w-24">Lô hàng</th>
                  <th class="col-actions text-center w-36">Thao tác</th>
                </tr>
              </thead>
              <tbody id="whInventoryTableBody">
                <tr><td colspan="11" class="p-8 text-center text-gray-400 dark:text-gray-500">Đang tải dữ liệu tồn kho...</td></tr>
              </tbody>
            </table>
          </div>

          <!-- Native Mobile Card View -->
          <div id="whInventoryMobileCards" class="block lg:hidden space-y-3 mt-4"></div>
        </div>
      </section>
`;

content = content.substring(0, posapStart) + newPosapMarkup + content.substring(posapEnd);

// Also update renderWhInventory in JS
const oldInvRenderStart = content.indexOf('// Render Desktop Table\n  const tbody = document.getElementById(\'whInventoryTableBody\');');
const oldInvRenderEnd = content.indexOf('// Helper: Format tiền tệ VND', oldInvRenderStart);

if (oldInvRenderStart !== -1 && oldInvRenderEnd !== -1) {
  const newInvRender = `// Render Desktop Table
  const tbody = document.getElementById('whInventoryTableBody');
  const mob = document.getElementById('whInventoryMobileCards');

  if (!list.length) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="11" class="p-8 text-center text-gray-400">Không có mặt hàng nào phù hợp với bộ lọc hiện tại.</td></tr>';
    if (mob) mob.innerHTML = '<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không có mặt hàng nào phù hợp với bộ lọc hiện tại.</div>';
    return;
  }

  if (tbody) {
    tbody.innerHTML = list.map((r, idx) => {
      const receiptQty = parseFloat(r.receipt_qty || 0);
      const bookQty = parseFloat(r.book_qty || 0);
      const batchCount = parseInt(r.batch_count || 0, 10);
      
      let stockBadgeType = 'badge-neutral';
      if (bookQty < 0) stockBadgeType = 'badge-danger';
      else if (bookQty > 0) stockBadgeType = 'badge-success';

      return \`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="text-center text-gray-400 num text-xs">\${idx + 1}</td>
          <td class="col-code">
            <button onclick="openWhItemHistoryModal('\${r.sku}')" class="font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1" title="Xem thẻ kho chi tiết">
              \${cellCode(r.sku)}
              <i data-lucide="external-link" class="w-3 h-3 opacity-60"></i>
            </button>
          </td>
          <td class="font-medium text-gray-900 dark:text-white min-w-[160px]">
            <div class="line-clamp-2">\${escapeHtml(r.name || r.sku)}</div>
          </td>
          <td class="text-center">
            \${cellBadge(r.category || 'Vật tư', 'badge-neutral')}
          </td>
          <td class="text-center text-gray-600 dark:text-gray-300 font-medium text-xs">\${r.unit || 'Phần'}</td>
          <td class="col-num text-right num font-semibold text-emerald-700 dark:text-emerald-400">
            \${fmtNum(receiptQty)}
          </td>
          <td class="col-num text-right num font-semibold">
            \${cellBadge(fmtNum(bookQty), stockBadgeType)}
          </td>
          <td class="col-num text-right num text-gray-600 dark:text-gray-300">
            \${fmtVND(r.unit_price)}
          </td>
          <td class="col-num text-right num font-semibold text-gray-900 dark:text-white">
            \${fmtVND(r.total_value)}
          </td>
          <td class="text-center">
            \${batchCount > 0 
              ? \`<button onclick="openWhItemBatchesModal('\${r.sku}')" class="badge badge-brand cursor-pointer hover:opacity-80 transition-opacity">
                  <i data-lucide="layers" class="w-3 h-3 inline mr-1"></i>\${batchCount} lô
                </button>\`
              : '<span class="text-gray-400 text-xs">—</span>'
            }
          </td>
          <td class="col-actions text-center">
            <div class="inline-flex items-center gap-1 justify-center">
              <button onclick="openWhItemHistoryModal('\${r.sku}')" class="btn btn-secondary btn-sm" title="Lịch sử xuất nhập">
                Thẻ kho
              </button>
              \${batchCount > 0 
                ? \`<button onclick="openWhItemBatchesModal('\${r.sku}')" class="btn btn-secondary btn-sm" title="Chi tiết các lô date">
                    Lô
                  </button>\`
                : ''
              }
            </div>
          </td>
        </tr>
      \`;
    }).join('');
  }

  if (mob) {
    mob.innerHTML = list.map(r => {
      const receiptQty = parseFloat(r.receipt_qty || 0);
      const bookQty = parseFloat(r.book_qty || 0);
      const batchCount = parseInt(r.batch_count || 0, 10);
      let stockBadgeType = 'badge-neutral';
      if (bookQty < 0) stockBadgeType = 'badge-danger';
      else if (bookQty > 0) stockBadgeType = 'badge-success';

      return \`
        <div class="data-card space-y-2.5">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-medium text-sm text-gray-900 dark:text-white">\${escapeHtml(r.name || r.sku)}</div>
              <div class="code text-gray-400 mt-0.5">SKU: \${r.sku} • ĐVT: \${r.unit || 'Phần'}</div>
            </div>
            \${cellBadge(r.category || 'Vật tư', 'badge-neutral')}
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div>Đã nhập: <span class="num font-semibold text-emerald-600 dark:text-emerald-400">\${fmtNum(receiptQty)}</span></div>
            <div>Tồn sách: <span class="num font-semibold text-brand-600 dark:text-brand-400">\${fmtNum(bookQty)}</span></div>
            <div>Đơn giá: <span class="num text-gray-900 dark:text-white">\${fmtVND(r.unit_price)}</span></div>
            <div>Giá trị tồn: <span class="num font-semibold text-gray-900 dark:text-white">\${fmtVND(r.total_value)}</span></div>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800">
            <div>
              \${batchCount > 0 
                ? \`<button onclick="openWhItemBatchesModal('\${r.sku}')" class="badge badge-brand cursor-pointer">
                    <i data-lucide="layers" class="w-3 h-3 inline mr-1"></i>\${batchCount} lô
                  </button>\`
                : '<span class="text-xs text-gray-400">Không có lô</span>'
              }
            </div>
            <div class="flex items-center gap-1.5">
              <button onclick="openWhItemHistoryModal('\${r.sku}')" class="btn btn-secondary btn-sm">
                Thẻ kho
              </button>
              \${batchCount > 0 
                ? \`<button onclick="openWhItemBatchesModal('\${r.sku}')" class="btn btn-secondary btn-sm">
                    Chi tiết lô
                  </button>\`
                : ''
              }
            </div>
          </div>
        </div>
      \`;
    }).join('');
  }
};

`;
  content = content.substring(0, oldInvRenderStart) + newInvRender + content.substring(oldInvRenderEnd);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated wh-posap in index.html');
