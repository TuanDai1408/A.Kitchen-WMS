import sqlite3

def run():
    conn = sqlite3.connect('backup/d1_local.db')
    cur = conn.cursor()

    for tbl in ['nvl_items', 'don_hang', 'kiemke_tonkho']:
        cur.execute(f"SELECT count(*) FROM {tbl} WHERE item_code LIKE '%.0'")
        cnt = cur.fetchone()[0]
        print(f"{tbl} before in SQLite: {cnt}")
        cur.execute(f"UPDATE {tbl} SET item_code = SUBSTR(item_code, 1, LENGTH(item_code) - 2) WHERE item_code LIKE '%.0'")
        print(f"  {tbl} updated {cur.rowcount} rows in SQLite")

    cur.execute("UPDATE kiemke_tonkho SET gl_account = SUBSTR(gl_account, 1, LENGTH(gl_account) - 2) WHERE gl_account LIKE '%.0'")
    print(f"  kiemke_tonkho gl_account updated {cur.rowcount} rows")

    conn.commit()
    conn.close()
    print("Done updating SQLite local DB.")

if __name__ == '__main__':
    run()
