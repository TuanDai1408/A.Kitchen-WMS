export type CountStatusFilter = 'all' | 'diff' | 'matched' | 'counted' | 'uncounted';

export interface FnbCountItem {
  id?: string | number;
  code: string;
  name: string;
  unit: string;
  unit_price: number;
  book_qty: number;
  last_count_qty: number | null;
  last_count_date: string | null;
  nganh_hang?: string;
  nhom_hang?: string;
  item_group?: string;
  userCount?: number;
  userNote?: string;
}

export interface FnbCountSlip {
  id: number;
  count_code: string;
  site_code: string;
  count_date: string;
  count_type: string;
  total_items: number;
  diff_items: number;
  diff_value: number;
  notes?: string;
  created_at?: string;
}

export interface FnbCountLine {
  item_code: string;
  item_name?: string;
  item_group?: string;
  unit?: string;
  unit_price: number;
  book_qty: number;
  actual_qty: number;
  count_qty?: number;
  diff_qty: number;
  diff_value: number;
  diff_val?: number;
  note?: string;
}
