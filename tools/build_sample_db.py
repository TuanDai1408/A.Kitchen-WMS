"""
Generate a small synthetic SQLite database matching d1_schema.sql for migration script testing.
Does NOT use real production data.
"""

import sqlite3
import os

DB_PATH = "backup/sample_test.db"

if os.path.exists(DB_PATH):
    os.remove(DB_PATH)

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

# Read schema from backup/d1_schema.sql
with open("backup/d1_schema.sql", encoding="utf-8") as f:
    schema_sql = f.read()

c.executescript(schema_sql)

# Insert mock rows
c.execute("INSERT INTO app_roles (role_code, role_name, description) VALUES ('ADMIN', 'Administrator', 'Full access')")
c.execute("INSERT INTO app_roles (role_code, role_name, description) VALUES ('STAFF', 'Staff', 'Staff role')")

c.execute("INSERT INTO app_users (email, full_name, role_code, status) VALUES ('test_admin@akitchen.vn', 'Test Admin', 'ADMIN', 'ACTIVE')")
c.execute("INSERT INTO app_users (email, full_name, role_code, status) VALUES ('test_staff@akitchen.vn', 'Test Staff', 'STAFF', 'ACTIVE')")

c.execute("INSERT INTO branches (id, code, name, address, is_active) VALUES ('b1', 'BR01', 'Branch 1', 'District 1', 1)")
c.execute("INSERT INTO sites (site_code, name, site_name, region, budget_limit) VALUES ('S01', 'Site 01', 'School A', 'Miền Nam', 50000000)")

c.execute("INSERT INTO items (sku, name, category, unit, standard_cost_sap) VALUES ('SKU001', 'Muối tinh', 'Gia vị', 'KG', 12000)")
c.execute("INSERT INTO items (sku, name, category, unit, standard_cost_sap) VALUES ('SKU002', 'Đường cát', 'Gia vị', 'KG', 22000)")

c.execute("INSERT INTO nvl_items (item_code, name, unit, unit_price, region) VALUES ('NVL01', 'Tiêu sọ', 'KG', 150000, 'Miền Nam')")
c.execute("INSERT INTO dinh_muc (site_name, month_period, item_code, item_name, unit, quota_qty) VALUES ('Site 01', '11/2026', 'SKU001', 'Muối tinh', 'KG', 100)")

c.execute("INSERT INTO dim_article_stock (site, site_name, material, material_desc, entry_unit, price) VALUES ('S01', 'Site 01', 'SKU001', 'Muối tinh', 'KG', 12000)")

c.execute("INSERT INTO don_hang (order_code, site_name, item_code, item_name, unit, order_qty, status) VALUES ('ORD-001', 'Site 01', 'SKU001', 'Muối tinh', 'KG', 25, 'Đang xử lý')")

c.execute("INSERT INTO fnb_stock_items (code, name, item_group, unit, unit_price, is_active) VALUES ('FNB01', 'Hạt nêm Knorr', 'NVL', 'KG', 45000, 1)")
c.execute("INSERT INTO fnb_stock_balances (item_id, item_code, site_code, region, opening_qty, receipt_qty, sales_bom_qty, waste_qty, book_qty, no_opening) VALUES (1, 'FNB01', 'S01', 'Miền Nam', 50, 100, 30, 2, 118, 0)")

c.execute("""
    INSERT INTO transactions (
        orig_id, ma_cua_hang, ten_cua_hang, vung_mien, billing_date, so_hoa_don,
        ma_sp, ten_sp, so_luong, thanh_tien_truoc_thue, tong_tien_billing, gia_von, ck_truoc_thue
    ) VALUES (
        999001, 'S01', 'School A', 'Miền Nam', '2026-11-15', 'HD-99901',
        'SKU001', 'Muối tinh', 5, 60000, 60000, 40000, 0
    )
""")
c.execute("""
    INSERT INTO transactions (
        orig_id, ma_cua_hang, ten_cua_hang, vung_mien, billing_date, so_hoa_don,
        ma_sp, ten_sp, so_luong, thanh_tien_truoc_thue, tong_tien_billing, gia_von, ck_truoc_thue
    ) VALUES (
        999002, 'S01', 'School A', 'Miền Nam', '2026-11-16', 'HD-99902',
        'SKU002', 'Đường cát', 2, 44000, 44000, 30000, 0
    )
""")

conn.commit()
conn.close()

print(f"Sample test database successfully generated at {DB_PATH}")
