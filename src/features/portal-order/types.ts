export interface PortalOrderItem {
  maHang: string;
  tenSP: string;
  tenLoai?: string;
  dvt: string;
  donGia: number;
  daDat?: number;
  soLuongDat?: number;
  nguonCung?: string;
  nganh_hang?: string;
}

export interface QuotaData {
  site: string;
  thang: string;
  nganSach: number;
  tienDaDat: number;
  items: PortalOrderItem[];
}

export interface CreateOrderPayload {
  site: string;
  thang: string;
  nguoiDat: string;
  ghiChu: string;
  items: Array<{
    maHang: string;
    tenSP: string;
    dvt: string;
    donGia: number;
    soLuong: number;
    daDat?: number;
  }>;
}
