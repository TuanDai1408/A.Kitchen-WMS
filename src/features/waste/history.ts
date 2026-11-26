import { escapeHtml } from '@/ts/utils/formatters';
import { getActiveFnbWasteSite } from './helpers';
import type { WasteSubView } from './types';
import { canUserEdit, canUserDelete, assertPermission } from '@/features/auth';

declare const window: any;

let _editWasteData: {
  id: number | string;
  waste_code: string;
  site_code: string;
  lines: Array<{
    item_code: string;
    item_name: string;
    unit: string;
    qty: number;
    unit_price: number;
    amount: number;
    reason_detail: string;
  }>;
} | null = null;

let _pendingDeleteWaste: { id: number | string; code: string } | null = null;

export function switchFnbWasteSubView(view: WasteSubView): void {
  const btnStock = document.getElementById('subtab-fnb-waste-stock');
  const btnHistory = document.getElementById('subtab-fnb-waste-history');
  const secStock = document.getElementById('fnbWasteSubViewStock');
  const secHistory = document.getElementById('fnbWasteSubViewHistory');

  if (view === 'history') {
    if (btnStock) {
      btnStock.className = 'btn btn-secondary btn-sm';
    }
    if (btnHistory) {
      btnHistory.className = 'btn btn-primary btn-sm';
    }
    if (secStock) secStock.classList.add('hidden');
    if (secHistory) secHistory.classList.remove('hidden');
  } else {
    if (btnStock) {
      btnStock.className = 'btn btn-primary btn-sm';
    }
    if (btnHistory) {
      btnHistory.className = 'btn btn-secondary btn-sm';
    }
    if (secStock) secStock.classList.remove('hidden');
    if (secHistory) secHistory.classList.add('hidden');
  }
  if (window.lucide) window.lucide.createIcons();
}

export async function loadFnbWasteHistory(siteCodeArg?: string): Promise<void> {
  const siteCode = siteCodeArg || getActiveFnbWasteSite();
  const tbody = document.getElementById('fnbWasteTableBody');
  const mob = document.getElementById('fnbWasteMobileCards');
  const bHist = document.getElementById('fnbWasteBadgeHistoryCount');

  try {
    const res = await fetch(`/api/fnb/wastes?site_code=${encodeURIComponent(siteCode)}&no-cache=1`);
    const json = await res.json();
    if (json.success && json.data) {
      const wastes: any[] = json.data.wastes || [];
      window.gFnbWasteHistoryList = wastes;
      if (bHist) bHist.textContent = String(wastes.length);
      const canEdit = canUserEdit('fnb-waste');
      const canDelete = canUserDelete('fnb-waste');

      if (tbody) {
        if (!wastes.length) {
          tbody.innerHTML = `<tr><td colspan="8" class="text-center py-10 text-gray-400">Chưa có biên bản hủy hàng nào cho điểm bán ${escapeHtml(siteCode)}.</td></tr>`;
        } else {
          tbody.innerHTML = wastes.map(w => `
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${escapeHtml(w.waste_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${escapeHtml(w.site_code)}</td>
              <td class="py-3 px-3 tabular-nums text-gray-600 dark:text-gray-300 text-xs">${escapeHtml(String(w.waste_date || '').slice(0, 10))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${escapeHtml(w.reason || 'Hàng hỏng')}</td>
              <td class="py-3 px-3 text-gray-600 dark:text-gray-300 text-xs">${escapeHtml(w.confirmed_by || 'Bếp trưởng')}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">${Math.round(w.total_amount || 0).toLocaleString('vi-VN')} ₫</td>
              <td class="py-3 px-4 text-gray-500 text-xs">${escapeHtml(w.notes || '—')}</td>
              <td class="py-3 px-3 text-center whitespace-nowrap">
                <div class="inline-flex items-center gap-1 justify-center">
                  <button type="button" onclick="viewWasteDetail(${w.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors" title="Xem chi tiết">
                    <i data-lucide="eye" class="w-4 h-4"></i>
                  </button>
                  ${canEdit ? `
                    <button type="button" onclick="openEditWasteModal(${w.id})" class="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 transition-colors" title="Sửa biên bản hủy">
                      <i data-lucide="edit-3" class="w-4 h-4"></i>
                    </button>
                  ` : ''}
                  ${canDelete ? `
                    <button type="button" onclick="confirmDeleteWaste(${w.id}, '${escapeHtml(w.waste_code)}')" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 transition-colors" title="Hủy phiếu">
                      <i data-lucide="x-circle" class="w-4 h-4"></i>
                    </button>
                  ` : ''}
                </div>
              </td>
            </tr>
          `).join('');
        }
      }

      if (mob) {
        if (!wastes.length) {
          mob.innerHTML = `<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Chưa có biên bản hủy hàng nào.</div>`;
        } else {
          mob.innerHTML = wastes.map(w => `
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${escapeHtml(w.waste_code)}</span>
                  <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${escapeHtml(w.reason || 'Hàng hỏng')}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ngày: ${escapeHtml(String(w.waste_date || '').slice(0, 10))} • Điểm: ${escapeHtml(w.site_code)}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-rose-600 dark:text-rose-400 tabular-nums font-mono block">${Math.round(w.total_amount || 0).toLocaleString('vi-VN')} ₫</span>
                  <span class="text-xs text-gray-400">${escapeHtml(w.confirmed_by || 'Bếp trưởng')}</span>
                </div>
              </div>
              <div class="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-800 flex-wrap">
                <button type="button" onclick="viewWasteDetail(${w.id})" class="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold text-xs">Xem</button>
                ${canEdit ? `
                  <button type="button" onclick="openEditWasteModal(${w.id})" class="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs">Sửa</button>
                ` : ''}
                ${canDelete ? `
                  <button type="button" onclick="confirmDeleteWaste(${w.id}, '${escapeHtml(w.waste_code)}')" class="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs">Hủy phiếu</button>
                ` : ''}
              </div>
            </div>
          `).join('');
        }
      }

      if (window.lucide) window.lucide.createIcons();
    }
  } catch (err) {
    console.error('loadFnbWasteHistory error:', err);
  }
}

export async function viewWasteDetail(wasteId: number | string): Promise<void> {
  try {
    if (typeof window.showLoading === 'function') window.showLoading('Đang tải chi tiết biên bản...');
    const res = await fetch(`/api/fnb/wastes?id=${wasteId}`);
    const json = await res.json();
    if (!json.success) throw new Error('Không tải được biên bản hủy');

    const lines: any[] = json.data.lines || [];
    const modal = document.getElementById('invDetailModal');
    const titleEl = document.getElementById('invDetailModalTitle');
    const subEl = document.getElementById('invDetailModalSub');
    if (titleEl) titleEl.textContent = `Chi Tiết Biên Bản Hủy #${wasteId}`;
    if (subEl) subEl.textContent = `${lines.length} mặt hàng bị hủy`;

    const html = `
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="py-2 px-3">Mặt Hàng</th>
              <th class="py-2 px-2 text-center">ĐVT</th>
              <th class="py-2 px-3 text-right">SL Hủy</th>
              <th class="py-2 px-3 text-right">Đơn Giá</th>
              <th class="py-2 px-3 text-right">Thành Tiền</th>
              <th class="py-2 px-3">Lý Do Chi Tiết</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
            ${lines.map(l => `
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">
                  <div>${escapeHtml(l.item_name || l.item_code)}</div>
                  <div class="text-xs text-gray-400 font-mono">${escapeHtml(l.item_code)}</div>
                </td>
                <td class="py-2 px-2 text-center text-gray-500">${escapeHtml(l.unit || '')}</td>
                <td class="py-2 px-3 text-right font-bold text-rose-600 font-mono">${Number(l.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(l.unit_price).toLocaleString('vi-VN')} ₫</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(l.amount).toLocaleString('vi-VN')} ₫</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${escapeHtml(l.reason_detail || '--')}</td>
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

export async function openEditWasteModal(wasteId: number | string): Promise<void> {
  if (!assertPermission('fnb-waste', 'edit', 'chỉnh sửa biên bản hủy hàng')) return;

  try {
    if (typeof window.showLoading === 'function') window.showLoading('Đang tải biên bản hủy hàng...');
    const res = await fetch(`/api/fnb/wastes?id=${encodeURIComponent(String(wasteId))}&no-cache=1`);
    const json = await res.json();
    if (!json.success || !json.data) throw new Error(json.error || 'Không tải được biên bản hủy');

    const list: any[] = window.gFnbWasteHistoryList || [];
    const header = (json.data.wastes || []).find((w: any) => String(w.id) === String(wasteId))
      || list.find((w: any) => String(w.id) === String(wasteId))
      || {};
    const lines: any[] = json.data.lines || [];

    _editWasteData = {
      id: wasteId,
      waste_code: header.waste_code || `#${wasteId}`,
      site_code: header.site_code || getActiveFnbWasteSite(),
      lines: lines.map((l: any) => ({
        item_code: l.item_code,
        item_name: l.item_name || l.item_code,
        unit: l.unit || 'Phần',
        qty: Number(l.qty) || 0,
        unit_price: Number(l.unit_price) || 0,
        amount: Number(l.amount) || (Number(l.qty) || 0) * (Number(l.unit_price) || 0),
        reason_detail: l.reason_detail || header.reason || ''
      }))
    };

    const subEl = document.getElementById('editWasteSubtitle');
    const dateEl = document.getElementById('editWasteDate') as HTMLInputElement | null;
    const reasonEl = document.getElementById('editWasteReason') as HTMLInputElement | null;
    const confirmedEl = document.getElementById('editWasteConfirmedBy') as HTMLInputElement | null;
    const notesEl = document.getElementById('editWasteNotes') as HTMLInputElement | null;

    if (subEl) subEl.textContent = `${_editWasteData.waste_code} • ${_editWasteData.site_code}`;
    if (dateEl) dateEl.value = header.waste_date ? String(header.waste_date).slice(0, 10) : new Date().toISOString().slice(0, 10);
    if (reasonEl) reasonEl.value = header.reason || 'Hàng hỏng / ôi thiu không đạt chuẩn';
    if (confirmedEl) confirmedEl.value = header.confirmed_by || 'Bếp trưởng';
    if (notesEl) notesEl.value = header.notes || '';

    renderEditWasteLines();
    document.getElementById('modalEditFnbWaste')?.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  } catch (e: any) {
    if (typeof window.showToast === 'function') window.showToast('Lỗi tải biên bản: ' + e.message, 'error');
  } finally {
    if (typeof window.hideLoading === 'function') window.hideLoading();
  }
}

function renderEditWasteLines(): void {
  const tbody = document.getElementById('editWasteLinesBody');
  const totalEl = document.getElementById('editWasteTotalAmount');
  if (!_editWasteData) return;

  let totalAmount = 0;
  _editWasteData.lines.forEach(l => {
    l.amount = Math.max(0, Number(l.qty) || 0) * Math.max(0, Number(l.unit_price) || 0);
    totalAmount += l.amount;
  });
  if (totalEl) totalEl.textContent = `${Math.round(totalAmount).toLocaleString('vi-VN')} ₫`;

  if (!tbody) return;
  if (!_editWasteData.lines.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-gray-400 text-xs">Không có mặt hàng nào</td></tr>`;
    return;
  }

  tbody.innerHTML = _editWasteData.lines.map((l, idx) => `
    <tr>
      <td class="p-2.5">
        <div class="font-bold text-gray-900 dark:text-white">${escapeHtml(l.item_name)}</div>
        <div class="text-[11px] font-mono text-gray-400">${escapeHtml(l.item_code)} • ${escapeHtml(l.unit)}</div>
      </td>
      <td class="p-2.5 text-center">
        <input type="number" step="0.01" min="0" value="${l.qty}" onchange="onEditWasteLineQtyChange(${idx}, this.value)" class="w-24 px-2 py-1 text-center font-mono font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
      </td>
      <td class="p-2.5 text-right font-mono text-gray-500">${Math.round(l.unit_price).toLocaleString('vi-VN')} ₫</td>
      <td class="p-2.5 text-right font-mono font-bold text-rose-600 dark:text-rose-400">${Math.round(l.amount).toLocaleString('vi-VN')} ₫</td>
      <td class="p-2.5">
        <input type="text" value="${escapeHtml(l.reason_detail)}" onchange="onEditWasteLineReasonChange(${idx}, this.value)" placeholder="Lý do chi tiết..." class="w-full px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs">
      </td>
      <td class="p-2.5 text-center">
        <button type="button" onclick="removeEditWasteLine(${idx})" class="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40" title="Bỏ dòng">
          <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>
      </td>
    </tr>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

export function onEditWasteLineQtyChange(idx: number, val: string): void {
  if (!_editWasteData || !_editWasteData.lines[idx]) return;
  _editWasteData.lines[idx].qty = Math.max(0, Number(val) || 0);
  renderEditWasteLines();
}

export function onEditWasteLineReasonChange(idx: number, val: string): void {
  if (!_editWasteData || !_editWasteData.lines[idx]) return;
  _editWasteData.lines[idx].reason_detail = val;
}

export function removeEditWasteLine(idx: number): void {
  if (!_editWasteData) return;
  if (_editWasteData.lines.length <= 1) {
    if (typeof window.showToast === 'function') window.showToast('Biên bản phải có ít nhất 1 mặt hàng. Nếu muốn xóa toàn bộ, hãy dùng nút Xóa!', 'warning');
    return;
  }
  _editWasteData.lines.splice(idx, 1);
  renderEditWasteLines();
}

export function closeEditWasteModal(): void {
  _editWasteData = null;
  document.getElementById('modalEditFnbWaste')?.classList.add('hidden');
}

export async function saveEditWaste(): Promise<void> {
  if (!assertPermission('fnb-waste', 'edit', 'chỉnh sửa biên bản hủy hàng')) return;
  if (!_editWasteData) return;

  const validLines = _editWasteData.lines.filter(l => (Number(l.qty) || 0) > 0);
  if (!validLines.length) {
    if (typeof window.showToast === 'function') window.showToast('Vui lòng giữ ít nhất 1 mặt hàng có số lượng > 0!', 'warning');
    return;
  }

  const wasteDate = (document.getElementById('editWasteDate') as HTMLInputElement | null)?.value || '';
  const reason = (document.getElementById('editWasteReason') as HTMLInputElement | null)?.value?.trim() || 'Hàng hỏng / rách';
  const confirmedBy = (document.getElementById('editWasteConfirmedBy') as HTMLInputElement | null)?.value?.trim() || 'Bếp trưởng';
  const notes = (document.getElementById('editWasteNotes') as HTMLInputElement | null)?.value?.trim() || '';

  const btn = document.getElementById('btnSaveEditWaste') as HTMLButtonElement | null;
  if (btn) btn.disabled = true;

  try {
    if (typeof window.showLoading === 'function') window.showLoading('Đang cập nhật biên bản hủy & đồng bộ tồn kho...');
    const res = await fetch('/api/fnb/wastes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: _editWasteData.id,
        waste_date: wasteDate,
        reason,
        confirmed_by: confirmedBy,
        notes,
        lines: validLines
      })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Cập nhật thất bại');

    const siteCode = _editWasteData.site_code;
    if (typeof window.showToast === 'function') window.showToast(json.message || 'Đã cập nhật biên bản hủy!', 'success');
    closeEditWasteModal();
    await loadFnbWasteHistory(siteCode);
    if (typeof window.loadFnbWaste === 'function') window.loadFnbWaste();
    if (typeof window.loadStockFEFO === 'function') window.loadStockFEFO();
    if (typeof window.loadWhInventory === 'function') window.loadWhInventory();
  } catch (e: any) {
    if (typeof window.showToast === 'function') window.showToast('Lỗi cập nhật: ' + e.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
    if (typeof window.hideLoading === 'function') window.hideLoading();
  }
}

export function confirmDeleteWaste(wasteId: number | string, wasteCode: string): void {
  if (!assertPermission('fnb-waste', 'delete', 'hủy biên bản hủy hàng')) return;
  _pendingDeleteWaste = { id: wasteId, code: wasteCode || `#${wasteId}` };
  const codeEl = document.getElementById('confirmDeleteWasteCode');
  if (codeEl) codeEl.textContent = _pendingDeleteWaste.code;
  document.getElementById('modalConfirmDeleteFnbWaste')?.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

export function closeDeleteWasteModal(): void {
  _pendingDeleteWaste = null;
  document.getElementById('modalConfirmDeleteFnbWaste')?.classList.add('hidden');
}

export async function executeDeleteWaste(): Promise<void> {
  if (!assertPermission('fnb-waste', 'delete', 'hủy biên bản hủy hàng')) return;
  if (!_pendingDeleteWaste) return;

  const { id } = _pendingDeleteWaste;
  const btn = document.getElementById('btnExecuteDeleteWaste') as HTMLButtonElement | null;
  if (btn) btn.disabled = true;

  try {
    if (typeof window.showLoading === 'function') window.showLoading('Đang hủy phiếu & hoàn trả tồn kho...');
    const res = await fetch(`/api/fnb/wastes?id=${encodeURIComponent(String(id))}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Hủy phiếu thất bại');

    if (typeof window.showToast === 'function') window.showToast(json.message || 'Đã hủy phiếu thành công!', 'success');
    closeDeleteWasteModal();
    await loadFnbWasteHistory();
    if (typeof window.loadFnbWaste === 'function') window.loadFnbWaste();
    if (typeof window.loadStockFEFO === 'function') window.loadStockFEFO();
    if (typeof window.loadWhInventory === 'function') window.loadWhInventory();
  } catch (e: any) {
    if (typeof window.showToast === 'function') window.showToast('Lỗi hủy phiếu: ' + e.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
    if (typeof window.hideLoading === 'function') window.hideLoading();
  }
}
