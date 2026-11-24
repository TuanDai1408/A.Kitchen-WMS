import { SiteMasterItem } from './types';

declare const showLoading: () => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const getAppSitesList: () => any[];
declare const lucide: any;

export async function loadFnbSites(): Promise<void> {
  try {
    if (typeof showLoading === 'function') showLoading();
    const resp = await fetch('/api/branches');
    const res = await resp.json();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      renderFnbSites(res.data);
    } else {
      const list = (typeof getAppSitesList === 'function' ? getAppSitesList() : []).filter((s) => s.code !== 'ALL');
      renderFnbSites(list);
    }
  } catch (err: any) {
    console.error('Error loadFnbSites:', err);
    const list = (typeof getAppSitesList === 'function' ? getAppSitesList() : []).filter((s) => s.code !== 'ALL');
    renderFnbSites(list);
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }
}

export function renderFnbSites(sites: SiteMasterItem[]): void {
  const tbody = document.getElementById('fnbSitesMasterTableBody');
  const mob = document.getElementById('fnbSitesMobileCards');
  if (!sites) return;

  const countBadge = document.getElementById('fnbSitesCountBadge');
  if (countBadge) {
    countBadge.textContent = `${sites.length} điểm bán`;
  }

  if (tbody) {
    tbody.innerHTML = sites.map((s) => {
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
          <td class="py-3 px-3 text-center">
            <span class="px-2 py-0.5 rounded text-xs font-bold border ${regionBadge}">${s.region || 'Miền Nam'}</span>
          </td>
          <td class="py-3 px-4 text-gray-500 dark:text-gray-400">${s.address || 'Hệ thống căn tin Tân Long Group'}</td>
          <td class="py-3 px-3">
            <div class="font-semibold text-gray-800 dark:text-gray-200">${s.site_type || 'Quản Lý Cơ Sở'}</div>
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
    mob.innerHTML = sites.map((s) => {
      let regionBadge = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
      if (s.region === 'Miền Bắc') {
        regionBadge = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300';
      } else if (s.region === 'Miền Trung') {
        regionBadge = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300';
      }

      return `
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-xs text-brand-500 dark:text-brand-400">${s.code}</span>
              <span class="px-2 py-0.5 rounded text-xs font-bold border ${regionBadge}">${s.region || 'Miền Nam'}</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200">HOẠT ĐỘNG</span>
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
