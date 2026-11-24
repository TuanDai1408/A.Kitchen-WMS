import { formatVND, formatNumber } from '@/ts/utils/formatters';

declare function cellCode(code: string): string;
declare function cellBadge(type: string, text: string): string;
declare function escapeHtml(str: string): string;

export function safeCellCode(code: string): string {
  if (typeof (window as any).cellCode === 'function') {
    return (window as any).cellCode(code);
  }
  return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${code}</span>`;
}

export function safeCellBadge(type: string, text: string): string {
  if (typeof (window as any).cellBadge === 'function') {
    return (window as any).cellBadge(type, text);
  }
  return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${text}</span>`;
}

export function safeEscapeHtml(str: string): string {
  if (typeof (window as any).escapeHtml === 'function') {
    return (window as any).escapeHtml(str);
  }
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

export function fmtVND(val: number | string | undefined | null): string {
  if (typeof (window as any).fmtVND === 'function') {
    return (window as any).fmtVND(val);
  }
  return formatVND(Number(val) || 0);
}

export function fmtNum(val: number | string | undefined | null): string {
  if (typeof (window as any).fmtNum === 'function') {
    return (window as any).fmtNum(val);
  }
  return formatNumber(Number(val) || 0);
}
