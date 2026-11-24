import { loadReorderROP, renderRopTable } from './rop-table';
import { loadLeadTime, renderLeadTimeTable, filterLeadTimeSla } from './leadtime-table';
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
  w.loadLeadTime = loadLeadTime;
  w.renderLeadTimeTable = renderLeadTimeTable;
  w.filterLeadTimeSla = filterLeadTimeSla;
  w.downloadRopExcel = downloadRopExcel;
}
