import json

with open('kho_gia_vi_cloudflare/backup/sqlite_profiling_report.json', 'r', encoding='utf-8') as f:
    report = json.load(f)

print('=== PHÂN TÍCH CÁC CỘT NGÀY / GIỜ TRÊN CƠ SỞ DỮ LIỆU ===')
for tbl, info in report.items():
    for col, cinfo in info['columns'].items():
        if cinfo.get('date_stats'):
            ds = cinfo['date_stats']
            iso_pct = ds.get('iso_parseable_pct', 0)
            fmts = ds.get('format_breakdown', {})
            anomalies = ds.get('sample_anomalies', [])
            print(f"{tbl}.{col} (Total: {info['total_rows']}, Non-empty: {ds.get('total_non_empty')}, NULL: {cinfo['null_count']}, Empty: {cinfo['empty_count']}):")
            print(f"   - Formats: {fmts}")
            print(f"   - ISO parseable: {iso_pct:.1f}%")
            if anomalies:
                print(f"   - Dị thường / khác biệt: {anomalies}")
            print(f"   - Đề xuất: {cinfo['proposed_pg_type']} ({cinfo['conversion_rule']})")
