import { escapeHtml } from '@/ts/utils/formatters';
import { getReceiptExpWarningHtml, getActiveFnbReceiptSite } from './helpers';
import { loadFnbPoList, switchFnbReceiptSubView } from './po-list';
import type { ManualReceiptLineDraft } from './types';

declare const window: any;

export async function openManualReceiptModal(preselectedSite?: string): Promise<void> {
  const activeSite = preselectedSite || localStorage.getItem('orbit_user_site') || (window.gCurrentUser && window.gCurrentUser.assignedSite) || getActiveFnbReceiptSite() || 'K001';
  
  const sites = (typeof window.getAppSitesList === 'function' ? window.getAppSitesList() : []);
  const siteObj = sites.find((s: any) => s.code.toUpperCase() === activeSite.toUpperCase());
  const siteName = siteObj ? (siteObj.ten || siteObj.name) : activeSite;
  const fullSiteDisplay = siteName.startsWith(activeSite) ? siteName : `${activeSite} - ${siteName}`;

  const nameDisplay = document.getElementById('manualReceiptSiteNameDisplay');
  if (nameDisplay) nameDisplay.textContent = fullSiteDisplay;

  const sel = document.getElementById('manualReceiptSiteSelect') as HTMLSelectElement | null;
  if (sel) sel.value = activeSite;

  const badge = document.getElementById('manualReceiptSiteBadge');
  if (badge) badge.textContent = activeSite;

  const dateInput = document.getElementById('manualReceiptDate') as HTMLInputElement | null;
  if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);

  const supplierInput = document.getElementById('manualReceiptSupplier') as HTMLInputElement | null;
  if (supplierInput && !supplierInput.value) supplierInput.value = 'Chợ đầu mối / Mua lẻ địa phương';

  const invInput = document.getElementById('manualReceiptInvoiceNo') as HTMLInputElement | null;
  if (invInput) invInput.value = '';

  const notesInput = document.getElementById('manualReceiptNotes') as HTMLInputElement | null;
  if (notesInput) notesInput.value = '';

  const searchInput = document.getElementById('manualItemSearchInput') as HTMLInputElement | null;
  if (searchInput) searchInput.value = '';

  const catSelect = document.getElementById('manualItemCategorySelect') as HTMLSelectElement | null;
  if (catSelect) catSelect.value = '';

  window.gManualReceiptLines = [];
  renderManualReceiptLinesTable();

  const modal = document.getElementById('modalManualReceipt');
  if (modal) modal.classList.remove('hidden');

  await loadManualCatalogItems(activeSite, window.gManualShowAllCatalog);

  if (window.lucide) window.lucide.createIcons();
}

export function closeManualReceiptModal(): void {
  const modal = document.getElementById('modalManualReceipt');
  if (modal) modal.classList.add('hidden');
}

export async function onManualReceiptSiteChange(siteCode: string): Promise<void> {
  const badge = document.getElementById('manualReceiptSiteBadge');
  if (badge) badge.textContent = siteCode;
  await loadManualCatalogItems(siteCode, window.gManualShowAllCatalog);
}

export async function toggleManualShowAllCatalog(): Promise<void> {
  window.gManualShowAllCatalog = !window.gManualShowAllCatalog;
  const txt = document.getElementById('txtToggleManualCatalog');
  if (txt) {
    txt.textContent = window.gManualShowAllCatalog ? 'Xem chỉ của site' : 'Xem toàn chuỗi';
  }
  const siteCode = localStorage.getItem('orbit_user_site') || (window.gCurrentUser && window.gCurrentUser.assignedSite) || (document.getElementById('manualReceiptSiteSelect') as HTMLSelectElement | null)?.value || 'K001';
  await loadManualCatalogItems(siteCode, window.gManualShowAllCatalog);
}

export async function loadManualCatalogItems(siteCode: string, includeAll?: boolean): Promise<void> {
  const container = document.getElementById('manualCatalogListContainer');
  if (container) {
    container.innerHTML = `
      <div class="p-8 text-center text-gray-400 text-xs">
        <i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500"></i>
        <span>Đang tải danh mục mặt hàng...</span>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  try {
    const url = `/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(siteCode)}${includeAll ? '&include_all=1' : ''}`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.success && json.data) {
      window.gManualSiteCatalog = json.data.items || [];
    } else {
      window.gManualSiteCatalog = [];
    }
    filterManualCatalogList();
  } catch (err: any) {
    console.error('loadManualCatalogItems error:', err);
    if (container) {
      container.innerHTML = `<div class="p-4 text-center text-rose-500 text-xs">Lỗi khi tải danh mục: ${escapeHtml(err.message)}</div>`;
    }
  }
}

export function filterManualCatalogList(): void {
  const container = document.getElementById('manualCatalogListContainer');
  const countText = document.getElementById('manualCatalogCountText');
  const q = ((document.getElementById('manualItemSearchInput') as HTMLInputElement | null)?.value || '').trim().toLowerCase();
  const cat = ((document.getElementById('manualItemCategorySelect') as HTMLSelectElement | null)?.value || '').trim().toLowerCase();

  let list: any[] = window.gManualSiteCatalog || [];

  if (q) {
    list = list.filter(i => {
      const code = (i.code || i.sku || '').toLowerCase();
      const name = (i.name || '').toLowerCase();
      return code.includes(q) || name.includes(q);
    });
  }

  if (cat) {
    list = list.filter(i => {
      const grp = (i.nhom_hang || i.item_group || i.nganh_hang || '').toLowerCase();
      return grp.includes(cat);
    });
  }

  if (countText) countText.textContent = String(list.length);

  if (!container) return;

  if (!list.length) {
    container.innerHTML = `
      <div class="p-6 text-center text-gray-400 text-xs bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        Không tìm thấy mặt hàng nào phù hợp ${q ? `với từ khóa "${escapeHtml(q)}"` : ''}.
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => {
    const code = item.code || item.sku;
    const existing = (window.gManualReceiptLines || []).find((l: any) => l.item_code === code);
    const bookQty = parseFloat(item.book_qty || 0);
    const price = parseFloat(item.unit_price || 0);

    return `
      <div onclick="addManualReceiptItem('${code}')" class="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
        existing 
          ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700/80 shadow-xs' 
          : 'bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-emerald-400 hover:shadow-xs'
      }">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[210px]" title="${escapeHtml(item.name || code)}">
              ${escapeHtml(item.name || code)}
            </span>
            <span class="text-xs px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
              ${escapeHtml(item.unit || 'Phần')}
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
            <span class="text-brand-600 dark:text-brand-400 font-semibold">${escapeHtml(code)}</span>
            <span>•</span>
            <span>Tồn: <b class="${bookQty > 0 ? 'text-emerald-600' : 'text-gray-500'} font-mono">${bookQty.toFixed(1)}</b></span>
            <span>•</span>
            <span>Giá: ${price > 0 ? Math.round(price).toLocaleString('vi-VN') + 'đ' : '—'}</span>
          </div>
        </div>
        <div>
          ${existing ? `
            <span class="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs font-mono">
              <i data-lucide="check" class="w-3 h-3"></i> x${existing.qty}
            </span>
          ` : `
            <button type="button" class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors">
              <i data-lucide="plus" class="w-3 h-3"></i> Thêm
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

export function addManualReceiptItem(itemCode: string): void {
  const item = (window.gManualSiteCatalog || []).find((i: any) => (i.code || i.sku) === itemCode);
  if (!item) return;

  const existing = (window.gManualReceiptLines || []).find((l: any) => l.item_code === itemCode);
  if (existing) {
    existing.qty = Math.round((existing.qty + 1) * 100) / 100;
  } else {
    const todayStr = (document.getElementById('manualReceiptDate') as HTMLInputElement | null)?.value || new Date().toISOString().slice(0, 10);
    const defaultBatch = 'LÔ-' + todayStr.replace(/-/g, '').slice(2);
    const dPlus1y = new Date();
    dPlus1y.setFullYear(dPlus1y.getFullYear() + 1);
    const defaultExp = dPlus1y.toISOString().slice(0, 10);

    window.gManualReceiptLines.push({
      item_code: item.code || item.sku,
      item_name: item.name || item.code,
      unit: item.unit || 'Phần',
      unit_price: parseFloat(item.unit_price || 0),
      qty: 1,
      batch_code: defaultBatch,
      exp_date: defaultExp,
      storage_loc: 'Kệ Bếp',
      note: ''
    });
  }

  renderManualReceiptLinesTable();
  filterManualCatalogList();
}

export function renderManualReceiptLinesTable(): void {
  const emptyState = document.getElementById('manualLinesEmptyState');
  const tableWrapper = document.getElementById('manualLinesTableWrapper');
  const mobWrapper = document.getElementById('manualLinesMobileCards');
  const btnClear = document.getElementById('btnClearAllManualLines');
  const tbody = document.getElementById('manualLinesTableBody');
  const countBadge = document.getElementById('manualSelectedCountText');
  const kpiSkus = document.getElementById('manualSummaryTotalSkus');
  const kpiQty = document.getElementById('manualSummaryTotalQty');
  const kpiAmount = document.getElementById('manualSummaryTotalAmount');

  const lines: ManualReceiptLineDraft[] = window.gManualReceiptLines || [];
  if (countBadge) countBadge.textContent = String(lines.length);
  if (kpiSkus) kpiSkus.textContent = lines.length + ' mã';

  if (!lines.length) {
    if (emptyState) emptyState.classList.remove('hidden');
    if (tableWrapper) {
      tableWrapper.classList.add('hidden');
      tableWrapper.classList.remove('lg:block');
    }
    if (mobWrapper) {
      mobWrapper.classList.add('hidden');
      mobWrapper.classList.remove('block');
    }
    if (btnClear) {
      btnClear.classList.add('hidden');
      btnClear.classList.remove('flex');
    }
    if (kpiQty) kpiQty.textContent = '0';
    if (kpiAmount) kpiAmount.textContent = '0 đ';
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (tableWrapper) {
    tableWrapper.classList.remove('hidden');
    tableWrapper.classList.add('lg:block');
  }
  if (mobWrapper) {
    mobWrapper.classList.remove('hidden');
    mobWrapper.classList.add('block');
  }
  if (btnClear) {
    btnClear.classList.remove('hidden');
    btnClear.classList.add('flex');
  }

  let grandQty = 0;
  let grandTotal = 0;

  if (tbody) {
    tbody.innerHTML = lines.map((item, idx) => {
      const lineTotal = (item.qty || 0) * (item.unit_price || 0);
      grandQty += (item.qty || 0);
      grandTotal += lineTotal;

      return `
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2 px-2 text-center text-gray-400 tabular-nums font-mono text-xs">${idx + 1}</td>
          <td class="py-2 px-2.5 min-w-[130px]">
            <div class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[150px]" title="${escapeHtml(item.item_name)}">
              ${escapeHtml(item.item_name)}
            </div>
            <div class="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span class="text-brand-600 dark:text-brand-400">${escapeHtml(item.item_code)}</span>
              <span>•</span>
              <span class="font-sans font-medium text-gray-600 dark:text-gray-300">${escapeHtml(item.unit || '')}</span>
            </div>
          </td>
          <td class="py-2 px-2 text-center w-20">
            <input type="number" step="0.01" min="0.01" value="${item.qty}" 
                   oninput="onManualLineQtyChange(${idx}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-950/20 font-bold font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-brand-500">
          </td>
          <td class="py-2 px-2 text-right w-24">
            <input type="number" step="100" min="0" value="${item.unit_price}" 
                   oninput="onManualLinePriceChange(${idx}, this.value)" 
                   class="w-24 text-right py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:border-brand-500">
          </td>
          <td id="manualLineTotal_${idx}" class="py-2 px-2 text-right font-mono font-bold text-xs tabular-nums text-brand-600 dark:text-brand-400 whitespace-nowrap">
            ${lineTotal > 0 ? Math.round(lineTotal).toLocaleString('vi-VN') + ' đ' : '0 đ'}
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${escapeHtml(item.batch_code || '')}" placeholder="Lô..." 
                   oninput="onManualLineBatchChange(${idx}, this.value)" 
                   class="w-24 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="date" value="${item.exp_date || ''}" 
                   onchange="onManualLineExpChange(${idx}, this.value)" 
                   class="w-32 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${escapeHtml(item.storage_loc || '')}" placeholder="Vị trí..." 
                   oninput="onManualLineLocChange(${idx}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <button type="button" onclick="removeManualReceiptLine(${idx})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="Xóa mặt hàng này">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Mobile Cards for Manual Lines
  if (mobWrapper) {
    mobWrapper.innerHTML = lines.map((item, idx) => {
      const lineTotal = (item.qty || 0) * (item.unit_price || 0);
      return `
        <div class="data-card space-y-2.5 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <div class="flex items-start justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="badge badge-neutral text-xs">#${idx + 1}</span>
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono">${escapeHtml(item.item_code)}</span>
              </div>
              <div class="font-bold text-xs text-gray-900 dark:text-white truncate">${escapeHtml(item.item_name)}</div>
            </div>
            <button type="button" onclick="removeManualReceiptLine(${idx})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="Xóa mặt hàng này">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">Số lượng (${escapeHtml(item.unit || '')}):</label>
              <input type="number" step="0.01" min="0.01" value="${item.qty}" 
                     oninput="onManualLineQtyChange(${idx}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 font-mono text-center font-bold text-xs">
            </div>
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">Đơn giá (₫):</label>
              <input type="number" step="100" min="0" value="${item.unit_price}" 
                     oninput="onManualLinePriceChange(${idx}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-right font-medium text-xs">
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
            <span class="text-gray-400 text-[11px]">Thành tiền:</span>
            <span class="num font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">${lineTotal > 0 ? Math.round(lineTotal).toLocaleString('vi-VN') + ' ₫' : '0 ₫'}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <input type="text" value="${escapeHtml(item.batch_code || '')}" placeholder="Mã lô..." 
                   oninput="onManualLineBatchChange(${idx}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
            <input type="date" value="${item.exp_date || ''}" 
                   onchange="onManualLineExpChange(${idx}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
          </div>
        </div>
      `;
    }).join('');
  }

  if (kpiQty) kpiQty.textContent = grandQty > 0 ? (Number.isInteger(grandQty) ? String(grandQty) : grandQty.toFixed(1)) : '0';
  if (kpiAmount) kpiAmount.textContent = grandTotal > 0 ? Math.round(grandTotal).toLocaleString('vi-VN') + ' đ' : '0 đ';

  if (window.lucide) window.lucide.createIcons();
}

export function onManualLineQtyChange(idx: number, val: string): void {
  if (!window.gManualReceiptLines || !window.gManualReceiptLines[idx]) return;
  const num = parseFloat(val);
  window.gManualReceiptLines[idx].qty = isNaN(num) ? 0 : num;
  updateManualTotals();
}

export function onManualLinePriceChange(idx: number, val: string): void {
  if (!window.gManualReceiptLines || !window.gManualReceiptLines[idx]) return;
  const num = parseFloat(val);
  window.gManualReceiptLines[idx].unit_price = isNaN(num) ? 0 : num;
  updateManualTotals();
}

export function updateManualTotals(): void {
  let grandQty = 0;
  let grandTotal = 0;
  (window.gManualReceiptLines || []).forEach((item: any, idx: number) => {
    const lineTotal = (item.qty || 0) * (item.unit_price || 0);
    grandQty += (item.qty || 0);
    grandTotal += lineTotal;
    const tdTotal = document.getElementById(`manualLineTotal_${idx}`);
    if (tdTotal) {
      tdTotal.textContent = lineTotal > 0 ? Math.round(lineTotal).toLocaleString('vi-VN') + ' đ' : '0 đ';
    }
  });

  const kpiQty = document.getElementById('manualSummaryTotalQty');
  const kpiAmount = document.getElementById('manualSummaryTotalAmount');
  if (kpiQty) kpiQty.textContent = grandQty.toFixed(1);
  if (kpiAmount) kpiAmount.textContent = Math.round(grandTotal).toLocaleString('vi-VN') + ' đ';
}

export function onManualLineBatchChange(idx: number, val: string): void {
  if (!window.gManualReceiptLines || !window.gManualReceiptLines[idx]) return;
  window.gManualReceiptLines[idx].batch_code = val;
}

export function onManualLineExpChange(idx: number, val: string): void {
  if (!window.gManualReceiptLines || !window.gManualReceiptLines[idx]) return;
  window.gManualReceiptLines[idx].exp_date = val;
  const warnEl = document.getElementById(`manualLineExpWarning_${idx}`);
  if (warnEl) {
    warnEl.innerHTML = getReceiptExpWarningHtml(val);
    if (window.lucide) window.lucide.createIcons();
  }
}

export function setManualLineQuickExp(idx: number, months: number): void {
  if (!window.gManualReceiptLines || !window.gManualReceiptLines[idx]) return;
  const baseDate = new Date();
  baseDate.setMonth(baseDate.getMonth() + months);
  const dateStr = baseDate.toISOString().slice(0, 10);
  window.gManualReceiptLines[idx].exp_date = dateStr;

  const input = document.getElementById(`manualLineExpInput_${idx}`) as HTMLInputElement | null;
  if (input) input.value = dateStr;

  const warnEl = document.getElementById(`manualLineExpWarning_${idx}`);
  if (warnEl) {
    warnEl.innerHTML = getReceiptExpWarningHtml(dateStr);
    if (window.lucide) window.lucide.createIcons();
  }
}

export function onManualLineLocChange(idx: number, val: string): void {
  if (!window.gManualReceiptLines || !window.gManualReceiptLines[idx]) return;
  window.gManualReceiptLines[idx].storage_loc = val;
}

export function removeManualReceiptLine(idx: number): void {
  if (!window.gManualReceiptLines || !window.gManualReceiptLines[idx]) return;
  const removedItem = window.gManualReceiptLines[idx];
  window.gManualReceiptLines.splice(idx, 1);
  renderManualReceiptLinesTable();
  if (typeof filterManualCatalogList === 'function') filterManualCatalogList();
  if (typeof window.showToast === 'function') {
    window.showToast('Đã xóa "' + (removedItem.item_name || removedItem.item_code) + '" khỏi phiếu nhập', 'info');
  }
}

export function confirmClearAllManualReceiptLines(): void {
  const lines = window.gManualReceiptLines || [];
  if (!lines.length) {
    if (typeof window.showToast === 'function') window.showToast('Phiếu nhập hiện tại chưa có mặt hàng nào để xóa.', 'info');
    return;
  }
  const countEl = document.getElementById('confirmClearManualCountText');
  if (countEl) countEl.textContent = String(lines.length);
  const modal = document.getElementById('modalConfirmClearManualLines');
  if (modal) {
    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }
}

export function closeConfirmClearManualLinesModal(): void {
  const modal = document.getElementById('modalConfirmClearManualLines');
  if (modal) modal.classList.add('hidden');
}

export function executeClearAllManualReceiptLines(): void {
  const count = (window.gManualReceiptLines || []).length;
  window.gManualReceiptLines = [];
  closeConfirmClearManualLinesModal();
  renderManualReceiptLinesTable();
  filterManualCatalogList();
  if (typeof window.showToast === 'function') {
    window.showToast(`Đã làm trống toàn bộ ${count} mặt hàng trên phiếu nhập`, 'info');
  }
}

export async function submitManualReceipt(): Promise<void> {
  const lines: ManualReceiptLineDraft[] = window.gManualReceiptLines || [];
  const validLines = lines.filter(l => (l.qty || 0) > 0);

  if (!validLines.length) {
    if (typeof window.showToast === 'function') window.showToast('Vui lòng chọn ít nhất một mặt hàng và nhập số lượng lớn hơn 0!');
    return;
  }

  const supplier = ((document.getElementById('manualReceiptSupplier') as HTMLInputElement | null)?.value || '').trim();
  if (!supplier) {
    if (typeof window.showToast === 'function') window.showToast('Vui lòng nhập tên Nhà cung cấp hoặc nguồn hàng!');
    (document.getElementById('manualReceiptSupplier') as HTMLInputElement | null)?.focus();
    return;
  }

  // Check if any line has expired date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let hasExpired = false;
  for (const l of validLines) {
    if (l.exp_date) {
      const expD = new Date(l.exp_date);
      expD.setHours(0, 0, 0, 0);
      if (expD <= today) {
        hasExpired = true;
        break;
      }
    }
  }

  if (hasExpired) {
    const ok = confirm('Cảnh báo: Có mặt hàng có Hạn Dùng (EXP) đã hết hạn hoặc hết hạn hôm nay. Bạn có chắc chắn muốn nhập kho không?');
    if (!ok) return;
  }

  const siteCode = localStorage.getItem('orbit_user_site') || (window.gCurrentUser && window.gCurrentUser.assignedSite) || (document.getElementById('manualReceiptSiteSelect') as HTMLSelectElement | null)?.value || 'K001';
  const receiptDate = (document.getElementById('manualReceiptDate') as HTMLInputElement | null)?.value || new Date().toISOString().slice(0, 10);
  const receiptType = (document.getElementById('manualReceiptType') as HTMLSelectElement | null)?.value || 'NHAP_MUA_TRUC_TIEP';
  const invoiceNo = ((document.getElementById('manualReceiptInvoiceNo') as HTMLInputElement | null)?.value || '').trim() || 'NHAP-THU-CONG';
  const userNotes = ((document.getElementById('manualReceiptNotes') as HTMLInputElement | null)?.value || '').trim();
  const fullNotes = `[${receiptType}] ${userNotes}`.trim();
  const createdBy = (window.gCurrentUser && (window.gCurrentUser.fullName || window.gCurrentUser.name)) || 'Thủ kho / Bếp trưởng';

  const payload = {
    site_code: siteCode,
    receipt_date: receiptDate,
    supplier: supplier,
    invoice_no: invoiceNo,
    notes: fullNotes,
    created_by: createdBy,
    lines: validLines.map(l => ({
      item_code: l.item_code,
      qty: l.qty,
      unit_price: l.unit_price,
      batch_code: (l.batch_code || '').trim(),
      exp_date: (l.exp_date || '').trim() || null,
      storage_loc: l.storage_loc || 'Kệ Bếp',
      note: l.note || ''
    }))
  };

  const btn = document.getElementById('btnSubmitManualReceipt') as HTMLButtonElement | null;
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Đang ghi nhận nhập kho...`;
  }

  try {
    if (typeof window.showLoading === 'function') window.showLoading('Đang nhập kho và cập nhật số dư tồn...');
    const res = await fetch('/api/fnb/receipts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Lỗi khi nhập kho');

    if (typeof window.showToast === 'function') {
      window.showToast(`Nhập kho thủ công thành công phiếu ${json.data.receipt_code}! Tồn kho điểm ${siteCode} đã được cộng tự động.`);
    }

    closeManualReceiptModal();

    // Reload PO list and history
    await loadFnbPoList(siteCode);
    if (typeof window.loadFnbReceiptsHistory === 'function') {
      await window.loadFnbReceiptsHistory(siteCode);
    }

    // Switch to history tab to see the newly generated receipt
    switchFnbReceiptSubView('history');

    // Trigger stock matrix and warehouse inventory reload in background
    if (typeof window.loadWhInventory === 'function') window.loadWhInventory();
    if (typeof window.loadFnbStock === 'function') window.loadFnbStock();
    if (typeof window.loadFnbCounts === 'function') window.loadFnbCounts();

  } catch (err: any) {
    console.error('submitManualReceipt error:', err);
    if (typeof window.showToast === 'function') window.showToast('Lỗi nhập kho thủ công: ' + err.message);
  } finally {
    if (typeof window.hideLoading === 'function') window.hideLoading();
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4"></i> Xác Nhận &amp; Nhập Kho`;
    }
    if (window.lucide) window.lucide.createIcons();
  }
}
