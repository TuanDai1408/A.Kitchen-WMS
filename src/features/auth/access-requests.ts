import { AuthAccessRequest } from './types';
import { FEATURE_TITLES, repairAtobMojibake } from './constants';
import { gCurrentUser } from './accounts';
import { openSiteSelectorModal } from './sites-modal';

export let cachedAccessRequests: AuthAccessRequest[] = [];
export let pendingRequestFeature: string = '';
export let pendingRequestFeatureName: string = '';

declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const openGoogleAuthModal: (isForce?: boolean) => void;
declare const lucide: any;

export function openRequestAccessModal(tabId: string): void {
  if (!gCurrentUser) {
    if (typeof (window as any).openGoogleAuthModal === 'function') {
      (window as any).openGoogleAuthModal(true);
    }
    return;
  }

  const info = FEATURE_TITLES[tabId] || { name: tabId, role: 'BEP_TRUONG', desc: 'Chức năng quản lý nâng cao' };
  pendingRequestFeature = tabId;
  pendingRequestFeatureName = info.name;

  const featEl = document.getElementById('reqFeatureName');
  const descEl = document.getElementById('reqFeatureDesc');
  const roleSel = document.getElementById('reqRoleSelect') as HTMLSelectElement | null;
  const userEl = document.getElementById('reqUserName');
  const emailEl = document.getElementById('reqUserEmail');
  const reasonEl = document.getElementById('reqReasonInput') as HTMLTextAreaElement | null;

  if (featEl) featEl.textContent = info.name;
  if (descEl) descEl.textContent = `${info.desc}. Tài khoản nhân viên của bạn hiện chưa được mở quyền này.`;
  if (roleSel) roleSel.value = info.role;
  if (userEl) userEl.textContent = gCurrentUser.fullName || 'Người dùng';
  if (emailEl) emailEl.textContent = gCurrentUser.email;
  if (reasonEl) reasonEl.value = '';

  document.getElementById('requestAccessModal')?.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function closeRequestAccessModal(): void {
  document.getElementById('requestAccessModal')?.classList.add('hidden');
}

export function openRequestAccessForSite(targetSite?: string): void {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  const curUser = w.gCurrentUser || gCurrentUser;
  if (!curUser) {
    if (typeof w.openGoogleAuthModal === 'function') {
      w.openGoogleAuthModal(true);
    }
    return;
  }
  openSiteSelectorModal(targetSite);
}

export async function submitRequestAccess(): Promise<void> {
  if (!gCurrentUser) return;
  const roleSel = document.getElementById('reqRoleSelect') as HTMLSelectElement | null;
  const reasonEl = document.getElementById('reqReasonInput') as HTMLTextAreaElement | null;
  const requestedRole = roleSel?.value || 'BEP_TRUONG';
  const reason = reasonEl?.value || '';

  try {
    if (typeof showLoading === 'function') showLoading('Đang gửi yêu cầu cấp quyền đến Admin...');
    const res = await fetch('/api/auth/request-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: gCurrentUser.email,
        fullName: gCurrentUser.fullName,
        requestedRole: requestedRole,
        requestedFeature: pendingRequestFeatureName || pendingRequestFeature,
        reason: reason
      })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gửi thất bại');

    closeRequestAccessModal();
    if (typeof showToast === 'function') {
      showToast('Đã gửi yêu cầu cấp quyền tới Quản Trị Viên! Vui lòng chờ phê duyệt.');
    }
  } catch (err: any) {
    console.error('submitRequestAccess error:', err);
    if (typeof showToast === 'function') showToast('Lỗi: ' + err.message);
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export async function checkPendingAccessRequests(): Promise<void> {
  if (!gCurrentUser || gCurrentUser.role !== 'ADMIN') return;
  try {
    const res = await fetch('/api/auth/access-requests');
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      cachedAccessRequests = json.data;
      const pending = json.data.filter((r: AuthAccessRequest) => r.status === 'PENDING');
      const btn = document.getElementById('adminPendingReqBtn');
      const badge = document.getElementById('adminPendingReqCount');
      if (btn) {
        btn.classList.remove('hidden');
        if (badge) {
          badge.textContent = String(pending.length);
          badge.className = `px-1.5 py-0.2 rounded-full text-xs font-semibold ${
            pending.length > 0 ? 'bg-rose-600 text-white animate-pulse' : 'bg-gray-400 text-white'
          }`;
        }
      }
    }
  } catch (e) {
    console.error('checkPendingAccessRequests error:', e);
  }
}

export async function openAdminApprovalModal(): Promise<void> {
  const modal = document.getElementById('adminApprovalModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  renderAdminRequestsTable();

  try {
    const res = await fetch('/api/auth/access-requests');
    const json = await res.json().catch(() => ({}));
    if (json.success && Array.isArray(json.data)) {
      cachedAccessRequests = json.data;
      renderAdminRequestsTable();
    } else if (json.error) {
      if (typeof showToast === 'function') showToast(json.error, 'error');
      const mobileEl = document.getElementById('adminRequestsMobileCards');
      if (mobileEl) {
        mobileEl.innerHTML = `<div class="p-6 text-center text-rose-500 text-xs font-medium">${json.error}</div>`;
      }
    }
  } catch (e) {
    console.error(e);
  }
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function closeAdminApprovalModal(): void {
  document.getElementById('adminApprovalModal')?.classList.add('hidden');
}

export function renderAdminRequestsTable(): void {
  const tbody = document.getElementById('adminRequestsTableBody');
  const mobileContainer = document.getElementById('adminRequestsMobileCards');
  if (!tbody && !mobileContainer) return;

  const list = cachedAccessRequests || [];
  if (list.length === 0) {
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-gray-400">Chưa có yêu cầu cấp quyền nào từ nhân viên.</td></tr>`;
    }
    if (mobileContainer) {
      mobileContainer.innerHTML = `<div class="p-8 text-center text-gray-400 text-xs">Chưa có yêu cầu cấp quyền nào từ nhân viên.</div>`;
    }
    return;
  }

  if (tbody) {
    tbody.innerHTML = list.map(req => {
      const isPending = req.status === 'PENDING';
      const isApproved = req.status === 'APPROVED';

      const statusBadge = isPending
        ? '<span class="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 whitespace-nowrap shrink-0">ĐANG CHỜ DUYỆT</span>'
        : isApproved
        ? '<span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 whitespace-nowrap shrink-0">ĐÃ DUYỆT</span>'
        : '<span class="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 whitespace-nowrap shrink-0">TỪ CHỐI</span>';

      const actions = isPending ? `
        <div class="flex items-center justify-center gap-1.5 whitespace-nowrap">
          <button onclick="handleApproveRequest(${req.id}, 'APPROVE')" class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 whitespace-nowrap shrink-0 shadow-xs active:translate-y-px transition-all">
            <i data-lucide="check" class="w-3 h-3 shrink-0"></i><span>Duyệt</span>
          </button>
          <button onclick="handleApproveRequest(${req.id}, 'REJECT')" class="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs inline-flex items-center gap-1 whitespace-nowrap shrink-0 active:translate-y-px transition-all">
            <i data-lucide="x" class="w-3 h-3 shrink-0"></i><span>Từ chối</span>
          </button>
        </div>
      ` : `
        <div class="text-center text-xs text-gray-400 tabular-nums">
          ${req.reviewed_by || 'Admin'}<br>${(req.reviewed_at || '').substring(0, 16)}
        </div>
      `;

      return `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2.5 px-3">
            <div class="font-bold text-gray-900 dark:text-white">${repairAtobMojibake(req.user_name || req.user_email)}</div>
            <div class="text-xs text-gray-400 tabular-nums">${req.user_email}</div>
          </td>
          <td class="py-2.5 px-3 font-medium text-gray-800 dark:text-gray-200">
            <div>${req.requested_feature || '--'}</div>
            ${(req as any).requested_site ? `<span class="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">Site đích: ${(req as any).requested_site}</span>` : ''}
          </td>
          <td class="py-2.5 px-3">
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 uppercase">${req.requested_role}</span>
          </td>
          <td class="py-2.5 px-3 text-gray-600 dark:text-gray-300 text-xs max-w-[200px] truncate" title="${req.reason || ''}">
            ${req.reason || '--'}
          </td>
          <td class="py-2.5 px-3 text-xs text-gray-400 tabular-nums">
            ${(req.created_at || '').substring(0, 16)}
          </td>
          <td class="py-2.5 px-3 text-center">
            ${isPending ? actions : statusBadge}
          </td>
        </tr>
      `;
    }).join('');
  }

  if (mobileContainer) {
    mobileContainer.innerHTML = list.map(req => {
      const isPending = req.status === 'PENDING';
      const isApproved = req.status === 'APPROVED';

      const statusBadge = isPending
        ? '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 whitespace-nowrap shrink-0">ĐANG CHỜ DUYỆT</span>'
        : isApproved
        ? '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 whitespace-nowrap shrink-0">ĐÃ DUYỆT</span>'
        : '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 whitespace-nowrap shrink-0">TỪ CHỐI</span>';

      const actionButtons = isPending ? `
        <div class="grid grid-cols-2 gap-2 pt-2.5 border-t border-gray-100 dark:border-gray-800">
          <button onclick="handleApproveRequest(${req.id}, 'APPROVE')" class="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 whitespace-nowrap shadow-xs active:translate-y-px transition-all">
            <i data-lucide="check" class="w-3.5 h-3.5 shrink-0"></i><span>Duyệt</span>
          </button>
          <button onclick="handleApproveRequest(${req.id}, 'REJECT')" class="py-2 px-3 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs inline-flex items-center justify-center gap-1.5 whitespace-nowrap active:translate-y-px transition-all">
            <i data-lucide="x" class="w-3.5 h-3.5 shrink-0"></i><span>Từ chối</span>
          </button>
        </div>
      ` : `
        <div class="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
          <span>Xử lý: ${req.reviewed_by || 'Admin'}</span>
          <span class="font-mono tabular-nums">${(req.reviewed_at || '').substring(0, 16)}</span>
        </div>
      `;

      return `
        <div class="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 shadow-xs space-y-2.5">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="font-bold text-sm text-gray-900 dark:text-white truncate">${repairAtobMojibake(req.user_name || req.user_email)}</div>
              <div class="text-xs text-gray-400 truncate font-mono">${req.user_email}</div>
            </div>
            ${statusBadge}
          </div>

          <div class="flex flex-wrap items-center gap-1.5">
            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 uppercase">${req.requested_role}</span>
            ${(req as any).requested_site ? `<span class="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">Site đích: ${(req as any).requested_site}</span>` : ''}
          </div>

          <div class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
            <div><span class="text-gray-400">Yêu cầu:</span> <span class="font-semibold">${req.requested_feature || '--'}</span></div>
            ${req.reason ? `<div><span class="text-gray-400">Lý do:</span> ${req.reason}</div>` : ''}
            <div class="text-[11px] text-gray-400 font-mono tabular-nums">${(req.created_at || '').substring(0, 16)}</div>
          </div>

          ${actionButtons}
        </div>
      `;
    }).join('');
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export async function handleApproveRequest(requestId: number, action: 'APPROVE' | 'REJECT'): Promise<void> {
  try {
    if (typeof showLoading === 'function') showLoading(action === 'APPROVE' ? 'Đang phê duyệt...' : 'Đang từ chối...');
    const res = await fetch('/api/auth/approve-access-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId: requestId,
        action: action,
        reviewedBy: gCurrentUser ? gCurrentUser.email : 'Admin'
      })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Thao tác thất bại');

    if (typeof showToast === 'function') showToast(json.message);
    openAdminApprovalModal();
    checkPendingAccessRequests();
  } catch (err: any) {
    console.error(err);
    if (typeof showToast === 'function') showToast('Lỗi: ' + err.message);
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}
