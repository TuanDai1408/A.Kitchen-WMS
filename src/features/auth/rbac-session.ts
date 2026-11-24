import { gCurrentUser, saveAccountToList } from './accounts';
import { APP_SYSTEM_ROLES, repairAtobMojibake, loadPersistedUser } from './constants';
import { checkAndPromptUserSite, renderSitesOptions } from './sites-modal';
import { checkPendingAccessRequests } from './access-requests';
import { getCleanInitials } from '@/ts/utils/formatters';

declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const lucide: any;
declare const TAB_META: any;

let lastFocusSyncTime = Date.now();

export function initRbacAuth(): void {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  let curUser = w.gCurrentUser || gCurrentUser;
  if (!curUser) {
    curUser = loadPersistedUser();
    w.gCurrentUser = curUser;
  }

  renderSitesOptions();

  if (!curUser || !curUser.email) {
    w.gCurrentUser = null;
    updateUIForUnauthenticated();
    if (typeof w.openGoogleAuthModal === 'function') {
      w.openGoogleAuthModal(true);
    }
    return;
  }

  saveAccountToList(curUser);
  applyUserSessionToUI();

  // Đóng modal đăng nhập nếu phiên đăng nhập hợp lệ
  w.isForceAuthModal = false;
  if (typeof w.closeGoogleAuthModal === 'function') {
    w.closeGoogleAuthModal(true);
  }

  checkAndPromptUserSite();

  if (curUser.role === 'ADMIN') {
    checkPendingAccessRequests();
  }

  // Đồng bộ quyền mới nhất từ server CSDL D1 ngay khi mở ứng dụng
  syncCurrentUserPermissions();
}

export async function syncCurrentUserPermissions(): Promise<void> {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  const curUser = w.gCurrentUser || gCurrentUser;
  if (!curUser || !curUser.email) return;

  try {
    const res = await fetch(`/api/auth/me?email=${encodeURIComponent(curUser.email)}`);
    const json = await res.json();
    if (json.success && json.data && json.data.permissions) {
      curUser.permissions = json.data.permissions;
      curUser.role = json.data.role;
      curUser.roleName = json.data.roleName;
      if (json.data.user && json.data.user.fullName) curUser.fullName = json.data.user.fullName;
      if (json.data.user && json.data.user.avatarUrl) curUser.avatarUrl = json.data.user.avatarUrl;
      try { localStorage.setItem('orbit_user', JSON.stringify(curUser)); } catch (e) {}
      saveAccountToList(curUser);
      applyUserSessionToUI();
    }
  } catch (e) {
    console.error('syncCurrentUserPermissions error:', e);
  }
}

// Định kỳ đồng bộ quyền & focus listener
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (!document.hidden && (window as any).gCurrentUser && (window as any).gCurrentUser.email) {
      syncCurrentUserPermissions();
    }
  }, 300000);

  window.addEventListener('focus', () => {
    const now = Date.now();
    if (now - lastFocusSyncTime > 60000 && (window as any).gCurrentUser && (window as any).gCurrentUser.email) {
      lastFocusSyncTime = now;
      syncCurrentUserPermissions();
    }
  });
}

export function updateUIForUnauthenticated(): void {
  const nameEl = document.getElementById('sidebarUserName');
  const roleEl = document.getElementById('sidebarUserRoleBadge');
  const emailEl = document.getElementById('sidebarUserEmail');
  const hdrName = document.getElementById('headerUserName');
  const hdrRole = document.getElementById('headerUserRoleBadge');

  if (nameEl) nameEl.textContent = 'Chưa đăng nhập';
  if (emailEl) emailEl.textContent = 'Bấm để đăng nhập Gmail';
  if (hdrName) hdrName.textContent = 'Đăng nhập';
  if (roleEl) {
    roleEl.textContent = 'CHƯA ĐĂNG NHẬP';
    roleEl.className = 'text-xs px-1.5 py-0.2 rounded font-semibold uppercase bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300';
  }
  if (hdrRole) {
    hdrRole.textContent = 'CHƯA ĐĂNG NHẬP';
    hdrRole.className = 'text-xs font-semibold text-gray-400 uppercase';
  }

  // Ẩn toàn bộ menu điều hướng khi chưa đăng nhập
  document.querySelectorAll('#sidebar .nav-btn').forEach(btn => {
    btn.classList.add('hidden');
    (btn as HTMLElement).style.display = 'none';
    const li = btn.closest('li');
    if (li) {
      li.classList.add('hidden');
      li.style.display = 'none';
    }
  });
  document.querySelectorAll('#sidebar .sidebar-category').forEach(cat => {
    cat.classList.add('hidden');
    (cat as HTMLElement).style.display = 'none';
  });

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function applyUserSessionToUI(): void {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  const curUser = w.gCurrentUser || gCurrentUser;
  if (!curUser) {
    updateUIForUnauthenticated();
    return;
  }

  const nameEl = document.getElementById('sidebarUserName');
  const roleEl = document.getElementById('sidebarUserRoleBadge');
  const emailEl = document.getElementById('sidebarUserEmail');
  const avImg = document.getElementById('userAvatarImg') as HTMLImageElement | null;

  const hdrName = document.getElementById('headerUserName');
  const hdrRole = document.getElementById('headerUserRoleBadge');
  const hdrAv = document.getElementById('headerUserAvatar') as HTMLImageElement | null;

  const safeName = repairAtobMojibake(curUser.fullName || 'Người dùng');
  if (nameEl) nameEl.textContent = safeName;
  if (hdrName) hdrName.textContent = safeName;
  if (emailEl) emailEl.textContent = curUser.email || '';
  const cleanAv = (curUser.avatarUrl && !curUser.avatarUrl.includes('ui-avatars.com'))
    ? curUser.avatarUrl
    : `https://ui-avatars.com/api/?name=${getCleanInitials(curUser.fullName || curUser.email)}&background=465fff&color=fff&bold=true`;
  if (avImg) avImg.src = cleanAv;
  if (hdrAv) hdrAv.src = cleanAv;

  const roleStyles: Record<string, { bg: string; text: string }> = {
    ADMIN: { bg: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300', text: 'text-rose-600 dark:text-rose-400' },
    BEP_TRUONG: { bg: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', text: 'text-blue-600 dark:text-blue-400' },
    KHO_TRUONG: { bg: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300', text: 'text-amber-600 dark:text-amber-400' },
    KE_TOAN: { bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', text: 'text-emerald-600 dark:text-emerald-400' },
    NHAN_VIEN: { bg: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', text: 'text-gray-500' }
  };
  const curStyle = roleStyles[curUser.role] || roleStyles.NHAN_VIEN;

  if (roleEl) {
    roleEl.textContent = curUser.roleName || curUser.role;
    roleEl.className = `text-xs px-1.5 py-0.2 rounded font-semibold uppercase truncate ${curStyle.bg}`;
  }

  if (hdrRole) {
    hdrRole.textContent = curUser.role || 'USER';
    hdrRole.className = `text-xs font-semibold uppercase truncate ${curStyle.text}`;
  }

  const adminBtn = document.getElementById('adminPendingReqBtn');
  if (adminBtn) {
    if (curUser.role === 'ADMIN') {
      adminBtn.classList.remove('hidden');
    } else {
      adminBtn.classList.add('hidden');
    }
  }

  // 1. Ẩn/Hiện nút tab trên sidebar
  document.querySelectorAll('#sidebar .nav-btn').forEach(btn => {
    const tabId = btn.getAttribute('data-tab');
    if (!tabId) return;

    const allowed = canAccessTab(tabId);
    const li = btn.closest('li');

    if (allowed) {
      btn.classList.remove('hidden', 'opacity-40', 'cursor-not-allowed');
      (btn as HTMLElement).style.display = '';
      if (li) {
        li.classList.remove('hidden');
        li.style.display = '';
      }
    } else {
      btn.classList.add('hidden');
      (btn as HTMLElement).style.display = 'none';
      if (li) {
        li.classList.add('hidden');
        li.style.display = 'none';
      }
    }
  });

  // 2. Ẩn/Hiện danh mục / category trên sidebar
  document.querySelectorAll('#sidebar .sidebar-category').forEach(cat => {
    const visibleBtns = cat.querySelectorAll('.nav-btn:not(.hidden)');
    if (visibleBtns.length === 0) {
      cat.classList.add('hidden');
      (cat as HTMLElement).style.display = 'none';
    } else {
      cat.classList.remove('hidden');
      (cat as HTMLElement).style.display = '';
    }
  });

  // 3. Ẩn/Hiện từng mục trong mobile menu hub modal
  document.querySelectorAll('.hub-item').forEach(item => {
    const onclickStr = item.getAttribute('onclick') || '';
    const m = onclickStr.match(/switchFromHub\('([^']+)'\)/) || onclickStr.match(/switchTab\('([^']+)'\)/);
    if (m && m[1]) {
      const tabId = m[1];
      const allowed = canAccessTab(tabId);
      if (allowed) {
        item.classList.remove('hidden');
        (item as HTMLElement).style.display = '';
      } else {
        item.classList.add('hidden');
        (item as HTMLElement).style.display = 'none';
      }
    }
  });

  document.querySelectorAll('#mobileMenuHub .mobile-hub-category').forEach(group => {
    const visibleHubItems = group.querySelectorAll('.hub-item:not(.hidden)');
    if (visibleHubItems.length === 0) {
      group.classList.add('hidden');
      (group as HTMLElement).style.display = 'none';
    } else {
      group.classList.remove('hidden');
      (group as HTMLElement).style.display = '';
    }
  });

  // 4. Đồng bộ thanh điều hướng dưới đáy mobile (#mobileBottomNav)
  const mobChain = document.getElementById('mobTab-fnb-chain');
  const mobWh = document.getElementById('mobTab-wh-dashboard');
  const mobVoucher = document.getElementById('mobTab-portal-voucher');
  const mobBaocao = document.getElementById('mobTab-portal-baocao');

  const assignedTabs = new Set(['wh-dashboard']);
  if (canAccessTab('portal-voucher')) assignedTabs.add('portal-voucher');
  if (canAccessTab('portal-baocao')) assignedTabs.add('portal-baocao');

  if (mobChain) {
    let targetTab: string | null = null;
    let targetTitle = 'Chuỗi F&B';
    let targetIcon = 'trophy';

    if (canAccessTab('fnb-chain')) {
      targetTab = 'fnb-chain';
      targetTitle = 'Chuỗi F&B';
      targetIcon = 'trophy';
    } else if (canAccessTab('fnb-pl')) {
      targetTab = 'fnb-pl';
      targetTitle = 'Báo Cáo P&L';
      targetIcon = 'pie-chart';
    } else if (canAccessTab('fnb-pos')) {
      targetTab = 'fnb-pos';
      targetTitle = 'Doanh Thu POS';
      targetIcon = 'zap';
    } else if (canAccessTab('fnb-counts')) {
      targetTab = 'fnb-counts';
      targetTitle = 'Kiểm Kê';
      targetIcon = 'clipboard-check';
    } else if (canAccessTab('fnb-receipts')) {
      targetTab = 'fnb-receipts';
      targetTitle = 'Nhập Hàng';
      targetIcon = 'package-plus';
    } else if (canAccessTab('wh-stock')) {
      targetTab = 'wh-stock';
      targetTitle = 'Hạn Dùng';
      targetIcon = 'calendar-clock';
    } else if (canAccessTab('portal-search')) {
      targetTab = 'portal-search';
      targetTitle = 'Tra Cứu';
      targetIcon = 'search';
    } else if (canAccessTab('portal-order')) {
      targetTab = 'portal-order';
      targetTitle = 'Đặt Hàng';
      targetIcon = 'shopping-cart';
    } else {
      const firstAllowed = document.querySelector('#sidebar .nav-btn:not(.hidden)');
      if (firstAllowed) {
        const tId = firstAllowed.getAttribute('data-tab');
        if (tId && !assignedTabs.has(tId)) {
          targetTab = tId;
          targetTitle = (typeof TAB_META !== 'undefined' && TAB_META[tId]) ? TAB_META[tId].title : (firstAllowed.textContent?.trim() || 'Hệ thống');
          targetIcon = 'layers';
        }
      }
    }

    if (targetTab && !assignedTabs.has(targetTab)) {
      mobChain.classList.remove('hidden');
      (mobChain as HTMLElement).style.display = '';
      mobChain.setAttribute('onclick', `switchTab('${targetTab}')`);
      const span = mobChain.querySelector('span');
      if (span) span.textContent = targetTitle;
      const icWrap = mobChain.querySelector('.mob-ic-wrap');
      if (icWrap) {
        icWrap.innerHTML = `<i data-lucide="${targetIcon}" class="w-5 h-5"></i>`;
      }
    } else {
      mobChain.classList.add('hidden');
      (mobChain as HTMLElement).style.display = 'none';
    }
  }

  if (mobWh) {
    if (canAccessTab('wh-dashboard') || canAccessTab('wh-stock') || canAccessTab('wh-reorder')) {
      mobWh.classList.remove('hidden');
      (mobWh as HTMLElement).style.display = '';
      mobWh.setAttribute('onclick', "switchTab('wh-dashboard')");
      const span = mobWh.querySelector('span');
      if (span) span.textContent = 'Kho Vận';
    } else {
      mobWh.classList.add('hidden');
      (mobWh as HTMLElement).style.display = 'none';
    }
  }

  if (mobVoucher) {
    if (canAccessTab('portal-voucher')) {
      mobVoucher.classList.remove('hidden');
      (mobVoucher as HTMLElement).style.display = '';
    } else {
      mobVoucher.classList.add('hidden');
      (mobVoucher as HTMLElement).style.display = 'none';
    }
  }

  if (mobBaocao) {
    if (canAccessTab('portal-baocao')) {
      mobBaocao.classList.remove('hidden');
      (mobBaocao as HTMLElement).style.display = '';
    } else {
      mobBaocao.classList.add('hidden');
      (mobBaocao as HTMLElement).style.display = 'none';
    }
  }

  // 5. Đồng bộ các nút sub-tab con trong trang
  document.querySelectorAll('button[onclick*="switchTab"]').forEach(subBtn => {
    if (subBtn.classList.contains('nav-btn') || subBtn.classList.contains('mob-nav-btn')) return;
    const onclickStr = subBtn.getAttribute('onclick') || '';
    const m = onclickStr.match(/switchTab\('([^']+)'/);
    if (m && m[1]) {
      const tId = m[1];
      if (!canAccessTab(tId)) {
        subBtn.classList.add('hidden');
        (subBtn as HTMLElement).style.display = 'none';
      } else {
        subBtn.classList.remove('hidden');
        (subBtn as HTMLElement).style.display = '';
      }
    }
  });

  // 6. Kiểm tra tab hiện tại: nếu bị khóa -> chuyển về tab an toàn
  const curActivePanel = document.querySelector('.tab-panel.active');
  const curTabId = curActivePanel ? curActivePanel.id : (localStorage.getItem('orbit_active_tab') || 'fnb-chain');
  if (!canAccessTab(curTabId)) {
    const firstAllowedBtn = document.querySelector('#sidebar .nav-btn:not(.hidden)');
    const safeTabId = firstAllowedBtn ? firstAllowedBtn.getAttribute('data-tab') : 'wh-dashboard';
    if (safeTabId && typeof (window as any)._origSwitchTab === 'function') {
      (window as any)._origSwitchTab(safeTabId);
    }
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function canAccessTab(tabId: string): boolean {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  const curUser = w.gCurrentUser || gCurrentUser;
  if (!curUser) return false;

  // ADMIN luôn có toàn quyền quản trị
  if (curUser.role === 'ADMIN') return true;

  // Single Source of Truth từ CSDL Backend
  if (curUser.permissions && typeof curUser.permissions === 'object' && Object.keys(curUser.permissions).length > 0) {
    const p = curUser.permissions[tabId];
    if (p !== undefined) {
      return Boolean(p.canView);
    }
    return false;
  }

  const financeTabs = ['fnb-chain', 'fnb-pl', 'fnb-pos'];
  if (financeTabs.includes(tabId)) return false;

  if (curUser.role === 'KHO_TRUONG') {
    return ['fnb-stock', 'fnb-counts', 'fnb-receipts', 'fnb-sites', 'wh-dashboard', 'wh-stock', 'wh-reorder', 'wh-leadtime', 'wh-posap', 'portal-kiemke', 'portal-history', 'portal-order', 'portal-baocao'].includes(tabId);
  }
  if (curUser.role === 'BEP_TRUONG') {
    return ['wh-dashboard', 'fnb-counts', 'fnb-receipts', 'fnb-waste', 'fnb-sites', 'portal-baocao', 'portal-order', 'portal-kiemke', 'portal-history'].includes(tabId);
  }
  if (curUser.role === 'KE_TOAN') {
    return ['wh-dashboard', 'fnb-sites', 'portal-baocao', 'portal-voucher', 'portal-search'].includes(tabId);
  }
  if (curUser.role === 'NHAN_VIEN') {
    return ['wh-dashboard', 'fnb-counts', 'portal-baocao', 'portal-order'].includes(tabId);
  }

  return false;
}

export function renderRoleSwitcherModal(): void {
  const container = document.getElementById('roleSwitcherList');
  if (!container) return;

  const w = typeof window !== 'undefined' ? (window as any) : {};
  const curUser = w.gCurrentUser || gCurrentUser;
  const currentRole = curUser?.role || 'NHAN_VIEN';
  const isOwner = curUser?.email === 'trantuandai2508@gmail.com' || currentRole === 'ADMIN';
  const approvedRoles = curUser?.approvedRoles || [currentRole];

  container.innerHTML = APP_SYSTEM_ROLES.map(r => {
    const isCurrent = currentRole === r.code;
    const isPermitted = isOwner || approvedRoles.includes(r.code);

    if (isPermitted) {
      return `
        <div onclick="switchRoleAction('${r.code}')" class="p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
          isCurrent
            ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-500/15 ring-2 ring-[#19723C]/30 shadow-xs'
            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/40 hover:border-brand-500 hover:shadow-xs'
        }">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              r.color === 'rose' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' :
              r.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400' :
              r.color === 'amber' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400' :
              r.color === 'emerald' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' :
              'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
            }">
              <i data-lucide="${r.icon}" class="w-4 h-4"></i>
            </div>
            <div class="min-w-0 text-left">
              <div class="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 truncate">
                <span>${r.name}</span>
                ${isCurrent ? '<span class="text-xs px-1.5 py-0.2 rounded font-semibold bg-brand-500 text-white shrink-0">ĐANG CHỌN</span>' : ''}
              </div>
              <div class="text-xs text-gray-400 truncate mt-0.5">${r.desc}</div>
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="text-xs px-2 py-0.5 rounded font-semibold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
              <i data-lucide="check" class="w-3 h-3"></i> Đã duyệt
            </span>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="p-3 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/25 flex items-center justify-between gap-3 opacity-40 select-none">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-xl bg-gray-200/60 dark:bg-gray-800 text-gray-400 flex items-center justify-center shrink-0">
              <i data-lucide="lock" class="w-4 h-4"></i>
            </div>
            <div class="min-w-0 text-left">
              <div class="font-bold text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 truncate">
                <span>${r.name}</span>
                <span class="text-xs px-1.5 py-0.2 rounded font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shrink-0">CẦN ADMIN DUYỆT</span>
              </div>
              <div class="text-xs text-gray-400 truncate mt-0.5">Bạn chưa có quyền sử dụng vai trò này</div>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button onclick="openRequestAccessForRole('${r.code}', event)" class="pointer-events-auto px-2.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs border border-brand-200 dark:border-brand-800 active:translate-y-px transition-all flex items-center gap-1">
              <i data-lucide="send" class="w-3 h-3"></i>
              <span>Xin duyệt</span>
            </button>
          </div>
        </div>
      `;
    }
  }).join('');

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function openRoleSwitcherModal(): void {
  renderRoleSwitcherModal();
  document.getElementById('roleSwitcherModal')?.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function closeRoleSwitcherModal(): void {
  document.getElementById('roleSwitcherModal')?.classList.add('hidden');
}

export function openRequestAccessForRole(roleCode: string, event?: Event): void {
  if (event) event.stopPropagation();
  closeRoleSwitcherModal();
  if (typeof (window as any).closeGoogleAuthModal === 'function') {
    (window as any).closeGoogleAuthModal();
  }

  const roleNames: Record<string, string> = {
    ADMIN: 'Ban Quản Trị Hệ Thống',
    BEP_TRUONG: 'Bếp Trưởng / Quản Lý Điểm',
    KHO_TRUONG: 'Quản Lý Kho WMS',
    KE_TOAN: 'Kế Toán Kiểm Soát',
    NHAN_VIEN: 'Nhân Viên Vận Hành'
  };
  const rName = roleNames[roleCode] || roleCode;
  const w = typeof window !== 'undefined' ? (window as any) : {};
  w.pendingRequestFeature = '';
  w.pendingRequestFeatureName = `Vai trò ${rName}`;

  const featEl = document.getElementById('reqFeatureName');
  const descEl = document.getElementById('reqFeatureDesc');
  const roleSel = document.getElementById('reqRoleSelect') as HTMLSelectElement | null;
  const userEl = document.getElementById('reqUserName');
  const emailEl = document.getElementById('reqUserEmail');
  const reasonEl = document.getElementById('reqReasonInput') as HTMLTextAreaElement | null;

  const curUser = w.gCurrentUser || gCurrentUser;
  if (featEl) featEl.textContent = `Xin phê duyệt: ${rName}`;
  if (descEl) descEl.textContent = `Bạn đang gửi yêu cầu tới Ban Quản Trị để được phê duyệt vai trò ${rName}. Sau khi được duyệt, bạn sẽ được cấp quyền truy cập các chức năng của vai trò này.`;
  if (roleSel) roleSel.value = roleCode;
  if (userEl) userEl.textContent = curUser?.fullName || 'Người dùng';
  if (emailEl) emailEl.textContent = curUser?.email || '';
  if (reasonEl) reasonEl.value = '';

  document.getElementById('requestAccessModal')?.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export async function switchRoleAction(roleCode: string): Promise<void> {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  let curUser = w.gCurrentUser || gCurrentUser;

  try {
    if (typeof showLoading === 'function') showLoading('Đang chuyển vai trò...');
    const res = await fetch('/api/auth/switch-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: roleCode, email: curUser?.email || '' })
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || 'Bạn không có quyền chọn vai trò này khi chưa được Admin duyệt.');
    }

    if (!curUser) {
      curUser = {
        email: curUser?.email || '',
        fullName: curUser?.fullName || 'Người dùng',
        role: roleCode
      };
      w.gCurrentUser = curUser;
    }
    curUser.role = json.data.role;
    curUser.roleName = json.data.roleName;
    curUser.badgeColor = json.data.badgeColor;
    curUser.permissions = json.data.permissions;

    localStorage.setItem('orbit_user', JSON.stringify(curUser));
    saveAccountToList(curUser);
    applyUserSessionToUI();
    closeRoleSwitcherModal();
    if (typeof showToast === 'function') showToast(`Đã chuyển sang vai trò: ${json.data.roleName}`, 'success');
  } catch (e: any) {
    if (typeof showToast === 'function') showToast(e.message, 'warning');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export function renderLoginRoleSelection(targetUser: any): void {
  const container = document.getElementById('loginRoleSelectionContainer');
  const listEl = document.getElementById('loginRoleSelectionList');
  if (!container || !listEl) return;

  if (!targetUser || !targetUser.email) {
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');
  const currentRole = targetUser.role || 'NHAN_VIEN';
  const isOwner = targetUser.email === 'trantuandai2508@gmail.com' || currentRole === 'ADMIN';
  const approvedRoles = targetUser.approvedRoles || [currentRole];

  listEl.innerHTML = APP_SYSTEM_ROLES.map(r => {
    const isCurrent = currentRole === r.code;
    const isPermitted = isOwner || approvedRoles.includes(r.code);

    if (isPermitted) {
      return `
        <div onclick="switchRoleAction('${r.code}')" class="p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
          isCurrent
            ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-500/20 ring-1 ring-brand-500/40'
            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/40 hover:border-gray-300'
        }">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-2 h-2 rounded-full ${isCurrent ? 'bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900' : 'bg-gray-300 dark:bg-gray-600'} shrink-0"></span>
            <span class="font-bold text-gray-800 dark:text-gray-200 truncate">${r.name}</span>
          </div>
          <span class="text-xs px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">ĐÃ DUYỆT</span>
        </div>
      `;
    } else {
      return `
        <div class="p-2 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex items-center justify-between gap-2 opacity-40 select-none">
          <div class="flex items-center gap-2 min-w-0">
            <i data-lucide="lock" class="w-3 h-3 text-gray-400 shrink-0"></i>
            <span class="font-bold text-gray-400 dark:text-gray-500 truncate">${r.name}</span>
          </div>
          <button onclick="openRequestAccessForRole('${r.code}', event)" class="pointer-events-auto text-xs px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold hover:underline shrink-0">Xin duyệt</button>
        </div>
      `;
    }
  }).join('');

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}
