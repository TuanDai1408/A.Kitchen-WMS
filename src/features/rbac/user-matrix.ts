import { UserMatrixData, UserMatrixUser, UserMatrixFeature, RolePermission, UserPermission, ResolvedPermission } from './types';
import { getCleanInitials, escapeHtml } from '@/ts/utils/formatters';
import { assertPermission, canUserManageUsers } from '@/features/auth';

export let gUserMatrixData: UserMatrixData | null = null;

declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const applyUserSessionToUI: () => void;
declare const lucide: any;

export async function loadUserMatrix(): Promise<void> {
  try {
    if (typeof showLoading === 'function') showLoading();
    const resp = await fetch('/api/auth/users-matrix');
    const res = await resp.json();
    if (!res.success || !res.data) {
      if (typeof showToast === 'function') {
        showToast(res.error || 'Không thể tải dữ liệu ma trận phân quyền', 'error');
      }
      return;
    }
    gUserMatrixData = res.data;
    if (typeof window !== 'undefined') {
      (window as any).gUserMatrixData = gUserMatrixData;
    }
    renderUserMatrixKPIs(res.data);
    renderUserMatrixTable(res.data);
    renderUserMatrixMobile(res.data);
  } catch (err: any) {
    console.error('Error loadUserMatrix:', err);
    if (typeof showToast === 'function') {
      showToast('Lỗi kết nối khi tải ma trận phân quyền', 'error');
    }
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }
}

export function renderUserMatrixKPIs(data: UserMatrixData): void {
  const users = data.users || [];
  const userPerms = data.userPermissions || [];

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'ACTIVE' || !u.status).length;
  const customOverrides = userPerms.length;
  const admins = users.filter((u) => ['ADMIN', 'KHO_TRUONG', 'KE_TOAN'].includes(u.role_code)).length;

  const elTotal = document.getElementById('userMatrixKpiTotal');
  const elActive = document.getElementById('userMatrixKpiActive');
  const elOverrides = document.getElementById('userMatrixKpiCustomOverrides');
  const elAdmins = document.getElementById('userMatrixKpiAdmins');

  if (elTotal) elTotal.textContent = totalUsers.toLocaleString('vi-VN');
  if (elActive) elActive.textContent = activeUsers.toLocaleString('vi-VN');
  if (elOverrides) elOverrides.textContent = customOverrides.toLocaleString('vi-VN');
  if (elAdmins) elAdmins.textContent = admins.toLocaleString('vi-VN');
}

export function filterUserMatrix(): void {
  const data = gUserMatrixData || (typeof window !== 'undefined' ? (window as any).gUserMatrixData : null);
  if (!data) return;
  renderUserMatrixTable(data);
  renderUserMatrixMobile(data);
}

function isTruthyBool(val: any): boolean {
  return val === 1 || val === true || val === '1' || val === 'true' || val === 't';
}

export function resolveUserFeaturePermission(
  user: UserMatrixUser,
  feature: UserMatrixFeature,
  rolePermissions?: RolePermission[],
  userPermissions?: UserPermission[]
): ResolvedPermission {
  // 1. Custom Override (Cấp riêng hoặc Bị khóa)
  const custom = (userPermissions || []).find(
    (up) => up.user_email === user.email && up.feature_code === feature.code
  );
  if (custom) {
    if (isTruthyBool(custom.can_view)) {
      return { isGranted: true, type: 'CUSTOM_GRANT', label: 'Cấp riêng', badgeClass: 'bg-brand-500 text-white' };
    } else {
      return { isGranted: false, type: 'CUSTOM_REVOKE', label: 'Bị khóa', badgeClass: 'bg-rose-500 text-white' };
    }
  }

  // 2. Full Admin rights
  if (user.role_code === 'ADMIN') {
    return { isGranted: true, type: 'ROLE_DEFAULT', label: 'Role', badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
  }

  // 3. Role Permissions from Database
  const rolePerm = (rolePermissions || []).find(
    (rp) => rp.role_code === user.role_code && rp.feature_code === feature.code
  );
  if (rolePerm && isTruthyBool(rolePerm.can_view)) {
    return { isGranted: true, type: 'ROLE_DEFAULT', label: 'Role', badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
  }

  // 4. Default Role Fallback rights (khi DB chưa nạp role_permissions)
  if (user.role_code === 'KHO_TRUONG') {
    const khoFeatures = [
      'fnb-stock', 'fnb-counts', 'fnb-receipts', 'fnb-kitchen-issue', 'fnb-sites',
      'wh-dashboard', 'wh-stock', 'wh-reorder', 'wh-leadtime', 'wh-posap',
      'portal-kiemke', 'portal-history', 'portal-order', 'portal-baocao'
    ];
    if (khoFeatures.includes(feature.code)) {
      return { isGranted: true, type: 'ROLE_DEFAULT', label: 'Role', badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
    }
  } else if (user.role_code === 'BEP_TRUONG') {
    const bepFeatures = [
      'fnb-stock', 'fnb-counts', 'fnb-receipts', 'fnb-kitchen-issue', 'fnb-waste', 'fnb-sites',
      'portal-baocao', 'portal-order', 'portal-kiemke', 'portal-history'
    ];
    if (bepFeatures.includes(feature.code)) {
      return { isGranted: true, type: 'ROLE_DEFAULT', label: 'Role', badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
    }
  } else if (user.role_code === 'KE_TOAN') {
    const keToanFeatures = ['fnb-stock', 'fnb-sites', 'portal-baocao', 'portal-voucher', 'portal-search'];
    if (keToanFeatures.includes(feature.code)) {
      return { isGranted: true, type: 'ROLE_DEFAULT', label: 'Role', badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
    }
  } else if (user.role_code === 'NHAN_VIEN') {
    const nvFeatures = ['fnb-stock', 'fnb-counts', 'fnb-kitchen-issue', 'portal-baocao', 'portal-order'];
    if (nvFeatures.includes(feature.code)) {
      return { isGranted: true, type: 'ROLE_DEFAULT', label: 'Role', badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
    }
  }

  // 5. Default No Access
  return { isGranted: false, type: 'NONE', label: 'Không', badgeClass: 'bg-gray-100 dark:bg-gray-800 text-gray-400' };
}

export function renderUserMatrixTable(data: UserMatrixData): void {
  const thead = document.getElementById('userMatrixTableHead');
  const tbody = document.getElementById('userMatrixTableBody');
  if (!thead || !tbody) return;

  const users = data.users || [];
  const allFeatures = data.features || [];
  const rolePerms = data.rolePermissions || [];
  const userPerms = data.userPermissions || [];

  const searchKeyword = ((document.getElementById('userMatrixSearchInput') as HTMLInputElement | null)?.value || '').trim().toLowerCase();
  const selectedRole = (document.getElementById('userMatrixRoleFilter') as HTMLSelectElement | null)?.value || 'ALL';
  const selectedGroup = (document.getElementById('userMatrixGroupFilter') as HTMLSelectElement | null)?.value || 'ALL';

  const visibleFeatures = allFeatures.filter((f) => selectedGroup === 'ALL' || f.group === selectedGroup);

  const filteredUsers = users.filter((u) => {
    if (selectedRole !== 'ALL' && u.role_code !== selectedRole) return false;
    if (searchKeyword) {
      const matchName = (u.full_name || '').toLowerCase().includes(searchKeyword);
      const matchEmail = (u.email || '').toLowerCase().includes(searchKeyword);
      if (!matchName && !matchEmail) return false;
    }
    return true;
  });

  // Group visibleFeatures
  const groups: Array<{ group: string; groupName: string; color: string; features: UserMatrixFeature[] }> = [];
  visibleFeatures.forEach((f) => {
    let g = groups.find((x) => x.group === f.group);
    if (!g) {
      g = { group: f.group, groupName: f.groupName, color: f.color, features: [] };
      groups.push(g);
    }
    g.features.push(f);
  });

  let headHtml = `
    <tr class="bg-gray-50/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800 select-none">
      <th rowspan="2" class="py-3 px-3 text-center w-12 font-bold uppercase tracking-wider text-xs sticky left-0 z-30 bg-gray-50 dark:bg-gray-900 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">STT</th>
      <th rowspan="2" class="py-3 px-4 text-left font-bold uppercase tracking-wider text-xs sticky left-12 z-30 bg-gray-50 dark:bg-gray-900 min-w-[220px] shadow-[2px_0_5px_rgba(0,0,0,0.04)]">Nhân Sự &amp; Email</th>
      <th rowspan="2" class="py-3 px-3 text-center font-bold uppercase tracking-wider text-xs sticky left-[268px] z-30 bg-gray-50 dark:bg-gray-900 min-w-[130px] shadow-[2px_0_5px_rgba(0,0,0,0.04)]">Vai Trò Hệ Thống</th>
  `;

  groups.forEach((g) => {
    const colColor = g.color === 'rose' ? 'bg-rose-50/60 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300'
      : g.color === 'emerald' ? 'bg-emerald-50/60 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
      : g.color === 'amber' ? 'bg-amber-50/60 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'
      : g.color === 'blue' ? 'bg-blue-50/60 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300'
      : 'bg-purple-50/60 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300';

    headHtml += `
      <th colspan="${g.features.length}" class="py-2.5 px-3 text-center font-semibold uppercase tracking-wider text-xs border-l border-gray-200 dark:border-gray-800 ${colColor}">
        ${escapeHtml(g.groupName)} (${g.features.length})
      </th>
    `;
  });

  headHtml += `
      <th rowspan="2" class="py-3 px-3 text-center font-bold uppercase tracking-wider text-xs min-w-[100px] border-l border-gray-200 dark:border-gray-800">Thao Tác</th>
    </tr>
    <tr class="bg-gray-50 dark:bg-white/3 border-b border-gray-200 dark:border-gray-800 text-xs">
  `;

  visibleFeatures.forEach((f) => {
    headHtml += `
      <th class="py-2 px-2 text-center font-semibold text-gray-600 dark:text-gray-300 border-l border-gray-100 dark:border-gray-800 min-w-[110px]" title="${escapeHtml(f.name)} (${escapeHtml(f.code)})">
        <div class="flex items-center justify-center gap-1">
          <i data-lucide="${f.icon || 'shield'}" class="w-3.5 h-3.5 text-gray-400"></i>
          <span class="truncate max-w-[95px]">${escapeHtml(f.name)}</span>
        </div>
      </th>
    `;
  });

  headHtml += `</tr>`;
  thead.innerHTML = headHtml;

  // Table Body
  if (filteredUsers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${visibleFeatures.length + 4}" class="text-center py-12 text-gray-400">Không tìm thấy người dùng nào phù hợp với bộ lọc.</td></tr>`;
    return;
  }

  const canManage = canUserManageUsers();

  tbody.innerHTML = filteredUsers.map((u, idx) => {
    const isLocked = u.status === 'LOCKED';
    const initials = getCleanInitials(u.full_name || u.email);
    const avatarUrl = (u.avatar_url && !u.avatar_url.includes('ui-avatars.com'))
      ? u.avatar_url
      : `https://ui-avatars.com/api/?name=${initials}&background=465fff&color=fff&bold=true`;

    const roleBadge = u.role_code === 'ADMIN' ? '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">ADMIN</span>'
      : u.role_code === 'KHO_TRUONG' ? '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">KHO_TRƯỞNG</span>'
      : u.role_code === 'BEP_TRUONG' ? '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">BẾP_TRƯỞNG</span>'
      : u.role_code === 'KE_TOAN' ? '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">KẾ_TOÁN</span>'
      : u.role_code === 'QUAN_LY_VUNG' ? '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">QL_VÙNG</span>'
      : '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">NHÂN_VIÊN</span>';

    let rowHtml = `
      <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors ${isLocked ? 'opacity-60 bg-rose-50/20' : ''}">
        <td class="py-3 px-3 text-center font-mono tabular-nums text-gray-400 text-xs sticky left-0 z-20 bg-white dark:bg-gray-900 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">${idx + 1}</td>
        <td class="py-3 px-4 sticky left-12 z-20 bg-white dark:bg-gray-900 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
          <div class="flex items-center gap-2.5">
            <img src="${avatarUrl}" class="size-8 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 shrink-0" alt="Avatar">
            <div class="min-w-0">
              <div class="font-bold text-gray-900 dark:text-white truncate max-w-[160px] text-xs">${escapeHtml(u.full_name || 'Chưa đặt tên')}</div>
              <div class="text-xs text-gray-400 truncate max-w-[160px] font-mono" title="${escapeHtml(u.email)}">${escapeHtml(u.email)}</div>
            </div>
          </div>
        </td>
        <td class="py-3 px-3 text-center sticky left-[268px] z-20 bg-white dark:bg-gray-900 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
          ${canManage ? `
            <button onclick="openEditUserModal('${escapeHtml(u.email)}')" class="hover:scale-105 transition-transform" title="Bấm để đổi vai trò của user này">
              ${roleBadge}
            </button>
          ` : `
            <div>${roleBadge}</div>
          `}
        </td>
    `;

    visibleFeatures.forEach((f) => {
      const perm = resolveUserFeaturePermission(u, f, rolePerms, userPerms);
      let btnBg = '';
      let icon = '';
      let tooltipText = '';

      if (perm.isGranted) {
        if (perm.type === 'CUSTOM_GRANT') {
          btnBg = 'bg-brand-500 hover:bg-brand-600 text-white shadow-xs';
          icon = '<i data-lucide="check" class="w-3.5 h-3.5"></i>';
          tooltipText = `Đang CẤP RIÊNG. Bấm để CẮT QUYỀN ${f.name}`;
        } else {
          btnBg = 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs';
          icon = '<i data-lucide="check" class="w-3.5 h-3.5"></i>';
          tooltipText = `Có quyền theo vai trò ${u.role_code}. Bấm để CẮT QUYỀN ${f.name}`;
        }
      } else {
        if (perm.type === 'CUSTOM_REVOKE') {
          btnBg = 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs';
          icon = '<i data-lucide="x" class="w-3.5 h-3.5"></i>';
          tooltipText = `Đã BỊ CẮT QUYỀN. Bấm để CẤP LẠI ${f.name}`;
        } else {
          btnBg = 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-400';
          icon = '<i data-lucide="minus" class="w-3.5 h-3.5"></i>';
          tooltipText = `Không có quyền. Bấm để CẤP QUYỀN ${f.name}`;
        }
      }

      rowHtml += `
        <td class="py-2.5 px-2 text-center border-l border-gray-100 dark:border-gray-800/60">
          <div class="inline-flex flex-col items-center gap-1">
            <button
              ${canManage ? `onclick="toggleUserPermission('${escapeHtml(u.email)}', '${escapeHtml(f.code)}', ${perm.isGranted}, '${perm.type}')"` : `disabled`}
              class="size-7 rounded-lg ${btnBg} flex items-center justify-center transition-all ${canManage ? 'active:scale-90' : 'cursor-not-allowed opacity-80'}"
              title="${canManage ? tooltipText : 'Chỉ Quản trị viên mới có quyền thay đổi phân quyền'}"
            >
              ${icon}
            </button>
            <span class="text-[10px] px-1 py-0.2 rounded font-bold ${perm.badgeClass}">${perm.label}</span>
          </div>
        </td>
      `;
    });

    rowHtml += `
        <td class="py-3 px-3 text-center border-l border-gray-100 dark:border-gray-800">
          ${canManage ? `
            <div class="flex items-center justify-center gap-1.5">
              <button onclick="openEditUserModal('${escapeHtml(u.email)}')" class="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors" title="Chỉnh sửa vai trò & tài khoản">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="toggleUserStatusPrompt('${escapeHtml(u.email)}', '${isLocked ? 'ACTIVE' : 'LOCKED'}')" class="p-1.5 rounded-lg border ${isLocked ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' : 'border-rose-200 text-rose-600 hover:bg-rose-50'} transition-colors" title="${isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}">
                <i data-lucide="${isLocked ? 'unlock' : 'lock'}" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          ` : `
            <span class="text-xs text-gray-400 italic">Chỉ xem</span>
          `}
        </td>
      </tr>
    `;

    return rowHtml;
  }).join('');

  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

export function renderUserMatrixMobile(data: UserMatrixData): void {
  const container = document.getElementById('userMatrixMobileCards');
  if (!container) return;

  const users = data.users || [];
  const allFeatures = data.features || [];
  const rolePerms = data.rolePermissions || [];
  const userPerms = data.userPermissions || [];

  const searchKeyword = ((document.getElementById('userMatrixSearchInput') as HTMLInputElement | null)?.value || '').trim().toLowerCase();
  const selectedRole = (document.getElementById('userMatrixRoleFilter') as HTMLSelectElement | null)?.value || 'ALL';

  const filteredUsers = users.filter((u) => {
    if (selectedRole !== 'ALL' && u.role_code !== selectedRole) return false;
    if (searchKeyword) {
      const matchName = (u.full_name || '').toLowerCase().includes(searchKeyword);
      const matchEmail = (u.email || '').toLowerCase().includes(searchKeyword);
      if (!matchName && !matchEmail) return false;
    }
    return true;
  });

  if (filteredUsers.length === 0) {
    container.innerHTML = '<div class="text-center py-8 text-gray-400 text-xs">Không tìm thấy tài khoản nào.</div>';
    return;
  }

  const canManage = canUserManageUsers();

  container.innerHTML = filteredUsers.map((u) => {
    const initials = getCleanInitials(u.full_name || u.email);
    const avatarUrl = (u.avatar_url && !u.avatar_url.includes('ui-avatars.com'))
      ? u.avatar_url
      : `https://ui-avatars.com/api/?name=${initials}&background=465fff&color=fff&bold=true`;

    const featuresGrid = allFeatures.map((f) => {
      const perm = resolveUserFeaturePermission(u, f, rolePerms, userPerms);
      const isGranted = perm.isGranted;
      const isRevoked = perm.type === 'CUSTOM_REVOKE';

      return `
        <div class="flex items-center justify-between p-2 rounded-xl border border-gray-100 dark:border-gray-800 ${isGranted ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : (isRevoked ? 'bg-rose-50/40 dark:bg-rose-950/20' : 'bg-gray-50/50 dark:bg-gray-800/30')}">
          <div class="flex items-center gap-2 min-w-0">
            <i data-lucide="${f.icon || 'shield'}" class="w-3.5 h-3.5 text-gray-400 shrink-0"></i>
            <span class="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">${escapeHtml(f.name)}</span>
          </div>
          <button
            ${canManage ? `onclick="toggleUserPermission('${escapeHtml(u.email)}', '${escapeHtml(f.code)}', ${perm.isGranted}, '${perm.type}')"` : `disabled`}
            class="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${isGranted ? 'bg-emerald-500 text-white' : (isRevoked ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-600')} ${canManage ? '' : 'cursor-not-allowed opacity-80'}"
            title="${canManage ? '' : 'Chỉ Quản trị viên mới có quyền thay đổi phân quyền'}"
          >
            <span>${isGranted ? 'BẬT' : 'TẮT'}</span>
            <span class="text-[8px] opacity-80">(${perm.label})</span>
          </button>
        </div>
      `;
    }).join('');

    return `
      <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3.5">
        <div class="flex items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800/80 pb-3">
          <div class="flex items-center gap-2.5 min-w-0">
            <img src="${avatarUrl}" class="size-9 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 shrink-0" alt="Avatar">
            <div class="min-w-0">
              <div class="font-semibold text-xs text-gray-900 dark:text-white truncate">${escapeHtml(u.full_name || 'Chưa đặt tên')}</div>
              <div class="text-xs text-gray-400 truncate font-mono">${escapeHtml(u.email)}</div>
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="text-xs px-2 py-0.5 rounded font-semibold bg-brand-50 text-brand-600 border border-brand-200">${u.role_code}</span>
            ${canManage ? `
              <button onclick="openEditUserModal('${escapeHtml(u.email)}')" class="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
                <i data-lucide="more-vertical" class="w-4 h-4"></i>
              </button>
            ` : ''}
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          ${featuresGrid}
        </div>
      </div>
    `;
  }).join('');

  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

export async function toggleUserPermission(
  userEmail: string,
  featureCode: string,
  currentlyGranted: boolean,
  _currentType: string
): Promise<void> {
  if (!assertPermission('user-matrix', 'edit', 'thay đổi phân quyền người dùng')) return;
  try {
    const action = currentlyGranted ? 'REVOKE' : 'GRANT';

    if (gUserMatrixData && gUserMatrixData.userPermissions) {
      const existing = gUserMatrixData.userPermissions.find((p) => p.user_email === userEmail && p.feature_code === featureCode);
      const newCanView = action === 'GRANT';
      if (existing) {
        existing.can_view = newCanView;
      } else {
        gUserMatrixData.userPermissions.push({
          user_email: userEmail,
          feature_code: featureCode,
          can_view: newCanView
        });
      }
      renderUserMatrixTable(gUserMatrixData);
      renderUserMatrixMobile(gUserMatrixData);
    }

    const resp = await fetch('/api/auth/user-permissions/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, featureCode, action })
    });
    const res = await resp.json();
    if (!res.success) {
      if (typeof showToast === 'function') showToast(res.error || 'Không thể lưu phân quyền', 'error');
      loadUserMatrix();
      return;
    }

    if (typeof showToast === 'function') showToast(res.message || 'Đã cập nhật phân quyền thành công', 'success');

    const currentUser = typeof window !== 'undefined' ? (window as any).gCurrentUser : null;
    if (currentUser && currentUser.email === userEmail) {
      if (!currentUser.permissions) currentUser.permissions = {};
      if (action === 'GRANT') {
        currentUser.permissions[featureCode] = { canView: true, canCreate: true, canEdit: true, canDelete: true, isCustom: true };
      } else {
        currentUser.permissions[featureCode] = { canView: false, canCreate: false, canEdit: false, canDelete: false, isRevoked: true };
      }
      try {
        localStorage.setItem('orbit_user', JSON.stringify(currentUser));
      } catch {}
      if (typeof applyUserSessionToUI === 'function') {
        applyUserSessionToUI();
      }
    }
  } catch (err: any) {
    console.error('Error toggleUserPermission:', err);
    if (typeof showToast === 'function') showToast('Lỗi mạng khi lưu phân quyền', 'error');
    loadUserMatrix();
  }
}

export async function bulkSetUserPermissions(
  userEmail: string,
  action: 'REVOKE_ALL' | 'GRANT_ALL'
): Promise<void> {
  if (!assertPermission('user-matrix', 'edit', 'phân quyền hàng loạt')) return;
  try {
    const isRevoke = action === 'REVOKE_ALL';
    if (typeof showLoading === 'function') {
      showLoading(isRevoke ? `Đang khóa toàn bộ quyền các tab cho ${userEmail}...` : `Đang cấp toàn bộ quyền các tab cho ${userEmail}...`);
    }

    const resp = await fetch('/api/auth/user-permissions/bulk-set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, action })
    });
    const res = await resp.json();
    if (!res.success) {
      if (typeof showToast === 'function') showToast(res.error || 'Lỗi khi cập nhật phân quyền hàng loạt', 'error');
      return;
    }

    if (typeof showToast === 'function') {
      showToast(res.message || 'Đã cập nhật phân quyền hàng loạt thành công', 'success');
    }

    // Cập nhật lại phiên làm việc nếu là chính user hiện tại
    const currentUser = typeof window !== 'undefined' ? (window as any).gCurrentUser : null;
    if (currentUser && currentUser.email === userEmail) {
      if (!currentUser.permissions) currentUser.permissions = {};
      const allFeats = (gUserMatrixData?.features || []).map((f) => f.code);
      allFeats.forEach((fCode) => {
        currentUser.permissions[fCode] = isRevoke
          ? { canView: false, canCreate: false, canEdit: false, canDelete: false, isRevoked: true }
          : { canView: true, canCreate: true, canEdit: true, canDelete: true, isCustom: true };
      });
      try {
        localStorage.setItem('orbit_user', JSON.stringify(currentUser));
      } catch {}
      if (typeof applyUserSessionToUI === 'function') {
        applyUserSessionToUI();
      }
    }

    await loadUserMatrix();
  } catch (err: any) {
    console.error('Error bulkSetUserPermissions:', err);
    if (typeof showToast === 'function') showToast('Lỗi mạng khi lưu phân quyền', 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export async function resetUserFeaturePermission(userEmail: string, featureCode: string): Promise<void> {
  try {
    if (typeof showLoading === 'function') showLoading();
    const resp = await fetch('/api/auth/user-permissions/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, featureCode, action: 'RESET' })
    });
    const res = await resp.json();
    if (res.success) {
      if (typeof showToast === 'function') showToast('Đã khôi phục quyền mặc định theo vai trò', 'info');
      await loadUserMatrix();
    } else {
      if (typeof showToast === 'function') showToast(res.error || 'Không thể khôi phục quyền', 'error');
    }
  } catch {
    if (typeof showToast === 'function') showToast('Lỗi mạng khi khôi phục quyền', 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}
