import {
  loadDashboardSummary,
  updateTailadminDashboard,
  renderStockAlertsTable,
  updateApexChartsTheme
} from './dashboard';

export * from './types';
export * from './dashboard';

// Bind to window for HTML inline calls
if (typeof window !== 'undefined') {
  const w = window as any;
  w.loadDashboardSummary = loadDashboardSummary;
  w.updateTailadminDashboard = updateTailadminDashboard;
  w.renderStockAlertsTable = renderStockAlertsTable;
  w.updateApexChartsTheme = updateApexChartsTheme;
}
