# A.Kitchen • Hệ Thống Quản Lý Kho & Vận Hành Bếp (Cloudflare Edition)

Dự án được xây dựng và tối ưu hoàn toàn trên nền tảng **Cloudflare Serverless**:
- **Frontend**: Cloudflare Pages / Workers Static Assets (HTML5, Tailwind CSS, Lucide Icons, SheetJS).
- **Backend API**: Cloudflare Workers (JavaScript Edge Runtime).
- **Database**: Cloudflare D1 (Serverless SQLite 5 GB miễn phí, 100.000 requests/ngày, không bao giờ bị ngủ).

---

## Cấu Trúc Thư Mục

```
kho_gia_vi_cloudflare/
├── wrangler.toml         # Cấu hình Cloudflare Worker, Assets & D1 Database binding
├── schema.sql            # Khởi tạo 10 bảng dữ liệu chuẩn hóa
├── seed.sql              # Dữ liệu mẫu ban đầu (K505, Q1, Q7, Thảo Điền, Lô HSD, PO, Chứng từ)
├── package.json          # Quản lý script và dependencies
├── deploy.bat            # Script 1-click deploy lên Cloudflare từ Windows
├── src/
│   └── index.js          # REST API Router với 10 endpoints hoàn chỉnh
└── public/
    └── index.html        # Giao diện Web App hợp nhất (PC & Mobile Simulator)
```

---

## Danh Sách API Endpoints Sẵn Sàng

| Method | Endpoint | Chức năng |
| :---: | :--- | :--- |
| `GET` | `/api/branches` | Danh sách các chi nhánh / bếp điểm |
| `GET` | `/api/stock?branch=K505` | Tồn kho gia vị, tính số ngày còn lại & xếp thứ tự FEFO |
| `POST` | `/api/stock/receipt` | Nhập kho lô gia vị mới |
| `POST` | `/api/stock/issue` | Xuất kho cho bếp theo chuẩn FEFO |
| `GET` | `/api/reorder?branch=K505` | Tính toán ngưỡng ROP & đề xuất đặt hàng tự động |
| `GET` | `/api/leadtime` | Đo lường Lead Time giao hàng & SLA Nhà Cung Cấp |
| `GET` | `/api/po-sap` | Theo dõi biến động Giá S (SAP) và chênh lệch PPV |
| `GET/POST`| `/api/vouchers` | Quản lý & tra cứu chứng từ hóa đơn giao nhận |
| `GET/POST`| `/api/audit` | Bảng kiểm kê kỳ (Tự động tính: Tồn cuối = Tồn đầu - Sử dụng) |
| `POST` | `/api/daily-report` | Gửi báo cáo vận hành suất ăn hàng ngày của ca bếp |

---

## Hướng Dẫn Triển Khai Lên Cloudflare (Chạy 24/7 Miễn Phí)

### Bước 1: Đăng nhập tài khoản Cloudflare
Mở PowerShell tại thư mục này và chạy:
```bash
npx wrangler login
```
*(Trình duyệt sẽ tự động mở lên, bạn chỉ cần bấm nút **Allow / Approve** là xong).*

### Bước 2: Tạo Database D1 trên Cloudflare
```bash
npx wrangler d1 create akitchen_kho_db
```
Sau khi tạo, Cloudflare sẽ hiển thị `database_id` (chuỗi UUID). Bạn dán mã đó vào file `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "akitchen_kho_db"
database_id = "dán-mã-uuid-vào-đây"
```

### Bước 3: Nạp cấu trúc bảng và dữ liệu mẫu lên Cloud
```bash
npx wrangler d1 execute akitchen_kho_db --remote --file=./schema.sql
npx wrangler d1 execute akitchen_kho_db --remote --file=./seed.sql
```

### Bước 4: Deploy toàn bộ hệ thống lên Cloudflare
```bash
npx wrangler deploy
```
Hệ thống sẽ cấp cho bạn một đường link HTTPS trực tiếp dạng:  
👉 `https://akitchen-kho-app.<tên-tài-khoản>.workers.dev`

Từ lúc này, hệ thống sẽ **chạy 24/7 vĩnh viễn trên toàn cầu**, bạn có thể tắt máy tính hoàn toàn mà nhân viên ở các điểm vẫn truy cập và làm việc bình thường!
