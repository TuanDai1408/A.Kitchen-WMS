import { KitchenIssueSlip } from './types';
import { formatVND, formatNumber } from './helpers';
import { exportKitchenIssueExcel } from './export-excel';

declare const showToast: (msg: string, type?: string) => void;
declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const lucide: any;

let currentViewingIssue: KitchenIssueSlip | null = null;

/**
 * Xem chi tiết phiếu xuất kho từ ID hoặc object có sẵn
 */
export async function viewKitchenIssueDetail(issueIdOrObj: string | KitchenIssueSlip): Promise<void> {
  const modal = document.getElementById('modalKitchenIssueDetail');
  if (!modal) return;

  if (typeof issueIdOrObj === 'object') {
    currentViewingIssue = issueIdOrObj;
    renderKitchenIssueDetailModalContent(issueIdOrObj);
    modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    return;
  }

  if (typeof showLoading === 'function') showLoading('Đang tải chi tiết phiếu xuất kho...');
  try {
    const res = await fetch(`/api/fnb/kitchen-issues?id=${encodeURIComponent(issueIdOrObj)}`);
    const json = await res.json();
    if (!json.success || !json.data || !json.data.issue) {
      throw new Error(json.error || 'Không tìm thấy phiếu xuất kho');
    }

    const fullIssue: KitchenIssueSlip = {
      ...json.data.issue,
      lines: json.data.lines || []
    };
    currentViewingIssue = fullIssue;
    renderKitchenIssueDetailModalContent(fullIssue);
    modal.classList.remove('hidden');
  } catch (err: any) {
    console.error('viewKitchenIssueDetail error:', err);
    if (typeof showToast === 'function') showToast('Lỗi xem phiếu: ' + err.message, 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  }
}

/**
 * Điền nội dung vào modal chi tiết
 */
export function renderKitchenIssueDetailModalContent(issue: KitchenIssueSlip): void {
  const codeEl = document.getElementById('kidModalCode');
  const dateEl = document.getElementById('kidModalDate');
  const siteEl = document.getElementById('kidModalSite');
  const shiftEl = document.getElementById('kidModalShift');
  const issuerEl = document.getElementById('kidModalIssuer');
  const receiverEl = document.getElementById('kidModalReceiver');
  const notesEl = document.getElementById('kidModalNotes');
  const totalItemsEl = document.getElementById('kidModalTotalItems');
  const totalQtyEl = document.getElementById('kidModalTotalQty');
  const totalAmountEl = document.getElementById('kidModalTotalAmount');
  const linesBody = document.getElementById('kidModalLinesBody');
  const linesMobile = document.getElementById('kidModalLinesMobile');

  if (codeEl) codeEl.textContent = issue.issue_code;
  if (dateEl) dateEl.textContent = issue.issue_date;
  if (siteEl) siteEl.textContent = issue.site_code;
  if (shiftEl) shiftEl.textContent = issue.meal_shift;
  if (issuerEl) issuerEl.textContent = issue.issuer_name || 'Bếp trưởng';
  if (receiverEl) receiverEl.textContent = issue.receiver_name || 'Ca trưởng';
  if (notesEl) notesEl.textContent = issue.notes || 'Không có ghi chú thêm';
  if (totalItemsEl) totalItemsEl.textContent = String(issue.lines?.length || issue.total_items || 0);
  if (totalQtyEl) totalQtyEl.textContent = formatNumber(issue.total_qty || 0);
  if (totalAmountEl) totalAmountEl.textContent = formatVND(issue.total_amount || 0);

  const lines = issue.lines || [];

  if (linesBody) {
    if (lines.length === 0) {
      linesBody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-gray-400 text-xs">Không có dữ liệu mặt hàng</td></tr>`;
    } else {
      linesBody.innerHTML = lines.map((l, idx) => `
        <tr class="hover:bg-gray-50/80 dark:hover:bg-white/3">
          <td class="p-3 text-center text-xs font-mono font-medium text-gray-500">${idx + 1}</td>
          <td class="p-3 font-mono font-bold text-xs text-brand-600 dark:text-brand-400">${l.item_code}</td>
          <td class="p-3 text-xs font-bold text-gray-900 dark:text-white">${l.item_name || l.item_code}</td>
          <td class="p-3 text-center text-xs text-gray-600 dark:text-gray-300 font-semibold">${l.unit}</td>
          <td class="p-3 text-right font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
            ${formatNumber(l.qty)}
          </td>
          <td class="p-3 text-right font-mono text-xs text-gray-500">${formatVND(l.unit_price)}</td>
          <td class="p-3 text-right font-mono font-bold text-xs text-gray-900 dark:text-white">${formatVND(l.amount)}</td>
        </tr>
      `).join('');
    }
  }

  if (linesMobile) {
    if (lines.length === 0) {
      linesMobile.innerHTML = `<div class="p-4 text-center text-gray-400 text-xs">Không có mặt hàng nào</div>`;
    } else {
      linesMobile.innerHTML = lines.map(l => `
        <div class="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 space-y-1 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-gray-900 dark:text-white">${l.item_name}</span>
            <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">${formatNumber(l.qty)} ${l.unit}</span>
          </div>
          <div class="flex items-center justify-between text-gray-500 text-[11px]">
            <span class="font-mono text-brand-600 font-semibold">${l.item_code}</span>
            <span class="font-mono font-semibold">${formatVND(l.amount)}</span>
          </div>
        </div>
      `).join('');
    }
  }
}

/**
 * Đóng modal chi tiết phiếu xuất kho
 */
export function closeKitchenIssueDetailModal(): void {
  const modal = document.getElementById('modalKitchenIssueDetail');
  if (modal) modal.classList.add('hidden');
}

/**
 * Xuất Excel phiếu đang mở xem
 */
export function exportCurrentKitchenIssue(): void {
  if (!currentViewingIssue) {
    if (typeof showToast === 'function') showToast('Không có dữ liệu phiếu để xuất', 'warning');
    return;
  }
  exportKitchenIssueExcel(currentViewingIssue);
}
