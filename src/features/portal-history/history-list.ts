import type { OrderHistoryItem } from './types';
import {
  safeCellCode,
  safeCellDate,
  safeCellPerson,
  safeCellBadge,
  fmtVND,
  fmtNum,
  fmtDate,
  safeEscapeHtml,
  canEditOrders,
  canDeleteOrders
} from './helpers';

declare const lucide: any;
declare function showLoading(msg?: string): void;
declare function hideLoading(): void;
declare function showToast(msg: string, type?: string): void;
declare function openGeneralModal(title: string, html: string): void;
declare function loadPersistedUser(): any;

export function renderJourneyBadge(currentStep: number | string | undefined, currentStepName: string | undefined, orderCode: string): string {
  const stepNum = Number(currentStep) || 1;
  const stepNames: Record<number, string> = {
    1: 'Site đặt hàng',
    2: 'Admin tiếp nhận',
    3: 'Chuyển Trưởng Kho',
    4: 'Mail cho PMH',
    5: 'PMH đặt hàng',
    6: 'Vận chuyển về kho',
    7: 'Đã giao về site'
  };
  const label = currentStepName || stepNames[stepNum] || `Bước ${stepNum}`;

  let badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60';
  let dotStyle = 'bg-blue-500';
  if (stepNum >= 7) {
    badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
    dotStyle = 'bg-emerald-500';
  } else if (stepNum >= 4) {
    badgeStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60';
    dotStyle = 'bg-indigo-500';
  } else if (stepNum >= 2) {
    badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
    dotStyle = 'bg-amber-500';
  }

  return `
    <button type="button" onclick="openOrderJourneyModal('${orderCode}')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle} hover:shadow-2xs hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer" title="Bấm để xem và xác thực hành trình đơn hàng">
      <span class="w-1.5 h-1.5 rounded-full ${dotStyle} animate-pulse shrink-0"></span>
      <span class="font-mono text-[11px] font-bold shrink-0">B${stepNum}/7:</span>
      <span class="truncate max-w-[100px] text-left">${safeEscapeHtml(label)}</span>
    </button>
  `;
}

export function renderHsOrdersList(items: OrderHistoryItem[]): void {
  const tbody = document.getElementById('hsBody');
  const mob = document.getElementById('hsMobileCards');

  if (!items || !items.length) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="10" class="p-8 text-center text-gray-400">Không có đơn hàng nào phù hợp với bộ lọc.</td></tr>';
    if (mob) mob.innerHTML = '<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không có đơn hàng nào phù hợp với bộ lọc.</div>';
    return;
  }

  // Desktop Table
  if (tbody) {
    tbody.innerHTML = items.map(o => {
      const canEdit = canEditOrders(o);
      const canDelete = canDeleteOrders(o);
      return `
        <tr>
          <td class="col-code min-w-[130px]">${safeCellCode(o.maDon)}</td>
          <td class="col-date min-w-[110px]">${safeCellDate(o.ngayDat)}</td>
          <td class="min-w-[260px] max-w-[360px]">
            <div class="font-semibold text-gray-900 dark:text-gray-100 text-sm whitespace-normal leading-snug break-words">
              ${safeEscapeHtml(o.site || '—')}
            </div>
          </td>
          <td class="min-w-[130px]">${safeCellPerson(o.nguoiDat)}</td>
          <td class="col-num">${o.soDong}</td>
          <td class="col-num font-medium">${fmtNum(o.tongSL)}</td>
          <td class="col-num font-semibold text-brand-600 dark:text-brand-400">${fmtVND(o.tongTien)}</td>
          <td class="col-badge min-w-[140px] text-center">${safeCellBadge('neutral', o.trangThai || 'Mới tạo')}</td>
          <td class="text-center min-w-[170px]">
            ${renderJourneyBadge(o.currentStep, o.currentStepName, o.maDon)}
          </td>
          <td class="col-actions min-w-[220px]">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="viewOrderDetail('${o.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-300 dark:border-gray-700 shadow-2xs hover:border-slate-400 dark:hover:border-gray-600 transition" title="Xem chi tiết đơn hàng">
                <svg class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <span>Xem</span>
              </button>
              <button onclick="openOrderJourneyModal('${o.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition" title="Theo dõi & Xác thực hành trình">
                <svg class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
                <span>Hành trình</span>
              </button>
              ${canEdit ? `
                <button onclick="openEditOrderModal('${o.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60 shadow-2xs transition" title="Chỉnh sửa đơn hàng">
                  <svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>Sửa</span>
                </button>
              ` : ''}
              ${canDelete ? `
                <button onclick="confirmDeleteOrder('${o.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 shadow-2xs transition" title="Xóa đơn hàng">
                  <svg class="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>Xóa</span>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Mobile Cards
  if (mob) {
    mob.innerHTML = items.map(o => {
      const canEdit = canEditOrders(o);
      const canDelete = canDeleteOrders(o);
      return `
        <div class="data-card space-y-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div class="flex items-center justify-between gap-2">
            ${safeCellCode(o.maDon)}
            ${safeCellBadge('neutral', o.trangThai || 'Mới tạo')}
          </div>
          <div class="font-bold text-sm text-gray-900 dark:text-white leading-snug break-words">
            ${safeEscapeHtml(o.site || '—')}
          </div>
          <div class="flex items-center justify-between gap-2 p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <div class="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Tiến độ:</span>
            </div>
            ${renderJourneyBadge(o.currentStep, o.currentStepName, o.maDon)}
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
            <div>Ngày đặt: <b class="num text-gray-900 dark:text-white whitespace-nowrap">${fmtDate(o.ngayDat)}</b></div>
            <div>Người đặt: <b>${safeCellPerson(o.nguoiDat)}</b></div>
            <div>Số mặt hàng: <b class="num text-gray-900 dark:text-white">${o.soDong} dòng</b></div>
            <div>Tổng SL: <b class="num text-gray-900 dark:text-white">${fmtNum(o.tongSL)}</b></div>
            <div class="col-span-2 flex justify-between items-center pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <span class="text-gray-500 font-medium">Tổng giá trị đơn:</span>
              <span class="num font-semibold text-sm text-brand-600 dark:text-brand-400">${fmtVND(o.tongTien)}</span>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:flex sm:items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="viewOrderDetail('${o.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-300 dark:border-gray-700 shadow-2xs">
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <span>Chi tiết</span>
            </button>
            <button onclick="openOrderJourneyModal('${o.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs">
              <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
              <span>Hành trình</span>
            </button>
            ${canEdit ? `
              <button onclick="openEditOrderModal('${o.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
                <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                <span>Sửa</span>
              </button>
            ` : ''}
            ${canDelete ? `
              <button onclick="confirmDeleteOrder('${o.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 shadow-2xs">
                <svg class="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                <span>Xóa</span>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }
}

export function filterHsOrders(status?: string): void {
  const win = window as any;
  const allOrders: OrderHistoryItem[] = (win.App && win.App.historyOrders) ? win.App.historyOrders : [];
  if (!status || status === 'ALL') {
    renderHsOrdersList(allOrders);
    return;
  }
  const filtered = allOrders.filter(o => {
    const st = (o.trangThai || '').toUpperCase();
    if (status === 'APPROVED') return st.includes('DUYỆT') || st.includes('APPROVED');
    if (status === 'PENDING') return st.includes('CHỜ') || st.includes('TẠO') || st.includes('PENDING');
    if (status === 'DELIVERED') return st.includes('NHẬN') || st.includes('GIAO') || st.includes('DELIVERED');
    if (status === 'REJECTED') return st.includes('HỦY') || st.includes('TỪ CHỐI') || st.includes('REJECT');
    return true;
  });
  renderHsOrdersList(filtered);
}

export async function loadHistory(): Promise<void> {
  const win = window as any;
  const branchSel = (document.getElementById('globalBranchSelect') as HTMLSelectElement | null)?.value;
  const user = (win.gCurrentUser || (typeof win.loadPersistedUser === 'function' ? win.loadPersistedUser() : null));
  const userSite = user ? user.assignedSite : '';
  const localSite = localStorage.getItem('orbit_user_site');
  const hsSiteVal = (document.getElementById('hsSite') as HTMLSelectElement | null)?.value;

  let site = '';
  if (branchSel) {
    site = (branchSel === 'ALL') ? '' : branchSel;
  } else if (userSite) {
    site = (userSite === 'ALL') ? '' : userSite;
  } else if (localSite) {
    site = (localSite === 'ALL') ? '' : localSite;
  } else if (hsSiteVal) {
    site = (hsSiteVal === 'ALL') ? '' : hsSiteVal;
  }

  // Update hsCurrentSiteBadge
  const badge = document.getElementById('hsCurrentSiteBadge');
  if (badge) {
    if (site && site !== 'ALL') {
      const sitesList = (typeof win.getAppSitesList === 'function' ? win.getAppSitesList() : []) || [];
      const sObj = sitesList.find((s: any) => s.code.toUpperCase() === site.toUpperCase() || s.name === site || (s.ten && s.ten === site));
      badge.textContent = sObj ? (sObj.ten || sObj.name) : site;
    } else {
      badge.textContent = 'Tất cả điểm bán';
    }
    badge.classList.remove('hidden');
  }

  const hsSiteEl = document.getElementById('hsSite') as HTMLSelectElement | null;
  if (hsSiteEl) hsSiteEl.value = site;

  const monthInput = (document.getElementById('hsMonth') as HTMLInputElement | null)?.value || '';
  let thang = '';
  if (monthInput) {
    const p = monthInput.split('-');
    thang = `${p[1]}/${p[0]}`;
  }
  try {
    if (typeof showLoading === 'function') showLoading('Tải lịch sử đơn hàng...');
    const url = `/api/orders?site=${encodeURIComponent(site)}&thang=${encodeURIComponent(thang)}&_t=${Date.now()}`;
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    });
    const json = await res.json();
    if (!win.App) win.App = {};
    win.App.historyOrders = (json.success && json.data) ? json.data : [];

    const currentFilter = (document.getElementById('hsOrderStatusFilter') as HTMLSelectElement | null)?.value || 'ALL';
    filterHsOrders(currentFilter);
  } catch (e) {
    console.error('loadHistory error:', e);
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  }
}

export async function viewOrderDetail(orderCode: string): Promise<void> {
  if (typeof showLoading === 'function') showLoading('Tải chi tiết đơn...');
  try {
    const res = await fetch(`/api/order-detail?orderCode=${encodeURIComponent(orderCode)}`);
    const json = await res.json();
    if (json.success) {
      const { info, items, timeline } = json.data;
      const html = `
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
            <div>
              <div class="tabular-nums font-bold">${info.order_code}</div>
              <div class="text-gray-500 dark:text-gray-400">${info.site_name} · ${info.ordered_by}</div>
            </div>
            <button onclick="if(typeof exportSingleOrderExcel==='function')exportSingleOrderExcel('${info.order_code}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1">
              Xuất Excel
            </button>
          </div>
          <!-- Desktop Table -->
          <div class="hidden sm:block overflow-x-auto max-h-48 rounded-xl border border-gray-200 dark:border-gray-800">
            <table class="data-table">
              <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">Mã</th><th class="p-2">Tên</th><th class="p-2">ĐVT</th><th class="p-2 text-right">SL</th><th class="p-2 text-right">Đơn giá</th><th class="p-2 text-right">Thành tiền</th></tr></thead>
              <tbody>
                ${(items || []).map((it: any) => `<tr><td class="p-2 tabular-nums">${it.maHang}</td><td class="p-2">${it.tenSP}</td><td class="p-2">${it.dvt}</td><td class="p-2 text-right tabular-nums font-bold">${it.soLuong}</td><td class="p-2 text-right tabular-nums">${fmtVND(it.donGia)}</td><td class="p-2 text-right tabular-nums font-bold">${fmtVND(it.thanhTien)}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>

          <!-- Native Mobile Cards for Order Details -->
          <div class="block sm:hidden space-y-2 max-h-48 overflow-y-auto">
            ${(items || []).map((it: any) => `
              <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
                <div class="min-w-0">
                  <div class="font-bold text-gray-900 dark:text-white truncate">${safeEscapeHtml(it.tenSP)}</div>
                  <div class="font-mono text-[11px] text-gray-400">${safeEscapeHtml(it.maHang)} · <span class="font-sans">${safeEscapeHtml(it.dvt || '')}</span></div>
                </div>
                <div class="text-right shrink-0">
                  <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${it.soLuong}</div>
                  <div class="num text-[11px] text-gray-500">${fmtVND(it.thanhTien)}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="pt-2">
            <div class="flex items-center justify-between mb-2">
              <b class="text-gray-900 dark:text-white flex items-center gap-1.5">
                <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
                Hành trình xử lý đơn hàng:
              </b>
              <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openOrderJourneyModal('${info.order_code}')" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition">
                <span>Xem & Xác thực chi tiết</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div class="space-y-2 border-l-2 border-indigo-200 dark:border-indigo-800/80 pl-3">
              ${(timeline || []).map((s: any) => `
                <div class="p-2 rounded-lg bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs">
                  <div class="flex justify-between font-bold text-gray-800 dark:text-gray-100">
                    <span>Bước ${s.buoc}: ${s.tenBuoc}</span>
                    <span class="tabular-nums text-gray-400 dark:text-gray-500 font-normal">${s.thoiGian ? fmtDate(s.thoiGian) : ''}</span>
                  </div>
                  <div class="text-gray-500 dark:text-gray-400 mt-0.5">${s.nguoiXuLy || 'Hệ thống'} · Trạng thái: <span class="font-bold text-brand-700 dark:text-brand-400">${s.trangThai}</span>${s.ghiChu ? ` · <span class="italic text-gray-600 dark:text-gray-300">"${safeEscapeHtml(s.ghiChu)}"</span>` : ''}</div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="flex items-center justify-between gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openOrderJourneyModal('${info.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
              <span>Hành trình đơn</span>
            </button>
            <div class="flex items-center gap-2">
              ${canEditOrders(info) ? `
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openEditOrderModal('${info.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>Chỉnh sửa đơn</span>
                </button>
              ` : ''}
              ${canDeleteOrders(info) ? `
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); confirmDeleteOrder('${info.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>Xóa đơn hàng</span>
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
      if (typeof openGeneralModal === 'function') openGeneralModal(`Đơn hàng ${orderCode}`, html);
    }
  } catch (e: any) {
    if (typeof showToast === 'function') showToast('Lỗi: ' + (e?.message || e));
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}
