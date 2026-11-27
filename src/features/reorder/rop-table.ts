import type { RopItem } from './types';
import { formatNumber, paginateList } from '@/ts/utils/formatters';

declare const App: { ropItems?: RopItem[]; currentBranch?: string; [key: string]: any };

let ropCurrentPage = 1;
let ropPageSize = 25;
let ropActiveItems: RopItem[] = [];

const ROP_PAGINATION_IDS = {
  startId: 'ropPageStart',
  endId: 'ropPageEnd',
  totalId: 'ropTotalCount',
  badgeId: 'ropCurrentPageBadge',
  prevId: 'ropPrevBtn',
  nextId: 'ropNextBtn'
};

export function changeRopPage(delta: number): void {
  ropCurrentPage += delta;
  renderRopTable(ropActiveItems);
}

export function changeRopPageSize(size: string | number): void {
  ropPageSize = Math.max(1, parseInt(String(size), 10) || 25);
  ropCurrentPage = 1;
  renderRopTable(ropActiveItems);
}

function getRopStatusBadgeHtml(status: string): string {
  let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
  let dotClass = 'bg-emerald-500';
  if (status === 'HẾT HÀNG') {
    badgeClass = 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60';
    dotClass = 'bg-rose-500';
  } else if (status === 'CẦN ĐẶT') {
    badgeClass = 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
    dotClass = 'bg-amber-500';
  }
  return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap shrink-0 ${badgeClass}"><span class="w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}"></span><span>${status}</span></span>`;
}

export function renderRopTable(items: RopItem[]): void {
  ropActiveItems = items || [];
  const tbody = document.getElementById('ropTableBody');
  const mob = document.getElementById('ropMobileCards');

  const { pagedItems, page } = paginateList(ropActiveItems, ropCurrentPage, ropPageSize, ROP_PAGINATION_IDS);
  ropCurrentPage = page;

  if (!pagedItems.length) {
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="9" class="p-8 text-center text-emerald-600 dark:text-emerald-400 font-medium">Tất cả mặt hàng tại điểm kho này đều đạt ngưỡng tồn an toàn (Không cần đặt thêm).</td></tr>';
    }
    if (mob) {
      mob.innerHTML = '<div class="p-6 text-center text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">Tất cả mặt hàng tại điểm kho này đều đạt ngưỡng tồn an toàn.</div>';
    }
    return;
  }

  if (tbody) {
    tbody.innerHTML = pagedItems.map(r => {
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

      return `
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3 text-center font-mono tabular-nums font-bold text-gray-800 dark:text-gray-200 text-xs whitespace-nowrap">${sku}</td>
          <td class="p-3 font-semibold text-gray-900 dark:text-white text-xs">${itemName}</td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs whitespace-nowrap">${formatNumber(dailyUsage, 1)} <span class="text-[11px] text-gray-400 font-sans">${unit}</span></td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs whitespace-nowrap">${leadTimeDays} ngày</td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs whitespace-nowrap">${formatNumber(safetyStock, 1)} <span class="text-[11px] text-gray-400 font-sans">${unit}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${currentStock <= 0 ? 'text-rose-600' : 'text-gray-900 dark:text-white'} text-xs whitespace-nowrap">${formatNumber(currentStock, 1)} <span class="text-[11px] text-gray-400 font-sans">${unit}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400 text-xs whitespace-nowrap">${formatNumber(rop, 1)} <span class="text-[11px] text-amber-600/70 font-sans">${unit}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${suggestedOrder > 0 ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'} text-xs whitespace-nowrap">${suggestedOrder > 0 ? '+' + formatNumber(suggestedOrder, 1) : '0'} <span class="text-[11px] text-gray-400 font-sans">${unit}</span></td>
          <td class="p-3 text-center whitespace-nowrap">
            ${getRopStatusBadgeHtml(status)}
          </td>
        </tr>
      `;
    }).join('');
  }

  if (mob) {
    mob.innerHTML = pagedItems.map(r => {
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

      return `
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <div class="font-semibold text-xs text-gray-900 dark:text-white">${itemName}</div>
              <div class="text-[11px] font-mono text-gray-400 mt-0.5">SKU: ${sku}</div>
            </div>
            ${getRopStatusBadgeHtml(status)}
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
