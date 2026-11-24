export interface OrderHistoryItem {
  maDon: string;
  ngayDat: string;
  site: string;
  nguoiDat: string;
  thang?: string;
  trangThai: string;
  soDong: number;
  tongSL: number;
  tongTien: number;
  currentStep?: number;
  currentStepName?: string;
}

export interface JourneyStepRecord {
  buoc: number | string;
  tenBuoc: string;
  thoiGian?: string;
  nguoiXuLy?: string;
  trangThai?: string;
  ghiChu?: string;
}

export interface OrderDetailInfo {
  order_code: string;
  order_date: string;
  site_name: string;
  ordered_by: string;
  applied_month?: string;
  status: string;
  note?: string;
  site?: string;
}

export interface OrderDetailLineItem {
  maHang: string;
  tenSP: string;
  dvt: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
  ghiChu?: string;
}

export interface EditOrderItem {
  maHang: string;
  tenSP: string;
  dvt: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
  ghiChu?: string;
}
