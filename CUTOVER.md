# KẾ HOẠCH CHUYỂN ĐỔI CHÍNH THỨC (CUTOVER RUNBOOK)
**Dự án**: A.Kitchen-WMS (Cloudflare Workers + Supabase PostgreSQL)  
**Schema mục tiêu**: `wms` trên Supabase Project `alqcojnxshfylheovdgw`  
**Nhánh thực hiện**: `feat/supabase-migration`

---

## 1. TỔNG QUAN KIẾN TRÚC & TRẠNG THÁI HIỆN TẠI

Hệ thống đã được thiết kế và kiểm thử với kiến trúc **Dual-Backend Adapter** (`src/db/index.js`), cho phép chuyển đổi tức thì giữa Cloudflare D1 (SQLite) và Supabase (PostgreSQL) thông qua biến môi trường `DB_BACKEND`:

| Thành phần | Cloudflare D1 (Hiện tại) | Supabase PostgreSQL (Mới) |
| :--- | :--- | :--- |
| **Driver / Kết nối** | D1 Binding (`env.DB`) | PostgreSQL Pooler (`pg` driver + IPv4 direct pooler) |
| **Schema Isolation** | Mặc định SQLite | Schema chuyên biệt `wms` (Cách ly 100% với `public`) |
| **Dung lượng & Dữ liệu** | 43.310 dòng (Đã đồng bộ) | 43.310 dòng (100% Khớp số dư, doanh thu, bills) |
| **Bảng tổng hợp hiệu năng**| Tự tính toán hoặc summary D1 | `fnb_monthly_summary`, `fnb_daily_summary` tự động qua SQL Function |
| **Bảo mật truy cập** | D1 worker-bound | RLS Enabled trên mọi bảng, REVOKE `anon`/`authenticated` |
| **Admin Protection** | Không có khóa | Yêu cầu `X-Admin-Key` hoặc `?admin_key=` |

---

## 2. QUY TRÌNH THỰC HIỆN CHUYỂN ĐỔI (CUTOVER CHECKLIST)

### Bước 1: Thiết lập Bí mật (Secrets) trên Cloudflare Workers
Mở terminal và cấu hình các Secret cần thiết cho Cloudflare Worker (không bao giờ commit vào Git):

```bash
# 1. Cấu hình chuỗi kết nối PostgreSQL Supabase (IPv4 Session Pooler)
npx wrangler secret put DATABASE_URL
# Nhập giá trị:
# postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres

# 2. Cấu hình Admin Key bảo vệ các API quản trị hệ thống
npx wrangler secret put ADMIN_KEY
# Nhập một khóa bí mật tùy chọn của bạn, ví dụ: akitchen_admin_secret_2026

# 3. (Tùy chọn) Chuyển biến DB_BACKEND sang supabase
npx wrangler secret put DB_BACKEND
# Nhập: supabase
```

---

### Bước 2: Đồng bộ dữ liệu bổ sung mới nhất từ D1 sang Supabase (Nếu có phát sinh mới)
Trước khi đổi luồng hoàn toàn, chạy script đồng bộ đối soát để đảm bảo dữ liệu mới nhất trong D1 được đẩy đủ lên Postgres:

```bash
# Nạp dữ liệu đồng bộ (Idempotent ON CONFLICT)
python tools/migrate_d1_to_pg.py --dsn "postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres" --schema wms

# Đối soát kiểm tra độ khớp 100%
python tools/verify_migration.py --dsn "postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres" --schema wms
```

---

### Bước 3: Kích hoạt Chế độ Supabase và Deploy Worker
Trong file `wrangler.toml`, đặt biến môi trường:
```toml
[vars]
DB_BACKEND = "supabase"
```

Tiến hành deploy Worker lên Cloudflare:
```bash
npx wrangler deploy
```

---

### Bước 4: Kiểm tra Sức khỏe Hệ thống (Post-Cutover Smoke Test)
Sau khi deploy, kiểm tra ngay các endpoint chính để xác nhận Worker đang đọc/ghi từ Supabase:

1. **Trạng thái Database & Số dòng**:
   ```bash
   curl -H "X-Admin-Key: <ADMIN_KEY>" https://<your-worker>.workers.dev/api/admin/db-status
   # Phản hồi phải có "backend": "supabase" và thống kê số dòng đầy đủ
   ```

2. **Chức năng Đăng nhập & Ma trận Phân quyền**:
   - Truy cập giao diện Web (`public/index.html`).
   - Đăng nhập bằng tài khoản Quản trị / Điểm bán.
   - Kiểm tra hiển thị danh sách chi nhánh (`/api/branches`) và kho (`/api/init`).

3. **Báo cáo P&L và Xếp hạng Chuỗi**:
   - Mở tab **P&L Chi Tiết** và **Xếp Hạng Chuỗi**.
   - Dữ liệu hiển thị tức thì (< 300ms) nhờ đọc từ bảng tổng hợp `wms.fnb_monthly_summary`.

---

## 3. QUY TRÌNH ROLLBACK KHẨN CẤP (1-CLICK FALLBACK)

Nếu phát hiện bất kỳ sự cố kết nối mạng từ Cloudflare tới Supabase hoặc lỗi nghiệp vụ không mong muốn:

### Cách 1: Qua lệnh Wrangler (Khuyến nghị - Tức thì trong 5 giây)
```bash
npx wrangler secret put DB_BACKEND
# Nhập: d1
```
*Lưu ý: Không cần redeploy code, Worker sẽ tự động chuyển sang đọc/ghi từ Cloudflare D1 ngay lập tức.*

### Cách 2: Qua Cloudflare Dashboard
1. Truy cập Cloudflare Dashboard -> **Workers & Pages** -> Chọn Worker `akitchen-kho-app`.
2. Vào tab **Settings** -> **Variables and Secrets**.
3. Sửa biến `DB_BACKEND` từ `supabase` thành `d1`.
4. Bấm **Deploy** / **Save**.

---

## 4. BẢO TRÌ & CHỐNG TẠM DỪNG (SUPABASE KEEP-ALIVE)

Gói Supabase Free tự động tạm dừng (pause) nếu không có truy vấn trong vòng 7 ngày. Để ngăn chặn điều này:
1. Worker đã được cấu hình **Cloudflare Cron Trigger** trong `wrangler.toml`:
   ```toml
   [triggers]
   crons = ["0 */12 * * *"]
   ```
2. Hàm `scheduled` trong `src/index.js` tự động ping định kỳ `SELECT count(*) FROM sites` mỗi 12 tiếng để giữ Database luôn ở trạng thái Active (Hoạt động liên tục 24/7).

### Sao lưu Dữ liệu Định kỳ (Backup):
Bạn có thể chạy script sao lưu dự phòng schema `wms` bất cứ lúc nào bằng PowerShell:
```powershell
.\tools\backup_pg.ps1
```
File backup sẽ tự động được lưu vào thư mục `backup/pg_dumps/backup_wms_YYYYMMDD_HHMMSS.sql`.
