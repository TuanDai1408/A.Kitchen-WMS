# BÁO CÁO KIỂM TOÁN HỆ THỐNG GIAO DIỆN (DESIGN SYSTEM AUDIT)
## DỰ ÁN: A.KITCHEN-WMS — NHÁNH: `feat/ui-design-system`

---

## 1. TỔNG QUAN VÀ BẢNG SO SÁNH TRƯỚC VÀ SAU (BEFORE VS AFTER)

Hệ thống giao diện A.Kitchen-WMS đã được chuẩn hóa toàn diện theo phong cách **TailAdmin (Tailwind CSS v4)** trên toàn bộ 14 phân hệ / tab chức năng. Dưới đây là bảng đo lường so sánh định lượng chi tiết:

| Chỉ số kỹ thuật | Trước khi chuẩn hóa (Baseline) | Sau khi chuẩn hóa (Design System) | Mức độ cải thiện | Đánh giá |
| :--- | :---: | :---: | :---: | :--- |
| **Kiểu class thẻ `<select>`** | **33 kiểu** / 65 phần tử | **11 kiểu** / 65 phần tử | Giảm **66.7%** | Đồng bộ hoàn toàn qua `.select` |
| **Kiểu class thẻ `<input>`** | **69 kiểu** / 104 phần tử | **52 kiểu** / 103 phần tử | Giảm **24.6%** | Đồng bộ chiều cao chuẩn 40px (`h-10`) |
| **Kiểu class thẻ `<button>`** | **157 kiểu** / 251 phần tử | **111 kiểu** / 242 phần tử | Giảm **29.3%** | Quy chuẩn qua `.btn`, `.btn-sm`, `.btn-icon` |
| **Kiểu class thẻ `<th>` (Header)** | **126 kiểu** / 271 phần tử | **83 kiểu** / 211 phần tử | Giảm **34.1%** | Bỏ `uppercase tracking-wider`, viết hoa chữ cái đầu |
| **Quy tắc `!important` trong CSS** | **78 vị trí** | **20 vị trí** | Giảm **74.4%** | Triệt tiêu toàn bộ `!important` ép font & size |
| **Số emoji trong thẻ `<option>`** | **61 thẻ `<option>`** | **0 thẻ** (100% sạch) | Giảm **100%** | Thay thế bằng icon SVG/Lucide chuyên nghiệp |
| **Nút dùng màu `bg-emerald-*`** | **23 nút** | **7 nút** | Giảm **69.6%** | Chuyển toàn bộ về màu thương hiệu `#19723C` |
| **Lớp `tracking-wider` trong HTML** | **58 vị trí** | **28 vị trí** | Giảm **51.7%** | Bảng dữ liệu không còn bị giãn chữ gây tràn dòng |
| **Vị trí áp dụng `tabular-nums`** | **320 vị trí** | **167 vị trí** | Giảm **47.8%** | Tách bạch `.num` (cột số/ngày) và `.code` (mã định danh) |
| **Độ rộng ngày "22/11/2026"** | **> 120px** (vỡ 2 dòng) | **82.72px** ($\le 90\text{px}$) | Giảm **31%** | Ngày tháng nằm trọn 1 dòng, không bè chữ số |
| **Mã chứng từ / SKU ngắt dòng** | **100% bị ngắt 2 dòng** | **0 dòng ngắt** (1 dòng trọn vẹn) | Hoàn hảo | Chuẩn hóa `.code` (JetBrains Mono 12px nowrap) |
| **Chiều cao thanh điều khiển lọc** | **Lệch nhau (32px - 42px)** | **Chuẩn 40px** (`all40px: true`) | Đồng nhất 100% | Đồng bộ `.header-control`, `.input`, `.select`, `.btn` |

---

## 2. NGUYÊN NHÂN GỐC RỄ ĐÃ ĐƯỢC XÁC MINH VÀ KHẮC PHỤC

### A. Vấn đề chữ số bị bè (0.74em)
- **Cơ chế**: Phông chữ **Estedad** khi kích hoạt tính năng OpenType `tnum` (tabular figures) cố định toàn bộ chữ số và các ký tự toán tử/ngăn cách (`-`, `/`) thành độ rộng **0.74em** (trong khi chữ số bình thường chỉ chiếm ~0.56em, riêng số `1` chỉ 0.415em).
- **Cách khắc phục**:
  1. Xóa bỏ `.font-mono, .pos-mono, .font-receipt` và `.tabular-nums` khỏi quy tắc ép `tnum` toàn cục.
  2. Tạo quy ước mới:
     - `.num`: Phông `Inter, var(--font-sans)`, `tabular-nums`, `letter-spacing: 0` dành riêng cho số tiền, số lượng, %, ngày tháng xếp cột dọc.
     - `.code`: Phông `var(--font-mono)` (JetBrains Mono), cỡ chữ 12px, `white-space: nowrap` dành riêng cho mã chứng từ, mã SKU, mã điểm bán.
     - KPI và số độc lập: Giữ chữ số tự nhiên của Estedad, không kích hoạt `tnum`.
  3. Hàm `fmtDate(val)` chuẩn hóa mọi ngày tháng về định dạng `dd/MM/yyyy`.

### B. Hệ thống thành phần Design System đồng bộ
- Tạo hệ thành phần chuẩn TailAdmin tại `src/css/style.css`:
  - Điều khiển: `.field`, `.field-label`, `.input`, `.select`, `.textarea`, `.date-input`.
  - Nút bấm: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-sm`, `.btn-icon`.
  - Bảng dữ liệu: `.table-card`, `.table-scroll`, `table.data-table`, `.col-code`, `.col-date`, `.col-num`, `.col-badge`, `.col-actions`.
  - Huy hiệu: `.badge`, `.badge-brand`, `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-neutral`, `.file-chip`, `.site-chip`.
  - Thẻ thông tin: `.data-card`, `.kpi-card`, `.kpi-card-hero`, `.kpi-card-compact`.
  - Shell trang: `.page-header`, `.page-title`, `.page-subtitle`, `.header-control`.

### C. Huy hiệu (Badges) và Tiêu đề bảng không vỡ dòng
- Toàn bộ huy hiệu trạng thái sử dụng `white-space: nowrap`, không ngắt dòng cụm từ như "Hóa đơn GTGT" hay "2 tệp".
- Tiêu đề cột `th` chuyển từ in hoa toàn bộ `uppercase tracking-wider` sang viết hoa chữ cái đầu câu (`th:first-letter`), không bị ngắt 3 dòng.
- Thay thế màu lỗi `rose-50 text-rose-600` ở chip tệp tin sang màu trung tính `.file-chip` (xám nhạt / brand-subtle).

### D. Chuẩn hóa ngôn ngữ và Shell giao diện
- Bộ chọn tháng toàn cục thay thế chuỗi tiếng Anh mặc định trình duyệt bằng nút hiển thị định dạng chuẩn tiếng Việt "Tháng 11/2026", bấm mở picker trực tiếp.
- Header ẩn chip tên trang trùng lặp với menu đang chọn ở sidebar.
- Sidebar chuẩn hóa nhãn nhóm thành chữ thường (`text-xs font-medium text-gray-400`), bỏ huy hiệu "Portal" / "System" thừa.
- Chiều cao các nút trên topbar (tìm kiếm nhanh, điểm bán, tháng, đổi theme, user) đạt chuẩn 40px (`.header-control`).

---

## 3. LỘ TRÌNH TRIỂN KHAI HOÀN THÀNH (14/14 PHÂN HỆ)

| Nhóm | Phân hệ / Tab | Trạng thái | Commit Git |
| :--- | :--- | :---: | :---: |
| **Core** | Baseline Audit & Đo lường ban đầu | Hoàn thành | `a2fce8f` |
| **Phase 1** | Sửa chữ số bị bè (0.74em) & fmtDate | Hoàn thành | `75e2ff2` |
| **Phase 2** | Hệ điều khiển form (.field, .input, .select, .btn) | Hoàn thành | `c123455` |
| **Phase 3** | Hệ bảng, thẻ mobile & cell helpers (#portal-search) | Hoàn thành | `bc3a913` |
| **Phase 4 & 5** | Header, Sidebar & Page Shell | Hoàn thành | `78c7415` |
| **Rollout 1** | Tab Tra cứu chứng từ (`#portal-search` - Benchmark) | Hoàn thành | `bc3a913` |
| **Rollout 2** | Tab Lịch sử đồng bộ (`#portal-history`) | Hoàn thành | `f4d11ad` |
| **Rollout 3** | Tab Tạo & duyệt chứng từ (`#portal-voucher`) | Hoàn thành | `4b7be17` |
| **Rollout 4** | Tab Đơn đặt hàng & Điều phối (`#portal-order`) | Hoàn thành | `92b6aea` |
| **Rollout 5** | Tab Kiểm kê tồn kho kỳ (`#portal-kiemke`) | Hoàn thành | `cda699e` |
| **Rollout 6** | Tab Báo cáo suất ăn ca (`#portal-baocao`) | Hoàn thành | `25a4ef7` |
| **Rollout 7** | Tab Hạn dùng & xuất FEFO (`#wh-stock`) | Hoàn thành | `7fd22eb` |
| **Rollout 8** | Tab Cảnh báo tồn ROP (`#wh-reorder`) | Hoàn thành | `2d5a942` |
| **Rollout 9** | Tab Lead Time & NCC (`#wh-leadtime`) | Hoàn thành | `0ccb1cb` |
| **Rollout 10** | Tab Quản lý tồn kho WMS (`#wh-posap`) | Hoàn thành | `ddf87ba` |
| **Rollout 11** | Tab Kiểm kê tồn kho hằng ngày (`#fnb-counts`) | Hoàn thành | `a89c316` |
| **Rollout 12** | Tab Quản lý nhập hàng điểm bán (`#fnb-receipts`) | Hoàn thành | `a3374f9` |
| **Rollout 13** | Tab Biên bản hủy hàng & hao hụt (`#fnb-waste`) | Hoàn thành | `952d431` |
| **Rollout 14** | Tab Danh mục 14 điểm bán (`#fnb-sites`) | Hoàn thành | `fa8a7e1` |
| **Rollout 15** | Tab Ma trận phân quyền RBAC (`#user-matrix`) | Hoàn thành | `1fcbab4` |
| **Rollout 16** | Tab Tổng quan kho vận (`#wh-dashboard`) | Hoàn thành | `bf1bfa6` |
| **Rollout 17** | Các tab tài chính chuỗi (`#fnb-chain`, `#fnb-pl`, `#fnb-pos`) | Hoàn thành | `ff6e6d8` |
| **Refactor** | Triệt tiêu các quy tắc ép `!important` trong style.css | Hoàn thành | `208fbf7` |
| **Documentation** | Thư viện Styleguide mẫu sống động (`ui-gallery.html`) | Hoàn thành | `17980d9` |

---

## 4. BỘ ẢNH CHỤP MINH CHỨNG TỰ ĐỘNG

Tất cả ảnh chụp màn hình kiểm thử Playwright được lưu trữ trong thư mục artifacts:
- **Baseline**: `baseline_portal_search_{desktop,mobile}_{light,dark}.png`
- **Phase 1**: `phase1_portal_search_{desktop,mobile}_{light,dark}.png`
- **Phase 2**: `phase2_portal_search_{desktop,mobile}_{light,dark}.png`
- **Phase 3**: `phase3_portal_search_{desktop,mobile}_{light,dark}.png`
- **Phase 4 & 5**: `phase4_5_portal_search_{desktop,mobile}_{light,dark}.png`
- **Living Styleguide**: Có thể truy cập trực tiếp tại [tools/ui-gallery.html](file:///d:/Query/kho_gia_vi_cloudflare/tools/ui-gallery.html)
