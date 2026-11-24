/**
 * Kitchen Supplies Ordering & Journey Type Definitions for A.Kitchen WMS
 */

export type OrderStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface KitchenOrder {
  order_code: string;
  site_code: string;
  site_name: string;
  month: string;
  order_date: string;
  status: OrderStatus;
  total_items: number;
  total_amount: number;
  created_by: string;
  note?: string;
  journey_step?: number;
}

export interface OrderItem {
  sku: string;
  name: string;
  unit: string;
  unit_price: number;
  category: string;
  order_qty: number;
  subtotal: number;
  cumulative_ordered: number;
  quota_max?: number;
}

export interface OrderJourneyStep {
  step: number;
  title: string;
  desc: string;
  date?: string;
  by?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}
