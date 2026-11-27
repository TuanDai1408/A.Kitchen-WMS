import { escapeHtml } from '@/ts/utils/formatters';
import { getReceiptExpWarningHtml, getActiveFnbReceiptSite } from './helpers';
import { loadFnbPoList, switchFnbReceiptSubView } from './po-list';

declare const window: any;

export async function openPoReceiptModal(poNumber: string): Promise<void> {
  try {
    if (typeof window.showLoading === 'function') {
      window.showLoading('Đang tải danh sách mặt hàng của PO ' + poNumber + '...');
    }
    const res = await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(poNumber)}&no-cache=1`);
    const json = await res.json();
    if (!json.success || !json.data) throw new Error(json.error || 'Không tải được chi tiết đơn PO');

    const lines = json.data;
    if (!lines.length) throw new Error('Đơn PO này không có mặt hàng nào');

    const first = lines[0];
    const poNumEl = document.getElementById('receiptModalInvoice') as HTMLInputElement | null;
    const poNumDisp = document.getElementById('receiptModalInvoiceDisplay');
    const siteEl = document.getElementById('receiptModalSite') as HTMLInputElement | null;
    const siteDisp = document.getElementById('receiptModalSiteDisplay');
    const supEl = document.getElementById('receiptModalSupplier') as HTMLInputElement | null;
    const supDisp = document.getElementById('receiptModalSupplierDisplay');
    const dateEl = document.getElementById('receiptModalDate') as HTMLInputElement | null;

    const todayStr = new Date().toISOString().slice(0, 10);
    if (poNumEl) poNumEl.value = first.po_number;
    if (poNumDisp) poNumDisp.textContent = first.po_number;
    if (siteEl) siteEl.value = first.site;
    if (siteDisp) siteDisp.textContent = first.site;
    if (supEl) supEl.value = first.supplier_name;
    if (supDisp) supDisp.textContent = first.supplier_name;
    if (dateEl) dateEl.value = todayStr;

    // Default batch and default EXP (+1 year)
    const defaultBatch = 'LÔ-' + todayStr.replace(/-/g, '').slice(2);
    const dPlus1y = new Date();
    dPlus1y.setFullYear(dPlus1y.getFullYear() + 1);
    const defaultExp1y = dPlus1y.toISOString().slice(0, 10);

    // Prepare lines array for editing
    window.gReceiptLines = lines.map((item: any) => {
      const cat = (item.merch_category || '').toLowerCase();
      const isFood = !cat.includes('bao bì') && !cat.includes('công cụ') && !cat.includes('hóa chất') && !cat.includes('tạp phẩm');
      const orderQty = Number(item.order_qty) || 0;
      const receivedQty = Number(item.received_qty) || 0;
      const remainingQty = Math.max(0, Math.round((orderQty - receivedQty) * 100) / 100);
      return {
        po_item: item.po_item,
        item_code: item.item_code,
        item_name: item.item_name,
        merch_category: item.merch_category,
        unit: item.unit || 'KG',
        unit_price: Number(item.unit_price) || 0,
        order_qty: orderQty,
        received_qty: receivedQty,
        remaining_qty: remainingQty,
        actual_qty: remainingQty,
        batch_code: defaultBatch,
        exp_date: isFood ? defaultExp1y : '',
        is_food: isFood,
        note: ''
      };
    });

    renderReceiptLinesTable();

    const modal = document.getElementById('createReceiptModal');
    if (modal) modal.classList.remove('hidden');

  } catch (err: any) {
    console.error('openPoReceiptModal error:', err);
    if (typeof window.showToast === 'function') window.showToast('Lỗi mở đơn: ' + err.message);
  } finally {
    if (typeof window.hideLoading === 'function') window.hideLoading();
  }
}

export function renderReceiptLinesTable(): void {
  const tbody = document.getElementById('receiptLinesTableBody');
  const mob = document.getElementById('receiptLinesMobileCards');
  const countEl = document.getElementById('receiptModalLineCount');
  const totalEl = document.getElementById('receiptModalTotalAmount');

  const lines: any[] = window.gReceiptLines || [];
  if (countEl) countEl.textContent = String(lines.length);

  let grandTotal = 0;

  if (tbody) {
    tbody.innerHTML = lines.map((item, idx) => {
      const lineTotal = (item.actual_qty || 0) * (item.unit_price || 0);
      grandTotal += lineTotal;
      const receivedQty = Number(item.received_qty) || 0;
      const remainingQty = item.remaining_qty !== undefined ? Number(item.remaining_qty) : Math.max(0, (Number(item.order_qty) || 0) - receivedQty);
      const isLineDone = remainingQty <= 0;

      return `
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors ${isLineDone ? 'opacity-60 bg-emerald-50/20 dark:bg-emerald-950/10' : ''}">
          <td class="py-2.5 px-3 text-center tabular-nums text-gray-400 text-xs">${idx + 1}</td>
          <td class="py-2.5 px-3">
            <div class="font-bold text-gray-900 dark:text-white text-xs flex items-center gap-1.5 flex-wrap">
              <span>${escapeHtml(item.item_name || 'Vật tư')}</span>
              ${isLineDone ? '<span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">Đã nhập đủ</span>' : ''}
            </div>
            <div class="text-xs text-gray-400 tabular-nums flex items-center gap-1.5 mt-0.5">
              <span class="font-mono text-brand-600 dark:text-brand-400">${escapeHtml(item.item_code)}</span>
              ${item.merch_category ? `<span>•</span><span>${escapeHtml(item.merch_category)}</span>` : ''}
              ${item.is_food ? '<span class="text-emerald-500 font-semibold">• Thực phẩm</span>' : '<span class="text-gray-400">• Vật tư</span>'}
            </div>
          </td>
          <td class="py-2.5 px-2 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">
            ${escapeHtml(item.unit || '')}
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300">
            ${Number(item.unit_price).toLocaleString('vi-VN')} đ
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/20">
            ${Number(item.order_qty).toFixed(1)}
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs font-semibold ${receivedQty > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}">
            ${receivedQty.toFixed(1)}
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs font-bold ${remainingQty > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}">
            ${remainingQty.toFixed(1)}
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="number" step="0.01" min="0" value="${item.actual_qty}" 
                   oninput="onReceiptLineQtyChange(${idx}, this.value)" 
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono">
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="text" value="${escapeHtml(item.batch_code || '')}" placeholder="Lô SX..." 
                   oninput="onReceiptLineBatchChange(${idx}, this.value)" 
                   class="w-28 text-center py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2.5 px-3 text-center">
            <div class="flex flex-col items-center">
              <input type="date" id="receiptLineExpInput_${idx}" value="${item.exp_date || ''}" 
                     onchange="onReceiptLineExpChange(${idx}, this.value)" 
                     class="w-32 py-1 px-1.5 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
              <div class="flex items-center gap-1 mt-1">
                <button type="button" onclick="setReceiptLineQuickExp(${idx}, 1)" title="+1 Tháng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${idx}, 6)" title="+6 Tháng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${idx}, 12)" title="+1 Năm" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${idx}, 24)" title="+2 Năm" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+2N</button>
              </div>
              <div id="receiptExpWarning_${idx}" class="mt-1">
                ${getReceiptExpWarningHtml(item.exp_date)}
              </div>
            </div>
          </td>
          <td id="receiptLineTotal_${idx}" class="py-2.5 px-3 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
            ${lineTotal > 0 ? Math.round(lineTotal).toLocaleString('vi-VN') + ' đ' : '0 đ'}
          </td>
          <td class="py-2.5 px-3">
            <input type="text" value="${escapeHtml(item.note || '')}" placeholder="Ghi chú..." 
                   oninput="onReceiptLineNoteChange(${idx}, this.value)" 
                   class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
        </tr>
      `;
    }).join('');
  }

  if (mob) {
    mob.innerHTML = lines.map((item, idx) => {
      const lineTotal = (item.actual_qty || 0) * (item.unit_price || 0);
      const receivedQty = Number(item.received_qty) || 0;
      const remainingQty = item.remaining_qty !== undefined ? Number(item.remaining_qty) : Math.max(0, (Number(item.order_qty) || 0) - receivedQty);

      return `
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">${escapeHtml(item.item_code)}</span>
              <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${escapeHtml(item.item_name || 'Vật tư')}</h4>
              <div class="text-xs text-gray-400 tabular-nums">ĐVT: ${escapeHtml(item.unit || '')} • Đơn giá: ${Number(item.unit_price).toLocaleString('vi-VN')} đ</div>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">#${idx + 1}</span>
          </div>

          <div class="grid grid-cols-4 gap-2 bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl text-center tabular-nums text-xs">
            <div>
              <span class="text-gray-400 block text-[11px]">SL Đặt:</span>
              <span class="font-bold text-gray-700 dark:text-gray-300">${Number(item.order_qty).toFixed(1)}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Đã Nhập:</span>
              <span class="font-bold text-blue-600 dark:text-blue-400">${receivedQty.toFixed(1)}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Còn Lại:</span>
              <span class="font-bold ${remainingQty > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}">${remainingQty.toFixed(1)}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Thành tiền:</span>
              <span id="receiptLineTotalMob_${idx}" class="num font-bold text-brand-600 dark:text-brand-400">${lineTotal > 0 ? Math.round(lineTotal).toLocaleString('vi-VN') + ' ₫' : '0 ₫'}</span>
            </div>
          </div>

          <div class="space-y-2 pt-1 text-xs">
            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">SL thực nhập:</label>
              <input type="number" step="0.01" min="0" value="${item.actual_qty}" 
                     oninput="onReceiptLineQtyChange(${idx}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono text-center">
            </div>

            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">Số lô (Batch):</label>
              <input type="text" value="${escapeHtml(item.batch_code || '')}" placeholder="Lô SX..." 
                     oninput="onReceiptLineBatchChange(${idx}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>

            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">Hạn dùng (EXP):</label>
                <input type="date" id="receiptLineExpInputMob_${idx}" value="${item.exp_date || ''}" 
                       onchange="onReceiptLineExpChange(${idx}, this.value)" 
                       class="flex-1 py-1 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-700 dark:text-gray-300 outline-none">
              </div>
              <div class="flex items-center gap-1.5 justify-end">
                <span class="text-[11px] text-gray-400">Chọn nhanh:</span>
                <button type="button" onclick="setReceiptLineQuickExp(${idx}, 1)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${idx}, 6)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${idx}, 12)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${idx}, 24)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+2N</button>
              </div>
              <div id="receiptExpWarningMob_${idx}" class="mt-1">
                ${getReceiptExpWarningHtml(item.exp_date)}
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">Ghi chú dòng:</label>
              <input type="text" value="${escapeHtml(item.note || '')}" placeholder="Ghi chú mặt hàng..." 
                     oninput="onReceiptLineNoteChange(${idx}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  if (totalEl) {
    totalEl.textContent = (grandTotal > 0 ? Math.round(grandTotal).toLocaleString('vi-VN') + ' đ' : '0 đ');
  }

  if (window.lucide) window.lucide.createIcons();
}

export function onReceiptLineQtyChange(idx: number, val: string): void {
  if (!window.gReceiptLines || !window.gReceiptLines[idx]) return;
  const num = parseFloat(val);
  window.gReceiptLines[idx].actual_qty = isNaN(num) ? 0 : num;

  const item = window.gReceiptLines[idx];
  const lineTotal = (item.actual_qty || 0) * (item.unit_price || 0);

  const tdTotal = document.getElementById(`receiptLineTotal_${idx}`);
  if (tdTotal) {
    tdTotal.textContent = lineTotal > 0 ? Math.round(lineTotal).toLocaleString('vi-VN') + ' đ' : '0 đ';
  }
  const mobTotal = document.getElementById(`receiptLineTotalMob_${idx}`);
  if (mobTotal) {
    mobTotal.textContent = lineTotal > 0 ? Math.round(lineTotal).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  }

  // Recalculate grand total
  let grandTotal = 0;
  window.gReceiptLines.forEach((l: any) => {
    grandTotal += (l.actual_qty || 0) * (l.unit_price || 0);
  });
  const totalEl = document.getElementById('receiptModalTotalAmount');
  if (totalEl) {
    totalEl.textContent = grandTotal > 0 ? Math.round(grandTotal).toLocaleString('vi-VN') + ' đ' : '0 đ';
  }
}

export function onReceiptLineBatchChange(idx: number, val: string): void {
  if (!window.gReceiptLines || !window.gReceiptLines[idx]) return;
  window.gReceiptLines[idx].batch_code = val;
}

export function onReceiptLineExpChange(idx: number, val: string): void {
  if (!window.gReceiptLines || !window.gReceiptLines[idx]) return;
  window.gReceiptLines[idx].exp_date = val;
  const warnEl = document.getElementById(`receiptExpWarning_${idx}`);
  if (warnEl) {
    warnEl.innerHTML = getReceiptExpWarningHtml(val);
  }
  const warnElMob = document.getElementById(`receiptExpWarningMob_${idx}`);
  if (warnElMob) {
    warnElMob.innerHTML = getReceiptExpWarningHtml(val);
  }
  if (window.lucide) window.lucide.createIcons();
}

export function setReceiptLineQuickExp(idx: number, months: number): void {
  if (!window.gReceiptLines || !window.gReceiptLines[idx]) return;
  const baseDate = new Date();
  baseDate.setMonth(baseDate.getMonth() + months);
  const dateStr = baseDate.toISOString().slice(0, 10);
  window.gReceiptLines[idx].exp_date = dateStr;

  const input = document.getElementById(`receiptLineExpInput_${idx}`) as HTMLInputElement | null;
  if (input) input.value = dateStr;
  const inputMob = document.getElementById(`receiptLineExpInputMob_${idx}`) as HTMLInputElement | null;
  if (inputMob) inputMob.value = dateStr;

  const warnEl = document.getElementById(`receiptExpWarning_${idx}`);
  if (warnEl) {
    warnEl.innerHTML = getReceiptExpWarningHtml(dateStr);
  }
  const warnElMob = document.getElementById(`receiptExpWarningMob_${idx}`);
  if (warnElMob) {
    warnElMob.innerHTML = getReceiptExpWarningHtml(dateStr);
  }
  if (window.lucide) window.lucide.createIcons();
}

export function onReceiptLineNoteChange(idx: number, val: string): void {
  if (!window.gReceiptLines || !window.gReceiptLines[idx]) return;
  window.gReceiptLines[idx].note = val;
}

export function closeCreateReceiptModal(): void {
  const modal = document.getElementById('createReceiptModal');
  if (modal) modal.classList.add('hidden');
}

export function openCreateReceiptModal(): void {
  if (window.gFnbPoList && window.gFnbPoList.length) {
    openPoReceiptModal(window.gFnbPoList[0].po_number);
  } else {
    if (typeof window.showToast === 'function') {
      window.showToast('Vui lòng chọn một đơn PO từ danh sách để kiểm đếm thực tế');
    }
  }
}

export async function submitCreateReceipt(): Promise<void> {
  const lines: any[] = window.gReceiptLines || [];
  const validLines = lines.filter(l => (l.actual_qty || 0) > 0);

  if (!validLines.length) {
    if (typeof window.showToast === 'function') {
      window.showToast('Vui lòng nhập số lượng thực tế lớn hơn 0 cho ít nhất một mặt hàng!');
    }
    return;
  }

  // Check if any line has expired date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let hasExpired = false;
  for (const l of validLines) {
    if (l.exp_date) {
      const expD = new Date(l.exp_date);
      expD.setHours(0, 0, 0, 0);
      if (expD <= today) {
        hasExpired = true;
        break;
      }
    }
  }

  if (hasExpired) {
    const confirmFn = (window as any).showAppConfirmModal;
    const msg = 'Cảnh báo: Có mặt hàng có Hạn Dùng (EXP) đã hết hạn hoặc hết hạn hôm nay. Bạn có chắc chắn muốn tiếp tục nhập kho không?';
    const ok = typeof confirmFn === 'function'
      ? await confirmFn(msg, { title: 'Cảnh báo Hạn Sử Dụng', confirmText: 'Vẫn nhập kho', danger: true })
      : confirm(msg);
    if (!ok) return;
  }

  const siteCode = (document.getElementById('receiptModalSite') as HTMLInputElement | null)?.value || getActiveFnbReceiptSite();
  const poNumber = (document.getElementById('receiptModalInvoice') as HTMLInputElement | null)?.value || '';
  const receiptDate = (document.getElementById('receiptModalDate') as HTMLInputElement | null)?.value || new Date().toISOString().slice(0, 10);
  const supplier = (document.getElementById('receiptModalSupplier') as HTMLInputElement | null)?.value || 'Bếp Trung Tâm Siba';
  const notes = (document.getElementById('receiptModalNotes') as HTMLInputElement | null)?.value || '';
  const createdBy = (window.gCurrentUser && window.gCurrentUser.name) || 'Bếp Trưởng / Thủ Kho';

  const payload = {
    site_code: siteCode,
    receipt_date: receiptDate,
    supplier: supplier,
    invoice_no: poNumber,
    notes: notes,
    created_by: createdBy,
    lines: validLines.map(l => ({
      item_code: l.item_code,
      qty: l.actual_qty,
      unit_price: l.unit_price,
      batch_code: (l.batch_code || '').trim(),
      exp_date: (l.exp_date || '').trim() || null,
      note: l.note || ''
    }))
  };

  const btn = document.getElementById('btnSubmitReceipt') as HTMLButtonElement | null;
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Đang ghi nhận nhập kho...`;
  }

  try {
    if (typeof window.showLoading === 'function') window.showLoading('Đang nhập kho và cập nhật số dư tồn...');
    const res = await fetch('/api/fnb/receipts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Lỗi khi nhập kho');

    if (typeof window.showToast === 'function') {
      window.showToast(`Nhập kho thành công phiếu ${json.data.receipt_code}! Tồn kho điểm ${siteCode} đã được cộng tự động.`);
    }

    closeCreateReceiptModal();

    // Reload PO list and history
    await loadFnbPoList(siteCode);
    if (typeof window.loadFnbReceiptsHistory === 'function') {
      await window.loadFnbReceiptsHistory(siteCode);
    }

    // Switch to history tab to see the newly generated receipt
    switchFnbReceiptSubView('history');

    // Trigger stock matrix reload in background
    if (typeof window.loadFnbStock === 'function') window.loadFnbStock();
    if (typeof window.loadFnbCounts === 'function') window.loadFnbCounts();

  } catch (err: any) {
    console.error('submitCreateReceipt error:', err);
    if (typeof window.showToast === 'function') window.showToast('Lỗi nhập kho: ' + err.message);
  } finally {
    if (typeof window.hideLoading === 'function') window.hideLoading();
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> Xác Nhận Nhập Kho`;
    }
    if (window.lucide) window.lucide.createIcons();
  }
}
