import { UserAccount, AuthSavedAccount } from './types';
import { repairAtobMojibake, loadPersistedUser, DEFAULT_SITES_LIST } from './constants';
import { getCleanInitials } from '@/ts/utils/formatters';

export let gCurrentUser: UserAccount | null = loadPersistedUser();
export let isForceAuthModal: boolean = false;

declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const onGlobalBranchChange: (site: string) => void;
declare const lucide: any;

// Forward references to be bound or imported
declare const openGoogleAuthModal: (isForce?: boolean) => void;
declare const closeGoogleAuthModal: (forceClose?: boolean) => void;
declare const dangXuatAdmin: () => void;
declare const applyUserSessionToUI: () => void;
declare const checkPendingAccessRequests: () => Promise<void>;
declare const renderLoginRoleSelection: (targetUser: any) => void;
declare const getAppSitesList: () => any[];

export function getSavedAccounts(): AuthSavedAccount[] {
  try {
    const raw = localStorage.getItem('orbit_saved_accounts');
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    }
  } catch (e) {
    console.error('getSavedAccounts error:', e);
  }
  return [];
}

export function saveAccountToList(user: UserAccount | null): void {
  if (!user || !user.email) return;
  const accounts = getSavedAccounts();
  const idx = accounts.findIndex(a => a.email.toLowerCase() === user.email.toLowerCase());
  const entry: AuthSavedAccount = {
    id: user.id,
    email: user.email,
    fullName: repairAtobMojibake(user.fullName || (user.email ? user.email.split('@')[0] : 'Người dùng')),
    avatarUrl: user.avatarUrl || `https://ui-avatars.com/api/?name=${getCleanInitials(user.fullName || user.email)}&background=465fff&color=fff&bold=true`,
    role: user.role || 'NHAN_VIEN',
    roleName: user.roleName || 'Nhân Viên Vận Hành',
    badgeColor: user.badgeColor || 'gray',
    status: user.status || 'ACTIVE',
    permissions: user.permissions || null,
    assignedSite: user.assignedSite || localStorage.getItem('orbit_user_site') || 'K001',
    lastLogin: Date.now()
  };

  if (idx !== -1) {
    accounts[idx] = { ...accounts[idx], ...entry };
  } else {
    accounts.push(entry);
  }
  localStorage.setItem('orbit_saved_accounts', JSON.stringify(accounts));
}

export function removeSavedAccount(email: string, event?: Event): void {
  if (event) event.stopPropagation();
  let accounts = getSavedAccounts();
  accounts = accounts.filter(a => a.email.toLowerCase() !== email.toLowerCase());
  localStorage.setItem('orbit_saved_accounts', JSON.stringify(accounts));

  if (gCurrentUser && gCurrentUser.email.toLowerCase() === email.toLowerCase()) {
    if (typeof (window as any).dangXuatAdmin === 'function') {
      (window as any).dangXuatAdmin();
    }
  } else {
    renderSavedAccountsInLoginModal();
    renderSavedAccountsInProfileModal();
    if (typeof showToast === 'function') showToast(`Đã xóa tài khoản ${email} khỏi máy này`);
  }
}

export async function switchToSavedAccount(email: string): Promise<void> {
  const accounts = getSavedAccounts();
  const acc = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
  if (!acc) return;

  // Kiểm tra trạng thái lưu trữ cục bộ
  if (acc.status === 'LOCKED') {
    if (typeof showToast === 'function') {
      showToast(`Tài khoản ${acc.email} đã bị khóa bởi Quản trị viên! Không thể đăng nhập.`, 'error');
    }
    return;
  }

  try {
    if (typeof showLoading === 'function') showLoading(`Đang chuyển sang ${acc.fullName}...`);
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: acc.email })
    });
    const json = await res.json().catch(() => ({}));

    // Nếu backend phản hồi tài khoản bị khóa (HTTP 403 / isLocked)
    if (res.status === 403 || json.isLocked || (json.data && json.data.status === 'LOCKED')) {
      acc.status = 'LOCKED';
      saveAccountToList(acc as any);
      if (typeof showToast === 'function') {
        showToast(`Tài khoản ${acc.email} đã bị khóa bởi Quản trị viên!`, 'error');
      }
      return;
    }

    if (!json.success) throw new Error(json.error || 'Lỗi đăng nhập');

    gCurrentUser = json.data;
    if (typeof window !== 'undefined') (window as any).gCurrentUser = gCurrentUser;
    localStorage.setItem('orbit_user', JSON.stringify(gCurrentUser));
    try { sessionStorage.removeItem('orbit_explicit_logout'); } catch (e) {}
    saveAccountToList(gCurrentUser);

    isForceAuthModal = false;
    if (typeof (window as any).closeGoogleAuthModal === 'function') (window as any).closeGoogleAuthModal();
    closeUserProfileModal();
    if (typeof (window as any).applyUserSessionToUI === 'function') (window as any).applyUserSessionToUI();

    if (acc.assignedSite) {
      localStorage.setItem('orbit_user_site', acc.assignedSite);
      const branchSel = document.getElementById('globalBranchSelect') as HTMLSelectElement | null;
      if (branchSel) branchSel.value = acc.assignedSite;
      if (typeof onGlobalBranchChange === 'function') onGlobalBranchChange(acc.assignedSite);
    }

    if (typeof showToast === 'function') {
      showToast(`Đã chuyển sang tài khoản: ${gCurrentUser?.fullName} (${gCurrentUser?.roleName})`);
    }

    if (gCurrentUser?.role === 'ADMIN') {
      if (typeof (window as any).checkPendingAccessRequests === 'function') {
        (window as any).checkPendingAccessRequests();
      }
    }
  } catch (err: any) {
    console.error('switchToSavedAccount error:', err);
    if (err.message && (err.message.includes('khóa') || err.message.includes('LOCKED') || err.message.includes('403'))) {
      if (typeof showToast === 'function') showToast(err.message, 'error');
      return;
    }
    // Chỉ fallback offline nếu acc không bị khóa
    if (acc.status === 'LOCKED') {
      if (typeof showToast === 'function') showToast(`Tài khoản ${acc.email} đã bị khóa.`, 'error');
      return;
    }
    gCurrentUser = acc;
    if (typeof window !== 'undefined') (window as any).gCurrentUser = gCurrentUser;
    localStorage.setItem('orbit_user', JSON.stringify(gCurrentUser));
    isForceAuthModal = false;
    if (typeof (window as any).closeGoogleAuthModal === 'function') (window as any).closeGoogleAuthModal();
    closeUserProfileModal();
    if (typeof (window as any).applyUserSessionToUI === 'function') (window as any).applyUserSessionToUI();
    if (typeof showToast === 'function') showToast(`Đã chuyển sang tài khoản: ${gCurrentUser.fullName}`);
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export function renderSavedAccountsInLoginModal(): void {
  const container = document.getElementById('loginSavedAccountsContainer');
  const listEl = document.getElementById('loginSavedAccountsList');
  const labelEl = document.getElementById('googleBtnLabel');
  if (!container || !listEl) return;

  const accounts = getSavedAccounts();
  if (accounts.length === 0) {
    container.classList.add('hidden');
    if (labelEl) labelEl.textContent = 'Đăng nhập tài khoản Google';
    return;
  }

  container.classList.remove('hidden');
  if (labelEl) labelEl.textContent = 'Hoặc tiếp tục với tài khoản khác';

  if (accounts[0]) {
    if (typeof (window as any).renderLoginRoleSelection === 'function') {
      (window as any).renderLoginRoleSelection(gCurrentUser || accounts[0]);
    }
  }

  listEl.innerHTML = accounts.map(acc => {
    const isCurrent = gCurrentUser && gCurrentUser.email.toLowerCase() === acc.email.toLowerCase();
    const isLocked = acc.status === 'LOCKED';
    
    let roleBadge = '';
    if (isLocked) {
      roleBadge = '<span class="text-[9.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-rose-500 text-white shadow-xs">BỊ KHÓA</span>';
    } else {
      const roleBadgeColor = acc.role === 'ADMIN' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40' :
        acc.role === 'BEP_TRUONG' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40' :
        acc.role === 'KHO_TRUONG' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40' :
        acc.role === 'KE_TOAN' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40' :
        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
      roleBadge = `<span class="text-[9.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${roleBadgeColor}">${acc.role}</span>`;
    }

    const avSrc = (acc.avatarUrl && !acc.avatarUrl.includes('ui-avatars.com'))
      ? acc.avatarUrl
      : `https://ui-avatars.com/api/?name=${getCleanInitials(acc.fullName || acc.email)}&background=19723C&color=fff&bold=true`;

    return `
      <div onclick="switchToSavedAccount('${acc.email}')" class="group p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
        isCurrent
          ? 'border-brand-500 bg-emerald-50/70 dark:bg-emerald-950/20 ring-1.5 ring-brand-500/30 shadow-xs'
          : 'border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-800/50 hover:border-brand-500/60 hover:bg-gray-50/80 dark:hover:bg-gray-800/90 hover:shadow-xs'
      }">
        <div class="flex items-center gap-3 min-w-0">
          <img src="${avSrc}" alt="${acc.fullName}" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 ring-2 ring-gray-100 dark:ring-gray-700/80 shadow-xs">
          <div class="min-w-0 text-left">
            <div class="font-bold text-xs sm:text-[13px] text-gray-900 dark:text-white truncate flex items-center gap-1.5 leading-tight">
              <span>${acc.fullName}</span>
              ${isCurrent ? '<span class="text-[9px] px-1.5 py-0.2 rounded font-bold bg-brand-500 text-white tracking-wider">HIỆN TẠI</span>' : ''}
            </div>
            <div class="text-[11px] text-gray-400 dark:text-gray-400 font-mono tabular-nums truncate mt-0.5">${acc.email}</div>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          ${roleBadge}
          <button onclick="removeSavedAccount('${acc.email}', event)" title="Xóa tài khoản này khỏi máy" class="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function renderSavedAccountsInProfileModal(): void {
  const listEl = document.getElementById('profSavedAccountsList');
  if (!listEl) return;

  const accounts = getSavedAccounts();
  const otherAccounts = accounts.filter(a => !gCurrentUser || a.email.toLowerCase() !== gCurrentUser.email.toLowerCase());

  if (otherAccounts.length === 0) {
    listEl.innerHTML = `<div class="p-3 text-center text-gray-400 text-xs italic bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">Chưa có tài khoản phụ nào khác được lưu trên máy này. Bấm "+ Thêm tài khoản" để đăng nhập thêm.</div>`;
    return;
  }

  listEl.innerHTML = otherAccounts.map(acc => {
    const avSrc = (acc.avatarUrl && !acc.avatarUrl.includes('ui-avatars.com'))
      ? acc.avatarUrl
      : `https://ui-avatars.com/api/?name=${getCleanInitials(acc.fullName || acc.email)}&background=465fff&color=fff&bold=true`;

    return `
    <div onclick="switchToSavedAccount('${acc.email}')" class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-500 bg-white dark:bg-gray-800/40 flex items-center justify-between gap-2.5 cursor-pointer transition-all">
      <div class="flex items-center gap-2.5 min-w-0">
        <img src="${avSrc}" alt="${acc.fullName}" class="w-7 h-7 rounded-full object-cover shrink-0">
        <div class="min-w-0">
          <div class="font-bold text-xs text-gray-900 dark:text-white truncate">${acc.fullName}</div>
          <div class="text-xs text-gray-400 tabular-nums truncate">${acc.email}</div>
        </div>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <span class="text-[8.5px] px-1.5 py-0.5 rounded font-semibold uppercase bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">${acc.role}</span>
        <span class="text-xs text-brand-500 font-bold">Chuyển ↗</span>
      </div>
    </div>
  `;
  }).join('');

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function handleUserProfileClick(): void {
  if (!gCurrentUser) {
    gCurrentUser = loadPersistedUser();
    if (typeof window !== 'undefined') (window as any).gCurrentUser = gCurrentUser;
  }
  if (gCurrentUser && gCurrentUser.email) {
    openUserProfileModal();
  } else {
    if (typeof (window as any).openGoogleAuthModal === 'function') {
      (window as any).openGoogleAuthModal(true);
    }
  }
}

export function openUserProfileModal(): void {
  if (!gCurrentUser) {
    gCurrentUser = loadPersistedUser();
    if (typeof window !== 'undefined') (window as any).gCurrentUser = gCurrentUser;
  }
  if (!gCurrentUser) {
    if (typeof (window as any).openGoogleAuthModal === 'function') {
      (window as any).openGoogleAuthModal(true);
    }
    return;
  }

  const modal = document.getElementById('userProfileModal');
  if (!modal) return;

  const nameEl = document.getElementById('profModalName');
  const emailEl = document.getElementById('profModalEmail');
  const avEl = document.getElementById('profModalAvatar') as HTMLImageElement | null;
  const roleEl = document.getElementById('profModalRoleBadge');
  const siteEl = document.getElementById('profModalSiteName');
  const siteTextEl = document.getElementById('profCurrentSiteText');
  const permSummaryEl = document.getElementById('profModalPermSummary');
  const reqBtn = document.getElementById('profReqAccessBtn');

  if (nameEl) nameEl.textContent = gCurrentUser.fullName || 'Người dùng';
  if (emailEl) emailEl.textContent = gCurrentUser.email;
  const profAv = (gCurrentUser.avatarUrl && !gCurrentUser.avatarUrl.includes('ui-avatars.com'))
    ? gCurrentUser.avatarUrl
    : `https://ui-avatars.com/api/?name=${getCleanInitials(gCurrentUser.fullName || gCurrentUser.email)}&background=465fff&color=fff&bold=true`;
  if (avEl) avEl.src = profAv;

  if (roleEl) {
    roleEl.textContent = gCurrentUser.roleName || gCurrentUser.role;
    roleEl.className = `text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${
      gCurrentUser.role === 'ADMIN' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
      gCurrentUser.role === 'BEP_TRUONG' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
      gCurrentUser.role === 'KHO_TRUONG' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
      gCurrentUser.role === 'KE_TOAN' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }`;
  }

  const sites = typeof (window as any).getAppSitesList === 'function' ? (window as any).getAppSitesList() : DEFAULT_SITES_LIST;
  const curSite = localStorage.getItem('orbit_user_site') || 'K001';
  const siteObj = sites.find((s: any) => s.code === curSite);
  const siteName = siteObj ? siteObj.name : curSite;
  if (siteEl) siteEl.textContent = siteName;
  if (siteTextEl) siteTextEl.textContent = `Đang phụ trách: ${siteName}`;

  if (permSummaryEl) {
    if (gCurrentUser.role === 'ADMIN') {
      permSummaryEl.textContent = 'Toàn quyền quản trị hệ thống, phê duyệt cấp quyền và truy cập tất cả 19 phân hệ F&B và Kho tổng.';
      if (reqBtn) reqBtn.classList.add('hidden');
    } else if (gCurrentUser.role === 'BEP_TRUONG') {
      permSummaryEl.textContent = 'Quản lý điểm bán: Xem tồn kho ma trận, kiểm kê hằng ngày, tạo phiếu nhập hàng NCC, lập biên bản hủy hàng & báo cáo suất ăn.';
      if (reqBtn) reqBtn.classList.remove('hidden');
    } else if (gCurrentUser.role === 'KHO_TRUONG') {
      permSummaryEl.textContent = 'Quản lý kho WMS: Theo dõi hạn dùng FEFO kho gia vị tổng, cảnh báo đặt hàng ROP, lead time NCC, tồn kho thực tế và quản lý lô hàng.';
      if (reqBtn) reqBtn.classList.remove('hidden');
    } else if (gCurrentUser.role === 'KE_TOAN') {
      permSummaryEl.textContent = 'Kế toán kiểm soát: Báo cáo P&L chuỗi 14 điểm, doanh thu bán hàng POS, chứng từ & hóa đơn thuế.';
      if (reqBtn) reqBtn.classList.remove('hidden');
    } else {
      permSummaryEl.textContent = 'Quyền nhân viên cơ bản: Kiểm kê hằng ngày, xem tồn kho cơ bản, báo cáo suất ăn và đặt hàng vật tư. (Có thể xin cấp thêm quyền nâng cao).';
      if (reqBtn) reqBtn.classList.remove('hidden');
    }
  }

  renderSavedAccountsInProfileModal();

  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function closeUserProfileModal(): void {
  document.getElementById('userProfileModal')?.classList.add('hidden');
}
