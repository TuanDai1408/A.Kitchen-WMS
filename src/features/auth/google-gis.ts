import { GOOGLE_CLIENT_ID } from './constants';
import { gCurrentUser, saveAccountToList, renderSavedAccountsInLoginModal } from './accounts';
import { applyUserSessionToUI, updateUIForUnauthenticated } from './rbac-session';
import { checkAndPromptUserSite } from './sites-modal';
import { checkPendingAccessRequests } from './access-requests';

declare const google: any;
declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const initTailadminCharts: () => void;
declare const lucide: any;

export function initGoogleGIS(): void {
  if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
    setTimeout(initGoogleGIS, 400);
    return;
  }

  try {
    const w = typeof window !== 'undefined' ? (window as any) : {};
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleLoginResponse,
      auto_select: false,
      cancel_on_tap_outside: !w.isForceAuthModal
    });

    const btnContainer = document.getElementById('googleSignInBtn');
    if (btnContainer) {
      btnContainer.innerHTML = '';
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 420;
      google.accounts.id.renderButton(btnContainer, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        logo_alignment: 'left',
        width: isMobile ? 280 : 320
      });
    }

    const fallback = document.getElementById('googleSignInFallback');
    if (fallback) fallback.classList.add('hidden');
  } catch (e) {
    console.warn('GIS initialize notice:', e);
    const fallback = document.getElementById('googleSignInFallback');
    if (fallback) fallback.classList.remove('hidden');
  }
}

export async function handleGoogleLoginResponse(response: any): Promise<void> {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  try {
    if (typeof showLoading === 'function') showLoading('Đang xác thực thông tin tài khoản Google...');
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Đăng nhập Google thất bại');

    const curUser = json.data;
    w.gCurrentUser = curUser;
    localStorage.setItem('orbit_user', JSON.stringify(curUser));
    try { sessionStorage.removeItem('orbit_explicit_logout'); } catch (e) {}
    saveAccountToList(curUser);

    w.isForceAuthModal = false;
    closeGoogleAuthModal();
    applyUserSessionToUI();

    if (typeof showToast === 'function') {
      showToast(`Đăng nhập Google thành công! Xin chào ${curUser.fullName} (${curUser.roleName})`);
    }

    checkAndPromptUserSite();

    if (curUser.role === 'ADMIN') {
      checkPendingAccessRequests();
    }
  } catch (err: any) {
    console.error('handleGoogleLoginResponse error:', err);
    if (typeof showToast === 'function') showToast('Lỗi xác thực Google: ' + err.message);
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export function promptGoogleOneTap(): void {
  if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
    google.accounts.id.prompt();
  } else {
    if (typeof showToast === 'function') showToast('Google Identity Services chưa sẵn sàng, vui lòng thử lại');
  }
}

export function openGoogleAuthModal(isForce: boolean = false): void {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  w.isForceAuthModal = !!isForce;
  const modal = document.getElementById('googleAuthModal');
  const closeBtn = document.getElementById('googleAuthCloseBtn');

  if (modal) modal.classList.remove('hidden');
  if (closeBtn) {
    if (isForce) closeBtn.classList.add('hidden');
    else closeBtn.classList.remove('hidden');
  }

  renderSavedAccountsInLoginModal();
  initGoogleGIS();
  setTimeout(() => {
    if (typeof initTailadminCharts === 'function') initTailadminCharts();
  }, 200);
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function closeGoogleAuthModal(forceClose: boolean = false): void {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  const curUser = w.gCurrentUser || gCurrentUser;
  if (!forceClose && w.isForceAuthModal && !curUser) {
    if (typeof showToast === 'function') {
      showToast('Vui lòng đăng nhập bằng tài khoản Gmail để sử dụng hệ thống');
    }
    return;
  }
  w.isForceAuthModal = false;
  document.getElementById('googleAuthModal')?.classList.add('hidden');
}

export function loginWithGoogle(): void {
  promptGoogleOneTap();
}

export function dangXuatAdmin(): void {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  localStorage.removeItem('orbit_user');
  try { sessionStorage.setItem('orbit_explicit_logout', 'true'); } catch (e) {}
  w.gCurrentUser = null;
  updateUIForUnauthenticated();
  openGoogleAuthModal(true);
  if (typeof showToast === 'function') showToast('Đã đăng xuất tài khoản! Vui lòng đăng nhập để tiếp tục.');
}
