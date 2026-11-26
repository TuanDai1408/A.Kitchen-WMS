import { KitchenIssueSlip, KitchenIssueLine } from './types';
import { formatVND, formatNumber, getActiveKitchenIssueSite } from './helpers';
import { exportKitchenIssueExcel } from './export-excel';
import { loadKitchenStockForIssue } from './stock-table';
import { canUserEdit, canUserDelete, assertPermission } from '@/features/auth';
import { escapeHtml } from '@/ts/utils/formatters';

declare const showToast: (msg: string, type?: string) => void;
declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const lucide: any;

export let gKitchenIssueSlips: KitchenIssueSlip[] = [];

let _editKitchenIssueData: {
  id: string | number;
  issue_code: string;
  site_code: string;
  lines: KitchenIssueLine[];
} | null = null;

let _pendingDeleteKitchenIssue: { id: string | number; code: string } | null = null;

/**
 * Tải danh sách lịch sử các phiếu xuất kho sử dụng
 */
export async function loadKitchenIssueHistory(siteCode?: string): Promise<void> {
  const site = (siteCode || getActiveKitchenIssueSite()).toUpperCase();
  const tbody = document.getElementById('kitchenIssueHistoryBody');

  if (tbody) tbody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-gray-400 text-xs">Đang tải lịch sử phiếu xuất kho...</td></tr>`;

  try {
    const res = await fetch(`/api/fnb/kitchen-issues?site_code=${encodeURIComponent(site)}`);
    const json = await res.json();
    if (json.success && json.data) {
      gKitchenIssueSlips = json.data.issues || [];
    } else {
      gKitchenIssueSlips = [];
    }

    renderKitchenIssueHistoryTable();
  } catch (err: any) {
    console.error('loadKitchenIssueHistory error:', err);
    if (tbody) tbody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-rose-500 text-xs">Lỗi tải lịch sử phiếu xuất!</td></tr>`;
  }
}

/**
 * Hiển thị bảng lịch sử phiếu xuất kho
 */
export function renderKitchenIssueHistoryTable(): void {
  const tbody = document.getElementById('kitchenIssueHistoryBody');
  const mobileContainer = document.getElementById('kitchenIssueHistoryMobile');
  if (!tbody && !mobileContainer) return;

  const searchInput = (document.getElementById('kitchenHistorySearch') as HTMLInputElement | null)?.value?.toLowerCase().trim() || '';
  const canEdit = canUserEdit('fnb-kitchen-issue');
  const canDelete = canUserDelete('fnb-kitchen-issue');

  const filtered = gKitchenIssueSlips.filter(slip => {
    return !searchInput ||
      slip.issue_code.toLowerCase().includes(searchInput) ||
      (slip.meal_shift && slip.meal_shift.toLowerCase().includes(searchInput)) ||
      (slip.issuer_name && slip.issuer_name.toLowerCase().includes(searchInput));
  });

  // Desktop Table
  if (tbody) {
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-gray-400 text-xs">Chưa có phiếu xuất kho nào trong kỳ</td></tr>`;
    } else {
      tbody.innerHTML = filtered.map((slip, idx) => {
        return `
          <tr class="hover:bg-gray-50/80 dark:hover:bg-white/3 transition-colors">
            <td class="p-3 text-center text-xs font-mono font-medium text-gray-500">${idx + 1}</td>
            <td class="p-3 font-mono font-bold text-xs">
              <a href="javascript:void(0)" onclick="viewKitchenIssueDetail('${slip.id}')" class="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1.5">
                <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
                <span>${escapeHtml(slip.issue_code)}</span>
              </a>
            </td>
            <td class="p-3 text-center font-mono text-xs text-gray-600 dark:text-gray-300">${escapeHtml(slip.issue_date)}</td>
            <td class="p-3">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                ${escapeHtml(slip.meal_shift || 'Nấu ăn ca')}
              </span>
            </td>
            <td class="p-3 text-xs text-gray-600 dark:text-gray-300">
              <div class="font-bold text-gray-900 dark:text-white">${escapeHtml(slip.issuer_name || 'Bếp trưởng')}</div>
              <div class="text-[11px] text-gray-400">Nhận: ${escapeHtml(slip.receiver_name || 'Ca trưởng')}</div>
            </td>
            <td class="p-3 text-center font-mono font-bold text-xs text-gray-800 dark:text-gray-200">
              ${slip.total_items || 0} món • ${formatNumber(slip.total_qty || 0)}
            </td>
            <td class="p-3 text-right font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
              ${formatVND(slip.total_amount || 0)}
            </td>
            <td class="p-3 text-center whitespace-nowrap">
              <div class="inline-flex items-center gap-1">
                <button onclick="viewKitchenIssueDetail('${slip.id}')" class="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors" title="Xem chi tiết phiếu">
                  <i data-lucide="eye" class="w-4 h-4 text-brand-600"></i>
                </button>
                <button onclick="exportKitchenIssueById('${slip.id}')" class="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 transition-colors" title="Xuất file Excel (Aptos)">
                  <i data-lucide="file-spreadsheet" class="w-4 h-4 text-emerald-600"></i>
                </button>
                ${canEdit ? `
                  <button onclick="openEditKitchenIssueModal('${slip.id}')" class="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-600 dark:text-blue-400 transition-colors" title="Sửa phiếu xuất kho">
                    <i data-lucide="edit-3" class="w-4 h-4"></i>
                  </button>
                ` : ''}
                ${canDelete ? `
                  <button onclick="confirmDeleteKitchenIssue('${slip.id}', '${escapeHtml(slip.issue_code)}')" class="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 transition-colors" title="Hủy phiếu xuất kho">
                    <i data-lucide="x-circle" class="w-4 h-4"></i>
                  </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Mobile Cards
  if (mobileContainer) {
    if (filtered.length === 0) {
      mobileContainer.innerHTML = `<div class="p-6 text-center text-gray-400 text-xs">Chưa có phiếu xuất kho nào</div>`;
    } else {
      mobileContainer.innerHTML = filtered.map(slip => {
        return `
          <div class="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="font-mono font-bold text-xs text-brand-600 dark:text-brand-400">${escapeHtml(slip.issue_code)}</span>
              <span class="text-[11px] font-mono text-gray-400">${escapeHtml(slip.issue_date)}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-gray-700 dark:text-gray-300">${escapeHtml(slip.meal_shift)}</span>
              <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">${formatVND(slip.total_amount)}</span>
            </div>
            <div class="text-[11px] text-gray-500 flex items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex-wrap">
              <span>${slip.total_items} mặt hàng • ${formatNumber(slip.total_qty)}</span>
              <div class="flex items-center gap-1.5 flex-wrap">
                <button onclick="viewKitchenIssueDetail('${slip.id}')" class="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 font-bold text-xs">Xem</button>
                <button onclick="exportKitchenIssueById('${slip.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">Excel</button>
                ${canEdit ? `
                  <button onclick="openEditKitchenIssueModal('${slip.id}')" class="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs">Sửa</button>
                ` : ''}
                ${canDelete ? `
                  <button onclick="confirmDeleteKitchenIssue('${slip.id}', '${escapeHtml(slip.issue_code)}')" class="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs">Hủy phiếu</button>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

/**
 * Xuất Excel từ ID phiếu xuất trong lịch sử
 */
export async function exportKitchenIssueById(issueId: string): Promise<void> {
  if (typeof showLoading === 'function') showLoading('Đang lấy chi tiết phiếu xuất để xuất Excel...');
  try {
    const res = await fetch(`/api/fnb/kitchen-issues?id=${encodeURIComponent(issueId)}`);
    const json = await res.json();
    if (!json.success || !json.data || !json.data.issue) {
      throw new Error(json.error || 'Không tải được chi tiết phiếu');
    }
    const fullIssue: KitchenIssueSlip = {
      ...json.data.issue,
      lines: json.data.lines || []
    };
    exportKitchenIssueExcel(fullIssue);
  } catch (err: any) {
    console.error('exportKitchenIssueById error:', err);
    if (typeof showToast === 'function') showToast('Lỗi xuất Excel: ' + err.message, 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

/**
 * Mở modal chỉnh sửa phiếu xuất kho sử dụng
 */
export async function openEditKitchenIssueModal(issueId: string | number): Promise<void> {
  if (!assertPermission('fnb-kitchen-issue', 'edit', 'chỉnh sửa phiếu xuất kho sử dụng')) return;

  if (typeof showLoading === 'function') showLoading('Đang tải phiếu xuất kho để chỉnh sửa...');
  try {
    const res = await fetch(`/api/fnb/kitchen-issues?id=${encodeURIComponent(String(issueId))}`);
    const json = await res.json();
    if (!json.success || !json.data || !json.data.issue) {
      throw new Error(json.error || 'Không tìm thấy phiếu xuất kho');
    }

    const issue = json.data.issue;
    const lines: any[] = json.data.lines || [];

    _editKitchenIssueData = {
      id: issue.id,
      issue_code: issue.issue_code || `#${issue.id}`,
      site_code: issue.site_code || getActiveKitchenIssueSite(),
      lines: lines.map((l: any) => ({
        item_code: l.item_code,
        item_name: l.item_name || l.item_code,
        unit: l.unit || 'Phần',
        stock_before: Number(l.stock_before) || 0,
        qty: Number(l.qty) || 0,
        unit_price: Number(l.unit_price) || 0,
        amount: Number(l.amount) || (Number(l.qty) || 0) * (Number(l.unit_price) || 0),
        notes: l.notes || ''
      }))
    };

    const subEl = document.getElementById('editKitchenIssueSubtitle');
    const dateEl = document.getElementById('editKitchenIssueDate') as HTMLInputElement | null;
    const shiftEl = document.getElementById('editKitchenIssueShift') as HTMLSelectElement | null;
    const issuerEl = document.getElementById('editKitchenIssueIssuer') as HTMLInputElement | null;
    const receiverEl = document.getElementById('editKitchenIssueReceiver') as HTMLInputElement | null;
    const notesEl = document.getElementById('editKitchenIssueNotes') as HTMLInputElement | null;

    if (subEl) subEl.textContent = `${_editKitchenIssueData.issue_code} • ${_editKitchenIssueData.site_code}`;
    if (dateEl) dateEl.value = issue.issue_date ? String(issue.issue_date).slice(0, 10) : new Date().toISOString().slice(0, 10);
    if (shiftEl) {
      const shiftVal = issue.meal_shift || 'Nấu ăn ca trưa';
      const hasOption = Array.from(shiftEl.options).some(o => o.value === shiftVal);
      if (!hasOption) {
        const opt = document.createElement('option');
        opt.value = shiftVal;
        opt.textContent = shiftVal;
        shiftEl.appendChild(opt);
      }
      shiftEl.value = shiftVal;
    }
    if (issuerEl) issuerEl.value = issue.issuer_name || '';
    if (receiverEl) receiverEl.value = issue.receiver_name || '';
    if (notesEl) notesEl.value = issue.notes || '';

    renderEditKitchenIssueLines();
    document.getElementById('modalEditKitchenIssue')?.classList.remove('hidden');
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  } catch (err: any) {
    console.error('openEditKitchenIssueModal error:', err);
    if (typeof showToast === 'function') showToast('Lỗi tải phiếu xuất: ' + err.message, 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

function renderEditKitchenIssueLines(): void {
  const tbody = document.getElementById('editKitchenIssueLinesBody');
  const totalQtyEl = document.getElementById('editKitchenIssueTotalQty');
  const totalAmtEl = document.getElementById('editKitchenIssueTotalAmount');
  if (!_editKitchenIssueData) return;

  let totalQty = 0;
  let totalAmount = 0;
  _editKitchenIssueData.lines.forEach(l => {
    const q = Math.max(0, Number(l.qty) || 0);
    const p = Number(l.unit_price) || 0;
    l.amount = q * p;
    totalQty += q;
    totalAmount += l.amount;
  });

  if (totalQtyEl) totalQtyEl.textContent = formatNumber(totalQty);
  if (totalAmtEl) totalAmtEl.textContent = formatVND(totalAmount);

  if (!tbody) return;
  if (_editKitchenIssueData.lines.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-gray-400 text-xs">Không có mặt hàng nào</td></tr>`;
    return;
  }

  tbody.innerHTML = _editKitchenIssueData.lines.map((l, idx) => `
    <tr>
      <td class="p-2.5">
        <div class="font-bold text-gray-900 dark:text-white">${escapeHtml(l.item_name)}</div>
        <div class="text-[11px] font-mono text-gray-400">${escapeHtml(l.item_code)} • ${escapeHtml(l.unit)}</div>
      </td>
      <td class="p-2.5 text-center">
        <input type="number" step="0.01" min="0" value="${l.qty}" onchange="onEditKitchenIssueQtyChange(${idx}, this.value)" class="w-24 px-2 py-1 text-center font-mono font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
      </td>
      <td class="p-2.5 text-right font-mono text-gray-500">${formatVND(l.unit_price)}</td>
      <td class="p-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">${formatVND(l.amount)}</td>
      <td class="p-2.5">
        <input type="text" value="${escapeHtml(l.notes || '')}" onchange="onEditKitchenIssueNoteChange(${idx}, this.value)" placeholder="Ghi chú..." class="w-full px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs">
      </td>
      <td class="p-2.5 text-center">
        <button type="button" onclick="removeEditKitchenIssueLine(${idx})" class="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40" title="Bỏ dòng này">
          <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>
      </td>
    </tr>
  `).join('');

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function onEditKitchenIssueQtyChange(idx: number, val: string): void {
  if (!_editKitchenIssueData || !_editKitchenIssueData.lines[idx]) return;
  _editKitchenIssueData.lines[idx].qty = Math.max(0, Number(val) || 0);
  renderEditKitchenIssueLines();
}

export function onEditKitchenIssueNoteChange(idx: number, val: string): void {
  if (!_editKitchenIssueData || !_editKitchenIssueData.lines[idx]) return;
  _editKitchenIssueData.lines[idx].notes = val;
}

export function removeEditKitchenIssueLine(idx: number): void {
  if (!_editKitchenIssueData) return;
  if (_editKitchenIssueData.lines.length <= 1) {
    if (typeof showToast === 'function') showToast('Phiếu phải có ít nhất 1 mặt hàng. Nếu muốn hủy toàn bộ, hãy dùng nút Xóa phiếu!', 'warning');
    return;
  }
  _editKitchenIssueData.lines.splice(idx, 1);
  renderEditKitchenIssueLines();
}

export function closeEditKitchenIssueModal(): void {
  _editKitchenIssueData = null;
  document.getElementById('modalEditKitchenIssue')?.classList.add('hidden');
}

export async function saveEditKitchenIssue(): Promise<void> {
  if (!assertPermission('fnb-kitchen-issue', 'edit', 'chỉnh sửa phiếu xuất kho sử dụng')) return;
  if (!_editKitchenIssueData) return;

  const validLines = _editKitchenIssueData.lines.filter(l => (Number(l.qty) || 0) > 0);
  if (validLines.length === 0) {
    if (typeof showToast === 'function') showToast('Vui lòng giữ ít nhất 1 mặt hàng có số lượng > 0!', 'warning');
    return;
  }

  const issueDate = (document.getElementById('editKitchenIssueDate') as HTMLInputElement | null)?.value || '';
  const mealShift = (document.getElementById('editKitchenIssueShift') as HTMLSelectElement | null)?.value || 'Nấu ăn ca trưa';
  const issuerName = (document.getElementById('editKitchenIssueIssuer') as HTMLInputElement | null)?.value?.trim() || 'Bếp trưởng';
  const receiverName = (document.getElementById('editKitchenIssueReceiver') as HTMLInputElement | null)?.value?.trim() || 'Ca trưởng bếp';
  const notes = (document.getElementById('editKitchenIssueNotes') as HTMLInputElement | null)?.value?.trim() || '';

  const btn = document.getElementById('btnSaveEditKitchenIssue') as HTMLButtonElement | null;
  if (btn) btn.disabled = true;

  try {
    if (typeof showLoading === 'function') showLoading('Đang cập nhật phiếu xuất & đồng bộ tồn kho...');
    const res = await fetch('/api/fnb/kitchen-issues', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: _editKitchenIssueData.id,
        issue_date: issueDate,
        meal_shift: mealShift,
        issuer_name: issuerName,
        receiver_name: receiverName,
        notes,
        lines: validLines
      })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Cập nhật thất bại');

    const siteCode = _editKitchenIssueData.site_code;
    if (typeof showToast === 'function') showToast(json.message || 'Đã cập nhật phiếu xuất kho!', 'success');
    closeEditKitchenIssueModal();
    await loadKitchenIssueHistory(siteCode);
    await loadKitchenStockForIssue(siteCode);
    const w = typeof window !== 'undefined' ? (window as any) : {};
    if (typeof w.loadStockFEFO === 'function') w.loadStockFEFO();
    if (typeof w.loadWhInventory === 'function') w.loadWhInventory();
  } catch (err: any) {
    console.error('saveEditKitchenIssue error:', err);
    if (typeof showToast === 'function') showToast('Lỗi cập nhật: ' + err.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export function confirmDeleteKitchenIssue(issueId: string | number, issueCode: string): void {
  if (!assertPermission('fnb-kitchen-issue', 'delete', 'hủy phiếu xuất kho sử dụng')) return;
  _pendingDeleteKitchenIssue = { id: issueId, code: issueCode || `#${issueId}` };
  const codeEl = document.getElementById('confirmDeleteKitchenIssueCode');
  if (codeEl) codeEl.textContent = _pendingDeleteKitchenIssue.code;
  document.getElementById('modalConfirmDeleteKitchenIssue')?.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function closeDeleteKitchenIssueModal(): void {
  _pendingDeleteKitchenIssue = null;
  document.getElementById('modalConfirmDeleteKitchenIssue')?.classList.add('hidden');
}

export async function executeDeleteKitchenIssue(): Promise<void> {
  if (!assertPermission('fnb-kitchen-issue', 'delete', 'hủy phiếu xuất kho sử dụng')) return;
  if (!_pendingDeleteKitchenIssue) return;

  const { id } = _pendingDeleteKitchenIssue;
  const btn = document.getElementById('btnExecuteDeleteKitchenIssue') as HTMLButtonElement | null;
  if (btn) btn.disabled = true;

  try {
    if (typeof showLoading === 'function') showLoading('Đang hủy phiếu xuất & hoàn trả tồn kho...');
    const res = await fetch(`/api/fnb/kitchen-issues?id=${encodeURIComponent(String(id))}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Hủy phiếu thất bại');

    if (typeof showToast === 'function') showToast(json.message || 'Đã hủy phiếu xuất kho!', 'success');
    closeDeleteKitchenIssueModal();
    const siteCode = getActiveKitchenIssueSite();
    await loadKitchenIssueHistory(siteCode);
    await loadKitchenStockForIssue(siteCode);
    const w = typeof window !== 'undefined' ? (window as any) : {};
    if (typeof w.loadStockFEFO === 'function') w.loadStockFEFO();
    if (typeof w.loadWhInventory === 'function') w.loadWhInventory();
  } catch (err: any) {
    console.error('executeDeleteKitchenIssue error:', err);
    if (typeof showToast === 'function') showToast('Lỗi hủy phiếu: ' + err.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
    if (typeof hideLoading === 'function') hideLoading();
  }
}
