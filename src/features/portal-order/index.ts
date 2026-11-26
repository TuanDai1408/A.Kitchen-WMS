import {
  getAppItems,
  setAppItems,
  renderOrderTable,
  filterItems,
  onQtyChange,
  calcBudget,
  renderOrderCartSummary,
  removeOrderCartItem,
  clearOrderCart
} from './order-table';
import {
  loadQuota,
  reviewOrder,
  submitOrder
} from './order-actions';

export * from './types';
export * from './order-table';
export * from './order-actions';

// Attach all functions to window for 100% backward compatibility
const win = window as any;

win.loadQuota = loadQuota;
win.renderOrderTable = renderOrderTable;
win.filterItems = filterItems;
win.onQtyChange = onQtyChange;
win.calcBudget = calcBudget;
win.renderOrderCartSummary = renderOrderCartSummary;
win.removeOrderCartItem = removeOrderCartItem;
win.clearOrderCart = clearOrderCart;
win.reviewOrder = reviewOrder;
win.submitOrder = submitOrder;
win.getAppOrderItems = getAppItems;
win.setAppOrderItems = setAppItems;
