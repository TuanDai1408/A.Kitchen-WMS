export type WhInventoryFilterStatus = 'ALL' | 'HAS_RECEIPT' | 'IN_STOCK' | 'HAS_BATCH' | 'NEGATIVE';

export interface WhInventoryItem {
  sku: string;
  name?: string;
  category?: string;
  unit?: string;
  site_code?: string;
  opening_qty?: number | string;
  receipt_qty?: number | string;
  sales_bom_qty?: number | string;
  waste_qty?: number | string;
  book_qty?: number | string;
  unit_price?: number | string;
  total_value?: number | string;
  batch_count?: number | string;
  last_receipt_date?: string | null;
  last_count_date?: string | null;
}

export interface WhTransactionHistoryItem {
  doc_date?: string;
  doc_no?: string;
  trans_type?: string;
  trans_name?: string;
  batch_code?: string;
  exp_date?: string;
  qty_in?: number | string;
  qty_out?: number | string;
  unit_price?: number | string;
  amount?: number | string;
  partner_name?: string;
  notes?: string;
}

export interface WhBatchItem {
  batch_code?: string;
  site_code?: string;
  storage_loc?: string;
  exp_date?: string;
  days_left?: number;
  status?: 'GOOD' | 'NEAR_EXPIRY' | 'EXPIRED' | string;
  initial_qty?: number | string;
  current_qty?: number | string;
  receipt_code?: string;
}

export interface WhReceivedOrder {
  id?: string | number;
  po_number?: string;
  receipt_code?: string;
  doc_type?: string;
  site_code?: string;
  receipt_date?: string;
  supplier?: string;
  notes?: string;
  item_count?: number;
  total_qty?: number;
  total_amount?: number;
  created_by?: string;
}

export interface WhReceivedOrderLine {
  item_code: string;
  item_name: string;
  unit: string;
  qty: number;
  unit_price: number;
  amount: number;
  batch_code?: string;
  exp_date?: string | null;
}
