import { escapeHtml, formatCompactVND, adjustListHeightForSubTable } from '@/ts/utils/formatters';
import { getActiveFnbWasteSite } from './helpers';
import { switchFnbWasteSubView } from './history';
import type { FnbWasteStockItem } from './types';
import { assertPermission } from '@/features/auth';

declare const window: any;

export function populateFnbWasteFilters(): void {
  const nganhSel = document.getElementById('fnbWasteNganhHangFilter') as HTMLSelectElement | null;
  const nhomSel = document.getElementById('fnbWasteNhomHangFilter') as HTMLSelectElement | null;
  if (!nganhSel || !nhomSel) return;

  const nganhMap = new Map<string, Set<string>>();
  (window.gFnbWasteStockItems || []).forEach((i: any) => {
    const ng = (i.nganh_hang || 'Chưa phân loại').trim();
    const nh = (i.nhom_hang || i.item_group || 'Chưa phân loại').trim();
    if (!nganhMap.has(ng)) nganhMap.set(ng, new Set());
    nganhMap.get(ng)!.add(nh);
  });
  window.gFnbWasteNganhMap = nganhMap;

  let nganhOpts = '<option value="">Tất cả ngành hàng</option>';
  Array.from(nganhMap.keys()).sort().forEach(ng => {
    nganhOpts += `<option value="${escapeHtml(ng)}">${escapeHtml(ng)}</option>`;
  });
  nganhSel.innerHTML = nganhOpts;
  nganhSel.value = '';

  populateFnbWasteNhomHangDropdown('');
}

export function populateFnbWasteNhomHangDropdown(selectedNganh: string): void {
  const nhomSel = document.getElementById('fnbWasteNhomHangFilter') as HTMLSelectElement | null;
  if (!nhomSel) return;

  const nhomSet = new Set<string>();
  if (window.gFnbWasteNganhMap) {
    if (selectedNganh && window.gFnbWasteNganhMap.has(selectedNganh)) {
      window.gFnbWasteNganhMap.get(selectedNganh)!.forEach((nh: string) => nhomSet.add(nh));
    } else {
      window.gFnbWasteNganhMap.forEach((set: Set<string>) => set.forEach((nh: string) => nhomSet.add(nh)));
    }
  }

  let nhomOpts = '<option value="">Tất cả nhóm hàng</option>';
  Array.from(nhomSet).sort().forEach(nh => {
    nhomOpts += `<option value="${escapeHtml(nh)}">${escapeHtml(nh)}</option>`;
  });
  nhomSel.innerHTML = nhomOpts;
  nhomSel.value = '';
}

export function onFnbWasteNganhHangChange(): void {
  const selectedNganh = (document.getElementById('fnbWasteNganhHangFilter') as HTMLSelectElement | null)?.value || '';
  populateFnbWasteNhomHangDropdown(selectedNganh);
  renderFnbWasteStockTable();
}

export function onFnbWasteFilterChange(): void {
  renderFnbWasteStockTable();
}

export function onFnbWasteSearch(_val?: string): void {
  renderFnbWasteStockTable();
}

export function onFnbWasteSiteChange(): void {
  const sel = document.getElementById('fnbWasteFilterSite') as HTMLSelectElement | null;
  const w = typeof window !== 'undefined' ? (window as any) : {};
  const curUser = w.gCurrentUser;
  const userAssignedSite = (curUser && curUser.assignedSite) || localStorage.getItem('orbit_user_site') || 'K001';

  if (typeof w.canUserSwitchSite === 'function' && !w.canUserSwitchSite(curUser)) {
    if (sel) sel.value = userAssignedSite;
    if (typeof w.openRequestAccessForSite === 'function') {
      w.openRequestAccessForSite();
    }
    if (typeof (window as any).showToast === 'function') {
      (window as any).showToast(`Điểm bán của bạn được cố định là ${userAssignedSite}. Bạn cần xin cấp quyền để chuyển điểm bán!`, 'warning');
    }
    return;
  }

  if (typeof window.loadFnbWaste === 'function') {
    window.loadFnbWaste();
  }
}

export function renderFnbWasteStockTable(): void {
  const tbody = document.getElementById('fnbWasteStockTableBody');
  const mob = document.getElementById('fnbWasteStockMobileCards');
  const emptyState = document.getElementById('fnbWasteStockEmptyState');
  const sumEl = document.getElementById('fnbWasteSummary');
  const bInStock = document.getElementById('fnbWasteBadgeInStockCount');

  const selectedNganh = ((document.getElementById('fnbWasteNganhHangFilter') as HTMLSelectElement | null)?.value || '').trim().toLowerCase();
  const selectedNhom = ((document.getElementById('fnbWasteNhomHangFilter') as HTMLSelectElement | null)?.value || '').trim().toLowerCase();
  const selectedReason = ((document.getElementById('fnbWasteReasonFilter') as HTMLSelectElement | null)?.value || '').trim();
  const query = ((document.getElementById('fnbWasteSearchInput') as HTMLInputElement | null)?.value || '').trim().toLowerCase();

  const allItems: FnbWasteStockItem[] = window.gFnbWasteStockItems || [];

  // Update total in stock KPI
  const kpiCount = document.getElementById('kpiWasteInStockCount');
  const kpiVal = document.getElementById('kpiWasteInStockVal');
  if (kpiCount) kpiCount.textContent = String(allItems.length);

  let totalStockVal = 0;
  allItems.forEach(i => {
    totalStockVal += Number(i.total_value) || (Number(i.book_qty) * Number(i.unit_price) || 0);
  });
  if (kpiVal) {
    const c = formatCompactVND(totalStockVal);
    kpiVal.innerHTML = `${c.val}<span class="kpi-unit">${c.unit}</span>`;
  }

  if (bInStock) bInStock.textContent = String(allItems.length);

  // Filter items for display
  const filtered = allItems.filter(i => {
    if (selectedReason === 'EXP') {
      const days = (i.days_remaining !== undefined) ? Number(i.days_remaining) : 999;
      if (days > 15 && !i.is_expired) return false;
    }
    if (selectedNganh) {
      const ng = (i.nganh_hang || '').trim().toLowerCase();
      if (ng !== selectedNganh) return false;
    }
    if (selectedNhom) {
      const nh = (i.nhom_hang || i.item_group || '').trim().toLowerCase();
      if (nh !== selectedNhom) return false;
    }
    if (query) {
      const name = (i.name || '').toLowerCase();
      const code = (i.code || '').toLowerCase();
      if (!name.includes(query) && !code.includes(query)) return false;
    }
    return true;
  });

  if (sumEl) {
    sumEl.textContent = `Hiển thị ${filtered.length} / ${allItems.length} mặt hàng có tồn > 0`;
  }

  updateWasteKPIs();

  if (!filtered.length) {
    if (tbody) tbody.innerHTML = '';
    if (mob) mob.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  const reasonOptions = [
    'Hàng hỏng / ôi thiu không đạt chuẩn',
    'Quá hạn sử dụng (HSD)',
    'Rách vỡ bao bì / đổ vỡ khi vận chuyển',
    'Dập nát hư hỏng sau sơ chế',
    'Nấu thử món mới & mẫu lưu kiểm thực',
    'Nấu dư cuối ngày không bảo quản được',
    'Hao hụt định mức khác'
  ];

  if (tbody) {
    tbody.innerHTML = filtered.map((item, idx) => {
      const bQty = Number(item.book_qty) || 0;
      const uPrice = Number(item.unit_price) || 0;
      const stockVal = Number(item.total_value) || (bQty * uPrice);
      const wQty = item.wasteQty || 0;
      const lineAmt = wQty * uPrice;

      return `
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${idx + 1}</td>
          <td class="py-3 px-3 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${escapeHtml(item.code)}</td>
          <td class="py-3 px-4">
            <div class="font-semibold text-gray-900 dark:text-white text-xs">${escapeHtml(item.name || item.code)}</div>
            <div class="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span>${escapeHtml(item.nganh_hang || item.item_group || 'Chưa phân loại')}</span>
              ${item.nhom_hang && item.nhom_hang !== item.nganh_hang ? `<span>•</span><span>${escapeHtml(item.nhom_hang)}</span>` : ''}
            </div>
          </td>
          <td class="py-3 px-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
            ${escapeHtml(item.unit || 'Phần')}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(uPrice).toLocaleString('vi-VN')} ₫
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 font-mono">
            ${bQty.toFixed(1)}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(stockVal).toLocaleString('vi-VN')} ₫
          </td>
          <td class="py-3 px-3 text-center bg-rose-50/30 dark:bg-rose-950/20">
            <input type="number" step="0.01" min="0" max="${bQty}" value="${wQty > 0 ? wQty : ''}" placeholder="0"
                   oninput="onWasteLineQtyChange('${escapeHtml(item.code)}', this.value)"
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 font-mono">
          </td>
          <td class="py-3 px-3">
            <select onchange="onWasteLineReasonChange('${escapeHtml(item.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${reasonOptions.map(r => `<option value="${escapeHtml(r)}" ${item.wasteReason === r ? 'selected' : ''}>${escapeHtml(r)}</option>`).join('')}
            </select>
          </td>
          <td id="wasteLineTotal_${escapeHtml(item.code)}" class="py-3 px-3 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
            ${lineAmt > 0 ? Math.round(lineAmt).toLocaleString('vi-VN') + ' ₫' : '0 ₫'}
          </td>
          <td class="py-3 px-3">
            <input type="text" placeholder="Ghi chú..." value="${escapeHtml(item.wasteNote || '')}"
                   oninput="onWasteLineNoteChange('${escapeHtml(item.code)}', this.value)"
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-rose-500">
          </td>
        </tr>
      `;
    }).join('');
  }

  if (mob) {
    mob.innerHTML = filtered.map(item => {
      const bQty = Number(item.book_qty) || 0;
      const uPrice = Number(item.unit_price) || 0;
      const wQty = item.wasteQty || 0;
      const lineAmt = wQty * uPrice;

      return `
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${escapeHtml(item.code)}</span>
              <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${escapeHtml(item.name || item.code)}</h4>
              <div class="text-xs text-gray-400">${escapeHtml(item.nganh_hang || item.item_group || '')}</div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">Tồn: ${bQty.toFixed(1)} ${escapeHtml(item.unit || '')}</span>
              <div class="text-xs text-gray-400 tabular-nums font-mono">${Math.round(uPrice).toLocaleString('vi-VN')} ₫ / ${escapeHtml(item.unit || '')}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label class="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">SL Cần Hủy (Tối đa ${bQty.toFixed(1)})</label>
              <input type="number" step="0.01" min="0" max="${bQty}" value="${wQty > 0 ? wQty : ''}" placeholder="0"
                     oninput="onWasteLineQtyChange('${escapeHtml(item.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Thành Tiền Hủy</label>
              <div id="mobWasteLineTotal_${escapeHtml(item.code)}" class="py-1.5 px-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums text-right font-mono">
                ${lineAmt > 0 ? Math.round(lineAmt).toLocaleString('vi-VN') + ' ₫' : '0 ₫'}
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Lý Do Hủy</label>
            <select onchange="onWasteLineReasonChange('${escapeHtml(item.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${reasonOptions.map(r => `<option value="${escapeHtml(r)}" ${item.wasteReason === r ? 'selected' : ''}>${escapeHtml(r)}</option>`).join('')}
            </select>
          </div>
        </div>
      `;
    }).join('');
  }

  if (window.lucide) window.lucide.createIcons();
}

export function onWasteLineQtyChange(code: string, val: string): void {
  const item = (window.gFnbWasteStockItems || []).find((i: any) => i.code === code);
  if (!item) return;

  const num = parseFloat(val);
  const maxQty = Number(item.book_qty) || 0;
  if (isNaN(num) || num < 0) {
    item.wasteQty = 0;
  } else if (num > maxQty) {
    item.wasteQty = maxQty;
    if (typeof window.showToast === 'function') {
      window.showToast(`Số lượng hủy không được vượt quá số lượng tồn kho (${maxQty})`);
    }
  } else {
    item.wasteQty = num;
  }

  const lineAmt = item.wasteQty * (Number(item.unit_price) || 0);

  const td = document.getElementById(`wasteLineTotal_${code}`);
  if (td) td.textContent = lineAmt > 0 ? Math.round(lineAmt).toLocaleString('vi-VN') + ' ₫' : '0 ₫';

  const mobTd = document.getElementById(`mobWasteLineTotal_${code}`);
  if (mobTd) mobTd.textContent = lineAmt > 0 ? Math.round(lineAmt).toLocaleString('vi-VN') + ' ₫' : '0 ₫';

  updateWasteKPIs();
}

export function onWasteLineReasonChange(code: string, val: string): void {
  const item = (window.gFnbWasteStockItems || []).find((i: any) => i.code === code);
  if (item) item.wasteReason = val;
}

export function onWasteLineNoteChange(code: string, val: string): void {
  const item = (window.gFnbWasteStockItems || []).find((i: any) => i.code === code);
  if (item) item.wasteNote = val;
}

export function updateWasteKPIs(): void {
  const items: FnbWasteStockItem[] = window.gFnbWasteStockItems || [];
  let selectedCount = 0;
  let totalQty = 0;
  let totalEstAmt = 0;
  const selectedItems: FnbWasteStockItem[] = [];

  items.forEach(i => {
    if (i.wasteQty > 0) {
      selectedCount++;
      totalQty += Number(i.wasteQty) || 0;
      totalEstAmt += (i.wasteQty * (Number(i.unit_price) || 0));
      selectedItems.push(i);
    }
  });

  const kpiSel = document.getElementById('kpiWasteSelectedCount');
  if (kpiSel) kpiSel.textContent = String(selectedCount);

  const kpiEst = document.getElementById('kpiWasteTotalEstAmount');
  if (kpiEst) {
    if (totalEstAmt > 0) {
      const c = formatCompactVND(totalEstAmt);
      kpiEst.innerHTML = `${c.val}<span class="kpi-unit">${c.unit}</span>`;
    } else {
      kpiEst.textContent = '0 ₫';
    }
  }

  const btnSubmit = document.getElementById('btnSubmitDirectWaste') as HTMLButtonElement | null;
  const btnSubmitText = document.getElementById('btnSubmitDirectWasteText');
  if (btnSubmit) btnSubmit.disabled = (selectedCount === 0);
  if (btnSubmitText) btnSubmitText.textContent = `Xác nhận tạo biên bản hủy (${selectedCount})`;

  const slipWrap = document.getElementById('wasteSelectedSlip');
  const slipCount = document.getElementById('wasteSlipCount');
  const slipList = document.getElementById('wasteSelectedSlipList');
  const slipTotalItems = document.getElementById('wasteSlipTotalItems');
  const slipTotalQty = document.getElementById('wasteSlipTotalQty');
  const slipTotalAmt = document.getElementById('wasteSlipTotalAmount');
  const bottomBtn = document.getElementById('btnSubmitDirectWasteBottom') as HTMLButtonElement | null;
  const bottomBtnText = document.getElementById('btnSubmitDirectWasteBottomText');

  if (slipWrap) slipWrap.classList.toggle('hidden', selectedCount === 0);
  adjustListHeightForSubTable(selectedCount > 0, 'fnbWasteStockScroll', 'fnbWasteStockMobileCards', '550px', '500px');
  if (slipCount) slipCount.textContent = String(selectedCount);
  if (slipTotalItems) slipTotalItems.textContent = String(selectedCount);
  if (slipTotalQty) slipTotalQty.textContent = Number(totalQty.toFixed(2)).toLocaleString('vi-VN');
  if (slipTotalAmt) slipTotalAmt.textContent = `${Math.round(totalEstAmt).toLocaleString('vi-VN')} ₫`;
  if (bottomBtn) bottomBtn.disabled = (selectedCount === 0);
  if (bottomBtnText) bottomBtnText.textContent = `Xác nhận tạo biên bản hủy (${selectedCount})`;

  if (slipList) {
    slipList.innerHTML = selectedItems.map((i, idx) => {
      const uPrice = Number(i.unit_price) || 0;
      const lineAmt = (Number(i.wasteQty) || 0) * uPrice;
      return `
        <tr class="hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition-colors">
          <td class="py-1.5 px-2.5 text-center font-mono text-gray-400">${idx + 1}</td>
          <td class="py-1.5 px-2.5 font-mono font-semibold text-rose-600 dark:text-rose-400 whitespace-nowrap">${escapeHtml(i.code)}</td>
          <td class="py-1.5 px-2.5 font-semibold text-gray-900 dark:text-white max-w-[200px] truncate">${escapeHtml(i.name || i.code)}</td>
          <td class="py-1.5 px-2 text-center text-gray-500">${escapeHtml(i.unit || '')}</td>
          <td class="py-1.5 px-2.5 text-right font-mono font-bold text-rose-600 dark:text-rose-400">${Number(i.wasteQty).toLocaleString('vi-VN')}</td>
          <td class="py-1.5 px-2.5 text-right font-mono text-gray-500">${Math.round(uPrice).toLocaleString('vi-VN')} ₫</td>
          <td class="py-1.5 px-2.5 text-right font-mono font-bold text-gray-900 dark:text-white">${Math.round(lineAmt).toLocaleString('vi-VN')} ₫</td>
          <td class="py-1.5 px-2.5 hidden sm:table-cell text-gray-500 truncate max-w-[160px]">${escapeHtml(i.wasteReason || 'Hàng hỏng')}</td>
          <td class="py-1.5 px-2 text-center">
            <button type="button" onclick="removeDirectWasteLine('${escapeHtml(i.code)}')" class="p-1 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40" title="Bỏ mặt hàng này">
              <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
    if (window.lucide) window.lucide.createIcons();
  }
}

export function removeDirectWasteLine(code: string): void {
  const item = (window.gFnbWasteStockItems || []).find((i: any) => i.code === code);
  if (item) {
    item.wasteQty = 0;
  }
  renderFnbWasteStockTable();
  updateWasteKPIs();
}

export function resetDirectWasteSelection(): void {
  (window.gFnbWasteStockItems || []).forEach((i: any) => {
    i.wasteQty = 0;
  });
  renderFnbWasteStockTable();
  updateWasteKPIs();
}

export async function submitDirectWaste(): Promise<void> {
  if (!assertPermission('fnb-waste', 'create', 'tạo biên bản hủy hàng')) return;
  const allItems: FnbWasteStockItem[] = window.gFnbWasteStockItems || [];
  const validLines = allItems.filter(i => (i.wasteQty || 0) > 0);

  if (!validLines.length) {
    if (typeof window.showToast === 'function') {
      window.showToast('Vui lòng nhập số lượng hủy > 0 cho ít nhất một mặt hàng!');
    }
    return;
  }

  const siteCode = getActiveFnbWasteSite();
  const today = new Date().toISOString().slice(0, 10);
  const createdBy = (window.gCurrentUser && window.gCurrentUser.name) || 'Bếp Trưởng / Quản Lý';

  let totalAmount = 0;
  validLines.forEach(l => {
    totalAmount += (l.wasteQty * (Number(l.unit_price) || 0));
  });

  const payload = {
    site_code: siteCode,
    waste_date: today,
    reason: validLines.length === 1 ? validLines[0].wasteReason : 'Hàng hỏng / hao hụt định kỳ điểm bán',
    confirmed_by: createdBy,
    notes: `Biên bản hủy hàng gồm ${validLines.length} mặt hàng tồn kho`,
    created_by: createdBy,
    lines: validLines.map(l => ({
      item_code: l.code,
      qty: l.wasteQty,
      unit_price: Number(l.unit_price) || 0,
      reason_detail: l.wasteReason || 'Hàng hỏng / ôi thiu không đạt chuẩn',
      note: l.wasteNote || ''
    }))
  };

  const btn = document.getElementById('btnSubmitDirectWaste') as HTMLButtonElement | null;
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Đang tạo biên bản hủy...`;
  }

  try {
    if (typeof window.showLoading === 'function') window.showLoading('Đang lưu biên bản hủy và cập nhật số dư tồn...');
    const res = await fetch('/api/fnb/wastes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Lỗi khi tạo biên bản hủy hàng');

    if (typeof window.showToast === 'function') {
      window.showToast(`Tạo thành công biên bản hủy ${json.data.waste_code}! Tồn kho điểm ${siteCode} đã được giảm tự động.`);
    }

    // Refresh waste data and switch to history view to review
    if (typeof window.loadFnbWaste === 'function') await window.loadFnbWaste();
    switchFnbWasteSubView('history');
    if (json.data?.waste_id && typeof window.viewWasteDetail === 'function') {
      window.viewWasteDetail(json.data.waste_id);
    }

    // Trigger stock matrix reload in background
    if (typeof window.loadFnbStock === 'function') window.loadFnbStock();
    if (typeof window.loadFnbCounts === 'function') window.loadFnbCounts();

  } catch (err: any) {
    console.error('submitDirectWaste error:', err);
    if (typeof window.showToast === 'function') window.showToast('Lỗi ghi biên bản hủy: ' + err.message);
  } finally {
    if (typeof window.hideLoading === 'function') window.hideLoading();
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i data-lucide="trash-2" class="w-4 h-4"></i> <span id="btnSubmitDirectWasteText">Xác Nhận Tạo Biên Bản Hủy (0)</span>`;
    }
    if (window.lucide) window.lucide.createIcons();
  }
}
