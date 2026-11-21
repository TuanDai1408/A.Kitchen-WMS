"""
Data Migration Tool: SQLite (Cloudflare D1) -> PostgreSQL (Supabase)
Uses psycopg 3 and COPY for high-performance streaming migration.
"""

import argparse
import io
import os
import re
import sqlite3
import sys
from datetime import datetime, date
from decimal import Decimal
import psycopg

# Dependency-ordered tables
TABLE_ORDER = [
    # Level 1: Standalone lookup & dimension tables
    "app_roles",
    "branches",
    "items",
    "sites",
    "nvl_items",
    "fnb_stock_items",
    "admin_users",
    "chung_tu",
    "chung_tu_file",
    "access_requests",
    "dinh_muc",
    "dim_article_stock",
    "don_hang",
    "quy_trinh_don",
    "vouchers",
    "kiemke_tonkho",
    "transactions",
    "fnb_monthly_summary",
    "user_permissions",
    # Level 2: Dependent tables
    "app_users",
    "role_permissions",
    "fnb_stock_balances",
    "fnb_stock_counts",
    "fnb_stock_count_lines",
    "fnb_stock_receipts",
    "fnb_stock_receipt_lines",
    "fnb_stock_wastes",
    "fnb_stock_waste_lines",
    "fnb_stock_transactions",
    "inventory_batches",
    "stock_transactions",
    "stock_transfers",
    "purchase_orders",
    "purchase_order_items",
    "daily_catering_reports",
    "stock_audits",
]

# Columns to exclude from COPY (e.g. GENERATED ALWAYS columns)
EXCLUDED_COLUMNS = {
    "stock_audits": {"closing_qty"}
}

# Boolean columns
BOOLEAN_COLUMNS = {
    "branches": {"is_active"},
    "items": set(),
    "app_users": set(),
    "role_permissions": {"can_view", "can_create", "can_edit", "can_delete"},
    "user_permissions": {"can_view", "can_create", "can_edit", "can_delete"},
    "fnb_stock_items": {"is_active"},
    "fnb_stock_balances": {"no_opening"}
}

# Date columns (YYYY-MM-DD)
DATE_COLUMNS = {
    "transactions": {"billing_date", "ngay_tao_billing"},
    "fnb_stock_counts": {"count_date"},
    "fnb_stock_receipts": {"receipt_date"},
    "fnb_stock_wastes": {"waste_date"},
    "fnb_stock_balances": {"last_count_date"}
}

# Timestamp columns
TIMESTAMP_COLUMNS = {
    "app_roles": {"created_at"},
    "app_users": {"created_at", "updated_at", "last_login"},
    "user_permissions": {"updated_at"},
    "access_requests": {"created_at", "reviewed_at"},
    "admin_users": {"registered_at", "approved_at"},
    "branches": {"created_at"},
    "items": {"created_at"},
    "dim_article_stock": {"updated_at"},
    "quy_trinh_don": {"action_time"},
    "chung_tu": {"created_at"},
    "chung_tu_file": {"upload_date"},
    "vouchers": {"created_at"},
    "purchase_orders": {"order_time", "received_time", "created_at"},
    "inventory_batches": {"created_at"},
    "stock_transactions": {"created_at"},
    "stock_transfers": {"created_at", "received_at"},
    "stock_audits": {"updated_at"},
    "daily_catering_reports": {"created_at"},
    "fnb_stock_items": {"created_at"},
    "fnb_stock_balances": {"updated_at"},
    "fnb_stock_counts": {"created_at"},
    "fnb_stock_receipts": {"created_at"},
    "fnb_stock_wastes": {"created_at"},
    "fnb_stock_transactions": {"created_at"},
    "transactions": {"created_at"},
    "fnb_monthly_summary": {"updated_at"}
}

# Numeric / Decimal columns
NUMERIC_COLUMNS = {
    "sites": {"budget_limit"},
    "items": {"standard_cost_sap", "old_cost_sap", "daily_usage", "safety_stock", "lead_time_hours"},
    "nvl_items": {"unit_price"},
    "dinh_muc": {"quota_qty"},
    "dim_article_stock": {"price"},
    "don_hang": {"order_qty", "accumulated_qty"},
    "vouchers": {"amount"},
    "purchase_orders": {"lead_time_hours", "sla_target_hours", "total_amount"},
    "purchase_order_items": {"qty", "po_price", "sap_price", "variance_pct"},
    "inventory_batches": {"qty"},
    "stock_transactions": {"qty"},
    "stock_transfers": {"qty"},
    "stock_audits": {"opening_qty", "used_qty"},
    "daily_catering_reports": {"extra_cost"},
    "kiemke_tonkho": {
        "closing_t7", "closing_t8", "usage_t8", "usage_t9", "closing_t9",
        "usage_t10", "closing_t10", "usage_t11", "closing_t11"
    },
    "fnb_stock_items": {"unit_price", "min_stock"},
    "fnb_stock_balances": {
        "opening_qty", "receipt_qty", "sales_bom_qty", "waste_qty",
        "book_qty", "last_count_qty", "total_value"
    },
    "fnb_stock_counts": {"total_diff_val"},
    "fnb_stock_count_lines": {"book_qty", "count_qty", "diff_qty", "unit_price", "diff_val"},
    "fnb_stock_receipts": {"total_amount"},
    "fnb_stock_receipt_lines": {"qty", "unit_price", "amount"},
    "fnb_stock_wastes": {"total_amount"},
    "fnb_stock_waste_lines": {"qty", "unit_price", "amount"},
    "fnb_stock_transactions": {"qty", "unit_price", "total_amount"},
    "transactions": {
        "so_luong", "don_gia_khong_thue", "don_gia_co_thue_ck",
        "thanh_tien_truoc_thue", "tien_thue", "tong_tien_billing",
        "ck_truoc_thue", "ck_sau_thue", "gia_von", "phan_tram_thue"
    },
    "fnb_monthly_summary": {
        "net_revenue", "gross_revenue", "discount", "food_cost",
        "dine_in_rev", "takeaway_rev", "catering_rev"
    }
}


def mask_dsn(dsn: str) -> str:
    """Mask password in connection string for safe logging."""
    return re.sub(r':([^:@]+)@', ':****@', dsn)


def parse_date(val):
    if val is None:
        return None
    val_str = str(val).strip()
    if not val_str or val_str.lower() in ('null', 'none'):
        return None
    try:
        # Expected format YYYY-MM-DD
        if len(val_str) >= 10 and val_str[4] == '-' and val_str[7] == '-':
            return date.fromisoformat(val_str[:10])
        # Sometimes MM/DD/YYYY
        if '/' in val_str:
            parts = val_str.split('/')
            if len(parts) == 3 and len(parts[2]) == 4:
                return date(int(parts[2]), int(parts[0]), int(parts[1]))
    except Exception:
        pass
    return None


def parse_timestamp(val):
    if val is None:
        return None
    val_str = str(val).strip()
    if not val_str or val_str.lower() in ('null', 'none'):
        return None
    try:
        # Standard ISO format YYYY-MM-DD HH:MM:SS
        return datetime.fromisoformat(val_str.replace('Z', '+00:00'))
    except Exception:
        # Fallback to date prefix
        d = parse_date(val_str)
        if d:
            return datetime(d.year, d.month, d.day)
    return None


def parse_numeric(val):
    if val is None:
        return None
    val_str = str(val).strip()
    if not val_str or val_str.lower() in ('null', 'none'):
        return None
    try:
        return Decimal(val_str)
    except Exception:
        try:
            return Decimal(str(float(val)))
        except Exception:
            return None


def parse_boolean(val):
    if val is None:
        return None
    if isinstance(val, bool):
        return val
    val_str = str(val).strip().lower()
    if val_str in ('1', 'true', 't', 'yes', 'y'):
        return True
    if val_str in ('0', 'false', 'f', 'no', 'n'):
        return False
    return None


def convert_row(row, columns, table):
    """Transform row tuple from SQLite to PostgreSQL types."""
    converted = []
    bool_set = BOOLEAN_COLUMNS.get(table, set())
    date_set = DATE_COLUMNS.get(table, set())
    ts_set = TIMESTAMP_COLUMNS.get(table, set())
    num_set = NUMERIC_COLUMNS.get(table, set())

    for col, val in zip(columns, row):
        if val is None:
            converted.append(None)
            continue

        if col in bool_set:
            converted.append(parse_boolean(val))
        elif col in date_set:
            converted.append(parse_date(val))
        elif col in ts_set:
            converted.append(parse_timestamp(val))
        elif col in num_set:
            converted.append(parse_numeric(val))
        else:
            # text / bigint
            if isinstance(val, str) and not val.strip():
                # keep empty string if text column
                converted.append(val)
            else:
                converted.append(val)

    return tuple(converted)


def migrate(sqlite_path: str, dsn: str, schema: str, tables: list = None,
            truncate: bool = False, batch_size: int = 5000):
    safe_dsn = mask_dsn(dsn)
    print(f"Connecting to SQLite: {sqlite_path}")
    print(f"Target Postgres: {safe_dsn} [schema: {schema}]")

    sqlite_conn = sqlite3.connect(sqlite_path)
    sqlite_cur = sqlite_conn.cursor()

    target_tables = tables if tables else TABLE_ORDER

    with psycopg.connect(dsn, autocommit=False) as pg_conn:
        with pg_conn.cursor() as pg_cur:
            # Set search_path
            pg_cur.execute(f"SET search_path TO {schema}, public;")

            # Truncate tables in reverse order if requested
            if truncate:
                print("\n--- Truncating target tables (reverse order) ---")
                for table in reversed(target_tables):
                    try:
                        pg_cur.execute(f"TRUNCATE TABLE {schema}.{table} CASCADE;")
                        print(f"  Truncated {schema}.{table}")
                    except psycopg.errors.UndefinedTable:
                        pg_conn.rollback()
                        print(f"  Table {schema}.{table} does not exist yet, skipping truncate.")
                pg_conn.commit()

            print("\n--- Migrating data table by table ---")
            total_migrated = 0

            for table in target_tables:
                # Check if table exists in SQLite
                sqlite_cur.execute(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table,)
                )
                if not sqlite_cur.fetchone():
                    print(f"  [SKIP] Table {table} not found in SQLite.")
                    continue

                # Get column info from SQLite PRAGMA
                sqlite_cur.execute(f"PRAGMA table_info({table})")
                cols_info = sqlite_cur.fetchall()
                all_cols = [c[1] for c in cols_info]

                # Filter excluded columns (e.g. generated columns)
                excluded = EXCLUDED_COLUMNS.get(table, set())
                active_cols = [c for c in all_cols if c not in excluded]
                cols_str = ", ".join(f'"{c}"' for c in active_cols)

                # Count rows in SQLite
                sqlite_cur.execute(f"SELECT COUNT(*) FROM {table}")
                row_count = sqlite_cur.fetchone()[0]

                if row_count == 0:
                    print(f"  [EMPTY] {table}: 0 rows.")
                    continue

                print(f"  [COPY] {table}: migrating {row_count:,} rows...")
                select_query = f"SELECT {cols_str} FROM {table}"
                sqlite_cur.execute(select_query)

                # PostgreSQL COPY
                copy_query = f"COPY {schema}.{table} ({cols_str}) FROM STDIN"
                migrated_table_rows = 0

                with pg_cur.copy(copy_query) as copy:
                    while True:
                        rows = sqlite_cur.fetchmany(batch_size)
                        if not rows:
                            break
                        for r in rows:
                            converted = convert_row(r, active_cols, table)
                            copy.write_row(converted)
                            migrated_table_rows += 1

                print(f"    -> Done {table}: {migrated_table_rows:,} rows copied.")
                total_migrated += migrated_table_rows

                # Update identity sequence if table has auto-increment 'id'
                if "id" in active_cols:
                    try:
                        seq_sql = f"""
                            DO $seq$
                            DECLARE
                                seq_name text;
                            BEGIN
                                seq_name := pg_get_serial_sequence('{schema}.{table}', 'id');
                                IF seq_name IS NOT NULL THEN
                                    EXECUTE format('SELECT setval(%L, COALESCE((SELECT MAX(id) FROM {schema}.{table}), 1))', seq_name);
                                END IF;
                            END;
                            $seq$;
                        """
                        pg_cur.execute(seq_sql)
                    except Exception as seq_err:
                        print(f"    [WARN sequence] {table}: {seq_err}")

                pg_conn.commit()

            # Refresh summary tables if transactions were migrated
            if "transactions" in target_tables:
                print("\n--- Refreshing summary tables (refresh_fnb_summaries) ---")
                try:
                    pg_cur.execute(f"SELECT {schema}.refresh_fnb_summaries(NULL);")
                    print("  Summaries refreshed successfully.")
                except Exception as e:
                    print(f"  Notice: could not run refresh_fnb_summaries: {e}")

            pg_conn.commit()
            print(f"\n MIGRATION COMPLETED: {total_migrated:,} total rows migrated into {schema}.")


def main():
    parser = argparse.ArgumentParser(description="Migrate SQLite (D1) to PostgreSQL (Supabase)")
    parser.add_argument("--sqlite", default="backup/d1_local.db", help="Path to SQLite db")
    parser.add_argument("--dsn", required=True, help="PostgreSQL connection string")
    parser.add_argument("--schema", default="wms", help="Target schema (default: wms)")
    parser.add_argument("--truncate", action="store_true", help="Truncate tables before COPY")
    parser.add_argument("--tables", nargs="*", help="Specific tables to migrate")
    parser.add_argument("--batch-size", type=int, default=5000, help="Batch size for COPY")
    args = parser.parse_args()

    migrate(
        sqlite_path=args.sqlite,
        dsn=args.dsn,
        schema=args.schema,
        tables=args.tables,
        truncate=args.truncate,
        batch_size=args.batch_size
    )


if __name__ == "__main__":
    main()
