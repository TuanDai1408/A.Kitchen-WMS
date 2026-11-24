import {
  gFnbStockData,
  gFnbStockFilter,
  gFnbStockSearchTerm,
  loadFnbStock,
  renderFnbStock,
  onFnbStockFilterChange,
  onFnbStockSearch,
  onFnbStockToggleValue
} from './stock-matrix';
import { exportFnbStockExcel } from './export';

export * from './types';
export * from './stock-matrix';
export * from './export';

// Attach all functions & globals to window for complete backwards compatibility
const win = window as any;

win.gFnbStockData = gFnbStockData;
win.gFnbStockFilter = gFnbStockFilter;
win.gFnbStockSearchTerm = gFnbStockSearchTerm;
win.loadFnbStock = loadFnbStock;
win.renderFnbStock = renderFnbStock;
win.onFnbStockFilterChange = onFnbStockFilterChange;
win.onFnbStockSearch = onFnbStockSearch;
win.onFnbStockToggleValue = onFnbStockToggleValue;
win.exportFnbStockExcel = () => exportFnbStockExcel(win.gFnbStockData || gFnbStockData);
