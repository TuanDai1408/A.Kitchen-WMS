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

  // Wrap all 12 key search/filter handlers with smart debouncing
  _wrapDebounce('onFnbPoSearchInput', 200);
  _wrapDebounce('filterWhInventoryTable', 200);
  _wrapDebounce('filterItems', 200);
  _wrapDebounce('filterAuditItems', 200);
  _wrapDebounce('onFnbCountSearch', 200);
  _wrapDebounce('onFnbWasteSearch', 200);
  _wrapDebounce('filterFefoLive', 200);
  _wrapDebounce('filterGlobalQuickSearch', 200);
  _wrapDebounce('filterSidebarMenu', 150);
  _wrapDebounce('filterManualCatalogList', 200);
  _wrapDebounce('filterSiteOptionCards', 150);
  _wrapDebounce('filterWhReceivedOrdersTable', 200);
}
