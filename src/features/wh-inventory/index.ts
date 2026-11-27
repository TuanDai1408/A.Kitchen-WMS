import {
  gWhInventoryData,
  gWhFilteredInventory,
  loadWhInventory,
  filterWhInventoryTable,
  changeWhInvPage,
  changeWhInvPageSize
} from './inventory-table';

import {
  gWhActiveHistory,
  gWhActiveBatches,
  openWhItemHistoryModal,
  openWhItemBatchesModal
} from './item-modals';

import {
  gWhReceivedOrders,
  gWhCurrentReceivedDetail,
  switchWhInvSubView,
  populateWhReceivedOrdersSiteFilter,
  loadWhReceivedOrders,
  filterWhReceivedOrdersTable,
  renderWhReceivedOrdersTable,
  openWhReceivedOrderDetail,
  closeWhReceivedOrderDetailModal,
  onWhRecModalCancelClick,
  confirmCancelReceivedOrder,
  closeConfirmCancelReceiptModal,
  onCancelReceiptAckChange,
  executeCancelReceivedOrder
} from './received-orders';

import {
  exportWhInventoryToExcel,
  exportWhItemHistoryToExcel
} from './export';

export * from './types';
export * from './inventory-table';
export * from './item-modals';
export * from './received-orders';
export * from './export';

// Bind to window for HTML inline handlers & backwards compatibility
if (typeof window !== 'undefined') {
  const w = window as any;

  w.gWhInventoryData = gWhInventoryData;
  w.gWhFilteredInventory = gWhFilteredInventory;
  w.gWhActiveHistory = gWhActiveHistory;
  w.gWhActiveBatches = gWhActiveBatches;
  w.gWhReceivedOrders = gWhReceivedOrders;
  w.gWhCurrentReceivedDetail = gWhCurrentReceivedDetail;

  w.loadWhInventory = loadWhInventory;
  w.loadPoSap = loadWhInventory; // Alias for compatibility
  w.filterWhInventoryTable = filterWhInventoryTable;
  w.changeWhInvPage = changeWhInvPage;
  w.changeWhInvPageSize = changeWhInvPageSize;

  w.openWhItemHistoryModal = openWhItemHistoryModal;
  w.openWhItemBatchesModal = openWhItemBatchesModal;

  w.switchWhInvSubView = switchWhInvSubView;
  w.populateWhReceivedOrdersSiteFilter = populateWhReceivedOrdersSiteFilter;
  w.loadWhReceivedOrders = loadWhReceivedOrders;
  w.filterWhReceivedOrdersTable = filterWhReceivedOrdersTable;
  w.renderWhReceivedOrdersTable = renderWhReceivedOrdersTable;
  w.openWhReceivedOrderDetail = openWhReceivedOrderDetail;
  w.closeWhReceivedOrderDetailModal = closeWhReceivedOrderDetailModal;
  w.onWhRecModalCancelClick = onWhRecModalCancelClick;
  w.confirmCancelReceivedOrder = confirmCancelReceivedOrder;
  w.closeConfirmCancelReceiptModal = closeConfirmCancelReceiptModal;
  w.onCancelReceiptAckChange = onCancelReceiptAckChange;
  w.executeCancelReceivedOrder = executeCancelReceivedOrder;

  w.exportWhInventoryToExcel = exportWhInventoryToExcel;
  w.exportWhItemHistoryToExcel = exportWhItemHistoryToExcel;
}
