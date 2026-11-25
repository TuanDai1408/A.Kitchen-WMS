export interface KitchenStockItem {
  id: number | string;
  code: string;
  name: string;
  item_group?: string;
  nganh_hang?: string;
  nhom_hang?: string;
  unit: string;
  unit_price: number;
  book_qty: number;
  // Dynamic fields for issue form
  selected?: boolean;
  issueQty?: number;
  issueNote?: string;
}

export interface KitchenIssueLine {
  id?: number | string;
  issue_id?: number | string;
  item_code: string;
  item_name: string;
  unit: string;
  stock_before: number;
  qty: number;
  unit_price: number;
  amount: number;
  notes?: string;
}

export interface KitchenIssueSlip {
  id: number | string;
  issue_code: string;
  site_code: string;
  issue_date: string;
  meal_shift: string;
  issuer_name: string;
  receiver_name: string;
  total_items: number;
  total_qty: number;
  total_amount: number;
  notes?: string;
  created_at?: string;
  lines?: KitchenIssueLine[];
}
