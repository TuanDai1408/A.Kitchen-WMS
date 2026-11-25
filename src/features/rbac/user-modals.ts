import { loadUserMatrix } from './user-matrix';
import { escapeHtml } from '@/ts/utils/formatters';

declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const lucide: any;

let pendingToggleStatusUser: { email: string; newStatus: string } | null = null;

export function openAddUserModal(): void {
  const modal = document.getElementById('addUserModal');
  if (modal) modal.classList.remove('hidden');
  const emailInput = document.getElementById('addUserInputEmail') as HTMLInputElement | null;
  if (emailInput) emailInput.focus();
}

export function closeAddUserModal(): void {
  const modal = document.getElementById('addUserModal');
  if (modal) modal.classList.add('hidden');
}

export async function submitAddUser(e?: Event): Promise<void> {
  if (e) e.preventDefault();
  const emailInput = document.getElementById('addUserInputEmail') as HTMLInputElement | null;
  const nameInput = document.getElementById('addUserInputName') as HTMLInputElement | null;
  const roleInput = document.getElementById('addUserInputRole') as HTMLSelectElement | null;

  const email = (emailInput?.value || '').trim();
  const fullName = (nameInput?.value || '').trim();
  const roleCode = roleInput?.value || 'NHAN_VIEN';

  if (!email) {
    if (typeof showToast === 'function') showToast('Vui lòng nhập Email', 'warning');
    return;
  }

  try {
    if (typeof showLoading === 'function') showLoading();
    const resp = await fetch('/api/auth/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fullName, roleCode })
    });
    const res = await resp.json();
    if (res.success) {
      if (typeof showToast === 'function') showToast(res.message || 'Thêm tài khoản thành công', 'success');
      closeAddUserModal();
      if (emailInput) emailInput.value = '';
      if (nameInput) nameInput.value = '';
      await loadUserMatrix();
    } else {
      if (typeof showToast === 'function') showToast(res.error || 'Không thể thêm tài khoản', 'error');
    }
  } catch {
    if (typeof showToast === 'function') showToast('Lỗi kết nối máy chủ', 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export function openEditUserModal(userEmail: string): void {
  const matrixData = typeof window !== 'undefined' ? (window as any).gUserMatrixData : null;
  if (!matrixData || !matrixData.users) return;
  const user = matrixData.users.find((u: any) => u.email === userEmail);
  if (!user) return;

  const emailTarget = document.getElementById('editUserTargetEmail') as HTMLInputElement | null;
  const emailDisplay = document.getElementById('editUserEmailDisplay');
  const roleSelect = document.getElementById('editUserRoleSelect') as HTMLSelectElement | null;
  const resetPerms = document.getElementById('editUserResetPermsToggle') as HTMLInputElement | null;

  if (emailTarget) emailTarget.value = user.email;
  if (emailDisplay) emailDisplay.textContent = `${user.email} (${user.full_name || 'Chưa đặt tên'})`;
  if (roleSelect) roleSelect.value = user.role_code || 'NHAN_VIEN';
  if (resetPerms) resetPerms.checked = false;

  const modal = document.getElementById('editUserModal');
  if (modal) modal.classList.remove('hidden');
}

export function closeEditUserModal(): void {
  const modal = document.getElementById('editUserModal');
  if (modal) modal.classList.add('hidden');
}

export async function submitEditUserRole(e?: Event): Promise<void> {
  if (e) e.preventDefault();
  const userEmail = (document.getElementById('editUserTargetEmail') as HTMLInputElement | null)?.value;
  const roleCode = (document.getElementById('editUserRoleSelect') as HTMLSelectElement | null)?.value;
  const resetPermissions = (document.getElementById('editUserResetPermsToggle') as HTMLInputElement | null)?.checked || false;

  if (!userEmail || !roleCode) return;

  try {
    if (typeof showLoading === 'function') showLoading();
    const resp = await fetch('/api/auth/users/update-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, roleCode, resetPermissions })
    });
    const res = await resp.json();
    if (res.success) {
      if (typeof showToast === 'function') showToast(res.message || 'Cập nhật vai trò thành công', 'success');
      closeEditUserModal();
      await loadUserMatrix();
    } else {
      if (typeof showToast === 'function') showToast(res.error || 'Lỗi khi cập nhật vai trò', 'error');
    }
  } catch {
    if (typeof showToast === 'function') showToast('Lỗi mạng', 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export async function resetUserAllPermsPrompt(): Promise<void> {
  const userEmail = (document.getElementById('editUserTargetEmail') as HTMLInputElement | null)?.value;
  if (!userEmail) return;

  if (!confirm(`Bạn có chắc chắn muốn xóa tất cả phân quyền riêng và khôi phục quyền mặc định theo vai trò cho ${userEmail}?`)) {
    return;
  }

  try {
    if (typeof showLoading === 'function') showLoading();
    const resp = await fetch('/api/auth/user-permissions/reset-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail })
    });
    const res = await resp.json();
    if (res.success) {
      if (typeof showToast === 'function') showToast(res.message || 'Đã khôi phục quyền mặc định thành công', 'success');
      closeEditUserModal();
      await loadUserMatrix();
    } else {
      if (typeof showToast === 'function') showToast(res.error || 'Lỗi khi khôi phục quyền', 'error');
    }
  } catch {
    if (typeof showToast === 'function') showToast('Lỗi mạng', 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

/**
 * Mở Popup xác nhận Khóa / Mở khóa tài khoản tại Tab Phân quyền
 */
export function openConfirmToggleUserStatusModal(userEmail: string, newStatus: string): void {
  const isLocking = newStatus === 'LOCKED';

  // Chặn không cho khóa tài khoản Master Owner trantuandai2508
  if (isLocking && (userEmail.toLowerCase().includes('trantuandai2508') || userEmail.toLowerCase() === 'trantuandai2508@gmail.com')) {
    if (typeof showToast === 'function') {
      showToast('Không thể khóa tài khoản Quản trị viên tối cao (trantuandai2508)!', 'warning');
    }
    return;
  }

  pendingToggleStatusUser = { email: userEmail, newStatus };
  const modal = document.getElementById('modalConfirmToggleUserStatus');
  if (!modal) return;

  const matrixData = typeof window !== 'undefined' ? (window as any).gUserMatrixData : null;
  const user = matrixData?.users?.find((u: any) => u.email === userEmail);
  const fullName = user?.full_name || 'Người dùng';
  const roleName = user?.role_code || 'NHAN_VIEN';
  const avatarUrl = user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=${isLocking ? 'e11d48' : '10b981'}&color=fff&bold=true`;

  const iconContainer = document.getElementById('confirmToggleStatusIcon');
  const titleEl = document.getElementById('confirmToggleStatusTitle');
  const descEl = document.getElementById('confirmToggleStatusDesc');
  const userCardEl = document.getElementById('confirmToggleStatusUserCard');
  const submitBtn = document.getElementById('btnConfirmToggleStatus');

  if (iconContainer) {
    iconContainer.className = isLocking
      ? 'w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-sm'
      : 'w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm';
    iconContainer.innerHTML = `<i data-lucide="${isLocking ? 'lock' : 'unlock'}" class="w-7 h-7"></i>`;
  }

  if (titleEl) {
    titleEl.textContent = isLocking ? 'Xác nhận khóa tài khoản?' : 'Xác nhận mở khóa tài khoản?';
  }

  if (descEl) {
    descEl.innerHTML = isLocking
      ? `Tài khoản sẽ bị <b>đăng xuất ngay lập tức</b> và bị <b>chặn toàn bộ 20/20 tính năng</b> hệ thống cho đến khi được mở khóa lại.`
      : `Tài khoản sẽ được <b>kích hoạt lại</b> trạng thái hoạt động bình thường và khôi phục các phân quyền theo vai trò.`;
  }

  if (userCardEl) {
    userCardEl.innerHTML = `
      <div class="flex items-center gap-3 p-3 rounded-2xl border ${isLocking ? 'border-rose-100 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/20' : 'border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20'}">
        <img src="${escapeHtml(avatarUrl)}" class="size-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shrink-0" alt="Avatar">
        <div class="min-w-0 text-left flex-1">
          <div class="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">${escapeHtml(fullName)}</div>
          <div class="text-[11px] text-gray-500 dark:text-gray-400 font-mono truncate">${escapeHtml(userEmail)}</div>
        </div>
        <span class="text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase shrink-0 ${isLocking ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}">
          ${escapeHtml(roleName)}
        </span>
      </div>
    `;
  }

  if (submitBtn) {
    submitBtn.className = isLocking
      ? 'w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-all'
      : 'w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all';
    submitBtn.innerHTML = `
      <i data-lucide="${isLocking ? 'lock' : 'unlock'}" class="w-4 h-4"></i>
      <span>${isLocking ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa'}</span>
    `;
  }

  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

/**
 * Đóng Popup xác nhận Khóa / Mở khóa tài khoản
 */
export function closeConfirmToggleUserStatusModal(): void {
  pendingToggleStatusUser = null;
  const modal = document.getElementById('modalConfirmToggleUserStatus');
  if (modal) modal.classList.add('hidden');
}

/**
 * Thực hiện gọi API Khóa / Mở khóa tài khoản sau khi người dùng bấm xác nhận trong Popup
 */
export async function executeToggleUserStatus(): Promise<void> {
  if (!pendingToggleStatusUser) return;
  const { email: userEmail, newStatus } = pendingToggleStatusUser;

  try {
    if (typeof showLoading === 'function') showLoading(newStatus === 'LOCKED' ? 'Đang khóa tài khoản...' : 'Đang mở khóa tài khoản...');
    const resp = await fetch('/api/auth/users/toggle-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, status: newStatus })
    });
    const res = await resp.json();
    if (res.success) {
      if (typeof showToast === 'function') showToast(res.message || 'Đã cập nhật trạng thái tài khoản', 'success');
      closeConfirmToggleUserStatusModal();
      await loadUserMatrix();
    } else {
      if (typeof showToast === 'function') showToast(res.error || 'Lỗi khi cập nhật trạng thái', 'error');
    }
  } catch {
    if (typeof showToast === 'function') showToast('Lỗi mạng', 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

/**
 * Alias cho hành động mở popup xác nhận khóa tài khoản
 */
export function toggleUserStatusPrompt(userEmail: string, newStatus: string): void {
  openConfirmToggleUserStatusModal(userEmail, newStatus);
}
