/**
 * Purchase Orders and Goods Receipts Type Definitions for A.Kitchen WMS
 */

export type POStatus = 'OPEN' | 'PARTIAL' | 'COMPLETED' | 'CANCELLED';

export interface PurchaseOrder {
  po_number: string;
  supplier_name: string;
  supplier_code: string;
  doc_date: string;
  status: POStatus;
  item_count: number;
  total_qty: number;
  total_amount: number;
  site_code: string;
}

export interface POLine {
  id?: number;
  po_number: string;
  sku: string;
  item_name: string;
  unit: string;
  ordered_qty: number;
  received_qty: number;
  unit_price: number;
  subtotal: number;
  mfg_date?: string;
  exp_date?: string;
  batch_no?: string;
}

export interface GoodsReceipt {
  receipt_code: string;
  po_number?: string;
  doc_date: string;
  site_code: string;
  supplier_name: string;
  supplier_code?: string;
  total_qty: number;
  total_amount: number;
  created_by: string;
  created_at: string;
  note?: string;
  is_manual?: boolean;
}

export interface ReceiptLine {
  receipt_code: string;
  sku: string;
  item_name: string;
  unit: string;
  qty: number;
  unit_price: number;
  subtotal: number;
  batch_no: string;
  mfg_date: string;
  exp_date: string;
  storage_loc?: string;
}

export interface ManualReceiptItem {
  sku: string;
  item_name: string;
  unit: string;
  qty: number;
  unit_price: number;
  batch_no: string;
  mfg_date: string;
  exp_date: string;
  storage_loc: string;
}
