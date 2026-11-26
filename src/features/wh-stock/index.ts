import {
  renderFefoRows,
  filterFefoLive,
  changeStockPage,
  changeStockPageSize,
  sortStockBy,
  resetFefoFilters,
  toggleSelectAllStock,
  toggleStockItemSelect,
  updateStockBulkBar,
  clearStockSelection,
  selectedStockSkus,
  getSelectedStockSkus,
  getStockCurrentPage,
  setStockCurrentPage
} from './fefo-table';
import {
  loadStockFEFO,
  openReceiptModal,
  openIssueModal,
  closeModal,
  submitReceiptToBackend,
  submitIssueToBackend,
  openEditItemModal,
  saveItemSpecs,
  openItemDetailModal
} from './fefo-actions';
import {
  exportFefoToExcel,
  exportSelectedStockExcel
} from './export';
import {
  switchWhStockSubView,
  loadBatchManager,
  renderBatchManagerTable,
  openBatchItemsDetailModal,
  closeBatchItemsDetailModal,
  openCreateBatchModal,
  openEditBatchModal,
  closeBatchManageModal,
  saveBatchManage,
  confirmDeleteBatch,
  closeDeleteBatchModal,
  executeDeleteBatch
} from './batch-manager';

export * from './types';
export * from './helpers';
export * from './fefo-table';
export * from './fefo-actions';
export * from './export';
export * from './batch-manager';

// Bind to window for HTML inline handlers & backwards compatibility
if (typeof window !== 'undefined') {
  const w = window as any;
  w.renderFefoRows = renderFefoRows;
  w.filterFefoLive = filterFefoLive;
  w.changeStockPage = changeStockPage;
  w.changeStockPageSize = changeStockPageSize;
  w.sortStockBy = sortStockBy;
  w.resetFefoFilters = resetFefoFilters;
  w.toggleSelectAllStock = toggleSelectAllStock;
  w.toggleStockItemSelect = toggleStockItemSelect;
  w.updateStockBulkBar = updateStockBulkBar;
  w.clearStockSelection = clearStockSelection;
  w.selectedStockSkus = selectedStockSkus;
  w.getSelectedStockSkus = getSelectedStockSkus;
  w.getStockCurrentPage = getStockCurrentPage;
  w.setStockCurrentPage = setStockCurrentPage;

  w.loadStockFEFO = loadStockFEFO;
  w.openReceiptModal = openReceiptModal;
  w.openIssueModal = openIssueModal;
  w.closeModal = closeModal;
  w.submitReceiptToBackend = submitReceiptToBackend;
  w.submitIssueToBackend = submitIssueToBackend;
  w.openEditItemModal = openEditItemModal;
  w.saveItemSpecs = saveItemSpecs;
  w.openItemDetailModal = openItemDetailModal;

  w.exportFefoToExcel = exportFefoToExcel;
  w.exportSelectedStockExcel = exportSelectedStockExcel;

  w.switchWhStockSubView = switchWhStockSubView;
  w.loadBatchManager = loadBatchManager;
  w.renderBatchManagerTable = renderBatchManagerTable;
  w.openBatchItemsDetailModal = openBatchItemsDetailModal;
  w.closeBatchItemsDetailModal = closeBatchItemsDetailModal;
  w.openCreateBatchModal = openCreateBatchModal;
  w.openEditBatchModal = openEditBatchModal;
  w.closeBatchManageModal = closeBatchManageModal;
  w.saveBatchManage = saveBatchManage;
  w.confirmDeleteBatch = confirmDeleteBatch;
  w.closeDeleteBatchModal = closeDeleteBatchModal;
  w.executeDeleteBatch = executeDeleteBatch;
}
