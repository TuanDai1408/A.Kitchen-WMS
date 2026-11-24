import { AppState } from './types';
import { shouldRefreshTab, markTabLoaded, invalidateTabCache } from './cache-utils';
import { closeSidebar } from './sidebar';
import { closeMobileMenuHub, updateMobileNavState } from './mobile-hub';
import { showLoading, hideLoading, showToast } from './ui-feedback';
import { initTailadminCharts } from './charts';

declare const lucide: any;

export const App: AppState = {
  currentBranch: (typeof localStorage !== 'undefined' ? (localStorage.getItem('orbit_user_site') || 'k001') : 'k001').toLowerCase(),
  sites: [],
  siteObjs: [],
  vungMien: [],
  loaiHoaDon: [],
  items: [],
  auditItems: [],
  fefoItems: [],
  ropItems: [],
  user: null
};

export const gFnbSitesList: any[] = [
  { id: 'K001', code: 'K001', name: 'Điểm Bán K001', region: 'Miền Nam' },
  { id: 'K002', code: 'K002', name: 'Điểm Bán K002', region: 'Miền Nam' },
  { id: 'K003', code: 'K003', name: 'Điểm Bán K003', region: 'Miền Nam' },
  { id: 'K004', code: 'K004', name: 'Điểm Bán K004', region: 'Miền Nam' },
  { id: 'K005', code: 'K005', name: 'Điểm Bán K005', region: 'Miền Nam' },
  { id: 'K006', code: 'K006', name: 'Điểm Bán K006', region: 'Miền Nam' },
  { id: 'R515', code: 'R515', name: 'Điểm Bán R515', region: 'Miền Nam' },
  { id: 'K800', code: 'K800', name: 'Điểm Bán K800', region: 'Miền Nam' },
  { id: 'K500', code: 'K500', name: 'Điểm Bán K500', region: 'Miền Bắc' },
  { id: 'K501', code: 'K501', name: 'Điểm Bán K501', region: 'Miền Bắc' },
  { id: 'K502', code: 'K502', name: 'Điểm Bán K502', region: 'Miền Bắc' },
  { id: 'K503', code: 'K503', name: 'Điểm Bán K503', region: 'Miền Bắc' },
  { id: 'K504', code: 'K504', name: 'Điểm Bán K504', region: 'Miền Bắc' },
  { id: 'K505', code: 'K505', name: 'Điểm Bán K505', region: 'Miền Bắc' }
];

export let gFnbAllItems: any[] = [];
export let gCurrentCountItems: any[] = [];
export let gFnbBlindCount: boolean = false;

let _activeTabPanel: HTMLElement | null = null;
let _activeNavBtn: HTMLElement | null = null;

export function switchTab(tabId: string, btn?: HTMLElement, forceReload: boolean = false): void {
  if (tabId === 'fnb-stock') tabId = 'wh-dashboard';

  // 1. Instant Synchronous Navigation Update (< 0.5ms latency, zero jank)
  if (!_activeTabPanel) {
    _activeTabPanel = document.querySelector('.tab-panel.active');
  }
  if (_activeTabPanel) {
    _activeTabPanel.classList.remove('active');
  } else {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  }

  const target = document.getElementById(tabId);
  if (target) {
    target.classList.add('active');
    _activeTabPanel = target;
  } else {
    const notFound = document.getElementById('tab-404');
    if (notFound) {
      notFound.classList.add('active');
      _activeTabPanel = notFound;
    }
  }

  // Active Nav Button Update
  if (_activeNavBtn) {
    _activeNavBtn.classList.remove('active', 'menu-item-active', 'bg-brand-500', 'bg-brand-600', 'bg-brand-50', 'text-brand-700', 'text-white', 'font-semibold', 'shadow-xs', 'dark:bg-brand-500', 'dark:bg-brand-500/15', 'dark:text-white', 'dark:text-brand-400');
    _activeNavBtn.classList.add('menu-item-inactive', 'text-gray-700', 'dark:text-gray-300');
    const ic = _activeNavBtn.querySelector('.menu-icon');
    if (ic) {
      ic.classList.remove('text-white', 'text-brand-500', 'dark:text-brand-400');
      ic.classList.add('text-gray-500', 'dark:text-gray-400');
    }
  } else {
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.remove('active', 'menu-item-active', 'bg-brand-500', 'bg-brand-600', 'bg-brand-50', 'text-brand-700', 'text-white', 'font-semibold', 'shadow-xs', 'dark:bg-brand-500', 'dark:bg-brand-500/15', 'dark:text-white', 'dark:text-brand-400');
      b.classList.add('menu-item-inactive', 'text-gray-700', 'dark:text-gray-300');
      const ic = b.querySelector('.menu-icon');
      if (ic) {
        ic.classList.remove('text-white', 'text-brand-500', 'dark:text-brand-400');
        ic.classList.add('text-gray-500', 'dark:text-gray-400');
      }
    });
  }

  if (!btn) {
    btn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`) as HTMLElement;
  }
  if (btn) {
    btn.classList.add('active', 'menu-item-active', 'bg-brand-500', 'text-white', 'font-semibold', 'shadow-xs', 'dark:bg-brand-500', 'dark:text-white');
    btn.classList.remove('menu-item-inactive', 'text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-100');
    const ic = btn.querySelector('.menu-icon');
    if (ic) {
      ic.classList.add('text-white');
      ic.classList.remove('text-gray-500', 'dark:text-gray-400', 'text-brand-500', 'dark:text-brand-400');
    }
    _activeNavBtn = btn;
  }

  try { localStorage.setItem('orbit_active_tab', tabId); } catch (e) {}

  // Close mobile drawer on tab click (< 1280px)
  if (typeof window !== 'undefined' && window.innerWidth < 1280) {
    closeSidebar();
    closeMobileMenuHub();
  }
  updateMobileNavState(tabId);

  // Reset scroll position cleanly
  const scroller = document.getElementById('mainScrollContainer') || document.querySelector('.overflow-y-auto');
  if (scroller) scroller.scrollTop = 0;

  // 2. Decouple heavy tab data loading into next frame microtask
  const shouldFetch = forceReload || shouldRefreshTab(tabId, 60000);
  if (shouldFetch) {
    markTabLoaded(tabId);
    requestAnimationFrame(() => {
      setTimeout(() => {
        const w = typeof window !== 'undefined' ? (window as any) : {};

        // Orbit Siba F&B Tab Hooks
        if (tabId === 'fnb-chain' && typeof w.loadFnbChain === 'function') w.loadFnbChain();
        if (tabId === 'fnb-pl' && typeof w.loadFnbPL === 'function') w.loadFnbPL();
        if (tabId === 'fnb-pos' && typeof w.loadFnbPOS === 'function') w.loadFnbPOS();
        if (tabId === 'fnb-stock' && typeof w.loadFnbStock === 'function') w.loadFnbStock();
        if (tabId === 'fnb-counts' && typeof w.loadFnbCounts === 'function') w.loadFnbCounts();
        if (tabId === 'fnb-receipts' && typeof w.loadFnbReceipts === 'function') w.loadFnbReceipts();
        if (tabId === 'fnb-waste' && typeof w.loadFnbWaste === 'function') w.loadFnbWaste();
        if (tabId === 'fnb-sites' && typeof w.loadFnbSites === 'function') w.loadFnbSites();
        if (tabId === 'user-matrix' && typeof w.loadUserMatrix === 'function') w.loadUserMatrix();

        if (tabId === 'wh-dashboard') {
          initTailadminCharts();
          if (typeof w.loadDashboardSummary === 'function') w.loadDashboardSummary();
        }
        if (tabId === 'wh-stock' && typeof w.loadStockFEFO === 'function') w.loadStockFEFO();
        if (tabId === 'wh-reorder' && typeof w.loadReorderROP === 'function') w.loadReorderROP();
        if (tabId === 'wh-leadtime' && typeof w.loadLeadTime === 'function') w.loadLeadTime();
        if (tabId === 'wh-posap') {
          if (typeof w.loadWhInventory === 'function') w.loadWhInventory();
          else if (typeof w.loadPoSap === 'function') w.loadPoSap();
        }
        if (tabId === 'portal-order' && typeof w.loadQuota === 'function') w.loadQuota();
        if (tabId === 'portal-search' && typeof w.searchVouchers === 'function') w.searchVouchers();
        if (tabId === 'portal-history' && typeof w.loadHistory === 'function') w.loadHistory();
        if (tabId === 'portal-kiemke' && typeof w.loadAudit === 'function') w.loadAudit();
      }, 0);
    });
  }

  // Scoped Lucide icon rendering on active tab only
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    requestAnimationFrame(() => {
      const activeEl = document.getElementById(tabId);
      if (activeEl) lucide.createIcons({ root: activeEl });
    });
  }
}

export function onGlobalMonthChange(val: string): void {
  const orderMonthEl = document.getElementById('orderMonth') as HTMLInputElement | null;
  if (orderMonthEl) orderMonthEl.value = val;
  const w = typeof window !== 'undefined' ? (window as any) : {};
  if (typeof w.loadQuota === 'function') w.loadQuota();
}

export function onGlobalBranchChange(code?: string): void {
  if (!code) code = 'ALL';
  App.currentBranch = code.toLowerCase();
  invalidateTabCache();

  const w = typeof window !== 'undefined' ? (window as any) : {};
  const sites = typeof w.getAppSitesList === 'function' ? w.getAppSitesList() : gFnbSitesList;
  const siteObj = sites.find((s: any) => s.code.toLowerCase() === code?.toLowerCase());
  const region = siteObj ? siteObj.region : (code === 'ALL' ? 'Toàn Quốc' : 'Miền Nam');
  const siteName = siteObj ? siteObj.name : (code === 'ALL' ? 'Tất Cả Điểm Bán (Chuỗi)' : code);

  // 1. Update Taskbar Interactive Display Pill
  const taskbarRegion = document.getElementById('taskbarRegionBadge');
  const taskbarName = document.getElementById('taskbarSiteName');
  if (taskbarRegion) {
    taskbarRegion.textContent = region;
    taskbarRegion.className = `hidden xs:inline-block text-xs px-1.5 py-0.5 rounded font-semibold uppercase shrink-0 ${
      region === 'Miền Nam' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
      region === 'Miền Bắc' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
      'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
    }`;
  }
  if (taskbarName) {
    taskbarName.textContent = siteName;
  }

  // 2. Sync hidden #globalBranchSelect
  const branchSel = document.getElementById('globalBranchSelect') as HTMLSelectElement | null;
  if (branchSel) {
    branchSel.innerHTML = `<option value="${code}" selected>${code}</option>`;
    branchSel.value = code;
  }

  // 2b. Sync Site Selectors across Stock, Counts, Receipts, Waste, Wh-Inventory, Wh-ReceivedOrders
  const targetSite = (code && code !== 'ALL') ? code : (localStorage.getItem('orbit_user_site') || 'K001');
  const allSiteSelectIds = [
    'fnbStockFilterSite', 'fnbCountSiteSelect', 'fnbReceiptFilterSite', 
    'fnbWasteFilterSite', 'receiptModalSite', 'wasteModalSite',
    'whInvSiteSelect', 'whReceivedOrdersSiteFilter'
  ];
  allSiteSelectIds.forEach(id => {
    const el = document.getElementById(id) as HTMLSelectElement | null;
    if (el) {
      if (el.options && el.options.length > 0) {
        let matched = false;
        for (let i = 0; i < el.options.length; i++) {
          const opt = el.options[i];
          if (opt.value.toUpperCase() === targetSite.toUpperCase()) {
            el.value = opt.value;
            matched = true;
            break;
          }
        }
        if (!matched && targetSite) {
          const opt = new Option(targetSite, targetSite);
          el.add(opt);
          el.value = targetSite;
        }
      } else {
        el.innerHTML = `<option value="${targetSite}" selected>${targetSite}</option>`;
        el.value = targetSite;
      }
    }
  });
  if (w.gFnbStockFilter) w.gFnbStockFilter.site = targetSite.toUpperCase();

  // Sync site badges in page headers
  const fnbBadge = document.getElementById('fnbCountCurrentSiteBadge');
  if (fnbBadge) fnbBadge.textContent = siteObj ? (siteObj.ten || siteObj.name) : targetSite;
  const whBadge = document.getElementById('whInvCurrentSiteBadge');
  if (whBadge) whBadge.textContent = siteObj ? (siteObj.ten || siteObj.name) : targetSite;
  const ropBadge = document.getElementById('whRopCurrentSiteBadge');
  if (ropBadge) ropBadge.textContent = siteObj ? (siteObj.ten || siteObj.name) : targetSite;
  const hsBadge = document.getElementById('hsCurrentSiteBadge');
  if (hsBadge) hsBadge.textContent = siteObj ? (siteObj.ten || siteObj.name) : (code === 'ALL' ? 'Tất cả điểm bán' : targetSite);

  // 3. Update all tab badges
  document.querySelectorAll('.global-tab-region-badge').forEach(el => {
    el.textContent = region;
    el.className = `global-tab-region-badge px-1.5 py-0.5 rounded font-bold text-xs uppercase ${
      region === 'Miền Nam' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
      region === 'Miền Bắc' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
      'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
    }`;
  });
  document.querySelectorAll('.global-tab-site-label').forEach(el => {
    el.textContent = siteName;
  });

  // 4. Update hidden selects for data fetching in all tabs
  const fullTen = siteObj ? (siteObj.ten || siteObj.name) : (code !== 'ALL' ? code : '');
  ['order', 'ct', 'bc', 'sc', 'hs', 'kk'].forEach(prefix => {
    const sel = document.getElementById(prefix + 'Site') as HTMLSelectElement | null;
    if (sel) {
      if (code === 'ALL' && ['sc', 'hs', 'kk'].includes(prefix)) {
        sel.innerHTML = '<option value="">-- Tất cả Site --</option>';
        sel.value = '';
      } else if (fullTen) {
        sel.innerHTML = `<option value="${fullTen}">${fullTen}</option>`;
        sel.value = fullTen;
      }
    }
  });

  // 5. Trigger data reload for active views
  try {
    if (typeof w.loadQuota === 'function') w.loadQuota();
    if (typeof w.loadDashboardSummary === 'function') w.loadDashboardSummary();
    if (typeof w.loadStockFEFO === 'function') w.loadStockFEFO();
    if (typeof w.loadReorderROP === 'function') w.loadReorderROP();
    if (typeof w.loadFnbCounts === 'function') w.loadFnbCounts();
    if (typeof w.loadFnbReceipts === 'function') w.loadFnbReceipts();
    if (typeof w.loadAudit === 'function') w.loadAudit();
    if (typeof w.loadLeadTime === 'function') w.loadLeadTime();
    if (typeof w.loadWhInventory === 'function') w.loadWhInventory();
    if (typeof w.loadWhReceivedOrders === 'function') w.loadWhReceivedOrders();
    if (typeof w.loadHistory === 'function') w.loadHistory();
    if (typeof w.searchVouchers === 'function') w.searchVouchers();
    else if (typeof w.loadPoSap === 'function') w.loadPoSap();
  } catch (e) {
    console.warn('Reload notice:', e);
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function populateSitesFor(prefix: string, selectedRegion: string = ''): void {
  const siteSelect = document.getElementById(prefix + 'Site') as HTMLSelectElement | null;
  if (!siteSelect) return;

  const filtered = selectedRegion ? App.siteObjs.filter((s: any) => s.vungMien === selectedRegion) : App.siteObjs;

  let html = '';
  if (['sc', 'hs', 'kk'].includes(prefix)) {
    html += '<option value="">-- Tất cả Site --</option>';
  }
  html += filtered.map((s: any) => `<option value="${s.ten}">${s.ten}</option>`).join('');
  siteSelect.innerHTML = html;
}

export function onSelectVung(prefix: string): void {
  const vungSelect = document.getElementById(prefix + 'Vung') as HTMLSelectElement | null;
  const selectedRegion = vungSelect ? vungSelect.value : '';
  populateSitesFor(prefix, selectedRegion);
  const w = typeof window !== 'undefined' ? (window as any) : {};
  if (prefix === 'order' && typeof w.loadQuota === 'function') w.loadQuota();
  if (prefix === 'sc' && typeof w.searchVouchers === 'function') w.searchVouchers();
  if (prefix === 'hs' && typeof w.loadHistory === 'function') w.loadHistory();
  if (prefix === 'kk' && typeof w.loadAudit === 'function') w.loadAudit();
}

export function initFnbSiteSelectors(): void {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  const selectors = ['fnbStockFilterSite', 'fnbCountSiteSelect', 'fnbReceiptFilterSite', 'fnbWasteFilterSite', 'receiptModalSite', 'wasteModalSite'];
  selectors.forEach(sid => {
    const el = document.getElementById(sid) as HTMLSelectElement | null;
    if (!el || !el.options || el.options.length > 2) return;
    const isFilter = sid.includes('Filter');
    let opts = isFilter ? '<option value="all">Tất cả 14 điểm</option>' : '';
    const sites = (typeof w.getAppSitesList === 'function' ? w.getAppSitesList() : gFnbSitesList);
    sites.forEach((s: any) => {
      opts += `<option value="${s.code}">${s.ten || s.name} (${s.region === 'Miền Nam' ? 'MN' : 'MB'})</option>`;
    });
    el.innerHTML = opts;
  });

  const today = new Date().toISOString().slice(0, 10);
  const dp = document.getElementById('fnbCountDatePicker') as HTMLInputElement | null;
  if (dp && !dp.value) dp.value = today;
  const rp = document.getElementById('receiptModalDate') as HTMLInputElement | null;
  if (rp && !rp.value) rp.value = today;
  const wp = document.getElementById('wasteModalDate') as HTMLInputElement | null;
  if (wp && !wp.value) wp.value = today;
}

export async function initSystem(): Promise<void> {
  showLoading('Khởi tạo dữ liệu hệ thống...');
  try {
    const d = new Date();
    const curDateEl = document.getElementById('currentDateDisplay');
    if (curDateEl) {
      curDateEl.textContent = d.toLocaleDateString('vi-VN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }

    const curMonthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    document.querySelectorAll('input[type="month"]').forEach(inp => {
      if (inp.id !== 'hsMonth' && inp.id !== 'kkMonth') (inp as HTMLInputElement).value = curMonthStr;
    });
    document.querySelectorAll('input[type="date"]').forEach(inp => {
      if (!(inp as HTMLInputElement).value) (inp as HTMLInputElement).value = d.toISOString().split('T')[0];
    });

    const res = await fetch('/api/init');
    const json = await res.json();
    if (json.success && json.data) {
      App.siteObjs = json.data.siteObjs || [];
      App.sites = json.data.sites || [];
      App.vungMien = json.data.vungMien || [];
      App.loaiHoaDon = json.data.loaiHoaDon || [];

      // Populate Vùng selects
      ['orderVung', 'ctVung', 'bcVung', 'scVung', 'hsVung', 'kkVung'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.innerHTML = '<option value="">-- Tất cả vùng --</option>' +
            App.vungMien.map((v: string) => `<option value="${v}">${v}</option>`).join('');
        }
      });

      // Populate Loại Hóa Đơn selects
      const loaiOpts = App.loaiHoaDon.map((l: string) => `<option value="${l}">${l}</option>`).join('');
      const ctLoaiEl = document.getElementById('ctLoai');
      if (ctLoaiEl) ctLoaiEl.innerHTML = loaiOpts;
      const scLoaiEl = document.getElementById('scLoai');
      if (scLoaiEl) scLoaiEl.innerHTML = '<option value="">Tất cả loại</option>' + loaiOpts;

      // Populate Sites for all modules
      populateSitesFor('order');
      populateSitesFor('ct');
      populateSitesFor('bc');
      populateSitesFor('kk');
      populateSitesFor('sc');
      populateSitesFor('hs');

      // Preload order quota for default site
      const orderMonthEl = document.getElementById('orderMonth') as HTMLInputElement | null;
      if (orderMonthEl && !orderMonthEl.value) {
        orderMonthEl.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }
      if (App.siteObjs.length) {
        const orderSiteEl = document.getElementById('orderSite') as HTMLSelectElement | null;
        const defaultSiteTen = App.siteObjs[0].ten;
        if (orderSiteEl) {
          orderSiteEl.innerHTML = `<option value="${defaultSiteTen}">${defaultSiteTen}</option>`;
          orderSiteEl.value = defaultSiteTen;
        }
        const w = typeof window !== 'undefined' ? (window as any) : {};
        if (typeof w.loadQuota === 'function') w.loadQuota();
      }

      // Populate branchSelector
      const branchSel = document.getElementById('branchSelector') as HTMLSelectElement | null;
      if (branchSel && App.siteObjs.length) {
        branchSel.innerHTML = App.siteObjs.map((s: any) => `<option value="${s.code.toLowerCase()}">${s.ten}</option>`).join('');
      }
    }

    const w = typeof window !== 'undefined' ? (window as any) : {};
    if (typeof w.loadDashboardSummary === 'function') {
      await w.loadDashboardSummary();
    }
  } catch (err: any) {
    showToast('Lỗi: ' + err.message);
  } finally {
    hideLoading();
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  }
}
