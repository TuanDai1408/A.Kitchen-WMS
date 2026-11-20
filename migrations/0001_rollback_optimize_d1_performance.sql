-- ============================================================================
-- ROLLBACK MIGRATION: 0001_rollback_optimize_d1_performance.sql
-- Hoàn tác các thay đổi từ migration 0001
-- ============================================================================

DROP TABLE IF EXISTS fnb_monthly_summary;
DROP TABLE IF EXISTS fnb_daily_summary;
DROP INDEX IF EXISTS idx_trans_orig_id;
CREATE INDEX IF NOT EXISTS idx_trans_so_hoa_don ON transactions(so_hoa_don);
