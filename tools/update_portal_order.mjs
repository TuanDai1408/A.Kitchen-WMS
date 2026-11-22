import fs from 'fs';

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Update Section portal-order markup
const targetSectionStart = '<section id="portal-order" class="tab-panel space-y-5">';
const sectionStartIdx = html.indexOf(targetSectionStart);
if (sectionStartIdx === -1) {
  console.error('portal-order start not found');
  process.exit(1);
}

const sectionEndMarker = '</section>';
const sectionEndIdx = html.indexOf(sectionEndMarker, sectionStartIdx);
if (sectionEndIdx === -1) {
  console.error('portal-order end not found');
  process.exit(1);
}

const currentSection = html.slice(sectionStartIdx, sectionEndIdx + sectionEndMarker.length);

// Extract the KPI grid part
const kpiStartMarker = '<!-- TailAdmin Unified KPI Grid: Portal Order Budget Strip -->';
const kpiStartIdx = currentSection.indexOf(kpiStartMarker);
const kpiEndMarker = '<!-- Material Table Card -->';
const kpiEndIdx = currentSection.indexOf(kpiEndMarker);

if (kpiStartIdx === -1 || kpiEndIdx === -1) {
  console.error('KPI strip markers not found');
  process.exit(1);
}

const kpiStripHtml = currentSection.slice(kpiStartIdx, kpiEndIdx);

const newSectionHtml = `<section id="portal-order" class="tab-panel space-y-5">
        <div class="page-header">
          <div>
            <h1 class="page-title">Đặt hàng vật tư bếp</h1>
            <p class="page-subtitle">Tạo đơn đặt nguyên vật liệu, kiểm soát hạn mức ngân sách và gửi duyệt theo kỳ</p>
          </div>
        </div>

        <div class="filter-bar">
          <select id="orderVung" class="hidden"></select>
          <select id="orderSite" class="hidden"></select>
          <div class="field">
            <label for="orderSupplyChannel" class="field-label">Nguồn cung ứng</label>
            <select id="orderSupplyChannel" onchange="filterItems()" class="select">
              <option value="ALL">Tất cả nguồn cung ứng</option>
              <option value="BTT">Bếp Trung Tâm Siba</option>
              <option value="NCC">NCC giao trực tiếp điểm</option>
              <option value="URGENT">Đặt hàng khẩn cấp</option>
            </select>
          </div>
          <div class="field">
            <label for="orderMonth" class="field-label">Tháng áp dụng</label>
            <input type="month" id="orderMonth" onchange="loadQuota()" class="input">
          </div>
          <div class="flex items-center gap-2">
            <button onclick="loadQuota()" class="btn btn-secondary w-full sm:w-auto">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i>
              <span>Tải định mức</span>
            </button>
          </div>
        </div>

        ${kpiStripHtml}<!-- Material Table Card -->
        <div class="table-card p-5 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-gray-100 dark:border-gray-800 gap-3">
            <h2 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <i data-lucide="clipboard-list" class="w-5 h-5 text-brand-600 dark:text-brand-400"></i>
              <span>Danh sách vật tư & công cụ dụng cụ</span>
            </h2>
            <button onclick="reviewOrder()" class="btn btn-primary">
              <i data-lucide="check" class="w-4 h-4"></i>
              <span>Xác nhận gửi đơn hàng</span>
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="flex-1 min-w-[200px]">
              <input type="text" id="orderSearch" oninput="filterItems()" placeholder="Tìm mã hoặc tên vật tư..." class="input">
            </div>
            <div class="w-48">
              <select id="fLoai" onchange="filterItems()" class="select"><option value="">Tất cả loại NVL</option></select>
            </div>
            <label class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer ml-auto">
              <input type="checkbox" id="fChiNhap" onchange="filterItems()" class="rounded text-brand-600">
              <span>Chỉ hiện dòng đang nhập</span>
            </label>
          </div>

          <div class="hidden lg:block table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="col-code">Mã hàng</th>
                  <th>Tên sản phẩm</th>
                  <th>Loại</th>
                  <th>ĐVT</th>
                  <th class="col-num text-right">Đơn giá</th>
                  <th class="col-num text-right">Đã đặt lũy kế</th>
                  <th class="col-num text-right w-28">SL đặt</th>
                  <th class="col-num text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody id="dinhMucBody" class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr><td colspan="8" class="p-8 text-center text-gray-400 dark:text-gray-500">Chọn Site và Tháng rồi nhấn "Tải định mức".</td></tr>
              </tbody>
            </table>
          </div>
          <!-- Native Mobile Card View -->
          <div id="orderMobileCards" class="block lg:hidden space-y-3 mt-4"></div>
        </div>
      </section>`;

html = html.slice(0, sectionStartIdx) + newSectionHtml.replace(/\n/g, '\r\n') + html.slice(sectionEndIdx + sectionEndMarker.length);

// 2. Update renderOrderTable in JS
const fnStartMarker = 'function renderOrderTable()';
const fnStartIdx = html.indexOf(fnStartMarker);
if (fnStartIdx !== -1) {
  const desktopRowMarker = '// 1. Render Desktop Table Rows';
  const mobileRowMarker = '// 2. Render Native Mobile Cards';
  const dIdx = html.indexOf(desktopRowMarker, fnStartIdx);
  const mIdx = html.indexOf(mobileRowMarker, fnStartIdx);
  const fnEndMarker = 'if (window.lucide) lucide.createIcons();';
  const endIdx = html.indexOf(fnEndMarker, mIdx);

  if (dIdx !== -1 && mIdx !== -1 && endIdx !== -1) {
    const newDesktopAndMobile = `// 1. Render Desktop Table Rows
      if (body) {
        body.innerHTML = filtered.map(it => {
          const sl = it.soLuongDat || '';
          const thanhTien = (it.soLuongDat || 0) * (it.donGia || 0);
          return \`
            <tr>
              <td class="col-code">\${cellCode(it.maHang)}</td>
              <td><span class="font-medium text-gray-900 dark:text-white">\${it.tenSP}</span></td>
              <td>\${cellBadge('neutral', it.tenLoai || 'CCDC')}</td>
              <td>\${it.dvt || 'Cái'}</td>
              <td class="col-num"><span class="num">\${fmtVND(it.donGia)}</span></td>
              <td class="col-num"><span class="num">\${fmtNum(it.daDat)}</span></td>
              <td class="col-num text-right">
                <input type="number" min="0" value="\${sl}" placeholder="0" class="input h-8 w-24 text-right num"
                  oninput="onQtyChange('\${it.maHang}', this.value)">
              </td>
              <td class="col-num font-semibold text-brand-600 dark:text-brand-400" id="subtotal-\${it.maHang}">\${fmtVND(thanhTien)}</td>
            </tr>
          \`;
        }).join('');
      }

      // 2. Render Native Mobile Cards
      if (mobileContainer) {
        mobileContainer.innerHTML = filtered.map(it => {
          const sl = it.soLuongDat || '';
          const thanhTien = (it.soLuongDat || 0) * (it.donGia || 0);
          return \`
            <div class="data-card space-y-3">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                    \${cellCode(it.maHang)}
                    \${cellBadge('neutral', it.tenLoai || 'CCDC')}
                    <span class="text-xs text-gray-500">ĐVT: \${it.dvt || 'Cái'}</span>
                  </div>
                  <h4 class="font-medium text-sm text-gray-900 dark:text-white leading-snug">\${it.tenSP}</h4>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                <div>
                  <span class="text-xs text-gray-400">Đơn giá:</span>
                  <div class="font-medium text-gray-800 dark:text-gray-200 num">\${fmtVND(it.donGia)}</div>
                </div>
                <div>
                  <span class="text-xs text-gray-400">Đã đặt lũy kế:</span>
                  <div class="font-medium text-gray-800 dark:text-gray-200 num">\${fmtNum(it.daDat)}</div>
                </div>
                <div class="col-span-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                  <div class="flex-1">
                    <label class="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Số lượng đặt:</label>
                    <input type="number" min="0" value="\${sl}" placeholder="0" class="input h-10 w-full text-center num text-sm font-semibold"
                      oninput="onQtyChange('\${it.maHang}', this.value)">
                  </div>
                  <div class="text-right">
                    <span class="text-xs text-gray-400">Thành tiền:</span>
                    <div class="text-base font-semibold text-brand-600 dark:text-brand-400 num" id="mob-subtotal-\${it.maHang}">\${fmtVND(thanhTien)}</div>
                  </div>
                </div>
              </div>
            </div>
          \`;
        }).join('');
      }
      `;

    html = html.slice(0, dIdx) + newDesktopAndMobile.replace(/\n/g, '\r\n') + html.slice(endIdx);
  }
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Successfully updated portal-order!');
