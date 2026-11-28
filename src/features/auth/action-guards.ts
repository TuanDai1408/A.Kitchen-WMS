import { isMasterAccount } from './constants';

/**
 * Lấy đối tượng người dùng hiện tại đang đăng nhập
 */
export function getCurrentAppUser(): any {
  if (typeof window !== 'undefined' && (window as any).gCurrentUser) {
    return (window as any).gCurrentUser;
  }
  try {
    const raw = localStorage.getItem('orbit_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u && typeof window !== 'undefined') {
        (window as any).gCurrentUser = u;
      }
      return u;
    }
  } catch {}
  return null;
}

/**
 * Kiểm tra xem người dùng hiện tại có quyền thực hiện hành động (edit | delete | create) trên một feature hay không.
 * 
 * QUY TẮC BẢO VỆ DỮ LIỆU:
 * 1. Master Owner (trantuandai2508): Luôn có toàn quyền (edit, delete, create).
 * 2. Tài khoản bị khóa (status === 'LOCKED'): Bị chặn toàn bộ mọi thao tác.
 * 3. Nếu người dùng có ma trận quyền cá nhân (user.permissions[featureCode]):
 *    - Nếu tab bị khóa (isRevoked === true hoặc canView === false): Chặn toàn bộ.
 *    - Nếu kiểm tra 'edit': ưu tiên giá trị canEdit từ ma trận.
 *    - Nếu kiểm tra 'delete': ưu tiên giá trị canDelete từ ma trận.
 *    - Nếu kiểm tra 'create': ưu tiên giá trị canCreate từ ma trận.
 * 4. Nếu chưa có cấu hình riêng trong ma trận (Fallback theo vai trò):
 *    - ADMIN: Được toàn quyền edit, delete, create trên các nghiệp vụ.
 *    - Non-Admin (KHO_TRUONG, BEP_TRUONG, KE_TOAN, NHAN_VIEN):
 *      + Thao tác XÓA ('delete'): Mặc định KHÔNG CÓ QUYỀN (phải được Admin cấp riêng).
 *      + Thao tác SỬA ('edit'): Chỉ được sửa trên các tab thuộc phạm vi phụ trách của vai trò.
 *      + Tuyệt đối không được sửa / xóa trong 'user-matrix' nếu không phải Admin.
 */
export function canUserPerformAction(featureCode: string, action: 'edit' | 'delete' | 'create'): boolean {
  const user = getCurrentAppUser();
  if (!user) return false;

  const userEmail = (user.email || '').toLowerCase().trim();

  // 1. Master Owner luôn có toàn quyền
  if (isMasterAccount(userEmail)) {
    return true;
  }

  // 2. Tài khoản bị khóa -> Chặn tuyệt đối
  if (user.status === 'LOCKED' || user.isLocked === true) {
    return false;
  }

  const role = user.role || user.roleCode || user.role_code || 'NHAN_VIEN';

  // 3. Kiểm tra ma trận phân quyền cá nhân
  if (user.permissions && typeof user.permissions === 'object') {
    const p = user.permissions[featureCode];
    if (p !== undefined) {
      // Nếu tab này bị thu hồi hoặc cấm xem -> Cấm cả sửa, xóa, tạo
      if (p.isRevoked === true || p.canView === false) {
        return false;
      }
      if (action === 'edit' && p.canEdit !== undefined) {
        return Boolean(p.canEdit);
      }
      if (action === 'delete' && p.canDelete !== undefined) {
        return Boolean(p.canDelete);
      }
      if (action === 'create' && p.canCreate !== undefined) {
        return Boolean(p.canCreate);
      }
    }
  }

  // 4. Nếu là ADMIN và không bị ma trận cấm rõ ràng
  if (role === 'ADMIN') {
    return true;
  }

  // 5. Đối với các vai trò Non-Admin:
  // QUY TẮC BẢO VỆ 1: Thao tác XÓA (Delete / Hủy) mặc định KHÔNG cho phép đối với non-admin
  // Trừ khi được Admin cấp quyền riêng canDelete = true trong ma trận user.permissions
  if (action === 'delete') {
    return false;
  }

  // QUY TẮC BẢO VỆ 2: Tab Quản trị User & Phân quyền ('user-matrix') chỉ dành cho ADMIN
  if (featureCode === 'user-matrix') {
    return false;
  }

  // QUY TẮC BẢO VỆ 3: Thao tác SỬA ('edit') theo vai trò nghiệp vụ
  if (action === 'edit') {
    if (role === 'KHO_TRUONG') {
      const allowed = ['fnb-stock', 'fnb-counts', 'fnb-receipts', 'fnb-kitchen-issue', 'wh-stock', 'wh-reorder', 'portal-order', 'portal-kiemke'];
      return allowed.includes(featureCode);
    }
    if (role === 'BEP_TRUONG') {
      const allowed = ['fnb-counts', 'fnb-receipts', 'fnb-kitchen-issue', 'fnb-waste', 'portal-order', 'portal-kiemke', 'portal-baocao'];
      return allowed.includes(featureCode);
    }
    if (role === 'KE_TOAN') {
      const allowed = ['portal-voucher', 'portal-search'];
      return allowed.includes(featureCode);
    }
    // NHAN_VIEN mặc định không được sửa dữ liệu hệ thống
    return false;
  }

  // QUY TẮC BẢO VỆ 4: Thao tác TẠO MỚI ('create') theo vai trò nghiệp vụ
  if (action === 'create') {
    if (role === 'KHO_TRUONG') {
      return ['fnb-stock', 'fnb-counts', 'fnb-receipts', 'fnb-kitchen-issue', 'wh-stock', 'wh-reorder', 'portal-order', 'portal-kiemke'].includes(featureCode);
    }
    if (role === 'BEP_TRUONG') {
      return ['fnb-counts', 'fnb-receipts', 'fnb-kitchen-issue', 'fnb-waste', 'portal-order', 'portal-kiemke', 'portal-baocao'].includes(featureCode);
    }
    if (role === 'KE_TOAN') {
      return ['portal-voucher', 'portal-search'].includes(featureCode);
    }
    if (role === 'NHAN_VIEN') {
      return ['portal-order', 'fnb-counts'].includes(featureCode);
    }
    return false;
  }

  return false;
}

/**
 * Kiểm tra quyền SỬA trên chức năng
 */
export function canUserEdit(featureCode: string): boolean {
  return canUserPerformAction(featureCode, 'edit');
}

/**
 * Kiểm tra quyền XÓA trên chức năng
 */
export function canUserDelete(featureCode: string): boolean {
  return canUserPerformAction(featureCode, 'delete');
}

/**
 * Kiểm tra quyền TẠO MỚI trên chức năng
 */
export function canUserCreate(featureCode: string): boolean {
  return canUserPerformAction(featureCode, 'create');
}

/**
 * Kiểm tra xem người dùng có quyền quản trị tài khoản & phân quyền hay không
 */
export function canUserManageUsers(): boolean {
  const user = getCurrentAppUser();
  if (!user) return false;
  if (isMasterAccount(user.email)) return true;
  if (user.status === 'LOCKED' || user.isLocked === true) return false;
  const role = user.role || user.roleCode || user.role_code;
  if (role === 'ADMIN') return true;

  if (user.permissions && typeof user.permissions === 'object') {
    const p = user.permissions['user-matrix'];
    if (p && (p.canEdit || p.canDelete) && !p.isRevoked && p.canView !== false) {
      return true;
    }
  }
  return false;
}

/**
 * Kiểm tra quyền và tự động hiển thị Toast cảnh báo nếu không có quyền.
 * Trả về true nếu được phép, false nếu bị chặn.
 */
export function assertPermission(featureCode: string, action: 'edit' | 'delete' | 'create', actionLabel?: string): boolean {
  const isAllowed = canUserPerformAction(featureCode, action);
  if (!isAllowed) {
    const actionText = action === 'delete' ? 'XÓA / HỦY' : (action === 'edit' ? 'CHỈNH SỬA' : 'TẠO MỚI');
    const labelText = actionLabel ? ` (${actionLabel})` : '';
    const msg = `Tài khoản của bạn không có quyền ${actionText}${labelText}. Vui lòng liên hệ Quản trị viên để được cấp quyền!`;
    
    if (typeof (window as any).showToast === 'function') {
      (window as any).showToast(msg, 'warning');
    } else {
      console.warn('[Permission Denied]', msg);
    }
    return false;
  }
  return true;
}

/**
 * Tự động gắn thông tin tài khoản đang thao tác (x-user-email, x-user-role)
 * vào tất cả các HTTP request gửi tới Backend để kiểm tra phân quyền phía Server.
 */
export function setupAuthFetchInterceptor(): void {
  if (typeof window === 'undefined') return;
  const w = window as any;
  if (w._authFetchInterceptorInstalled) return;
  w._authFetchInterceptorInstalled = true;

  const originalFetch = window.fetch;
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    try {
      const user = getCurrentAppUser();
      if (user && user.email) {
        init = init || {};
        const headers = new Headers(init.headers || {});
        if (!headers.has('x-user-email')) {
          headers.set('x-user-email', user.email);
        }
        if (!headers.has('x-user-role') && (user.role || user.role_code || user.roleCode)) {
          headers.set('x-user-role', user.role || user.role_code || user.roleCode);
        }
        init.headers = headers;
      }
    } catch {}
    return originalFetch.call(this, input, init);
  };
}

// Tự động khởi chạy interceptor
setupAuthFetchInterceptor();
