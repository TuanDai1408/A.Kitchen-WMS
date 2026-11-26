import { gCurrentUser, saveAccountToList } from './accounts';
import { APP_SYSTEM_ROLES, repairAtobMojibake, loadPersistedUser, isMasterAccount } from './constants';
import { checkAndPromptUserSite, renderSitesOptions } from './sites-modal';
import { checkPendingAccessRequests } from './access-requests';
import { getCleanInitials } from '@/ts/utils/formatters';

declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const lucide: any;
declare const TAB_META: any;

let lastFocusSyncTime = Date.now();

export interface CustomTabGroupOrder {
  groupId: string;
  tabs: string[];
}

export let gSystemTabVisibility: Record<string, boolean> = {};
export let gSystemTabOrder: CustomTabGroupOrder[] | null = null;

export function loadPersistedTabVisibility(): Record<string, boolean> {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('orbit_tab_visibility');
      if (raw) {
        gSystemTabVisibility = JSON.parse(raw) || {};
        return gSystemTabVisibility;
      }
    }
  } catch (e) {}
  gSystemTabVisibility = {};
  return gSystemTabVisibility;
}

export function setSystemTabVisibility(vis: Record<string, boolean>): void {
  gSystemTabVisibility = vis || {};
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('orbit_tab_visibility', JSON.stringify(gSystemTabVisibility));
    }
  } catch (e) {}
}

export function loadPersistedTabOrder(): CustomTabGroupOrder[] | null {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('orbit_tab_order');
      if (raw) {
        gSystemTabOrder = JSON.parse(raw);
        return gSystemTabOrder;
      }
    }
  } catch (e) {}
  gSystemTabOrder = null;
  return null;
}

export function setSystemTabOrder(order: CustomTabGroupOrder[] | null): void {
  gSystemTabOrder = order;
  try {
    if (typeof localStorage !== 'undefined') {
      if (order && Array.isArray(order)) {
        localStorage.setItem('orbit_tab_order', JSON.stringify(order));
      } else {
        localStorage.removeItem('orbit_tab_order');
      }
    }
  } catch (e) {}
}

/**
 * Cập nhật thứ tự hiển thị các Tab và Nhóm Tab trên cả PC (Sidebar) và Mobile (Hub Menu)
 */
export function applyCustomTabOrderToUI(customStructure?: CustomTabGroupOrder[]): void {
  const structure = customStructure || gSystemTabOrder;
  if (!structure || !Array.isArray(structure) || structure.length === 0) return;

  // 1. Sắp xếp lại Sidebar trên Desktop (#sidebar nav)
  const nav = document.querySelector('#sidebar nav');
  if (nav) {
    structure.forEach(group => {
      const catEl = nav.querySelector(`.sidebar-category[data-cat="${group.groupId}"]`);
      if (catEl) {
        nav.appendChild(catEl); // Đưa nhóm category theo thứ tự

        const ul = catEl.querySelector('ul');
        if (ul && Array.isArray(group.tabs)) {
          group.tabs.forEach(tabId => {
            const btn = document.querySelector(`#sidebar .nav-btn[data-tab="${tabId}"]`);
            if (btn) {
              const li = btn.closest('li');
              if (li) {
                ul.appendChild(li); // Đưa tab theo đúng thứ tự mới
              }
            }
          });
        }
      }
    });
  }

  // 2. Sắp xếp lại Menu Hub trên Mobile (#mobileHubScrollArea)
  const hubScroll = document.getElementById('mobileHubScrollArea');
  if (hubScroll) {
    structure.forEach(group => {
      const mobCat = hubScroll.querySelector(`.mobile-hub-category[data-cat="${group.groupId}"]`);
      if (mobCat) {
        hubScroll.appendChild(mobCat);

        const grid = mobCat.querySelector('.grid');
        if (grid && Array.isArray(group.tabs)) {
          group.tabs.forEach(tabId => {
            const hubItem = document.querySelector(`#mobileHubScrollArea .hub-item[data-tab="${tabId}"]`);
            if (hubItem) {
              grid.appendChild(hubItem);
            }
          });
        }
      }
    });
  }

  // Tái áp dụng quyền và trạng thái hiển thị / ẩn
  applyUserSessionToUI();
}

export function initRbacAuth(): void {
  loadPersistedTabVisibility();
  loadPersistedTabOrder();
  applyCustomTabOrderToUI();

  const w = typeof window !== 'undefined' ? (window as any) : {};
  let curUser = w.gCurrentUser || gCurrentUser;
  if (!curUser) {
    curUser = loadPersistedUser();
    w.gCurrentUser = curUser;
  }

  renderSitesOptions();

  // Chủ động tải trạng thái ẩn/hiện và thứ tự tab mới nhất từ CSDL D1 ngay khi khởi động
  if (typeof fetch === 'function') {
    fetch('/api/system/tab-visibility')
      .then(res => res.json())
      .then(json => {
        if (json && json.success) {
          if (json.data) {
            setSystemTabVisibility(json.data);
          }
          if (json.tabOrder && Array.isArray(json.tabOrder)) {
            setSystemTabOrder(json.tabOrder);
            applyCustomTabOrderToUI(json.tabOrder);
          } else {
            applyUserSessionToUI();
          }
        }
      })
      .catch(() => {});
  }

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
    const json = await res.json().catch(() => ({}));

    // Nếu tài khoản bị khóa ở backend D1
    if (res.status === 403 || json.isLocked || (json.data && json.data.user && json.data.user.status === 'LOCKED') || json.status === 'LOCKED') {
      curUser.status = 'LOCKED';
      curUser.permissions = {};
      try { localStorage.setItem('orbit_user', JSON.stringify(curUser)); } catch (e) {}
      saveAccountToList(curUser);
      applyUserSessionToUI();
      return;
    }

    if (json.success && json.data) {
      if (json.data.tabVisibility && typeof json.data.tabVisibility === 'object') {
        setSystemTabVisibility(json.data.tabVisibility);
      }
      if (json.data.tabOrder && Array.isArray(json.data.tabOrder)) {
        setSystemTabOrder(json.data.tabOrder);
        applyCustomTabOrderToUI(json.data.tabOrder);
      }
      curUser.status = (json.data.user && json.data.user.status) || json.data.status || 'ACTIVE';
      curUser.permissions = json.data.permissions || {};
      curUser.role = json.data.role;
      curUser.roleName = json.data.roleName;
      if (json.data.user && json.data.user.fullName) curUser.fullName = json.data.user.fullName;
      if (json.data.user && json.data.user.avatarUrl) curUser.avatarUrl = json.data.user.avatarUrl;

      const serverSite = (json.data.user && json.data.user.assignedSite) || json.data.assignedSite;
      if (serverSite) {
        const prevSite = curUser.assignedSite || localStorage.getItem('orbit_user_site');
        const w = typeof window !== 'undefined' ? (window as any) : {};
        const canSwitch = typeof w.canUserSwitchSite === 'function' ? w.canUserSwitchSite(curUser) : false;
        if (!canSwitch && prevSite !== serverSite) {
          curUser.assignedSite = serverSite;
          try {
            localStorage.setItem('orbit_user_site', serverSite);
            localStorage.removeItem('orbit_pending_site_request');
          } catch (e) {}
          if (typeof w.onGlobalBranchChange === 'function') {
            w.onGlobalBranchChange(serverSite);
          }
          if (typeof showToast === 'function') {
            showToast(`Yêu cầu đổi sang site [${serverSite}] đã được Quản trị viên duyệt!`, 'success');
          }
        } else if (!curUser.assignedSite) {
          curUser.assignedSite = serverSite;
        }
      }

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

  // XỬ LÝ KHẨN CẤP: TÀI KHOẢN ĐÃ BỊ KHÓA HOÀN TOÀN
  if (curUser.status === 'LOCKED') {
    if (roleEl) {
      roleEl.textContent = 'BỊ KHÓA';
      roleEl.className = 'text-xs px-1.5 py-0.2 rounded font-semibold uppercase bg-rose-600 text-white';
    }
    if (hdrRole) {
      hdrRole.textContent = 'BỊ KHÓA';
      hdrRole.className = 'text-xs font-semibold text-rose-500 uppercase';
    }

    // Ẩn 100% menu điều hướng bên trái
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

    // Ẩn menu mobile & các nút chuyển tab
    document.querySelectorAll('.hub-item').forEach(item => {
      item.classList.add('hidden');
      (item as HTMLElement).style.display = 'none';
    });
    ['mobTab-fnb-chain', 'mobTab-wh-dashboard', 'mobTab-portal-voucher', 'mobTab-portal-baocao'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('hidden');
        el.style.display = 'none';
      }
    });
    const adminBtn = document.getElementById('adminPendingReqBtn');
    if (adminBtn) adminBtn.classList.add('hidden');

    // Chuyển hướng ngay lập tức về tab-account-locked
    const switchFn = (window as any)._origSwitchTab || (window as any).switchTab;
    if (typeof switchFn === 'function') {
      switchFn('tab-account-locked');
    } else {
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const lockedPanel = document.getElementById('tab-account-locked');
      if (lockedPanel) lockedPanel.classList.add('active');
    }
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    return;
  }

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

  // Master Owner Control Section (chỉ dành riêng cho trantuandai2508)
  const masterContainer = document.getElementById('profMasterControlContainer');
  if (masterContainer) {
    if (isMasterAccount(curUser.email)) {
      masterContainer.classList.remove('hidden');
      masterContainer.style.display = '';
    } else {
      masterContainer.classList.add('hidden');
      masterContainer.style.display = 'none';
    }
  }

  const masterMatrixBtn = document.getElementById('masterTabVisBtn');
  if (masterMatrixBtn) {
    if (isMasterAccount(curUser.email)) {
      masterMatrixBtn.classList.remove('hidden');
      masterMatrixBtn.style.display = '';
    } else {
      masterMatrixBtn.classList.add('hidden');
      masterMatrixBtn.style.display = 'none';
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
  // Đảm bảo: nếu user có >= 5 tab được phân quyền thì luôn hiển thị đủ 5 nút (4 nút truy cập nhanh + nút "Tất Cả"),
  // đồng thời không bao giờ gán nút vào tab không có quyền (vd: wh-dashboard khi user chỉ có fnb-receipts / wh-stock).
  const SHORT_TAB_INFO: Record<string, { title: string; icon: string }> = {
    'fnb-chain': { title: 'Chuỗi F&B', icon: 'trophy' },
    'fnb-pl': { title: 'Báo Cáo P&L', icon: 'pie-chart' },
    'fnb-pos': { title: 'Doanh Thu POS', icon: 'zap' },
    'fnb-receipts': { title: 'Nhập Site', icon: 'package-plus' },
    'fnb-kitchen-issue': { title: 'Xuất Bếp', icon: 'utensils' },
    'fnb-counts': { title: 'Kiểm Kê Site', icon: 'clipboard-check' },
    'fnb-stock': { title: 'Tồn Kho Site', icon: 'boxes' },
    'fnb-waste': { title: 'Hao Hụt', icon: 'trash-2' },
    'wh-dashboard': { title: 'Kho Tổng', icon: 'warehouse' },
    'wh-stock': { title: 'Hạn Dùng', icon: 'calendar-clock' },
    'wh-reorder': { title: 'Đặt Hàng Kho', icon: 'shopping-bag' },
    'wh-leadtime': { title: 'Leadtime', icon: 'timer' },
    'wh-posap': { title: 'PO SAP', icon: 'file-spreadsheet' },
    'portal-voucher': { title: 'Chứng Từ', icon: 'file-check-2' },
    'portal-search': { title: 'Tra Cứu', icon: 'search' },
    'portal-baocao': { title: 'Suất Ăn', icon: 'bar-chart-3' },
    'portal-order': { title: 'Đặt Hàng', icon: 'shopping-cart' },
    'portal-history': { title: 'Lịch Sử ĐH', icon: 'history' },
    'portal-kiemke': { title: 'Kiểm Kê Kho', icon: 'clipboard-list' },
    'sys-users': { title: 'Phân Quyền', icon: 'shield-check' },
    'sys-items': { title: 'Danh Mục', icon: 'list' },
    'sys-sites': { title: 'Chi Nhánh', icon: 'map-pin' },
    'sys-logs': { title: 'Nhật Ký', icon: 'scroll-text' },
  };

  const slotConfigs = [
    {
      el: document.getElementById('mobTab-fnb-chain'),
      group: 'fnb',
      defaultTitle: 'Chuỗi F&B',
      defaultIcon: 'trophy',
      candidates: ['fnb-chain', 'fnb-pl', 'fnb-pos'],
    },
    {
      el: document.getElementById('mobTab-wh-dashboard'),
      group: 'kho-van',
      defaultTitle: 'Kho Vận',
      defaultIcon: 'warehouse',
      candidates: ['wh-dashboard', 'fnb-receipts', 'fnb-kitchen-issue', 'fnb-counts', 'fnb-stock', 'fnb-waste', 'wh-stock', 'wh-reorder', 'wh-leadtime', 'wh-posap'],
    },
    {
      el: document.getElementById('mobTab-portal-voucher'),
      group: 'chung-tu',
      defaultTitle: 'Chứng Từ',
      defaultIcon: 'file-check-2',
      candidates: ['portal-voucher', 'portal-search'],
    },
    {
      el: document.getElementById('mobTab-portal-baocao'),
      group: 'suat-an',
      defaultTitle: 'Suất Ăn',
      defaultIcon: 'bar-chart-3',
      candidates: ['portal-baocao', 'portal-order', 'portal-history', 'portal-kiemke'],
    },
  ];

  const assignedTabs = new Set<string>();
  const resolvedSlots: Array<{
    el: HTMLElement | null;
    targetTab: string | null;
    title: string;
    icon: string;
    groupOnClick: string | null;
  }> = slotConfigs.map(cfg => {
    const matched = cfg.candidates.find(t => canAccessTab(t) && !assignedTabs.has(t)) || null;
    if (matched) {
      assignedTabs.add(matched);
      return {
        el: cfg.el,
        targetTab: matched,
        title: cfg.defaultTitle,
        icon: cfg.defaultIcon,
        groupOnClick: `switchMobileGroupTab('${cfg.group}')`,
      };
    }
    return {
      el: cfg.el,
      targetTab: null,
      title: cfg.defaultTitle,
      icon: cfg.defaultIcon,
      groupOnClick: null,
    };
  });

  // Thu thập toàn bộ các tab được phân quyền còn lại (chưa gán vào 4 slot) theo thứ tự sidebar
  const remainingAllowedTabs: string[] = [];
  document.querySelectorAll('#sidebar .nav-btn:not(.hidden)').forEach(btn => {
    const tId = btn.getAttribute('data-tab');
    if (tId && canAccessTab(tId) && !assignedTabs.has(tId) && !remainingAllowedTabs.includes(tId)) {
      remainingAllowedTabs.push(tId);
    }
  });

  // Lấp đầy các slot trống bằng các tab còn lại để khi user có >= 5 tab luôn hiển thị đủ 5 nút (4 slot + Tất Cả)
  let needsLucideRefresh = false;
  resolvedSlots.forEach(slot => {
    if (!slot.targetTab && remainingAllowedTabs.length > 0) {
      const nextTab = remainingAllowedTabs.shift()!;
      assignedTabs.add(nextTab);
      slot.targetTab = nextTab;
      slot.groupOnClick = null;
      const meta = SHORT_TAB_INFO[nextTab];
      slot.title = meta?.title || (typeof TAB_META !== 'undefined' && TAB_META[nextTab]?.title) || nextTab;
      slot.icon = meta?.icon || 'layers';
    }

    if (!slot.el) return;
    if (slot.targetTab) {
      slot.el.classList.remove('hidden');
      slot.el.style.display = '';
      slot.el.setAttribute('onclick', slot.groupOnClick || `switchTab('${slot.targetTab}')`);
      const span = slot.el.querySelector('span');
      if (span) span.textContent = slot.title;
      const icWrap = slot.el.querySelector('.mob-ic-wrap');
      if (icWrap) {
        icWrap.innerHTML = `<i data-lucide="${slot.icon}" class="w-5 h-5"></i>`;
        needsLucideRefresh = true;
      }
    } else {
      slot.el.classList.add('hidden');
      slot.el.style.display = 'none';
    }
  });

  if (needsLucideRefresh && typeof lucide !== 'undefined') {
    lucide.createIcons();
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

  // 6. Kiểm tra tab hiện tại: nếu bị khóa -> chuyển về tab an toàn hoặc tab-403
  const curActivePanel = document.querySelector('.tab-panel.active');
  const curTabId = curActivePanel ? curActivePanel.id : (localStorage.getItem('orbit_active_tab') || 'fnb-chain');
  if (!canAccessTab(curTabId)) {
    const firstAllowedBtn = document.querySelector('#sidebar .nav-btn:not(.hidden)');
    const safeTabId = firstAllowedBtn ? firstAllowedBtn.getAttribute('data-tab') : 'tab-403';
    const switchFn = (window as any)._origSwitchTab || (window as any).switchTab;
    if (safeTabId && typeof switchFn === 'function') {
      switchFn(safeTabId);
    } else {
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const safePanel = document.getElementById(safeTabId || 'tab-403');
      if (safePanel) safePanel.classList.add('active');
    }
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function canAccessTab(tabId: string): boolean {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  const curUser = w.gCurrentUser || gCurrentUser;
  if (!curUser) return false;

  // Nếu tài khoản bị KHÓA hoàn toàn
  if (curUser.status === 'LOCKED') {
    return tabId === 'tab-account-locked';
  }

  // Các trang hệ thống nội bộ
  if (tabId === 'tab-403' || tabId === 'tab-404') {
    return true;
  }
  if (tabId === 'tab-account-locked') {
    return false;
  }

  // ĐẶC QUYỀN TUYỆT ĐỐI: Tab Cấu hình hệ thống ('sys-config') CHỈ DÀNH RIÊNG CHO MASTER OWNER (trantuandai2508)
  if (tabId === 'sys-config') {
    return isMasterAccount(curUser);
  }

  // ĐẶC QUYỀN VÀ KHÓA CHẶN MASTER OWNER (trantuandai2508):
  // Khi một tab bị đánh dấu ẨN trên toàn hệ thống (gSystemTabVisibility[tabId] === true),
  // tab đó sẽ bị ẨN HOÀN TOÀN khỏi Sidebar, Menu Hub, Bottom Nav và CHẶN truy cập đối với tất cả người dùng (kể cả ADMIN và Master User khi duyệt giao diện).
  // Master Owner quản lý bật/tắt hiển thị tab thông qua Modal "👑 Quản lý Ẩn/Hiện Tab Webapp" (từ Profile hoặc User Matrix).
  if (gSystemTabVisibility[tabId] === true) {
    return false;
  }

  // Single Source of Truth từ CSDL Backend D1
  if (curUser.permissions && typeof curUser.permissions === 'object') {
    const p = curUser.permissions[tabId];
    if (p !== undefined) {
      if (p.isRevoked === true || p.canView === false) {
        return false;
      }
      return Boolean(p.canView);
    }
    // Đối với ADMIN: nếu quyền không bị revoked rõ ràng thì được phép truy cập
    if (curUser.role === 'ADMIN') {
      return true;
    }
    // Đối với các vai trò khác: nếu đã có ma trận permissions nhưng tab không có trong đó -> cấm
    return false;
  }

  // ADMIN luôn có toàn quyền quản trị nếu chưa có ma trận permissions ghi đè
  if (curUser.role === 'ADMIN') return true;

  // Fallback theo vai trò mặc định (khi chưa cấu hình permissions cá nhân)
  const financeTabs = ['fnb-chain', 'fnb-pl', 'fnb-pos'];
  if (financeTabs.includes(tabId)) return false;

  if (curUser.role === 'KHO_TRUONG') {
    return ['fnb-stock', 'fnb-counts', 'fnb-receipts', 'fnb-kitchen-issue', 'fnb-sites', 'wh-dashboard', 'wh-stock', 'wh-reorder', 'wh-leadtime', 'wh-posap', 'portal-kiemke', 'portal-history', 'portal-order', 'portal-baocao'].includes(tabId);
  }
  if (curUser.role === 'BEP_TRUONG') {
    return ['wh-dashboard', 'fnb-counts', 'fnb-receipts', 'fnb-kitchen-issue', 'fnb-waste', 'fnb-sites', 'portal-baocao', 'portal-order', 'portal-kiemke', 'portal-history'].includes(tabId);
  }
  if (curUser.role === 'KE_TOAN') {
    return ['wh-dashboard', 'fnb-sites', 'portal-baocao', 'portal-voucher', 'portal-search'].includes(tabId);
  }
  if (curUser.role === 'NHAN_VIEN') {
    return ['wh-dashboard', 'fnb-counts', 'fnb-kitchen-issue', 'portal-baocao', 'portal-order'].includes(tabId);
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
        <div onclick="switchRoleAction('${r.code}')" class="p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
          isCurrent
            ? 'border-brand-500 bg-emerald-50/80 dark:bg-emerald-950/25 ring-1.5 ring-brand-500/40 shadow-xs'
            : 'border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xs'
        }">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-2 h-2 rounded-full ${isCurrent ? 'bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900' : 'bg-gray-300 dark:bg-gray-600'} shrink-0"></span>
            <span class="font-bold text-xs text-gray-800 dark:text-gray-200 truncate">${r.name}</span>
          </div>
          <span class="text-[9.5px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 shrink-0">ĐÃ DUYỆT</span>
        </div>
      `;
    } else {
      return `
        <div class="p-2 sm:p-2.5 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/20 flex items-center justify-between gap-2 opacity-50 select-none">
          <div class="flex items-center gap-2 min-w-0">
            <i data-lucide="lock" class="w-3 h-3 text-gray-400 shrink-0"></i>
            <span class="font-medium text-xs text-gray-400 dark:text-gray-500 truncate">${r.name}</span>
          </div>
          <button onclick="openRequestAccessForRole('${r.code}', event)" class="pointer-events-auto text-[10px] px-2 py-0.5 rounded-full bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 text-brand-600 dark:text-brand-400 font-bold hover:underline shrink-0 transition-colors">Xin duyệt ↗</button>
        </div>
      `;
    }
  }).join('');

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}
