import { AuthSiteOption } from './types';
import { DEFAULT_SITES_LIST } from './constants';
import { gCurrentUser, saveAccountToList } from './accounts';

export let selectedModalRegion: string = 'ALL';
export let tempSelectedSite: string = 'K001';

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

  const filtered = sites.filter(s => {
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

export function checkAndPromptUserSite(forceOpen: boolean = false): void {
  let savedSite = localStorage.getItem('orbit_user_site');
  if (!savedSite && gCurrentUser && gCurrentUser.assignedSite) {
    savedSite = gCurrentUser.assignedSite;
    try { localStorage.setItem('orbit_user_site', savedSite); } catch (e) {}
  }
  if (!savedSite) {
    savedSite = 'K001';
    try { localStorage.setItem('orbit_user_site', savedSite); } catch (e) {}
  }

  if (forceOpen) {
    openSiteSelectorModal();
  } else {
    const branchSel = document.getElementById('globalBranchSelect') as HTMLSelectElement | null;
    if (branchSel && branchSel.value !== savedSite) {
      branchSel.value = savedSite;
      if (typeof onGlobalBranchChange === 'function') {
        onGlobalBranchChange(savedSite);
      }
    }
  }
}

export function openSiteSelectorModal(): void {
  const modal = document.getElementById('siteSelectorModal');
  if (!modal) return;
  renderSitesOptions();
  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function saveSiteSelection(): void {
  const site = tempSelectedSite || localStorage.getItem('orbit_user_site') || 'K001';
  localStorage.setItem('orbit_user_site', site);
  if (gCurrentUser) {
    gCurrentUser.assignedSite = site;
    saveAccountToList(gCurrentUser);
  }

  const branchSel = document.getElementById('globalBranchSelect') as HTMLSelectElement | null;
  if (branchSel) {
    branchSel.value = site;
    if (typeof onGlobalBranchChange === 'function') {
      onGlobalBranchChange(site);
    }
  }

  document.getElementById('siteSelectorModal')?.classList.add('hidden');
  const sites = getAppSitesList();
  const siteObj = sites.find(s => s.code === site);
  if (typeof showToast === 'function') {
    showToast(`Đã lưu site phụ trách: ${siteObj ? siteObj.name : site} (sẽ tự động dùng cho các lần sau)`);
  }
}
