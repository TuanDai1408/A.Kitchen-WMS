import sqlite3
import os

sql_path = 'kho_gia_vi_cloudflare/backup/d1_export.sql'
db_path = 'kho_gia_vi_cloudflare/backup/d1_local.db'

if os.path.exists(db_path):
    os.remove(db_path)

print('Reading SQL export file:', sql_path)
with open(sql_path, 'r', encoding='utf-8') as f:
    sql = f.read()

print('Importing into SQLite database:', db_path)
conn = sqlite3.connect(db_path)
conn.executescript(sql)
conn.commit()

cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;")
tables = [r[0] for r in cursor.fetchall()]
print(f'Imported {len(tables)} tables successfully:')
for t in tables:
    cursor.execute(f'SELECT count(*) FROM "{t}"')
    cnt = cursor.fetchone()[0]
    print(f'  - {t:<30}: {cnt:>6,} rows')

conn.close()
print('Done!')
