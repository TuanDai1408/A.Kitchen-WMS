export interface VoucherFileItem {
  name: string;
  size: number;
  type?: string;
  url?: string;
  previewUrl?: string;
  file?: File;
}

export interface VoucherPayload {
  site: string;
  loaiHoaDon: string;
  ngayXuat: string;
  ngayNhan: string;
  nhaCungCap?: string;
  nguoiGiao?: string;
  nguoiNhan?: string;
  ghiChu?: string;
  nguoiNhap?: string;
  files?: Array<{ name: string; url: string; type?: string }>;
}

export interface VoucherSearchResultItem {
  maCT: string;
  site: string;
  loaiHoaDon: string;
  ngayXuat: string;
  ngayNhan: string;
  nhaCungCap?: string;
  nguoiNhap?: string;
  soFile?: number;
}

export interface VoucherDetailData {
  voucher_code: string;
  invoice_type: string;
  site_name: string;
  supplier_name?: string;
  note?: string;
  files?: Array<{ file_name: string; file_link: string }>;
}

export interface CateringReportImage {
  name: string;
  size?: number;
  previewUrl?: string;
}

export interface CateringReportPayload {
  site: string;
  branchCode: string;
  reportDate: string;
  reporterName: string;
  plannedMeals: number;
  actualMeals: number;
  wastedMeals: number;
  staffActual: number;
  staffStandard: number;
  foodQualityNote?: string;
  feedback?: string;
  extraCost: number;
  images?: Array<{ name: string }>;
  reportData?: Record<string, any>;
}

export interface AuditItem {
  id: number | string;
  site_code?: string;
  item_code: string;
  item_name: string;
  nganh_hang?: string;
  nhom_hang?: string;
  warehouse_code?: string;
  unit?: string;
  price?: number | string;
  closing_t9?: number;
  closing_t10?: number;
  usage_t11?: number | null;
}

export interface AuditMeta {
  nganh_hang?: string[];
  nhom_hang?: string[];
}
