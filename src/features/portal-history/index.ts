import {
  renderJourneyBadge,
  renderHsOrdersList,
  filterHsOrders,
  loadHistory,
  viewOrderDetail
} from './history-list';
import {
  STANDARD_STEPS,
  renderJourneyTimeline,
  openOrderJourneyModal,
  closeOrderJourneyModal,
  submitJourneyStep
} from './journey-modal';
import {
  openEditOrderModal,
  closeEditOrderModal,
  renderEditOrderItems,
  updateEditOrderItemQty,
  removeEditOrderItemLine,
  addEditOrderItemLine,
  recalcEditOrderTotals,
  saveEditOrder,
  confirmDeleteOrder,
  closeDeleteOrderModal,
  executeDeleteOrder
} from './edit-delete-modal';
import {
  canEditOrders,
  canDeleteOrders,
  canAuthenticateJourney
} from './helpers';

export * from './types';
export * from './history-list';
export * from './journey-modal';
export * from './edit-delete-modal';
export { canEditOrders, canDeleteOrders, canAuthenticateJourney };

// Attach all functions & state to window for 100% backward compatibility
const win = window as any;

win.renderJourneyBadge = renderJourneyBadge;
win.renderHsOrdersList = renderHsOrdersList;
win.filterHsOrders = filterHsOrders;
win.loadHistory = loadHistory;
win.viewOrderDetail = viewOrderDetail;

win.canEditOrders = canEditOrders;
win.canDeleteOrders = canDeleteOrders;
win.canAuthenticateJourney = canAuthenticateJourney;

win.STANDARD_STEPS = STANDARD_STEPS;
win.renderJourneyTimeline = renderJourneyTimeline;
win.openOrderJourneyModal = openOrderJourneyModal;
win.closeOrderJourneyModal = closeOrderJourneyModal;
win.submitJourneyStep = submitJourneyStep;

win.openEditOrderModal = openEditOrderModal;
win.closeEditOrderModal = closeEditOrderModal;
win.renderEditOrderItems = renderEditOrderItems;
win.updateEditOrderItemQty = updateEditOrderItemQty;
win.removeEditOrderItemLine = removeEditOrderItemLine;
win.addEditOrderItemLine = addEditOrderItemLine;
win.recalcEditOrderTotals = recalcEditOrderTotals;
win.saveEditOrder = saveEditOrder;

win.confirmDeleteOrder = confirmDeleteOrder;
win.closeDeleteOrderModal = closeDeleteOrderModal;
win.executeDeleteOrder = executeDeleteOrder;
