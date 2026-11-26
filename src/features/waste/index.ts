import { getActiveFnbWasteSite, populateFnbWasteSiteDropdown } from './helpers';
import {
  populateFnbWasteFilters,
  populateFnbWasteNhomHangDropdown,
  onFnbWasteNganhHangChange,
  onFnbWasteFilterChange,
  onFnbWasteSearch,
  onFnbWasteSiteChange,
  renderFnbWasteStockTable,
  onWasteLineQtyChange,
  onWasteLineReasonChange,
  onWasteLineNoteChange,
  updateWasteKPIs,
  removeDirectWasteLine,
  resetDirectWasteSelection,
  submitDirectWaste
} from './stock-table';
import {
  switchFnbWasteSubView,
  loadFnbWasteHistory,
  viewWasteDetail,
  exportWasteById,
  exportCurrentWasteDetail,
  openEditWasteModal,
  onEditWasteLineQtyChange,
  onEditWasteLineReasonChange,
  removeEditWasteLine,
  closeEditWasteModal,
  saveEditWaste,
  confirmDeleteWaste,
  closeDeleteWasteModal,
  executeDeleteWaste
} from './history';
import {
  openCreateWasteModal,
  closeCreateWasteModal,
  onWasteModalSiteChange,
  loadWasteModalItems,
  addWasteLineRow,
  onWasteModalItemSelect,
  onWasteModalLineQtyInput,
  recalculateWasteModalTotal,
  submitCreateWaste
} from './waste-modal';

export * from './types';
export * from './helpers';
export * from './stock-table';
export * from './history';
export * from './waste-modal';
export * from './export-excel';

declare const window: any;

export async function loadFnbWaste(): Promise<void> {
  populateFnbWasteSiteDropdown();
  const siteCode = getActiveFnbWasteSite();
  const filterSel = document.getElementById('fnbWasteFilterSite') as HTMLSelectElement | null;
  if (filterSel && filterSel.value !== siteCode) {
    filterSel.value = siteCode;
  }

  const sumEl = document.getElementById('fnbWasteSummary');
  if (sumEl) sumEl.textContent = 'Đang tải hàng tồn của ' + siteCode + '...';

  try {
    const res = await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(siteCode)}&in_stock_only=1&no-cache=1`);
    const json = await res.json();
    if (json.success && json.data) {
      const seenCodes = new Set<string>();
      window.gFnbWasteStockItems = (json.data.items || [])
        .filter((i: any) => {
          const code = String(i.code || '').trim();
          if (!code || seenCodes.has(code)) return false;
          seenCodes.add(code);
          return true;
        })
        .map((i: any) => ({
          ...i,
          wasteQty: 0,
          wasteReason: 'Hàng hỏng / ôi thiu không đạt chuẩn',
          wasteNote: ''
        }));
    } else {
      window.gFnbWasteStockItems = [];
    }

    populateFnbWasteFilters();
    renderFnbWasteStockTable();

    // Load waste slips history
    loadFnbWasteHistory(siteCode);

  } catch (err: any) {
    console.error('loadFnbWaste error:', err);
    if (typeof window.showToast === 'function') window.showToast('Lỗi tải dữ liệu hủy hàng: ' + err.message);
  }
}

// Attach all functions & globals to window for 100% backwards compatibility with HTML inline handlers
const win = window as any;

win.gFnbWasteStockItems = win.gFnbWasteStockItems || [];
win.gFnbWasteNganhMap = win.gFnbWasteNganhMap || null;
win.gWasteModalInStockItems = win.gWasteModalInStockItems || [];

// Helpers
win.getActiveFnbWasteSite = getActiveFnbWasteSite;
win.populateFnbWasteSiteDropdown = populateFnbWasteSiteDropdown;

// Orchestration & Views
win.loadFnbWaste = loadFnbWaste;
win.switchFnbWasteSubView = switchFnbWasteSubView;

// Stock Table & Filters
win.populateFnbWasteFilters = populateFnbWasteFilters;
win.populateFnbWasteNhomHangDropdown = populateFnbWasteNhomHangDropdown;
win.onFnbWasteNganhHangChange = onFnbWasteNganhHangChange;
win.onFnbWasteFilterChange = onFnbWasteFilterChange;
win.onFnbWasteSearch = onFnbWasteSearch;
win.onFnbWasteSiteChange = onFnbWasteSiteChange;
win.renderFnbWasteStockTable = renderFnbWasteStockTable;
win.onWasteLineQtyChange = onWasteLineQtyChange;
win.onWasteLineReasonChange = onWasteLineReasonChange;
win.onWasteLineNoteChange = onWasteLineNoteChange;
win.updateWasteKPIs = updateWasteKPIs;
win.removeDirectWasteLine = removeDirectWasteLine;
win.resetDirectWasteSelection = resetDirectWasteSelection;
win.submitDirectWaste = submitDirectWaste;

// History & Detail
win.loadFnbWasteHistory = loadFnbWasteHistory;
win.viewWasteDetail = viewWasteDetail;
win.exportWasteById = exportWasteById;
win.exportCurrentWasteDetail = exportCurrentWasteDetail;
win.openEditWasteModal = openEditWasteModal;
win.onEditWasteLineQtyChange = onEditWasteLineQtyChange;
win.onEditWasteLineReasonChange = onEditWasteLineReasonChange;
win.removeEditWasteLine = removeEditWasteLine;
win.closeEditWasteModal = closeEditWasteModal;
win.saveEditWaste = saveEditWaste;
win.confirmDeleteWaste = confirmDeleteWaste;
win.closeDeleteWasteModal = closeDeleteWasteModal;
win.executeDeleteWaste = executeDeleteWaste;

// Modal Standalone
win.openCreateWasteModal = openCreateWasteModal;
win.closeCreateWasteModal = closeCreateWasteModal;
win.onWasteModalSiteChange = onWasteModalSiteChange;
win.loadWasteModalItems = loadWasteModalItems;
win.addWasteLineRow = addWasteLineRow;
win.onWasteModalItemSelect = onWasteModalItemSelect;
win.onWasteModalLineQtyInput = onWasteModalLineQtyInput;
win.recalculateWasteModalTotal = recalculateWasteModalTotal;
win.submitCreateWaste = submitCreateWaste;
