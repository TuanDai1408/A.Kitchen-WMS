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

-- ============================================================================
-- PERFORMANCE INDEXES (TỐI ƯU HÓA CLOUDFLARE D1 - GIẢM 99% ROWS SCANNED)
-- ============================================================================

-- 1. Branches & Sites
CREATE INDEX IF NOT EXISTS idx_branches_code ON branches(code);
CREATE INDEX IF NOT EXISTS idx_branches_active ON branches(is_active);
CREATE INDEX IF NOT EXISTS idx_sites_code ON sites(site_code);
CREATE INDEX IF NOT EXISTS idx_sites_name ON sites(site_name);

-- 2. Inventory Batches & Stock (FEFO & Tồn kho)
CREATE INDEX IF NOT EXISTS idx_inv_batches_branch_sku ON inventory_batches(branch_id, sku);
CREATE INDEX IF NOT EXISTS idx_inv_batches_exp ON inventory_batches(exp_date);
CREATE INDEX IF NOT EXISTS idx_inv_batches_qty ON inventory_batches(qty);
CREATE INDEX IF NOT EXISTS idx_stock_trans_branch_created ON stock_transactions(branch_id, created_at);
CREATE INDEX IF NOT EXISTS idx_stock_trans_sku ON stock_transactions(sku);

-- 3. Purchase Orders & Vouchers
CREATE INDEX IF NOT EXISTS idx_po_branch_status ON purchase_orders(branch_id, status);
CREATE INDEX IF NOT EXISTS idx_po_number ON purchase_orders(po_number);
CREATE INDEX IF NOT EXISTS idx_po_order_time ON purchase_orders(order_time);
CREATE INDEX IF NOT EXISTS idx_poi_po_id ON purchase_order_items(po_id);
CREATE INDEX IF NOT EXISTS idx_poi_sku ON purchase_order_items(sku);
CREATE INDEX IF NOT EXISTS idx_vouchers_code ON vouchers(voucher_code);
CREATE INDEX IF NOT EXISTS idx_vouchers_status ON vouchers(status);

-- 4. Báo cáo vận hành & Kiểm kê
CREATE INDEX IF NOT EXISTS idx_catering_branch_date ON daily_catering_reports(branch_id, report_date);
CREATE INDEX IF NOT EXISTS idx_stock_audits_branch_period ON stock_audits(branch_id, period_month);

-- 5. Users, Roles & Permissions
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);
CREATE INDEX IF NOT EXISTS idx_app_users_role ON app_users(role_code);
CREATE INDEX IF NOT EXISTS idx_role_perms_role ON role_permissions(role_code);
CREATE INDEX IF NOT EXISTS idx_user_perms_email ON user_permissions(user_email);
CREATE INDEX IF NOT EXISTS idx_access_req_user_status ON access_requests(user_email, status);

-- 6. Đơn Hàng & Định Mức (NVL, Quota)
CREATE INDEX IF NOT EXISTS idx_don_hang_site_month ON don_hang(site_name, applied_month);
CREATE INDEX IF NOT EXISTS idx_don_hang_item ON don_hang(item_code);
CREATE INDEX IF NOT EXISTS idx_don_hang_status ON don_hang(status);
CREATE INDEX IF NOT EXISTS idx_dinh_muc_site_month ON dinh_muc(site_name, month_period);
CREATE INDEX IF NOT EXISTS idx_dinh_muc_item ON dinh_muc(item_code);
CREATE INDEX IF NOT EXISTS idx_nvl_items_code ON nvl_items(item_code);
CREATE INDEX IF NOT EXISTS idx_nvl_items_region ON nvl_items(region);

-- 7. POS & F&B Analytics
CREATE INDEX IF NOT EXISTS idx_trans_billing_date ON transactions(billing_date);
CREATE INDEX IF NOT EXISTS idx_trans_store_date ON transactions(ma_cua_hang, billing_date);
CREATE INDEX IF NOT EXISTS idx_fnb_summary_month ON fnb_monthly_summary(month_period);
CREATE INDEX IF NOT EXISTS idx_fnb_summary_site_month ON fnb_monthly_summary(site_code, month_period);
CREATE INDEX IF NOT EXISTS idx_fnb_bal_site_item ON fnb_stock_balances(site_code, item_code);
CREATE INDEX IF NOT EXISTS idx_fnb_count_lines_cid ON fnb_stock_count_lines(count_id);
CREATE INDEX IF NOT EXISTS idx_fnb_receipt_lines_rid ON fnb_stock_receipt_lines(receipt_id);
CREATE INDEX IF NOT EXISTS idx_fnb_waste_lines_wid ON fnb_stock_waste_lines(waste_id);

