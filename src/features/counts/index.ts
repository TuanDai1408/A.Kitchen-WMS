import { getActiveFnbCountSite } from './helpers';
import {
  populateFnbCountFilters,
  populateFnbCountNhomHangDropdown,
  onFnbCountNganhHangChange,
  onFnbCountFilterChange,
  onFnbCountSearch,
  onFnbCountDateChange,
  onFnbCountSiteChange,
  toggleBlindCount,
  onCountInputChange,
  onCountNoteChange,
  renderFnbCountsTable,
  saveFnbCountAudit
} from './count-table';
import {
  loadFnbCountsHistory,
  renderCountsHistoryInto,
  viewCountDetail,
  closeInvDetailModal,
  openEditCountModal,
  onEditCountLineQtyChange,
  onEditCountLineNoteChange,
  closeEditCountModal,
  saveEditCount,
  confirmDeleteCount,
  closeDeleteCountModal,
  executeDeleteCount
} from './history';
import { exportCountSheetExcel } from './export';

export * from './types';
export * from './helpers';
export * from './count-table';
export * from './history';
export * from './export';

declare const window: any;

export async function loadFnbCounts(): Promise<void> {
  const siteCode = getActiveFnbCountSite();
  const siteSel = document.getElementById('fnbCountSiteSelect') as HTMLSelectElement | null;
  if (siteSel && siteSel.value !== siteCode) {
    siteSel.value = siteCode;
  }

  // Sync site badge in UI
  const sites = (typeof window.getAppSitesList === 'function' ? window.getAppSitesList() : []);
  const siteObj = sites.find((s: any) => s.code.toUpperCase() === siteCode.toUpperCase());
  const siteName = siteObj ? (siteObj.ten || siteObj.name) : siteCode;
  const badgeEl = document.getElementById('fnbCountCurrentSiteBadge');
  if (badgeEl) badgeEl.textContent = siteName;

  // Sync default date
  const dp = document.getElementById('fnbCountDatePicker') as HTMLInputElement | null;
  if (dp && !dp.value) dp.value = new Date().toISOString().slice(0, 10);

  try {
    if (typeof window.showLoading === 'function') window.showLoading('Tải danh mục kiểm kê của ' + siteCode + '...');
    const res = await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(siteCode)}&no-cache=1`);
    const json = await res.json();
    if (json.success && json.data) {
      window.gFnbAllItems = json.data.items || [];
      populateFnbCountFilters();
      renderFnbCountsTable();
    } else {
      window.gFnbAllItems = [];
      populateFnbCountFilters();
      renderFnbCountsTable();
    }

    loadFnbCountsHistory(siteCode);
  } catch (err: any) {
    console.error('loadFnbCounts error:', err);
    if (typeof window.showToast === 'function') window.showToast('Lỗi tải dữ liệu kiểm kê: ' + err.message);
  } finally {
    if (typeof window.hideLoading === 'function') window.hideLoading();
  }
}

// Attach all functions & globals to window for complete backwards compatibility
const win = window as any;

win.gFnbAllItems = win.gFnbAllItems || [];
win.gCurrentCountItems = win.gCurrentCountItems || [];
win.gFnbBlindCount = win.gFnbBlindCount || false;
win.gFnbNganhMap = win.gFnbNganhMap || null;

// Helpers
win.getActiveFnbCountSite = getActiveFnbCountSite;

// Main Orchestrator
win.loadFnbCounts = loadFnbCounts;

// Table & Filters
win.populateFnbCountFilters = populateFnbCountFilters;
win.populateFnbCountNhomHangDropdown = populateFnbCountNhomHangDropdown;
win.onFnbCountNganhHangChange = onFnbCountNganhHangChange;
win.onFnbCountFilterChange = onFnbCountFilterChange;
win.onFnbCountSearch = onFnbCountSearch;
win.onFnbCountDateChange = onFnbCountDateChange;
win.onFnbCountSiteChange = onFnbCountSiteChange;
win.toggleBlindCount = toggleBlindCount;
win.onCountInputChange = onCountInputChange;
win.onCountNoteChange = onCountNoteChange;
win.renderFnbCountsTable = renderFnbCountsTable;
win.saveFnbCountAudit = saveFnbCountAudit;

// History & Detail Modal
win.loadFnbCountsHistory = loadFnbCountsHistory;
win.renderCountsHistoryInto = renderCountsHistoryInto;
win.viewCountDetail = viewCountDetail;
win.closeInvDetailModal = closeInvDetailModal;
win.openEditCountModal = openEditCountModal;
win.onEditCountLineQtyChange = onEditCountLineQtyChange;
win.onEditCountLineNoteChange = onEditCountLineNoteChange;
win.closeEditCountModal = closeEditCountModal;
win.saveEditCount = saveEditCount;
win.confirmDeleteCount = confirmDeleteCount;
win.closeDeleteCountModal = closeDeleteCountModal;
win.executeDeleteCount = executeDeleteCount;

// Excel Export
win.exportCountSheetExcel = exportCountSheetExcel;
