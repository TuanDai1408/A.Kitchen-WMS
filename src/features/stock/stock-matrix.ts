import type { StockData, StockFilter } from './types';
import { exportFnbStockExcel } from './export';

declare const lucide: any;
declare function showLoading(): void;
declare function hideLoading(): void;
declare function showToast(msg: string): void;

export let gFnbStockData: StockData | null = null;
export const gFnbStockFilter: StockFilter = {
  site: 'ALL',
  group: 'ALL',
  search: '',
  showValue: false
};
export let gFnbStockSearchTerm = '';

export async function loadFnbStock(): Promise<void> {
  try {
    if (typeof showLoading === 'function') showLoading();
    const url = new URL('/api/fnb/stock', window.location.origin);
    if (gFnbStockFilter.site && gFnbStockFilter.site !== 'ALL' && gFnbStockFilter.site !== 'all') {
      url.searchParams.set('site_code', gFnbStockFilter.site);
    }
    if (gFnbStockFilter.region && gFnbStockFilter.region !== 'ALL') {
      url.searchParams.set('regionId', gFnbStockFilter.region);
    }
    if (gFnbStockFilter.group && gFnbStockFilter.group !== 'ALL') {
      url.searchParams.set('group', gFnbStockFilter.group);
    }
    url.searchParams.set('refresh', 'true');
    const res = await fetch(url.toString());
    const json = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || 'Không tải được dữ liệu tồn kho F&B');
    }
    gFnbStockData = json.data as StockData;
    (window as any).gFnbStockData = gFnbStockData;
    renderFnbStock();
  } catch (err: any) {
    console.error('Error loadFnbStock:', err);
    if (typeof showToast === 'function') showToast('Lỗi tải tồn kho F&B: ' + (err?.message || err));
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export function renderFnbStock(): void {
  if (!gFnbStockData) return;

  const sites = gFnbStockData.sites || [];
  const allRows = gFnbStockData.rows || [];
  const groupMap = gFnbStockData.groups || {};
  const query = (gFnbStockSearchTerm || '').trim().toLowerCase();

  // Filter rows by search term
  const filteredRows = allRows.filter(r => {
    if (!query) return true;
    const nameMatch = (r.name || '').toLowerCase().includes(query);
    const codeMatch = (r.code || '').toLowerCase().includes(query);
    return nameMatch || codeMatch;
  });

  // Filter rows by specific site if selected
  const currentSiteFilter = gFnbStockFilter.site;
  let displayRows = filteredRows;
  if (currentSiteFilter && currentSiteFilter !== 'ALL' && currentSiteFilter !== 'all') {
    displayRows = filteredRows.filter(r => {
      const cell = r.cells && r.cells[currentSiteFilter];
      return cell && (cell.hasSiteRecord || (cell.book !== undefined && Number(cell.book) !== 0) || (cell.lastCount !== null && cell.lastCount !== undefined));
    });
  }

  // Calculate KPI metrics
  let totalChainValue = 0;
  let negativeCount = 0;
  let noOpeningCount = 0;

  filteredRows.forEach(r => {
    sites.forEach(s => {
      const cell = r.cells && r.cells[s.id];
      if (cell) {
        const val = Number(cell.value) || 0;
        const bk = Number(cell.book) || 0;
        totalChainValue += val;
        if (bk < 0) negativeCount++;
        if (cell.noOpening) noOpeningCount++;
      }
    });
  });

  // Update KPI displays
  const kpiItems = document.getElementById('fnbStockKpiTotalItems');
  const kpiValue = document.getElementById('fnbStockKpiTotalValue');
  const kpiNeg = document.getElementById('fnbStockKpiNegative');
  const kpiNoOp = document.getElementById('fnbStockKpiNoOpening');

  if (kpiItems) kpiItems.textContent = displayRows.length.toLocaleString('vi-VN');
  if (kpiValue) kpiValue.textContent = Math.round(totalChainValue).toLocaleString('vi-VN') + ' đ';
  if (kpiNeg) kpiNeg.textContent = negativeCount.toLocaleString('vi-VN');
  if (kpiNoOp) kpiNoOp.textContent = noOpeningCount.toLocaleString('vi-VN');

  // 1. Render Desktop Table Head
  const thead = document.getElementById('fnbStockTableHead');
  if (thead) {
    let headHtml = `
      <tr>
        <th class="py-3 px-3 text-center w-12 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">STT</th>
        <th class="py-3 px-4 text-left font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 sticky left-0 z-20 bg-gray-50 dark:bg-white/3 min-w-[240px] shadow-[2px_0_5px_rgba(0,0,0,0.04)]">Mặt Hàng F&amp;B</th>
        <th class="py-3 px-3 text-center w-16 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">ĐVT</th>
    `;
    sites.forEach(s => {
      const isMN = s.region === 'Miền Nam';
      headHtml += `
        <th class="py-3 px-3 text-right font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 min-w-[125px]">
          <div class="flex items-center justify-end gap-1.5">
            <span class="text-xs px-1.5 py-0.2 rounded font-semibold ${isMN ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}">${isMN ? 'MN' : 'MB'}</span>
            <span title="${s.name}" class="text-gray-800 dark:text-gray-200">${s.code}</span>
          </div>
          <div class="text-xs font-normal text-gray-400 truncate max-w-[115px]" title="${s.name}">${s.name}</div>
        </th>
      `;
    });
    headHtml += `</tr>`;
    thead.innerHTML = headHtml;
  }

  // 2. Render Desktop Table Body
  const tbody = document.getElementById('fnbStockTableBody');
  if (tbody) {
    if (displayRows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${sites.length + 3}" class="text-center py-12 text-gray-400">Không tìm thấy mặt hàng nào phù hợp với bộ lọc.</td></tr>`;
    } else {
      tbody.innerHTML = displayRows.map((r, idx) => {
        const groupLabel = groupMap[r.group] || r.group;
        let rowHtml = `
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${idx + 1}</td>
            <td class="py-3 px-4 sticky left-0 z-10 bg-white dark:bg-white/3 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${groupLabel}</span>
                <span class="font-bold text-gray-900 dark:text-white truncate max-w-[180px]">${r.name}</span>
              </div>
              <div class="text-xs tabular-nums text-gray-400 mt-0.5 flex items-center gap-2">
                <span>${r.code}</span>
                <span>•</span>
                <span>Giá: ${r.price ? Number(r.price).toLocaleString('vi-VN') + ' đ' : '--'}</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-medium text-gray-600 dark:text-gray-300 text-xs">${r.unit}</td>
        `;

        sites.forEach(s => {
          const cell = (r.cells && r.cells[s.id]) || { book: 0, lastCount: null, noOpening: true, value: 0 };
          const numBook = Number(cell.book) || 0;
          const isNegative = numBook < 0;
          const bookClass = isNegative
            ? 'text-rose-600 dark:text-rose-400 font-semibold'
            : (numBook > 0 ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-400 dark:text-gray-600 font-medium');

          let lastCountHtml = '';
          if (cell.lastCount !== null && cell.lastCount !== undefined && cell.lastCount !== '') {
            const numCount = Number(cell.lastCount);
            if (!isNaN(numCount)) {
              const countFormatted = Number.isInteger(numCount) ? numCount.toLocaleString('vi-VN') : numCount.toFixed(1);
              lastCountHtml = ` <span class="text-gray-400 dark:text-gray-500 font-normal text-xs" title="Đếm gần nhất (${cell.lastDate || 'N/A'}): ${countFormatted}">(${countFormatted})</span>`;
            }
          }

          let alertBadge = '';
          if (cell.noOpening) {
            alertBadge = `<span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" title="Chưa có tồn đầu"></span>`;
          }

          let valHtml = '';
          const numVal = Number(cell.value) || 0;
          if (gFnbStockFilter.showValue && numVal) {
            valHtml = `<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums mt-0.5">${Math.round(numVal).toLocaleString('vi-VN')} đ</div>`;
          }

          const bookFormatted = Number.isInteger(numBook) ? numBook.toLocaleString('vi-VN') : numBook.toFixed(1);

          rowHtml += `
            <td class="py-3 px-3 text-right tabular-nums text-xs select-all">
              <div class="flex items-center justify-end">
                ${alertBadge}
                <span class="${bookClass}">${bookFormatted}</span>${lastCountHtml}
              </div>
              ${valHtml}
            </td>
          `;
        });

        rowHtml += `</tr>`;
        return rowHtml;
      }).join('');
    }
  }

  // 3. Render Native Mobile Card View
  const mob = document.getElementById('fnbStockMobileCards');
  if (mob) {
    if (displayRows.length === 0) {
      mob.innerHTML = `<div class="text-center py-10 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không tìm thấy mặt hàng nào phù hợp với bộ lọc.</div>`;
    } else {
      mob.innerHTML = filteredRows.map(r => {
        const groupLabel = groupMap[r.group] || r.group;

        const siteCards = sites.map(s => {
          const cell = (r.cells && r.cells[s.id]) || { book: 0, lastCount: null, noOpening: true, value: 0 };
          const numBook = Number(cell.book) || 0;
          const isNeg = numBook < 0;
          const isZero = numBook === 0;
          const bookFormatted = Number.isInteger(numBook) ? numBook.toLocaleString('vi-VN') : numBook.toFixed(1);
          let countText = '';
          if (cell.lastCount !== null && cell.lastCount !== undefined && cell.lastCount !== '') {
            const numCount = Number(cell.lastCount);
            if (!isNaN(numCount)) {
              const countFormatted = Number.isInteger(numCount) ? numCount.toLocaleString('vi-VN') : numCount.toFixed(1);
              countText = `(${countFormatted})`;
            }
          }
          return {
            site: s,
            cell,
            isNeg,
            isZero,
            bookFormatted,
            countText
          };
        });

        return `
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-gray-800/80">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${groupLabel}</span>
                  <span class="text-xs tabular-nums text-gray-400 font-bold">${r.code}</span>
                </div>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1 leading-snug">${r.name}</h4>
              </div>
              <div class="text-right shrink-0">
                <span class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold tabular-nums">${r.unit}</span>
                <div class="text-xs text-gray-400 tabular-nums mt-1">${r.price ? Number(r.price).toLocaleString('vi-VN') + ' đ' : ''}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              ${siteCards.map(sc => {
                const isMN = sc.site.region === 'Miền Nam';
                return `
                  <div class="p-2.5 rounded-xl ${sc.isNeg ? 'bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40' : (sc.isZero ? 'bg-gray-50 dark:bg-gray-900/40 border border-gray-200/60 dark:border-gray-800/60' : 'bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60')}">
                    <div class="flex items-center justify-between gap-1 mb-1">
                      <span class="font-bold text-gray-800 dark:text-gray-200 text-xs">${sc.site.code}</span>
                      <span class="text-[8.5px] px-1 rounded font-semibold ${isMN ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}">${isMN ? 'MN' : 'MB'}</span>
                    </div>
                    <div class="flex items-baseline justify-between tabular-nums">
                      <span class="text-xs text-gray-400">Tồn:</span>
                      <span class="${sc.isNeg ? 'text-rose-600 dark:text-rose-400 font-semibold text-sm' : (sc.isZero ? 'text-gray-400 font-medium' : 'text-gray-900 dark:text-white font-bold text-sm')}">${sc.bookFormatted} <span class="text-xs text-gray-400 font-normal">${sc.countText}</span></span>
                    </div>
                    ${sc.cell.noOpening ? '<div class="text-xs text-amber-500 font-semibold mt-0.5">⚠️ Chưa có tồn đầu</div>' : ''}
                    ${gFnbStockFilter.showValue && sc.cell.value ? `<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums text-right mt-0.5">${Math.round(sc.cell.value).toLocaleString('vi-VN')} đ</div>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function onFnbStockFilterChange(): void {
  const regEl = document.getElementById('fnbStockFilterRegion') as HTMLSelectElement | null;
  const grpEl = document.getElementById('fnbStockFilterGroup') as HTMLSelectElement | null;
  const siteEl = document.getElementById('fnbStockFilterSite') as HTMLSelectElement | null;
  if (siteEl) gFnbStockFilter.site = siteEl.value;
  if (regEl) gFnbStockFilter.region = regEl.value;
  if (grpEl) gFnbStockFilter.group = grpEl.value;
  loadFnbStock();
}

export function onFnbStockSearch(val: string): void {
  gFnbStockSearchTerm = val;
  renderFnbStock();
}

export function onFnbStockToggleValue(checked: boolean): void {
  gFnbStockFilter.showValue = checked;
  renderFnbStock();
}

export function handleExportFnbStockExcel(): void {
  exportFnbStockExcel(gFnbStockData);
}
