-- ============================================================================
-- AKITCHEN CLOUDFLARE D1 DATABASE SCHEMA
-- Hệ thống Quản Lý Xuất Nhập Tồn Kho Đa Điểm, Cận Date FEFO & Vận Hành Bếp
-- ============================================================================

-- 1. Bảng Điểm Bán / Kho Chi Nhánh
CREATE TABLE IF NOT EXISTS branches (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Danh Mục Hàng Hóa (Gia vị, CCDC, Vật tư tiêu hao)
CREATE TABLE IF NOT EXISTS items (
  sku TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Gia vị', 'Vật tư tiêu hao', 'CCDC'
  unit TEXT NOT NULL,
  standard_cost_sap REAL DEFAULT 0,
  old_cost_sap REAL DEFAULT 0,
  last_cost_date TEXT,
  daily_usage REAL DEFAULT 0,
  safety_stock REAL DEFAULT 0,
  lead_time_hours REAL DEFAULT 24.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Lô & Hạn Sử Dụng (Tồn Kho FEFO)
CREATE TABLE IF NOT EXISTS inventory_batches (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  batch_code TEXT NOT NULL,
  mfg_date TEXT,
  exp_date TEXT NOT NULL,
  qty REAL NOT NULL DEFAULT 0,
  storage_loc TEXT DEFAULT 'Kho chuẩn',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id),
  FOREIGN KEY (sku) REFERENCES items(sku)
);

-- 4. Bảng Lịch Sử Giao Dịch Xuất Nhập Kho
CREATE TABLE IF NOT EXISTS stock_transactions (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  batch_id TEXT,
  trans_type TEXT NOT NULL, -- 'NHAP_KHO', 'XUAT_BEP', 'XUAT_CHUYEN', 'NHAP_CHUYEN', 'KIEM_KE'
  qty REAL NOT NULL,
  note TEXT,
  ref_code TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id),
  FOREIGN KEY (sku) REFERENCES items(sku)
);

-- 5. Bảng Điều Chuyển Kho Nội Bộ Đa Điểm
CREATE TABLE IF NOT EXISTS stock_transfers (
  id TEXT PRIMARY KEY,
  transfer_code TEXT UNIQUE NOT NULL,
  from_branch_id TEXT NOT NULL,
  to_branch_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  batch_id TEXT,
  qty REAL NOT NULL,
  status TEXT DEFAULT 'DANG_VANCHUYEN', -- 'DANG_VANCHUYEN', 'DA_NHAN', 'HUY'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  received_at DATETIME,
  FOREIGN KEY (from_branch_id) REFERENCES branches(id),
  FOREIGN KEY (to_branch_id) REFERENCES branches(id),
  FOREIGN KEY (sku) REFERENCES items(sku)
);

-- 6. Bảng Đơn Hàng PO & Lead Time
CREATE TABLE IF NOT EXISTS purchase_orders (
  id TEXT PRIMARY KEY,
  po_number TEXT UNIQUE NOT NULL,
  branch_id TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  order_time DATETIME NOT NULL,
  received_time DATETIME,
  lead_time_hours REAL,
  sla_target_hours REAL DEFAULT 24.0,
  status TEXT DEFAULT 'DA_DAT', -- 'DA_DAT', 'DANG_GIAO', 'DA_NHAN', 'HUY'
  total_amount REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Bảng Chi Tiết PO & So Sánh Giá S SAP (PPV)
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id TEXT PRIMARY KEY,
  po_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  qty REAL NOT NULL,
  unit TEXT NOT NULL,
  po_price REAL NOT NULL,
  sap_price REAL NOT NULL,
  variance_pct REAL DEFAULT 0,
  FOREIGN KEY (po_id) REFERENCES purchase_orders(id),
  FOREIGN KEY (sku) REFERENCES items(sku)
);

-- 8. Bảng Chứng Từ Hóa Đơn Giao Nhận
CREATE TABLE IF NOT EXISTS vouchers (
  id TEXT PRIMARY KEY,
  voucher_code TEXT UNIQUE NOT NULL,
  invoice_number TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  doc_date TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'DA_NHAN_DU', -- 'DA_NHAN_DU', 'DA_DOI_CHIEU_SAP', 'CHO_XU_LY'
  po_number TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. Bảng Báo Cáo Vận Hành Suất Ăn Hàng Ngày
CREATE TABLE IF NOT EXISTS daily_catering_reports (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL,
  report_date TEXT NOT NULL,
  planned_meals INTEGER NOT NULL,
  actual_meals INTEGER NOT NULL,
  wasted_meals INTEGER DEFAULT 0,
  staff_actual INTEGER,
  staff_standard INTEGER,
  food_quality_note TEXT,
  customer_feedback TEXT,
  extra_cost REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- 10. Bảng Báo Cáo Kiểm Kê Kỳ (Tự Động Tính Tồn Cuối)
CREATE TABLE IF NOT EXISTS stock_audits (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL,
  period_month TEXT NOT NULL, -- '11/2026'
  sku TEXT NOT NULL,
  opening_qty REAL NOT NULL DEFAULT 0,
  used_qty REAL NOT NULL DEFAULT 0,
  closing_qty REAL GENERATED ALWAYS AS (opening_qty - used_qty) VIRTUAL,
  note TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id),
  FOREIGN KEY (sku) REFERENCES items(sku)
);
