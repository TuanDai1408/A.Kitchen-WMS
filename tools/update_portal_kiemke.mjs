import fs from 'fs';

const filePath = 'public/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace section #portal-kiemke markup
const kiemkeStart = content.indexOf('<section id="portal-kiemke"');
if (kiemkeStart === -1) {
  console.error('Could not find portal-kiemke section');
  process.exit(1);
}

// Find closing tag of this section: </section> before <section id="tab-404"
const tab404Idx = content.indexOf('<section id="tab-404"');
const kiemkeEnd = content.lastIndexOf('</section>', tab404Idx);

const newKiemkeMarkup = `<section id="portal-kiemke" class="tab-panel space-y-4">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Kiểm kê tồn kho kỳ</h1>
            <p class="page-subtitle">Đối soát, phát hiện chênh lệch và cập nhật số lượng tồn kho thực tế</p>
          </div>
        </div>

        <!-- Top Action Bar -->
        <div class="filter-bar">
          <select id="kkVung" class="hidden"></select>
          <select id="kkSite" class="hidden"></select>
          <div class="field flex-1 min-w-[200px]">
            <label class="field-label">Trọng tâm kiểm kê</label>
            <select id="kkDiscrepancyFilter" onchange="onKkDiscrepancyFilterChange(this.value)" class="select">
              <option value="ALL">Toàn bộ danh mục kiểm kê</option>
              <option value="DIFF">Có chênh lệch (Thừa / Thiếu)</option>
              <option value="COUNTED">Đã kiểm xong (Có số thực tế)</option>
              <option value="UNCOUNTED">Chưa nhập số lượng kiểm</option>
            </select>
          </div>
          <div class="field flex-1 min-w-[160px]">
            <label class="field-label">Kỳ kiểm kê (Tháng)</label>
            <input type="month" id="kkMonth" onchange="loadAudit()" class="input">
          </div>
          <div class="flex items-center gap-2 self-end">
            <button onclick="loadAudit()" class="btn btn-secondary">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i> Tải dữ liệu
            </button>
            <button onclick="saveAudit()" class="btn btn-primary">
              <i data-lucide="save" class="w-4 h-4"></i> Lưu kiểm kê
            </button>
            <button onclick="exportAuditExcel()" class="btn btn-secondary">
              <i data-lucide="file-spreadsheet" class="w-4 h-4"></i> Xuất Excel
            </button>
          </div>
        </div>

        <!-- Thanh Tìm Kiếm & Bộ Lọc Nâng Cao Cho Kiểm Kê Theo Site -->
        <div class="table-card p-4 space-y-3">
          <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <!-- Ô tìm kiếm chi tiết -->
            <div class="relative flex-1 min-w-[260px]">
              <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
              <input type="text" id="kkSearchInput" oninput="filterAuditItems()" placeholder="Tìm kiếm mã vật tư, tên sản phẩm, ngành hàng, nhóm..."
                class="input pl-9 w-full">
            </div>

            <!-- Các bộ lọc chi tiết -->
            <div class="flex flex-wrap items-center gap-2 text-xs">
              <!-- Lọc Ngành hàng -->
              <div class="flex items-center gap-1.5 min-w-[150px]">
                <span class="text-gray-500 dark:text-gray-400 font-medium shrink-0">Ngành:</span>
                <select id="kkNganhSelect" onchange="onAuditNganhChange()" class="select h-9 py-1 text-xs">
                  <option value="">-- Tất cả ngành hàng --</option>
                </select>
              </div>

              <!-- Lọc Nhóm hàng -->
              <div class="flex items-center gap-1.5 min-w-[150px]">
                <span class="text-gray-500 dark:text-gray-400 font-medium shrink-0">Nhóm:</span>
                <select id="kkNhomSelect" onchange="filterAuditItems()" class="select h-9 py-1 text-xs">
                  <option value="">-- Tất cả nhóm hàng --</option>
                </select>
              </div>

              <!-- Lọc Đơn giá -->
              <div class="flex items-center gap-1.5 min-w-[130px]">
                <span class="text-gray-500 dark:text-gray-400 font-medium shrink-0">Giá:</span>
                <select id="kkPriceSelect" onchange="filterAuditItems()" class="select h-9 py-1 text-xs">
                  <option value="ALL">Tất cả đơn giá</option>
                  <option value="WITH_PRICE">Có đơn giá (> 0đ)</option>
                  <option value="NO_PRICE">Chưa có giá (0đ)</option>
                </select>
              </div>

              <!-- Lọc Trạng thái kiểm kê -->
              <div class="flex items-center gap-1.5 min-w-[140px]">
                <span class="text-gray-500 dark:text-gray-400 font-medium shrink-0">Trạng thái:</span>
                <select id="kkStatusSelect" onchange="filterAuditItems()" class="select h-9 py-1 text-xs">
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="COUNTED">Đã nhập số lượng</option>
                  <option value="UNCOUNTED">Chưa nhập số lượng</option>
                  <option value="DIFF">Có chênh lệch tồn</option>
                </select>
              </div>

              <!-- Nút Reset Filter -->
              <button onclick="resetAuditFilters()" title="Xóa toàn bộ bộ lọc và tìm kiếm"
                class="btn btn-secondary btn-sm h-9">
                <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                <span class="hidden sm:inline">Đặt lại</span>
              </button>
            </div>
          </div>

          <!-- Thông tin số lượng kết quả -->
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              Hiển thị: <span id="kkFilteredCount" class="font-bold text-gray-900 dark:text-white num">0</span> / <span id="kkTotalCount" class="font-bold num">0</span> mặt hàng danh mục tồn kho site
            </div>
            <div id="kkActiveFilterBadge" class="hidden text-xs px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-300 font-medium">
              Đang lọc dữ liệu
            </div>
          </div>
        </div>

        <!-- TailAdmin Unified KPI Grid: Báo Cáo Kiểm Kê -->
        <div class="kpi-grid">
          <!-- Card 1: Tổng Mặt Hàng Site -->
          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Tổng Mặt Hàng Site</span>
                <p class="kpi-sub mt-0.5">Danh mục kiểm kê điểm bán</p>
              </div>
              <div class="kpi-icon"><i data-lucide="clipboard-check" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value" id="kkMetricTotalSkus">—</span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-delta-neutral">
                  <span>Toàn bộ SKU</span>
                </span>
                <span class="kpi-sub">Theo site</span>
              </div>
            </div>
          </div>

          <!-- Card 2: Tỷ Lệ Khớp Sổ Sách -->
          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Tỷ Lệ Khớp Sổ Sách</span>
                <p class="kpi-sub mt-0.5">Không chênh lệch tồn</p>
              </div>
              <div class="kpi-icon"><i data-lucide="shield-check" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value" id="kkMetricMatchRate">—</span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-delta-good">
                  <svg class="size-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg>
                  <span>Mục tiêu 95%</span>
                </span>
                <span class="kpi-sub">Độ tin cậy cao</span>
              </div>
            </div>
          </div>

          <!-- Card 3: Tổng Giá Trị Tồn Cuối -->
          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Tổng Giá Trị Tồn Cuối</span>
                <p class="kpi-sub mt-0.5">Quy đổi giá vốn</p>
              </div>
              <div class="kpi-icon"><i data-lucide="circle-dollar-sign" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value" id="kkMetricDiffValue" title="—">—</span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-delta-neutral">
                  <span>Thực tế kiểm</span>
                </span>
                <span class="kpi-sub">Theo giá vốn kho</span>
              </div>
            </div>
          </div>

          <!-- Card 4: Số Mã Có Độ Lệch -->
          <div class="kpi-card">
            <div class="kpi-header">
              <div>
                <span class="kpi-label">Số Mã Có Độ Lệch</span>
                <p class="kpi-sub mt-0.5">Cần đối soát biên bản</p>
              </div>
              <div class="kpi-icon-warning"><i data-lucide="alert-triangle" class="size-5"></i></div>
            </div>
            <div class="kpi-body">
              <div class="flex items-baseline">
                <span class="kpi-value" id="kkMetricDiffCount">—</span>
              </div>
              <div class="kpi-footer">
                <span class="kpi-delta-neutral">
                  <span>Cần xử lý</span>
                </span>
                <span class="kpi-sub">Biên bản giải trình</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Biểu Đồ Đối Chiếu Sổ Sách vs Thực Tế -->
        <div class="table-card p-5 md:p-6">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
            <div>
              <h3 class="text-sm font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
                <i data-lucide="bar-chart-2" class="w-4 h-4 text-brand-500"></i>
                Đối chiếu số lượng tồn sổ sách vs tồn thực tế sau kiểm kê
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">So sánh các mặt hàng trọng yếu của điểm bán</p>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span class="inline-flex items-center gap-1.5 text-gray-500"><span class="h-2.5 w-2.5 rounded-full bg-brand-500"></span> Sổ sách</span>
              <span class="inline-flex items-center gap-1.5 text-gray-500"><span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Thực tế</span>
            </div>
          </div>
          <div id="auditComparisonChart" class="min-h-[240px]"></div>
        </div>

        <div class="table-card p-5">
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="col-code">Mã hàng</th>
                  <th>Tên hàng hóa</th>
                  <th>Ngành / Nhóm hàng</th>
                  <th class="text-center">ĐVT</th>
                  <th class="col-num text-right">Đơn giá</th>
                  <th class="col-num text-right">Tồn kỳ trước</th>
                  <th class="text-right w-28">Sử dụng kỳ</th>
                  <th class="col-num text-right">Tồn cuối kỳ</th>
                  <th class="col-num text-right">Thành tiền tồn</th>
                </tr>
              </thead>
              <tbody id="kkBody">
                <tr><td colspan="9" class="p-8 text-center text-gray-400 dark:text-gray-500">Đang tải danh mục kiểm kê của site...</td></tr>
              </tbody>
            </table>
          </div>
          <!-- Native Mobile Card View -->
          <div id="kkMobileCards" class="block lg:hidden space-y-3 mt-4"></div>
        </div>
      </section>`;

content = content.substring(0, kiemkeStart) + newKiemkeMarkup + content.substring(kiemkeEnd + '</section>'.length);

// 2. Update renderAuditList implementation
const oldRenderFnStart = content.indexOf('function renderAuditList(items) {');
const oldRenderFnEnd = content.indexOf('window.renderAuditList = renderAuditList;', oldRenderFnStart);

if (oldRenderFnStart !== -1 && oldRenderFnEnd !== -1) {
  const newRenderFn = `function renderAuditList(items) {
      const tbody = document.getElementById('kkBody');
      const mob = document.getElementById('kkMobileCards');

      if (!items || !items.length) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="9" class="p-8 text-center text-gray-400 dark:text-gray-500">Không tìm thấy sản phẩm nào khớp với bộ lọc / từ khóa.</td></tr>';
        if (mob) mob.innerHTML = '<div class="p-6 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không tìm thấy sản phẩm nào khớp với bộ lọc.</div>';
        return;
      }

      // Desktop Table
      if (tbody) {
        tbody.innerHTML = items.map(it => {
          const tonTruoc = it.closing_t10 || it.closing_t9 || 0;
          const suDung = it.usage_t11 !== null ? it.usage_t11 : 0;
          const tonCuoi = tonTruoc - suDung;
          const price = parseFloat(it.price) || 0;
          const thanhTien = tonCuoi * price;
          const catLabel = (it.nhom_hang && it.nhom_hang !== 'Chưa phân loại') ? it.nhom_hang : (it.nganh_hang || 'Vật tư');

          return \`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="col-code">\${cellCode(it.item_code)}</td>
              <td>
                <div class="font-medium text-gray-900 dark:text-white">\${escapeHtml(it.item_name)}</div>
                <div class="code text-gray-400 dark:text-gray-500 text-[11px]">\${it.warehouse_code || 'Kho'}</div>
              </td>
              <td>
                <span class="badge badge-neutral max-w-[160px] truncate" title="\${escapeHtml(catLabel)}">
                  \${escapeHtml(catLabel)}
                </span>
              </td>
              <td class="text-center text-gray-600 dark:text-gray-300 font-medium">\${it.unit || ''}</td>
              <td class="col-num text-right num">\${price > 0 ? fmtNum(price) + ' ₫' : '<span class="text-gray-400">0 ₫</span>'}</td>
              <td class="col-num text-right num font-medium text-gray-900 dark:text-white">\${fmtNum(tonTruoc)}</td>
              <td class="text-right">
                <input type="number" min="0" step="any" value="\${suDung}"
                  class="input num text-right h-8 py-1 w-24 text-xs"
                  oninput="onAuditChange(\${it.id}, this.value, \${tonTruoc}, \${price})">
              </td>
              <td class="col-num text-right num font-semibold text-brand-600 dark:text-brand-400" id="aud-close-\${it.id}">\${fmtNum(tonCuoi)}</td>
              <td class="col-num text-right num font-semibold text-gray-900 dark:text-white" id="aud-value-\${it.id}">\${fmtNum(thanhTien)} ₫</td>
            </tr>
          \`;
        }).join('');
      }

      // Mobile Cards
      if (mob) {
        mob.innerHTML = items.map(it => {
          const tonTruoc = it.closing_t10 || it.closing_t9 || 0;
          const suDung = it.usage_t11 !== null ? it.usage_t11 : 0;
          const tonCuoi = tonTruoc - suDung;
          const price = parseFloat(it.price) || 0;
          const thanhTien = tonCuoi * price;
          const catLabel = (it.nhom_hang && it.nhom_hang !== 'Chưa phân loại') ? it.nhom_hang : (it.nganh_hang || 'Vật tư');

          return \`
            <div class="data-card space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="font-medium text-sm text-gray-900 dark:text-white">\${escapeHtml(it.item_name)}</div>
                  <div class="code text-gray-400 mt-0.5">Mã: \${it.item_code} • ĐVT: \${it.unit || ''} • Giá: <span class="num">\${fmtNum(price)} ₫</span></div>
                </div>
                <span class="badge badge-neutral shrink-0 max-w-[120px] truncate">\${escapeHtml(catLabel)}</span>
              </div>
              <div class="grid grid-cols-3 gap-2 text-xs p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div class="text-center">
                  <div class="text-[11px] text-gray-500 dark:text-gray-400">Tồn đầu kỳ</div>
                  <div class="num font-semibold text-gray-900 dark:text-white">\${fmtNum(tonTruoc)}</div>
                </div>
                <div class="text-center">
                  <div class="text-[11px] text-gray-500 dark:text-gray-400">Sử dụng kỳ</div>
                  <input type="number" min="0" step="any" value="\${suDung}"
                    class="input num text-center h-8 py-1 w-full text-xs"
                    oninput="onAuditChange(\${it.id}, this.value, \${tonTruoc}, \${price}); const c = document.getElementById('aud-mob-close-\${it.id}'); if(c) c.innerText = fmtNum(\${tonTruoc} - (parseFloat(this.value)||0)); const v = document.getElementById('aud-mob-value-\${it.id}'); if(v) v.innerText = fmtNum((\${tonTruoc} - (parseFloat(this.value)||0)) * \${price}) + ' ₫';">
                </div>
                <div class="text-center">
                  <div class="text-[11px] text-gray-500 dark:text-gray-400">Tồn cuối kỳ</div>
                  <div class="num font-semibold text-brand-600 dark:text-brand-400" id="aud-mob-close-\${it.id}">\${fmtNum(tonCuoi)}</div>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs pt-1 px-1">
                <span class="text-gray-500 dark:text-gray-400">Thành tiền tồn:</span>
                <span class="num font-semibold text-gray-900 dark:text-white" id="aud-mob-value-\${it.id}">\${fmtNum(thanhTien)} ₫</span>
              </div>
            </div>
          \`;
        }).join('');
      }
    }
    `;
  content = content.substring(0, oldRenderFnStart) + newRenderFn + content.substring(oldRenderFnEnd);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated portal-kiemke in index.html');
