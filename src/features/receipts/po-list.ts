import { escapeHtml } from '@/ts/utils/formatters';
import { formatReceiptDateYMD, getActiveFnbReceiptSite } from './helpers';
import type { ReceiptSubView } from './types';

declare const window: any;

export function switchFnbReceiptSubView(view: ReceiptSubView): void {
  window.gFnbReceiptCurrentView = view;
  const poBtn = document.getElementById('fnbReceiptTabBtnPo');
  const histBtn = document.getElementById('fnbReceiptTabBtnHistory');
  const poView = document.getElementById('fnbPoListView');
  const histView = document.getElementById('fnbReceiptHistoryView');

  const activeCls = 'pb-2.5 pt-1 border-b-2 border-brand-500 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center gap-2 shrink-0 transition-all';
  const inactiveCls = 'pb-2.5 pt-1 border-b-2 border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium text-xs flex items-center gap-2 shrink-0 transition-all';

  if (view === 'po') {
    if (poBtn) poBtn.className = activeCls;
    if (histBtn) histBtn.className = inactiveCls;
    if (poView) poView.classList.remove('hidden');
    if (histView) histView.classList.add('hidden');
    loadFnbPoList();
  } else {
    if (histBtn) histBtn.className = activeCls;
    if (poBtn) poBtn.className = inactiveCls;
    if (histView) histView.classList.remove('hidden');
    if (poView) poView.classList.add('hidden');
    if (typeof window.loadFnbReceiptsHistory === 'function') {
      window.loadFnbReceiptsHistory();
    }
  }
}

export async function loadFnbReceipts(targetSite?: string): Promise<void> {
  const siteCode = targetSite || getActiveFnbReceiptSite();
  const hiddenSel = document.getElementById('fnbReceiptFilterSite') as HTMLSelectElement | null;
  if (hiddenSel) hiddenSel.value = siteCode;

  // Sync site badge
  const sites = (typeof window.getAppSitesList === 'function' ? window.getAppSitesList() : []);
  const siteObj = sites.find((s: any) => s.code.toUpperCase() === siteCode.toUpperCase());
  const siteName = siteObj ? (siteObj.ten || siteObj.name) : siteCode;
  const badgeEl = document.getElementById('fnbReceiptCurrentSiteBadge');
  if (badgeEl) badgeEl.textContent = siteName;

  if (window.gFnbReceiptCurrentView === 'history') {
    if (typeof window.loadFnbReceiptsHistory === 'function') {
      await window.loadFnbReceiptsHistory(siteCode);
    }
  } else {
    await loadFnbPoList(siteCode);
  }
}

export function onFnbPoSearchInput(val: string): void {
  renderFnbPoTable(val);
}

export function populateFnbPoSupplierFilter(poList: any[]): void {
  const sel = document.getElementById('fnbPoSupplierFilter') as HTMLSelectElement | null;
  if (!sel) return;
  const currentVal = sel.value || '';
  const suppliers = Array.from(
    new Set(
      (poList || [])
        .map((p: any) => (p.supplier_name || 'Bếp Trung Tâm Siba').trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b, 'vi'));

  sel.innerHTML =
    '<option value="">Tất cả nhà cung cấp</option>' +
    suppliers.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');

  if (currentVal && suppliers.includes(currentVal)) {
    sel.value = currentVal;
  }
}

export async function loadFnbPoList(siteCodeArg?: string): Promise<void> {
  const siteCode = siteCodeArg || getActiveFnbReceiptSite();
  const statusEl = document.getElementById('fnbPoStatusFilter') as HTMLSelectElement | null;
  const status = statusEl ? statusEl.value : 'OPEN';
  const sumEl = document.getElementById('fnbPoSummaryText');

  try {
    if (sumEl) sumEl.textContent = `Đang tải đơn PO của ${siteCode}...`;
    const res = await fetch(`/api/fnb/po-list?site_code=${encodeURIComponent(siteCode)}&status=${encodeURIComponent(status)}&no-cache=1`);
    const json = await res.json();
    if (json.success && json.data) {
      window.gFnbPoList = json.data;
      populateFnbPoSupplierFilter(window.gFnbPoList);
      const searchVal = (document.getElementById('fnbPoSearchInput') as HTMLInputElement | null)?.value || '';
      renderFnbPoTable(searchVal);

      // Update badge pending
      const pendingCount = (window.gFnbPoList || []).filter((p: any) => p.status === 'OPEN').length;
      const bPending = document.getElementById('fnbReceiptBadgePendingCount');
      if (bPending) bPending.textContent = String(pendingCount);
    } else {
      throw new Error(json.error || 'Không tải được danh sách PO');
    }
  } catch (err: any) {
    console.error('loadFnbPoList error:', err);
    if (sumEl) sumEl.textContent = 'Lỗi tải đơn PO: ' + err.message;
  }
}

export function renderFnbPoTable(query: string = ''): void {
  const tbody = document.getElementById('fnbPoTableBody');
  const mob = document.getElementById('fnbPoMobileCards');
  const sumEl = document.getElementById('fnbPoSummaryText');
  const supplierFilter = ((document.getElementById('fnbPoSupplierFilter') as HTMLSelectElement | null)?.value || '').trim().toLowerCase();
  const q = (query || '').toLowerCase().trim();

  let list: any[] = window.gFnbPoList || [];
  if (supplierFilter) {
    list = list.filter(p => {
      const sup = (p.supplier_name || 'Bếp Trung Tâm Siba').trim().toLowerCase();
      return sup === supplierFilter || sup.includes(supplierFilter);
    });
  }
  if (q) {
    list = list.filter(p => {
      const num = (p.po_number || '').toLowerCase();
      const sup = (p.supplier_name || '').toLowerCase();
      const cod = (p.supplier_code || '').toLowerCase();
      return num.includes(q) || sup.includes(q) || cod.includes(q);
    });
  }

  if (sumEl) {
    sumEl.textContent = `Hiển thị ${list.length} đơn đặt hàng`;
  }

  // Desktop Table
  if (tbody) {
    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-10 text-gray-400">Không có đơn đặt hàng PO nào cho điểm bán này.</td></tr>`;
    } else {
      tbody.innerHTML = list.map(po => {
        const isOpen = (po.status === 'OPEN');
        const isCompleted = (po.status === 'COMPLETED');
        const statusBadge = isCompleted 
          ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"><i data-lucide="check-circle-2" class="w-3 h-3"></i> Đã Nhập Kho</span>`
          : (isOpen 
              ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"><i data-lucide="clock" class="w-3 h-3"></i> Chờ Nhập Kho</span>`
              : `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">Nhập 1 phần</span>`);

        const isBTT = (po.po_number || '').startsWith('50000') || !po.supplier_code || po.supplier_name === 'Bếp Trung Tâm Siba';
        const sourceBadge = isBTT
          ? `<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 mr-1.5">BẾP TRUNG TÂM</span>`
          : `<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 mr-1.5">NCC NGOÀI</span>`;

        const totalAmt = Number(po.total_amount) || 0;
        const totalQty = Number(po.total_qty) || 0;

        return `
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-4">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${escapeHtml(po.po_number)}</span>
            </td>
            <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">
              ${escapeHtml(formatReceiptDateYMD(po.doc_date))}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-1">
                ${sourceBadge}
                <span class="font-medium text-gray-900 dark:text-white">${escapeHtml(po.supplier_name || 'Bếp Trung Tâm Siba')}</span>
              </div>
              ${po.supplier_code ? `<div class="text-xs text-gray-400 font-mono mt-0.5">Mã NCC: ${escapeHtml(po.supplier_code)}</div>` : ''}
            </td>
            <td class="py-3 px-3 text-center tabular-nums text-xs font-medium text-gray-700 dark:text-gray-300">
              ${po.item_count} mã
            </td>
            <td class="py-3 px-3 text-right tabular-nums text-xs font-semibold text-gray-800 dark:text-gray-200">
              ${totalQty.toFixed(1)}
            </td>
            <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
              ${totalAmt > 0 ? Math.round(totalAmt).toLocaleString('vi-VN') + ' đ' : 'Theo điều chuyển'}
            </td>
            <td class="py-3 px-3 text-center">
              ${statusBadge}
            </td>
            <td class="py-3 px-3 text-center">
              <button type="button" onclick="openPoReceiptModal('${escapeHtml(po.po_number)}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${isCompleted ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200' : 'bg-brand-500 hover:bg-brand-600 text-white shadow-theme-xs'} font-semibold text-xs transition-all">
                <i data-lucide="${isCompleted ? 'eye' : 'package-plus'}" class="w-3.5 h-3.5"></i>
                <span>${isCompleted ? 'Xem Nhập' : 'Nhập Kho'}</span>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Mobile Cards
  if (mob) {
    if (list.length === 0) {
      mob.innerHTML = `<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không có đơn đặt hàng PO nào.</div>`;
    } else {
      mob.innerHTML = list.map(po => {
        const isCompleted = (po.status === 'COMPLETED');
        const isBTT = (po.po_number || '').startsWith('50000') || !po.supplier_code || po.supplier_name === 'Bếp Trung Tâm Siba';
        const totalAmt = Number(po.total_amount) || 0;
        const totalQty = Number(po.total_qty) || 0;

        return `
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold ${isBTT ? 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300' : 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300'}">${isBTT ? 'BẾP TRUNG TÂM' : 'NCC NGOÀI'}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${escapeHtml(po.supplier_name || 'Bếp Trung Tâm Siba')}</h4>
                <div class="text-xs text-brand-600 dark:text-brand-400 font-mono font-bold mt-0.5">PO: ${escapeHtml(po.po_number)} • ${escapeHtml(formatReceiptDateYMD(po.doc_date))}</div>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold ${isCompleted ? 'text-emerald-600' : 'text-amber-600'} block">${isCompleted ? 'Đã Nhập' : 'Chờ Nhập'}</span>
                <span class="text-xs text-gray-400 tabular-nums">${po.item_count} mặt hàng</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs tabular-nums">
              <div>
                <span class="text-gray-400 text-xs">Tổng SL:</span>
                <span class="font-bold text-gray-800 dark:text-gray-200 ml-1">${totalQty.toFixed(1)}</span>
              </div>
              <div>
                <span class="text-gray-400 text-xs">Tổng tiền:</span>
                <span class="font-bold text-gray-900 dark:text-white ml-1">${totalAmt > 0 ? Math.round(totalAmt).toLocaleString('vi-VN') + ' đ' : 'Nội bộ'}</span>
              </div>
            </div>

            <button type="button" onclick="openPoReceiptModal('${escapeHtml(po.po_number)}')" class="w-full py-2 rounded-xl ${isCompleted ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' : 'bg-brand-500 text-white shadow-theme-xs'} font-semibold text-xs flex items-center justify-center gap-2">
              <i data-lucide="${isCompleted ? 'eye' : 'package-plus'}" class="w-4 h-4"></i>
              <span>${isCompleted ? 'Xem Chi Tiết Đơn' : 'Kiểm Đếm & Nhập Kho Thực Tế'}</span>
            </button>
          </div>
        `;
      }).join('');
    }
  }

  if (window.lucide) window.lucide.createIcons();
}
