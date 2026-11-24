export interface StockSite {
  id: string;
  code: string;
  name: string;
  region?: string;
  ten?: string;
}

export interface StockCell {
  book?: number | string;
  lastCount?: number | string | null;
  lastDate?: string;
  noOpening?: boolean;
  value?: number;
  hasSiteRecord?: boolean;
}

export interface StockRow {
  code: string;
  name: string;
  group: string;
  unit: string;
  price?: number;
  cells: Record<string, StockCell>;
}

export interface StockData {
  sites: StockSite[];
  rows: StockRow[];
  groups: Record<string, string>;
}

export interface StockFilter {
  site: string;
  group: string;
  search: string;
  showValue: boolean;
  region?: string;
}
