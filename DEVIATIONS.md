# DEVIATIONS.md — Danh Sách Các Sai Khác Được Cho Phép (Approved Deviations)

Dự án: **A.Kitchen-WMS (Siba Food ERP & Kho Chuỗi F&B)**  
Bản tham chiếu: **TailAdmin Free Tailwind CSS Dashboard Template** (Tailwind v4 + Alpine.js)

Theo nguyên tắc "GIỐNG HOÀN TOÀN" của dự án, mọi thành phần UI/UX (màu, font, cỡ chữ, khoảng cách, bo góc, bóng đổ, viền, icon, hiệu ứng chuyển, hành vi tương tác, dark mode) phải sao chép trung thực 100% từ mã nguồn TailAdmin Free. 

Chỉ có **3 trường hợp duy nhất** được phép có sự sai biệt so với bản gốc TailAdmin Free, được liệt kê và giải trình chi tiết dưới đây:

---

## 1. Ngoại Lệ 1: Font Chữ Dự Phòng (Fallback) Cho Ký Tự Tiếng Việt

| Hạng mục | Bản gốc TailAdmin Free | Bản A.Kitchen-WMS | Lý do kỹ thuật |
| :--- | :--- | :--- | :--- |
| **Font Stack Chính** | `Outfit, sans-serif` | `Outfit, "Be Vietnam Pro", sans-serif` | Font **Outfit** (Google Fonts Variable) chỉ hỗ trợ bộ ký tự Latin và Latin-ext cơ bản. Khi hiển thị tiếng Việt, Outfit thiếu các nguyên âm có dấu mũ kết hợp dấu thanh kép (ví dụ: `Ậ, Ẫ, Ắ, Ằ, Ợ, Ừ, Ự, Ỵ, Ỷ, Ỹ`). |
| **Cơ Chế Fallback** | Không có fallback tiếng Việt | Fallback duy nhất: **Be Vietnam Pro** (weights 300–700) | Giúp hiển thị 100% nội dung tiếng Việt chuẩn xác, không bị lỗi ô vuông tofu hoặc nhảy sang font serif mặc định của hệ điều hành. |
| **Quy định đổi toàn bộ** | N/A | Được điều khiển bằng **1 dòng duy nhất** trong CSS token: `--font-sans: Outfit, "Be Vietnam Pro", sans-serif;` | Khi cần chuyển toàn bộ hệ thống sang Be Vietnam Pro, chỉ cần sửa dòng token này mà không phải sửa từng component. |
| **Hiển thị Số & Tabular Figures** | Số dùng `Outfit` | Số dùng `Outfit` với `tabular-nums` (`font-feature-settings: 'tnum' 1;`) | **Đã loại bỏ hoàn toàn JetBrains Mono** khỏi số liệu, KPI, bảng dữ liệu theo đúng chuẩn TailAdmin Free. |

---

## 2. Ngoại Lệ 2: Nội Dung, Tên Menu & Icon Nghiệp Vụ Đặc Thù Ngành Kho / F&B

| Hạng mục | Bản gốc TailAdmin Free | Bản A.Kitchen-WMS | Lý do nghiệp vụ |
| :--- | :--- | :--- | :--- |
| **Danh mục Menu Sidebar** | Ecommerce, Analytics, Marketing, CRM, Stocks, Calendar, Profile, Form Elements, Tables, Pages... | 20 màn hình nghiệp vụ thực tế của Chuỗi F&B Siba Food & Kho Tổng: `fnb-chain`, `fnb-pl`, `fnb-pos`, `fnb-sites`, `fnb-stock`, `fnb-counts`, `fnb-receipts`, `fnb-waste`, `wh-dashboard`, `wh-stock`, `wh-reorder`, `wh-leadtime`, `wh-posap`, `portal-voucher`, `portal-search`, `portal-order`, `portal-history`, `portal-baocao`, `portal-kiemke`, `tab-404`. | Giữ nguyên 100% logic điều hướng phân hệ, quyền truy cập RBAC và quy trình vận hành chuỗi của khách hàng. |
| **Bộ Icon Navigation & Menu** | SVG inline TailAdmin (Grid, Cart, Table, User, Cal, Chart, Box...) | - **Icon chuẩn có trong TailAdmin**: Dùng 100% mã SVG inline của TailAdmin (Sidebar collapse, Theme toggle sun/moon, Search, Notification, Kbd badge, Caret dropdown, Chevron, Checkmark, Close X).<br>- **Icon nghiệp vụ F&B đặc thù** (Bếp ăn `chef-hat`, Cốc nước `coffee`, Rác thải `trash-2`, Cân đo `scale`, Xe tải `truck`): Tạm thời dùng Lucide Icons nhưng **bắt buộc chuẩn hóa**: `stroke="currentColor"`, `stroke-width="1.5"`, kích thước `size-5` hoặc `size-6` khớp hoàn toàn với quy cách icon của TailAdmin. | TailAdmin Free không có sẵn một số biểu tượng đặc thù ngành ẩm thực / nhà bếp / rác hủy nguyên liệu. |
| **Dữ Liệu & Payload API** | Dữ liệu mock bán hàng Ecommerce (Mỹ / Quốc tế, USD) | Dữ liệu ERP kho thực tế kết nối D1 SQLite: SKU, Tên nguyên vật liệu, Đơn vị tính (Kg, Hộp, Chai, Thùng), Điểm bán K001–K014, Giá trị VND (`₫`). | Bảo toàn kết nối API `/api/dashboard-summary`, `/api/stock`, `/api/fnb-pos`, logic xác thực Google OAuth GIS. |

---

## 3. Ngoại Lệ 3: Màu Trạng Thái Nghiệp Vụ Kho Không Có Sẵn Trong TailAdmin Free

| Mã màu / Nhãn | Phân loại trạng thái | Quy cách hiển thị theo TailAdmin token | Ngữ cảnh sử dụng trong WMS |
| :--- | :--- | :--- | :--- |
| **Chênh Lệch Âm (Thiếu Hụt)** | Thất thoát kiểm kê kho / Hủy món âm | `bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500` (dùng thang `red` của TailAdmin, **không viền**, bo `rounded-lg`) | Kiểm kê thực tế nhỏ hơn sổ sách SAP (`portal-kiemke`, `fnb-counts`). |
| **Chênh Lệch Dương (Thừa)** | Dư kho chưa ghi nhận | `bg-blue-light-50 text-blue-light-600 dark:bg-blue-light-500/15 dark:text-blue-light-400` (dùng thang `sky`/`blue-light` của TailAdmin) | Kiểm kê thực tế lớn hơn sổ sách SAP. |
| **Cảnh Báo ROP / Đặt Hàng Gấp** | Mức tồn chạm đáy an toàn | `bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-orange-400` (dùng thang `amber`/`orange` của TailAdmin) | Mặt hàng dưới Min ROP cần tạo PO nhà cung cấp ngay. |
| **Cận Date ($\le$ 7 Ngày)** | Hàng thực phẩm tươi / gia vị sắp hết hạn | `bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400` (dùng thang `purple` TailAdmin) | Cảnh báo ưu tiên xuất dùng trước (FIFO). |
| **Màu Tiêu Đề Xuất File Excel** | Navy Blue `#1F4E79` | Giữ nguyên theo chuẩn `MIGRATION.md` (Font `Aptos`, Header `#1F4E79`) | Đây là file nhị phân Excel `.xlsx` xuất ra máy người dùng, không thuộc phạm vi rendered DOM của Web giao diện. |

---

## 4. Cam Kết Tuân Thủ

Ngoài 3 ngoại lệ trên, **MỌI THÀNH PHẦN KHÁC** (layout wrapper, padding, margin, border color `gray-200` / `gray-800`, card background `bg-white` / `dark:bg-white/3`, dark body `dark:bg-black`, shadow `theme-xs` $\rightarrow$ `theme-xl`, focus ring `rgba(70,95,255,0.12)`, cỡ chữ title-sm/title-lg/heading-six) **BẮT BUỘC KHỚP 100% VỚI TAILADMIN FREE**. Mọi sai lệch ngoài danh sách này đều bị coi là lỗi và phải được khắc phục triệt để.


---

## 4. Ngoại Lệ 4: Nhận Diện Thương Hiệu A.Kitchen & Tên Gọi Thống Nhất

| Hạng mục | Trạng thái cũ | Bản A.Kitchen WMS chuẩn hóa | Lý do & Quy chuẩn |
| :--- | :--- | :--- | :--- |
| **Bảng màu Thương hiệu Chính** | Xanh dương TailAdmin `#465FFF` | **Xanh Lá `#19723C`** (thang 50–950) | Đo trực tiếp từ Logo chính thức của A.Kitchen. Áp dụng cho nút chính, menu active, link, focus-ring. |
| **Màu Điểm Nhấn (Accent)** | Xanh dương / Vàng cam tùy ý | **Cam `#FF600F`** (thang 50–950) | Đo trực tiếp từ Logo chính thức của A.Kitchen. Chỉ dùng làm điểm nhấn chỉ báo, icon nhỏ, chuỗi biểu đồ thứ hai. |
| **Tài sản Logo** | Icon chef-hat trong khối xanh vuông | **Bộ nhận diện A.Kitchen chính thức** | `logo-horizontal` (Sidebar), `logo-mark` (Header mobile & Preloader), `logo-stacked` (Login modal & Trang 404), đầy đủ bản sáng và bản tối (`-dark`). |
| **Tên Gọi Hiển Thị** | "ORBIT", "Orbit Siba Food" | **"A.Kitchen WMS"** (Tiêu đề tab: "A.Kitchen WMS - Quản lý kho") | Xóa bỏ hoàn toàn "ORBIT" khỏi mọi chuỗi ký tự hiển thị tới người dùng; bảo lưu "Siba Food" ở chân trang hệ thống. Toàn bộ biến, id, khóa `orbit_*` trong localStorage được giữ nguyên vẹn 100%. |
| **Quy chuẩn Font Chữ** | Outfit + Fallback | **Be Vietnam Pro & JetBrains Mono** | Tuân thủ tuyệt đối quy chuẩn User Rules: `Be Vietnam Pro` cho toàn bộ giao diện; `JetBrains Mono` với `font-feature-settings: 'tnum' 1;` cho số liệu bảng biểu. |
