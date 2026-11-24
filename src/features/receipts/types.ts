export type ReceiptSubView = 'po' | 'history';

export interface PoItemLine {
  item_code: string;
  item_name?: string;
  order_qty: number;
  received_qty?: number;
  actual_qty?: number;
  unit?: string;
  unit_price?: number;
  merch_category?: string;
  is_food?: boolean;
  batch_code?: string;
  exp_date?: string | null;
  note?: string;
}

export interface FnbPoHeader {
  po_number: string;
  po_date?: string;
  order_date?: string;
  vendor_code?: string;
  vendor_name?: string;
  supplier?: string;
  site_code?: string;
  status: 'OPEN' | 'PARTIAL' | 'COMPLETED' | string;
  total_order_qty?: number;
  total_received_qty?: number;
  total_lines?: number;
  lines?: PoItemLine[];
}

export interface FnbReceiptRecord {
  id: number;
  receipt_code: string;
  site_code: string;
  receipt_date: string;
  supplier: string;
  invoice_no?: string;
  total_amount: number;
  created_by?: string;
  notes?: string;
  created_at?: string;
}

export interface FnbReceiptDetailLine {
  item_code: string;
  item_name?: string;
  unit?: string;
  qty: number;
  unit_price: number;
  amount: number;
  batch_code?: string;
  exp_date?: string | null;
  storage_loc?: string;
  note?: string;
}

export interface ManualReceiptLineDraft {
  item_code: string;
  item_name: string;
  unit: string;
  merch_category?: string;
  qty: number;
  unit_price: number;
  batch_code: string;
  exp_date: string;
  storage_loc: string;
  note: string;
}

export interface SiteCatalogItem {
  item_code: string;
  item_name: string;
  unit?: string;
  unit_price?: number;
  merch_category?: string;
  stock_qty?: number;
}
