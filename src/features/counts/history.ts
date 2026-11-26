import { escapeHtml } from '@/ts/utils/formatters';
import { getActiveFnbCountSite } from './helpers';
import { canUserEdit, canUserDelete, assertPermission } from '@/features/auth';

declare const window: any;

let _editCountData: {
  id: number | string;
  count_code: string;
  site_code: string;
  lines: Array<{
    item_code: string;
    item_name: string;
    unit: string;
    book_qty: number;
    count_qty: number;
    unit_price: number;
    note: string;
  }>;
} | null = null;

let _pendingDeleteCount: { id: number | string; code: string } | null = null;

export function renderCountsHistoryInto(
  counts: any[],
  siteCode: string,
  tbodyId: string,
  mobId: string
): void {
  const tbody = document.getElementById(tbodyId);
  const mob = document.getElementById(mobId);
  const canEdit = canUserEdit('fnb-counts') || canUserEdit('portal-kiemke');
  const canDelete = canUserDelete('fnb-counts') || canUserDelete('portal-kiemke');

  if (!counts.length) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="9" class="text-center py-6 text-gray-400">Chưa có phiếu kiểm kê nào cho điểm ${escapeHtml(siteCode)}.</td></tr>`;
    if (mob) mob.innerHTML = `<div class="card p-6 text-center text-gray-400 text-sm">Chưa có phiếu kiểm kê nào cho điểm ${escapeHtml(siteCode)}.</div>`;
    return;
  }

  if (tbody) {
    tbody.innerHTML = counts.map(c => {
      const diffVal = Number(c.total_diff_val ?? c.diff_value ?? 0);
      const countDateStr = c.count_date ? String(c.count_date).slice(0, 10) : '—';
      return `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
          <td class="py-2.5 px-3 tabular-nums font-bold text-blue-600 dark:text-blue-400 cursor-pointer font-mono" onclick="viewCountDetail(${c.id})">${escapeHtml(c.count_code)}</td>
          <td class="py-2.5 px-3 font-semibold">${escapeHtml(c.site_code)}</td>
          <td class="py-2.5 px-3 tabular-nums font-mono">${escapeHtml(countDateStr)}</td>
          <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded font-bold text-xs ${c.count_type === 'DAILY' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'}">${c.count_type === 'DAILY' ? 'Hằng Ngày' : 'Định Kỳ'}</span></td>
          <td class="py-2.5 px-3 text-right tabular-nums font-mono">${c.total_items || 0}</td>
          <td class="py-2.5 px-3 text-right tabular-nums font-mono ${Number(c.diff_items) > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600'}">${c.diff_items || 0}</td>
          <td class="py-2.5 px-3 text-right tabular-nums font-bold font-mono ${diffVal !== 0 ? 'text-rose-600' : 'text-emerald-600'}">${Math.round(diffVal).toLocaleString('vi-VN')} đ</td>
          <td class="py-2.5 px-3 text-gray-500 text-xs truncate max-w-[160px]">${escapeHtml(c.notes || '—')}</td>
          <td class="py-2.5 px-3 text-center whitespace-nowrap">
            <div class="inline-flex items-center gap-1 justify-center">
              <button type="button" onclick="viewCountDetail(${c.id})" class="btn btn-sm btn-ghost text-gray-600 hover:text-brand-600 dark:text-gray-300 px-2 py-1" title="Xem chi tiết">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
              </button>
              ${canEdit ? `
                <button type="button" onclick="openEditCountModal(${c.id})" class="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2 py-1" title="Sửa phiếu kiểm kê">
                  <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                </button>
              ` : ''}
              ${canDelete ? `
                <button type="button" onclick="confirmDeleteCount(${c.id}, '${escapeHtml(c.count_code)}')" class="btn btn-sm btn-ghost text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 px-2 py-1" title="Xóa phiếu kiểm kê">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (mob) {
    mob.innerHTML = counts.map(c => {
      const diffVal = Number(c.total_diff_val ?? c.diff_value ?? 0);
      const countDateStr = c.count_date ? String(c.count_date).slice(0, 10) : '—';
      return `
        <div class="data-card p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3 space-y-2.5">
          <div class="data-card-header flex items-center justify-between">
            <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs cursor-pointer" onclick="viewCountDetail(${c.id})">${escapeHtml(c.count_code)}</span>
            <span class="badge ${c.count_type === 'DAILY' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300' : 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300'} text-xs px-2 py-0.5 rounded-full font-bold">${c.count_type === 'DAILY' ? 'Hằng Ngày' : 'Định Kỳ'}</span>
          </div>
          <div class="data-card-body space-y-1.5">
            <div class="flex justify-between items-center text-xs">
              <span class="text-gray-400">Điểm bán: <b class="text-gray-700 dark:text-gray-200">${escapeHtml(c.site_code)}</b></span>
              <span class="num text-gray-500 font-mono">${escapeHtml(countDateStr)}</span>
            </div>
            <div class="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-gray-400 block text-[11px]">Tổng món</span>
                <span class="num font-semibold text-gray-900 dark:text-white font-mono">${c.total_items || 0}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-[11px]">Số lệch</span>
                <span class="num font-semibold font-mono ${Number(c.diff_items) > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600'}">${c.diff_items || 0}</span>
              </div>
              <div class="text-right">
                <span class="text-gray-400 block text-[11px]">Giá trị lệch</span>
                <span class="num font-semibold font-mono ${diffVal !== 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'}">${Math.round(diffVal).toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onclick="viewCountDetail(${c.id})" class="btn btn-secondary btn-sm flex-1 text-xs">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Xem
            </button>
            ${canEdit ? `
              <button type="button" onclick="openEditCountModal(${c.id})" class="btn btn-secondary btn-sm text-blue-600 text-xs">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Sửa
              </button>
            ` : ''}
            ${canDelete ? `
              <button type="button" onclick="confirmDeleteCount(${c.id}, '${escapeHtml(c.count_code)}')" class="btn btn-secondary btn-sm text-rose-600 text-xs">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Xóa
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  if (window.lucide) window.lucide.createIcons();
}

export async function loadFnbCountsHistory(siteCodeArg?: string): Promise<void> {
  const siteCode = siteCodeArg || getActiveFnbCountSite();
  try {
    const res = await fetch(`/api/fnb/counts?site_code=${encodeURIComponent(siteCode)}&no-cache=1`);
    const json = await res.json();
    if (json.success) {
      const counts: any[] = json.data.counts || [];
      window.gFnbCountsList = counts;
      renderCountsHistoryInto(counts, siteCode, 'fnbCountsHistoryBody', 'fnbCountsHistoryMobileCards');
    }
  } catch (e) {
    console.error('loadFnbCountsHistory error:', e);
  }
}

export async function viewCountDetail(countId: number | string): Promise<void> {
  try {
    if (typeof window.showLoading === 'function') window.showLoading();
    const res = await fetch(`/api/fnb/counts?id=${countId}&no-cache=1`);
    const json = await res.json();
    if (!json.success) throw new Error('Không tải được phiếu');

    const lines: any[] = json.data.lines || [];
    const modal = document.getElementById('invDetailModal');
    const titleEl = document.getElementById('invDetailModalTitle');
    const subEl = document.getElementById('invDetailModalSub');
    if (titleEl) titleEl.textContent = `Chi Tiết Phiếu Kiểm Kê #${countId}`;
    if (subEl) subEl.textContent = `${lines.length} mặt hàng kiểm kê`;

    const html = `
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="py-2 px-3">Mặt Hàng</th>
              <th class="py-2 px-3 text-right">Số lượng tồn kho</th>
              <th class="py-2 px-3 text-right">SL Đếm</th>
              <th class="py-2 px-3 text-right">Lệch</th>
              <th class="py-2 px-3 text-right">Tiền Lệch</th>
              <th class="py-2 px-3">Ghi Chú</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
            ${lines.map(l => `
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${escapeHtml(l.item_name || l.item_code)}</td>
                <td class="py-2 px-3 text-right font-mono">${l.book_qty}</td>
                <td class="py-2 px-3 text-right font-bold text-blue-600 font-mono">${l.count_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${l.diff_qty < 0 ? 'text-rose-600' : (l.diff_qty > 0 ? 'text-emerald-600' : 'text-gray-400')}">${l.diff_qty > 0 ? '+' : ''}${l.diff_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${l.diff_val < 0 ? 'text-rose-600' : (l.diff_val > 0 ? 'text-emerald-600' : 'text-gray-400')}">${l.diff_val > 0 ? '+' : ''}${Math.round(l.diff_val).toLocaleString('vi-VN')} đ</td>
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

export function closeInvDetailModal(): void {
  document.getElementById('invDetailModal')?.classList.add('hidden');
}

function canEditAnyCountTab(): boolean {
  return canUserEdit('fnb-counts') || canUserEdit('portal-kiemke');
}

function canDeleteAnyCountTab(): boolean {
  return canUserDelete('fnb-counts') || canUserDelete('portal-kiemke');
}

export async function openEditCountModal(countId: number | string): Promise<void> {
  if (!canEditAnyCountTab()) {
    assertPermission('fnb-counts', 'edit', 'chỉnh sửa phiếu kiểm kê');
    return;
  }
  try {
    if (typeof window.showLoading === 'function') window.showLoading('Đang tải phiếu kiểm kê...');
    const res = await fetch(`/api/fnb/counts?id=${countId}&no-cache=1`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Không tải được phiếu kiểm kê');

    const counts: any[] = json.data.counts || [];
    const header = json.data.count || counts.find((c: any) => String(c.id) === String(countId)) || {};
    const lines: any[] = json.data.lines || [];

    _editCountData = {
      id: countId,
      count_code: header.count_code || `#${countId}`,
      site_code: header.site_code || getActiveFnbCountSite(),
      lines: lines.map((l: any) => ({
        item_code: l.item_code,
        item_name: l.item_name || l.item_code,
        unit: l.unit || '',
        book_qty: Number(l.book_qty) || 0,
        count_qty: Number(l.count_qty) || 0,
        unit_price: Number(l.unit_price) || 0,
        note: l.note || ''
      }))
    };

    const idEl = document.getElementById('editCountId') as HTMLInputElement | null;
    const subEl = document.getElementById('editCountSubtitle');
    const dateEl = document.getElementById('editCountDate') as HTMLInputElement | null;
    const typeEl = document.getElementById('editCountType') as HTMLSelectElement | null;
    const notesEl = document.getElementById('editCountNotes') as HTMLInputElement | null;

    if (idEl) idEl.value = String(countId);
    if (subEl) subEl.textContent = `${_editCountData.count_code} • ${_editCountData.site_code}`;
    if (dateEl) dateEl.value = header.count_date ? String(header.count_date).slice(0, 10) : new Date().toISOString().slice(0, 10);
    if (typeEl) typeEl.value = header.count_type || 'DAILY';
    if (notesEl) notesEl.value = header.notes || '';

    renderEditCountLines();
    document.getElementById('modalEditStockCount')?.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  } catch (e: any) {
    if (typeof window.showToast === 'function') window.showToast('Lỗi tải phiếu kiểm kê: ' + e.message, 'error');
  } finally {
    if (typeof window.hideLoading === 'function') window.hideLoading();
  }
}

function renderEditCountLines(): void {
  const tbody = document.getElementById('editCountLinesBody');
  if (!tbody || !_editCountData) return;

  tbody.innerHTML = _editCountData.lines.map((l, idx) => {
    const diff = l.count_qty - l.book_qty;
    return `
      <tr>
        <td class="p-2.5">
          <div class="font-bold text-gray-900 dark:text-white">${escapeHtml(l.item_name)}</div>
          <div class="text-[11px] font-mono text-gray-400">${escapeHtml(l.item_code)} ${l.unit ? `• ${escapeHtml(l.unit)}` : ''}</div>
        </td>
        <td class="p-2.5 text-right font-mono">${l.book_qty}</td>
        <td class="p-2.5 text-center">
          <input type="number" step="0.1" min="0" value="${l.count_qty}" onchange="onEditCountLineQtyChange(${idx}, this.value)" class="w-24 px-2 py-1 text-center font-mono font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
        </td>
        <td class="p-2.5 text-right font-mono font-bold ${diff < 0 ? 'text-rose-600' : (diff > 0 ? 'text-emerald-600' : 'text-gray-400')}">${diff > 0 ? '+' : ''}${Number(diff.toFixed(2))}</td>
        <td class="p-2.5">
          <input type="text" value="${escapeHtml(l.note)}" onchange="onEditCountLineNoteChange(${idx}, this.value)" placeholder="Ghi chú..." class="w-full px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs">
        </td>
      </tr>
    `;
  }).join('');
}

export function onEditCountLineQtyChange(idx: number, val: string): void {
  if (!_editCountData || !_editCountData.lines[idx]) return;
  _editCountData.lines[idx].count_qty = Math.max(0, Number(val) || 0);
  renderEditCountLines();
}

export function onEditCountLineNoteChange(idx: number, val: string): void {
  if (!_editCountData || !_editCountData.lines[idx]) return;
  _editCountData.lines[idx].note = val;
}

export function closeEditCountModal(): void {
  _editCountData = null;
  document.getElementById('modalEditStockCount')?.classList.add('hidden');
}

export async function saveEditCount(): Promise<void> {
  if (!canEditAnyCountTab()) {
    assertPermission('fnb-counts', 'edit', 'chỉnh sửa phiếu kiểm kê');
    return;
  }
  if (!_editCountData) return;

  const countDate = (document.getElementById('editCountDate') as HTMLInputElement | null)?.value || '';
  const countType = (document.getElementById('editCountType') as HTMLSelectElement | null)?.value || 'DAILY';
  const notes = (document.getElementById('editCountNotes') as HTMLInputElement | null)?.value || '';

  const btn = document.getElementById('btnSaveEditCount') as HTMLButtonElement | null;
  if (btn) btn.disabled = true;

  try {
    if (typeof window.showLoading === 'function') window.showLoading('Đang lưu thay đổi phiếu kiểm kê...');
    const res = await fetch('/api/fnb/counts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: _editCountData.id,
        count_date: countDate,
        count_type: countType,
        notes,
        lines: _editCountData.lines
      })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Cập nhật thất bại');

    if (typeof window.showToast === 'function') window.showToast(json.message || 'Đã cập nhật phiếu kiểm kê!', 'success');
    closeEditCountModal();
    await loadFnbCountsHistory();
    if (typeof window.loadPortalAuditHistory === 'function') await window.loadPortalAuditHistory();
  } catch (e: any) {
    if (typeof window.showToast === 'function') window.showToast('Lỗi cập nhật: ' + e.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
    if (typeof window.hideLoading === 'function') window.hideLoading();
  }
}

export function confirmDeleteCount(countId: number | string, countCode: string): void {
  if (!canDeleteAnyCountTab()) {
    assertPermission('fnb-counts', 'delete', 'xóa phiếu kiểm kê');
    return;
  }
  _pendingDeleteCount = { id: countId, code: countCode || `#${countId}` };
  const codeEl = document.getElementById('confirmDeleteCountCode');
  if (codeEl) codeEl.textContent = _pendingDeleteCount.code;
  document.getElementById('modalConfirmDeleteStockCount')?.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

export function closeDeleteCountModal(): void {
  _pendingDeleteCount = null;
  document.getElementById('modalConfirmDeleteStockCount')?.classList.add('hidden');
}

export async function executeDeleteCount(): Promise<void> {
  if (!canDeleteAnyCountTab()) {
    assertPermission('fnb-counts', 'delete', 'xóa phiếu kiểm kê');
    return;
  }
  if (!_pendingDeleteCount) return;

  const { id } = _pendingDeleteCount;
  const btn = document.getElementById('btnExecuteDeleteCount') as HTMLButtonElement | null;
  if (btn) btn.disabled = true;

  try {
    if (typeof window.showLoading === 'function') window.showLoading('Đang xóa phiếu kiểm kê...');
    const res = await fetch(`/api/fnb/counts?id=${encodeURIComponent(String(id))}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xóa thất bại');

    if (typeof window.showToast === 'function') window.showToast(json.message || 'Đã xóa phiếu kiểm kê!', 'success');
    closeDeleteCountModal();
    await loadFnbCountsHistory();
    if (typeof window.loadPortalAuditHistory === 'function') await window.loadPortalAuditHistory();
  } catch (e: any) {
    if (typeof window.showToast === 'function') window.showToast('Lỗi xóa phiếu: ' + e.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
    if (typeof window.hideLoading === 'function') window.hideLoading();
  }
}
