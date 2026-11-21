# -*- coding: utf-8 -*-
"""
tools/profile_sqlite.py
Profiling toàn diện cơ sở dữ liệu SQLite backup/d1_local.db:
- Thống kê chi tiết từng cột: kiểu khai báo, số dòng, null, rỗng, min, max, độ dài
- Kiểm tra tính hợp lệ parse ISO cho các cột ngày/giờ (date/timestamptz)
- Phát hiện cờ boolean (0/1/NULL)
- Phát hiện các giá trị bất thường (anomalies)
- Đề xuất kiểu dữ liệu PostgreSQL chuẩn xác theo quy tắc migration
"""

import sqlite3
import os
import re
import json
from datetime import datetime

DB_PATHS = [
    'kho_gia_vi_cloudflare/backup/d1_local.db',
    'backup/d1_local.db',
    'd:/Query/kho_gia_vi_cloudflare/backup/d1_local.db'
]

def find_db():
    for p in DB_PATHS:
        if os.path.exists(p):
            return p
    raise FileNotFoundError("Không tìm thấy file backup/d1_local.db")

DATE_ISO_REGEX = re.compile(r'^\d{4}-\d{2}-\d{2}$')
DATETIME_ISO_REGEX = re.compile(r'^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$')
MONTH_ISO_REGEX = re.compile(r'^\d{4}-\d{2}$')
VN_DATE_REGEX = re.compile(r'^\d{1,2}/\d{1,2}/\d{4}$')

def analyze_date_format(val_str):
    if not val_str or not isinstance(val_str, str):
        return None
    s = val_str.strip()
    if not s:
        return 'EMPTY'
    if DATE_ISO_REGEX.match(s):
        try:
            datetime.strptime(s, '%Y-%m-%d')
            return 'ISO_DATE'
        except ValueError:
            return 'INVALID_DATE'
    if DATETIME_ISO_REGEX.match(s):
        return 'ISO_DATETIME'
    if MONTH_ISO_REGEX.match(s):
        return 'ISO_MONTH'
    if VN_DATE_REGEX.match(s):
        return 'VN_DATE'
    return 'OTHER'

def profile():
    db_path = find_db()
    print(f"Bắt đầu profiling cơ sở dữ liệu: {db_path}...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;")
    tables = [r[0] for r in cursor.fetchall()]

    profile_results = {}
    type_mapping_proposals = {}

    for tbl in tables:
        cursor.execute(f"SELECT count(*) FROM \"{tbl}\"")
        total_rows = cursor.fetchone()[0]

        cursor.execute(f"PRAGMA table_info(\"{tbl}\")")
        columns = cursor.fetchall()
        # col: cid, name, type, notnull, dflt_value, pk

        # Lấy danh sách khóa chính
        pk_cols = [c[1] for c in columns if c[5] > 0]

        # Lấy indexes
        cursor.execute(f"PRAGMA index_list(\"{tbl}\")")
        idx_list = cursor.fetchall()
        indexes = []
        for idx in idx_list:
            idx_name = idx[1]
            is_unique = bool(idx[2])
            cursor.execute(f"PRAGMA index_info(\"{idx_name}\")")
            idx_cols = [r[2] for r in cursor.fetchall()]
            indexes.append({
                'name': idx_name,
                'unique': is_unique,
                'columns': idx_cols
            })

        tbl_profile = {
            'total_rows': total_rows,
            'primary_key': pk_cols,
            'indexes': indexes,
            'columns': {}
        }

        tbl_mapping = {}

        for col in columns:
            cid, col_name, declared_type, notnull, dflt_value, is_pk = col
            decl_upper = (declared_type or '').strip().upper()

            # Query statistics
            query_stats = f"""
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN "{col_name}" IS NULL THEN 1 ELSE 0 END) as null_count,
                    COUNT(DISTINCT "{col_name}") as distinct_count
                FROM "{tbl}"
            """
            cursor.execute(query_stats)
            s_tot, null_cnt, dist_cnt = cursor.fetchone()
            null_cnt = null_cnt or 0
            null_pct = (null_cnt / total_rows * 100) if total_rows > 0 else 0

            # Lấy min, max, độ dài chuỗi, rỗng
            min_val, max_val, min_len, max_len, empty_cnt = None, None, None, None, 0
            date_stats = {}
            int_values_set = set()
            anomalies = []

            if total_rows > 0:
                try:
                    cursor.execute(f"""
                        SELECT 
                            MIN("{col_name}"), MAX("{col_name}"),
                            MIN(LENGTH(CAST("{col_name}" AS TEXT))),
                            MAX(LENGTH(CAST("{col_name}" AS TEXT))),
                            SUM(CASE WHEN CAST("{col_name}" AS TEXT) = '' THEN 1 ELSE 0 END)
                        FROM "{tbl}" WHERE "{col_name}" IS NOT NULL
                    """)
                    row_stat = cursor.fetchone()
                    if row_stat:
                        min_val, max_val, min_len, max_len, empty_cnt = row_stat
                        empty_cnt = empty_cnt or 0
                except Exception as e:
                    anomalies.append(f"Lỗi tính min/max: {e}")

                # Kiểm tra tập giá trị nguyên (để phát hiện boolean 0/1/NULL)
                try:
                    cursor.execute(f"SELECT DISTINCT \"{col_name}\" FROM \"{tbl}\" WHERE \"{col_name}\" IS NOT NULL LIMIT 10")
                    distinct_samples = [r[0] for r in cursor.fetchall()]
                    int_values_set = set(distinct_samples)
                except:
                    distinct_samples = []

                # Kiểm tra date parse nếu tên cột hoặc kiểu có dấu hiệu ngày giờ
                is_date_col = any(k in col_name.lower() for k in [
                    'date', 'time', 'created', 'updated', 'thoi_gian', 'ngay', 'month', 'period', 'exp', 'mfg'
                ]) or decl_upper in ['DATE', 'DATETIME', 'TIMESTAMP']

                if is_date_col:
                    cursor.execute(f"SELECT \"{col_name}\" FROM \"{tbl}\" WHERE \"{col_name}\" IS NOT NULL AND CAST(\"{col_name}\" AS TEXT) != ''")
                    date_vals = [str(r[0]) for r in cursor.fetchall()]
                    fmt_counts = {}
                    sample_invalids = []
                    for dv in date_vals:
                        fmt = analyze_date_format(dv)
                        fmt_counts[fmt] = fmt_counts.get(fmt, 0) + 1
                        if fmt not in ['ISO_DATE', 'ISO_DATETIME']:
                            if len(sample_invalids) < 5 and dv not in sample_invalids:
                                sample_invalids.append(dv)
                    date_stats = {
                        'total_non_empty': len(date_vals),
                        'format_breakdown': fmt_counts,
                        'sample_anomalies': sample_invalids,
                        'iso_parseable_pct': ((fmt_counts.get('ISO_DATE', 0) + fmt_counts.get('ISO_DATETIME', 0)) / len(date_vals) * 100) if date_vals else 100.0
                    }

            # Đề xuất kiểu dữ liệu PostgreSQL
            proposed_pg_type = 'text'
            conversion_rule = 'default_text'
            notes = []

            # 1. Khóa chính tự tăng (AUTOINCREMENT)
            if is_pk and ('INT' in decl_upper or col_name == 'id'):
                proposed_pg_type = 'bigint GENERATED ALWAYS AS IDENTITY'
                conversion_rule = 'identity_pk'

            # 2. Cờ Boolean (Chỉ chứa 0, 1, hoặc NULL)
            elif (decl_upper in ['INTEGER', 'INT', 'BOOLEAN', 'TINYINT'] or 'is_' in col_name or 'has_' in col_name or col_name in ['status_flag', 'no_opening']) \
                    and int_values_set.issubset({0, 1, '0', '1', 0.0, 1.0}):
                proposed_pg_type = 'boolean'
                conversion_rule = 'int_to_bool'
                if empty_cnt > 0:
                    notes.append(f"Có {empty_cnt} dòng chuỗi rỗng -> ép về NULL hoặc false")

            # 3. Số nguyên khác
            elif 'INT' in decl_upper or (decl_upper == '' and all(isinstance(v, int) for v in distinct_samples if v is not None) and not is_date_col):
                if is_pk:
                    proposed_pg_type = 'bigint GENERATED ALWAYS AS IDENTITY'
                else:
                    proposed_pg_type = 'bigint'
                conversion_rule = 'integer_to_bigint'

            # 4. Tiền tệ / Số lượng (REAL, FLOAT, NUMERIC, DOUBLE)
            elif any(k in decl_upper for k in ['REAL', 'FLOAT', 'NUMERIC', 'DECIMAL', 'DOUBLE']) \
                    or any(k in col_name.lower() for k in ['revenue', 'cost', 'profit', 'qty', 'tien', 'gia', 'price', 'discount', 'budget', 'amount', 'diff_val']):
                proposed_pg_type = 'numeric(18,4)'
                conversion_rule = 'real_to_numeric_18_4'

            # 5. Cột ngày/giờ
            elif date_stats:
                iso_pct = date_stats.get('iso_parseable_pct', 0)
                fmt_breakdown = date_stats.get('format_breakdown', {})
                if iso_pct == 100.0 and 'ISO_DATETIME' in fmt_breakdown:
                    proposed_pg_type = 'timestamptz'
                    conversion_rule = 'text_to_timestamptz'
                elif iso_pct == 100.0 and 'ISO_DATE' in fmt_breakdown and 'ISO_DATETIME' not in fmt_breakdown:
                    proposed_pg_type = 'date'
                    conversion_rule = 'text_to_date'
                elif 'ISO_MONTH' in fmt_breakdown and len(fmt_breakdown) == 1:
                    proposed_pg_type = 'text'
                    conversion_rule = 'keep_month_text_YYYY_MM'
                    notes.append("Lưu định dạng kỳ YYYY-MM (e.g. 2026-11), giữ text để khớp truy vấn")
                else:
                    proposed_pg_type = 'text'
                    conversion_rule = 'keep_text_due_to_mixed_formats'
                    notes.append(f"Không đồng nhất 100% ISO ({iso_pct:.1f}% ISO). Chứa định dạng khác: {date_stats.get('sample_anomalies')}. Cần giữ text hoặc chuẩn hóa lúc migrate.")

            # 6. Chuỗi văn bản thông thường
            else:
                proposed_pg_type = 'text'
                conversion_rule = 'text'

            col_info = {
                'declared_type': declared_type,
                'notnull': bool(notnull),
                'default_value': dflt_value,
                'is_pk': bool(is_pk),
                'null_count': null_cnt,
                'null_pct': round(null_pct, 2),
                'empty_count': empty_cnt,
                'distinct_count': dist_cnt,
                'min_value': str(min_val) if min_val is not None else None,
                'max_value': str(max_val) if max_val is not None else None,
                'min_length': min_len,
                'max_length': max_len,
                'date_stats': date_stats if date_stats else None,
                'proposed_pg_type': proposed_pg_type,
                'conversion_rule': conversion_rule,
                'notes': notes,
                'anomalies': anomalies
            }

            tbl_profile['columns'][col_name] = col_info
            tbl_mapping[col_name] = {
                'declared_sqlite': declared_type,
                'proposed_pg': proposed_pg_type,
                'conversion': conversion_rule,
                'not_null': bool(notnull),
                'notes': '; '.join(notes) if notes else ''
            }

        profile_results[tbl] = tbl_profile
        type_mapping_proposals[tbl] = tbl_mapping

    conn.close()

    # Lưu kết quả JSON phục vụ kiểm tra tự động
    os.makedirs('kho_gia_vi_cloudflare/backup', exist_ok=True)
    with open('kho_gia_vi_cloudflare/backup/sqlite_profiling_report.json', 'w', encoding='utf-8') as f:
        json.dump(profile_results, f, ensure_ascii=False, indent=2)

    with open('kho_gia_vi_cloudflare/backup/type_mapping_proposals.json', 'w', encoding='utf-8') as f:
        json.dump(type_mapping_proposals, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Đã hoàn thành profiling cho {len(tables)} bảng!")
    print("   - Báo cáo chi tiết: kho_gia_vi_cloudflare/backup/sqlite_profiling_report.json")
    print("   - Đề xuất ánh xạ kiểu: kho_gia_vi_cloudflare/backup/type_mapping_proposals.json")
    return profile_results, type_mapping_proposals

if __name__ == '__main__':
    profile()
