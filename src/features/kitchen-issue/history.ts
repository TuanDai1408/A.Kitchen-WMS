import { KitchenIssueSlip } from './types';
import { formatVND, formatNumber, getActiveKitchenIssueSite } from './helpers';
import { exportKitchenIssueExcel } from './export-excel';

declare const showToast: (msg: string, type?: string) => void;
declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const lucide: any;

export let gKitchenIssueSlips: KitchenIssueSlip[] = [];

/**
 * Tải danh sách lịch sử các phiếu xuất kho sử dụng
 */
export async function loadKitchenIssueHistory(siteCode?: string): Promise<void> {
  const site = (siteCode || getActiveKitchenIssueSite()).toUpperCase();
  const tbody = document.getElementById('kitchenIssueHistoryBody');
  const mobileContainer = document.getElementById('kitchenIssueHistoryMobile');

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
                <span>${slip.issue_code}</span>
              </a>
            </td>
            <td class="p-3 text-center font-mono text-xs text-gray-600 dark:text-gray-300">${slip.issue_date}</td>
            <td class="p-3">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                ${slip.meal_shift || 'Nấu ăn ca'}
              </span>
            </td>
            <td class="p-3 text-xs text-gray-600 dark:text-gray-300">
              <div class="font-bold text-gray-900 dark:text-white">${slip.issuer_name || 'Bếp trưởng'}</div>
              <div class="text-[11px] text-gray-400">Nhận: ${slip.receiver_name || 'Ca trưởng'}</div>
            </td>
            <td class="p-3 text-center font-mono font-bold text-xs text-gray-800 dark:text-gray-200">
              ${slip.total_items || 0} món • ${formatNumber(slip.total_qty || 0)}
            </td>
            <td class="p-3 text-right font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
              ${formatVND(slip.total_amount || 0)}
            </td>
            <td class="p-3 text-center">
              <div class="inline-flex items-center gap-1.5">
                <button onclick="viewKitchenIssueDetail('${slip.id}')" class="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors" title="Xem chi tiết phiếu">
                  <i data-lucide="eye" class="w-4 h-4 text-brand-600"></i>
                </button>
                <button onclick="exportKitchenIssueById('${slip.id}')" class="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 transition-colors" title="Xuất file Excel (Aptos)">
                  <i data-lucide="file-spreadsheet" class="w-4 h-4 text-emerald-600"></i>
                </button>
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
              <span class="font-mono font-bold text-xs text-brand-600 dark:text-brand-400">${slip.issue_code}</span>
              <span class="text-[11px] font-mono text-gray-400">${slip.issue_date}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-gray-700 dark:text-gray-300">${slip.meal_shift}</span>
              <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">${formatVND(slip.total_amount)}</span>
            </div>
            <div class="text-[11px] text-gray-500 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
              <span>${slip.total_items} mặt hàng • ${formatNumber(slip.total_qty)}</span>
              <div class="flex items-center gap-1.5">
                <button onclick="viewKitchenIssueDetail('${slip.id}')" class="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 font-bold text-xs">Xem</button>
                <button onclick="exportKitchenIssueById('${slip.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">Excel</button>
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
