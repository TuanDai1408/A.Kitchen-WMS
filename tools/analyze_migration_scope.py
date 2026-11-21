# -*- coding: utf-8 -*-
"""
tools/analyze_migration_scope.py
1. Phân tích đối chiếu giữa backup/d1_schema.sql và src/index.js:
   - Bảng nào có trong schema nhưng không có trong code
   - Bảng nào có trong code nhưng thiếu trong schema
   - Xác minh admin_users và balances
2. Phân tích chi tiết từng route trong src/index.js:
   - Liệt kê các bảng chạm tới
   - Đếm số truy vấn DB mỗi request
   - Cú pháp SQLite đặc thù cần đổi (INSERT OR REPLACE/IGNORE, julianday, datetime('now'), SUBSTR, LIKE, LOWER, last_row_id, batch, RANDOM, PRAGMA, sqlite_master)
3. Tổng hợp báo cáo Markdown cho MIGRATION_NOTES.md
"""

import json
import re
import os

with open('kho_gia_vi_cloudflare/backup/type_mapping_proposals.json', 'r', encoding='utf-8') as f:
    mapping_data = json.load(f)

with open('kho_gia_vi_cloudflare/backup/sqlite_profiling_report.json', 'r', encoding='utf-8') as f:
    profile_data = json.load(f)

with open('kho_gia_vi_cloudflare/src/index.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Danh sách bảng thật từ schema/db
real_tables = sorted(list(profile_data.keys()))
print(f"Tổng số bảng thật trong D1/SQLite: {len(real_tables)}")

# 2. Tìm các bảng được sử dụng trong src/index.js
# Regex tìm các bảng trong SQL queries
sql_tables_found = set()
for tbl in real_tables:
    if re.search(r'\b' + tbl + r'\b', code, re.IGNORECASE):
        sql_tables_found.add(tbl)

# Kiểm tra các từ khóa nghi ngờ là bảng
candidate_tables = ['admin_users', 'balances', 'user_permissions', 'fnb_monthly_summary', 'dim_article_stock']
for ct in candidate_tables:
    if ct in code:
        print(f"Candidate table '{ct}' found in code: True")

# Kiểm tra balances:
print("\n--- Kiểm tra balances vs fnb_stock_balances ---")
balances_matches = re.findall(r'[^\w](balances)[^\w]', code)
print(f"Từ 'balances' xuất hiện {len(balances_matches)} lần trong code.")
# Check lines where balances appears:
for idx, line in enumerate(code.split('\n')):
    if 'balances' in line and 'fnb_stock_balances' not in line:
        print(f"Line {idx+1}: {line.strip()[:100]}")

# Kiểm tra admin_users:
print("\n--- Kiểm tra admin_users ---")
for idx, line in enumerate(code.split('\n')):
    if 'admin_users' in line:
        print(f"Line {idx+1}: {line.strip()[:100]}")

# 3. Phân tích các cú pháp SQLite cần đổi trong src/index.js
syntax_patterns = {
    'INSERT OR REPLACE': r'INSERT\s+OR\s+REPLACE',
    'INSERT OR IGNORE': r'INSERT\s+OR\s+IGNORE',
    'julianday': r'\bjulianday\(',
    'date_now / datetime_now': r"(?:date|datetime)\(\s*['\"]now['\"]",
    'SUBSTR': r'\bSUBSTR\(',
    'LIKE (case-insensitive in SQLite)': r'\bLIKE\b',
    'LOWER': r'\bLOWER\(',
    'last_row_id': r'meta\.last_row_id',
    'env.DB.batch': r'env\.DB\.batch\(',
    'AUTOINCREMENT': r'\bAUTOINCREMENT\b',
    'RANDOM / Math.random': r'(?:\bRANDOM\(\)|Math\.random\()',
    'PRAGMA': r'\bPRAGMA\b',
    'sqlite_master': r'\bsqlite_master\b',
    'CURRENT_TIMESTAMP': r'\bCURRENT_TIMESTAMP\b'
}

print("\n--- Thống kê cú pháp SQLite cần đổi trong src/index.js ---")
syntax_counts = {}
for name, pat in syntax_patterns.items():
    matches = re.findall(pat, code, re.IGNORECASE)
    syntax_counts[name] = len(matches)
    print(f"  - {name:<35}: {len(matches):>3} chỗ")

# 4. Phân tích chi tiết từng Route trong src/index.js
route_regex = re.compile(r"if\s*\(\s*(?:pathname\s*===?\s*['\"]([^'\"]+)['\"]|(?:\(\s*pathname\s*===?\s*['\"]([^'\"]+)['\"]|\s*pathname\s*===?\s*['\"]([^'\"]+)['\"]))[^)]*\)\s*\{")
lines = code.split('\n')
routes = []
current_route = None
route_buffer = []

for idx, line in enumerate(lines):
    # Match route start
    m = re.search(r"if\s*\((.*pathname\s*===?\s*['\"](/api/[^'\"]+|/[^'\"]+)['\"].*)\)", line)
    if m:
        if current_route:
            routes.append((current_route, '\n'.join(route_buffer)))
        route_text = m.group(2)
        current_route = (idx + 1, line.strip(), route_text)
        route_buffer = [line]
    elif current_route:
        route_buffer.append(line)

if current_route:
    routes.append((current_route, '\n'.join(route_buffer)))

print(f"\nTìm thấy {len(routes)} route trong src/index.js:")

route_analysis = []
for (line_num, cond, route_path), r_body in routes:
    # Bảng chạm tới
    tables_hit = [t for t in real_tables if re.search(r'\b' + t + r'\b', r_body, re.IGNORECASE)]
    
    # Số truy vấn DB (đếm .prepare() hoặc .all() hoặc .first() hoặc .run())
    db_prepares = len(re.findall(r'env\.DB\.prepare\(', r_body))
    
    # Cú pháp SQLite
    sqlite_features = []
    for s_name, pat in syntax_patterns.items():
        if re.search(pat, r_body, re.IGNORECASE):
            sqlite_features.append(s_name)

    route_analysis.append({
        'line': line_num,
        'path': route_path,
        'condition': cond,
        'db_queries': db_prepares,
        'tables': tables_hit,
        'sqlite_syntax': sqlite_features
    })

print(f"Phân tích hoàn tất cho {len(route_analysis)} route.")
with open('kho_gia_vi_cloudflare/backup/route_analysis.json', 'w', encoding='utf-8') as f:
    json.dump(route_analysis, f, ensure_ascii=False, indent=2)

print("Đã lưu kết quả phân tích route vào kho_gia_vi_cloudflare/backup/route_analysis.json")
