PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE branches (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE items (
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
CREATE TABLE inventory_batches (
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
CREATE TABLE stock_transactions (
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
CREATE TABLE stock_transfers (
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
CREATE TABLE purchase_orders (
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
CREATE TABLE purchase_order_items (
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
CREATE TABLE vouchers (
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
CREATE TABLE daily_catering_reports (
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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, reporter_name TEXT, report_data TEXT, images_link TEXT,
  FOREIGN KEY (branch_id) REFERENCES branches(id)
);
CREATE TABLE stock_audits (
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
CREATE TABLE sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_code TEXT,
    name TEXT,
    site_name TEXT,
    postal_code TEXT,
    city TEXT,
    month_period TEXT,
    budget_limit REAL DEFAULT 0,
    region TEXT,
    site_type TEXT
);
CREATE TABLE nvl_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_code TEXT,
    name TEXT NOT NULL,
    type_code TEXT,
    type_name TEXT,
    unit TEXT,
    unit_price REAL DEFAULT 0,
    region TEXT
);
CREATE TABLE dinh_muc (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_name TEXT,
    month_period TEXT,
    item_code TEXT,
    item_name TEXT,
    unit TEXT,
    quota_qty REAL DEFAULT 0
);
CREATE TABLE don_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code TEXT NOT NULL,
    order_date TEXT,
    site_name TEXT,
    ordered_by TEXT,
    applied_month TEXT,
    item_code TEXT,
    item_name TEXT,
    unit TEXT,
    order_qty REAL DEFAULT 0,
    accumulated_qty REAL DEFAULT 0,
    over_quota_note TEXT,
    status TEXT DEFAULT 'Đang xử lý'
);
CREATE TABLE quy_trinh_don (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code TEXT NOT NULL,
    step INTEGER,
    step_name TEXT,
    status TEXT,
    action_time TEXT,
    actor TEXT,
    note TEXT
);
CREATE TABLE chung_tu (
    voucher_code TEXT PRIMARY KEY,
    site_name TEXT,
    invoice_type TEXT,
    invoice_date TEXT,
    receive_date TEXT,
    deliverer_name TEXT,
    receiver_name TEXT,
    supplier_name TEXT,
    note TEXT,
    attachment_link TEXT,
    created_at TEXT,
    created_by TEXT
);
CREATE TABLE chung_tu_file (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    voucher_code TEXT,
    file_name TEXT,
    file_link TEXT,
    file_type TEXT,
    upload_date TEXT
);
CREATE TABLE admin_users (
    email TEXT PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    role TEXT,
    password_raw TEXT,
    password_hash TEXT,
    salt TEXT,
    status TEXT,
    registered_at TEXT,
    approved_by TEXT,
    approved_at TEXT
);
CREATE TABLE kiemke_tonkho (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_code TEXT,
    item_name TEXT,
    item_type TEXT,
    material_type TEXT,
    cost_center TEXT,
    site_code TEXT,
    site_name TEXT,
    full_site_name TEXT,
    warehouse_code TEXT,
    warehouse_name TEXT,
    unit TEXT,
    gl_account TEXT,
    closing_t7 REAL DEFAULT 0,
    closing_t8 REAL DEFAULT 0,
    usage_t8 REAL DEFAULT 0,
    usage_t9 REAL DEFAULT 0,
    closing_t9 REAL DEFAULT 0,
    usage_t10 REAL DEFAULT 0,
    closing_t10 REAL DEFAULT 0,
    usage_t11 REAL DEFAULT 0,
    closing_t11 REAL DEFAULT 0
);
CREATE TABLE fnb_stock_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  item_group TEXT NOT NULL DEFAULT 'NVL', -- NVL, BTP, HANG_BAN, BAO_BI, VTTH
  unit TEXT NOT NULL DEFAULT 'KG',
  unit_price REAL DEFAULT 0,
  min_stock REAL DEFAULT 5,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE fnb_stock_balances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL REFERENCES fnb_stock_items(id),
  item_code TEXT NOT NULL,
  site_code TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT 'Miền Nam',
  opening_qty REAL DEFAULT 0,
  receipt_qty REAL DEFAULT 0,
  sales_bom_qty REAL DEFAULT 0,
  waste_qty REAL DEFAULT 0,
  book_qty REAL NOT NULL DEFAULT 0, -- opening + receipt - sales_bom - waste
  last_count_qty REAL DEFAULT NULL, -- lần đếm gần nhất (hiển thị trong ngoặc)
  last_count_date TEXT DEFAULT NULL,
  no_opening INTEGER DEFAULT 0, -- 1 nếu chưa có tồn đầu kỳ
  total_value REAL DEFAULT 0, -- book_qty * unit_price
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(item_code, site_code)
);
CREATE TABLE fnb_stock_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trans_code TEXT NOT NULL,
  trans_type TEXT NOT NULL, -- RECEIPT, SALES_BOM, WASTE, COUNT_ADJUST, OPENING
  item_code TEXT NOT NULL,
  site_code TEXT NOT NULL,
  qty REAL NOT NULL,
  unit_price REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  note TEXT,
  created_by TEXT DEFAULT 'Hệ thống Orbit',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE fnb_stock_counts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    count_code TEXT NOT NULL UNIQUE,
    site_code TEXT NOT NULL,
    count_date TEXT NOT NULL,
    count_type TEXT DEFAULT 'DAILY', -- 'DAILY' (Hằng ngày nhóm A) hoặc 'PERIODIC' (Toàn bộ)
    total_items INTEGER DEFAULT 0,
    matched_items INTEGER DEFAULT 0,
    diff_items INTEGER DEFAULT 0,
    total_diff_val REAL DEFAULT 0,
    notes TEXT,
    created_by TEXT DEFAULT 'Bếp trưởng',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE fnb_stock_count_lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    count_id INTEGER NOT NULL,
    item_code TEXT NOT NULL,
    book_qty REAL NOT NULL DEFAULT 0,
    count_qty REAL NOT NULL DEFAULT 0,
    diff_qty REAL NOT NULL DEFAULT 0,
    unit_price REAL NOT NULL DEFAULT 0,
    diff_val REAL NOT NULL DEFAULT 0,
    note TEXT,
    FOREIGN KEY(count_id) REFERENCES fnb_stock_counts(id) ON DELETE CASCADE
);
CREATE TABLE fnb_stock_receipts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receipt_code TEXT NOT NULL UNIQUE,
    site_code TEXT NOT NULL,
    receipt_date TEXT NOT NULL,
    supplier TEXT NOT NULL,
    invoice_no TEXT,
    total_amount REAL DEFAULT 0,
    notes TEXT,
    attachment_url TEXT,
    created_by TEXT DEFAULT 'Thủ kho / Bếp trưởng',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE fnb_stock_receipt_lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receipt_id INTEGER NOT NULL,
    item_code TEXT NOT NULL,
    qty REAL NOT NULL DEFAULT 0,
    unit_price REAL NOT NULL DEFAULT 0,
    amount REAL NOT NULL DEFAULT 0,
    note TEXT,
    FOREIGN KEY(receipt_id) REFERENCES fnb_stock_receipts(id) ON DELETE CASCADE
);
CREATE TABLE fnb_stock_wastes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    waste_code TEXT NOT NULL UNIQUE,
    site_code TEXT NOT NULL,
    waste_date TEXT NOT NULL,
    reason TEXT NOT NULL,
    confirmed_by TEXT NOT NULL,
    total_amount REAL DEFAULT 0,
    notes TEXT,
    attachment_url TEXT,
    created_by TEXT DEFAULT 'Bếp trưởng',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE fnb_stock_waste_lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    waste_id INTEGER NOT NULL,
    item_code TEXT NOT NULL,
    qty REAL NOT NULL DEFAULT 0,
    unit_price REAL NOT NULL DEFAULT 0,
    amount REAL NOT NULL DEFAULT 0,
    reason_detail TEXT,
    FOREIGN KEY(waste_id) REFERENCES fnb_stock_wastes(id) ON DELETE CASCADE
);
CREATE TABLE app_roles (
    role_code TEXT PRIMARY KEY,
    role_name TEXT NOT NULL,
    description TEXT,
    badge_color TEXT DEFAULT 'blue',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE role_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_code TEXT NOT NULL,
    feature_code TEXT NOT NULL,
    can_view INTEGER DEFAULT 1,
    can_create INTEGER DEFAULT 0,
    can_edit INTEGER DEFAULT 0,
    can_delete INTEGER DEFAULT 0,
    FOREIGN KEY(role_code) REFERENCES app_roles(role_code) ON DELETE CASCADE
);
CREATE TABLE app_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    google_id TEXT,
    role_code TEXT NOT NULL DEFAULT 'NHAN_VIEN',
    phone TEXT,
    password_hash TEXT,
    salt TEXT,
    auth_provider TEXT DEFAULT 'google',
    status TEXT DEFAULT 'ACTIVE',
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(role_code) REFERENCES app_roles(role_code)
);
CREATE TABLE access_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, user_email TEXT NOT NULL, user_name TEXT, requested_role TEXT NOT NULL, requested_feature TEXT, reason TEXT, status TEXT DEFAULT 'PENDING', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, reviewed_at DATETIME, reviewed_by TEXT);
CREATE TABLE user_permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        feature_code TEXT NOT NULL,
        can_view INTEGER DEFAULT 1,
        can_create INTEGER DEFAULT 0,
        can_edit INTEGER DEFAULT 0,
        can_delete INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_email, feature_code)
      );
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orig_id BIGINT,
  so_chung_tu_billing TEXT,
  nguon TEXT DEFAULT 'SAP',
  ma_cua_hang TEXT NOT NULL,
  ten_cua_hang TEXT NOT NULL,
  vung_mien TEXT,
  loai_cua_hang TEXT,
  ma_kh TEXT,
  ten_kh TEXT,
  ma_sp TEXT,
  ten_sp TEXT,
  dvt TEXT,
  nhom_sp TEXT,
  nganh_hang TEXT,
  so_hoa_don TEXT,
  so_don_hang TEXT,
  kenh_ban_hang TEXT,
  ten_kenh_ban_hang TEXT,
  billing_date TEXT NOT NULL,
  ngay_tao_billing TEXT,
  so_luong REAL DEFAULT 0,
  don_gia_khong_thue REAL DEFAULT 0,
  don_gia_co_thue_ck REAL DEFAULT 0,
  thanh_tien_truoc_thue REAL DEFAULT 0,
  tien_thue REAL DEFAULT 0,
  tong_tien_billing REAL DEFAULT 0,
  ck_truoc_thue REAL DEFAULT 0,
  ck_sau_thue REAL DEFAULT 0,
  gia_von REAL DEFAULT 0,
  phan_tram_thue REAL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE fnb_monthly_summary (
  month_period TEXT NOT NULL,       -- Định dạng 'YYYY-MM', ví dụ: '2026-11'
  site_code TEXT NOT NULL,          -- Mã điểm bán, ví dụ: 'K001'
  site_name TEXT,                   -- Tên điểm bán
  region TEXT,                      -- Vùng miền: 'Miền Nam' / 'Miền Bắc'
  total_bills INTEGER DEFAULT 0,    -- Tổng số hóa đơn
  active_days INTEGER DEFAULT 0,    -- Số ngày hoạt động
  net_revenue REAL DEFAULT 0,       -- Doanh thu thuần trước thuế
  gross_revenue REAL DEFAULT 0,     -- Doanh thu gộp
  discount REAL DEFAULT 0,          -- Chiết khấu
  food_cost REAL DEFAULT 0,         -- Giá vốn hàng bán (Food Cost)
  dine_in_rev REAL DEFAULT 0,       -- Doanh thu ăn tại chỗ
  takeaway_rev REAL DEFAULT 0,      -- Doanh thu mang đi
  catering_rev REAL DEFAULT 0,      -- Doanh thu suất ăn công nghiệp
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (month_period, site_code)
);
CREATE TABLE dim_article_stock (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            site TEXT NOT NULL,
            site_name TEXT,
            nganh_hang TEXT,
            nhom_hang TEXT,
            material TEXT NOT NULL,
            material_desc TEXT NOT NULL,
            entry_unit TEXT,
            price REAL DEFAULT 0,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(site, material)
          );
DELETE FROM sqlite_sequence;
CREATE INDEX idx_sites_name ON sites(site_name);
CREATE INDEX idx_sites_region ON sites(region);
CREATE INDEX idx_nvl_code ON nvl_items(item_code);
CREATE INDEX idx_nvl_region ON nvl_items(region);
CREATE INDEX idx_dm_site_month ON dinh_muc(site_name, month_period);
CREATE INDEX idx_dh_order_code ON don_hang(order_code);
CREATE INDEX idx_dh_site_month ON don_hang(site_name, applied_month);
CREATE INDEX idx_qt_order_code ON quy_trinh_don(order_code);
CREATE INDEX idx_ct_site ON chung_tu(site_name);
CREATE INDEX idx_ctf_code ON chung_tu_file(voucher_code);
CREATE INDEX idx_fnb_stock_bal_site ON fnb_stock_balances(site_code);
CREATE INDEX idx_fnb_stock_bal_item ON fnb_stock_balances(item_code);
CREATE INDEX idx_fnb_stock_bal_region ON fnb_stock_balances(region);
CREATE INDEX idx_fnb_counts_site_date ON fnb_stock_counts(site_code, count_date);
CREATE INDEX idx_fnb_receipts_site_date ON fnb_stock_receipts(site_code, receipt_date);
CREATE INDEX idx_fnb_wastes_site_date ON fnb_stock_wastes(site_code, waste_date);
CREATE INDEX idx_users_email ON app_users(email);
CREATE INDEX idx_users_google ON app_users(google_id);
CREATE INDEX idx_role_perms ON role_permissions(role_code, feature_code);
CREATE INDEX idx_user_perms_email ON user_permissions(user_email);
CREATE INDEX idx_trans_billing_date ON transactions(billing_date);
CREATE INDEX idx_trans_site_date ON transactions(ma_cua_hang, billing_date);
CREATE INDEX idx_trans_so_hoa_don ON transactions(so_hoa_don);
CREATE INDEX idx_trans_ma_sp ON transactions(ma_sp);
CREATE INDEX idx_branches_code ON branches(code);
CREATE INDEX idx_branches_active ON branches(is_active);
CREATE INDEX idx_sites_code ON sites(site_code);
CREATE INDEX idx_inv_batches_branch_sku ON inventory_batches(branch_id, sku);
CREATE INDEX idx_inv_batches_exp ON inventory_batches(exp_date);
CREATE INDEX idx_inv_batches_qty ON inventory_batches(qty);
CREATE INDEX idx_stock_trans_branch_created ON stock_transactions(branch_id, created_at);
CREATE INDEX idx_stock_trans_sku ON stock_transactions(sku);
CREATE INDEX idx_po_branch_status ON purchase_orders(branch_id, status);
CREATE INDEX idx_po_number ON purchase_orders(po_number);
CREATE INDEX idx_po_order_time ON purchase_orders(order_time);
CREATE INDEX idx_poi_po_id ON purchase_order_items(po_id);
CREATE INDEX idx_poi_sku ON purchase_order_items(sku);
CREATE INDEX idx_vouchers_code ON vouchers(voucher_code);
CREATE INDEX idx_vouchers_status ON vouchers(status);
CREATE INDEX idx_catering_branch_date ON daily_catering_reports(branch_id, report_date);
CREATE INDEX idx_stock_audits_branch_period ON stock_audits(branch_id, period_month);
CREATE INDEX idx_app_users_email ON app_users(email);
CREATE INDEX idx_app_users_role ON app_users(role_code);
CREATE INDEX idx_role_perms_role ON role_permissions(role_code);
CREATE INDEX idx_access_req_user_status ON access_requests(user_email, status);
CREATE INDEX idx_don_hang_site_month ON don_hang(site_name, applied_month);
CREATE INDEX idx_don_hang_item ON don_hang(item_code);
CREATE INDEX idx_don_hang_status ON don_hang(status);
CREATE INDEX idx_dinh_muc_site_month ON dinh_muc(site_name, month_period);
CREATE INDEX idx_dinh_muc_item ON dinh_muc(item_code);
CREATE INDEX idx_nvl_items_code ON nvl_items(item_code);
CREATE INDEX idx_nvl_items_region ON nvl_items(region);
CREATE INDEX idx_trans_store_date ON transactions(ma_cua_hang, billing_date);
CREATE INDEX idx_fnb_summary_month ON fnb_monthly_summary(month_period);
CREATE INDEX idx_fnb_summary_site_month ON fnb_monthly_summary(site_code, month_period);
CREATE INDEX idx_fnb_bal_site_item ON fnb_stock_balances(site_code, item_code);
CREATE INDEX idx_fnb_count_lines_cid ON fnb_stock_count_lines(count_id);
CREATE INDEX idx_fnb_receipt_lines_rid ON fnb_stock_receipt_lines(receipt_id);
CREATE INDEX idx_fnb_waste_lines_wid ON fnb_stock_waste_lines(waste_id);
CREATE INDEX idx_dim_art_site ON dim_article_stock(site);
CREATE INDEX idx_dim_art_mat ON dim_article_stock(material);
CREATE INDEX idx_dim_art_site_mat ON dim_article_stock(site, material);
