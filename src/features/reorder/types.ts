export type RopStatus = 'AN TOÀN' | 'CẦN ĐẶT' | 'HẾT HÀNG' | string;

export interface RopItem {
  sku: string;
  item_name: string;
  unit?: string;
  uom?: string;
  category?: string;
  daily_usage?: number | string;
  lead_time_hours?: number | string;
  lead_time_days?: number | string;
  safety_stock?: number | string;
  standard_cost_sap?: number | string;
  current_stock?: number | string;
  rop_threshold?: number | string;
  rop?: number | string;
  suggested_order_qty?: number | string;
  suggested_order?: number | string;
  status?: RopStatus;
}

export type SlaFilter = 'ALL' | 'ON_TIME' | 'DELIVERING' | 'LATE';

export interface LeadTimeItem {
  po_number: string;
  branch_code?: string;
  site?: string;
  supplier_name?: string;
  vendor_name?: string;
  order_date?: string;
  order_time?: string;
  actual_delivery_date?: string | null;
  received_time?: string | null;
  committed_lead_time_days?: number | string;
  actual_lead_time_days?: number | string | null;
  lead_time_hours?: number | string;
  sla_target_hours?: number | string;
  status?: string;
  sla_status?: string;
  total_amount?: number | string;
}
