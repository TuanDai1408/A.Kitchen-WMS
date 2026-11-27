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

export function getCleanInitials(name: string | null | undefined): string {
  if (!name) return 'U';
  try {
    const cleaned = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
    const parts = cleaned.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } catch {
    return 'U';
  }
}

/**
 * Thu gọn chiều cao bảng danh sách mặt hàng chính khi bảng con tóm tắt mở ra,
 * giúp giữ khoảng trống hiển thị cả 2 bảng và tránh bảng con đè lên danh sách.
 */
export function adjustListHeightForSubTable(
  hasSelected: boolean,
  desktopId: string,
  mobileId: string,
  fullDesktopMaxH = '480px',
  fullMobileMaxH = '460px'
): void {
  const apply = (id: string, targetMaxH: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transition = 'max-height 180ms ease';
    el.style.maxHeight = targetMaxH;
  };
  apply(desktopId, hasSelected ? '280px' : fullDesktopMaxH);
  apply(mobileId, hasSelected ? '240px' : fullMobileMaxH);
}

export interface PaginationDomIds {
  startId: string;
  endId: string;
  totalId: string;
  badgeId: string;
  prevId: string;
  nextId: string;
}

/**
 * Cắt trang dữ liệu và cập nhật đồng bộ thanh phân trang chuẩn FEFO.
 */
export function paginateList<T>(
  items: T[],
  requestedPage: number,
  pageSize: number,
  ids: PaginationDomIds
): { pagedItems: T[]; page: number; startIdx: number; totalPages: number } {
  const total = items.length;
  const safeSize = Math.max(1, Number(pageSize) || 25);
  const totalPages = Math.ceil(total / safeSize) || 1;
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const startIdx = (page - 1) * safeSize;
  const pagedItems = items.slice(startIdx, startIdx + safeSize);

  const startEl = document.getElementById(ids.startId);
  const endEl = document.getElementById(ids.endId);
  const totalEl = document.getElementById(ids.totalId);
  const badgeEl = document.getElementById(ids.badgeId);
  const prevBtn = document.getElementById(ids.prevId) as HTMLButtonElement | null;
  const nextBtn = document.getElementById(ids.nextId) as HTMLButtonElement | null;

  if (startEl) startEl.textContent = total === 0 ? '0' : String(startIdx + 1);
  if (endEl) endEl.textContent = String(Math.min(startIdx + safeSize, total));
  if (totalEl) totalEl.textContent = String(total);
  if (badgeEl) badgeEl.textContent = `${page} / ${totalPages}`;
  if (prevBtn) prevBtn.disabled = page <= 1;
  if (nextBtn) nextBtn.disabled = page >= totalPages;

  return { pagedItems, page, startIdx, totalPages };
}
