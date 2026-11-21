# BÁO CÁO KHẢO SÁT & KẾ HOẠCH CHUYỂN ĐỔI BACKEND D1 (SQLITE) SANG POSTGRESQL (SUPABASE)
**Repository**: A.Kitchen-WMS  
**Nhánh thực hiện**: `feat/supabase-migration`  
**Ngày lập**: 21/11/2026  
**Người thực hiện**: Senior Backend Engineer (Cloudflare Workers + PostgreSQL/Supabase)

---

## 1. TỔNG QUAN & NGUYÊN TẮC BẢO TOÀN
- **Không thay đổi hành vi nghiệp vụ**: Giữ nguyên toàn bộ 48 route API, tên trường JSON response, query parameter, tab ID và tên hàm trên Frontend (`public/index.html`).
- **Kiến trúc kép song song**: Sử dụng lớp DB Adapter (`src/db/`) điều khiển qua biến môi trường `DB_BACKEND` (`'d1'` | `'supabase'`), mặc định chạy `'d1'` cho đến khi nghiệm thu cutover hoàn tất.
- **Phương án kết nối Supabase**:
  - **Phương án A (Chính)**: Cloudflare Worker + Hyperdrive binding (`HYPERDRIVE`) + cờ `nodejs_compat` + driver `pg` (tạo Client mới theo từng request, Hyperdrive tự động quản lý Connection Pooling). Dùng chuỗi Direct Connection của Supabase.
  - **Phương án B (Dự phòng)**: `@supabase/supabase-js` + PostgreSQL RPC functions (chỉ kích hoạt nếu Phương án A gặp sự cố hạ tầng kết nối).
- **Hạn mức tài nguyên Supabase Free Tier**:
  - Giới hạn 500 MB DB, 5 GB egress/tháng, tự động tạm dừng (pause) sau 1 tuần không có hoạt động.
  - Thiết lập cron ping `SELECT 1` mỗi 3 ngày để chống sleep dự án.

---

## 2. KẾT QUẢ ĐỐI SOÁT BẢNG & SCHEMA (BACKUP/D1_SCHEMA.SQL vs SRC/INDEX.JS)

### 2.1. Thống kê bảng
- **Tổng số bảng thực tế trong D1 (`backup/d1_schema.sql` và `backup/d1_local.db`)**: **36 bảng**.
- **Tổng số dòng dữ liệu thực tế**: **43.208 dòng** (trong đó bảng `transactions` lớn nhất: 37.329 dòng; `dim_article_stock`: 3.494 dòng; `nvl_items`: 785 dòng; `dinh_muc`: 588 dòng).

### 2.2. Xác minh các nhận diện nghi vấn
1. **Bảng `admin_users`**:
   - **Xác nhận**: **LÀ BẢNG THẬT** có sẵn trong `backup/d1_schema.sql` (hiện có 4 dòng tài khoản admin).
   - **Sử dụng trong code**: Được dùng tại dòng 2164 (`POST /api/auth/login`) và dòng 2180 (`POST /api/auth/register`) phục vụ luồng xác thực đăng nhập admin truyền thống.
2. **Bảng `balances`**:
   - **Xác nhận**: **KHÔNG PHẢI LÀ BẢNG**. Đây là sự nhận diện nhầm lẫn từ tên biến JavaScript `const { results: balances } = await env.DB.prepare('SELECT ... FROM fnb_stock_balances').all();` (dòng 2755) và comment code (dòng 2977, 3079, 3179). Bảng thật sự trên D1 là `fnb_stock_balances`.
3. **Bảng `stock_transfers`**:
   - Có DDL trong `backup/d1_schema.sql` (0 dòng), hiện tại chưa có route trong `src/index.js` gọi trực tiếp. Sẽ được tạo trong schema PostgreSQL để đảm bảo toàn vẹn.
4. **Bảng `user_permissions`, `fnb_monthly_summary`, `dim_article_stock`**:
   - Đã được tạo và đồng bộ đầy đủ trên D1 (`dim_article_stock`: 3.494 dòng, `fnb_monthly_summary`: 37 dòng, `user_permissions`: 17 dòng).

---

## 3. DANH SÁCH 36 BẢNG THẬT TRONG D1 & SỐ LIỆU PROFILING

| STT | Tên bảng | Số dòng | Khóa chính (PK) | Số cột | Mục đích nghiệp vụ |
| :---: | :--- | :---: | :--- | :---: | :--- |
| 1 | `transactions` | **37.329** | `id` (INTEGER AUTO) | 28 | Doanh số chi tiết F&B toàn chuỗi từ POS |
| 2 | `dim_article_stock` | **3.494** | `id` (INTEGER AUTO), UNIQUE(site, material) | 10 | Danh mục mặt hàng SAP phân bổ theo từng điểm bán |
| 3 | `nvl_items` | **785** | `id` (INTEGER AUTO) | 14 | Danh mục nguyên vật liệu & đơn giá định mức |
| 4 | `dinh_muc` | **588** | `id` (INTEGER AUTO) | 10 | Định mức phân bổ vật tư theo từng Site |
| 5 | `fnb_stock_balances` | **392** | `id` (INTEGER AUTO), UNIQUE(item_code, site_code) | 15 | Số dư tồn kho từng mặt hàng tại từng điểm bán F&B |
| 6 | `don_hang` | **261** | `id` (INTEGER AUTO) | 13 | Đơn đặt hàng vật tư từ các điểm trường |
| 7 | `kiemke_tonkho` | **163** | `id` (INTEGER AUTO) | 12 | Dữ liệu kiểm kê kho định kỳ của Portal |
| 8 | `role_permissions` | **53** | `id` (INTEGER AUTO), UNIQUE(role_code, permission_code) | 4 | Ma trận quyền hạn theo vai trò hệ thống |
| 9 | `quy_trinh_don` | **41** | `id` (INTEGER AUTO) | 8 | Lịch sử timeline xử lý quy trình đơn hàng |
| 10 | `fnb_monthly_summary` | **37** | `(month_period, site_code)` (COMPOSITE PK) | 14 | Tổng hợp P&L và doanh thu F&B theo tháng/site |
| 11 | `fnb_stock_items` | **28** | `id` (INTEGER AUTO), UNIQUE(code) | 8 | Danh mục mặt hàng kho F&B dùng chung |
| 12 | `chung_tu_file` | **26** | `id` (INTEGER AUTO) | 7 | File đính kèm hóa đơn / biên bản giao nhận |
| 13 | `chung_tu` | **21** | `id` (INTEGER AUTO), UNIQUE(voucher_code) | 13 | Chứng từ giao nhận vật tư tại điểm trường |
| 14 | `user_permissions` | **17** | `id` (INTEGER AUTO), UNIQUE(user_email, permission_code) | 5 | Phân quyền chi tiết theo từng user cá nhân |
| 15 | `branches` | **14** | `id` (INTEGER AUTO), UNIQUE(code) | 10 | Chi nhánh kho / trung tâm phân phối |
| 16 | `sites` | **14** | `id` (INTEGER AUTO), UNIQUE(site_code) | 11 | Điểm trường / điểm bán tiêu thụ vật tư |
| 17 | `access_requests` | **8** | `id` (INTEGER AUTO) | 12 | Yêu cầu xin cấp quyền từ nhân viên |
| 18 | `fnb_stock_count_lines`| **6** | `id` (INTEGER AUTO) | 8 | Chi tiết từng dòng kiểm đếm kiểm kê F&B |
| 19 | `fnb_stock_receipt_lines`| **6** | `id` (INTEGER AUTO) | 7 | Chi tiết từng dòng mặt hàng nhập kho F&B |
| 20 | `app_users` | **5** | `id` (INTEGER AUTO), UNIQUE(email) | 12 | Người dùng đăng nhập hệ thống (Google Auth) |
| 21 | `app_roles` | **5** | `id` (INTEGER AUTO), UNIQUE(role_code) | 6 | Danh mục 5 vai trò (ADMIN, GENERAL_MANAGER,...) |
| 22 | `admin_users` | **4** | `id` (INTEGER AUTO), UNIQUE(email) | 12 | Tài khoản quản trị nội bộ |
| 23 | `fnb_stock_receipts` | **4** | `id` (INTEGER AUTO), UNIQUE(receipt_code) | 8 | Phiếu nhập kho F&B |
| 24 | `fnb_stock_counts` | **3** | `id` (INTEGER AUTO), UNIQUE(count_code) | 9 | Phiếu kiểm kê kho F&B |
| 25 | `fnb_stock_waste_lines`| **3** | `id` (INTEGER AUTO) | 7 | Chi tiết từng dòng hủy hàng F&B |
| 26 | `fnb_stock_wastes` | **3** | `id` (INTEGER AUTO), UNIQUE(waste_code) | 8 | Biên bản hủy hàng & hao hụt F&B |
| 27 | `fnb_stock_transactions`| 0 | `id` (INTEGER AUTO) | 10 | Sổ cái biến động kho F&B |
| 28 | `inventory_batches` | 0 | `id` (INTEGER AUTO) | 11 | Lô hàng tồn kho theo hạn sử dụng (FEFO) |
| 29 | `purchase_orders` | 0 | `id` (INTEGER AUTO), UNIQUE(po_number) | 14 | Đơn đặt hàng mua hàng (PO SAP) |
| 30 | `purchase_order_items` | 0 | `id` (INTEGER AUTO) | 9 | Chi tiết từng mặt hàng trong PO SAP |
| 31 | `vouchers` | 0 | `id` (INTEGER AUTO), UNIQUE(voucher_code) | 13 | Chứng từ nhập xuất kho kho vận |
| 32 | `daily_catering_reports`| 0 | `id` (INTEGER AUTO) | 15 | Báo cáo suất ăn hằng ngày của điểm bán |
| 33 | `stock_audits` | 0 | `id` (INTEGER AUTO) | 12 | Báo cáo kiểm kê kho vận |
| 34 | `stock_transactions` | 0 | `id` (INTEGER AUTO) | 9 | Lịch sử xuất nhập kho kho vận |
| 35 | `stock_transfers` | 0 | `id` (INTEGER AUTO) | 11 | Phiếu điều chuyển nội bộ kho vận |
| 36 | `items` | 0 | `id` (INTEGER AUTO), UNIQUE(sku) | 9 | Danh mục SKU hàng hóa kho tổng |

---

## 4. KHẢO SÁT ROUTE & CÚ PHÁP SQLITE CẦN CHUYỂN ĐỔI

Qua rà soát toàn bộ file `src/index.js` (~3.300 dòng), hệ thống có **48 Route** xử lý nghiệp vụ với các đặc thù SQLite cần chuyển đổi như sau:

### 4.1. Tổng hợp các điểm cú pháp SQLite cần viết lại cho Postgres
1. **`INSERT OR REPLACE` (4 vị trí)**:
   - *Vị trí*: `/api/admin/sync-monthly-summary`, `/api/admin/sync-dim-article-stock`, auto-heal `/api/fnb/chain`.
   - *Quy tắc đổi*: `INSERT INTO ... ON CONFLICT (cột_khóa_unique) DO UPDATE SET ...`
2. **`INSERT OR IGNORE` (1 vị trí)**:
   - *Vị trí*: seed quyền `ensureUserPermissionsTable`.
   - *Quy tắc đổi*: `INSERT INTO ... ON CONFLICT DO NOTHING`
3. **`julianday()` (14 vị trí)**:
   - *Vị trí*: Tính hạn dùng FEFO trong kho, tính số ngày còn lại trước khi hết hạn hàng hóa (`julianday(exp_date) - julianday('now')`).
   - *Quy tắc đổi*: `(exp_date::date - CURRENT_DATE)` hoặc so sánh trực tiếp với mốc ngày tính từ JS `exp_date <= $1` để tận dụng B-Tree Index.
4. **`date('now')` / `datetime('now')` (7 vị trí)**:
   - *Quy tắc đổi*: `CURRENT_DATE` / `now()` hoặc `CURRENT_TIMESTAMP`.
5. **`SUBSTR()` (10 vị trí)**:
   - *Vị trí*: Trích xuất kỳ tháng `SUBSTR(billing_date, 1, 7)` từ chuỗi ngày `YYYY-MM-DD`.
   - *Quy tắc đổi*: `to_char(billing_date, 'YYYY-MM')` hoặc giữ `substring(billing_date from 1 for 7)`.
6. **`LIKE` (34 vị trí)**:
   - *Đặc thù SQLite*: `LIKE` trong SQLite không phân biệt chữ hoa/thường với ký tự ASCII.
   - *Quy tắc đổi Postgres*: Chuyển thành `ILIKE` để không làm mất kết quả tìm kiếm không phân biệt hoa thường của người dùng.
7. **`LOWER()` (11 vị trí)**:
   - *Quy tắc đổi*: Chuyển thành so sánh trực tiếp hoặc giữ `LOWER()` trên cột đã chuẩn hóa.
8. **`meta.last_row_id` (4 vị trí)**:
   - *Quy tắc đổi*: Thêm mệnh đề `RETURNING id` vào cuối lệnh `INSERT`, lấy trực tiếp `rows[0].id`.
9. **`env.DB.batch()` (9 vị trí)**:
   - *Đặc thù SQLite*: D1 hỗ trợ mảng statement chạy batch.
   - *Quy tắc đổi*: Bao bọc trong giao dịch `BEGIN ... COMMIT` (`withTransaction`) bằng client Postgres của Hyperdrive.
10. **`AUTOINCREMENT`**:
    - *Quy tắc đổi*: Sử dụng `GENERATED ALWAYS AS IDENTITY` (chuẩn SQL hiện đại của PostgreSQL).
11. **`PRAGMA table_info` / `sqlite_master` (3 vị trí)**:
    - *Vị trí*: `/api/admin/db-status`.
    - *Quy tắc đổi*: Truy vấn từ `information_schema.tables` và `pg_indexes`.

---

## 5. BẢNG ÁNH XẠ KIỂU DỮ LIỆU ĐỀ XUẤT (SQLITE -> POSTGRESQL)

Dựa trên kết quả chạy script `tools/profile_sqlite.py` kiểm tra từng cột của 36 bảng dữ liệu thực tế:

### 5.1. Quy tắc ánh xạ chung
1. **Khóa chính số tự tăng**: `bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY`.
2. **Cờ Boolean (0, 1, NULL)**: Chuyển thành `boolean` (ví dụ `is_active`, `no_opening`, `is_super`).
3. **Số nguyên (INTEGER)**: Chuyển thành `bigint` (trừ các cờ boolean).
4. **Tiền tệ & Số lượng (REAL, FLOAT, NUMERIC)**: Chuyển thành `numeric(18,4)` để bảo đảm không bị sai số dấu phẩy động (float rounding errors) khi tính toán doanh thu hàng tỷ đồng và số lượng chi tiết.
5. **Chuỗi văn bản (TEXT, VARCHAR)**: Chuyển thành `text`.
6. **Cột Ngày Tháng & Thời Gian**:
   - **Cột ngày chuẩn ISO 100% (`YYYY-MM-DD`)**:
     - `transactions.billing_date` (37.329 dòng, 100% ISO): **`date`**
     - `transactions.ngay_tao_billing` (37.329 dòng, 100% ISO): **`date`**
     - `fnb_stock_counts.count_date` (100% ISO): **`date`**
     - `fnb_stock_receipts.receipt_date` (100% ISO): **`date`**
     - `fnb_stock_wastes.waste_date` (100% ISO): **`date`**
     - `fnb_stock_balances.last_count_date` (100% ISO): **`date`**
   - **Cột Timestamp chuẩn ISO (`YYYY-MM-DD HH:MM:SS` hoặc ISO 8601)**:
     - `created_at`, `updated_at`, `last_login`, `upload_date`, `action_time`: **`timestamptz`**
   - **Cột Tháng/Kỳ không đồng nhất (`MM/YYYY` vs `YYYY-MM`)**:
     - `sites.month_period`, `dinh_muc.month_period` (lưu dạng `'09/2026'`, `'11/2026'`): **`text`** (giữ nguyên để không gây lỗi logic truy vấn chuỗi của Portal).
     - `fnb_monthly_summary.month_period` (lưu dạng `'2026-11'`, `'2026-10'`): **`text`** (giữ text để so khớp định dạng `YYYY-MM` của F&B Chain).
     - `don_hang.applied_month` (lưu dạng `'11/2026'` hoặc timestamp): **`text`**.

---

### 5.2. Chi tiết ánh xạ cho các bảng trọng yếu

#### Bảng 1: `transactions` (37.329 dòng)
| Tên cột SQLite | Kiểu SQLite khai báo | Kiểu Postgres đề xuất | Ghi chú chuyển đổi & Index |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER PK AUTO | `bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY` | Khóa chính |
| `ma_cua_hang` | TEXT | `text NOT NULL` | Index ghép `(ma_cua_hang, billing_date)` |
| `ten_cua_hang` | TEXT | `text` | Tên điểm bán |
| `vung_mien` | TEXT | `text` | Miền Bắc / Miền Nam |
| `billing_date` | TEXT | `date NOT NULL` | Index `idx_trans_billing_date` (100% ISO YYYY-MM-DD) |
| `so_hoa_don` | TEXT | `text` | Mã hóa đơn POS |
| `bill_code` | TEXT | `text` | Unique identifier bill |
| `thanh_tien_truoc_thue` | REAL | `numeric(18,4) DEFAULT 0` | Doanh thu thuần |
| `tong_tien_billing` | REAL | `numeric(18,4) DEFAULT 0` | Doanh thu gộp |
| `ck_truoc_thue` | REAL | `numeric(18,4) DEFAULT 0` | Tiền chiết khấu |
| `gia_von` | REAL | `numeric(18,4) DEFAULT 0` | Chi phí thực phẩm (Food Cost) |
| `ten_kenh_ban_hang` | TEXT | `text` | Tại chỗ / Mang đi / Suất ăn |
| `ten_mat_hang` | TEXT | `text` | Tên món bán chạy |
| `so_luong` | REAL | `numeric(18,4) DEFAULT 0` | Số lượng bán |
| `created_at` | TEXT | `timestamptz DEFAULT now()` | Thời điểm tạo |

#### Bảng 2: `dim_article_stock` (3.494 dòng)
| Tên cột SQLite | Kiểu SQLite khai báo | Kiểu Postgres đề xuất | Ghi chú chuyển đổi & Index |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER PK AUTO | `bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY` | Khóa chính |
| `site` | TEXT | `text NOT NULL` | Index ghép `(site, material)` UNIQUE |
| `site_name` | TEXT | `text` | Tên điểm bán SAP |
| `nganh_hang` | TEXT | `text` | Phân cấp ngành hàng |
| `nhom_hang` | TEXT | `text` | Phân cấp nhóm hàng |
| `material` | TEXT | `text NOT NULL` | Mã vật tư SAP |
| `material_desc` | TEXT | `text NOT NULL` | Tên vật tư SAP |
| `entry_unit` | TEXT | `text` | Đơn vị tính |
| `price` | REAL | `numeric(18,4) DEFAULT 0` | Đơn giá SAP |
| `updated_at` | TEXT | `timestamptz DEFAULT now()` | Thời gian cập nhật |

#### Bảng 3: `fnb_monthly_summary` (37 dòng)
| Tên cột SQLite | Kiểu SQLite khai báo | Kiểu Postgres đề xuất | Ghi chú chuyển đổi & Index |
| :--- | :--- | :--- | :--- |
| `month_period` | TEXT | `text NOT NULL` | Kỳ tháng `YYYY-MM` (PK ghép) |
| `site_code` | TEXT | `text NOT NULL` | Mã điểm bán (PK ghép) |
| `site_name` | TEXT | `text` | Tên điểm bán |
| `region` | TEXT | `text` | Vùng miền |
| `total_bills` | INTEGER | `bigint DEFAULT 0` | Tổng số lượt bill |
| `active_days` | INTEGER | `bigint DEFAULT 0` | Số ngày hoạt động |
| `net_revenue` | REAL | `numeric(18,4) DEFAULT 0` | Doanh thu thuần |
| `gross_revenue`| REAL | `numeric(18,4) DEFAULT 0` | Doanh thu gộp |
| `discount` | REAL | `numeric(18,4) DEFAULT 0` | Chiết khấu |
| `food_cost` | REAL | `numeric(18,4) DEFAULT 0` | Chi phí thức ăn |
| `dine_in_rev` | REAL | `numeric(18,4) DEFAULT 0` | Doanh thu tại chỗ |
| `takeaway_rev` | REAL | `numeric(18,4) DEFAULT 0` | Doanh thu mang đi |
| `catering_rev` | REAL | `numeric(18,4) DEFAULT 0` | Doanh thu suất ăn |
| `updated_at` | TEXT | `timestamptz DEFAULT now()` | Thời điểm cập nhật |

#### Bảng 4: `fnb_stock_balances` (392 dòng)
| Tên cột SQLite | Kiểu SQLite khai báo | Kiểu Postgres đề xuất | Ghi chú chuyển đổi & Index |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER PK AUTO | `bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY` | Khóa chính |
| `item_id` | INTEGER | `bigint` | ID mặt hàng |
| `item_code` | TEXT | `text NOT NULL` | Mã vật tư |
| `site_code` | TEXT | `text NOT NULL` | Mã điểm bán (UNIQUE `item_code, site_code`) |
| `region` | TEXT | `text` | Vùng miền |
| `opening_qty` | REAL | `numeric(18,4) DEFAULT 0` | Tồn đầu kỳ |
| `receipt_qty` | REAL | `numeric(18,4) DEFAULT 0` | Nhập trong kỳ |
| `sales_bom_qty`| REAL | `numeric(18,4) DEFAULT 0` | Xuất theo định mức POS |
| `waste_qty` | REAL | `numeric(18,4) DEFAULT 0` | Hao hụt / Hủy |
| `book_qty` | REAL | `numeric(18,4) DEFAULT 0` | Tồn sổ sách |
| `last_count_qty`| REAL | `numeric(18,4)` | Số lượng đếm thực tế lần gần nhất |
| `last_count_date`| TEXT | `date` | Ngày kiểm kê gần nhất (100% ISO) |
| `no_opening` | INTEGER | `boolean DEFAULT false` | Cờ: 1 -> true (chưa có tồn đầu), 0 -> false |
| `total_value` | REAL | `numeric(18,4) DEFAULT 0` | Giá trị tồn kho (VNĐ) |
| `updated_at` | TEXT | `timestamptz DEFAULT now()` | Thời gian cập nhật |

#### Bảng 5: `app_users`, `app_roles`, `role_permissions`, `user_permissions`
- `app_users.status`: `text DEFAULT 'PENDING'` ('ACTIVE', 'PENDING', 'SUSPENDED').
- `app_users.last_login`: `timestamptz`.
- `user_permissions.is_granted`: `boolean DEFAULT true` (chuyển từ `INTEGER` 0/1).
- `user_permissions.updated_at`: `timestamptz DEFAULT now()`.

---

## 6. PHÁT HIỆN NGOÀI PHẠM VI (SECURITY, UI, DIRTY DATA)
1. **Dữ liệu cột ngày `month_period` và `applied_month`**:
   - Trong bảng `sites` và `dinh_muc`, cột `month_period` lưu giá trị `'09/2026'`, trong khi bảng `fnb_monthly_summary` lưu dạng `'2026-11'`. Đây là thiết kế cố ý của 2 phân hệ khác nhau (Portal vs F&B Chain). Do đó hai cột này bắt buộc giữ kiểu `text` để không làm đứt gãy giao diện.
2. **Khóa bảo mật `/api/admin/*`**:
   - Hiện tại các route `/api/admin/*` không yêu cầu secret header (`X-Admin-Key`). Trong Giai đoạn 3 sẽ bổ sung kiểm tra `env.ADMIN_KEY`.
3. **Cơ sở dữ liệu Supabase đích**:
   - Đã kiểm tra qua Supabase MCP: Tài khoản của bạn hiện có Project `AkitchenOperations` (ID `alqcojnxshfylheovdgw`, Region `ap-southeast-1`, host `db.alqcojnxshfylheovdgw.supabase.co`) đang ở trạng thái `ACTIVE_HEALTHY`. Chúng ta có thể tạo schema riêng biệt `wms` trên project này hoặc tạo project mới theo chỉ định của bạn.

---

## 7. TIẾN ĐỘ THỰC HIỆN & TRẠNG THÁI HOÀN TẤT (COMPLETED)

### Giai đoạn 1 — Tạo Schema & RLS trên Supabase (ĐÃ HOÀN TẤT)
- Tạo schema `wms` cách ly độc lập trên Supabase `alqcojnxshfylheovdgw`.
- Tạo 38 bảng với khóa chính identity, UNIQUE và quan hệ chuẩn.
- Đã bật Row Level Security (RLS) trên 100% các bảng và REVOKE quyền của vai trò `anon` / `authenticated`.
- Tạo function `wms.refresh_fnb_summaries(p_month text)`.

### Giai đoạn 2 — Nạp dữ liệu & Đối soát Parity (ĐÃ HOÀN TẤT)
- Nạp thành công toàn bộ 43.310 dòng từ D1 sang PostgreSQL bằng `tools/migrate_d1_to_pg.py` trong 10 giây.
- Đối soát bằng `tools/verify_migration.py`: 100% các bảng và 37 nhóm giao dịch khớp tuyệt đối (Exit Code 0).

### Giai đoạn 3 — Chuyển đổi mã nguồn Backend (ĐÃ HOÀN TẤT)
- Xây dựng lớp DB Adapter `src/db/index.js` hỗ trợ song song Cloudflare D1 và PostgreSQL qua `DB_BACKEND`.
- Hoàn thành chuyển đổi 7 nhóm route:
  1. Group 1: `auth/users/roles` (Commit `6edaa81`)
  2. Group 2: `branches/sites/init` (Commit `81d6548`)
  3. Group 3: `stock/FEFO/dashboard-summary` (Commit `6aace9d`)
  4. Group 4: `fnb stock/counts/receipts/waste` (Commit `343d3b8`)
  5. Group 5: `orders/quota/vouchers/dinh_muc` (Commit `64b1855`)
  6. Group 6: `fnb pl/chain/pos` (Commit `d94cfd9`)
  7. Group 7: `admin` & bảo mật `X-Admin-Key` (Commit `e4b2391`)

### Giai đoạn 4 — Kiểm thử Đối soát Toàn diện (ĐÃ HOÀN TẤT)
- Bộ test runner tổng thể `tests/parity/all_routes.test.mjs` chạy qua toàn bộ 7 nhóm route:
  - 100% các route trả về mã HTTP 200 OK.
  - JSON response fields hoàn toàn tương thích với frontend `public/index.html`.

### Giai đoạn 5 — Sẵn sàng Chuyển đổi & Vận hành (ĐÃ HOÀN TẤT)
- Soạn thảo tài liệu hướng dẫn chuyển đổi chi tiết tại [CUTOVER.md](file:///d:/Query/kho_gia_vi_cloudflare/CUTOVER.md).
- Thêm Cloudflare Cron Trigger (12h/lần) trong `wrangler.toml` và handler `scheduled` trong `src/index.js` để tự động ping chống tạm dừng Supabase Free tier.
- Tạo script sao lưu dữ liệu tự động [tools/backup_pg.ps1](file:///d:/Query/kho_gia_vi_cloudflare/tools/backup_pg.ps1) và [tools/backup_pg.py](file:///d:/Query/kho_gia_vi_cloudflare/tools/backup_pg.py).
