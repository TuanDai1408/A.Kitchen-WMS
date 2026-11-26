import { escapeHtml } from '@/ts/utils/formatters';
import { getActiveFnbCountSite } from './helpers';
import type { FnbCountItem } from './types';

declare const window: any;

export function populateFnbCountFilters(): void {
  const nganhSel = document.getElementById('fnbCountNganhHangFilter') as HTMLSelectElement | null;
  const nhomSel = document.getElementById('fnbCountNhomHangFilter') as HTMLSelectElement | null;
  if (!nganhSel || !nhomSel) return;

  const nganhMap = new Map<string, Set<string>>();
  const allItems: FnbCountItem[] = window.gFnbAllItems || [];
  allItems.forEach(i => {
    const ng = (i.nganh_hang || 'Chưa phân loại').trim();
    const nh = (i.nhom_hang || i.item_group || 'Chưa phân loại').trim();
    if (!nganhMap.has(ng)) nganhMap.set(ng, new Set());
    nganhMap.get(ng)!.add(nh);
  });

  window.gFnbNganhMap = nganhMap;

  let nganhOpts = '<option value="">Tất cả ngành hàng</option>';
  Array.from(nganhMap.keys()).sort().forEach(ng => {
    nganhOpts += `<option value="${escapeHtml(ng)}">${escapeHtml(ng)}</option>`;
  });
  nganhSel.innerHTML = nganhOpts;
  nganhSel.value = '';

  populateFnbCountNhomHangDropdown('');
}

export function populateFnbCountNhomHangDropdown(selectedNganh: string): void {
  const nhomSel = document.getElementById('fnbCountNhomHangFilter') as HTMLSelectElement | null;
  if (!nhomSel) return;

  const nhomSet = new Set<string>();
  if (window.gFnbNganhMap) {
    if (selectedNganh && window.gFnbNganhMap.has(selectedNganh)) {
      window.gFnbNganhMap.get(selectedNganh)!.forEach((nh: string) => nhomSet.add(nh));
    } else {
      window.gFnbNganhMap.forEach((set: Set<string>) => set.forEach((nh: string) => nhomSet.add(nh)));
    }
  }

  let nhomOpts = '<option value="">Tất cả nhóm hàng</option>';
  Array.from(nhomSet).sort().forEach(nh => {
    nhomOpts += `<option value="${escapeHtml(nh)}">${escapeHtml(nh)}</option>`;
  });
  nhomSel.innerHTML = nhomOpts;
  nhomSel.value = '';
}

export function onFnbCountNganhHangChange(): void {
  const selectedNganh = (document.getElementById('fnbCountNganhHangFilter') as HTMLSelectElement | null)?.value || '';
  populateFnbCountNhomHangDropdown(selectedNganh);
  renderFnbCountsTable();
}

export function onFnbCountFilterChange(): void {
  renderFnbCountsTable();
}

export function onFnbCountSearch(_val?: string): void {
  renderFnbCountsTable();
}

export function onFnbCountDateChange(): void {
  renderFnbCountsTable();
}

export function onFnbCountSiteChange(): void {
  const sel = document.getElementById('fnbCountSiteSelect') as HTMLSelectElement | null;
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

  if (sel && sel.value && sel.value !== 'all') {
    try { localStorage.setItem('orbit_user_site', sel.value); } catch {}
    const gb = document.getElementById('globalBranchSelect') as HTMLSelectElement | null;
    if (gb) gb.value = sel.value;
  }
  if (typeof window.loadFnbCounts === 'function') {
    window.loadFnbCounts();
  }
}

export function toggleBlindCount(checked: boolean): void {
  window.gFnbBlindCount = checked;
  renderFnbCountsTable();
}

export function onCountInputChange(code: string, val: string): void {
  const item = (window.gCurrentCountItems || []).find((i: any) => i.code === code);
  if (item) {
    item.userCount = val === '' ? 0 : Number(val);
    renderFnbCountsTable();
  }
}

export function onCountNoteChange(code: string, val: string): void {
  const item = (window.gCurrentCountItems || []).find((i: any) => i.code === code);
  if (item) item.userNote = val;
}

export function renderFnbCountsTable(): void {
  const tbody = document.getElementById('fnbCountsTableBody');
  const mob = document.getElementById('fnbCountsMobileCards');
  const selectedNganh = ((document.getElementById('fnbCountNganhHangFilter') as HTMLSelectElement | null)?.value || '').trim().toLowerCase();
  const selectedNhom = ((document.getElementById('fnbCountNhomHangFilter') as HTMLSelectElement | null)?.value || '').trim().toLowerCase();
  const statusFilter = ((document.getElementById('fnbCountStatusFilter') as HTMLSelectElement | null)?.value || 'all');
  const query = ((document.getElementById('fnbCountSearchInput') as HTMLInputElement | null)?.value || '').trim().toLowerCase();

  const allItems: FnbCountItem[] = window.gFnbAllItems || [];

  const filtered = allItems.filter(i => {
    // 1. Filter by nganh_hang
    if (selectedNganh) {
      const ng = (i.nganh_hang || '').trim().toLowerCase();
      if (ng !== selectedNganh) return false;
    }
    // 2. Filter by nhom_hang
    if (selectedNhom) {
      const nh = (i.nhom_hang || i.item_group || '').trim().toLowerCase();
      if (nh !== selectedNhom) return false;
    }
    // 3. Filter by status filter
    if (statusFilter !== 'all') {
      const book = Number(i.book_qty) || 0;
      const count = (i.userCount !== undefined) ? Number(i.userCount) : (i.last_count_qty !== null && i.last_count_qty !== undefined ? Number(i.last_count_qty) : book);
      const diff = count - book;
      const isCounted = (i.userCount !== undefined || i.last_count_qty !== null);

      if (statusFilter === 'diff' && Math.abs(diff) < 0.001) return false;
      if (statusFilter === 'matched' && Math.abs(diff) >= 0.001) return false;
      if (statusFilter === 'counted' && !isCounted) return false;
      if (statusFilter === 'uncounted' && isCounted) return false;
    }
    // 4. Filter by search query
    if (query) {
      const name = (i.name || '').toLowerCase();
      const code = (i.code || '').toLowerCase();
      const ng = (i.nganh_hang || '').toLowerCase();
      const nh = (i.nhom_hang || '').toLowerCase();
      if (!name.includes(query) && !code.includes(query) && !ng.includes(query) && !nh.includes(query)) {
        return false;
      }
    }
    return true;
  });

  window.gCurrentCountItems = filtered;

  // Calculate metrics
  let matchedCount = 0;
  let diffCount = 0;
  let totalDiffVal = 0;

  filtered.forEach(i => {
    const book = Number(i.book_qty) || 0;
    const rawCount = (i.userCount !== undefined) ? i.userCount : (i.last_count_qty !== null && i.last_count_qty !== undefined ? i.last_count_qty : book);
    const count = Number(rawCount) || 0;
    const diff = count - book;
    const diffVal = diff * (Number(i.unit_price) || 0);
    if (Math.abs(diff) < 0.001) matchedCount++;
    else diffCount++;
    totalDiffVal += diffVal;
  });

  const totalEl = document.getElementById('fnbCountMetricTotal');
  if (totalEl) totalEl.textContent = String(filtered.length);
  const matchEl = document.getElementById('fnbCountMetricMatched');
  if (matchEl) matchEl.textContent = String(matchedCount);
  const diffEl = document.getElementById('fnbCountMetricDiff');
  if (diffEl) diffEl.textContent = String(diffCount);
  const diffValEl = document.getElementById('fnbCountMetricDiffVal');
  if (diffValEl) diffValEl.textContent = (totalDiffVal > 0 ? '+' : '') + Math.round(totalDiffVal).toLocaleString('vi-VN') + ' đ';

  // Desktop Table
  if (tbody) {
    if (filtered.length === 0) {
      if (!allItems || allItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <div class="flex flex-col items-center justify-center gap-2">
            <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
            <p class="font-semibold text-sm text-gray-700 dark:text-gray-200">Chưa có mặt hàng nào được nhập kho tại điểm bán này.</p>
            <p class="text-xs text-gray-400">Vui lòng nhập hàng tại tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium hover:text-brand-600">Nhập Hàng Điểm Bán</a> trước khi thực hiện kiểm kê.</p>
          </div>
        </td></tr>`;
      } else {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-10 text-gray-400">Không có mặt hàng nào phù hợp với bộ lọc hiện tại.</td></tr>`;
      }
    } else {
      tbody.innerHTML = filtered.map((item, idx) => {
        const book = Number(item.book_qty) || 0;
        const rawCount = (item.userCount !== undefined) ? item.userCount : (item.last_count_qty !== null && item.last_count_qty !== undefined ? item.last_count_qty : book);
        const count = Number(rawCount) || 0;
        const diff = count - book;
        const diffVal = diff * (Number(item.unit_price) || 0);

        let diffBadge = `<span class="text-gray-400 tabular-nums">0</span>`;
        if (diff > 0) diffBadge = `<span class="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums font-mono">+${diff.toFixed(1)}</span>`;
        else if (diff < 0) diffBadge = `<span class="text-rose-600 dark:text-rose-400 font-semibold tabular-nums font-mono">${diff.toFixed(1)}</span>`;

        let diffValText = `<span class="text-gray-400 tabular-nums font-mono">0 đ</span>`;
        if (diffVal > 0) diffValText = `<span class="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums font-mono">+${Math.round(diffVal).toLocaleString('vi-VN')} đ</span>`;
        else if (diffVal < 0) diffValText = `<span class="text-rose-600 dark:text-rose-400 font-bold tabular-nums font-mono">${Math.round(diffVal).toLocaleString('vi-VN')} đ</span>`;

        const bookDisplay = window.gFnbBlindCount ? '<span class="text-gray-300 dark:text-gray-700 italic tabular-nums text-xs select-none">••••</span>' : `<span class="font-bold tabular-nums font-mono ${book < 0 ? 'text-rose-600' : 'text-gray-800 dark:text-gray-200'}">${book.toFixed(1)}</span>`;

        const nhomBadge = item.nhom_hang || item.item_group || '';

        return `
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${idx + 1}</td>
            <td class="py-3 px-4">
              <div class="font-bold text-gray-900 dark:text-white">${escapeHtml(item.name)}</div>
              <div class="text-xs tabular-nums text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${escapeHtml(item.code)}</span>
                ${nhomBadge ? `<span>•</span><span class="text-gray-500 dark:text-gray-400">${escapeHtml(nhomBadge)}</span>` : ''}
                <span>•</span>
                <span class="font-mono">Giá: ${Number(item.unit_price).toLocaleString('vi-VN')} đ</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">${escapeHtml(item.unit || '')}</td>
            <td class="py-3 px-3 text-right fnb-count-book-col">${bookDisplay}</td>
            <td class="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/10">
              <input type="number" step="0.1" value="${count}" oninput="onCountInputChange('${escapeHtml(item.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-white/3 font-semibold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono">
            </td>
            <td class="py-3 px-3 text-right select-all">${diffBadge}</td>
            <td class="py-3 px-3 text-right select-all">${diffValText}</td>
            <td class="py-2.5 px-4">
              <input type="text" placeholder="Lý do chênh lệch (nếu có)..." value="${escapeHtml(item.userNote || '')}" oninput="onCountNoteChange('${escapeHtml(item.code)}', this.value)"
                     class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-blue-500">
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Mobile Card View
  if (mob) {
    if (filtered.length === 0) {
      if (!allItems || allItems.length === 0) {
        mob.innerHTML = `<div class="text-center py-8 px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2">
          <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
          <p class="font-semibold text-xs text-gray-700 dark:text-gray-200">Chưa có mặt hàng nào được nhập kho tại điểm bán này.</p>
          <p class="text-xs text-gray-400">Vui lòng nhập hàng tại tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium">Nhập Hàng</a> trước khi kiểm kê.</p>
        </div>`;
      } else {
        mob.innerHTML = `<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không có mặt hàng nào phù hợp với bộ lọc.</div>`;
      }
    } else {
      mob.innerHTML = filtered.map(item => {
        const book = Number(item.book_qty) || 0;
        const rawCount = (item.userCount !== undefined) ? item.userCount : (item.last_count_qty !== null && item.last_count_qty !== undefined ? item.last_count_qty : book);
        const count = Number(rawCount) || 0;
        const diff = count - book;
        const diffVal = diff * (Number(item.unit_price) || 0);

        return `
          <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">${escapeHtml(item.nhom_hang || item.item_group || 'Chưa phân loại')}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${escapeHtml(item.name)}</h4>
                <div class="text-xs text-gray-400 tabular-nums"><span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${escapeHtml(item.code)}</span> • ${Number(item.unit_price).toLocaleString('vi-VN')} đ/${escapeHtml(item.unit || '')}</div>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400">Số lượng tồn kho:</span>
                <div class="font-bold tabular-nums text-xs font-mono ${book < 0 ? 'text-rose-600' : 'text-gray-800 dark:text-gray-200'}">${window.gFnbBlindCount ? '••••' : book.toFixed(1)} ${escapeHtml(item.unit || '')}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-xs text-gray-400 block mb-0.5">SL Thực tế:</span>
                <input type="number" step="0.1" value="${count}" oninput="onCountInputChange('${escapeHtml(item.code)}', this.value)"
                       class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 font-bold tabular-nums text-gray-900 dark:text-white outline-none font-mono">
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400 block mb-0.5">Chênh lệch:</span>
                <div class="font-bold text-xs pt-1.5 tabular-nums font-mono ${diff > 0 ? 'text-emerald-600' : (diff < 0 ? 'text-rose-600' : 'text-gray-400')}">
                  ${diff > 0 ? '+' : ''}${diff.toFixed(1)} (${(diffVal > 0 ? '+' : '') + Math.round(diffVal).toLocaleString('vi-VN')} đ)
                </div>
              </div>
            </div>

            <input type="text" placeholder="Ghi chú lý do..." value="${escapeHtml(item.userNote || '')}" oninput="onCountNoteChange('${escapeHtml(item.code)}', this.value)"
                   class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none">
          </div>
        `;
      }).join('');
    }
  }

  if (window.lucide) window.lucide.createIcons();
}

export async function saveFnbCountAudit(): Promise<void> {
  const siteCode = getActiveFnbCountSite();
  const countDate = (document.getElementById('fnbCountDatePicker') as HTMLInputElement | null)?.value || new Date().toISOString().slice(0, 10);
  const countType = 'DAILY';

  const currentItems: FnbCountItem[] = window.gCurrentCountItems || [];
  if (!currentItems || !currentItems.length) {
    if (typeof window.showToast === 'function') {
      window.showToast('Không có mặt hàng nào để lưu kiểm kê!');
    }
    return;
  }

  const lines = currentItems.map(i => {
    const book = Number(i.book_qty) || 0;
    const count = (i.userCount !== undefined) ? Number(i.userCount) : (i.last_count_qty !== null && i.last_count_qty !== undefined ? Number(i.last_count_qty) : book);
    const diff = count - book;
    const diffVal = diff * (Number(i.unit_price) || 0);
    return {
      item_code: i.code,
      item_name: i.name,
      item_group: i.item_group || i.nhom_hang || 'NVL',
      unit: i.unit,
      unit_price: Number(i.unit_price) || 0,
      book_qty: book,
      actual_qty: count,
      count_qty: count,
      diff_qty: diff,
      diff_value: diffVal,
      diff_val: diffVal,
      note: i.userNote || ''
    };
  });

  const payload = {
    site_code: siteCode,
    count_date: countDate,
    count_type: countType,
    notes: `Kiểm kê hằng ngày điểm ${siteCode}`,
    lines
  };

  try {
    if (typeof window.showLoading === 'function') window.showLoading('Đang lưu phiếu kiểm kê...');
    const res = await fetch('/api/fnb/counts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Lỗi khi lưu phiếu kiểm kê');

    if (typeof window.showToast === 'function') {
      window.showToast(`Đã lưu phiếu kiểm kê ${json.data.count_code} thành công!`);
    }
    if (typeof window.loadFnbCounts === 'function') {
      await window.loadFnbCounts();
    }
  } catch (err: any) {
    console.error('saveFnbCountAudit error:', err);
    if (typeof window.showToast === 'function') window.showToast('Lỗi lưu kiểm kê: ' + err.message);
  } finally {
    if (typeof window.hideLoading === 'function') window.hideLoading();
  }
}
