import sqlite3

conn = sqlite3.connect('backup/d1_local.db')
c = conn.cursor()

# Check FKs
fks_to_check = [
    ("app_users", "role_code", "app_roles", "role_code"),
    ("role_permissions", "role_code", "app_roles", "role_code"),
    ("fnb_stock_balances", "item_id", "fnb_stock_items", "id"),
    ("fnb_stock_count_lines", "count_id", "fnb_stock_counts", "id"),
    ("fnb_stock_receipt_lines", "receipt_id", "fnb_stock_receipts", "id"),
    ("fnb_stock_waste_lines", "waste_id", "fnb_stock_wastes", "id"),
    ("inventory_batches", "branch_id", "branches", "id"),
    ("inventory_batches", "sku", "items", "sku"),
    ("stock_transactions", "branch_id", "branches", "id"),
    ("stock_transfers", "from_branch_id", "branches", "id"),
    ("stock_transfers", "to_branch_id", "branches", "id"),
    ("purchase_order_items", "po_id", "purchase_orders", "id"),
    ("daily_catering_reports", "branch_id", "branches", "id"),
    ("stock_audits", "branch_id", "branches", "id"),
]

violations = []
for child_tbl, child_col, parent_tbl, parent_col in fks_to_check:
    query = f"""
        SELECT count(*) FROM {child_tbl} c
        WHERE c.{child_col} IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM {parent_tbl} p WHERE p.{parent_col} = c.{child_col})
    """
    try:
        c.execute(query)
        cnt = c.fetchone()[0]
        if cnt > 0:
            violations.append((child_tbl, child_col, parent_tbl, parent_col, cnt))
            print(f"VIOLATION: {child_tbl}.{child_col} -> {parent_tbl}.{parent_col}: {cnt} orphaned rows")
        else:
            print(f"OK: {child_tbl}.{child_col} -> {parent_tbl}.{parent_col}")
    except Exception as e:
        print(f"ERROR checking {child_tbl} -> {parent_tbl}: {e}")

if not violations:
    print("ALL FK CHECKS PASSED WITH 0 VIOLATIONS!")
