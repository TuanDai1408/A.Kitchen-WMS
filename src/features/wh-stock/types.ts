export type DangerLevel = 'green' | 'yellow' | 'red';

export interface StockFefoItem {
  id?: string;
  sku: string;
  item_name: string;
  category?: string;
  unit?: string;
  uom?: string;
  batch_code?: string;
  batch_no?: string;
  site_code?: string;
  branch_code?: string;
  branch_name?: string;
  exp_date?: string;
  qty: number | string;
  total_value?: number | string;
  standard_cost_sap?: number | string;
  safety_stock?: number | string;
  days_remaining?: number;
  days_left?: number;
  fefo_priority?: number;
  danger_level?: DangerLevel;
  status_text?: string;
  lead_time_hours?: number;
}

export type StockSortColumn = 'fefo_priority' | 'sku' | 'item_name' | 'exp_date' | 'qty' | 'days_remaining';
export type StockSortOrder = 'asc' | 'desc';
