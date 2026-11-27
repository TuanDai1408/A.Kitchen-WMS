import { loadReorderROP, renderRopTable, changeRopPage, changeRopPageSize, filterRopTable, setRopQuickStatusFilter } from './rop-table';
import { loadLeadTime, renderLeadTimeTable, filterLeadTimeSla, changeLeadTimePage, changeLeadTimePageSize } from './leadtime-table';
import { downloadRopExcel } from './export';

export * from './types';
export * from './rop-table';
export * from './leadtime-table';
export * from './export';

// Bind to window for HTML inline handlers & backwards compatibility
if (typeof window !== 'undefined') {
  const w = window as any;
  w.loadReorderROP = loadReorderROP;
  w.renderRopTable = renderRopTable;
  w.changeRopPage = changeRopPage;
  w.changeRopPageSize = changeRopPageSize;
  w.filterRopTable = filterRopTable;
  w.setRopQuickStatusFilter = setRopQuickStatusFilter;
  w.loadLeadTime = loadLeadTime;
  w.renderLeadTimeTable = renderLeadTimeTable;
  w.filterLeadTimeSla = filterLeadTimeSla;
  w.changeLeadTimePage = changeLeadTimePage;
  w.changeLeadTimePageSize = changeLeadTimePageSize;
  w.downloadRopExcel = downloadRopExcel;
}
