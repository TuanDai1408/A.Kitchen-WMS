export type WasteSubView = 'stock' | 'history';

export interface FnbWasteStockItem {
  code: string;
  name: string;
  unit: string;
  book_qty: number;
  unit_price: number;
  total_value?: number;
  nganh_hang?: string;
  nhom_hang?: string;
  item_group?: string;
  days_remaining?: number;
  is_expired?: boolean;
  wasteQty: number;
  wasteReason: string;
  wasteNote: string;
}

export interface WasteLinePayload {
  item_code: string;
  qty: number;
  unit_price: number;
  reason_detail: string;
  note: string;
}

export interface WasteRecordHeader {
  id: number;
  waste_code: string;
  site_code: string;
  waste_date: string;
  reason: string;
  confirmed_by?: string;
  total_amount: number;
  notes?: string;
  created_by?: string;
  created_at?: string;
}

export interface WasteDetailLine {
  item_code: string;
  item_name?: string;
  unit?: string;
  qty: number;
  unit_price: number;
  amount: number;
  reason_detail?: string;
  note?: string;
}
