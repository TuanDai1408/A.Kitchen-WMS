export interface StockAlertItem {
  sku: string;
  item_name?: string;
  category?: string;
  unit?: string;
  batch_code?: string;
  exp_date?: string;
  qty: number | string;
  safety_stock?: number | string;
  days_left?: number;
  alert_level?: 'OUT_OF_STOCK' | 'NEAR_EXPIRY' | 'LOW_STOCK' | string;
}

export interface InboundOutboundChartData {
  categories?: string[];
  inbound?: number[];
  outbound?: number[];
}

export interface DashboardSummaryData {
  critical_exp_count?: number;
  rop_reorder_count?: number;
  avg_lead_time?: number;
  total_skus?: number;
  total_qty?: number;
  total_value?: number;
  slow_moving_count?: number;
  safety_rate?: number;
  alerts?: StockAlertItem[];
  chart_inbound_outbound?: InboundOutboundChartData;
}
