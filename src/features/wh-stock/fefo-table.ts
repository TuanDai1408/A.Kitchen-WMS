import type { StockFefoItem, StockSortColumn, StockSortOrder } from './types';
import {
  getDangerBadgeClass,
  getExpBadgeClass,
  getDaysRemainingText,
  getDaysRemainingMobileText,
  getDaysTextColor,
  getExpDateColor,
  formatBatchCode,
  formatUnit,
  parseQty,
  formatItemQty
} from './helpers';

declare const lucide: any;
declare const App: { fefoItems?: StockFefoItem[]; currentBranch?: string; [key: string]: any };

let stockCurrentPage = 1;
const stockPageSize = 10;
let stockSortColumn: StockSortColumn = 'fefo_priority';
let stockSortOrder: StockSortOrder = 'asc';
export const selectedStockSkus = new Set<string>();

export function getSelectedStockSkus(): Set<string> {
  return selectedStockSkus;
}

export function getStockCurrentPage(): number {
  return stockCurrentPage;
}

export function setStockCurrentPage(page: number): void {
  stockCurrentPage = page;
}

/**
 * Render FEFO items in Desktop Table (10 columns) & Mobile Cards
 */
export function renderFefoRows(items: StockFefoItem[]): void {
  const tbody = document.getElementById('fefoTableBody');
  const mob = document.getElementById('fefoMobileCards');

  if (!items || !items.length) {
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="10" class="p-8 text-center text-gray-400 dark:text-gray-500">Không tìm thấy mặt hàng nào phù hợp với bộ lọc.</td></tr>';
    }
    if (mob) {
      mob.innerHTML = '<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không tìm thấy mặt hàng nào phù hợp với bộ lọc.</div>';
    }
    return;
  }

  // 1. Desktop Table (10 Columns)
  if (tbody) {
    tbody.innerHTML = items.map(r => {
      const badgeClass = getDangerBadgeClass(r.danger_level);
      const expBadgeClass = getExpBadgeClass(r.danger_level);
      const isChecked = selectedStockSkus.has(r.sku);
      const batchDisp = formatBatchCode(r);
      const uomDisp = formatUnit(r);
      const expDisp = r.exp_date ? r.exp_date.slice(0, 10) : '—';
      const qtyNum = parseQty(r.qty);
      const daysLeft = r.days_remaining !== undefined ? r.days_remaining : (r.days_left !== undefined ? r.days_left : 45);
      const daysText = getDaysRemainingText(daysLeft, qtyNum);
      const daysColor = getDaysTextColor(r.danger_level);
      const safeItemName = (r.item_name || '').replace(/'/g, "\\'");
      const priorityNum = r.fefo_priority ?? 1;

      return `
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3.5 text-center whitespace-nowrap">
            <input type="checkbox" class="stock-row-checkbox rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer" data-sku="${r.sku}" onchange="toggleStockItemSelect('${r.sku}', this.checked)" ${isChecked ? 'checked' : ''}>
          </td>
          <td class="p-3.5 text-center whitespace-nowrap">
            <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-mono font-bold text-xs mx-auto">${priorityNum}</span>
          </td>
          <td class="p-3.5 font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            <a href="javascript:void(0)" onclick="openItemDetailModal('${r.sku}')" class="text-brand-500 dark:text-brand-400 hover:underline" title="Xem chi tiết kỹ thuật">
              ${r.sku}
            </a>
          </td>
          <td class="p-3.5 font-medium text-gray-800 dark:text-gray-100 min-w-[180px]">${r.item_name}</td>
          <td class="p-3.5 whitespace-nowrap">
            <span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60">${batchDisp}</span>
          </td>
          <td class="p-3.5 whitespace-nowrap min-w-[130px]">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-semibold border ${expBadgeClass}">
              <i data-lucide="calendar" class="w-3.5 h-3.5 shrink-0 opacity-70"></i>
              <span>${expDisp}</span>
            </div>
          </td>
          <td class="p-3.5 text-right font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap min-w-[110px]">
            ${formatItemQty(qtyNum)} <span class="font-sans text-xs font-normal text-gray-500">${uomDisp}</span>
          </td>
          <td class="p-3.5 text-right font-mono text-xs font-bold whitespace-nowrap min-w-[95px] ${daysColor}">${daysText}</td>
          <td class="p-3.5 text-center whitespace-nowrap min-w-[110px]">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${badgeClass}">${r.status_text || 'An toàn'}</span>
          </td>
          <td class="p-3.5 text-right whitespace-nowrap min-w-[120px]">
            <div class="inline-flex items-center gap-1.5 justify-end">
              <button onclick="openItemDetailModal('${r.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Xem chi tiết kỹ thuật">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
              <button onclick="openEditItemModal('${r.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Chỉnh sửa định mức an toàn">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
              </button>
              <button onclick="openIssueModal('${r.sku}', '${safeItemName}', '${batchDisp}', ${qtyNum})" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1 transition-all">
                <i data-lucide="package-minus" class="w-3.5 h-3.5"></i> Xuất Bếp
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 2. Mobile Cards (Clean stacked layout)
  if (mob) {
    mob.innerHTML = items.map(r => {
      const badgeClass = getDangerBadgeClass(r.danger_level);
      const batchDisp = formatBatchCode(r);
      const uomDisp = formatUnit(r);
      const expDisp = r.exp_date ? r.exp_date.slice(0, 10) : '—';
      const qtyNum = parseQty(r.qty);
      const daysLeft = r.days_remaining !== undefined ? r.days_remaining : (r.days_left !== undefined ? r.days_left : 45);
      const daysText = getDaysRemainingMobileText(daysLeft, qtyNum);
      const expDateColor = getExpDateColor(r.danger_level);
      const daysColor = getDaysTextColor(r.danger_level);
      const safeItemName = (r.item_name || '').replace(/'/g, "\\'");
      const priorityNum = r.fefo_priority ?? 1;

      return `
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">P${priorityNum}</span>
              <span class="font-bold text-xs text-gray-900 dark:text-white truncate">${r.item_name}</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 whitespace-nowrap ${badgeClass}">${r.status_text || daysText}</span>
          </div>
          <div class="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-xs">
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">Mã SKU</div>
              <div class="font-mono font-bold text-gray-900 dark:text-white whitespace-nowrap truncate">${r.sku}</div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">Mã Lô / Điểm Bán</div>
              <div class="font-mono font-semibold text-gray-900 dark:text-white whitespace-nowrap truncate">${batchDisp}</div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">Hạn Dùng (EXP)</div>
              <div class="inline-flex items-center gap-1 font-mono font-bold text-xs whitespace-nowrap ${expDateColor}">
                <i data-lucide="calendar" class="w-3 h-3 shrink-0 opacity-70"></i>
                <span>${expDisp}</span>
              </div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">Tình Trạng Hạn</div>
              <div class="font-mono font-bold text-xs whitespace-nowrap ${daysColor}">${daysText}</div>
            </div>
            <div class="col-span-2 flex justify-between items-center pt-2 border-t border-gray-200/60 dark:border-gray-800">
              <span class="text-xs text-gray-500 font-medium">Tồn khả dụng:</span>
              <span class="font-mono font-bold text-sm whitespace-nowrap ${qtyNum < 0 ? 'text-rose-600' : 'text-brand-500 dark:text-brand-400'}">${formatItemQty(qtyNum)} <span class="font-sans text-xs font-normal text-gray-500">${uomDisp}</span></span>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 pt-1">
            <button onclick="openItemDetailModal('${r.sku}')" class="px-2.5 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">Chi tiết</button>
            <button onclick="openIssueModal('${r.sku}', '${safeItemName}', '${batchDisp}', ${qtyNum})" class="px-2.5 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg flex items-center gap-1 transition-colors"><i data-lucide="package-minus" class="w-3 h-3"></i> Xuất Bếp</button>
          </div>
        </div>
      `;
    }).join('');
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

/**
 * Live search, filter, sort and paginate FEFO stock items
 */
export function filterFefoLive(): void {
  const q = ((document.getElementById('fefoSearchInput') as HTMLInputElement)?.value || '').toLowerCase().trim();
  const category = (document.getElementById('fefoCategoryFilter') as HTMLSelectElement)?.value || '';
  const status = (document.getElementById('fefoStatusFilter') as HTMLSelectElement)?.value || '';

  const rawItems: StockFefoItem[] = (typeof App !== 'undefined' && App.fefoItems) ? App.fefoItems : [];

  const filtered = rawItems.filter(r => {
    const matchSearch = !q || (
      (r.sku && r.sku.toLowerCase().includes(q)) ||
      (r.item_name && r.item_name.toLowerCase().includes(q)) ||
      (r.batch_code && r.batch_code.toLowerCase().includes(q)) ||
      (r.batch_no && r.batch_no.toLowerCase().includes(q))
    );
    const matchCategory = !category || r.category === category || (Boolean(r.category) && r.category!.includes(category));
    let matchStatus = true;
    if (status === 'safe') matchStatus = r.danger_level === 'green';
    else if (status === 'yellow') matchStatus = r.danger_level === 'yellow';
    else if (status === 'red') matchStatus = r.danger_level === 'red';
    else if (status) matchStatus = r.danger_level === status;
    return matchSearch && matchCategory && matchStatus;
  });

  // Sorting
  filtered.sort((a, b) => {
    const valA = (a as any)[stockSortColumn] ?? '';
    const valB = (b as any)[stockSortColumn] ?? '';
    if (typeof valA === 'number' && typeof valB === 'number') {
      return stockSortOrder === 'asc' ? valA - valB : valB - valA;
    }
    return stockSortOrder === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // Pagination Slice
  const total = filtered.length;
  const totalPages = Math.ceil(total / stockPageSize) || 1;
  if (stockCurrentPage > totalPages) stockCurrentPage = totalPages;
  if (stockCurrentPage < 1) stockCurrentPage = 1;

  const startIdx = (stockCurrentPage - 1) * stockPageSize;
  const pagedItems = filtered.slice(startIdx, startIdx + stockPageSize);

  // Update pagination UI elements
  const endEl = document.getElementById('stockPageEnd');
  if (endEl) endEl.textContent = String(Math.min(startIdx + stockPageSize, total));

  const totalEl = document.getElementById('stockTotalCount');
  if (totalEl) totalEl.textContent = String(total);

  const badgeEl = document.getElementById('stockCurrentPageBadge');
  if (badgeEl) badgeEl.textContent = `${stockCurrentPage}/${totalPages}`;

  const prevBtn = document.getElementById('stockPrevBtn') as HTMLButtonElement | null;
  if (prevBtn) prevBtn.disabled = stockCurrentPage <= 1;

  const nextBtn = document.getElementById('stockNextBtn') as HTMLButtonElement | null;
  if (nextBtn) nextBtn.disabled = stockCurrentPage >= totalPages;

  renderFefoRows(pagedItems);
}

export function changeStockPage(delta: number): void {
  stockCurrentPage += delta;
  filterFefoLive();
}

export function sortStockBy(col: StockSortColumn): void {
  if (stockSortColumn === col) {
    stockSortOrder = stockSortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    stockSortColumn = col;
    stockSortOrder = 'asc';
  }
  filterFefoLive();
}

export function resetFefoFilters(): void {
  const searchEl = document.getElementById('fefoSearchInput') as HTMLInputElement | null;
  if (searchEl) searchEl.value = '';

  const catEl = document.getElementById('fefoCategoryFilter') as HTMLSelectElement | null;
  if (catEl) catEl.value = '';

  const statusEl = document.getElementById('fefoStatusFilter') as HTMLSelectElement | null;
  if (statusEl) statusEl.value = '';

  stockCurrentPage = 1;
  filterFefoLive();
}

export function toggleSelectAllStock(isChecked: boolean): void {
  const checkboxes = document.querySelectorAll<HTMLInputElement>('.stock-row-checkbox');
  checkboxes.forEach(cb => {
    cb.checked = isChecked;
    const sku = cb.dataset.sku;
    if (sku) {
      if (isChecked) selectedStockSkus.add(sku);
      else selectedStockSkus.delete(sku);
    }
  });
  updateStockBulkBar();
}

export function toggleStockItemSelect(sku: string, isChecked: boolean): void {
  if (isChecked) selectedStockSkus.add(sku);
  else selectedStockSkus.delete(sku);
  updateStockBulkBar();
}

export function updateStockBulkBar(): void {
  const bar = document.getElementById('stockBulkActionBar');
  const countEl = document.getElementById('selectedStockCount');
  if (!bar) return;
  if (selectedStockSkus.size > 0) {
    bar.classList.remove('hidden');
    if (countEl) countEl.textContent = String(selectedStockSkus.size);
  } else {
    bar.classList.add('hidden');
  }
}

export function clearStockSelection(): void {
  selectedStockSkus.clear();
  const selectAll = document.getElementById('selectAllStockCheckbox') as HTMLInputElement | null;
  if (selectAll) selectAll.checked = false;
  document.querySelectorAll<HTMLInputElement>('.stock-row-checkbox').forEach(cb => { cb.checked = false; });
  updateStockBulkBar();
}
