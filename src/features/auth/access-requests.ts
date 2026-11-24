import { AuthAccessRequest } from './types';
import { FEATURE_TITLES, repairAtobMojibake } from './constants';
import { gCurrentUser } from './accounts';

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
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      cachedAccessRequests = json.data;
      renderAdminRequestsTable();
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
  if (!tbody) return;

  const list = cachedAccessRequests || [];
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-gray-400">Chưa có yêu cầu cấp quyền nào từ nhân viên.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(req => {
    const isPending = req.status === 'PENDING';
    const isApproved = req.status === 'APPROVED';

    const statusBadge = isPending 
      ? '<span class="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">ĐANG CHỜ DUYỆT</span>'
      : isApproved
      ? '<span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">ĐÃ DUYỆT</span>'
      : '<span class="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">TỪ CHỐI</span>';

    const actions = isPending ? `
      <div class="flex items-center justify-center gap-1.5">
        <button onclick="handleApproveRequest(${req.id}, 'APPROVE')" class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs active:translate-y-px transition-all">
          <i data-lucide="check" class="w-3 h-3"></i> Duyệt
        </button>
        <button onclick="handleApproveRequest(${req.id}, 'REJECT')" class="px-2 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs flex items-center gap-1 active:translate-y-px transition-all">
          <i data-lucide="x" class="w-3 h-3"></i> Từ chối
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
        <td class="py-2.5 px-3 font-medium text-gray-800 dark:text-gray-200">${req.requested_feature || '--'}</td>
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
