import { escapeHtml } from '@/ts/utils/formatters';
import { formatReceiptDateYMD, getActiveFnbReceiptSite } from './helpers';

declare const window: any;

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
          <td class="py-3 px-3 text-center">
            <button type="button" onclick="viewReceiptDetail(${r.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
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
