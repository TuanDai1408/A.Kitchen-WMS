import type { RopItem } from './types';
import { formatNumber } from '@/ts/utils/formatters';

declare const App: { ropItems?: RopItem[]; currentBranch?: string; [key: string]: any };

export function renderRopTable(items: RopItem[]): void {
  const tbody = document.getElementById('ropTableBody');
  const mob = document.getElementById('ropMobileCards');

  if (!items || !items.length) {
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="9" class="p-8 text-center text-emerald-600 dark:text-emerald-400 font-medium">Tất cả mặt hàng tại điểm kho này đều đạt ngưỡng tồn an toàn (Không cần đặt thêm).</td></tr>';
    }
    if (mob) {
      mob.innerHTML = '<div class="p-6 text-center text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">Tất cả mặt hàng tại điểm kho này đều đạt ngưỡng tồn an toàn.</div>';
    }
    return;
  }

  if (tbody) {
    tbody.innerHTML = items.map(r => {
      const sku = r.sku || '';
      const itemName = r.item_name || sku;
      const unit = r.unit || r.uom || 'Phần';
      const dailyUsage = parseFloat(String(r.daily_usage !== undefined ? r.daily_usage : 10));
      const leadTimeDays = r.lead_time_days !== undefined
        ? parseFloat(String(r.lead_time_days))
        : (r.lead_time_hours ? Math.round(parseFloat(String(r.lead_time_hours)) / 24) : 2);
      const safetyStock = parseFloat(String(r.safety_stock !== undefined ? r.safety_stock : 5));
      const currentStock = parseFloat(String(r.current_stock !== undefined ? r.current_stock : 0));
      const rop = parseFloat(String(r.rop !== undefined ? r.rop : (r.rop_threshold !== undefined ? r.rop_threshold : 25)));
      const suggestedOrder = parseFloat(String(r.suggested_order !== undefined
        ? r.suggested_order
        : (r.suggested_order_qty !== undefined ? r.suggested_order_qty : (currentStock < rop ? Math.max(0, 35 - currentStock) : 0))));
      const status = r.status || (currentStock <= 0 ? 'HẾT HÀNG' : (currentStock < rop ? 'CẦN ĐẶT' : 'AN TOÀN'));

      let statusBadgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold';
      if (status === 'HẾT HÀNG') {
        statusBadgeClass = 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold';
      } else if (status === 'CẦN ĐẶT') {
        statusBadgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold animate-pulse';
      }

      return `
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3 text-center font-mono tabular-nums font-bold text-gray-800 dark:text-gray-200 text-xs">${sku}</td>
          <td class="p-3 font-semibold text-gray-900 dark:text-white text-xs">${itemName}</td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${formatNumber(dailyUsage, 1)} <span class="text-[11px] text-gray-400 font-sans">${unit}</span></td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${leadTimeDays} ngày</td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${formatNumber(safetyStock, 1)} <span class="text-[11px] text-gray-400 font-sans">${unit}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${currentStock <= 0 ? 'text-rose-600' : 'text-gray-900 dark:text-white'} text-xs">${formatNumber(currentStock, 1)} <span class="text-[11px] text-gray-400 font-sans">${unit}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400 text-xs">${formatNumber(rop, 1)} <span class="text-[11px] text-amber-600/70 font-sans">${unit}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${suggestedOrder > 0 ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'} text-xs">${suggestedOrder > 0 ? '+' + formatNumber(suggestedOrder, 1) : '0'} <span class="text-[11px] text-gray-400 font-sans">${unit}</span></td>
          <td class="p-3 text-center">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] ${statusBadgeClass}">${status}</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (mob) {
    mob.innerHTML = items.map(r => {
      const sku = r.sku || '';
      const itemName = r.item_name || sku;
      const unit = r.unit || r.uom || 'Phần';
      const leadTimeDays = r.lead_time_days !== undefined
        ? parseFloat(String(r.lead_time_days))
        : (r.lead_time_hours ? Math.round(parseFloat(String(r.lead_time_hours)) / 24) : 2);
      const currentStock = parseFloat(String(r.current_stock !== undefined ? r.current_stock : 0));
      const rop = parseFloat(String(r.rop !== undefined ? r.rop : (r.rop_threshold !== undefined ? r.rop_threshold : 25)));
      const suggestedOrder = parseFloat(String(r.suggested_order !== undefined
        ? r.suggested_order
        : (r.suggested_order_qty !== undefined ? r.suggested_order_qty : (currentStock < rop ? Math.max(0, 35 - currentStock) : 0))));
      const status = r.status || (currentStock <= 0 ? 'HẾT HÀNG' : (currentStock < rop ? 'CẦN ĐẶT' : 'AN TOÀN'));

      let statusBadgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200';
      if (status === 'HẾT HÀNG') {
        statusBadgeClass = 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200';
      } else if (status === 'CẦN ĐẶT') {
        statusBadgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200';
      }

      return `
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-xs text-gray-900 dark:text-white">${itemName}</div>
              <div class="text-[11px] font-mono text-gray-400 mt-0.5">SKU: ${sku}</div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusBadgeClass}">${status}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
            <div>Tồn hiện tại: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${formatNumber(currentStock, 1)} ${unit}</b></div>
            <div>Điểm ROP: <b class="font-mono tabular-nums text-amber-600 dark:text-amber-400">${formatNumber(rop, 1)} ${unit}</b></div>
            <div>Lead time: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${leadTimeDays} ngày</b></div>
            <div>Đề xuất đặt: <b class="font-mono tabular-nums font-semibold text-sm ${suggestedOrder > 0 ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500'}">${suggestedOrder > 0 ? '+' + formatNumber(suggestedOrder, 1) : '0'} ${unit}</b></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

/**
 * Fetch and load ROP Reorder alert items from /api/reorder
 */
export async function loadReorderROP(): Promise<void> {
  const globalSaved = localStorage.getItem('orbit_user_site');
  const globalSel = (document.getElementById('globalBranchSelect') as HTMLSelectElement | null)?.value;
  const appBranch = (typeof App !== 'undefined' && App.currentBranch) ? App.currentBranch.toUpperCase() : null;
  let activeSite = globalSaved || globalSel || appBranch || 'K001';
  if (activeSite === 'ALL' || activeSite === 'all') activeSite = 'K001';
  activeSite = activeSite.toUpperCase();

  // Sync site badge
  const ropBadge = document.getElementById('whRopCurrentSiteBadge');
  if (ropBadge) {
    const sites = (typeof (window as any).getAppSitesList === 'function') ? (window as any).getAppSitesList() : [];
    const siteObj = sites.find((s: any) => s.code && s.code.toUpperCase() === activeSite.toUpperCase());
    ropBadge.textContent = siteObj ? (siteObj.ten || siteObj.name) : activeSite;
  }

  const tbody = document.getElementById('ropTableBody');
  const mob = document.getElementById('ropMobileCards');
  if (tbody) tbody.innerHTML = '<tr><td colspan="9" class="p-8 text-center text-gray-400">Đang tính toán ngưỡng an toàn ROP...</td></tr>';
  if (mob) mob.innerHTML = '<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Đang tính toán ngưỡng an toàn ROP...</div>';

  try {
    const res = await fetch(`/api/reorder?site=${encodeURIComponent(activeSite)}&branch=${encodeURIComponent(activeSite)}&nocache=1`);
    const json = await res.json();
    if (json.success) {
      const items: RopItem[] = json.data || [];
      if (typeof App !== 'undefined') {
        App.ropItems = items;
      }
      renderRopTable(items);
    } else {
      if (tbody) tbody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-rose-500">Lỗi tải dữ liệu: ${json.error || 'Không xác định'}</td></tr>`;
      if (mob) mob.innerHTML = `<div class="p-6 text-center text-rose-500 bg-rose-50 dark:bg-rose-950/20 rounded-2xl">Lỗi: ${json.error || 'Không xác định'}</div>`;
    }
  } catch (e: any) {
    console.error('loadReorderROP error:', e);
    if (tbody) tbody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-rose-500">Lỗi kết nối: ${e.message}</td></tr>`;
  }
}
