import fs from 'fs';

const filePath = 'public/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const ltStart = content.indexOf('<section id="wh-leadtime"');
const ltEnd = content.indexOf('<section id="wh-posap"');

if (ltStart === -1 || ltEnd === -1) {
  console.error('Could not find wh-leadtime section boundaries');
  process.exit(1);
}

const newLtMarkup = `<section id="wh-leadtime" class="tab-panel space-y-4">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Lead Time &amp; NCC</h1>
            <p class="page-subtitle">Theo dõi thời gian giao hàng nhà cung cấp và đánh giá cam kết SLA</p>
          </div>
        </div>

        <!-- Top Action & Filter Bar -->
        <div class="filter-bar">
          <div class="field flex-1 min-w-[160px]">
            <label class="field-label">Kỳ đặt hàng (Tháng)</label>
            <input type="month" id="leadTimeMonth" value="2026-11" onchange="loadLeadTime()" class="input">
          </div>
          <div class="field flex-1 min-w-[160px]">
            <label class="field-label">Đánh giá SLA</label>
            <select id="leadTimeSlaFilter" onchange="filterLeadTimeSla(this.value)" class="select">
              <option value="ALL">Tất cả đơn PO</option>
              <option value="ON_TIME">Đúng hạn SLA</option>
              <option value="DELIVERING">Đang giao hàng</option>
              <option value="LATE">Trễ hẹn NCC</option>
            </select>
          </div>
          <button onclick="loadLeadTime()" class="btn btn-primary self-end">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i> Tải dữ liệu
          </button>
        </div>

        <div class="table-card p-5">
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="col-code">Mã đơn PO</th>
                  <th>Điểm nhận</th>
                  <th>Nhà cung cấp</th>
                  <th class="col-date">Thời gian đặt</th>
                  <th class="col-date">Thời gian nhận</th>
                  <th class="col-num text-right">Lead time thực tế</th>
                  <th class="col-badge text-center">Đánh giá SLA</th>
                </tr>
              </thead>
              <tbody id="leadTimeTableBody">
                <tr><td colspan="7" class="p-8 text-center text-gray-400 dark:text-gray-500">Đang tải lịch sử giao hàng...</td></tr>
              </tbody>
            </table>
          </div>
          <!-- Native Mobile Card View -->
          <div id="leadTimeMobileCards" class="block lg:hidden space-y-3 mt-4"></div>
        </div>
      </section>
`;

content = content.substring(0, ltStart) + newLtMarkup + content.substring(ltEnd);

// Also update renderLeadTimeTable
const oldLtRenderStart = content.indexOf('window.renderLeadTimeTable = function(items) {');
const oldLtRenderEnd = content.indexOf('// 7. Inventory & PO SAP Logic', oldLtRenderStart);

if (oldLtRenderStart !== -1 && oldLtRenderEnd !== -1) {
  const newLtRender = `window.renderLeadTimeTable = function(items) {
  const tbody = document.getElementById('leadTimeTableBody');
  const mob = document.getElementById('leadTimeMobileCards');

  if (!items || !items.length) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="p-8 text-center text-gray-400">Không tìm thấy đơn PO nào phù hợp với Site và Kỳ tháng đã chọn.</td></tr>';
    if (mob) mob.innerHTML = '<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không tìm thấy đơn PO nào phù hợp với Site và Kỳ tháng đã chọn.</div>';
    return;
  }

  if (tbody) {
    tbody.innerHTML = items.map(r => {
      const sup = r.supplier_name || r.vendor_name || 'Bếp Trung Tâm Siba Food';
      const oDate = r.order_date || (r.order_time ? r.order_time.split(' ')[0] : '—');
      const dDate = r.actual_delivery_date || (r.received_time ? r.received_time.split(' ')[0] : '—');
      const actual = (r.actual_lead_time_days !== null && r.actual_lead_time_days !== undefined) ? (r.actual_lead_time_days + ' ngày') : (r.lead_time_hours ? (r.lead_time_hours + 'h') : '—');
      const st = r.status || (r.sla_status === 'Đạt SLA' ? 'ĐÚNG HẠN' : 'TRỄ HẠN');
      const isGood = st === 'ĐÚNG HẠN' || r.sla_status === 'Đạt SLA';
      const isPending = st === 'ĐANG GIAO' || r.sla_status === 'Chờ giao';

      const badgeType = isGood ? 'badge-success' : (isPending ? 'badge-warning' : 'badge-danger');

      return \`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="col-code">\${cellCode(r.po_number)}</td>
          <td>\${cellSite(r.branch_code || r.site)}</td>
          <td class="font-medium text-gray-900 dark:text-white">\${escapeHtml(sup)}</td>
          <td class="col-date">\${cellDate(oDate)}</td>
          <td class="col-date">\${cellDate(dDate)}</td>
          <td class="col-num text-right num font-semibold \${!isGood && !isPending ? 'text-rose-600 dark:text-rose-400' : 'text-brand-600 dark:text-brand-400'}">\${actual}</td>
          <td class="col-badge text-center">
            \${cellBadge(st, badgeType)}
          </td>
        </tr>
      \`;
    }).join('');
  }

  if (mob) {
    mob.innerHTML = items.map(r => {
      const sup = r.supplier_name || r.vendor_name || 'Bếp Trung Tâm Siba Food';
      const oDate = r.order_date || (r.order_time ? r.order_time.split(' ')[0] : '—');
      const dDate = r.actual_delivery_date || (r.received_time ? r.received_time.split(' ')[0] : '—');
      const actual = (r.actual_lead_time_days !== null && r.actual_lead_time_days !== undefined) ? (r.actual_lead_time_days + ' ngày') : (r.lead_time_hours ? (r.lead_time_hours + 'h') : '—');
      const st = r.status || (r.sla_status === 'Đạt SLA' ? 'ĐÚNG HẠN' : 'TRỄ HẠN');
      const isGood = st === 'ĐÚNG HẠN' || r.sla_status === 'Đạt SLA';
      const isPending = st === 'ĐANG GIAO' || r.sla_status === 'Chờ giao';

      const badgeType = isGood ? 'badge-success' : (isPending ? 'badge-warning' : 'badge-danger');

      return \`
        <div class="data-card space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <div>
              <div class="font-medium text-sm text-gray-900 dark:text-white">\${escapeHtml(sup)}</div>
              <div class="code text-gray-400 mt-0.5">PO: \${r.po_number} · Điểm: <span class="text-brand-600 dark:text-brand-400 font-semibold">\${r.branch_code || r.site || '—'}</span></div>
            </div>
            \${cellBadge(st, badgeType)}
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div>Ngày đặt: <span class="date font-medium text-gray-900 dark:text-white">\${fmtDate(oDate)}</span></div>
            <div>Ngày nhận: <span class="date font-medium text-gray-900 dark:text-white">\${fmtDate(dDate)}</span></div>
            <div class="col-span-2">Lead time thực tế: <span class="num font-semibold text-brand-600 dark:text-brand-400">\${actual}</span></div>
          </div>
        </div>
      \`;
    }).join('');
  }
}

`;
  content = content.substring(0, oldLtRenderStart) + newLtRender + content.substring(oldLtRenderEnd);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated wh-leadtime in index.html');
