import type { EditOrderItem } from './types';
import { fmtVND, fmtNum, fmtDate, safeEscapeHtml, canEditOrders, canDeleteOrders } from './helpers';

declare const lucide: any;
declare function showLoading(msg?: string): void;
declare function hideLoading(): void;
declare function showToast(msg: string, type?: string): void;
declare function getAppCurrentUser(): any;

export let editOrderItems: EditOrderItem[] = [];
export let pendingDeleteOrderCode: string | null = null;

export async function openEditOrderModal(orderCode: string): Promise<void> {
  if (!canEditOrders()) {
    if (typeof showToast === 'function') showToast('Tài khoản của bạn không có quyền chỉnh sửa đơn hàng', 'warning');
    return;
  }
  if (typeof showLoading === 'function') showLoading('Đang tải thông tin đơn hàng...');
  try {
    const res = await fetch(`/api/order-detail?orderCode=${encodeURIComponent(orderCode)}&_t=${Date.now()}`);
    const json = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || 'Không tải được chi tiết đơn hàng');
    }

    const { info, items } = json.data;

    const codeEl = document.getElementById('editOrderCode') as HTMLInputElement | null;
    if (codeEl) codeEl.value = info.order_code || orderCode;
    const subEl = document.getElementById('editOrderSubtitle');
    if (subEl) subEl.textContent = `Mã đơn: ${info.order_code || orderCode}`;

    // Populate sites select
    const siteSelect = document.getElementById('editOrderSite') as HTMLSelectElement | null;
    if (siteSelect) {
      const sitesList = (typeof (window as any).getAppSitesList === 'function' ? (window as any).getAppSitesList() : []) || [];
      siteSelect.innerHTML = sitesList.map((s: any) => {
        const val = s.ten || s.name || s.code || s;
        const isSel = (info.site_name === val || info.site_name === s.name || info.site_name === s.code) ? 'selected' : '';
        return `<option value="${val}" ${isSel}>${val}</option>`;
      }).join('');
      if (info.site_name && !sitesList.some((s: any) => (s.ten || s.name || s.code) === info.site_name)) {
        siteSelect.insertAdjacentHTML('afterbegin', `<option value="${info.site_name}" selected>${info.site_name}</option>`);
      }
    }

    const dateEl = document.getElementById('editOrderDate') as HTMLInputElement | null;
    if (dateEl) dateEl.value = (info.order_date || '').slice(0, 10);

    const statusEl = document.getElementById('editOrderStatus') as HTMLSelectElement | null;
    if (statusEl) statusEl.value = info.status || 'Mới tạo';

    const nguoiDatEl = document.getElementById('editOrderNguoiDat') as HTMLInputElement | null;
    if (nguoiDatEl) nguoiDatEl.value = info.ordered_by || '';

    const thangEl = document.getElementById('editOrderThang') as HTMLInputElement | null;
    if (thangEl) thangEl.value = info.applied_month || '';

    const ghiChuEl = document.getElementById('editOrderGhiChu') as HTMLInputElement | null;
    if (ghiChuEl) ghiChuEl.value = '';

    // Initialize items array
    editOrderItems = (items || []).map((it: any) => ({
      maHang: it.maHang || it.item_code,
      tenSP: it.tenSP || it.item_name,
      dvt: it.dvt || it.unit || 'Phần',
      soLuong: Number(it.soLuong ?? it.order_qty ?? 1),
      donGia: Number(it.donGia ?? it.unit_price ?? 0),
      thanhTien: Number(it.thanhTien ?? ((it.soLuong || 1) * (it.donGia || 0))),
      ghiChu: it.ghiChu || ''
    }));
    (window as any)._editOrderItems = editOrderItems;

    // Populate available NVL items in #editOrderAddSelect
    const addSel = document.getElementById('editOrderAddSelect') as HTMLSelectElement | null;
    if (addSel) {
      const win = window as any;
      let candidateItems = (win.App && win.App.items && win.App.items.length) ? win.App.items : [];
      if (!candidateItems.length) {
        try {
          const qRes = await fetch(`/api/quota?site=${encodeURIComponent(info.site_name || 'K001')}&thang=${encodeURIComponent(info.applied_month || '')}`);
          const qJson = await qRes.json();
          if (qJson.success && qJson.data?.items) {
            candidateItems = qJson.data.items;
            if (win.App) win.App.items = candidateItems;
          }
        } catch (e) {}
      }
      addSel.innerHTML = '<option value="">-- Chọn mặt hàng muốn thêm --</option>' +
        candidateItems.map((c: any) => `
          <option value="${safeEscapeHtml(c.maHang || c.code)}" 
                  data-name="${safeEscapeHtml(c.tenHang || c.tenSP || c.name || '')}" 
                  data-unit="${safeEscapeHtml(c.dvt || c.unit || 'Phần')}" 
                  data-price="${Number(c.donGia || c.price || 0)}">
            [${safeEscapeHtml(c.maHang || c.code)}] ${safeEscapeHtml(c.tenHang || c.tenSP || c.name || '')} (${fmtVND(c.donGia || c.price || 0)}/${c.dvt || c.unit || ''})
          </option>
        `).join('');
    }

    renderEditOrderItems();

    const modal = document.getElementById('modalEditOrder');
    if (modal) modal.classList.remove('hidden');
  } catch (err: any) {
    console.error('openEditOrderModal error:', err);
    if (typeof showToast === 'function') showToast('Lỗi: ' + (err?.message || err), 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  }
}

export function closeEditOrderModal(): void {
  const modal = document.getElementById('modalEditOrder');
  if (modal) modal.classList.add('hidden');
  editOrderItems = [];
  (window as any)._editOrderItems = [];
}

export function renderEditOrderItems(): void {
  const tbody = document.getElementById('editOrderItemsBody');
  const mob = document.getElementById('editOrderItemsMobile');
  const items = editOrderItems;

  if (tbody) {
    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="p-4 text-center text-gray-400">Chưa có mặt hàng nào. Vui lòng thêm mặt hàng bên dưới.</td></tr>';
    } else {
      tbody.innerHTML = items.map((it, idx) => `
        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
          <td class="p-2.5 text-center text-gray-400 font-mono">${idx + 1}</td>
          <td class="p-2.5 font-mono font-medium text-gray-900 dark:text-white">${safeEscapeHtml(it.maHang)}</td>
          <td class="p-2.5 font-medium text-gray-800 dark:text-gray-200">${safeEscapeHtml(it.tenSP)}</td>
          <td class="p-2.5 text-center text-gray-500">${safeEscapeHtml(it.dvt)}</td>
          <td class="p-2.5 text-right">
            <input type="number" min="0.1" step="0.5" value="${it.soLuong}" 
                   onchange="updateEditOrderItemQty(${idx}, this.value)" 
                   class="w-20 px-2 py-1 text-right font-mono font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-500">
          </td>
          <td class="p-2.5 text-right font-mono text-gray-500">${fmtVND(it.donGia)}</td>
          <td class="p-2.5 text-right font-mono font-bold text-brand-600 dark:text-brand-400">${fmtVND(it.soLuong * it.donGia)}</td>
          <td class="p-2.5 text-center">
            <button type="button" onclick="removeEditOrderItemLine(${idx})" class="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors" title="Xóa dòng">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
            </button>
          </td>
        </tr>
      `).join('');
    }
  }

  if (mob) {
    if (!items.length) {
      mob.innerHTML = '<div class="p-4 text-center text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-xl">Chưa có mặt hàng nào</div>';
    } else {
      mob.innerHTML = items.map((it, idx) => `
        <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-bold text-gray-900 dark:text-white">${safeEscapeHtml(it.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${safeEscapeHtml(it.maHang)} · <span class="font-sans">${safeEscapeHtml(it.dvt)}</span></div>
            </div>
            <button type="button" onclick="removeEditOrderItemLine(${idx})" class="p-1 text-rose-500 hover:text-rose-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
            </button>
          </div>
          <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-200 dark:border-gray-700/60">
            <div class="flex items-center gap-1.5">
              <span class="text-gray-500">Số lượng:</span>
              <input type="number" min="0.1" step="0.5" value="${it.soLuong}" 
                     onchange="updateEditOrderItemQty(${idx}, this.value)" 
                     class="w-16 px-1.5 py-0.5 text-center font-mono font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
            </div>
            <div class="text-right">
              <div class="font-mono font-bold text-brand-600 dark:text-brand-400">${fmtVND(it.soLuong * it.donGia)}</div>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  recalcEditOrderTotals();
}

export function updateEditOrderItemQty(idx: number, val: string | number): void {
  const num = Math.max(0, Number(val) || 0);
  if (editOrderItems && editOrderItems[idx]) {
    editOrderItems[idx].soLuong = num;
    editOrderItems[idx].thanhTien = num * (editOrderItems[idx].donGia || 0);
    renderEditOrderItems();
  }
}

export function removeEditOrderItemLine(idx: number): void {
  if (editOrderItems && editOrderItems.length > idx) {
    editOrderItems.splice(idx, 1);
    renderEditOrderItems();
  }
}

export function addEditOrderItemLine(): void {
  const sel = document.getElementById('editOrderAddSelect') as HTMLSelectElement | null;
  const qtyInput = document.getElementById('editOrderAddQty') as HTMLInputElement | null;
  if (!sel || !sel.value) {
    if (typeof showToast === 'function') showToast('Vui lòng chọn một mặt hàng để thêm', 'warning');
    return;
  }
  const code = sel.value;
  const opt = sel.selectedOptions[0];
  const name = opt.getAttribute('data-name') || code;
  const unit = opt.getAttribute('data-unit') || 'Phần';
  const price = Number(opt.getAttribute('data-price')) || 0;
  const qty = Math.max(0.1, Number(qtyInput ? qtyInput.value : 1) || 1);

  const existing = editOrderItems.find(it => it.maHang === code);
  if (existing) {
    existing.soLuong += qty;
    existing.thanhTien = existing.soLuong * existing.donGia;
  } else {
    editOrderItems.push({
      maHang: code,
      tenSP: name,
      dvt: unit,
      soLuong: qty,
      donGia: price,
      thanhTien: qty * price,
      ghiChu: ''
    });
  }

  sel.value = '';
  if (qtyInput) qtyInput.value = '1';

  renderEditOrderItems();
}

export function recalcEditOrderTotals(): void {
  const items = editOrderItems;
  let totalQty = 0;
  let totalAmount = 0;
  items.forEach(it => {
    totalQty += Number(it.soLuong) || 0;
    totalAmount += (Number(it.soLuong) || 0) * (Number(it.donGia) || 0);
  });

  const countEl = document.getElementById('editOrderItemsCount');
  if (countEl) countEl.textContent = String(items.length);
  const qtyEl = document.getElementById('editOrderTotalQty');
  if (qtyEl) qtyEl.textContent = fmtNum(totalQty);
  const amtEl = document.getElementById('editOrderTotalAmount');
  if (amtEl) amtEl.textContent = fmtVND(totalAmount);
}

export async function saveEditOrder(): Promise<void> {
  if (!canEditOrders()) {
    if (typeof showToast === 'function') showToast('Tài khoản của bạn không có quyền chỉnh sửa đơn hàng', 'warning');
    return;
  }
  const orderCode = (document.getElementById('editOrderCode') as HTMLInputElement)?.value;
  if (!orderCode) {
    if (typeof showToast === 'function') showToast('Thiếu mã đơn hàng', 'error');
    return;
  }

  const site = (document.getElementById('editOrderSite') as HTMLSelectElement)?.value;
  const orderDate = (document.getElementById('editOrderDate') as HTMLInputElement)?.value;
  const status = (document.getElementById('editOrderStatus') as HTMLSelectElement)?.value;
  const orderedBy = (document.getElementById('editOrderNguoiDat') as HTMLInputElement)?.value;
  const month = (document.getElementById('editOrderThang') as HTMLInputElement)?.value;
  const ghiChu = (document.getElementById('editOrderGhiChu') as HTMLInputElement)?.value;

  const validItems = editOrderItems.filter(it => (Number(it.soLuong) || 0) > 0);
  if (!validItems.length) {
    if (typeof showToast === 'function') showToast('Đơn hàng phải có ít nhất 1 mặt hàng có số lượng > 0', 'warning');
    return;
  }

  const currentUser = (typeof getAppCurrentUser === 'function' ? getAppCurrentUser() : null) || (window as any).gCurrentUser;

  if (typeof showLoading === 'function') showLoading('Đang lưu cập nhật đơn hàng...');
  try {
    const res = await fetch('/api/order', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderCode,
        site,
        orderDate,
        status,
        orderedBy,
        month,
        ghiChu,
        actor: currentUser ? (currentUser.full_name || currentUser.fullName || currentUser.email) : 'Người quản trị',
        items: validItems
      })
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || 'Cập nhật thất bại');
    }

    if (typeof showToast === 'function') showToast(`Đã cập nhật đơn hàng ${orderCode} thành công!`, 'success');
    closeEditOrderModal();
    if (typeof (window as any).loadHistory === 'function') {
      (window as any).loadHistory();
    }
  } catch (err: any) {
    console.error('saveEditOrder error:', err);
    if (typeof showToast === 'function') showToast('Lỗi lưu đơn hàng: ' + (err?.message || err), 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export async function confirmDeleteOrder(orderCode: string): Promise<void> {
  if (!canDeleteOrders()) {
    if (typeof showToast === 'function') showToast('Tài khoản của bạn không có quyền xóa đơn hàng', 'warning');
    return;
  }
  pendingDeleteOrderCode = orderCode;
  (window as any)._pendingDeleteOrderCode = orderCode;
  const codeEl = document.getElementById('confirmDeleteOrderCode');
  if (codeEl) codeEl.textContent = orderCode;

  const infoEl = document.getElementById('confirmDeleteOrderInfo');
  if (infoEl) infoEl.innerHTML = '<span class="text-gray-400">Đang tải chi tiết đơn...</span>';

  const modal = document.getElementById('modalConfirmDeleteOrder');
  if (modal) modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();

  try {
    const res = await fetch(`/api/order-detail?orderCode=${encodeURIComponent(orderCode)}&_t=${Date.now()}`);
    const json = await res.json();
    if (json.success && json.data && infoEl) {
      const { info, items } = json.data;
      const totalAmount = (items || []).reduce((acc: number, it: any) => acc + (Number(it.thanhTien) || 0), 0);
      const totalQty = (items || []).reduce((acc: number, it: any) => acc + (Number(it.soLuong) || 0), 0);
      infoEl.innerHTML = `
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div>Điểm bán: <b class="text-gray-900 dark:text-white truncate block">${safeEscapeHtml(info.site_name || '—')}</b></div>
          <div>Ngày đặt: <b class="num font-medium text-gray-900 dark:text-white">${fmtDate(info.order_date)}</b></div>
          <div>Người đặt: <b class="text-gray-900 dark:text-white truncate block">${safeEscapeHtml(info.ordered_by || '—')}</b></div>
          <div>Trạng thái: <b class="text-brand-600 dark:text-brand-400">${safeEscapeHtml(info.status || 'Mới tạo')}</b></div>
          <div class="col-span-2 pt-1 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span>Mặt hàng: <b>${items.length} món (${fmtNum(totalQty)} SL)</b></span>
            <span class="font-bold text-sm text-brand-600 dark:text-brand-400">${fmtVND(totalAmount)}</span>
          </div>
        </div>
      `;
    }
  } catch (e) {}
}

export function closeDeleteOrderModal(): void {
  const modal = document.getElementById('modalConfirmDeleteOrder');
  if (modal) modal.classList.add('hidden');
  pendingDeleteOrderCode = null;
  (window as any)._pendingDeleteOrderCode = null;
}

export async function executeDeleteOrder(): Promise<void> {
  const orderCode = pendingDeleteOrderCode || (window as any)._pendingDeleteOrderCode;
  if (!orderCode) return;

  if (!canDeleteOrders()) {
    if (typeof showToast === 'function') showToast('Tài khoản của bạn không có quyền xóa đơn hàng', 'warning');
    closeDeleteOrderModal();
    return;
  }

  if (typeof showLoading === 'function') showLoading('Đang xóa đơn hàng khỏi CSDL...');
  try {
    const res = await fetch(`/api/order?orderCode=${encodeURIComponent(orderCode)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderCode })
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || 'Xóa thất bại');
    }

    if (typeof showToast === 'function') showToast(`Đã xóa vĩnh viễn đơn hàng ${orderCode} thành công!`, 'success');
    closeDeleteOrderModal();
    if (typeof (window as any).loadHistory === 'function') {
      (window as any).loadHistory();
    }
  } catch (err: any) {
    console.error('executeDeleteOrder error:', err);
    if (typeof showToast === 'function') showToast('Lỗi xóa đơn: ' + (err?.message || err), 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}
