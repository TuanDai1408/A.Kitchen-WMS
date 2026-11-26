import { escapeHtml } from '@/ts/utils/formatters';
import { formatReceiptDateYMD, getActiveFnbReceiptSite } from './helpers';
import { canUserEdit, canUserDelete, assertPermission } from '@/features/auth';

declare const window: any;

let _editReceiptData: {
  id: number | string;
  receipt_code: string;
  site_code: string;
  lines: Array<{
    item_code: string;
    item_name: string;
    unit: string;
    qty: number;
    unit_price: number;
    amount: number;
    batch_code: string;
    exp_date: string;
    mfg_date: string;
    note: string;
  }>;
} | null = null;

let _pendingDeleteReceipt: { id: number | string; code: string } | null = null;

export function populateReceiptsHistorySupplierFilter(receipts: any[]): void {
  const sel = document.getElementById('fnbReceiptHistorySupplierFilter') as HTMLSelectElement | null;
  if (!sel) return;
  const currentVal = sel.value || '';
  const suppliers = Array.from(
    new Set(
      (receipts || [])
        .map((r: any) => (r.supplier || 'Bếp Trung Tâm Siba').trim())
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

export function renderFnbReceiptsHistoryTable(): void {
  const siteCode = getActiveFnbReceiptSite();
  const tbody = document.getElementById('fnbReceiptsTableBody');
  const mob = document.getElementById('fnbReceiptsMobileCards');
  const supplierFilter = ((document.getElementById('fnbReceiptHistorySupplierFilter') as HTMLSelectElement | null)?.value || '').trim().toLowerCase();
  const searchQuery = ((document.getElementById('fnbReceiptHistorySearchInput') as HTMLInputElement | null)?.value || '').trim().toLowerCase();
  const canEdit = canUserEdit('fnb-receipts');
  const canDelete = canUserDelete('fnb-receipts');

  let receipts: any[] = window.gFnbReceiptsHistory || [];
  if (supplierFilter) {
    receipts = receipts.filter(r => {
      const sup = (r.supplier || 'Bếp Trung Tâm Siba').trim().toLowerCase();
      return sup === supplierFilter || sup.includes(supplierFilter);
    });
  }
  if (searchQuery) {
    receipts = receipts.filter(r =>
      (r.receipt_code || '').toLowerCase().includes(searchQuery) ||
      (r.invoice_no || '').toLowerCase().includes(searchQuery) ||
      (r.supplier || '').toLowerCase().includes(searchQuery) ||
      (r.created_by || '').toLowerCase().includes(searchQuery)
    );
  }

  if (tbody) {
    if (!receipts.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-10 text-gray-400">Không tìm thấy phiếu nhập kho nào phù hợp cho điểm bán ${escapeHtml(siteCode)}.</td></tr>`;
    } else {
      tbody.innerHTML = receipts.map(r => `
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${escapeHtml(r.receipt_code)}</td>
          <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${escapeHtml(r.site_code)}</td>
          <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">${escapeHtml(formatReceiptDateYMD(r.receipt_date))}</td>
          <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${escapeHtml(r.supplier || 'Bếp Trung Tâm Siba')}</td>
          <td class="py-3 px-3 font-mono font-medium text-gray-600 dark:text-gray-400 text-xs">${escapeHtml(r.invoice_no || '—')}</td>
          <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">${Math.round(r.total_amount || 0).toLocaleString('vi-VN')} đ</td>
          <td class="py-3 px-3 text-gray-500 text-xs">${escapeHtml(r.created_by || 'Thủ kho')}</td>
          <td class="py-3 px-3 text-center whitespace-nowrap">
            <div class="inline-flex items-center gap-1 justify-center">
              <button type="button" onclick="viewReceiptDetail(${r.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors" title="Xem chi tiết phiếu">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
              ${canEdit ? `
                <button type="button" onclick="openEditReceiptModal(${r.id})" class="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 transition-colors" title="Sửa phiếu nhập kho">
                  <i data-lucide="edit-3" class="w-4 h-4"></i>
                </button>
              ` : ''}
              ${canDelete ? `
                <button type="button" onclick="confirmDeleteReceipt(${r.id}, '${escapeHtml(r.receipt_code)}')" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 transition-colors" title="Xóa / Hủy phiếu nhập kho">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  if (mob) {
    if (!receipts.length) {
      mob.innerHTML = `<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không tìm thấy phiếu nhập kho nào phù hợp.</div>`;
    } else {
      mob.innerHTML = receipts.map(r => `
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${escapeHtml(r.receipt_code)}</span>
              <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${escapeHtml(r.supplier || 'Bếp Trung Tâm Siba')}</h4>
              <div class="text-xs text-gray-400 tabular-nums">Ngày nhập: ${escapeHtml(formatReceiptDateYMD(r.receipt_date))} • PO: ${escapeHtml(r.invoice_no || '—')}</div>
            </div>
            <div class="text-right">
              <span class="font-bold text-xs text-gray-900 dark:text-white tabular-nums block">${Math.round(r.total_amount || 0).toLocaleString('vi-VN')} đ</span>
              <span class="text-xs text-gray-400">${escapeHtml(r.created_by || 'Thủ kho')}</span>
            </div>
          </div>
          <div class="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-800 flex-wrap">
            <button type="button" onclick="viewReceiptDetail(${r.id})" class="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold text-xs">Xem</button>
            ${canEdit ? `
              <button type="button" onclick="openEditReceiptModal(${r.id})" class="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs">Sửa</button>
            ` : ''}
            ${canDelete ? `
              <button type="button" onclick="confirmDeleteReceipt(${r.id}, '${escapeHtml(r.receipt_code)}')" class="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs">Xóa</button>
            ` : ''}
          </div>
        </div>
      `).join('');
    }
  }

  if (window.lucide) window.lucide.createIcons();
}

export async function loadFnbReceiptsHistory(siteCodeArg?: string): Promise<void> {
  const siteCode = siteCodeArg || getActiveFnbReceiptSite();

  try {
    const res = await fetch(`/api/fnb/receipts?site_code=${encodeURIComponent(siteCode)}&no-cache=1`);
    const json = await res.json();
    if (json.success && json.data) {
      const receipts: any[] = json.data.receipts || [];
      window.gFnbReceiptsHistory = receipts;

      // Update badge
      const bHist = document.getElementById('fnbReceiptBadgeHistoryCount');
      if (bHist) bHist.textContent = String(receipts.length);

      populateReceiptsHistorySupplierFilter(receipts);
      renderFnbReceiptsHistoryTable();
    }
  } catch (err) {
    console.error('loadFnbReceiptsHistory error:', err);
  }
}

export async function viewReceiptDetail(receiptId: number | string): Promise<void> {
  try {
    if (typeof window.showLoading === 'function') window.showLoading();
    const res = await fetch(`/api/fnb/receipts?id=${receiptId}`);
    const json = await res.json();
    if (!json.success) throw new Error('Không tải được phiếu nhập');

    const lines: any[] = json.data.lines || [];
    const modal = document.getElementById('invDetailModal');
    const titleEl = document.getElementById('invDetailModalTitle');
    const subEl = document.getElementById('invDetailModalSub');
    if (titleEl) titleEl.textContent = `Chi Tiết Phiếu Nhập #${receiptId}`;
    if (subEl) subEl.textContent = `${lines.length} mặt hàng nhập kho`;

    const html = `
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="py-2 px-3">Mặt Hàng</th>
              <th class="py-2 px-2 text-center">ĐVT</th>
              <th class="py-2 px-3 text-right">SL Nhập</th>
              <th class="py-2 px-3 text-center whitespace-nowrap min-w-[100px]">Mã Lô SX</th>
              <th class="py-2 px-3 text-center whitespace-nowrap min-w-[110px]">Hạn Dùng (EXP)</th>
              <th class="py-2 px-3 text-right">Đơn Giá</th>
              <th class="py-2 px-3 text-right">Thành Tiền</th>
              <th class="py-2 px-3">Ghi Chú</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
            ${lines.map(l => `
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${escapeHtml(l.item_name || l.item_code)}</td>
                <td class="py-2 px-2 text-center text-gray-500">${escapeHtml(l.unit || '')}</td>
                <td class="py-2 px-3 text-right font-bold text-brand-600 font-mono">${Number(l.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-center font-mono text-xs text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">${escapeHtml(l.batch_code || '--')}</td>
                <td class="py-2 px-3 text-center font-mono text-xs whitespace-nowrap ${l.exp_date ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'text-gray-400'}">${escapeHtml(l.exp_date ? String(l.exp_date).slice(0, 10) : '--')}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(l.unit_price).toLocaleString('vi-VN')} đ</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(l.amount).toLocaleString('vi-VN')} đ</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${escapeHtml(l.note || '--')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    const bodyEl = document.getElementById('invDetailModalBody');
    if (bodyEl) bodyEl.innerHTML = html;
    if (modal) modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  } catch (e: any) {
    if (typeof window.showToast === 'function') window.showToast('Lỗi xem chi tiết: ' + e.message);
  } finally {
    if (typeof window.hideLoading === 'function') window.hideLoading();
  }
}

export async function openEditReceiptModal(receiptId: number | string): Promise<void> {
  if (!assertPermission('fnb-receipts', 'edit', 'chỉnh sửa phiếu nhập kho')) return;

  try {
    if (typeof window.showLoading === 'function') window.showLoading('Đang tải phiếu nhập kho...');
    const res = await fetch(`/api/fnb/receipts?id=${encodeURIComponent(String(receiptId))}&no-cache=1`);
    const json = await res.json();
    if (!json.success || !json.data) throw new Error(json.error || 'Không tải được phiếu nhập kho');

    const list: any[] = window.gFnbReceiptsHistory || [];
    const header = (json.data.receipts || []).find((r: any) => String(r.id) === String(receiptId))
      || list.find((r: any) => String(r.id) === String(receiptId))
      || {};
    const lines: any[] = json.data.lines || [];

    _editReceiptData = {
      id: receiptId,
      receipt_code: header.receipt_code || `#${receiptId}`,
      site_code: header.site_code || getActiveFnbReceiptSite(),
      lines: lines.map((l: any) => ({
        item_code: l.item_code,
        item_name: l.item_name || l.item_code,
        unit: l.unit || 'Phần',
        qty: Number(l.qty) || 0,
        unit_price: Number(l.unit_price) || 0,
        amount: Number(l.amount) || (Number(l.qty) || 0) * (Number(l.unit_price) || 0),
        batch_code: l.batch_code || '',
        exp_date: l.exp_date ? String(l.exp_date).slice(0, 10) : '',
        mfg_date: l.mfg_date ? String(l.mfg_date).slice(0, 10) : '',
        note: l.note || ''
      }))
    };

    const subEl = document.getElementById('editReceiptSubtitle');
    const dateEl = document.getElementById('editReceiptDate') as HTMLInputElement | null;
    const supEl = document.getElementById('editReceiptSupplier') as HTMLInputElement | null;
    const poEl = document.getElementById('editReceiptInvoiceNo') as HTMLInputElement | null;
    const notesEl = document.getElementById('editReceiptNotes') as HTMLInputElement | null;

    if (subEl) subEl.textContent = `${_editReceiptData.receipt_code} • ${_editReceiptData.site_code}`;
    if (dateEl) dateEl.value = header.receipt_date ? formatReceiptDateYMD(header.receipt_date) : new Date().toISOString().slice(0, 10);
    if (supEl) supEl.value = header.supplier || 'Bếp Trung Tâm Siba';
    if (poEl) poEl.value = header.invoice_no || '';
    if (notesEl) notesEl.value = header.notes || '';

    renderEditReceiptLines();
    document.getElementById('modalEditFnbReceipt')?.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  } catch (e: any) {
    if (typeof window.showToast === 'function') window.showToast('Lỗi tải phiếu nhập: ' + e.message, 'error');
  } finally {
    if (typeof window.hideLoading === 'function') window.hideLoading();
  }
}

function renderEditReceiptLines(): void {
  const tbody = document.getElementById('editReceiptLinesBody');
  const totalEl = document.getElementById('editReceiptTotalAmount');
  if (!_editReceiptData) return;

  let totalAmount = 0;
  _editReceiptData.lines.forEach(l => {
    l.amount = Math.max(0, Number(l.qty) || 0) * Math.max(0, Number(l.unit_price) || 0);
    totalAmount += l.amount;
  });
  if (totalEl) totalEl.textContent = `${Math.round(totalAmount).toLocaleString('vi-VN')} ₫`;

  if (!tbody) return;
  if (!_editReceiptData.lines.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-gray-400 text-xs">Không có mặt hàng nào</td></tr>`;
    return;
  }

  tbody.innerHTML = _editReceiptData.lines.map((l, idx) => `
    <tr>
      <td class="p-2.5">
        <div class="font-bold text-gray-900 dark:text-white">${escapeHtml(l.item_name)}</div>
        <div class="text-[11px] font-mono text-gray-400">${escapeHtml(l.item_code)} • ${escapeHtml(l.unit)}</div>
      </td>
      <td class="p-2.5 text-center">
        <input type="number" step="0.01" min="0" value="${l.qty}" onchange="onEditReceiptLineQtyChange(${idx}, this.value)" class="w-20 px-2 py-1 text-center font-mono font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
      </td>
      <td class="p-2.5 text-center">
        <input type="number" step="100" min="0" value="${l.unit_price}" onchange="onEditReceiptLinePriceChange(${idx}, this.value)" class="w-24 px-2 py-1 text-right font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
      </td>
      <td class="p-2.5">
        <input type="text" value="${escapeHtml(l.batch_code)}" onchange="onEditReceiptLineBatchChange(${idx}, this.value)" placeholder="Mã lô..." class="w-24 px-2 py-1 font-mono rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs">
      </td>
      <td class="p-2.5">
        <input type="date" value="${escapeHtml(l.exp_date)}" onchange="onEditReceiptLineExpChange(${idx}, this.value)" class="w-32 px-2 py-1 font-mono rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs">
      </td>
      <td class="p-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">${Math.round(l.amount).toLocaleString('vi-VN')} ₫</td>
      <td class="p-2.5 text-center">
        <button type="button" onclick="removeEditReceiptLine(${idx})" class="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40" title="Bỏ dòng">
          <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>
      </td>
    </tr>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

export function onEditReceiptLineQtyChange(idx: number, val: string): void {
  if (!_editReceiptData || !_editReceiptData.lines[idx]) return;
  _editReceiptData.lines[idx].qty = Math.max(0, Number(val) || 0);
  renderEditReceiptLines();
}

export function onEditReceiptLinePriceChange(idx: number, val: string): void {
  if (!_editReceiptData || !_editReceiptData.lines[idx]) return;
  _editReceiptData.lines[idx].unit_price = Math.max(0, Number(val) || 0);
  renderEditReceiptLines();
}

export function onEditReceiptLineBatchChange(idx: number, val: string): void {
  if (!_editReceiptData || !_editReceiptData.lines[idx]) return;
  _editReceiptData.lines[idx].batch_code = val;
}

export function onEditReceiptLineExpChange(idx: number, val: string): void {
  if (!_editReceiptData || !_editReceiptData.lines[idx]) return;
  _editReceiptData.lines[idx].exp_date = val;
}

export function removeEditReceiptLine(idx: number): void {
  if (!_editReceiptData) return;
  if (_editReceiptData.lines.length <= 1) {
    if (typeof window.showToast === 'function') window.showToast('Phiếu nhập phải có ít nhất 1 mặt hàng. Nếu muốn hủy toàn bộ, hãy dùng nút Xóa!', 'warning');
    return;
  }
  _editReceiptData.lines.splice(idx, 1);
  renderEditReceiptLines();
}

export function closeEditReceiptModal(): void {
  _editReceiptData = null;
  document.getElementById('modalEditFnbReceipt')?.classList.add('hidden');
}

export async function saveEditReceipt(): Promise<void> {
  if (!assertPermission('fnb-receipts', 'edit', 'chỉnh sửa phiếu nhập kho')) return;
  if (!_editReceiptData) return;

  const validLines = _editReceiptData.lines.filter(l => (Number(l.qty) || 0) > 0);
  if (!validLines.length) {
    if (typeof window.showToast === 'function') window.showToast('Vui lòng giữ ít nhất 1 mặt hàng có số lượng > 0!', 'warning');
    return;
  }

  const receiptDate = (document.getElementById('editReceiptDate') as HTMLInputElement | null)?.value || '';
  const supplier = (document.getElementById('editReceiptSupplier') as HTMLInputElement | null)?.value?.trim() || 'Bếp Trung Tâm Siba';
  const invoiceNo = (document.getElementById('editReceiptInvoiceNo') as HTMLInputElement | null)?.value?.trim() || '';
  const notes = (document.getElementById('editReceiptNotes') as HTMLInputElement | null)?.value?.trim() || '';

  const btn = document.getElementById('btnSaveEditReceipt') as HTMLButtonElement | null;
  if (btn) btn.disabled = true;

  try {
    if (typeof window.showLoading === 'function') window.showLoading('Đang lưu thay đổi phiếu nhập & đồng bộ tồn kho...');
    const res = await fetch('/api/fnb/receipts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: _editReceiptData.id,
        receipt_date: receiptDate,
        supplier,
        invoice_no: invoiceNo,
        notes,
        lines: validLines
      })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Cập nhật thất bại');

    const siteCode = _editReceiptData.site_code;
    if (typeof window.showToast === 'function') window.showToast(json.message || 'Đã cập nhật phiếu nhập kho!', 'success');
    closeEditReceiptModal();
    await loadFnbReceiptsHistory(siteCode);
    if (typeof window.loadFnbPoList === 'function') window.loadFnbPoList();
    if (typeof window.loadStockFEFO === 'function') window.loadStockFEFO();
    if (typeof window.loadWhInventory === 'function') window.loadWhInventory();
  } catch (e: any) {
    if (typeof window.showToast === 'function') window.showToast('Lỗi cập nhật: ' + e.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
    if (typeof window.hideLoading === 'function') window.hideLoading();
  }
}

export function confirmDeleteReceipt(receiptId: number | string, receiptCode: string): void {
  if (!assertPermission('fnb-receipts', 'delete', 'xóa phiếu nhập kho')) return;
  _pendingDeleteReceipt = { id: receiptId, code: receiptCode || `#${receiptId}` };
  const codeEl = document.getElementById('confirmDeleteReceiptCode');
  if (codeEl) codeEl.textContent = _pendingDeleteReceipt.code;
  document.getElementById('modalConfirmDeleteFnbReceipt')?.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

export function closeDeleteReceiptModal(): void {
  _pendingDeleteReceipt = null;
  document.getElementById('modalConfirmDeleteFnbReceipt')?.classList.add('hidden');
}

export async function executeDeleteReceipt(): Promise<void> {
  if (!assertPermission('fnb-receipts', 'delete', 'xóa phiếu nhập kho')) return;
  if (!_pendingDeleteReceipt) return;

  const { id } = _pendingDeleteReceipt;
  const btn = document.getElementById('btnExecuteDeleteReceipt') as HTMLButtonElement | null;
  if (btn) btn.disabled = true;

  try {
    if (typeof window.showLoading === 'function') window.showLoading('Đang xóa phiếu nhập & hoàn tác tồn kho...');
    const res = await fetch(`/api/fnb/receipts?id=${encodeURIComponent(String(id))}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xóa thất bại');

    if (typeof window.showToast === 'function') window.showToast(json.message || 'Đã xóa phiếu nhập kho!', 'success');
    closeDeleteReceiptModal();
    await loadFnbReceiptsHistory();
    if (typeof window.loadFnbPoList === 'function') window.loadFnbPoList();
    if (typeof window.loadStockFEFO === 'function') window.loadStockFEFO();
    if (typeof window.loadWhInventory === 'function') window.loadWhInventory();
  } catch (e: any) {
    if (typeof window.showToast === 'function') window.showToast('Lỗi xóa phiếu nhập: ' + e.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
    if (typeof window.hideLoading === 'function') window.hideLoading();
  }
}
