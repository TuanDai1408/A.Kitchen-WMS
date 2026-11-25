import { formatVND, formatNumber, formatDate } from '@/ts/utils/formatters';
import { canUserEdit, canUserDelete, isMasterAccount } from '@/features/auth';

declare function cellCode(code: string): string;
declare function cellDate(dateStr: string): string;
declare function cellPerson(name: string): string;
declare function cellBadge(type: string, text: string): string;
declare function getAppCurrentUser(): any;

export function safeCellCode(code: string): string {
  if (typeof (window as any).cellCode === 'function') {
    return (window as any).cellCode(code);
  }
  return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${code}</span>`;
}

export function safeCellDate(dateStr: string): string {
  if (typeof (window as any).cellDate === 'function') {
    return (window as any).cellDate(dateStr);
  }
  return `<span class="tabular-nums text-xs text-gray-500">${fmtDate(dateStr)}</span>`;
}

export function safeCellPerson(name: string): string {
  if (typeof (window as any).cellPerson === 'function') {
    return (window as any).cellPerson(name);
  }
  return `<span class="text-xs font-medium text-gray-700 dark:text-gray-300">${safeEscapeHtml(name || '—')}</span>`;
}

export function safeCellBadge(type: string, text: string): string {
  if (typeof (window as any).cellBadge === 'function') {
    return (window as any).cellBadge(type, text);
  }
  return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${text}</span>`;
}

export function safeEscapeHtml(str: string | null | undefined): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

export function fmtDate(val: string | undefined | null): string {
  if (!val) return '—';
  if (typeof (window as any).fmtDate === 'function') {
    return (window as any).fmtDate(val);
  }
  return formatDate(val);
}

export function canEditOrders(order?: any): boolean {
  const win = window as any;
  const user = (typeof getAppCurrentUser === 'function' ? getAppCurrentUser() : null) || win.gCurrentUser;
  if (!user) return false;

  // Master Account luôn có quyền
  if (isMasterAccount(user.email)) return true;

  // Kiểm tra quyền SỬA tập trung
  const hasEditPerm = canUserEdit('portal-history') || canUserEdit('portal-order');
  if (!hasEditPerm) return false;

  if (user.role === 'ADMIN' || user.role === 'KHO_TRUONG' || user.role === 'SUPER_ADMIN') return true;

  if (user.role === 'BEP_TRUONG') {
    if (!order) return true;
    const st = (order.trangThai || order.status || '').toUpperCase();
    return st.includes('MỚI') || st.includes('CHỜ') || st.includes('PENDING') || st === '';
  }
  return false;
}

export function canDeleteOrders(order?: any): boolean {
  const win = window as any;
  const user = (typeof getAppCurrentUser === 'function' ? getAppCurrentUser() : null) || win.gCurrentUser;
  if (!user) return false;

  // Master Account luôn có quyền
  if (isMasterAccount(user.email)) return true;

  // QUY TẮC BẢO VỆ: Thao tác XÓA chỉ được thực hiện bởi user được phân quyền Xóa (canDelete: true)
  const hasDeletePerm = canUserDelete('portal-history') || canUserDelete('portal-order');
  if (!hasDeletePerm) return false;

  if (user.role === 'ADMIN' || user.role === 'KHO_TRUONG' || user.role === 'SUPER_ADMIN') return true;

  if (user.role === 'BEP_TRUONG') {
    if (!order) return true;
    const st = (order.trangThai || order.status || '').toUpperCase();
    return st.includes('MỚI') || st.includes('CHỜ') || st.includes('PENDING') || st === '';
  }
  return false;
}

export function canAuthenticateJourney(_order?: any): boolean {
  const win = window as any;
  const user = (typeof getAppCurrentUser === 'function' ? getAppCurrentUser() : null) || win.gCurrentUser;
  if (!user) return false;
  if (user.role === 'ADMIN' || user.role === 'KHO_TRUONG' || user.role === 'SUPER_ADMIN') return true;
  if (user.permissions && typeof user.permissions === 'object') {
    const pHistory = user.permissions['portal-history'];
    const pOrder = user.permissions['portal-order'];
    if (pHistory && (pHistory.canAuthenticate !== undefined || pHistory.canVerify !== undefined || pHistory.canEdit !== undefined)) {
      return Boolean(pHistory.canAuthenticate || pHistory.canVerify || pHistory.canEdit);
    }
    if (pOrder && (pOrder.canAuthenticate !== undefined || pOrder.canVerify !== undefined || pOrder.canEdit !== undefined)) {
      return Boolean(pOrder.canAuthenticate || pOrder.canVerify || pOrder.canEdit);
    }
  }
  return false;
}
