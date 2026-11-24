import { escapeHtml } from '@/ts/utils/formatters';
import { getActiveFnbCountSite } from './helpers';

declare const window: any;

export async function loadFnbCountsHistory(siteCodeArg?: string): Promise<void> {
  const siteCode = siteCodeArg || getActiveFnbCountSite();
  try {
    const res = await fetch(`/api/fnb/counts?site_code=${encodeURIComponent(siteCode)}`);
    const json = await res.json();
    const tbody = document.getElementById('fnbCountsHistoryBody');
    const mob = document.getElementById('fnbCountsHistoryMobileCards');
    if ((tbody || mob) && json.success) {
      const counts: any[] = json.data.counts || [];
      if (!counts.length) {
        if (tbody) tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-gray-400">Chưa có phiếu kiểm kê nào cho điểm ${escapeHtml(siteCode)}.</td></tr>`;
        if (mob) mob.innerHTML = `<div class="card p-6 text-center text-gray-400 text-sm">Chưa có phiếu kiểm kê nào cho điểm ${escapeHtml(siteCode)}.</div>`;
      } else {
        if (tbody) {
          tbody.innerHTML = counts.map(c => `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
              <td class="py-2.5 px-3 tabular-nums font-bold text-blue-600 dark:text-blue-400 cursor-pointer font-mono" onclick="viewCountDetail(${c.id})">${escapeHtml(c.count_code)}</td>
              <td class="py-2.5 px-3 font-semibold">${escapeHtml(c.site_code)}</td>
              <td class="py-2.5 px-3 tabular-nums">${escapeHtml(c.count_date)}</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded font-bold text-xs ${c.count_type === 'DAILY' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'}">${c.count_type === 'DAILY' ? 'Hằng Ngày' : 'Định Kỳ'}</span></td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono">${c.total_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono ${c.diff_items > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600'}">${c.diff_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-bold font-mono ${c.diff_value > 0 ? 'text-rose-600' : (c.diff_value < 0 ? 'text-rose-600' : 'text-emerald-600')}">${Math.round(c.diff_value).toLocaleString('vi-VN')} đ</td>
              <td class="py-2.5 px-3 text-gray-400">${escapeHtml(c.notes || '—')}</td>
            </tr>
          `).join('');
        }
        if (mob) {
          mob.innerHTML = counts.map(c => `
            <div class="data-card cursor-pointer p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3 space-y-2" onclick="viewCountDetail(${c.id})">
              <div class="data-card-header flex items-center justify-between">
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs">${escapeHtml(c.count_code)}</span>
                <span class="badge ${c.count_type === 'DAILY' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300' : 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300'} text-xs px-2 py-0.5 rounded-full font-bold">${c.count_type === 'DAILY' ? 'Hằng Ngày' : 'Định Kỳ'}</span>
              </div>
              <div class="data-card-body space-y-1.5">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-400">Điểm bán: <b class="text-gray-700 dark:text-gray-200">${escapeHtml(c.site_code)}</b></span>
                  <span class="num text-gray-500">${c.count_date}</span>
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
                    <span class="num font-semibold font-mono ${Number(c.diff_value) !== 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'}">${Math.round(Number(c.diff_value) || 0).toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              </div>
            </div>
          `).join('');
        }
      }
    }
  } catch (e) {
    console.error('loadFnbCountsHistory error:', e);
  }
}

export async function viewCountDetail(countId: number | string): Promise<void> {
  try {
    if (typeof window.showLoading === 'function') window.showLoading();
    const res = await fetch(`/api/fnb/counts?id=${countId}`);
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
              <th class="py-2 px-3 text-right">Tồn Sách</th>
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
