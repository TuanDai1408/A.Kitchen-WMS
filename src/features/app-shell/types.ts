/**
 * App Shell & Core Navigation Type Definitions
 */

export interface AppState {
  currentBranch: string;
  sites: string[];
  siteObjs: any[];
  vungMien: string[];
  loaiHoaDon: string[];
  items: any[];
  auditItems: any[];
  fefoItems: any[];
  ropItems: any[];
  user: any | null;
}

export interface KpiRenderOptions {
  loading?: boolean;
  value?: number | string | null;
  text?: string;
  unit?: string;
  rawFull?: string;
  isCurrency?: boolean;
  delta?: number | string | null;
  deltaText?: string;
  deltaGood?: boolean;
  sub?: string;
  progress?: number;
}

export type TrendPeriod = 'week' | 'month' | 'quarter';

export interface TabMetadata {
  title: string;
  mobTab: string;
}
