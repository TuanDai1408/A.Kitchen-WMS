-- ====================================================================
-- SUPABASE MIGRATION 0002: Indexes
-- Essential indexes actually needed by queries (no low-cardinality bloat)
-- ====================================================================

-- 1. transactions
CREATE INDEX IF NOT EXISTS idx_trans_site_date ON wms.transactions(ma_cua_hang, billing_date);
CREATE INDEX IF NOT EXISTS idx_trans_billing_date ON wms.transactions(billing_date);
CREATE INDEX IF NOT EXISTS idx_trans_invoice ON wms.transactions(so_hoa_don);
CREATE INDEX IF NOT EXISTS idx_trans_product ON wms.transactions(ma_sp);
CREATE INDEX IF NOT EXISTS idx_trans_orig_id ON wms.transactions(orig_id);

-- 2. dim_article_stock
CREATE INDEX IF NOT EXISTS idx_dim_article_stock_site ON wms.dim_article_stock(site);
CREATE INDEX IF NOT EXISTS idx_dim_article_stock_mat ON wms.dim_article_stock(material);

-- 3. inventory_batches
CREATE INDEX IF NOT EXISTS idx_inv_batches_branch_sku_exp ON wms.inventory_batches(branch_id, sku, exp_date);

-- 4. stock_transactions
CREATE INDEX IF NOT EXISTS idx_stock_trans_branch_created ON wms.stock_transactions(branch_id, created_at);

-- 5. fnb_monthly_summary
CREATE INDEX IF NOT EXISTS idx_fnb_monthly_summary_site ON wms.fnb_monthly_summary(site_code, month_period);

-- 6. fnb_daily_summary
CREATE INDEX IF NOT EXISTS idx_fnb_daily_summary_site_date ON wms.fnb_daily_summary(site_code, daily_date);

-- 7. fnb_product_month_summary
CREATE INDEX IF NOT EXISTS idx_fnb_prod_month_site ON wms.fnb_product_month_summary(site_code, month_period);

-- 8. fnb_stock_balances
CREATE INDEX IF NOT EXISTS idx_fnb_balances_site ON wms.fnb_stock_balances(site_code);

-- 9. fnb_stock_transactions
CREATE INDEX IF NOT EXISTS idx_fnb_stock_trans_site_date ON wms.fnb_stock_transactions(site_code, created_at);

-- 10. fnb_stock_counts
CREATE INDEX IF NOT EXISTS idx_fnb_counts_site_date ON wms.fnb_stock_counts(site_code, count_date);

-- 11. fnb_stock_receipts
CREATE INDEX IF NOT EXISTS idx_fnb_receipts_site_date ON wms.fnb_stock_receipts(site_code, receipt_date);

-- 12. fnb_stock_wastes
CREATE INDEX IF NOT EXISTS idx_fnb_wastes_site_date ON wms.fnb_stock_wastes(site_code, waste_date);

-- 13. don_hang
CREATE INDEX IF NOT EXISTS idx_don_hang_order_code ON wms.don_hang(order_code);
CREATE INDEX IF NOT EXISTS idx_don_hang_site_month ON wms.don_hang(site_name, applied_month);

-- 14. dinh_muc
CREATE INDEX IF NOT EXISTS idx_dinh_muc_site_month ON wms.dinh_muc(site_name, month_period);

-- 15. kiemke_tonkho
CREATE INDEX IF NOT EXISTS idx_kiemke_site ON wms.kiemke_tonkho(site_code);

-- 16. app_users
CREATE INDEX IF NOT EXISTS idx_app_users_role ON wms.app_users(role_code);
