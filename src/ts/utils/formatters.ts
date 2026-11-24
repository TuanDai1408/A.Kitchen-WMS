/**
 * High-Performance Typed Formatting and Utility Helpers
 */

export function formatVND(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n)) return '0 ₫';
  return Math.round(n).toLocaleString('vi-VN') + ' ₫';
}

export function formatCompactVND(n: number | null | undefined): { val: string; unit: string; full: string } {
  if (n === null || n === undefined || isNaN(n)) {
    return { val: '—', unit: '', full: '—' };
  }
  const num = Number(n);
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  const full = num.toLocaleString('vi-VN') + ' ₫';

  if (abs >= 1e9) {
    const formatted = (abs / 1e9).toLocaleString('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    return { val: sign + formatted, unit: 'tỷ ₫', full };
  } else if (abs >= 1e6) {
    const formatted = (abs / 1e6).toLocaleString('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    });
    return { val: sign + formatted, unit: 'tr ₫', full };
  } else {
    return { val: sign + abs.toLocaleString('vi-VN'), unit: '₫', full };
  }
}

export function formatDateYMD(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '—';
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim())) {
    return dateInput.trim();
  }
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return String(dateInput);
  }
}

export function formatDate(val: string | Date | null | undefined): string {
  if (!val) return '—';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return String(val);
  }
}

export function formatNumber(n: number | null | undefined, decimals = 1): string {
  if (n === null || n === undefined || isNaN(n)) return '0';
  return Number(n).toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

export function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  wait = 200
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}
