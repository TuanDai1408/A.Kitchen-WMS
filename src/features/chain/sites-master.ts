import { SiteMasterItem } from './types';

declare const showLoading: () => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const getAppSitesList: () => any[];
declare const lucide: any;

let gAllSitesMaster: SiteMasterItem[] = [];
let gActiveSiteGroupFilter: 'ALL' | 'SITE' | 'HUB' | 'CANTEEN' = 'ALL';

export function resolveSiteGroup(s: SiteMasterItem): 'SITE' | 'HUB' | 'CANTEEN' {
  const raw = String(s.site_type || '').toUpperCase().trim();
  if (raw === 'CANTEEN' || raw === 'HUB' || raw === 'SITE') return raw;
  const code = String(s.code || '').toUpperCase().trim();
  if (code === 'K001' || code === 'R515') return 'CANTEEN';
  if (code === 'K005' || code === 'K504' || code === 'K505') return 'HUB';
  return 'SITE';
}

export function filterFnbSitesByGroup(group: 'ALL' | 'SITE' | 'HUB' | 'CANTEEN'): void {
  gActiveSiteGroupFilter = group || 'ALL';
  renderFnbSites(gAllSitesMaster);
}

export async function loadFnbSites(): Promise<void> {
  try {
    if (typeof showLoading === 'function') showLoading();
    const resp = await fetch('/api/branches?no-cache=1');
    const res = await resp.json();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      gAllSitesMaster = res.data;
      renderFnbSites(gAllSitesMaster);
    } else {
      gAllSitesMaster = (typeof getAppSitesList === 'function' ? getAppSitesList() : []).filter((s) => s.code !== 'ALL');
      renderFnbSites(gAllSitesMaster);
    }
  } catch (err: any) {
    console.error('Error loadFnbSites:', err);
    gAllSitesMaster = (typeof getAppSitesList === 'function' ? getAppSitesList() : []).filter((s) => s.code !== 'ALL');
    renderFnbSites(gAllSitesMaster);
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }
}

export function renderFnbSites(sites: SiteMasterItem[]): void {
  if (sites && sites !== gAllSitesMaster) gAllSitesMaster = sites;
  const all = gAllSitesMaster || [];

  const siteCnt = all.filter(s => resolveSiteGroup(s) === 'SITE').length;
  const hubCnt = all.filter(s => resolveSiteGroup(s) === 'HUB').length;
  const canteenCnt = all.filter(s => resolveSiteGroup(s) === 'CANTEEN').length;
  const setTxt = (id: string, val: number) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  };
  setTxt('siteCountAll', all.length);
  setTxt('siteCountSite', siteCnt);
  setTxt('siteCountHub', hubCnt);
  setTxt('siteCountCanteen', canteenCnt);

  document.querySelectorAll<HTMLButtonElement>('[data-site-group]').forEach(btn => {
    const key = btn.dataset.siteGroup || 'ALL';
    const isActive = key === gActiveSiteGroupFilter;
    btn.classList.toggle('ring-2', isActive);
    btn.classList.toggle('ring-brand-500/40', isActive);
  });

  const filtered = gActiveSiteGroupFilter === 'ALL'
    ? all
    : all.filter(s => resolveSiteGroup(s) === gActiveSiteGroupFilter);

  const tbody = document.getElementById('fnbSitesMasterTableBody');
  const mob = document.getElementById('fnbSitesMobileCards');

  const countBadge = document.getElementById('fnbSitesCountBadge');
  if (countBadge) {
    countBadge.textContent = `${filtered.length} điểm bán`;
  }

  const getGroupBadge = (grp: 'SITE' | 'HUB' | 'CANTEEN') => {
    const cls = grp === 'CANTEEN'
      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
      : (grp === 'HUB'
          ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60'
          : 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60');
    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${cls}">${grp}</span>`;
  };

  if (tbody) {
    tbody.innerHTML = filtered.map((s) => {
      const grp = resolveSiteGroup(s);
      let regionBadge = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
      if (s.region === 'Miền Bắc') {
        regionBadge = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300';
      } else if (s.region === 'Miền Trung') {
        regionBadge = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300';
      }

      return `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-4 font-mono font-bold text-brand-500 dark:text-brand-400 text-xs">${s.code}</td>
          <td class="py-3 px-4 font-bold text-gray-900 dark:text-white">${s.name}</td>
          <td class="py-3 px-3 text-center">${getGroupBadge(grp)}</td>
          <td class="py-3 px-3 text-center">
            <span class="px-2 py-0.5 rounded text-xs font-bold border ${regionBadge}">${s.region || 'Miền Nam'}</span>
          </td>
          <td class="py-3 px-4 text-gray-500 dark:text-gray-400">${s.address || 'Hệ thống căn tin Tân Long Group'}</td>
          <td class="py-3 px-3">
            <div class="font-semibold text-gray-800 dark:text-gray-200">${grp}</div>
            <div class="text-xs font-mono tabular-nums text-gray-400">${s.phone || '0903.xxx.xxx'}</div>
          </td>
          <td class="py-3 px-3 text-right font-mono tabular-nums font-bold text-gray-900 dark:text-white">${Number(s.budget || 10000000).toLocaleString('vi-VN')} ₫</td>
          <td class="py-3 px-3 text-center">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200">HOẠT ĐỘNG</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (mob) {
    mob.innerHTML = filtered.map((s) => {
      const grp = resolveSiteGroup(s);
      let regionBadge = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
      if (s.region === 'Miền Bắc') {
        regionBadge = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300';
      } else if (s.region === 'Miền Trung') {
        regionBadge = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300';
      }

      return `
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="font-mono font-bold text-xs text-brand-500 dark:text-brand-400">${s.code}</span>
              ${getGroupBadge(grp)}
              <span class="px-2 py-0.5 rounded text-xs font-bold border ${regionBadge}">${s.region || 'Miền Nam'}</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 shrink-0">HOẠT ĐỘNG</span>
          </div>
          <div class="font-bold text-xs text-gray-900 dark:text-white">${s.name}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5"></i>
            <span>${s.address || 'Hệ thống căn tin Tân Long Group'}</span>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800 text-xs">
            <span class="text-gray-500">Hạn mức ngân sách:</span>
            <span class="font-bold text-gray-900 dark:text-white font-mono tabular-nums">${Number(s.budget || 10000000).toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>
      `;
    }).join('');
  }

  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}
