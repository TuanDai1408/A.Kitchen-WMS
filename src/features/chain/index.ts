import {
  gChainRankings,
  gCurrentFilterRegion,
  triggerSyncFnbMonthlySummary,
  loadFnbChain,
  renderFnbChainTable,
  filterFnbChainByRegion,
  onSearchChainSite
} from './chain-rankings';

import {
  currentPLData,
  viewSitePL,
  loadFnbPL,
  filterPlBreakdown,
  renderFnbPL,
  onSelectPLSite
} from './pl-report';

import {
  loadFnbPOS,
  renderFnbPOS
} from './pos-metrics';

import {
  loadFnbSites,
  renderFnbSites
} from './sites-master';

import {
  exportFnbChainExcel,
  exportFnbPLExcel
} from './export';

export * from './types';
export * from './chain-rankings';
export * from './pl-report';
export * from './pos-metrics';
export * from './sites-master';
export * from './export';

// Bind to window for HTML inline event handlers
if (typeof window !== 'undefined') {
  const w = window as any;

  w.gChainRankings = gChainRankings;
  w.gCurrentFilterRegion = gCurrentFilterRegion;
  w.currentPLData = currentPLData;

  w.triggerSyncFnbMonthlySummary = triggerSyncFnbMonthlySummary;
  w.loadFnbChain = loadFnbChain;
  w.renderFnbChainTable = renderFnbChainTable;
  w.filterFnbChainByRegion = filterFnbChainByRegion;
  w.onSearchChainSite = onSearchChainSite;

  w.viewSitePL = viewSitePL;
  w.loadFnbPL = loadFnbPL;
  w.filterPlBreakdown = filterPlBreakdown;
  w.renderFnbPL = renderFnbPL;
  w.onSelectPLSite = onSelectPLSite;

  w.loadFnbPOS = loadFnbPOS;
  w.renderFnbPOS = renderFnbPOS;

  w.loadFnbSites = loadFnbSites;
  w.renderFnbSites = renderFnbSites;

  w.exportFnbChainExcel = exportFnbChainExcel;
  w.exportFnbPLExcel = exportFnbPLExcel;
}
