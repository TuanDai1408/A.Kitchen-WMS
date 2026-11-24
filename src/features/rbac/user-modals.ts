import { loadUserMatrix } from './user-matrix';

declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;

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

export async function toggleUserStatusPrompt(userEmail: string, newStatus: string): Promise<void> {
  const actionText = newStatus === 'ACTIVE' ? 'mở khóa' : 'khóa';
  if (!confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản ${userEmail}?`)) {
    return;
  }

  try {
    if (typeof showLoading === 'function') showLoading();
    const resp = await fetch('/api/auth/users/toggle-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, status: newStatus })
    });
    const res = await resp.json();
    if (res.success) {
      if (typeof showToast === 'function') showToast(res.message || 'Đã cập nhật trạng thái tài khoản', 'success');
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
