import type { WhInventoryItem, WhInventoryFilterStatus } from './types';
import { formatNumber, formatVND, paginateList } from '@/ts/utils/formatters';

declare const App: { currentBranch?: string; [key: string]: any };
declare const lucide: any;

export let gWhInventoryData: WhInventoryItem[] = [];
export let gWhFilteredInventory: WhInventoryItem[] = [];

let whInvCurrentPage = 1;
let whInvPageSize = 25;

const WH_INV_PAGINATION_IDS = {
  startId: 'whInvPageStart',
  endId: 'whInvPageEnd',
  totalId: 'whInvTotalCount',
  badgeId: 'whInvCurrentPageBadge',
  prevId: 'whInvPrevBtn',
  nextId: 'whInvNextBtn'
};

export function changeWhInvPage(delta: number): void {
  whInvCurrentPage += delta;
  renderWhInventoryPage();
}

export function changeWhInvPageSize(size: string | number): void {
  whInvPageSize = Math.max(1, parseInt(String(size), 10) || 25);
  whInvCurrentPage = 1;
  renderWhInventoryPage();
}

export function getWhInventoryData(): WhInventoryItem[] {
  return gWhInventoryData;
}

export function getWhFilteredInventory(): WhInventoryItem[] {
  return gWhFilteredInventory;
}

export function filterWhInventoryTable(): void {
  const search = ((document.getElementById('whInvSearchInput') as HTMLInputElement | null)?.value || '').toLowerCase().trim();
  const category = (document.getElementById('whInvCategorySelect') as HTMLSelectElement | null)?.value || '';
  const status = ((document.getElementById('whInvStatusSelect') as HTMLSelectElement | null)?.value || 'ALL') as WhInventoryFilterStatus;

  let list = [...gWhInventoryData];

  if (search) {
    list = list.filter(i => (i.sku && i.sku.toLowerCase().includes(search)) || (i.name && i.name.toLowerCase().includes(search)));
  }
  if (category) {
    list = list.filter(i => i.category === category);
  }
  if (status === 'HAS_RECEIPT') {
    list = list.filter(i => parseFloat(String(i.receipt_qty || 0)) > 0);
  } else if (status === 'IN_STOCK') {
    list = list.filter(i => parseFloat(String(i.book_qty || 0)) > 0);
  } else if (status === 'HAS_BATCH') {
    list = list.filter(i => parseInt(String(i.batch_count || 0), 10) > 0);
  } else if (status === 'NEGATIVE') {
    list = list.filter(i => parseFloat(String(i.book_qty || 0)) < 0);
  }

  gWhFilteredInventory = list;
  if (typeof window !== 'undefined') {
    (window as any).gWhFilteredInventory = list;
  }

  // Calculate & update 5 KPI cards
  let totalReceipt = 0;
  let totalBook = 0;
  let totalValue = 0;
  let totalBatches = 0;

  list.forEach(i => {
    totalReceipt += parseFloat(String(i.receipt_qty || 0));
    totalBook += parseFloat(String(i.book_qty || 0));
    totalValue += parseFloat(String(i.total_value || 0));
    totalBatches += parseInt(String(i.batch_count || 0), 10);
  });

  const kpiSkus = document.getElementById('whKpiTotalSkus');
  if (kpiSkus) kpiSkus.textContent = formatNumber(list.length, 0);

  const kpiReceipt = document.getElementById('whKpiTotalReceiptQty');
  if (kpiReceipt) kpiReceipt.textContent = formatNumber(Math.round(totalReceipt * 10) / 10, 1);

  const kpiBook = document.getElementById('whKpiTotalBookQty');
  if (kpiBook) kpiBook.textContent = formatNumber(Math.round(totalBook * 10) / 10, 1);

  const kpiVal = document.getElementById('whKpiTotalValue');
  if (kpiVal) kpiVal.textContent = formatVND(totalValue);

  const kpiBatches = document.getElementById('whKpiTotalBatches');
  if (kpiBatches) kpiBatches.textContent = formatNumber(totalBatches, 0);

  const rowCountEl = document.getElementById('whInvRowCount');
  if (rowCountEl) rowCountEl.textContent = formatNumber(list.length, 0);

  whInvCurrentPage = 1;
  renderWhInventoryPage();
}

export function renderWhInventoryPage(): void {
  const list = gWhFilteredInventory;
  const tbody = document.getElementById('whInventoryTableBody');
  const mob = document.getElementById('whInventoryMobileCards');

  const { pagedItems, page, startIdx } = paginateList(list, whInvCurrentPage, whInvPageSize, WH_INV_PAGINATION_IDS);
  whInvCurrentPage = page;

  if (!pagedItems.length) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="11" class="p-8 text-center text-gray-400">Không có mặt hàng nào phù hợp với bộ lọc hiện tại.</td></tr>';
    if (mob) mob.innerHTML = '<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không có mặt hàng nào phù hợp với bộ lọc hiện tại.</div>';
    return;
  }

  if (tbody) {
    tbody.innerHTML = pagedItems.map((r, idx) => {
      const receiptQty = parseFloat(String(r.receipt_qty || 0));
      const bookQty = parseFloat(String(r.book_qty || 0));
      const batchCount = parseInt(String(r.batch_count || 0), 10);

      let stockBadgeClass = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      if (bookQty < 0) {
        stockBadgeClass = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/80';
      } else if (bookQty > 0) {
        stockBadgeClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80';
      }

      return `
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="px-2 py-2 text-center text-gray-400 tabular-nums font-mono">${startIdx + idx + 1}</td>
          <td class="px-2 py-2 whitespace-nowrap">
            <button onclick="openWhItemHistoryModal('${r.sku}')" class="font-mono font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1" title="Xem thẻ kho chi tiết">
              <span>${r.sku}</span>
              <i data-lucide="external-link" class="w-3 h-3 opacity-60"></i>
            </button>
          </td>
          <td class="px-2 py-2 font-semibold text-gray-900 dark:text-white min-w-[150px]">
            <div class="line-clamp-2">${r.name || r.sku}</div>
          </td>
          <td class="px-2 py-2 whitespace-nowrap text-center">
            <span class="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium border border-gray-200/60 dark:border-gray-700/60 inline-block max-w-[110px] truncate" title="${r.category || 'Chưa phân loại'}">${r.category || 'Chưa phân loại'}</span>
          </td>
          <td class="px-1.5 py-2 text-center whitespace-nowrap font-medium text-gray-600 dark:text-gray-300">${r.unit || 'Phần'}</td>
          <td class="px-2 py-2 text-right whitespace-nowrap bg-emerald-50/30 dark:bg-emerald-950/10">
            <span class="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs px-1.5 py-0.5 rounded-md bg-emerald-100/60 dark:bg-emerald-900/30 tabular-nums">
              ${formatNumber(receiptQty, 1)}
            </span>
          </td>
          <td class="px-2 py-2 text-right whitespace-nowrap bg-blue-50/30 dark:bg-blue-950/10">
            <span class="font-mono font-bold text-xs px-1.5 py-0.5 rounded-md tabular-nums ${stockBadgeClass}">
              ${formatNumber(bookQty, 1)}
            </span>
          </td>
          <td class="px-2 py-2 text-right whitespace-nowrap font-mono text-gray-600 dark:text-gray-300 tabular-nums">
            ${formatVND(Number(r.unit_price) || 0)}
          </td>
          <td class="px-2 py-2 text-right whitespace-nowrap font-mono font-semibold text-gray-900 dark:text-white tabular-nums">
            ${formatVND(Number(r.total_value) || 0)}
          </td>
          <td class="px-1.5 py-2 text-center whitespace-nowrap">
            <button onclick="openWhItemBatchesModal('${r.sku}')" class="px-1.5 py-0.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              batchCount > 0 
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 hover:bg-purple-200 border border-purple-200/80 dark:border-purple-800/80' 
                : 'bg-gray-100 text-gray-400 dark:bg-gray-800 hover:text-gray-600'
            }" title="Xem chi tiết các lô hàng">
              ${batchCount > 0 ? batchCount + ' Lô' : '0 Lô'}
            </button>
          </td>
          <td class="px-2 py-2 text-center whitespace-nowrap">
            <div class="inline-flex items-center gap-1 justify-center">
              <button onclick="openWhItemHistoryModal('${r.sku}')" class="px-1.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-0.5 transition-all" title="Xem thẻ kho lịch sử xuất nhập">
                <i data-lucide="history" class="w-3 h-3"></i> Thẻ Kho
              </button>
              <button onclick="openWhItemBatchesModal('${r.sku}')" class="px-1.5 py-1 bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold rounded-lg border border-purple-200 dark:border-purple-800/60 flex items-center gap-0.5 transition-all" title="Xem chi tiết các lô đã nhập">
                <i data-lucide="layers" class="w-3 h-3"></i> Lô
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render Mobile Cards
  if (mob) {
    mob.innerHTML = pagedItems.map((r, idx) => {
      const receiptQty = parseFloat(String(r.receipt_qty || 0));
      const bookQty = parseFloat(String(r.book_qty || 0));
      const batchCount = parseInt(String(r.batch_count || 0), 10);

      return `
        <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-gray-400 text-xs font-mono">#${startIdx + idx + 1}</span>
                <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${r.sku}</span>
                <span class="px-1.5 py-0.2 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">${r.unit || 'Phần'}</span>
              </div>
              <h4 class="font-bold text-xs text-gray-900 dark:text-white mt-1 leading-snug">${r.name || r.sku}</h4>
              <div class="text-xs text-gray-500 mt-0.5">${r.category || 'Chưa phân loại'}</div>
            </div>
            <button onclick="openWhItemBatchesModal('${r.sku}')" class="px-2 py-1 rounded-lg text-xs font-bold font-mono ${
              batchCount > 0 ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
            }">
              ${batchCount > 0 ? batchCount + ' Lô' : '0 Lô'}
            </button>
          </div>

          <div class="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 text-xs border border-gray-100 dark:border-gray-800">
            <div>
              <span class="text-xs text-emerald-700 dark:text-emerald-400 block font-semibold">Đã Nhập Kho</span>
              <span class="font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">${formatNumber(receiptQty, 1)}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">Tồn Sổ Sách</span>
              <span class="font-mono font-bold tabular-nums ${bookQty < 0 ? 'text-rose-600' : 'text-gray-900 dark:text-white'}">${formatNumber(bookQty, 1)}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">Giá Trị Tồn</span>
              <span class="font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums text-xs">${formatVND(Number(r.total_value) || 0)}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-1">
            <button onclick="openWhItemHistoryModal('${r.sku}')" class="w-full py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="history" class="w-3.5 h-3.5"></i> Thẻ Kho Xuất Nhập
            </button>
            <button onclick="openWhItemBatchesModal('${r.sku}')" class="w-full py-2 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold rounded-xl border border-purple-200 dark:border-purple-800/60 flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="layers" class="w-3.5 h-3.5"></i> Chi Tiết Lô Hàng
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

/**
 * Fetch and load WMS Inventory items from /api/wh/inventory
 */
export async function loadWhInventory(): Promise<void> {
  const siteSelect = document.getElementById('whInvSiteSelect') as HTMLSelectElement | null;
  const globalSaved = localStorage.getItem('orbit_user_site');
  const globalSel = (document.getElementById('globalBranchSelect') as HTMLSelectElement | null)?.value;
  const appBranch = (typeof App !== 'undefined' && App.currentBranch) ? App.currentBranch.toUpperCase() : null;
  let activeSite = globalSaved || globalSel || appBranch || (siteSelect ? siteSelect.value : null) || 'K001';
  if (activeSite === 'ALL' || activeSite === 'all') activeSite = 'K001';
  activeSite = activeSite.toUpperCase();

  if (siteSelect) {
    if (!siteSelect.options || siteSelect.options.length <= 1) {
      const sites = (typeof (window as any).getAppSitesList === 'function') ? (window as any).getAppSitesList() : [];
      siteSelect.innerHTML = sites.map((s: any) => `<option value="${s.code}">${s.ten || s.name}</option>`).join('');
    }
    siteSelect.value = activeSite;
  }

  // Sync badge
  const curBadge = document.getElementById('whInvCurrentSiteBadge');
  if (curBadge) {
    const sites = (typeof (window as any).getAppSitesList === 'function') ? (window as any).getAppSitesList() : [];
    const siteObj = sites.find((s: any) => s.code && s.code.toUpperCase() === activeSite.toUpperCase());
    curBadge.textContent = siteObj ? (siteObj.ten || siteObj.name) : activeSite;
  }

  const site = activeSite;
  const tbody = document.getElementById('whInventoryTableBody');
  const mob = document.getElementById('whInventoryMobileCards');
  if (tbody) tbody.innerHTML = '<tr><td colspan="11" class="p-8 text-center text-gray-400">Đang tải dữ liệu tồn kho WMS...</td></tr>';
  if (mob) mob.innerHTML = '<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Đang tải dữ liệu tồn kho WMS...</div>';

  try {
    const res = await fetch(`/api/wh/inventory?site=${encodeURIComponent(site)}&nocache=1`);
    const json = await res.json();
    if (json.success) {
      gWhInventoryData = json.data || [];
      if (typeof window !== 'undefined') {
        (window as any).gWhInventoryData = gWhInventoryData;
      }

      // Populate Category filter dropdown
      const catSelect = document.getElementById('whInvCategorySelect') as HTMLSelectElement | null;
      if (catSelect) {
        const curCat = catSelect.value;
        const cats = Array.from(new Set(gWhInventoryData.map(i => i.category).filter(Boolean))).sort() as string[];
        catSelect.innerHTML = '<option value="">Tất cả nhóm ngành</option>' +
          cats.map(c => `<option value="${c}">${c}</option>`).join('');
        if (curCat && cats.includes(curCat)) catSelect.value = curCat;
      }

      filterWhInventoryTable();
    } else {
      if (tbody) tbody.innerHTML = `<tr><td colspan="11" class="p-8 text-center text-rose-500">Lỗi tải dữ liệu: ${json.error || 'Không xác định'}</td></tr>`;
    }
  } catch (e: any) {
    console.error('loadWhInventory error:', e);
    if (tbody) tbody.innerHTML = `<tr><td colspan="11" class="p-8 text-center text-rose-500">Lỗi kết nối: ${e.message}</td></tr>`;
  }
}
