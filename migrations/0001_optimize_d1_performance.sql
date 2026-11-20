-- ============================================================================
-- MIGRATION: 0001_optimize_d1_performance.sql
-- Mục tiêu:
-- 1. Thêm bảng tổng hợp tháng fnb_monthly_summary (giảm 99.9% read cho Tab Toàn chuỗi & P&L)
-- 2. Thêm bảng tổng hợp ngày fnb_daily_summary (giảm 99% read cho Tab POS)
-- 3. Thêm UNIQUE INDEX trên transactions(orig_id) để hỗ trợ Incremental Sync / Upsert
-- 4. Xóa index thừa idx_trans_so_hoa_don (tiết kiệm 1 write trên mỗi dòng insert)
-- ============================================================================

-- 1. Bảng tổng hợp theo tháng của từng điểm bán
CREATE TABLE IF NOT EXISTS fnb_monthly_summary (
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

CREATE INDEX IF NOT EXISTS idx_fnb_monthly_month ON fnb_monthly_summary(month_period);

-- 2. Bảng tổng hợp theo ngày của từng điểm bán
CREATE TABLE IF NOT EXISTS fnb_daily_summary (
  billing_date TEXT NOT NULL,       -- Định dạng 'YYYY-MM-DD', ví dụ: '2026-11-19'
  site_code TEXT NOT NULL,          -- Mã điểm bán, ví dụ: 'K001'
  site_name TEXT,                   -- Tên điểm bán
  total_bills INTEGER DEFAULT 0,    -- Số hóa đơn trong ngày
  net_revenue REAL DEFAULT 0,       -- Doanh thu thuần trong ngày
  gross_revenue REAL DEFAULT 0,     -- Doanh thu gộp trong ngày
  food_cost REAL DEFAULT 0,         -- Giá vốn trong ngày
  avg_bill REAL DEFAULT 0,          -- Giá trị hóa đơn trung bình
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (billing_date, site_code)
);

CREATE INDEX IF NOT EXISTS idx_fnb_daily_date ON fnb_daily_summary(billing_date);

-- 3. Đánh chỉ mục UNIQUE trên orig_id để phục vụ Upsert / Incremental Sync
CREATE UNIQUE INDEX IF NOT EXISTS idx_trans_orig_id ON transactions(orig_id);

-- 4. Xóa index thừa không dùng trên cột so_hoa_don (chỉ dùng cho hàm COUNT DISTINCT, không dùng cho WHERE)
DROP INDEX IF EXISTS idx_trans_so_hoa_don;
