import { getActiveKitchenIssueSite, populateKitchenIssueSiteDropdown, updateKitchenIssueSiteDisplay } from './helpers';
import {
  loadKitchenStockForIssue,
  renderKitchenStockTable,
  populateKitchenGroupFilter,
  toggleKitchenItemSelection,
  onKitchenLineQtyInput,
  updateKitchenIssueKPIs,
  removeKitchenSelectedLine,
  resetKitchenIssueForm,
  submitCreateKitchenIssue
} from './stock-table';
import {
  loadKitchenIssueHistory,
  renderKitchenIssueHistoryTable,
  exportKitchenIssueById,
  openEditKitchenIssueModal,
  onEditKitchenIssueQtyChange,
  onEditKitchenIssueNoteChange,
  removeEditKitchenIssueLine,
  closeEditKitchenIssueModal,
  saveEditKitchenIssue,
  confirmDeleteKitchenIssue,
  closeDeleteKitchenIssueModal,
  executeDeleteKitchenIssue
} from './history';
import {
  viewKitchenIssueDetail,
  closeKitchenIssueDetailModal,
  exportCurrentKitchenIssue
} from './issue-modal';
import { exportKitchenIssueExcel } from './export-excel';

export * from './types';
export * from './helpers';
export * from './export-excel';
export * from './stock-table';
export * from './history';
export * from './issue-modal';

declare const window: any;

/**
 * Hàm điều phối nạp dữ liệu chính khi mở tab "Xuất kho sử dụng"
 */
export async function loadFnbKitchenIssue(): Promise<void> {
  const siteCode = getActiveKitchenIssueSite();
  updateKitchenIssueSiteDisplay(siteCode);

  const siteSel = document.getElementById('kitchenIssueSiteSelect') as HTMLSelectElement | null;
  if (siteSel) {
    siteSel.innerHTML = `<option value="${siteCode}" selected>${siteCode}</option>`;
    siteSel.value = siteCode;
  }

  // Set default date to today
  const dateInput = document.getElementById('kitchenIssueDate') as HTMLInputElement | null;
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  // Pre-fill user name as issuer
  const issuerInput = document.getElementById('kitchenIssueIssuer') as HTMLInputElement | null;
  if (issuerInput && !issuerInput.value) {
    const curUser = window.gCurrentUser;
    issuerInput.value = curUser ? (curUser.fullName || curUser.email || 'Bếp trưởng') : 'Bếp trưởng';
  }

  // Load stock items for selected site
  await loadKitchenStockForIssue(siteCode);

  // Load slips history
  loadKitchenIssueHistory(siteCode);
}

/**
 * Chuyển đổi giữa 2 tab con: "Tạo Phiếu Xuất Mới" (create) và "Lịch Sử Phiếu Xuất" (history)
 */
export function switchKitchenIssueSubView(mode: 'create' | 'history'): void {
  const createView = document.getElementById('kitchenIssueCreateView');
  const historyView = document.getElementById('kitchenIssueHistoryView');
  const btnCreate = document.getElementById('btnSubTabKitchenCreate');
  const btnHistory = document.getElementById('btnSubTabKitchenHistory');

  const activeCls = 'pb-2.5 pt-1 border-b-2 border-brand-500 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center gap-2 shrink-0 transition-all';
  const inactiveCls = 'pb-2.5 pt-1 border-b-2 border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium text-xs flex items-center gap-2 shrink-0 transition-all';

  if (mode === 'create') {
    if (createView) createView.classList.remove('hidden');
    if (historyView) historyView.classList.add('hidden');
    if (btnCreate) btnCreate.className = activeCls;
    if (btnHistory) btnHistory.className = inactiveCls;
  } else {
    if (createView) createView.classList.add('hidden');
    if (historyView) historyView.classList.remove('hidden');
    if (btnCreate) btnCreate.className = inactiveCls;
    if (btnHistory) btnHistory.className = activeCls;

    const siteCode = getActiveKitchenIssueSite();
    loadKitchenIssueHistory(siteCode);
  }
}

/**
 * Xử lý khi thay đổi Điểm bán / Bếp
 */
export async function onKitchenIssueSiteChange(siteCode: string): Promise<void> {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  const curUser = w.gCurrentUser;
  const userAssignedSite = (curUser && curUser.assignedSite) || localStorage.getItem('orbit_user_site') || 'K001';

  if (typeof w.canUserSwitchSite === 'function' && !w.canUserSwitchSite(curUser)) {
    if (typeof w.showToast === 'function') {
      w.showToast(`Điểm bán của bạn được cố định là ${userAssignedSite}. Bạn cần xin cấp quyền để chuyển điểm bán!`, 'warning');
    }
    if (typeof w.openRequestAccessForSite === 'function') {
      w.openRequestAccessForSite(siteCode);
    }
    updateKitchenIssueSiteDisplay(userAssignedSite);
    return;
  }

  try {
    localStorage.setItem('orbit_user_site', siteCode);
    if (curUser) curUser.assignedSite = siteCode;
  } catch (e) {}

  updateKitchenIssueSiteDisplay(siteCode);
  await loadKitchenStockForIssue(siteCode);
  loadKitchenIssueHistory(siteCode);
}

export function handleKitchenIssueSiteClick(): void {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  const curUser = w.gCurrentUser;
  if (typeof w.canUserSwitchSite === 'function' && w.canUserSwitchSite(curUser)) {
    if (typeof w.openSiteSelectorModal === 'function') {
      w.openSiteSelectorModal();
    }
  } else {
    if (typeof w.openRequestAccessForSite === 'function') {
      w.openRequestAccessForSite();
    }
    if (typeof w.showToast === 'function') {
      w.showToast('Điểm bán đã cố định theo tài khoản phụ trách. Vui lòng xin cấp quyền nếu cần chuyển đổi!', 'warning');
    }
  }
}

// Gắn toàn bộ hàm vào window cho HTML inline onclick
const win = window as any;

win.loadFnbKitchenIssue = loadFnbKitchenIssue;
win.switchKitchenIssueSubView = switchKitchenIssueSubView;
win.onKitchenIssueSiteChange = onKitchenIssueSiteChange;
win.handleKitchenIssueSiteClick = handleKitchenIssueSiteClick;
win.populateKitchenIssueSiteDropdown = populateKitchenIssueSiteDropdown;

// Stock Table & Form
win.loadKitchenStockForIssue = loadKitchenStockForIssue;
win.renderKitchenStockTable = renderKitchenStockTable;
win.populateKitchenGroupFilter = populateKitchenGroupFilter;
win.toggleKitchenItemSelection = toggleKitchenItemSelection;
win.onKitchenLineQtyInput = onKitchenLineQtyInput;
win.updateKitchenIssueKPIs = updateKitchenIssueKPIs;
win.removeKitchenSelectedLine = removeKitchenSelectedLine;
win.resetKitchenIssueForm = resetKitchenIssueForm;
win.submitCreateKitchenIssue = submitCreateKitchenIssue;

// History & Export
win.loadKitchenIssueHistory = loadKitchenIssueHistory;
win.renderKitchenIssueHistoryTable = renderKitchenIssueHistoryTable;
win.exportKitchenIssueById = exportKitchenIssueById;
win.exportKitchenIssueExcel = exportKitchenIssueExcel;
win.openEditKitchenIssueModal = openEditKitchenIssueModal;
win.onEditKitchenIssueQtyChange = onEditKitchenIssueQtyChange;
win.onEditKitchenIssueNoteChange = onEditKitchenIssueNoteChange;
win.removeEditKitchenIssueLine = removeEditKitchenIssueLine;
win.closeEditKitchenIssueModal = closeEditKitchenIssueModal;
win.saveEditKitchenIssue = saveEditKitchenIssue;
win.confirmDeleteKitchenIssue = confirmDeleteKitchenIssue;
win.closeDeleteKitchenIssueModal = closeDeleteKitchenIssueModal;
win.executeDeleteKitchenIssue = executeDeleteKitchenIssue;

// Modal
win.viewKitchenIssueDetail = viewKitchenIssueDetail;
win.openKitchenIssueDetailModal = viewKitchenIssueDetail;
win.closeKitchenIssueDetailModal = closeKitchenIssueDetailModal;
win.exportCurrentKitchenIssue = exportCurrentKitchenIssue;
