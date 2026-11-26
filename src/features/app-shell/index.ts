/**
 * Module 14: App Shell Foundation, Navigation, Theme Engine & Charts System
 */

import {
  _tabLoadedTime,
  shouldRefreshTab,
  markTabLoaded,
  invalidateTabCache,
  initDebouncedHandlers
} from './cache-utils';

import {
  fmtVND,
  fmtCompactVND,
  fmtNum,
  renderKpi,
  showToast,
  showLoading,
  hideLoading
} from './ui-feedback';

import {
  openSidebar,
  closeSidebar,
  toggleSidebar
} from './sidebar';

import {
  isDarkModeActive,
  toggleTheme,
  initTheme
} from './theme';

import {
  TAB_META,
  openMobileMenuHub,
  closeMobileMenuHub,
  filterMobileHubFeatures,
  switchFromHub,
  updateMobileNavState,
  openImageLightbox,
  closeImageLightbox
} from './mobile-hub';

export * from './ux-enhancements';

import {
  chartInboundOutbound,
  chartSafetyGauge,
  chartValueTrend,
  chartItemDetail,
  chartAuditComparison,
  initTailadminCharts,
  changeTrendPeriod,
  updateAuditKpisAndChart
} from './charts';

import {
  openGeneralModal,
  closeGeneralModal,
  openAuthModal,
  doLogin,
  doRegister,
  logoutAdmin,
  exportStyledExcel,
  exportVouchersExcel,
  exportSingleOrderExcel
} from './modals';

import {
  App,
  gFnbSitesList,
  gFnbAllItems,
  gCurrentCountItems,
  gFnbBlindCount,
  switchTab,
  onGlobalMonthChange,
  onGlobalDateRangeChange,
  getGlobalDateRange,
  initGlobalDateRangePicker,
  onGlobalBranchChange,
  populateSitesFor,
  onSelectVung,
  initFnbSiteSelectors,
  initSystem
} from './navigation';

export * from './types';
export * from './cache-utils';
export * from './ui-feedback';
export * from './sidebar';
export * from './theme';
export * from './mobile-hub';
export * from './charts';
export * from './modals';
export * from './navigation';

// Bind to window for HTML inline event handlers & backwards compatibility
if (typeof window !== 'undefined') {
  const w = window as any;

  // Cache & Debounce
  w._tabLoadedTime = _tabLoadedTime;
  w.shouldRefreshTab = shouldRefreshTab;
  w.markTabLoaded = markTabLoaded;
  w.invalidateTabCache = invalidateTabCache;

  // App State & UI Feedback
  w.App = App;
  w.fmtVND = fmtVND;
  w.fmtCompactVND = fmtCompactVND;
  w.fmtNum = fmtNum;
  w.renderKpi = renderKpi;
  w.showToast = showToast;
  w.showLoading = showLoading;
  w.hideLoading = hideLoading;

  // Sidebar
  w.openSidebar = openSidebar;
  w.closeSidebar = closeSidebar;
  w.toggleSidebar = toggleSidebar;

  // Theme
  w.isDarkModeActive = isDarkModeActive;
  w.toggleTheme = toggleTheme;

  // Mobile Hub & Lightbox
  w.TAB_META = TAB_META;
  w.openMobileMenuHub = openMobileMenuHub;
  w.closeMobileMenuHub = closeMobileMenuHub;
  w.filterMobileHubFeatures = filterMobileHubFeatures;
  w.switchFromHub = switchFromHub;
  w.updateMobileNavState = updateMobileNavState;
  w.openImageLightbox = openImageLightbox;
  w.closeImageLightbox = closeImageLightbox;

  // Charts
  w.chartInboundOutbound = chartInboundOutbound;
  w.chartSafetyGauge = chartSafetyGauge;
  w.chartValueTrend = chartValueTrend;
  w.chartItemDetail = chartItemDetail;
  w.chartAuditComparison = chartAuditComparison;
  w.initTailadminCharts = initTailadminCharts;
  w.changeTrendPeriod = changeTrendPeriod;
  w.updateAuditKpisAndChart = updateAuditKpisAndChart;

  // Modals & Excel
  w.openGeneralModal = openGeneralModal;
  w.closeGeneralModal = closeGeneralModal;
  w.openAuthModal = openAuthModal;
  w.doLogin = doLogin;
  w.doRegister = doRegister;
  w.logoutAdmin = logoutAdmin;
  w.exportStyledExcel = exportStyledExcel;
  w.exportVouchersExcel = exportVouchersExcel;
  w.exportSingleOrderExcel = exportSingleOrderExcel;

  // Navigation & Sites
  w.gFnbSitesList = gFnbSitesList;
  w.gFnbAllItems = gFnbAllItems;
  w.gCurrentCountItems = gCurrentCountItems;
  w.gFnbBlindCount = gFnbBlindCount;
  w.switchTab = switchTab;
  w.onGlobalMonthChange = onGlobalMonthChange;
  w.onGlobalDateRangeChange = onGlobalDateRangeChange;
  w.getGlobalDateRange = getGlobalDateRange;
  w.initGlobalDateRangePicker = initGlobalDateRangePicker;
  w.onGlobalBranchChange = onGlobalBranchChange;
  w.populateSitesFor = populateSitesFor;
  w.onSelectVung = onSelectVung;
  w.initFnbSiteSelectors = initFnbSiteSelectors;
  w.initSystem = initSystem;

  // Global Ctrl+K / Cmd+K search shortcut listener
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      const searchInput = (document.getElementById('globalHeaderSearch') || document.getElementById('sidebarMenuSearch')) as HTMLInputElement | null;
      if (searchInput) {
        searchInput.focus();
        if (typeof searchInput.select === 'function') searchInput.select();
      }
    }
  });

  // Restore persisted active tab & initialize system on DOM ready
  const onReady = () => {
    initTheme();
    initSystem();
    initFnbSiteSelectors();
    initDebouncedHandlers();

    try {
      const savedActiveTab = localStorage.getItem('orbit_active_tab');
      if (savedActiveTab && document.getElementById(savedActiveTab)) {
        setTimeout(() => {
          switchTab(savedActiveTab);
        }, 50);
      }
    } catch (e) {}

    setTimeout(() => {
      const w = window as any;
      const curUser = w.gCurrentUser;
      if (curUser && curUser.status === 'LOCKED') return;
      if (typeof w.canAccessTab === 'function' && !w.canAccessTab('fnb-chain')) return;

      if (typeof w.loadFnbChain === 'function') w.loadFnbChain();
      updateMobileNavState('fnb-chain');
    }, 300);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    setTimeout(onReady, 20);
  }
}
