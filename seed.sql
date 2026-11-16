-- ============================================================================
-- AKITCHEN CLOUDFLARE D1 SEED DATA
-- ============================================================================

-- 1. Branches
INSERT OR IGNORE INTO branches (id, code, name, address, phone) VALUES 
('b_k505', 'K505', 'Kho Tổng K505 (Bếp Trung Tâm)', 'KCN Tân Bình, Tân Phú, TP.HCM', '0901234567'),
('b_q1', 'Q1', 'A-Kitchen Quận 1', '128 Hai Bà Trưng, P. Đa Kao, Q.1, TP.HCM', '0902345678'),
('b_q7', 'Q7', 'A-Kitchen Quận 7', '45 Nguyễn Thị Thập, Tân Phú, Q.7, TP.HCM', '0903456789'),
('b_td', 'TD', 'A-Kitchen Thảo Điền', '88 Xuân Thủy, P. Thảo Điền, TP. Thủ Đức', '0904567890');

-- 2. Items (Gia vị, CCDC, Tiêu hao)
INSERT OR IGNORE INTO items (sku, name, category, unit, standard_cost_sap, old_cost_sap, last_cost_date, daily_usage, safety_stock, lead_time_hours) VALUES
('GV-BBQ-01', 'Sốt Ướp BBQ Thượng Hạng', 'Gia vị', 'Can 5L', 250000, 250000, '2026-10-01', 3.0, 5.0, 24.0),
('GV-SWCH-02', 'Tương Ớt Chua Ngọt Cholimex', 'Gia vị', 'Chai 2.1kg', 78000, 78000, '2026-09-15', 5.0, 10.0, 32.0),
('GV-MUSH-09', 'Hạt Nêm Nấm Hương Knorr', 'Gia vị', 'Gói 1kg', 85000, 85000, '2026-08-20', 3.5, 7.0, 24.0),
('GV-PEP-01', 'Tiêu Đen Xay Phú Quốc', 'Gia vị', 'Kg', 220000, 220000, '2026-10-15', 2.5, 5.0, 48.0),
('GV-SUG-05', 'Đường Phèn Biên Hòa', 'Gia vị', 'Bao 10kg', 280000, 280000, '2026-09-01', 1.2, 2.0, 24.0),
('GV-OYST-04', 'Dầu Hào Đậm Đặc Maggi', 'Gia vị', 'Can 5kg', 310000, 310000, '2026-10-01', 4.0, 10.0, 24.0),
('GV-OYST-08', 'Dầu Hào Gấu Trúc Lee Kum Kee', 'Gia vị', 'Thùng 12 chai', 485000, 465000, '2026-11-10', 2.0, 4.0, 48.0),
('GV-FSH-01', 'Nước Mắm Phú Quốc 40N', 'Gia vị', 'Can 5L', 320000, 320000, '2026-10-01', 2.5, 6.0, 24.0),
('VT-GLV-01', 'Găng Tay Thực Phẩm TPE', 'Vật tư tiêu hao', 'Hộp', 35000, 35000, '2026-08-01', 2.0, 5.0, 24.0),
('VT-WRP-02', 'Màng Bọc Thực Phẩm 45cm', 'Vật tư tiêu hao', 'Cuộn', 145000, 145000, '2026-09-10', 0.5, 2.0, 24.0),
('CC-KNF-04', 'Dao Thái Chuyên Dụng Bếp', 'CCDC', 'Cây', 280000, 280000, '2026-07-01', 0.05, 1.0, 72.0);

-- 3. Batches with Dates (FEFO simulation)
INSERT OR IGNORE INTO inventory_batches (id, branch_id, sku, batch_code, mfg_date, exp_date, qty, storage_loc) VALUES
('bat_001', 'b_k505', 'GV-BBQ-01', 'LOT-20261012-A', '2026-10-12', '2026-11-20', 15, 'Kho Lạnh K505'),
('bat_002', 'b_k505', 'GV-SWCH-02', 'LOT-20260905-C', '2026-09-05', '2026-11-22', 28, 'Kho Khô K505'),
('bat_003', 'b_k505', 'GV-MUSH-09', 'LOT-20260810-K', '2026-08-10', '2026-11-28', 40, 'Kho Khô K505'),
('bat_004', 'b_k505', 'GV-PEP-01', 'LOT-20261105-P', '2026-11-05', '2027-05-15', 6.5, 'Kho Khô K505'),
('bat_005', 'b_k505', 'GV-SUG-05', 'LOT-20261020-B', '2026-10-20', '2027-10-20', 3.0, 'Kho Khô K505'),
('bat_006', 'b_k505', 'GV-OYST-04', 'LOT-20261101-M', '2026-11-01', '2027-04-15', 65, 'Kho Khô K505'),
('bat_007', 'b_k505', 'GV-FSH-01', 'LOT-20261102-F', '2026-11-02', '2027-11-02', 80, 'Kho Khô K505');

-- 4. Purchase Orders (Lead time tracking)
INSERT OR IGNORE INTO purchase_orders (id, po_number, branch_id, vendor_name, order_time, received_time, lead_time_hours, sla_target_hours, status, total_amount) VALUES
('po_001', 'PO #82002420', 'b_k505', 'Unilever Food Solutions', '2026-11-14 08:00:00', '2026-11-15 06:30:00', 22.5, 24.0, 'DA_NHAN', 8450000),
('po_002', 'PO #82002418', 'b_k505', 'Cholimex Gia Vị Chi Nhánh HCM', '2026-11-13 09:30:00', '2026-11-14 17:30:00', 32.0, 24.0, 'DA_NHAN', 4180000),
('po_003', 'PO #82002405', 'b_k505', 'Masan Consumer Foodservice', '2026-11-12 14:00:00', '2026-11-13 11:00:00', 21.0, 24.0, 'DA_NHAN', 6200000),
('po_004', 'PO #82002426', 'b_k505', 'Lee Kum Kee VN', '2026-11-15 10:00:00', NULL, NULL, 48.0, 'DANG_GIAO', 4850000);

-- 5. Vouchers
INSERT OR IGNORE INTO vouchers (id, voucher_code, invoice_number, vendor_name, doc_date, amount, status, po_number) VALUES
('vc_001', 'CT-202611-089', 'HD-0098231', 'Unilever Food Solutions', '2026-11-15', 8450000, 'DA_NHAN_DU', 'PO #82002420'),
('vc_002', 'CT-202611-088', 'HD-0045129', 'Cholimex Gia Vị', '2026-11-14', 4180000, 'DA_DOI_CHIEU_SAP', 'PO #82002418');

-- 6. Stock Audits
INSERT OR IGNORE INTO stock_audits (id, branch_id, period_month, sku, opening_qty, used_qty, note) VALUES
('sa_001', 'b_k505', '11/2026', 'GV-BBQ-01', 15.0, 3.0, 'Bếp nướng xuất dùng ca trưa'),
('sa_002', 'b_k505', '11/2026', 'GV-SWCH-02', 28.0, 5.0, 'Bếp chiên xào xuất dùng'),
('sa_003', 'b_k505', '11/2026', 'GV-PEP-01', 9.0, 2.5, 'Ướp thịt hàng ngày');
