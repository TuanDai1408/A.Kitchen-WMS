/**
 * Site (Điểm bán / Bếp) Type Definitions for A.Kitchen WMS
 */

export type Region = 'Miền Nam' | 'Miền Bắc' | 'Miền Trung' | 'ALL';

export interface Site {
  code: string;
  name: string;
  ten?: string;
  region: Region;
  active: boolean;
  address?: string;
  is_btt?: boolean;
}

export interface SiteOption {
  code: string;
  name: string;
  region: Region;
  label: string;
}
