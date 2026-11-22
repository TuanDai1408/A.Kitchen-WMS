import fs from 'fs';

const filePath = 'public/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const sitesStart = content.indexOf('<section id="fnb-sites"');
const sitesEnd = content.indexOf('<section id="user-matrix"');

if (sitesStart === -1 || sitesEnd === -1) {
  console.error('Could not find fnb-sites section boundaries');
  process.exit(1);
}

const newSitesMarkup = `<section id="fnb-sites" class="tab-panel space-y-4">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge badge-brand">Master Data</span>
              <h1 class="page-title">Danh mục 14 điểm bán / bếp ăn vận hành</h1>
              <span id="fnbSitesCountBadge" class="badge badge-neutral num">14 điểm bán</span>
            </div>
            <p class="page-subtitle">Danh mục chính thức liên kết mã SAP, khu vực địa lý và hạn mức ngân sách vật tư tháng</p>
          </div>
          <button onclick="loadFnbSites()" class="btn btn-secondary btn-icon" title="Tải lại dữ liệu">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Sites Master Table -->
        <div class="table-card p-5">
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="col-code">Mã SAP</th>
                  <th>Tên điểm bán / Bếp vận hành</th>
                  <th class="text-center">Vùng miền</th>
                  <th>Địa chỉ cơ sở</th>
                  <th>Quản lý &amp; Hotline</th>
                  <th class="col-num text-right">Ngân sách CCDC</th>
                  <th class="col-badge text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody id="fnbSitesMasterTableBody">
              </tbody>
            </table>
          </div>
          <!-- Native Mobile Card View -->
          <div id="fnbSitesMobileCards" class="block lg:hidden space-y-3 mt-4"></div>
        </div>
      </section>
`;

content = content.substring(0, sitesStart) + newSitesMarkup + content.substring(sitesEnd);

// Also update renderFnbSites
const oldSitesRenderStart = content.indexOf('window.renderFnbSites = function(sites) {');
const oldSitesRenderEnd = content.indexOf('// 13. F&B CHAIN STOCK MATRIX ENGINE', oldSitesRenderStart);

if (oldSitesRenderStart !== -1 && oldSitesRenderEnd !== -1) {
  const newSitesRender = `window.renderFnbSites = function(sites) {
  const tbody = document.getElementById('fnbSitesMasterTableBody');
  const mob = document.getElementById('fnbSitesMobileCards');
  if (!sites) return;

  const countBadge = document.getElementById('fnbSitesCountBadge');
  if (countBadge) {
    countBadge.textContent = \`\${sites.length} điểm bán\`;
  }

  if (tbody) {
    if (!sites.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="p-8 text-center text-gray-400">Không có điểm bán nào.</td></tr>';
    } else {
      tbody.innerHTML = sites.map(s => \`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="col-code">\${cellCode(s.code)}</td>
          <td class="font-medium text-gray-900 dark:text-white">\${escapeHtml(s.name)}</td>
          <td class="text-center">
            \${cellBadge(s.region || 'Miền Nam', 'badge-neutral')}
          </td>
          <td class="text-gray-500 dark:text-gray-400 text-xs">\${escapeHtml(s.address || 'Hệ thống căn tin Tân Long Group')}</td>
          <td>
            <div class="font-medium text-gray-900 dark:text-white text-xs">\${escapeHtml(s.site_type || 'Quản lý cơ sở')}</div>
            <div class="num text-gray-400 text-[11px]">\${s.phone || '0903.000.xxx'}</div>
          </td>
          <td class="col-num text-right num font-semibold text-gray-900 dark:text-white">\${Number(s.budget || 10000000).toLocaleString('vi-VN')} ₫</td>
          <td class="col-badge text-center">
            \${cellBadge('Hoạt động', 'badge-success')}
          </td>
        </tr>
      \`).join('');
    }
  }

  if (mob) {
    if (!sites.length) {
      mob.innerHTML = '<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không có điểm bán nào.</div>';
    } else {
      mob.innerHTML = sites.map(s => \`
        <div class="data-card space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="code font-semibold text-brand-600 dark:text-brand-400">\${s.code}</span>
              \${cellBadge(s.region || 'Miền Nam', 'badge-neutral')}
            </div>
            \${cellBadge('Hoạt động', 'badge-success')}
          </div>
          <div class="font-medium text-sm text-gray-900 dark:text-white">\${escapeHtml(s.name)}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5"></i>
            <span>\${escapeHtml(s.address || 'Hệ thống căn tin Tân Long Group')}</span>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800 text-xs">
            <span class="text-gray-500">Ngân sách:</span>
            <span class="num font-semibold text-gray-900 dark:text-white">\${Number(s.budget || 10000000).toLocaleString('vi-VN')} ₫</span>
          </div>
          <button onclick="viewSiteDetail('\${s.code}')" class="btn btn-secondary btn-sm w-full">
            <i data-lucide="bar-chart-2" class="w-3.5 h-3.5 text-brand-600"></i> Xem báo cáo P&amp;L điểm này
          </button>
        </div>
      \`).join('');
    }
  }

  if (window.lucide) lucide.createIcons();
};

function renderFnbSites(sites) {
  return window.renderFnbSites(sites);
}

`;
  content = content.substring(0, oldSitesRenderStart) + newSitesRender + content.substring(oldSitesRenderEnd);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated fnb-sites in index.html');
