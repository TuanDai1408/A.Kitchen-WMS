import { escapeHtml } from '@/ts/utils/formatters';
import { getActiveFnbWasteSite } from './helpers';
import { switchFnbWasteSubView } from './history';
import { assertPermission } from '@/features/auth';

declare const window: any;

export async function openCreateWasteModal(): Promise<void> {
  if (!assertPermission('fnb-waste', 'create', 'tạo biên bản hủy hàng')) return;
  const modal = document.getElementById('createWasteModal');
  const siteCode = getActiveFnbWasteSite();
  const siteSel = document.getElementById('wasteModalSite') as HTMLSelectElement | null;
  const dateInput = document.getElementById('wasteModalDate') as HTMLInputElement | null;

  if (dateInput && !dateInput.value) dateInput.value = new Date().toISOString().slice(0, 10);

  if (siteSel) {
    let opts = '';
    (typeof window.gFnbSitesList !== 'undefined' ? window.gFnbSitesList : []).forEach((s: any) => {
      opts += `<option value="${s.code}" ${s.code === siteCode ? 'selected' : ''}>${s.ten || s.name}</option>`;
    });
    siteSel.innerHTML = opts;
    siteSel.value = siteCode;
  }

  // Load items with in_stock_only=1 for this site
  await loadWasteModalItems(siteCode);

  // Clear and add 1 default row
  const container = document.getElementById('wasteLinesContainer');
  if (container) container.innerHTML = '';
  addWasteLineRow();

  if (modal) modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

export function closeCreateWasteModal(): void {
  const modal = document.getElementById('createWasteModal');
  if (modal) modal.classList.add('hidden');
}

export async function onWasteModalSiteChange(): Promise<void> {
  const siteCode = (document.getElementById('wasteModalSite') as HTMLSelectElement | null)?.value || 'K001';
  await loadWasteModalItems(siteCode);
  const container = document.getElementById('wasteLinesContainer');
  if (container) container.innerHTML = '';
  addWasteLineRow();
}

export async function loadWasteModalItems(siteCode: string): Promise<void> {
  try {
    const res = await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(siteCode)}&in_stock_only=1&no-cache=1`);
    const json = await res.json();
    window.gWasteModalInStockItems = (json.success && json.data) ? (json.data.items || []) : [];
  } catch {
    window.gWasteModalInStockItems = [];
  }
}

export function addWasteLineRow(): void {
  const container = document.getElementById('wasteLinesContainer');
  if (!container) return;

  const items: any[] = window.gWasteModalInStockItems || [];
  const rowId = 'wasteRow_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

  let itemOptions = '<option value="">-- Chọn mặt hàng có tồn kho --</option>';
  items.forEach(i => {
    itemOptions += `<option value="${escapeHtml(i.code)}" data-price="${i.unit_price}" data-unit="${escapeHtml(i.unit || '')}" data-stock="${i.book_qty}">[${escapeHtml(i.code)}] ${escapeHtml(i.name)} (Tồn: ${Number(i.book_qty).toFixed(1)} ${escapeHtml(i.unit || '')})</option>`;
  });

  const rowHtml = `
    <div id="${rowId}" class="p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <select onchange="onWasteModalItemSelect('${rowId}', this)" class="w-full py-1.5 px-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500">
          ${itemOptions}
        </select>
        <button type="button" onclick="document.getElementById('${rowId}')?.remove(); recalculateWasteModalTotal();" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">SL Hủy</label>
          <input type="number" step="0.01" min="0" placeholder="0" oninput="onWasteModalLineQtyInput('${rowId}', this.value)" class="waste-modal-qty w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold tabular-nums text-center outline-none focus:border-rose-500 font-mono">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">Đơn Giá</label>
          <div class="waste-modal-price py-1 px-2 text-xs tabular-nums text-gray-600 dark:text-gray-300 font-mono">0 ₫</div>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">Thành Tiền</label>
          <div class="waste-modal-amt py-1 px-2 text-xs font-bold tabular-nums text-rose-600 text-right font-mono">0 ₫</div>
        </div>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', rowHtml);
  if (window.lucide) window.lucide.createIcons();
}

export function onWasteModalItemSelect(rowId: string, sel: HTMLSelectElement): void {
  const row = document.getElementById(rowId);
  if (!row) return;
  const opt = sel.options[sel.selectedIndex];
  const price = Number(opt?.getAttribute('data-price')) || 0;
  const stock = Number(opt?.getAttribute('data-stock')) || 0;

  const priceEl = row.querySelector('.waste-modal-price');
  if (priceEl) priceEl.textContent = Math.round(price).toLocaleString('vi-VN') + ' ₫';

  const qtyInput = row.querySelector('.waste-modal-qty') as HTMLInputElement | null;
  if (qtyInput) {
    qtyInput.max = String(stock);
    qtyInput.placeholder = `Tối đa ${stock.toFixed(1)}`;
  }

  onWasteModalLineQtyInput(rowId, qtyInput ? qtyInput.value : '0');
}

export function onWasteModalLineQtyInput(rowId: string, val: string): void {
  const row = document.getElementById(rowId);
  if (!row) return;
  const sel = row.querySelector('select');
  const opt = sel?.options[sel.selectedIndex];
  const price = Number(opt?.getAttribute('data-price')) || 0;
  const qty = parseFloat(val) || 0;
  const amt = qty * price;

  const amtEl = row.querySelector('.waste-modal-amt');
  if (amtEl) amtEl.textContent = amt > 0 ? Math.round(amt).toLocaleString('vi-VN') + ' ₫' : '0 ₫';

  recalculateWasteModalTotal();
}

export function recalculateWasteModalTotal(): void {
  const container = document.getElementById('wasteLinesContainer');
  if (!container) return;
  let total = 0;
  container.querySelectorAll('.p-3').forEach(row => {
    const sel = row.querySelector('select');
    const opt = sel?.options[sel.selectedIndex];
    const price = Number(opt?.getAttribute('data-price')) || 0;
    const qtyInput = row.querySelector('.waste-modal-qty') as HTMLInputElement | null;
    const qty = parseFloat(qtyInput?.value || '0') || 0;
    total += (qty * price);
  });
  const totalEl = document.getElementById('wasteModalTotalAmount');
  if (totalEl) totalEl.textContent = total > 0 ? Math.round(total).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
}

export async function submitCreateWaste(): Promise<void> {
  const container = document.getElementById('wasteLinesContainer');
  if (!container) return;

  const lines: any[] = [];
  container.querySelectorAll('.p-3').forEach(row => {
    const sel = row.querySelector('select');
    const itemCode = sel?.value;
    const opt = sel?.options[sel.selectedIndex];
    const price = Number(opt?.getAttribute('data-price')) || 0;
    const qtyInput = row.querySelector('.waste-modal-qty') as HTMLInputElement | null;
    const qty = parseFloat(qtyInput?.value || '0') || 0;

    if (itemCode && qty > 0) {
      lines.push({
        item_code: itemCode,
        qty: qty,
        unit_price: price,
        reason_detail: (document.getElementById('wasteModalReason') as HTMLSelectElement | null)?.value || 'Hàng hỏng / rách',
        note: ''
      });
    }
  });

  if (!lines.length) {
    if (typeof window.showToast === 'function') window.showToast('Vui lòng chọn mặt hàng và nhập số lượng hủy > 0!');
    return;
  }

  const siteCode = (document.getElementById('wasteModalSite') as HTMLSelectElement | null)?.value || getActiveFnbWasteSite();
  const wasteDate = (document.getElementById('wasteModalDate') as HTMLInputElement | null)?.value || new Date().toISOString().slice(0, 10);
  const reason = (document.getElementById('wasteModalReason') as HTMLSelectElement | null)?.value || 'Hàng hỏng / rách';
  const confirmedBy = (document.getElementById('wasteModalConfirmedBy') as HTMLInputElement | null)?.value || 'Bếp trưởng';
  const notes = (document.getElementById('wasteModalNotes') as HTMLInputElement | null)?.value || '';
  const createdBy = (window.gCurrentUser && window.gCurrentUser.name) || 'Bếp trưởng';

  const payload = {
    site_code: siteCode,
    waste_date: wasteDate,
    reason: reason,
    confirmed_by: confirmedBy,
    notes: notes,
    created_by: createdBy,
    lines: lines
  };

  const btn = document.getElementById('btnSubmitWaste') as HTMLButtonElement | null;
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Đang xác nhận...`;
  }

  try {
    if (typeof window.showLoading === 'function') window.showLoading('Đang tạo biên bản hủy...');
    const res = await fetch('/api/fnb/wastes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Lỗi khi tạo biên bản');

    if (typeof window.showToast === 'function') {
      window.showToast(`Tạo thành công biên bản hủy ${json.data.waste_code}!`);
    }

    closeCreateWasteModal();
    if (typeof window.loadFnbWaste === 'function') await window.loadFnbWaste();
    switchFnbWasteSubView('history');

    if (typeof window.loadFnbStock === 'function') window.loadFnbStock();
    if (typeof window.loadFnbCounts === 'function') window.loadFnbCounts();

  } catch (err: any) {
    console.error('submitCreateWaste error:', err);
    if (typeof window.showToast === 'function') window.showToast('Lỗi: ' + err.message);
  } finally {
    if (typeof window.hideLoading === 'function') window.hideLoading();
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> Xác Nhận Hủy Hàng`;
    }
    if (window.lucide) window.lucide.createIcons();
  }
}
