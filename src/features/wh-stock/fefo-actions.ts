import type { StockFefoItem } from './types';
import { filterFefoLive } from './fefo-table';
import { formatVND } from '@/ts/utils/formatters';

declare const App: { fefoItems?: StockFefoItem[]; currentBranch?: string; [key: string]: any };
declare const lucide: any;
declare const ApexCharts: any;
declare function showLoading(msg?: string): void;
declare function hideLoading(): void;
declare function showToast(msg: string): void;
declare function isDarkModeActive(): boolean;
declare function loadDashboardSummary(): Promise<void>;

let chartItemDetail: any = null;

/**
 * Fetch and load FEFO stock items from /api/stock
 */
export async function loadStockFEFO(): Promise<void> {
  try {
    const branch = (typeof App !== 'undefined' && App.currentBranch) ? App.currentBranch : 'ALL';
    const res = await fetch(`/api/stock?branch=${encodeURIComponent(branch)}`);
    const json = await res.json();
    if (json.success) {
      if (typeof App !== 'undefined') {
        App.fefoItems = json.data || [];
      }
      const catSel = document.getElementById('fefoCategoryFilter') as HTMLSelectElement | null;
      const fefoItems = (typeof App !== 'undefined' && App.fefoItems) ? App.fefoItems : [];
      if (catSel && fefoItems.length) {
        const curVal = catSel.value;
        const cats = Array.from(new Set(fefoItems.map(i => i.category).filter(Boolean))).sort() as string[];
        catSel.innerHTML = '<option value="">Tất cả nhóm hàng</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join('');
        if (curVal && cats.includes(curVal)) {
          catSel.value = curVal;
        }
      }
      filterFefoLive();
    }
  } catch (e) {
    console.error('Error loading FEFO stock:', e);
  }
}

export function openReceiptModal(): void {
  const modal = document.getElementById('modalFastReceipt');
  if (modal) modal.classList.remove('hidden');
}

export function openIssueModal(sku: string, name: string, batch: string, maxQty: number): void {
  const skuEl = document.getElementById('issueSku') as HTMLInputElement | null;
  if (skuEl) skuEl.value = sku;

  const labelEl = document.getElementById('issueBatchLabel');
  if (labelEl) {
    labelEl.innerHTML = `<b>${sku}</b> - ${name} <br>Lô: <b>${batch}</b> (Khả dụng: ${maxQty})`;
  }

  const modal = document.getElementById('modalFastIssue');
  if (modal) modal.classList.remove('hidden');
}

export function closeModal(id: string): void {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

export async function submitReceiptToBackend(): Promise<void> {
  if (typeof showLoading === 'function') showLoading('Đang ghi nhận nhập kho...');
  try {
    const branch = (typeof App !== 'undefined' && App.currentBranch) ? App.currentBranch : 'ALL';
    const skuEl = document.getElementById('recSku') as HTMLInputElement | null;
    const batchEl = document.getElementById('recBatch') as HTMLInputElement | null;
    const mfgEl = document.getElementById('recMfg') as HTMLInputElement | null;
    const expEl = document.getElementById('recExp') as HTMLInputElement | null;
    const qtyEl = document.getElementById('recQty') as HTMLInputElement | null;
    const locEl = document.getElementById('recLoc') as HTMLInputElement | null;

    const payload = {
      branch_code: branch,
      sku: skuEl ? skuEl.value : '',
      batch_code: (batchEl && batchEl.value) ? batchEl.value : ('BAT-' + Date.now().toString().slice(-4)),
      mfg_date: mfgEl ? mfgEl.value : '',
      exp_date: expEl ? expEl.value : '',
      qty: qtyEl ? qtyEl.value : '0',
      storage_loc: locEl ? locEl.value : ''
    };

    const res = await fetch('/api/stock/receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      closeModal('modalFastReceipt');
      if (typeof showToast === 'function') showToast('Nhập kho lô mới thành công!');
      if (typeof loadDashboardSummary === 'function') loadDashboardSummary();
      loadStockFEFO();
    } else {
      if (typeof showToast === 'function') showToast('Lỗi: ' + json.error);
    }
  } catch (e: any) {
    if (typeof showToast === 'function') showToast('Lỗi: ' + e.message);
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export async function submitIssueToBackend(): Promise<void> {
  if (typeof showLoading === 'function') showLoading('Đang thực hiện xuất kho FEFO...');
  try {
    const savedSite = localStorage.getItem('orbit_user_site');
    const rawBranch = (typeof App !== 'undefined' && App.currentBranch) ? App.currentBranch : 'K001';
    const branch = (!rawBranch || rawBranch.toUpperCase() === 'ALL') ? (savedSite || 'K001') : rawBranch;
    const skuEl = document.getElementById('issueSku') as HTMLInputElement | null;
    const qtyEl = document.getElementById('issueQty') as HTMLInputElement | null;
    const noteEl = document.getElementById('issueNote') as HTMLInputElement | null;

    const payload = {
      branch_code: branch,
      sku: skuEl ? skuEl.value : '',
      qty_needed: qtyEl ? qtyEl.value : '0',
      note: noteEl ? noteEl.value : ''
    };

    const res = await fetch('/api/stock/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      closeModal('modalFastIssue');
      if (typeof showToast === 'function') showToast(json.message || 'Xuất kho chuẩn FEFO thành công!');
      if (typeof loadDashboardSummary === 'function') loadDashboardSummary();
      loadStockFEFO();
      const w = typeof window !== 'undefined' ? (window as any) : {};
      if (typeof w.loadKitchenIssueStock === 'function') w.loadKitchenIssueStock(branch);
      if (typeof w.loadKitchenIssueHistory === 'function') w.loadKitchenIssueHistory(branch);
      if (typeof w.loadWhInventory === 'function') w.loadWhInventory();
    } else {
      if (typeof showToast === 'function') showToast('Lỗi: ' + json.error);
    }
  } catch (e: any) {
    if (typeof showToast === 'function') showToast('Lỗi: ' + e.message);
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export function openEditItemModal(sku: string): void {
  const fefoItems = (typeof App !== 'undefined' && App.fefoItems) ? App.fefoItems : [];
  const item = fefoItems.find(i => i.sku === sku);
  if (!item) return;

  const skuEl = document.getElementById('editItemSku') as HTMLInputElement | null;
  const nameEl = document.getElementById('editItemName') as HTMLInputElement | null;
  const safetyEl = document.getElementById('editItemSafetyStock') as HTMLInputElement | null;
  const unitEl = document.getElementById('editItemUnit') as HTMLInputElement | null;

  if (skuEl) skuEl.value = item.sku;
  if (nameEl) nameEl.value = `${item.sku} - ${item.item_name}`;
  if (safetyEl) safetyEl.value = String(item.safety_stock || 5.0);
  if (unitEl) unitEl.value = item.unit || item.uom || 'Can 5L';

  const modal = document.getElementById('modalEditItem');
  if (modal) modal.classList.remove('hidden');
}

export function saveItemSpecs(): void {
  const skuEl = document.getElementById('editItemSku') as HTMLInputElement | null;
  const safetyEl = document.getElementById('editItemSafetyStock') as HTMLInputElement | null;
  const unitEl = document.getElementById('editItemUnit') as HTMLInputElement | null;

  const sku = skuEl ? skuEl.value : '';
  const safetyStock = safetyEl ? (parseFloat(safetyEl.value) || 5.0) : 5.0;
  const unit = unitEl ? unitEl.value : '';

  const fefoItems = (typeof App !== 'undefined' && App.fefoItems) ? App.fefoItems : [];
  const item = fefoItems.find(i => i.sku === sku);
  if (item) {
    item.safety_stock = safetyStock;
    item.unit = unit;
  }

  closeModal('modalEditItem');
  if (typeof showToast === 'function') showToast(`Đã cập nhật định mức an toàn cho ${sku}!`);
  filterFefoLive();
}

export async function openItemDetailModal(sku: string): Promise<void> {
  try {
    const modal = document.getElementById('modalInventoryDetail');
    if (!modal) return;

    modal.classList.remove('hidden');

    const branch = (typeof App !== 'undefined' && App.currentBranch) ? App.currentBranch : 'ALL';
    const fefoItems = (typeof App !== 'undefined' && App.fefoItems) ? App.fefoItems : [];
    let item = fefoItems.find(i => i.sku === sku);

    if (!item) {
      const res = await fetch(`/api/stock?branch=${encodeURIComponent(branch)}`);
      const json = await res.json();
      if (json.success && json.data) {
        item = json.data.find((i: StockFefoItem) => i.sku === sku);
      }
    }

    if (!item) {
      item = {
        sku: sku,
        item_name: sku,
        category: 'Gia vị',
        unit: 'Đơn vị',
        qty: 12.0,
        safety_stock: 5.0,
        standard_cost_sap: 185000,
        lead_time_hours: 24.0
      };
    }

    const skuEl = document.getElementById('detailItemSku');
    if (skuEl) skuEl.textContent = item.sku;

    const nameEl = document.getElementById('detailItemName');
    if (nameEl) nameEl.textContent = item.item_name || item.sku;

    const unitEl = document.getElementById('detailItemUnit');
    if (unitEl) unitEl.textContent = item.unit || item.uom || 'Đơn vị';

    const catBadge = document.getElementById('detailBadgeCategory');
    if (catBadge) catBadge.textContent = (item.sku.slice(0, 2) || 'GV').toUpperCase();

    const qtyEl = document.getElementById('detailQty');
    if (qtyEl) qtyEl.textContent = `${item.qty || 0} ${item.unit || item.uom || ''}`;

    const safetyEl = document.getElementById('detailSafetyStock');
    if (safetyEl) safetyEl.textContent = `${item.safety_stock || 5} ${item.unit || item.uom || ''}`;

    const costEl = document.getElementById('detailStandardCost');
    if (costEl) costEl.textContent = formatVND(Number(item.standard_cost_sap) || 185000);

    const leadEl = document.getElementById('detailLeadTime');
    if (leadEl) leadEl.textContent = `${item.lead_time_hours || 24}h`;

    // Render mini stock trend chart inside modal
    const chartEl = document.getElementById('itemDetailStockChart');
    if (chartEl && typeof ApexCharts !== 'undefined') {
      if (chartItemDetail) {
        chartItemDetail.destroy();
      }
      const isDark = typeof isDarkModeActive === 'function' ? isDarkModeActive() : false;
      const numQty = typeof item.qty === 'number' ? item.qty : (parseFloat(String(item.qty)) || 10);
      const options = {
        series: [{ name: 'Tồn kho thực tế', data: [15, 14, 16, 12, 11, 14, 13, 15, 14, 12, numQty] }],
        colors: ['#19723C'],
        chart: {
          fontFamily: "'Be Vietnam Pro', sans-serif",
          type: 'area',
          height: 180,
          toolbar: { show: false },
          sparkline: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2.5 },
        fill: {
          type: 'gradient',
          gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 95, 100] }
        },
        xaxis: {
          categories: ['09/11', '10/11', '11/11', '12/11', '13/11', '14/11', '15/11', '16/11', '17/11', '18/11', '19/11'],
          labels: { style: { colors: isDark ? '#94A3B8' : '#64748B', fontSize: '10px' } }
        },
        yaxis: {
          labels: { style: { colors: isDark ? '#94A3B8' : '#64748B', fontSize: '10px' } }
        },
        grid: { borderColor: isDark ? '#1E293B' : '#F1F5F9', strokeDashArray: 3 }
      };
      chartItemDetail = new ApexCharts(chartEl, options);
      chartItemDetail.render();
    }

    const tbody = document.getElementById('detailTransactionsBody');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="py-6 text-center text-gray-400 dark:text-gray-500 text-xs">
            Chưa có phát sinh giao dịch cho mặt hàng này.
          </td>
        </tr>
      `;
    }

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  } catch (err) {
    console.error('Error opening item detail:', err);
  }
}
