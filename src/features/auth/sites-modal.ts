import { AuthSiteOption } from './types';
import { DEFAULT_SITES_LIST, isMasterAccount } from './constants';
import { gCurrentUser, saveAccountToList } from './accounts';

export let selectedModalRegion: string = 'ALL';
export let tempSelectedSite: string = 'K001';

declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const onGlobalBranchChange: (site: string) => void;
declare const lucide: any;

export function getAppSitesList(): AuthSiteOption[] {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  if (w.App && Array.isArray(w.App.siteObjs) && w.App.siteObjs.length > 0) {
    const list: AuthSiteOption[] = [
      { code: 'ALL', name: 'Tất Cả Điểm Bán (Toàn Chuỗi)', region: 'Toàn Quốc', desc: 'Dành cho Quản trị viên & Kế toán' }
    ];
    w.App.siteObjs.forEach((s: any) => {
      list.push({
        code: s.code,
        name: s.ten || s.name || s.code,
        ten: s.ten || s.name,
        region: s.vungMien || 'Miền Nam',
        desc: `${s.loai || 'Điểm Bán'} • ${s.name || ''}`,
        budget: s.budget || 0
      });
    });
    return list;
  }
  return DEFAULT_SITES_LIST;
}

export function selectModalRegion(region: string): void {
  selectedModalRegion = region;
  document.querySelectorAll('.modal-region-btn').forEach(btn => {
    const isThis = btn.getAttribute('data-region') === region;
    if (isThis) {
      btn.className = 'modal-region-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-brand-500 bg-brand-500 text-white shadow-theme-xs';
    } else {
      btn.className = 'modal-region-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300';
    }
  });
  renderSitesOptions();
}

export function renderSitesOptions(): void {
  const container = document.getElementById('sitesOptionsContainer');
  if (!container) return;

  const savedSite = tempSelectedSite || localStorage.getItem('orbit_user_site') || 'K001';
  tempSelectedSite = savedSite;

  const sites = getAppSitesList();
  const currentRegion = selectedModalRegion || 'ALL';
  const curUser = (typeof window !== 'undefined' ? (window as any).gCurrentUser : null) || gCurrentUser;
  const canSwitch = canUserSwitchSite(curUser);

  const filtered = sites.filter(s => {
    if (!canSwitch && s.code === 'ALL') return false;
    if (currentRegion === 'ALL') return true;
    return s.code === 'ALL' || s.region === currentRegion;
  });

  const html = filtered.map(site => {
    const isSelected = site.code.toLowerCase() === savedSite.toLowerCase();
    return `
      <div 
        onclick="selectSiteOption('${site.code}')" 
        data-site="${site.code}" 
        data-region="${site.region}"
        class="site-option-card p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
          isSelected 
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/15 ring-2 ring-[#19723C]' 
            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/40 hover:border-gray-300 dark:hover:border-gray-700'
        }"
      >
        <div class="flex items-center gap-3.5 min-w-0">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            site.code === 'ALL' ? 'bg-purple-100 dark:bg-purple-950 text-purple-600' : 'bg-blue-50 dark:bg-blue-950 text-brand-500'
          }">
            <i data-lucide="${site.code === 'ALL' ? 'globe' : 'store'}" class="w-4 h-4"></i>
          </div>
          <div class="min-w-0">
            <div class="font-semibold text-sm text-gray-900 dark:text-white truncate flex items-center gap-2">
              <span>${site.name}</span>
              <span class="text-xs px-1.5 py-0.2 rounded font-semibold ${
                site.region === 'Miền Nam' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                site.region === 'Miền Bắc' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
              }">${site.region}</span>
            </div>
            <div class="text-xs text-gray-400 truncate">${site.desc}</div>
          </div>
        </div>
        <div class="site-radio-check size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
          isSelected ? 'border-brand-500 bg-brand-500 text-white' : 'border-gray-300 dark:border-gray-600'
        }">
          <i data-lucide="check" class="w-3 h-3 ${isSelected ? '' : 'hidden'}"></i>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
  updateSelectedSiteLabel(savedSite);
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function filterSiteOptionCards(query: string): void {
  const q = (query || '').toLowerCase().trim();
  document.querySelectorAll('.site-option-card').forEach(card => {
    const text = card.textContent?.toLowerCase() || '';
    if (!q || text.includes(q)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

export function selectSiteOption(siteCode: string): void {
  tempSelectedSite = siteCode;
  document.querySelectorAll('.site-option-card').forEach(card => {
    const isThis = card.getAttribute('data-site') === siteCode;
    const check = card.querySelector('.site-radio-check');
    const checkIcon = check?.querySelector('i');

    if (isThis) {
      card.classList.add('border-brand-500', 'bg-brand-50', 'dark:bg-brand-500/15', 'ring-2', 'ring-[#19723C]');
      card.classList.remove('border-gray-200', 'dark:border-gray-800');
      if (check) {
        check.className = 'site-radio-check size-5 rounded-full border-2 flex items-center justify-center shrink-0 border-brand-500 bg-brand-500 text-white';
        if (checkIcon) checkIcon.classList.remove('hidden');
      }
    } else {
      card.classList.remove('border-brand-500', 'bg-brand-50', 'dark:bg-brand-500/15', 'ring-2', 'ring-[#19723C]');
      card.classList.add('border-gray-200', 'dark:border-gray-800');
      if (check) {
        check.className = 'site-radio-check size-5 rounded-full border-2 flex items-center justify-center shrink-0 border-gray-300 dark:border-gray-600';
        if (checkIcon) checkIcon.classList.add('hidden');
      }
    }
  });

  updateSelectedSiteLabel(siteCode);
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function updateSelectedSiteLabel(siteCode: string): void {
  const lbl = document.getElementById('selectedSiteLabel');
  if (!lbl) return;
  const sites = getAppSitesList();
  const siteObj = sites.find(s => s.code.toLowerCase() === siteCode.toLowerCase());
  lbl.textContent = siteObj ? `Đã chọn: [${siteObj.region}] ${siteObj.name}` : `Đã chọn: ${siteCode}`;
}

/**
 * Kiểm tra quyền hạn chuyển đổi cơ sở phụ trách của user:
 * Chỉ Admin (trantuandai2508@gmail.com hoặc role ADMIN) hoặc tài khoản có quyền all_sites/switch_site mới được đổi.
 */
export function canUserSwitchSite(user?: any): boolean {
  const curUser = user || (typeof window !== 'undefined' ? (window as any).gCurrentUser : null) || gCurrentUser;
  if (!curUser) return false;
  if (isMasterAccount(curUser.email)) return true;
  if (curUser.role === 'ADMIN') return true;
  if (curUser.permissions && (curUser.permissions['all_sites']?.canView || curUser.permissions['switch_site']?.canView || curUser.permissions['chuyen_site']?.canView)) {
    return true;
  }
  return false;
}

/**
 * Khởi tạo & kiểm tra site khi user đăng nhập hoặc truy cập webapp:
 * Luôn nạp đúng site đã gán cho tài khoản để không bị nhầm lẫn.
 */
export function checkAndPromptUserSite(forceOpen: boolean = false): void {
  const curUser = (typeof window !== 'undefined' ? (window as any).gCurrentUser : null) || gCurrentUser;
  const hasAssignedSite = Boolean(curUser && curUser.assignedSite && String(curUser.assignedSite).trim() !== '');
  const canSwitch = canUserSwitchSite(curUser);

  // User mới đăng nhập lần đầu chưa có assigned_site trong DB -> bắt buộc mở modal chọn site 1 lần duy nhất
  if (curUser && curUser.email && !hasAssignedSite && !canSwitch) {
    if (typeof onGlobalBranchChange === 'function') {
      onGlobalBranchChange('K001');
    }
    openSiteSelectorModal('K001');
    return;
  }

  let savedSite = (curUser && curUser.assignedSite) || localStorage.getItem('orbit_user_site');
  if (!savedSite) {
    savedSite = 'K001';
  }
  try {
    localStorage.setItem('orbit_user_site', savedSite);
    if (curUser) curUser.assignedSite = savedSite;
  } catch (e) {}

  if (forceOpen && canSwitch) {
    openSiteSelectorModal();
  } else {
    if (typeof onGlobalBranchChange === 'function') {
      onGlobalBranchChange(savedSite);
    }
  }
}

/**
 * Mở modal chọn điểm bán:
 * - Admin / người có quyền switch_site: chọn và đổi site ngay lập tức.
 * - User mới chưa có site cố định: chọn site làm việc lần đầu (lưu vĩnh viễn cho các lần sau).
 * - User thường đã có site cố định: mở danh sách để gửi yêu cầu đổi site chờ Admin duyệt.
 */
export function openSiteSelectorModal(preselectSite?: string): void {
  const curUser = (typeof window !== 'undefined' ? (window as any).gCurrentUser : null) || gCurrentUser;
  const canSwitch = canUserSwitchSite(curUser);
  const hasAssignedSite = Boolean(curUser && curUser.assignedSite && String(curUser.assignedSite).trim() !== '');
  const isFirstTimeSelection = Boolean(curUser && curUser.email && !canSwitch && !hasAssignedSite);
  const assigned = (curUser && curUser.assignedSite) || localStorage.getItem('orbit_user_site') || 'K001';

  if (preselectSite) {
    tempSelectedSite = preselectSite;
  } else {
    tempSelectedSite = assigned;
  }

  const modal = document.getElementById('siteSelectorModal');
  if (!modal) return;

  const titleEl = document.getElementById('siteSelectorTitle');
  const subEl = document.getElementById('siteSelectorSubtitle');
  const noticeEl = document.getElementById('siteSwitchApprovalNotice');
  const noticeTextEl = document.getElementById('siteSwitchApprovalNoticeText');
  const reasonWrap = document.getElementById('siteSwitchReasonWrap');
  const reasonInput = document.getElementById('siteSwitchReasonInput') as HTMLInputElement | null;
  const submitLabel = document.getElementById('siteSelectorSubmitLabel');
  const closeBtn = document.getElementById('siteSelectorCloseBtn');

  if (canSwitch) {
    if (titleEl) titleEl.textContent = 'Chọn Điểm Bán / Bếp Bạn Phụ Trách';
    if (subEl) subEl.textContent = 'Lựa chọn sẽ lưu lại trên máy cá nhân để không phải chọn lại lần sau';
    if (noticeEl) noticeEl.classList.add('hidden');
    if (reasonWrap) reasonWrap.classList.add('hidden');
    if (submitLabel) submitLabel.textContent = 'Xác Nhận & Tiếp Tục';
    if (closeBtn) closeBtn.classList.remove('hidden');
  } else if (isFirstTimeSelection) {
    if (titleEl) titleEl.textContent = 'Chọn Điểm Bán Làm Việc (Lần Đầu)';
    if (subEl) subEl.textContent = 'Chọn đúng điểm bán bạn phụ trách. Hệ thống sẽ lưu cố định site này cho các lần đăng nhập sau.';
    if (noticeEl) noticeEl.classList.add('hidden');
    if (reasonWrap) reasonWrap.classList.add('hidden');
    if (submitLabel) submitLabel.textContent = 'Xác Nhận Site Làm Việc';
    if (closeBtn) closeBtn.classList.add('hidden');
  } else {
    if (titleEl) titleEl.textContent = 'Yêu Cầu Đổi Điểm Bán / Site';
    if (subEl) subEl.textContent = `Site cố định hiện tại: ${assigned} • Chọn site mới để gửi Quản trị viên duyệt`;
    if (noticeEl) noticeEl.classList.remove('hidden');
    if (noticeTextEl) {
      noticeTextEl.textContent = `Tài khoản của bạn đang cố định tại site [${assigned}]. Vui lòng chọn site bạn muốn chuyển bên dưới và nhấn "Gửi Yêu Cầu Đổi Site" để Quản trị viên xác nhận duyệt.`;
    }
    if (reasonWrap) reasonWrap.classList.remove('hidden');
    if (reasonInput) reasonInput.value = '';
    if (submitLabel) submitLabel.textContent = 'Gửi Yêu Cầu Đổi Site';
    if (closeBtn) closeBtn.classList.remove('hidden');
  }

  renderSitesOptions();
  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function closeSiteSelectorModal(): void {
  document.getElementById('siteSelectorModal')?.classList.add('hidden');
}

/**
 * Lưu điểm bán (lần đầu hoặc có quyền switch) hoặc gửi yêu cầu đổi site chờ Admin duyệt.
 */
export async function saveSiteSelection(): Promise<void> {
  const curUser = (typeof window !== 'undefined' ? (window as any).gCurrentUser : null) || gCurrentUser;
  const site = tempSelectedSite || localStorage.getItem('orbit_user_site') || 'K001';
  const hasAssignedSite = Boolean(curUser && curUser.assignedSite && String(curUser.assignedSite).trim() !== '');

  if (!canUserSwitchSite(curUser)) {
    if (!curUser || !curUser.email) {
      if (typeof showToast === 'function') showToast('Vui lòng đăng nhập để chọn hoặc đổi site!', 'warning');
      return;
    }

    // Lần đăng nhập đầu tiên chưa có assignedSite -> Lưu cố định vào CSDL 1 lần duy nhất
    if (!hasAssignedSite) {
      if (site.toUpperCase() === 'ALL') {
        if (typeof showToast === 'function') showToast('Vui lòng chọn một điểm bán cụ thể!', 'warning');
        return;
      }
      try {
        if (typeof showLoading === 'function') showLoading(`Đang lưu điểm bán mặc định [${site}]...`);
        const resp = await fetch('/api/auth/set-initial-site', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Email': curUser.email
          },
          body: JSON.stringify({ email: curUser.email, siteCode: site })
        });
        const json = await resp.json();
        if (!resp.ok || !json.success) {
          if (typeof showToast === 'function') showToast(json.error || 'Không thể lưu site làm việc!', 'error');
          return;
        }
        curUser.assignedSite = site;
        try {
          localStorage.setItem('orbit_user_site', site);
          localStorage.setItem('orbit_user', JSON.stringify(curUser));
          if (typeof window !== 'undefined') (window as any).gCurrentUser = curUser;
        } catch (e) {}

        closeSiteSelectorModal();
        if (typeof onGlobalBranchChange === 'function') onGlobalBranchChange(site);
        if (typeof showToast === 'function') showToast(`Đã lưu điểm bán mặc định [${site}] cho các lần đăng nhập sau!`, 'success');
      } catch (err: any) {
        if (typeof showToast === 'function') showToast('Lỗi kết nối: ' + (err?.message || err), 'error');
      } finally {
        if (typeof hideLoading === 'function') hideLoading();
      }
      return;
    }

    const currentSite = curUser.assignedSite || localStorage.getItem('orbit_user_site') || 'K001';
    if (site.toUpperCase() === currentSite.toUpperCase()) {
      if (typeof showToast === 'function') {
        showToast(`Bạn đang ở site [${currentSite}] rồi. Vui lòng chọn một site khác cần chuyển!`, 'warning');
      }
      return;
    }

    const reasonInput = (document.getElementById('siteSwitchReasonInput') as HTMLInputElement | null)?.value?.trim() || '';
    const sites = getAppSitesList();
    const siteObj = sites.find(s => s.code.toLowerCase() === site.toLowerCase());
    const siteLabel = siteObj ? `${site} (${siteObj.name})` : site;
    const finalReason = reasonInput || `Xin phê duyệt chuyển từ site ${currentSite} sang ${siteLabel}`;

    try {
      if (typeof showLoading === 'function') showLoading(`Đang gửi yêu cầu chuyển sang site ${site}...`);
      const res = await fetch('/api/auth/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: curUser.email,
          fullName: curUser.fullName || curUser.name || '',
          requestedRole: curUser.role || 'NHAN_VIEN',
          requestedSite: site,
          requestedFeature: `Đổi Site: ${currentSite} → ${site}`,
          reason: finalReason
        })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Gửi yêu cầu thất bại');

      try {
        localStorage.setItem('orbit_pending_site_request', JSON.stringify({ site, from: currentSite, at: Date.now() }));
      } catch (e) {}

      closeSiteSelectorModal();
      if (typeof showToast === 'function') {
        showToast(`Đã gửi yêu cầu đổi sang site [${site}]! Vui lòng chờ Quản trị viên xác nhận duyệt.`, 'success');
      }
    } catch (err: any) {
      console.error('saveSiteSelection request error:', err);
      if (typeof showToast === 'function') showToast('Lỗi gửi yêu cầu: ' + err.message, 'error');
    } finally {
      if (typeof hideLoading === 'function') hideLoading();
    }
    return;
  }

  localStorage.setItem('orbit_user_site', site);
  if (gCurrentUser) {
    gCurrentUser.assignedSite = site;
    saveAccountToList(gCurrentUser);
    try {
      localStorage.setItem('orbit_user', JSON.stringify(gCurrentUser));
    } catch (e) {}
  }
  const w = typeof window !== 'undefined' ? (window as any) : {};
  if (w.gCurrentUser) {
    w.gCurrentUser.assignedSite = site;
  }

  const branchSel = document.getElementById('globalBranchSelect') as HTMLSelectElement | null;
  if (branchSel) {
    branchSel.value = site;
  }
  if (typeof onGlobalBranchChange === 'function') {
    onGlobalBranchChange(site);
  }

  closeSiteSelectorModal();
  const sites = getAppSitesList();
  const siteObj = sites.find(s => s.code === site);
  if (typeof showToast === 'function') {
    showToast(`Đã lưu site phụ trách: ${siteObj ? siteObj.name : site} (sẽ tự động dùng cho các lần sau)`);
  }
}
