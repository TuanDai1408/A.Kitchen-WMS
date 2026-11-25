import { KitchenStockItem, KitchenIssueLine } from './types';
import { formatVND, formatNumber, getActiveKitchenIssueSite } from './helpers';
import { loadKitchenIssueHistory } from './history';

declare const showToast: (msg: string, type?: string) => void;
declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const lucide: any;

export let gKitchenStockItems: KitchenStockItem[] = [];
export let gKitchenSelectedLines: Map<string, KitchenIssueLine> = new Map();

/**
 * Tải danh sách mặt hàng có tồn kho khả dụng của site đang chọn
 */
export async function loadKitchenStockForIssue(siteCode?: string): Promise<void> {
  const site = (siteCode || getActiveKitchenIssueSite()).toUpperCase();
  const summaryEl = document.getElementById('kitchenIssueStockSummary');
  if (summaryEl) summaryEl.textContent = `Đang tải tồn kho của ${site}...`;

  try {
    const res = await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(site)}&in_stock_only=1&no-cache=1`);
    const json = await res.json();
    if (json.success && json.data) {
      gKitchenStockItems = (json.data.items || []).map((i: any) => ({
        id: i.id || i.code,
        code: i.code,
        name: i.name,
        item_group: i.item_group || 'Chưa phân loại',
        nganh_hang: i.nganh_hang || 'Chưa phân loại',
        nhom_hang: i.nhom_hang || 'Chưa phân loại',
        unit: i.unit || 'Phần',
        unit_price: Number(i.unit_price) || 0,
        book_qty: Number(i.book_qty) || 0,
        selected: false,
        issueQty: 0,
        issueNote: ''
      }));
    } else {
      gKitchenStockItems = [];
    }

    // Populate category dropdown
    populateKitchenGroupFilter();

    // Render table
    renderKitchenStockTable();

    if (summaryEl) {
      summaryEl.textContent = `Có ${gKitchenStockItems.length} mặt hàng đang có tồn kho khả dụng tại bếp ${site}`;
    }
  } catch (err: any) {
    console.error('loadKitchenStockForIssue error:', err);
    if (typeof showToast === 'function') {
      showToast('Lỗi tải danh mục tồn kho: ' + err.message, 'error');
    }
    if (summaryEl) summaryEl.textContent = 'Lỗi kết nối CSDL tồn kho!';
  }
}

/**
 * Nạp dropdown ngành hàng / nhóm hàng
 */
export function populateKitchenGroupFilter(): void {
  const sel = document.getElementById('kitchenIssueFilterGroup') as HTMLSelectElement | null;
  if (!sel) return;

  const groups = Array.from(new Set(gKitchenStockItems.map(i => i.item_group || i.nhom_hang || 'Chưa phân loại'))).filter(Boolean);
  let opts = '<option value="all">-- Tất cả nhóm hàng (' + groups.length + ') --</option>';
  groups.forEach(g => {
    opts += `<option value="${g}">${g}</option>`;
  });
  sel.innerHTML = opts;
}

/**
 * Lọc và hiển thị bảng mặt hàng để nhập định lượng xuất
 */
export function renderKitchenStockTable(): void {
  const tbody = document.getElementById('kitchenIssueItemsBody');
  const mobileContainer = document.getElementById('kitchenIssueItemsMobile');
  if (!tbody && !mobileContainer) return;

  const searchInput = (document.getElementById('kitchenIssueSearch') as HTMLInputElement | null)?.value?.toLowerCase().trim() || '';
  const groupFilter = (document.getElementById('kitchenIssueFilterGroup') as HTMLSelectElement | null)?.value || 'all';

  const filtered = gKitchenStockItems.filter(item => {
    const matchSearch = !searchInput ||
      item.code.toLowerCase().includes(searchInput) ||
      item.name.toLowerCase().includes(searchInput);
    const matchGroup = groupFilter === 'all' || (item.item_group === groupFilter || item.nhom_hang === groupFilter);
    return matchSearch && matchGroup;
  });

  // Desktop Table
  if (tbody) {
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-gray-400 text-xs">Không tìm thấy mặt hàng nào phù hợp với bộ lọc</td></tr>`;
    } else {
      tbody.innerHTML = filtered.map((item, idx) => {
        const isSelected = gKitchenSelectedLines.has(item.code);
        const line = gKitchenSelectedLines.get(item.code);
        const qty = line ? line.qty : (item.issueQty || 0);
        const amount = qty * item.unit_price;
        const isOverStock = qty > item.book_qty;

        return `
          <tr class="hover:bg-gray-50/80 dark:hover:bg-white/3 transition-colors ${isSelected ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''}">
            <td class="p-3 text-center">
              <input type="checkbox" onchange="toggleKitchenItemSelection('${item.code}', this.checked)" ${isSelected ? 'checked' : ''} class="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-gray-300 dark:border-gray-700">
            </td>
            <td class="p-3 text-center text-xs font-mono font-medium text-gray-500 dark:text-gray-400">${idx + 1}</td>
            <td class="p-3 font-mono font-bold text-xs text-brand-600 dark:text-brand-400">${item.code}</td>
            <td class="p-3 min-w-[200px]">
              <div class="font-bold text-xs text-gray-900 dark:text-white leading-snug">${item.name}</div>
              <span class="inline-block mt-0.5 text-[10px] px-2 py-0.2 rounded-full font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">${item.item_group || 'Chưa phân loại'}</span>
            </td>
            <td class="p-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">${item.unit}</td>
            <td class="p-3 text-right">
              <span class="inline-flex items-center gap-1 font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                ${formatNumber(item.book_qty)} ${item.unit}
              </span>
            </td>
            <td class="p-3 text-right">
              <div class="inline-flex items-center gap-1">
                <input type="number" step="any" min="0" max="${item.book_qty}" value="${qty > 0 ? qty : ''}" placeholder="0"
                  oninput="onKitchenLineQtyInput('${item.code}', this.value)"
                  class="w-24 px-2.5 py-1.5 text-right font-mono font-bold text-xs rounded-xl border ${isOverStock ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50 dark:bg-rose-950/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'} focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white">
              </div>
              ${isOverStock ? '<div class="text-[10px] text-rose-500 font-bold mt-0.5 text-right">Vượt tồn kho!</div>' : ''}
            </td>
            <td class="p-3 text-right font-mono text-xs text-gray-500 dark:text-gray-400">${formatVND(item.unit_price)}</td>
            <td class="p-3 text-right font-mono font-bold text-xs text-gray-900 dark:text-white">${formatVND(amount)}</td>
          </tr>
        `;
      }).join('');
    }
  }

  // Mobile Cards
  if (mobileContainer) {
    if (filtered.length === 0) {
      mobileContainer.innerHTML = `<div class="p-6 text-center text-gray-400 text-xs">Không tìm thấy mặt hàng nào</div>`;
    } else {
      mobileContainer.innerHTML = filtered.map(item => {
        const isSelected = gKitchenSelectedLines.has(item.code);
        const line = gKitchenSelectedLines.get(item.code);
        const qty = line ? line.qty : (item.issueQty || 0);
        const amount = qty * item.unit_price;
        const isOverStock = qty > item.book_qty;

        return `
          <div class="p-3.5 rounded-2xl border ${isSelected ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-950/20' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'} space-y-2.5 transition-all">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-start gap-2.5 min-w-0">
                <input type="checkbox" onchange="toggleKitchenItemSelection('${item.code}', this.checked)" ${isSelected ? 'checked' : ''} class="mt-0.5 w-4 h-4 rounded text-brand-600 border-gray-300">
                <div>
                  <div class="font-bold text-xs text-gray-900 dark:text-white leading-tight">${item.name}</div>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="font-mono text-[10px] text-brand-600 dark:text-brand-400 font-bold">${item.code}</span>
                    <span class="text-[10px] text-gray-400">• ${item.unit}</span>
                  </div>
                </div>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                Tồn: ${formatNumber(item.book_qty)}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100 dark:border-gray-800/80 items-center">
              <div>
                <label class="block text-[10px] text-gray-400 mb-0.5">Định lượng xuất:</label>
                <input type="number" step="any" min="0" max="${item.book_qty}" value="${qty > 0 ? qty : ''}" placeholder="Nhập SL"
                  oninput="onKitchenLineQtyInput('${item.code}', this.value)"
                  class="w-full px-2.5 py-1.5 text-right font-mono font-bold text-xs rounded-xl border ${isOverStock ? 'border-rose-500 bg-rose-50' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}">
              </div>
              <div class="text-right">
                <div class="text-[10px] text-gray-400">Thành tiền:</div>
                <div class="font-mono font-bold text-xs text-gray-900 dark:text-white">${formatVND(amount)}</div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  updateKitchenIssueKPIs();
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

/**
 * Toggle chọn 1 mặt hàng vào danh sách xuất
 */
export function toggleKitchenItemSelection(code: string, isChecked: boolean): void {
  const item = gKitchenStockItems.find(i => i.code === code);
  if (!item) return;

  if (isChecked) {
    if (!gKitchenSelectedLines.has(code)) {
      const defaultQty: number = (item.issueQty && item.issueQty > 0) ? item.issueQty : 1;
      gKitchenSelectedLines.set(code, {
        item_code: item.code,
        item_name: item.name,
        unit: item.unit,
        stock_before: item.book_qty,
        qty: defaultQty,
        unit_price: item.unit_price,
        amount: defaultQty * item.unit_price,
        notes: item.issueNote || ''
      });
      item.issueQty = defaultQty;
    }
  } else {
    gKitchenSelectedLines.delete(code);
    item.issueQty = 0;
  }

  renderKitchenStockTable();
}

/**
 * Khi người dùng gõ số lượng định lượng xuất
 */
export function onKitchenLineQtyInput(code: string, rawVal: string): void {
  const val = parseFloat(rawVal) || 0;
  const item = gKitchenStockItems.find(i => i.code === code);
  if (!item) return;

  item.issueQty = val;

  if (val > 0) {
    gKitchenSelectedLines.set(code, {
      item_code: item.code,
      item_name: item.name,
      unit: item.unit,
      stock_before: item.book_qty,
      qty: val,
      unit_price: item.unit_price,
      amount: val * item.unit_price,
      notes: item.issueNote || ''
    });
  } else {
    gKitchenSelectedLines.delete(code);
  }

  updateKitchenIssueKPIs();
}

/**
 * Cập nhật thanh KPI tổng kết phiếu xuất
 */
export function updateKitchenIssueKPIs(): void {
  let countItems = 0;
  let totalQty = 0;
  let totalAmount = 0;

  gKitchenSelectedLines.forEach(line => {
    if (line.qty > 0) {
      countItems++;
      totalQty += line.qty;
      totalAmount += line.amount;
    }
  });

  const countEl = document.getElementById('kitchenIssueTotalItems');
  if (countEl) countEl.textContent = String(countItems);

  const qtyEl = document.getElementById('kitchenIssueTotalQty');
  if (qtyEl) qtyEl.textContent = formatNumber(totalQty);

  const amountEl = document.getElementById('kitchenIssueTotalAmount');
  if (amountEl) amountEl.textContent = formatVND(totalAmount);

  const submitBtn = document.getElementById('btnSubmitKitchenIssue') as HTMLButtonElement | null;
  if (submitBtn) {
    submitBtn.disabled = countItems === 0;
    if (countItems === 0) {
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }
}

/**
 * Xóa form làm lại từ đầu
 */
export function resetKitchenIssueForm(): void {
  gKitchenSelectedLines.clear();
  gKitchenStockItems.forEach(i => {
    i.issueQty = 0;
    i.issueNote = '';
    i.selected = false;
  });
  const noteInput = document.getElementById('kitchenIssueNotes') as HTMLInputElement | null;
  if (noteInput) noteInput.value = '';
  renderKitchenStockTable();
  if (typeof showToast === 'function') showToast('Đã làm mới form xuất kho', 'info');
}

/**
 * Xác nhận và gửi dữ liệu tạo phiếu xuất kho lên backend
 */
export async function submitCreateKitchenIssue(): Promise<void> {
  const siteCode = getActiveKitchenIssueSite();
  const dateInput = (document.getElementById('kitchenIssueDate') as HTMLInputElement | null)?.value || new Date().toISOString().split('T')[0];
  const mealShift = (document.getElementById('kitchenIssueMealShift') as HTMLSelectElement | null)?.value || 'Nấu ăn ca trưa';
  const issuerName = (document.getElementById('kitchenIssueIssuer') as HTMLInputElement | null)?.value?.trim() || 'Bếp trưởng';
  const receiverName = (document.getElementById('kitchenIssueReceiver') as HTMLInputElement | null)?.value?.trim() || 'Ca trưởng bếp';
  const notes = (document.getElementById('kitchenIssueNotes') as HTMLInputElement | null)?.value?.trim() || '';

  const lines: KitchenIssueLine[] = Array.from(gKitchenSelectedLines.values()).filter(l => l.qty > 0);

  if (!lines.length) {
    if (typeof showToast === 'function') showToast('Vui lòng chọn ít nhất 1 mặt hàng và nhập số lượng xuất', 'warning');
    return;
  }

  // Kiểm tra nếu có dòng vượt quá tồn kho
  for (const line of lines) {
    if (line.qty > line.stock_before) {
      if (typeof showToast === 'function') {
        showToast(`Mặt hàng "${line.item_name}" xuất ${line.qty} vượt quá tồn kho khả dụng (${line.stock_before})!`, 'error');
      }
      return;
    }
  }

  if (typeof showLoading === 'function') showLoading('Đang lưu phiếu xuất kho & trừ tồn kho...');
  try {
    const payload = {
      site_code: siteCode,
      issue_date: dateInput,
      meal_shift: mealShift,
      issuer_name: issuerName,
      receiver_name: receiverName,
      notes,
      lines
    };

    const res = await fetch('/api/fnb/kitchen-issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || 'Thao tác xuất kho thất bại');
    }

    if (typeof showToast === 'function') {
      showToast(`Xuất kho thành công! Mã phiếu: ${json.data.issue_code}`, 'success');
    }

    // Tải lại tồn kho mới nhất
    await loadKitchenStockForIssue(siteCode);

    // Tải lại lịch sử phiếu
    loadKitchenIssueHistory(siteCode);

    // Tạo object phiếu hoàn chỉnh để mở modal xem trước & xuất Excel
    const completedIssue: any = {
      id: json.data.issue_id,
      issue_code: json.data.issue_code,
      site_code: siteCode,
      issue_date: dateInput,
      meal_shift: mealShift,
      issuer_name: issuerName,
      receiver_name: receiverName,
      total_items: json.data.total_items,
      total_qty: json.data.total_qty,
      total_amount: json.data.total_amount,
      notes,
      lines
    };

    // Mở modal phiếu xuất kho vừa tạo
    const w = typeof window !== 'undefined' ? (window as any) : {};
    if (typeof w.openKitchenIssueDetailModal === 'function') {
      w.openKitchenIssueDetailModal(completedIssue);
    }

    // Reset selected
    gKitchenSelectedLines.clear();
    renderKitchenStockTable();

  } catch (err: any) {
    console.error('submitCreateKitchenIssue error:', err);
    if (typeof showToast === 'function') showToast('Lỗi xuất kho: ' + err.message, 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}
