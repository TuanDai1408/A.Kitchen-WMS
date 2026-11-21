import sqlite3

conn = sqlite3.connect('backup/d1_local.db')
c = conn.cursor()
c.execute("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
with open('backup/all_sqlite_tables.txt', 'w', encoding='utf-8') as out:
    for name, sql in c.fetchall():
        out.write(f"=== {name} ===\n{sql}\n\n")

print("Exported all sqlite tables to backup/all_sqlite_tables.txt")
