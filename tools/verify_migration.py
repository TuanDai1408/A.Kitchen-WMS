"""
Data Verification Tool: Compare SQLite (Cloudflare D1) vs PostgreSQL (Supabase)
Performs strict parity checks across row counts, sums of numerical metrics,
min/max dates, and multi-dimensional aggregations on transactions.
"""

import argparse
import json
import re
import sqlite3
import sys
from decimal import Decimal
import psycopg

TABLES_TO_VERIFY = [
    "access_requests",
    "admin_users",
    "app_roles",
    "app_users",
    "branches",
    "chung_tu",
    "chung_tu_file",
    "daily_catering_reports",
    "dim_article_stock",
    "dinh_muc",
    "don_hang",
    "fnb_monthly_summary",
    "fnb_stock_balances",
    "fnb_stock_count_lines",
    "fnb_stock_counts",
    "fnb_stock_items",
    "fnb_stock_receipt_lines",
    "fnb_stock_receipts",
    "fnb_stock_transactions",
    "fnb_stock_waste_lines",
    "fnb_stock_wastes",
    "inventory_batches",
    "items",
    "kiemke_tonkho",
    "nvl_items",
    "purchase_order_items",
    "purchase_orders",
    "quy_trinh_don",
    "role_permissions",
    "sites",
    "stock_audits",
    "stock_transactions",
    "stock_transfers",
    "transactions",
    "user_permissions",
    "vouchers"
]

NUMERIC_CHECKS = {
    "transactions": ["thanh_tien_truoc_thue", "tong_tien_billing", "gia_von", "ck_truoc_thue", "so_luong"],
    "dim_article_stock": ["price"],
    "fnb_stock_balances": ["book_qty", "opening_qty", "receipt_qty", "sales_bom_qty", "waste_qty", "total_value"],
    "fnb_monthly_summary": ["net_revenue", "gross_revenue", "discount", "food_cost"],
    "dinh_muc": ["quota_qty"],
    "don_hang": ["order_qty", "accumulated_qty"],
    "nvl_items": ["unit_price"],
    "sites": ["budget_limit"],
    "fnb_stock_counts": ["total_diff_val"],
    "fnb_stock_receipts": ["total_amount"],
    "fnb_stock_wastes": ["total_amount"]
}

DATE_CHECKS = {
    "transactions": ["billing_date"],
    "fnb_stock_counts": ["count_date"],
    "fnb_stock_receipts": ["receipt_date"],
    "fnb_stock_wastes": ["waste_date"]
}


def mask_dsn(dsn: str) -> str:
    return re.sub(r':([^:@]+)@', ':****@', dsn)


def are_numbers_close(n1, n2, tolerance=Decimal("0.01")):
    if n1 is None and n2 is None:
        return True
    if n1 is None or n2 is None:
        return False
    d1 = Decimal(str(n1))
    d2 = Decimal(str(n2))
    return abs(d1 - d2) <= tolerance


def verify(sqlite_path: str, dsn: str, schema: str):
    print("=" * 70)
    print("DATA MIGRATION PARITY VERIFICATION")
    print(f"SQLite Source: {sqlite_path}")
    print(f"Postgres Target: {mask_dsn(dsn)} [schema: {schema}]")
    print("=" * 70)

    sqlite_conn = sqlite3.connect(sqlite_path)
    sqlite_cur = sqlite_conn.cursor()

    report = {
        "status": "PASS",
        "timestamp": "",
        "schema": schema,
        "tables_checked": 0,
        "mismatches": [],
        "table_results": {}
    }

    has_mismatch = False

    with psycopg.connect(dsn, autocommit=True) as pg_conn:
        with pg_conn.cursor() as pg_cur:
            for table in TABLES_TO_VERIFY:
                table_result = {"table": table, "status": "PASS", "checks": {}}

                # 1. Row count check
                sqlite_cur.execute(f"SELECT COUNT(*) FROM {table}")
                sqlite_count = sqlite_cur.fetchone()[0]

                pg_cur.execute(f"SELECT COUNT(*) FROM {schema}.{table}")
                pg_count = pg_cur.fetchone()[0]

                if sqlite_count != pg_count:
                    has_mismatch = True
                    table_result["status"] = "FAIL"
                    err = f"Row count mismatch: SQLite={sqlite_count:,}, PG={pg_count:,}"
                    table_result["checks"]["row_count"] = err
                    report["mismatches"].append(f"{table}: {err}")
                    print(f"❌ {table}: {err}")
                else:
                    table_result["checks"]["row_count"] = f"OK ({sqlite_count:,} rows)"

                # 2. Numeric sum checks
                if table in NUMERIC_CHECKS:
                    for col in NUMERIC_CHECKS[table]:
                        sqlite_cur.execute(f"SELECT COALESCE(SUM({col}), 0) FROM {table}")
                        sql_val = sqlite_cur.fetchone()[0]

                        pg_cur.execute(f"SELECT COALESCE(SUM({col}), 0) FROM {schema}.{table}")
                        pg_val = pg_cur.fetchone()[0]

                        if not are_numbers_close(sql_val, pg_val):
                            has_mismatch = True
                            table_result["status"] = "FAIL"
                            err = f"Sum mismatch for {col}: SQLite={sql_val}, PG={pg_val}"
                            table_result["checks"][f"sum_{col}"] = err
                            report["mismatches"].append(f"{table}: {err}")
                            print(f"❌ {table}.{col}: {err}")
                        else:
                            table_result["checks"][f"sum_{col}"] = f"OK (sum={pg_val})"

                # 3. Date MIN/MAX checks
                if table in DATE_CHECKS:
                    for col in DATE_CHECKS[table]:
                        sqlite_cur.execute(f"SELECT MIN({col}), MAX({col}) FROM {table}")
                        s_min, s_max = sqlite_cur.fetchone()

                        pg_cur.execute(f"SELECT MIN({col})::text, MAX({col})::text FROM {schema}.{table}")
                        p_min, p_max = pg_cur.fetchone()

                        if str(s_min or "") != str(p_min or "") or str(s_max or "") != str(p_max or ""):
                            has_mismatch = True
                            table_result["status"] = "FAIL"
                            err = f"Date range mismatch on {col}: SQLite=[{s_min}..{s_max}], PG=[{p_min}..{p_max}]"
                            table_result["checks"][f"date_{col}"] = err
                            report["mismatches"].append(f"{table}: {err}")
                            print(f"❌ {table}.{col}: {err}")
                        else:
                            table_result["checks"][f"date_{col}"] = f"OK [{p_min}..{p_max}]"

                if table_result["status"] == "PASS":
                    print(f"✔ {table:25}: OK ({sqlite_count:,} rows)")

                report["table_results"][table] = table_result
                report["tables_checked"] += 1

            # 4. Detailed multi-dimensional check for transactions
            print("\n--- Detailed Transactions Parity (Month & Site Groups) ---")
            sqlite_trans_query = """
                SELECT
                    SUBSTR(billing_date, 1, 7) AS month_period,
                    ma_cua_hang,
                    COUNT(DISTINCT so_hoa_don) AS bills,
                    ROUND(SUM(thanh_tien_truoc_thue), 2) AS rev,
                    ROUND(SUM(gia_von), 2) AS cost
                FROM transactions
                GROUP BY month_period, ma_cua_hang
                ORDER BY month_period, ma_cua_hang
            """
            sqlite_cur.execute(sqlite_trans_query)
            sqlite_trans_groups = {
                (row[0], row[1]): (row[2], Decimal(str(row[3] or 0)), Decimal(str(row[4] or 0)))
                for row in sqlite_cur.fetchall()
            }

            pg_trans_query = f"""
                SELECT
                    to_char(billing_date, 'YYYY-MM') AS month_period,
                    ma_cua_hang,
                    COUNT(DISTINCT so_hoa_don) AS bills,
                    ROUND(SUM(thanh_tien_truoc_thue)::numeric, 2) AS rev,
                    ROUND(SUM(gia_von)::numeric, 2) AS cost
                FROM {schema}.transactions
                GROUP BY month_period, ma_cua_hang
                ORDER BY month_period, ma_cua_hang
            """
            pg_cur.execute(pg_trans_query)
            pg_trans_groups = {
                (row[0], row[1]): (row[2], Decimal(str(row[3] or 0)), Decimal(str(row[4] or 0)))
                for row in pg_cur.fetchall()
            }

            # Compare groups
            all_keys = set(sqlite_trans_groups.keys()) | set(pg_trans_groups.keys())
            group_mismatches = 0
            for k in sorted(all_keys):
                s_val = sqlite_trans_groups.get(k)
                p_val = pg_trans_groups.get(k)
                if s_val != p_val:
                    group_mismatches += 1
                    has_mismatch = True
                    err = f"Transactions group mismatch for (month={k[0]}, site={k[1]}): SQLite={s_val}, PG={p_val}"
                    report["mismatches"].append(err)
                    print(f"❌ {err}")

            if group_mismatches == 0:
                print(f"✔ Transactions Group Aggregations: 100% MATCH across {len(all_keys)} month/site groups!")

    print("\n" + "=" * 70)
    if has_mismatch:
        report["status"] = "FAIL"
        print(f"VERIFICATION FAILED: {len(report['mismatches'])} mismatches detected!")
        with open("backup/verification_report.json", "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        sys.exit(1)
    else:
        report["status"] = "PASS"
        print("VERIFICATION SUCCESSFUL: 100% PARITY BETWEEN SQLITE AND POSTGRESQL!")
        with open("backup/verification_report.json", "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        sys.exit(0)


def main():
    parser = argparse.ArgumentParser(description="Verify SQLite vs PostgreSQL data parity")
    parser.add_argument("--sqlite", default="backup/d1_local.db", help="Path to SQLite db")
    parser.add_argument("--dsn", required=True, help="PostgreSQL connection string")
    parser.add_argument("--schema", default="wms", help="PostgreSQL schema name (default: wms)")
    args = parser.parse_args()

    verify(sqlite_path=args.sqlite, dsn=args.dsn, schema=args.schema)


if __name__ == "__main__":
    main()
