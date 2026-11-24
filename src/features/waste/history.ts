import { escapeHtml } from '@/ts/utils/formatters';
import { getActiveFnbWasteSite } from './helpers';
import type { WasteSubView } from './types';

declare const window: any;

export function switchFnbWasteSubView(view: WasteSubView): void {
  const btnStock = document.getElementById('subtab-fnb-waste-stock');
  const btnHistory = document.getElementById('subtab-fnb-waste-history');
  const secStock = document.getElementById('fnbWasteSubViewStock');
  const secHistory = document.getElementById('fnbWasteSubViewHistory');

  if (view === 'history') {
    if (btnStock) {
      btnStock.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200';
    }
    if (btnHistory) {
      btnHistory.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700';
    }
    if (secStock) secStock.classList.add('hidden');
    if (secHistory) secHistory.classList.remove('hidden');
  } else {
    if (btnStock) {
      btnStock.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700';
    }
    if (btnHistory) {
      btnHistory.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200';
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
      if (bHist) bHist.textContent = String(wastes.length);

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
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewWasteDetail(${w.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors" title="Xem chi tiết">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
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
