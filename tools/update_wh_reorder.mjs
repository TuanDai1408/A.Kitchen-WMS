import fs from 'fs';

const filePath = 'public/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const reorderStart = content.indexOf('<section id="wh-reorder"');
const reorderEnd = content.indexOf('<section id="wh-leadtime"');

if (reorderStart === -1 || reorderEnd === -1) {
  console.error('Could not find wh-reorder section boundaries');
  process.exit(1);
}

const newReorderMarkup = `<section id="wh-reorder" class="tab-panel space-y-4">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Cảnh báo tồn ROP</h1>
            <p class="page-subtitle">Công thức tính tự động: <code>ROP = (Mức tiêu thụ/ngày × Lead time) + Tồn an toàn</code></p>
          </div>
          <button onclick="downloadRopExcel()" class="btn btn-secondary">
            <i data-lucide="file-spreadsheet" class="w-4 h-4"></i> Xuất Excel đề xuất
          </button>
        </div>

        <!-- Table Card -->
        <div class="table-card p-5">
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="col-code">Mã SKU</th>
                  <th>Tên mặt hàng</th>
                  <th class="col-num text-right">Tiêu thụ/ngày</th>
                  <th class="col-num text-right">Lead time (ngày)</th>
                  <th class="col-num text-right">Tồn an toàn</th>
                  <th class="col-num text-right">Tồn hiện tại</th>
                  <th class="col-num text-right font-semibold text-amber-700 dark:text-amber-400">Ngưỡng ROP</th>
                  <th class="col-num text-right font-semibold text-brand-700 dark:text-brand-400">Đề xuất đặt</th>
                  <th class="col-badge text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody id="ropTableBody">
                <tr><td colspan="9" class="p-8 text-center text-gray-400 dark:text-gray-500">Đang tính toán ngưỡng ROP...</td></tr>
              </tbody>
            </table>
          </div>
          <!-- Native Mobile Card View -->
          <div id="ropMobileCards" class="block lg:hidden space-y-3 mt-4"></div>
        </div>
      </section>
`;

content = content.substring(0, reorderStart) + newReorderMarkup + content.substring(reorderEnd);

// Also update App.ropItems rendering
const oldRopRenderStart = content.indexOf('if (json.success) {\n      App.ropItems = json.data;\n      const tbody = document.getElementById(\'ropTableBody\');');
const oldRopRenderEnd = content.indexOf('// 6. Upgraded loadLeadTime', oldRopRenderStart);

if (oldRopRenderStart !== -1 && oldRopRenderEnd !== -1) {
  const newRopRender = `if (json.success) {
      App.ropItems = json.data;
      const tbody = document.getElementById('ropTableBody');
      const mob = document.getElementById('ropMobileCards');

      if (tbody) {
        tbody.innerHTML = App.ropItems.map(r => \`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="col-code">\${cellCode(r.sku)}</td>
            <td class="font-medium text-gray-900 dark:text-white">\${r.item_name}</td>
            <td class="col-num text-right num">\${r.daily_usage}</td>
            <td class="col-num text-right num">\${r.lead_time_days}</td>
            <td class="col-num text-right num">\${r.safety_stock}</td>
            <td class="col-num text-right num font-semibold text-gray-900 dark:text-white">\${r.current_stock}</td>
            <td class="col-num text-right num font-semibold text-amber-600 dark:text-amber-400">\${r.rop}</td>
            <td class="col-num text-right num font-semibold text-brand-600 dark:text-brand-400">\${r.suggested_order}</td>
            <td class="col-badge text-center">
              \${cellBadge(r.status, r.status === 'CẦN ĐẶT' ? 'badge-danger' : 'badge-success')}
            </td>
          </tr>
        \`).join('');
      }

      if (mob) {
        mob.innerHTML = App.ropItems.map(r => \`
          <div class="data-card space-y-2.5">
            <div class="flex items-center justify-between gap-2">
              <div>
                <div class="font-medium text-sm text-gray-900 dark:text-white">\${r.item_name}</div>
                <div class="code text-gray-400 mt-0.5">SKU: \${r.sku}</div>
              </div>
              \${cellBadge(r.status, r.status === 'CẦN ĐẶT' ? 'badge-danger' : 'badge-success')}
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div>Tồn hiện tại: <span class="num font-semibold text-gray-900 dark:text-white">\${r.current_stock} \${r.uom}</span></div>
              <div>Điểm ROP: <span class="num font-semibold text-amber-600 dark:text-amber-400">\${r.rop} \${r.uom}</span></div>
              <div>Lead time: <span class="num font-semibold text-gray-900 dark:text-white">\${r.lead_time_days} ngày</span></div>
              <div>Đề xuất đặt: <span class="num font-semibold text-brand-600 dark:text-brand-400">\${r.suggested_order} \${r.uom}</span></div>
            </div>
          </div>
        \`).join('');
      }
    }
  } catch (e) {
    console.error(e);
  }
};

`;
  content = content.substring(0, oldRopRenderStart) + newRopRender + content.substring(oldRopRenderEnd);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated wh-reorder in index.html');
