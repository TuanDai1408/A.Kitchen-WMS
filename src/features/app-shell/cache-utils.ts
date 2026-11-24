/**
 * High-Performance Utility Helpers (Debounce & SWR Tab Cache)
 */

import { debounce } from '@/ts/utils/formatters';

export const _tabLoadedTime: Record<string, number> = {};

export function shouldRefreshTab(tabId: string, maxAgeMs: number = 45000): boolean {
  const lastTime = _tabLoadedTime[tabId] || 0;
  return (Date.now() - lastTime > maxAgeMs);
}

export function markTabLoaded(tabId: string): void {
  _tabLoadedTime[tabId] = Date.now();
}

export function invalidateTabCache(tabId?: string): void {
  if (tabId) {
    delete _tabLoadedTime[tabId];
  } else {
    for (const key in _tabLoadedTime) {
      delete _tabLoadedTime[key];
    }
  }
}

export function initDebouncedHandlers(): void {
  if (typeof window === 'undefined') return;
  const w = window as any;

  function _wrapDebounce(fnName: string, wait: number = 200) {
    if (typeof w[fnName] === 'function') {
      const orig = w[fnName];
      w[fnName] = debounce(function (...args: any[]) {
        orig.apply(w, args);
      }, wait);
    }
  }

  // Wrap all 15 key search/filter handlers with smart debouncing
  _wrapDebounce('onFnbPoSearchInput', 150);
  _wrapDebounce('filterWhInventoryTable', 150);
  _wrapDebounce('filterItems', 150);
  _wrapDebounce('filterAuditItems', 150);
  _wrapDebounce('onFnbCountSearch', 150);
  _wrapDebounce('onFnbWasteSearch', 150);
  _wrapDebounce('filterFefoLive', 150);
  _wrapDebounce('filterGlobalQuickSearch', 150);
  _wrapDebounce('filterSidebarMenu', 120);
  _wrapDebounce('filterManualCatalogList', 150);
  _wrapDebounce('filterSiteOptionCards', 120);
  _wrapDebounce('filterWhReceivedOrdersTable', 150);
  _wrapDebounce('onSearchChainSite', 150);
  _wrapDebounce('filterUserMatrix', 150);
  _wrapDebounce('filterMobileHubFeatures', 120);

  // Performance Engine: Automatically scope un-rooted lucide.createIcons() to active container
  // Prevents full 6,000-line DOM re-traversals on every interaction
  if (typeof w.lucide !== 'undefined' && w.lucide.createIcons && !w.lucide.__isOptimized) {
    const origCreateIcons = w.lucide.createIcons;
    w.lucide.createIcons = function (opts?: any) {
      if (opts && opts.root) {
        return origCreateIcons.call(w.lucide, opts);
      }
      const activeModal = document.querySelector('.modal:not(.hidden), [role="dialog"]:not(.hidden)');
      const activeTab = document.querySelector('.tab-panel.active');
      const root = activeModal || activeTab || document.body;
      return origCreateIcons.call(w.lucide, { root });
    };
    w.lucide.__isOptimized = true;
  }
}
