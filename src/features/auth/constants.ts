import { AuthRoleDefinition, FeatureTitleInfo, AuthSiteOption, UserAccount } from './types';

export const GOOGLE_CLIENT_ID = "241889016372-b7klaa5uff117fck5tl4ajj39ukvfftr.apps.googleusercontent.com";

export function isMasterAccount(email?: string | null): boolean {
  if (!email) return false;
  const clean = String(email).toLowerCase().trim();
  return clean === 'trantuandai2508@gmail.com' || clean.includes('trantuandai2508');
}

export interface TabCategoryGroup {
  groupId: string;
  groupName: string;
  icon: string;
  color: string;
  tabs: { id: string; name: string; desc: string; icon: string }[];
}

export const ALL_TAB_GROUPS: TabCategoryGroup[] = [
  {
    groupId: 'fnb-finance',
    groupName: 'Hiệu Quả & Doanh Thu',
    icon: 'trending-up',
    color: 'rose',
    tabs: [
      { id: 'fnb-chain', name: 'Toàn Chuỗi & Xếp Hạng', desc: 'Báo cáo tổng hợp doanh thu, food cost, biên EBITDA 14 điểm', icon: 'trophy' },
      { id: 'fnb-pl', name: 'Báo Cáo P&L Điểm Bán', desc: 'Báo cáo lãi lỗ, kiểm soát định mức chi phí vận hành', icon: 'pie-chart' },
      { id: 'fnb-pos', name: 'Doanh Thu POS & Bán Lẻ', desc: 'Tra cứu hóa đơn POS, dòng tiền và phân tích giờ cao điểm', icon: 'zap' }
    ]
  },
  {
    groupId: 'wh-kitchen',
    groupName: 'Vận Hành Kho Bếp',
    icon: 'utensils',
    color: 'emerald',
    tabs: [
      { id: 'wh-dashboard', name: 'Tổng Quan Kho Vận', desc: 'Trung tâm điều hành và cân đối kho vận toàn chuỗi', icon: 'layout-dashboard' },
      { id: 'fnb-counts', name: 'Kiểm Kê Hằng Ngày', desc: 'Kiểm đếm thực tế ca sáng/tối và đối soát nguyên vật liệu', icon: 'clipboard-check' },
      { id: 'fnb-receipts', name: 'Nhập Hàng Điểm Bán', desc: 'Kiểm đếm và nhập kho nguyên vật liệu từ đơn PO / NCC', icon: 'package-plus' },
      { id: 'fnb-waste', name: 'Hủy Hàng & Hao Hụt', desc: 'Ghi nhận hàng hỏng, quá hạn, tự động giảm tồn kho thực tế', icon: 'trash-2' }
    ]
  },
  {
    groupId: 'wh-wms',
    groupName: 'Kho Vận & WMS',
    icon: 'boxes',
    color: 'amber',
    tabs: [
      { id: 'wh-stock', name: 'Hạn Dùng & Xuất FEFO', desc: 'Kiểm soát hạn dùng, lô date và giá trị tồn kho tổng', icon: 'layers' },
      { id: 'wh-reorder', name: 'Cảnh Báo Tồn ROP', desc: 'Tính toán tồn an toàn và cảnh báo thiếu hàng tự động', icon: 'alert-triangle' },
      { id: 'wh-leadtime', name: 'Lead Time & NCC', desc: 'Đánh giá độ trễ giao hàng của từng nhà cung cấp', icon: 'clock' },
      { id: 'wh-posap', name: 'Tồn Kho & Quản Lý Lô', desc: 'Số lượng mặt hàng đã nhập kho, thẻ kho xuất nhập và quản lý lô', icon: 'shopping-cart' }
    ]
  },
  {
    groupId: 'portal',
    groupName: 'Cổng Thông Tin & Đặt Hàng',
    icon: 'file-text',
    color: 'blue',
    tabs: [
      { id: 'portal-voucher', name: 'Tạo & Duyệt Chứng Từ', desc: 'Quản lý hóa đơn thuế, chứng từ thanh toán', icon: 'file-text' },
      { id: 'portal-search', name: 'Tra Cứu Chứng Từ', desc: 'Tìm kiếm số liệu kế toán và phân tích đa chiều', icon: 'search' },
      { id: 'portal-order', name: 'Đặt Hàng Vật Tư Bếp', desc: 'Tạo đơn đặt nguyên vật liệu giao về điểm bán', icon: 'shopping-bag' },
      { id: 'portal-history', name: 'Lịch Sử Đặt Hàng', desc: 'Nhật ký thẻ kho và giao dịch kho tổng', icon: 'history' },
      { id: 'portal-baocao', name: 'Báo Cáo Suất Ăn Ca', desc: 'Báo cáo suất ăn và chi phí phát sinh', icon: 'bar-chart-2' },
      { id: 'portal-kiemke', name: 'Kiểm Kê Tồn Kho Kỳ', desc: 'Đối soát và cân chỉnh tồn kho tổng', icon: 'check-square' }
    ]
  },
  {
    groupId: 'system',
    groupName: 'Hệ Thống & Danh Mục',
    icon: 'settings',
    color: 'purple',
    tabs: [
      { id: 'fnb-sites', name: 'Danh Mục 14 Điểm Bán', desc: 'Quản lý thông tin điểm bán, mã trạm và cấu hình hệ thống', icon: 'map-pin' },
      { id: 'user-matrix', name: 'Phân Quyền User Matrix', desc: 'Ma trận phân quyền người dùng và kiểm soát truy cập', icon: 'shield' }
    ]
  }
];

export const APP_SYSTEM_ROLES: AuthRoleDefinition[] = [
  { code: 'ADMIN', name: 'Ban Quản Trị (ADMIN)', desc: 'Toàn quyền quản trị 20/20 chức năng hệ thống', color: 'rose', icon: 'shield-alert' },
  { code: 'BEP_TRUONG', name: 'Bếp Trưởng / Quản Lý Điểm', desc: 'Kho bếp, Kiểm kê, Nhập hủy hàng, Suất ăn', color: 'blue', icon: 'chef-hat' },
  { code: 'KHO_TRUONG', name: 'Quản Lý Kho WMS', desc: 'Kho FEFO, Định mức ROP, Tồn kho thực tế, Thẻ kho & Lô hàng', color: 'amber', icon: 'warehouse' },
  { code: 'KE_TOAN', name: 'Kế Toán Kiểm Soát', desc: 'Báo cáo P&L, Doanh thu POS, Chứng từ thu chi', color: 'emerald', icon: 'calculator' },
  { code: 'NHAN_VIEN', name: 'Nhân Viên Vận Hành', desc: 'Nhập kiểm kê hằng ngày & Báo cáo suất ăn', color: 'gray', icon: 'user' }
];

export const FEATURE_TITLES: Record<string, FeatureTitleInfo> = {
  // Nhóm 1: Hiệu Quả & Doanh Thu
  'fnb-chain': { name: 'Toàn Chuỗi & Xếp Hạng', role: 'ADMIN', desc: 'Báo cáo tổng hợp doanh thu, food cost, biên EBITDA 14 điểm' },
  'fnb-pl': { name: 'Báo Cáo P&L Điểm Bán', role: 'KE_TOAN', desc: 'Báo cáo lãi lỗ, kiểm soát định mức chi phí vận hành' },
  'fnb-pos': { name: 'Doanh Thu POS & Bán Lẻ', role: 'KE_TOAN', desc: 'Tra cứu hóa đơn POS, dòng tiền và phân tích giờ cao điểm' },

  // Nhóm 2: Vận Hành Kho Bếp
  'wh-dashboard': { name: 'Tổng Quan Kho Vận', role: 'KHO_TRUONG', desc: 'Trung tâm điều hành và cân đối kho vận toàn chuỗi' },
  'fnb-counts': { name: 'Kiểm Kê Hằng Ngày', role: 'BEP_TRUONG', desc: 'Kiểm đếm thực tế ca sáng/tối và đối soát nguyên vật liệu' },
  'fnb-receipts': { name: 'Nhập Hàng Điểm Bán', role: 'BEP_TRUONG', desc: 'Kiểm đếm và nhập kho nguyên vật liệu từ đơn PO / NCC' },
  'fnb-waste': { name: 'Hủy Hàng & Hao Hụt', role: 'BEP_TRUONG', desc: 'Ghi nhận hàng hỏng, quá hạn, tự động giảm tồn kho thực tế' },

  // Nhóm 3: Kho Vận & WMS
  'wh-stock': { name: 'Hạn Dùng & Xuất FEFO', role: 'KHO_TRUONG', desc: 'Kiểm soát hạn dùng, lô date và giá trị tồn kho tổng' },
  'wh-reorder': { name: 'Cảnh Báo Tồn ROP', role: 'KHO_TRUONG', desc: 'Tính toán tồn an toàn và cảnh báo thiếu hàng tự động' },
  'wh-leadtime': { name: 'Lead Time & NCC', role: 'KHO_TRUONG', desc: 'Đánh giá độ trễ giao hàng của từng nhà cung cấp' },
  'wh-posap': { name: 'Tồn Kho & Quản Lý Lô', role: 'KHO_TRUONG', desc: 'Số lượng các mặt hàng đã nhập kho, thẻ kho xuất nhập và quản lý lô hàng' },

  // Nhóm 4: Cổng Thông Tin & Đặt Hàng
  'portal-voucher': { name: 'Tạo & Duyệt Chứng Từ', role: 'KE_TOAN', desc: 'Quản lý hóa đơn thuế, chứng từ thanh toán' },
  'portal-search': { name: 'Tra Cứu Chứng Từ', role: 'KE_TOAN', desc: 'Tìm kiếm số liệu kế toán và phân tích đa chiều' },
  'portal-order': { name: 'Đặt Hàng Vật Tư Bếp', role: 'NHAN_VIEN', desc: 'Tạo đơn đặt nguyên vật liệu giao về điểm bán' },
  'portal-history': { name: 'Lịch Sử Đặt Hàng', role: 'KHO_TRUONG', desc: 'Nhật ký thẻ kho và giao dịch kho tổng' },
  'portal-baocao': { name: 'Báo Cáo Suất Ăn Ca', role: 'NHAN_VIEN', desc: 'Báo cáo suất ăn và chi phí phát sinh' },
  'portal-kiemke': { name: 'Kiểm Kê Tồn Kho Kỳ', role: 'KHO_TRUONG', desc: 'Đối soát và cân chỉnh tồn kho tổng' },

  // Nhóm 5: Hệ Thống & Danh Mục
  'fnb-sites': { name: 'Danh Mục 14 Điểm Bán', role: 'KHO_TRUONG', desc: 'Quản lý thông tin điểm bán, mã trạm và cấu hình hệ thống' },
  'user-matrix': { name: 'Phân Quyền User Matrix', role: 'ADMIN', desc: 'Ma trận phân quyền người dùng và kiểm soát truy cập' }
};

export const DEFAULT_SITES_LIST: AuthSiteOption[] = [
  { code: 'ALL', name: 'Tất Cả Điểm Bán (Toàn Chuỗi)', region: 'Toàn Quốc', desc: 'Dành cho Quản trị viên & Kế toán' },
  { code: 'K001', name: 'K001 - MN Bếp Ăn Đại Học Hùng Vương', ten: 'K001 - MN Bếp Ăn Đại Học Hùng Vương', region: 'Miền Nam', desc: 'Trường học • MN Bếp Ăn Đại Học Hùng Vương' },
  { code: 'K002', name: 'K002 - Bệnh viện Đại Học Quốc Tế Hồng Bàng', ten: 'K002 - Bệnh viện Đại Học Quốc Tế Hồng Bàng', region: 'Miền Nam', desc: 'Bệnh viện • Bệnh viện Đại Học Quốc Tế Hồng Bàng' },
  { code: 'K003', name: 'K003 - A.Kitchen - Miền Nam', ten: 'K003 - A.Kitchen - Miền Nam', region: 'Miền Nam', desc: 'Site ảo • A.Kitchen - Miền Nam' },
  { code: 'K004', name: 'K004 - MN A.Kitchen - Thuận An', ten: 'K004 - MN A.Kitchen - Thuận An', region: 'Miền Nam', desc: 'Trường học • MN A.Kitchen - Thuận An' },
  { code: 'K005', name: 'K005 - MN A.Kitchen - Hub Thuận An', ten: 'K005 - MN A.Kitchen - Hub Thuận An', region: 'Miền Nam', desc: 'Trường học • MN A.Kitchen - Hub Thuận An' },
  { code: 'K006', name: 'K006 - MN A.Kitchen - PTNT Quảng Trực', ten: 'K006 - MN A.Kitchen - PTNT Quảng Trực', region: 'Miền Nam', desc: 'Trường học • MN A.Kitchen - PTNT Quảng Trực' },
  { code: 'R515', name: 'R515 - MB Bếp ăn canteen G – Group', ten: 'R515 - MB Bếp ăn canteen G – Group', region: 'Miền Nam', desc: 'Căn tin • MB Bếp ăn canteen G – Group' },
  { code: 'K500', name: 'K500 - MB A Kitchen Hòa Bình', ten: 'K500 - MB A Kitchen Hòa Bình', region: 'Miền Bắc', desc: 'Căn tin • MB A Kitchen Hòa Bình' },
  { code: 'K501', name: 'K501 - Công ty TNHH Julie sandlau', ten: 'K501 - Công ty TNHH Julie sandlau', region: 'Miền Bắc', desc: 'Doanh nghiệp • Công ty TNHH Julie sandlau' },
  { code: 'K502', name: 'K502 - A.Kitchen - Miền Bắc', ten: 'K502 - A.Kitchen - Miền Bắc', region: 'Miền Bắc', desc: 'Site ảo • A.Kitchen - Miền Bắc' },
  { code: 'K503', name: 'K503 - MB A.Kitchen - TTH An Thượng', ten: 'K503 - MB A.Kitchen - TTH An Thượng', region: 'Miền Bắc', desc: 'Trung tâm • MB A.Kitchen - TTH An Thượng' },
  { code: 'K504', name: 'K504 - MB A.Kitchen - Hub An Khánh', ten: 'K504 - MB A.Kitchen - Hub An Khánh', region: 'Miền Bắc', desc: 'Hub • MB A.Kitchen - Hub An Khánh' },
  { code: 'K505', name: 'K505 - MB A.Kitchen - Hub Đa Phúc', ten: 'K505 - MB A.Kitchen - Hub Đa Phúc', region: 'Miền Bắc', desc: 'Hub • MB A.Kitchen - Hub Đa Phúc' },
  { code: 'K800', name: 'K800 - A.Kitchen - Miền Trung', ten: 'K800 - A.Kitchen - Miền Trung', region: 'Miền Trung', desc: 'Site ảo • A.Kitchen - Miền Trung' }
];

export function repairAtobMojibake(str?: string | null): string {
  if (!str || typeof str !== 'string') return str || '';
  let isAllLatin1 = true;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      isAllLatin1 = false;
      break;
    }
  }
  if (isAllLatin1) {
    try {
      const bytes = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
      }
      const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      if (decoded && decoded !== str) return decoded;
    } catch (e) {}
  }
  return str;
}

export function loadPersistedUser(): UserAccount | null {
  try {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('orbit_explicit_logout') === 'true') {
      return null;
    }
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('orbit_user');
      if (raw) {
        const u = JSON.parse(raw);
        if (u && u.email) {
          if (u.fullName) u.fullName = repairAtobMojibake(u.fullName);
          return u;
        }
      }
      const savedListRaw = localStorage.getItem('orbit_saved_accounts');
      if (savedListRaw) {
        const list = JSON.parse(savedListRaw);
        if (Array.isArray(list) && list.length > 0) {
          list.sort((a, b) => (b.lastLogin || 0) - (a.lastLogin || 0));
          if (list[0] && list[0].email) {
            try { localStorage.setItem('orbit_user', JSON.stringify(list[0])); } catch (e) {}
            return list[0];
          }
        }
      }
    }
  } catch (e) {
    console.error('Error restoring gCurrentUser:', e);
  }
  return null;
}
