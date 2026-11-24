import type { WhReceivedOrder, WhReceivedOrderLine } from './types';
import { formatNumber, formatDate, escapeHtml } from '@/ts/utils/formatters';

declare const App: { currentBranch?: string; [key: string]: any };
declare const lucide: any;
declare function showLoading(msg?: string): void;
declare function hideLoading(): void;
declare function showToast(msg: string, type?: string): void;

export let gWhReceivedOrders: WhReceivedOrder[] = [];
export let gWhCurrentReceivedDetail: any = null;

export function getWhReceivedOrders(): WhReceivedOrder[] {
  return gWhReceivedOrders;
}

export function switchWhInvSubView(view: 'balance' | 'receipts'): void {
  const btnBalance = document.getElementById('whInvTabBtnBalance');
  const btnReceipts = document.getElementById('whInvTabBtnReceipts');
  const viewBalance = document.getElementById('whInvBalanceView');
  const viewReceipts = document.getElementById('whInvReceiptsView');

  if (view === 'balance') {
    if (btnBalance) btnBalance.className = 'btn btn-primary btn-sm';
    if (btnReceipts) btnReceipts.className = 'btn btn-secondary btn-sm';
    if (viewBalance) viewBalance.classList.remove('hidden');
    if (viewReceipts) viewReceipts.classList.add('hidden');
  } else {
    if (btnBalance) btnBalance.className = 'btn btn-secondary btn-sm';
    if (btnReceipts) btnReceipts.className = 'btn btn-primary btn-sm';
    if (viewBalance) viewBalance.classList.add('hidden');
    if (viewReceipts) viewReceipts.classList.remove('hidden');
    loadWhReceivedOrders();
  }
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

export function populateWhReceivedOrdersSiteFilter(): void {
  const siteSelect = document.getElementById('whReceivedOrdersSiteFilter') as HTMLSelectElement | null;
  if (!siteSelect) return;
  if (siteSelect.options && siteSelect.options.length > 1) return;

  const sites = (typeof (window as any).getAppSitesList === 'function') ? (window as any).getAppSitesList() : [];
  siteSelect.innerHTML = sites.map((s: any) => `<option value="${s.code}">${s.ten || s.name}</option>`).join('');

  const saved = localStorage.getItem('orbit_user_site') || (typeof App !== 'undefined' && App.currentBranch ? App.currentBranch.toUpperCase() : 'K001');
  if (saved) {
    siteSelect.value = saved.toUpperCase();
  }
}

export function renderWhReceivedOrdersTable(): void {
  const tbody = document.getElementById('whReceivedOrdersTableBody');
  const mob = document.getElementById('whReceivedOrdersMobileCards');
  const query = ((document.getElementById('whReceivedOrdersSearchInput') as HTMLInputElement | null)?.value || '').trim().toLowerCase();
  const typeFilter = (document.getElementById('whReceivedOrdersTypeFilter') as HTMLSelectElement | null)?.value || 'ALL';

  let list = [...gWhReceivedOrders];

  if (typeFilter !== 'ALL') {
    list = list.filter(o => o.doc_type === typeFilter);
  }

  if (query) {
    list = list.filter(o =>
      (o.po_number || '').toLowerCase().includes(query) ||
      (o.receipt_code || '').toLowerCase().includes(query) ||
      (o.supplier || '').toLowerCase().includes(query) ||
      (o.site_code || '').toLowerCase().includes(query) ||
      (o.notes || '').toLowerCase().includes(query) ||
      (o.created_by || '').toLowerCase().includes(query)
    );
  }

  // Update KPIs
  const kpiCount = document.getElementById('whKpiReceivedOrdersCount');
  const kpiQty = document.getElementById('whKpiReceivedOrdersTotalQty');
  const kpiAmt = document.getElementById('whKpiReceivedOrdersTotalAmount');
  const countText = document.getElementById('whReceivedOrdersCountText');

  let totalQty = 0;
  let totalAmount = 0;
  list.forEach(o => {
    totalQty += Number(o.total_qty) || 0;
    totalAmount += Number(o.total_amount) || 0;
  });

  if (kpiCount) kpiCount.textContent = String(list.length);
  if (kpiQty) kpiQty.textContent = formatNumber(totalQty, 1);
  if (kpiAmt) kpiAmt.textContent = Math.round(totalAmount).toLocaleString('vi-VN') + ' ₫';
  if (countText) countText.textContent = String(list.length);

  if (!list.length) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="11" class="p-8 text-center text-gray-400">Không tìm thấy đơn hàng đã nhập kho nào khớp với bộ lọc.</td></tr>';
    if (mob) mob.innerHTML = '<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không tìm thấy đơn hàng đã nhập kho nào khớp với bộ lọc.</div>';
    return;
  }

  // Render Desktop Table
  if (tbody) {
    tbody.innerHTML = list.map((o, idx) => {
      const isDirect = o.doc_type === 'DIRECT';
      const badgeDocType = isDirect ? '<span class="badge badge-neutral text-xs">Trực tiếp</span>' : (o.doc_type === 'PR' ? '<span class="badge badge-brand text-xs">Đơn PR</span>' : '<span class="badge badge-brand text-xs">Đơn PO</span>');
      const formattedDate = formatDate(o.receipt_date);
      const amtStr = Math.round(Number(o.total_amount) || 0).toLocaleString('vi-VN') + ' ₫';

      return `
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="w-10 text-center text-gray-400 num font-mono text-xs">${idx + 1}</td>
          <td class="col-code font-bold">
            <span class="code font-bold text-brand-600 dark:text-brand-400">${escapeHtml(o.po_number || '—')}</span>
            <div class="mt-0.5">${badgeDocType}</div>
          </td>
          <td class="col-code">
            <span class="code text-gray-800 dark:text-gray-200">${escapeHtml(o.receipt_code || '—')}</span>
          </td>
          <td class="text-center font-semibold text-xs text-gray-700 dark:text-gray-300">
            <span class="badge badge-neutral">${escapeHtml(o.site_code || 'K001')}</span>
          </td>
          <td class="col-date num whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">${formattedDate}</td>
          <td>
            <div class="font-medium text-xs text-gray-900 dark:text-white">${escapeHtml(o.supplier || 'N/A')}</div>
            ${o.notes ? `<div class="text-xs text-gray-400 truncate max-w-[200px]" title="${escapeHtml(o.notes)}">${escapeHtml(o.notes)}</div>` : ''}
          </td>
          <td class="col-num text-center num text-xs font-semibold">${o.item_count || 1} món</td>
          <td class="col-num text-right font-bold text-gray-900 dark:text-white num text-xs">${amtStr}</td>
          <td class="text-xs text-gray-500 dark:text-gray-400">${escapeHtml(o.created_by || 'Thủ kho')}</td>
          <td class="col-badge text-center">
            <span class="badge badge-brand text-xs whitespace-nowrap">Đã nhập kho</span>
          </td>
          <td class="col-actions text-center whitespace-nowrap">
            <div class="inline-flex items-center gap-1.5 justify-center">
              <button onclick="openWhReceivedOrderDetail('${o.id || ''}', '${escapeHtml(o.po_number || '')}')" class="btn btn-secondary btn-sm" title="Xem chi tiết dòng hàng">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i> Chi tiết
              </button>
              <button onclick="confirmCancelReceivedOrder('${o.id || ''}', '${escapeHtml(o.po_number || '')}', '${escapeHtml(o.receipt_code || '')}', ${Number(o.total_amount) || 0})" class="btn btn-danger btn-sm" title="Hủy nhập kho và hoàn tác tồn kho">
                <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Hủy nhập
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render Mobile Cards
  if (mob) {
    mob.innerHTML = list.map((o) => {
      const isDirect = o.doc_type === 'DIRECT';
      const badgeDocType = isDirect ? '<span class="badge badge-neutral text-xs">Trực tiếp</span>' : (o.doc_type === 'PR' ? '<span class="badge badge-brand text-xs">Đơn PR</span>' : '<span class="badge badge-brand text-xs">Đơn PO</span>');
      const formattedDate = formatDate(o.receipt_date);
      const amtStr = Math.round(Number(o.total_amount) || 0).toLocaleString('vi-VN') + ' ₫';

      return `
        <div class="data-card">
          <div class="data-card-header">
            <div class="flex items-center gap-2">
              <span class="code font-bold text-brand-600 dark:text-brand-400">${escapeHtml(o.po_number || o.receipt_code || '')}</span>
              ${badgeDocType}
            </div>
            <span class="badge badge-brand text-xs">Đã nhập kho</span>
          </div>

          <div class="data-card-body space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-400">Phiếu nhập:</span>
              <span class="code text-gray-700 dark:text-gray-300 font-semibold">${escapeHtml(o.receipt_code || '—')}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-400">Nhà cung cấp:</span>
              <span class="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">${escapeHtml(o.supplier || 'N/A')}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-400">Điểm nhận / Ngày:</span>
              <span class="text-gray-600 dark:text-gray-300 font-medium">${escapeHtml(o.site_code || '')} • <span class="num">${formattedDate}</span></span>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-gray-400 block">Số mặt hàng</span>
                <span class="num font-bold text-gray-900 dark:text-white">${o.item_count || 1} món (${formatNumber(o.total_qty || 0, 1)})</span>
              </div>
              <div class="text-right">
                <span class="text-gray-400 block">Tổng tiền nhập</span>
                <span class="num font-bold text-brand-600 dark:text-brand-400 text-sm">${amtStr}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="openWhReceivedOrderDetail('${o.id || ''}', '${escapeHtml(o.po_number || '')}')" class="btn btn-secondary btn-sm w-full">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Xem chi tiết
            </button>
            <button onclick="confirmCancelReceivedOrder('${o.id || ''}', '${escapeHtml(o.po_number || '')}', '${escapeHtml(o.receipt_code || '')}', ${Number(o.total_amount) || 0})" class="btn btn-danger btn-sm w-full">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Hủy nhập kho
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

export function filterWhReceivedOrdersTable(): void {
  renderWhReceivedOrdersTable();
}

export async function loadWhReceivedOrders(): Promise<void> {
  populateWhReceivedOrdersSiteFilter();
  const siteSelect = document.getElementById('whReceivedOrdersSiteFilter') as HTMLSelectElement | null;
  const globalSaved = localStorage.getItem('orbit_user_site');
  const globalSel = (document.getElementById('globalBranchSelect') as HTMLSelectElement | null)?.value;
  const appBranch = (typeof App !== 'undefined' && App.currentBranch) ? App.currentBranch.toUpperCase() : null;
  let activeSite = globalSaved || globalSel || appBranch || (siteSelect ? siteSelect.value : null) || 'K001';
  if (activeSite === 'ALL' || activeSite === 'all') activeSite = 'K001';
  activeSite = activeSite.toUpperCase();

  if (siteSelect) {
    siteSelect.value = activeSite;
  }

  const site = activeSite;
  const tbody = document.getElementById('whReceivedOrdersTableBody');
  const mob = document.getElementById('whReceivedOrdersMobileCards');
  if (tbody) tbody.innerHTML = '<tr><td colspan="11" class="p-8 text-center text-gray-400">Đang tải danh sách đơn hàng đã nhập kho...</td></tr>';
  if (mob) mob.innerHTML = '<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Đang tải danh sách đơn hàng đã nhập kho...</div>';

  try {
    const res = await fetch(`/api/wh/received-orders?site=${encodeURIComponent(site)}&no-cache=1`);
    const json = await res.json();
    if (json.success && json.data) {
      gWhReceivedOrders = json.data.orders || [];
    } else {
      gWhReceivedOrders = [];
    }
    if (typeof window !== 'undefined') {
      (window as any).gWhReceivedOrders = gWhReceivedOrders;
    }

    const badge = document.getElementById('whInvBadgeReceiptsCount');
    if (badge) badge.textContent = String(gWhReceivedOrders.length);

    renderWhReceivedOrdersTable();
  } catch (err: any) {
    console.error('loadWhReceivedOrders error:', err);
    if (tbody) tbody.innerHTML = `<tr><td colspan="11" class="p-8 text-center text-rose-500 font-medium">Lỗi tải danh sách: ${err.message}</td></tr>`;
    if (mob) mob.innerHTML = `<div class="p-6 text-center text-rose-500 font-medium">Lỗi tải danh sách: ${err.message}</div>`;
  }
}

export async function openWhReceivedOrderDetail(receiptId: string, poNumber: string): Promise<void> {
  const modal = document.getElementById('whReceivedOrderDetailModal');
  if (!modal) return;
  modal.classList.remove('hidden');

  const titleEl = document.getElementById('whRecModalTitle');
  const poEl = document.getElementById('whRecModalPoNumber');
  const rcEl = document.getElementById('whRecModalReceiptCode');
  const siteEl = document.getElementById('whRecModalSite');
  const dateEl = document.getElementById('whRecModalDate');
  const supEl = document.getElementById('whRecModalSupplier');
  const byEl = document.getElementById('whRecModalCreatedBy');
  const amtEl = document.getElementById('whRecModalTotalAmount');
  const tbody = document.getElementById('whRecModalLinesBody');

  if (titleEl) titleEl.textContent = `Chi tiết đơn hàng đã nhập kho: ${poNumber || receiptId}`;
  if (poEl) poEl.textContent = poNumber || '—';
  if (tbody) tbody.innerHTML = '<tr><td colspan="9" class="p-6 text-center text-gray-400">Đang tải danh mục mặt hàng đã nhập...</td></tr>';

  gWhCurrentReceivedDetail = { receiptId, poNumber };
  if (typeof window !== 'undefined') {
    (window as any).gWhCurrentReceivedDetail = gWhCurrentReceivedDetail;
  }

  try {
    const orderInfo = (gWhReceivedOrders || []).find(o => (receiptId && String(o.id) === String(receiptId)) || (poNumber && o.po_number === poNumber));
    if (orderInfo) {
      if (rcEl) rcEl.textContent = orderInfo.receipt_code || '—';
      if (siteEl) siteEl.textContent = orderInfo.site_code || '—';
      if (dateEl) dateEl.textContent = formatDate(orderInfo.receipt_date);
      if (supEl) supEl.textContent = orderInfo.supplier || '—';
      if (byEl) byEl.textContent = orderInfo.created_by || 'Thủ kho';
      if (amtEl) amtEl.textContent = Math.round(Number(orderInfo.total_amount) || 0).toLocaleString('vi-VN') + ' ₫';
      gWhCurrentReceivedDetail.receiptCode = orderInfo.receipt_code;
      gWhCurrentReceivedDetail.totalAmount = orderInfo.total_amount;
    }

    let lines: WhReceivedOrderLine[] = [];
    if (receiptId) {
      const res = await fetch(`/api/fnb/receipts?id=${encodeURIComponent(receiptId)}`);
      const json = await res.json();
      if (json.success && json.data) {
        lines = json.data.lines || [];
      }
    } else if (poNumber) {
      const res = await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(poNumber)}`);
      const json = await res.json();
      if (json.success && json.data) {
        lines = (json.data || []).map((p: any) => ({
          item_code: p.article,
          item_name: p.article_desc || p.article,
          unit: p.order_unit || 'Phần',
          qty: p.received_qty || p.order_qty,
          unit_price: p.net_price,
          amount: (p.received_qty || p.order_qty) * p.net_price,
          batch_code: p.batch_code || 'LÔ-SAP',
          exp_date: p.exp_date || null
        }));
      }
    }

    if (!lines.length) {
      if (tbody) tbody.innerHTML = '<tr><td colspan="9" class="p-6 text-center text-gray-400">Không có dòng hàng nào được ghi nhận cho phiếu này.</td></tr>';
      return;
    }

    if (tbody) {
      tbody.innerHTML = lines.map((l, idx) => {
        const qty = Number(l.qty) || 0;
        const price = Number(l.unit_price) || 0;
        const amt = Number(l.amount) || (qty * price);
        const expStr = l.exp_date ? formatDate(l.exp_date.slice(0, 10)) : '—';

        return `
          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
            <td class="text-center num text-xs font-mono text-gray-400">${idx + 1}</td>
            <td class="col-code font-bold text-xs">${escapeHtml(l.item_code)}</td>
            <td class="font-medium text-xs text-gray-900 dark:text-white">${escapeHtml(l.item_name || l.item_code)}</td>
            <td class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300">${escapeHtml(l.unit || 'Phần')}</td>
            <td class="col-num text-right num font-bold text-emerald-600 dark:text-emerald-400 text-xs">${formatNumber(qty, 1)}</td>
            <td class="col-num text-right num text-xs">${Math.round(price).toLocaleString('vi-VN')} ₫</td>
            <td class="col-num text-right num font-semibold text-gray-900 dark:text-white text-xs">${Math.round(amt).toLocaleString('vi-VN')} ₫</td>
            <td class="text-center font-mono text-xs text-gray-700 dark:text-gray-300">${escapeHtml(l.batch_code || '—')}</td>
            <td class="col-date text-center num text-xs text-gray-600 dark:text-gray-400">${expStr}</td>
          </tr>
        `;
      }).join('');
    }
  } catch (err: any) {
    console.error('Error openWhReceivedOrderDetail:', err);
    if (tbody) tbody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-rose-500 font-medium">Lỗi tải chi tiết: ${err.message}</td></tr>`;
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

export function closeWhReceivedOrderDetailModal(): void {
  const modal = document.getElementById('whReceivedOrderDetailModal');
  if (modal) modal.classList.add('hidden');
  gWhCurrentReceivedDetail = null;
  if (typeof window !== 'undefined') {
    (window as any).gWhCurrentReceivedDetail = null;
  }
}

export function onWhRecModalCancelClick(): void {
  if (!gWhCurrentReceivedDetail) return;
  const { receiptId, poNumber, receiptCode, totalAmount } = gWhCurrentReceivedDetail;
  confirmCancelReceivedOrder(receiptId, poNumber, receiptCode, totalAmount);
}

export async function confirmCancelReceivedOrder(receiptId: string, poNumber: string, receiptCode: string, totalAmount: number): Promise<void> {
  const codeDisplay = receiptCode || poNumber || 'đơn hàng này';
  const amtDisplay = totalAmount ? (Math.round(totalAmount).toLocaleString('vi-VN') + ' ₫') : '';

  const confirmMsg = `Bạn có chắc chắn muốn HỦY NHẬP KHO cho đơn hàng [${codeDisplay}]` +
    (amtDisplay ? ` với giá trị ${amtDisplay}` : '') + `?\n\n` +
    `• Toàn bộ số lượng nhập kho sẽ được HOÀN TÁC TRỪ KHỎI TỒN KHO thực tế.\n` +
    `• Đơn hàng PO/PR sẽ được mở lại (trạng thái Chờ nhập) để có thể nhập lại khi cần.`;

  if (!confirm(confirmMsg)) return;

  try {
    if (typeof showLoading === 'function') showLoading('Đang hủy nhập kho và hoàn tác tồn kho...');

    const res = await fetch('/api/fnb/receipts/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: receiptId || undefined,
        po_number: poNumber || undefined
      })
    });
    const json = await res.json();

    if (json.success) {
      if (typeof showToast === 'function') {
        showToast(json.message || 'Hủy nhập kho thành công!', 'success');
      }
      closeWhReceivedOrderDetailModal();
      loadWhReceivedOrders();
    } else {
      if (typeof showToast === 'function') {
        showToast(`Lỗi hủy nhập kho: ${json.error}`, 'error');
      }
    }
  } catch (err: any) {
    console.error('confirmCancelReceivedOrder error:', err);
    if (typeof showToast === 'function') {
      showToast(`Lỗi kết nối: ${err.message}`, 'error');
    }
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}
