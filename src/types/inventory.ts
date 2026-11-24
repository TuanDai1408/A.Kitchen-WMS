/**
 * Inventory, FEFO Batches, and Waste Type Definitions for A.Kitchen WMS
 */

export type FefoStatus = 'SAFE' | 'WARNING_30' | 'EXPIRED';

export interface StockBatch {
  batch_no: string;
  sku: string;
  site_code: string;
  mfg_date: string;
  exp_date: string;
  initial_qty: number;
  current_qty: number;
  storage_loc: string;
  status: FefoStatus;
  receipt_code: string;
}

export interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  unit: string;
  min_stock: number;
  current_stock: number;
  avg_cost: number;
  total_value: number;
  storage_loc: string;
  fefo_priority_batch?: string;
  fefo_priority_exp?: string;
  rop_status?: 'NORMAL' | 'WARN_ROP' | 'CRITICAL_OUT';
}

export interface WasteRecord {
  waste_code: string;
  doc_date: string;
  site_code: string;
  reason: string;
  total_amount: number;
  confirmed_by: string;
  created_by: string;
  note?: string;
  items: WasteLine[];
}

export interface WasteLine {
  sku: string;
  item_name: string;
  unit: string;
  qty: number;
  unit_price: number;
  total_amount: number;
  reason?: string;
}
