import type { DangerLevel, StockFefoItem } from './types';
import { formatNumber } from '@/ts/utils/formatters';

export function getDangerBadgeClass(danger?: DangerLevel): string {
  if (danger === 'red') {
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse';
  }
  if (danger === 'yellow') {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
  }
  return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
}

export function getExpBadgeClass(danger?: DangerLevel): string {
  if (danger === 'red') {
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800';
  }
  if (danger === 'yellow') {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
  }
  return 'bg-gray-50 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300 border-gray-200/70 dark:border-gray-700/60';
}

export function getDaysRemainingText(daysLeft: number, qty: number): string {
  if (daysLeft <= 0) {
    return qty < 0 ? 'Tồn âm' : 'Hết hàng';
  }
  return `${daysLeft} ngày`;
}

export function getDaysRemainingMobileText(daysLeft: number, qty: number): string {
  if (daysLeft <= 0) {
    return qty < 0 ? 'Tồn âm' : 'Hết hàng';
  }
  return `Còn ${daysLeft} ngày`;
}

export function getDaysTextColor(danger?: DangerLevel): string {
  if (danger === 'red') return 'text-rose-600 dark:text-rose-400';
  if (danger === 'yellow') return 'text-amber-600 dark:text-amber-400';
  return 'text-emerald-600 dark:text-emerald-400';
}

export function getExpDateColor(danger?: DangerLevel): string {
  if (danger === 'red') return 'text-rose-600 dark:text-rose-400';
  if (danger === 'yellow') return 'text-amber-600 dark:text-amber-400';
  return 'text-gray-900 dark:text-white';
}

export function formatBatchCode(item: StockFefoItem): string {
  return item.batch_code || item.batch_no || item.site_code || 'KHO';
}

export function formatUnit(item: StockFefoItem): string {
  return item.unit || item.uom || 'Phần';
}

export function parseQty(qty: number | string | undefined): number {
  if (typeof qty === 'number') return qty;
  return parseFloat(qty || '0') || 0;
}

export function formatItemQty(qty: number | string | undefined): string {
  const n = parseQty(qty);
  return formatNumber(n, 2);
}
