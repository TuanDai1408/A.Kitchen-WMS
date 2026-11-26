import { getActiveFnbReceiptSite, formatReceiptDateYMD, getReceiptExpWarningHtml } from './helpers';
import { switchFnbReceiptSubView, loadFnbReceipts, onFnbPoSearchInput, loadFnbPoList, renderFnbPoTable } from './po-list';
import {
  openPoReceiptModal,
  renderReceiptLinesTable,
  onReceiptLineQtyChange,
  onReceiptLineBatchChange,
  onReceiptLineExpChange,
  setReceiptLineQuickExp,
  onReceiptLineNoteChange,
  closeCreateReceiptModal,
  openCreateReceiptModal,
  submitCreateReceipt
} from './po-modal';
import {
  loadFnbReceiptsHistory,
  renderFnbReceiptsHistoryTable,
  viewReceiptDetail,
  openEditReceiptModal,
  onEditReceiptLineQtyChange,
  onEditReceiptLinePriceChange,
  onEditReceiptLineBatchChange,
  onEditReceiptLineExpChange,
  removeEditReceiptLine,
  closeEditReceiptModal,
  saveEditReceipt,
  confirmDeleteReceipt,
  closeDeleteReceiptModal,
  executeDeleteReceipt
} from './history';
import {
  openManualReceiptModal,
  closeManualReceiptModal,
  onManualReceiptSiteChange,
  toggleManualShowAllCatalog,
  loadManualCatalogItems,
  filterManualCatalogList,
  addManualReceiptItem,
  renderManualReceiptLinesTable,
  onManualLineQtyChange,
  onManualLinePriceChange,
  updateManualTotals,
  onManualLineBatchChange,
  onManualLineExpChange,
  setManualLineQuickExp,
  onManualLineLocChange,
  removeManualReceiptLine,
  confirmClearAllManualReceiptLines,
  closeConfirmClearManualLinesModal,
  executeClearAllManualReceiptLines,
  submitManualReceipt
} from './manual-modal';

export * from './types';
export * from './helpers';
export * from './po-list';
export * from './po-modal';
export * from './history';
export * from './manual-modal';

// Attach all functions & globals to window for complete backwards compatibility
const win = window as any;

win.gFnbReceiptCurrentView = win.gFnbReceiptCurrentView || 'po';
win.gFnbPoList = win.gFnbPoList || [];
win.gReceiptLines = win.gReceiptLines || [];
win.gManualReceiptLines = win.gManualReceiptLines || [];
win.gManualSiteCatalog = win.gManualSiteCatalog || [];
win.gManualShowAllCatalog = win.gManualShowAllCatalog || false;

// Helpers
win.getActiveFnbReceiptSite = getActiveFnbReceiptSite;
win.formatReceiptDateYMD = formatReceiptDateYMD;
win.getReceiptExpWarningHtml = getReceiptExpWarningHtml;

// PO List View
win.switchFnbReceiptSubView = switchFnbReceiptSubView;
win.loadFnbReceipts = loadFnbReceipts;
win.onFnbPoSearchInput = onFnbPoSearchInput;
win.loadFnbPoList = loadFnbPoList;
win.renderFnbPoTable = renderFnbPoTable;

// PO Receipt Modal
win.openPoReceiptModal = openPoReceiptModal;
win.renderReceiptLinesTable = renderReceiptLinesTable;
win.onReceiptLineQtyChange = onReceiptLineQtyChange;
win.onReceiptLineBatchChange = onReceiptLineBatchChange;
win.onReceiptLineExpChange = onReceiptLineExpChange;
win.setReceiptLineQuickExp = setReceiptLineQuickExp;
win.onReceiptLineNoteChange = onReceiptLineNoteChange;
win.closeCreateReceiptModal = closeCreateReceiptModal;
win.openCreateReceiptModal = openCreateReceiptModal;
win.submitCreateReceipt = submitCreateReceipt;

// History & Detail
win.loadFnbReceiptsHistory = loadFnbReceiptsHistory;
win.renderFnbReceiptsHistoryTable = renderFnbReceiptsHistoryTable;
win.viewReceiptDetail = viewReceiptDetail;
win.openEditReceiptModal = openEditReceiptModal;
win.onEditReceiptLineQtyChange = onEditReceiptLineQtyChange;
win.onEditReceiptLinePriceChange = onEditReceiptLinePriceChange;
win.onEditReceiptLineBatchChange = onEditReceiptLineBatchChange;
win.onEditReceiptLineExpChange = onEditReceiptLineExpChange;
win.removeEditReceiptLine = removeEditReceiptLine;
win.closeEditReceiptModal = closeEditReceiptModal;
win.saveEditReceipt = saveEditReceipt;
win.confirmDeleteReceipt = confirmDeleteReceipt;
win.closeDeleteReceiptModal = closeDeleteReceiptModal;
win.executeDeleteReceipt = executeDeleteReceipt;

// Manual Receipt Modal
win.openManualReceiptModal = openManualReceiptModal;
win.closeManualReceiptModal = closeManualReceiptModal;
win.onManualReceiptSiteChange = onManualReceiptSiteChange;
win.toggleManualShowAllCatalog = toggleManualShowAllCatalog;
win.loadManualCatalogItems = loadManualCatalogItems;
win.filterManualCatalogList = filterManualCatalogList;
win.addManualReceiptItem = addManualReceiptItem;
win.renderManualReceiptLinesTable = renderManualReceiptLinesTable;
win.onManualLineQtyChange = onManualLineQtyChange;
win.onManualLinePriceChange = onManualLinePriceChange;
win.updateManualTotals = updateManualTotals;
win.onManualLineBatchChange = onManualLineBatchChange;
win.onManualLineExpChange = onManualLineExpChange;
win.setManualLineQuickExp = setManualLineQuickExp;
win.onManualLineLocChange = onManualLineLocChange;
win.removeManualReceiptLine = removeManualReceiptLine;
win.removeManualLine = removeManualReceiptLine;
win.confirmClearAllManualReceiptLines = confirmClearAllManualReceiptLines;
win.clearAllManualReceiptLines = confirmClearAllManualReceiptLines;
win.closeConfirmClearManualLinesModal = closeConfirmClearManualLinesModal;
win.executeClearAllManualReceiptLines = executeClearAllManualReceiptLines;
win.submitManualReceipt = submitManualReceipt;
