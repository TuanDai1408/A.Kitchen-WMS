import type { CreateOrderPayload } from './types';
import { getAppItems, setAppItems, renderOrderTable, calcBudget } from './order-table';
import { fmtVND, safeEscapeHtml } from './helpers';

declare function showLoading(msg?: string): void;
declare function hideLoading(): void;
declare function showToast(msg: string): void;
declare function openGeneralModal(title: string, html: string): void;
declare function closeGeneralModal(): void;
declare function getAppSitesList(): any[];

export async function loadQuota(): Promise<void> {
  const win = window as any;

  // 1. Resolve site name dynamically from user's current site
  const savedCode = localStorage.getItem('orbit_user_site') || (win.gCurrentUser && win.gCurrentUser.assignedSite) || 'K001';
  const sites = (typeof getAppSitesList === 'function' ? getAppSitesList() : []) || (win.App && win.App.siteObjs) || [];
  const found = sites.find((s: any) => (s.code || '').toLowerCase() === savedCode.toLowerCase());
  const site = found ? (found.ten || found.name) : ((document.getElementById('orderSite') as HTMLSelectElement)?.value || savedCode);
  const sel = document.getElementById('orderSite') as HTMLSelectElement | null;
  if (sel) {
    sel.innerHTML = `<option value="${site}">${site}</option>`;
    sel.value = site;
  }
  if (!site) return;

  // 2. Default Month to globalMonthPicker or current Month if empty
  const globalMonth = (document.getElementById('globalMonthPicker') as HTMLInputElement)?.value;
  let monthInput = (document.getElementById('orderMonth') as HTMLInputElement)?.value;
  if (!monthInput || (globalMonth && monthInput !== globalMonth)) {
    monthInput = globalMonth || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const mEl = document.getElementById('orderMonth') as HTMLInputElement | null;
    if (mEl) mEl.value = monthInput;
  }

  let thang = '';
  if (monthInput) {
    const parts = monthInput.split('-');
    thang = `${parts[1]}/${parts[0]}`;
  }

  const hasExistingItems = getAppItems().length > 0;
  const body = document.getElementById('dinhMucBody');
  if (!hasExistingItems && body) {
    body.innerHTML = '<tr><td colspan="8" class="p-6 text-center text-gray-400"><div class="inline-flex items-center gap-2"><div class="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div><span>Đang tải định mức vật tư...</span></div></td></tr>';
  }

  try {
    const res = await fetch(`/api/quota?site=${encodeURIComponent(site)}&thang=${encodeURIComponent(thang)}&refresh=true`);
    const json = await res.json();
    if (json.success) {
      setAppItems(json.data.items || []);

      const kpiNs = document.getElementById('kpiNganSach') as HTMLElement | null;
      if (kpiNs) {
        kpiNs.dataset.raw = String(json.data.nganSach);
        kpiNs.textContent = fmtVND(json.data.nganSach);
        kpiNs.title = fmtVND(json.data.nganSach);
      }
      const subSiteEl = document.getElementById('kpiSubSite');
      if (subSiteEl) {
        subSiteEl.textContent = json.data.site || site;
        subSiteEl.title = json.data.site || site;
      }
      const kpiDd = document.getElementById('kpiDaDat') as HTMLElement | null;
      if (kpiDd) {
        kpiDd.dataset.raw = String(json.data.tienDaDat);
        kpiDd.textContent = fmtVND(json.data.tienDaDat);
        kpiDd.title = fmtVND(json.data.tienDaDat);
      }
      const budTotalEl = document.getElementById('budTotal');
      if (budTotalEl) {
        budTotalEl.textContent = fmtVND(json.data.nganSach);
      }

      const items = getAppItems();
      const types = Array.from(new Set(items.map(i => i.tenLoai).filter(Boolean)));
      const fLoaiEl = document.getElementById('fLoai') as HTMLSelectElement | null;
      if (fLoaiEl) {
        fLoaiEl.innerHTML = '<option value="">Tất cả loại NVL</option>' +
          types.map(t => `<option value="${t}">${t}</option>`).join('');
      }

      renderOrderTable();
      calcBudget(json.data.nganSach, json.data.tienDaDat);
      if (win.lucide && win.lucide.createIcons) win.lucide.createIcons();
    } else {
      if (typeof showToast === 'function') showToast('Lỗi tải định mức: ' + (json.error || ''));
    }
  } catch (err: any) {
    if (typeof showToast === 'function') showToast('Lỗi kết nối: ' + (err?.message || err));
  } finally {
    // Background fetch complete
  }
}

export function reviewOrder(): void {
  const items = getAppItems();
  const orderItems = items.filter(i => (i.soLuongDat || 0) > 0);
  if (!orderItems.length) {
    if (typeof showToast === 'function') showToast('Vui lòng nhập số lượng cho ít nhất 1 mặt hàng.');
    return;
  }

  const site = (document.getElementById('orderSite') as HTMLSelectElement)?.value || '';
  const thang = (document.getElementById('orderMonth') as HTMLInputElement)?.value || '';
  const totalAmount = orderItems.reduce((s, it) => s + ((it.soLuongDat || 0) * (it.donGia || 0)), 0);

  const html = `
    <div class="space-y-3">
      <div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
        <div>Site đặt: <b>${site}</b></div>
        <div>Tháng: <b>${thang}</b></div>
        <div>Tổng tiền đơn: <b class="text-brand-700 tabular-nums text-sm">${fmtVND(totalAmount)}</b></div>
      </div>
      <!-- Desktop Table -->
      <div class="hidden sm:block overflow-x-auto max-h-56 rounded-xl border border-gray-200 dark:border-gray-800">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">Mã</th><th class="p-2">Tên</th><th class="p-2 text-right">SL</th><th class="p-2 text-right">Thành tiền</th></tr></thead>
          <tbody>
            ${orderItems.map(it => `
              <tr><td class="p-2 tabular-nums">${it.maHang}</td><td class="p-2">${it.tenSP}</td><td class="p-2 text-right tabular-nums font-bold">${it.soLuongDat}</td><td class="p-2 text-right tabular-nums">${fmtVND((it.soLuongDat || 0) * it.donGia)}</td></tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <!-- Mobile Order Items Cards -->
      <div class="block sm:hidden space-y-2 max-h-56 overflow-y-auto">
        ${orderItems.map(it => `
          <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
            <div class="min-w-0">
              <div class="font-bold text-gray-900 dark:text-white truncate">${safeEscapeHtml(it.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${safeEscapeHtml(it.maHang)}</div>
            </div>
            <div class="text-right shrink-0">
              <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${it.soLuongDat}</div>
              <div class="num text-[11px] text-gray-500">${fmtVND((it.soLuongDat || 0) * it.donGia)}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div>
        <label class="font-bold block mb-1">Ghi chú / Giải trình:</label>
        <textarea id="orderNote" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" placeholder="Ghi chú đơn hàng..."></textarea>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button onclick="closeGeneralModal()" class="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 font-bold">Xem lại</button>
        <button onclick="submitOrder()" class="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-sm">Gửi đơn đặt hàng</button>
      </div>
    </div>
  `;
  if (typeof openGeneralModal === 'function') openGeneralModal('Xác nhận đặt hàng vật tư', html);
}

export async function submitOrder(): Promise<void> {
  const win = window as any;
  const items = getAppItems();
  const orderItems = items.filter(i => (i.soLuongDat || 0) > 0);
  const site = (document.getElementById('orderSite') as HTMLSelectElement)?.value || '';
  const thang = (document.getElementById('orderMonth') as HTMLInputElement)?.value || '';
  const orderNoteEl = document.getElementById('orderNote') as HTMLTextAreaElement | null;
  const ghiChu = orderNoteEl ? orderNoteEl.value : '';

  if (typeof showLoading === 'function') showLoading('Lưu đơn hàng vào Cloudflare D1...');
  try {
    const payload: CreateOrderPayload = {
      site,
      thang,
      nguoiDat: win.App && win.App.user ? win.App.user.email : 'Bếp trưởng Site',
      ghiChu,
      items: orderItems.map(it => ({
        maHang: it.maHang,
        tenSP: it.tenSP,
        dvt: it.dvt,
        donGia: it.donGia,
        soLuong: it.soLuongDat || 0,
        daDat: it.daDat
      }))
    };

    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      if (typeof closeGeneralModal === 'function') closeGeneralModal();
      if (typeof showToast === 'function') showToast(`Đã tạo đơn hàng thành công! Mã: ${json.data.maDon}`);
      items.forEach(i => { i.soLuongDat = 0; });
      loadQuota();
    } else {
      if (typeof showToast === 'function') showToast('Lỗi: ' + json.error);
    }
  } catch (err: any) {
    if (typeof showToast === 'function') showToast('Lỗi: ' + (err?.message || err));
  } finally {
    // Background fetch complete
  }
}
