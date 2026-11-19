# BÁO CÁO KIỂM ĐỊNH ĐỘ TRUNG THỰC GIAO DIỆN (VISUAL FIDELITY QA AUDIT)
## Dự án: A.Kitchen-WMS (Siba Food ERP & Kho Chuỗi F&B)
**Đối tượng kiểm toán:** `public/index.html` trong `D:\Query\kho_gia_vi_cloudflare`  
**Bản chuẩn tham chiếu:** `TailAdmin Free` (Clone từ `https://github.com/TailAdmin/tailadmin-free-tailwind-dashboard-template` tại `D:\Query\_ref-tailadmin`)  
**Môi trường thẩm định:** Node.js `v24.20.0`, npm `11.19.0`, Webpack 5.110.3, Tailwind CSS v4.3.3.

---

## I. TỔNG QUAN THẨM ĐỊNH BẢN THAM CHIẾU (REFERENCE REPO SETUP)

Bản tham chiếu TailAdmin Free đã được clone về thư mục độc lập `D:\Query\_ref-tailadmin` (nằm ngoài repo dự án, không commit). Đã thực hiện `npm install` (627 packages) và build thành công với Webpack 5 (`npm run build`).

- **Thư mục build đầu ra:** `D:\Query\_ref-tailadmin\build`
- **File CSS chuẩn:** `D:\Query\_ref-tailadmin\build\style.css` (223 KB) — biên dịch từ Tailwind v4 thuần `@theme` và `@utility`.
- **Mã nguồn lõi đã đối chiếu trực tiếp:**
  1. `src/css/style.css`: Toàn bộ cấu hình `@theme`, `@utility`, `@custom-variant dark`, CSS biến thể apexcharts, flatpickr, scrollbar 6px.
  2. `src/js/index.js`: Khởi tạo Alpine.js, theme manager (`localStorage.getItem('darkMode')`), đăng ký component ui dropdown, tooltip, popover, flatpickr range.
  3. `src/partials/layout/app-layout/sidebar/*` & `header/*`: Layout sidebar `w-72.5`, thu gọn `xl:w-22.5`, mobile drawer backdrop `bg-gray-900/50 backdrop-blur-xs`, header sticky, input search `group/input-group`, kbd `⌘K`, theme toggler, user dropdown.
  4. `src/partials/main/dashboard/ecommerce/*`: Metric card `ecommerce-metrics.html`, `monthly-sales-chart.html`, `monthly-target.html`, `recent-orders.html`.
  5. `src/partials/main/tables/basic-tables/*`: `table-01.html` đến `table-05.html`.
  6. `src/partials/others/ui-elements/{badges,buttons,alerts}/*`: Chuẩn badge không border, có text-shadow; button variants, button groups.
  7. `src/partials/main/profile/*-modal.html`: Modal backdrop `bg-gray-400/50 backdrop-blur-[32px] dark:bg-black/80`, card `rounded-3xl p-6 sm:p-8 dark:bg-gray-900`.
  8. `src/pages/(full-width-pages)`: `signin.html` và `error-404.html`.

---

## II. BẢNG ÁNH XẠ MÀN HÌNH (WMS ↔ TAILADMIN FREE)

| STT | Màn hình WMS (`public/index.html`) | Dòng bắt đầu | Thành phần TailAdmin đối chiếu | Ghi chú nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Shell toàn cục (Sidebar, Header, Breadcrumb)** | Dòng 265–670 | `app-layout/sidebar/*`, `app-layout/header/*` | Giữ nguyên bộ 20 menu phân hệ và Google GIS login. |
| 2 | **`fnb-chain`** (Tổng quan 14 điểm bán) | Dòng 673 | `ecommerce/ecommerce-metrics.html` + `recent-orders` | KPI thẻ chuỗi, xếp hạng doanh thu điểm bán. |
| 3 | **`fnb-pl`** (Báo cáo P&L & Lợi nhuận) | Dòng 835 | `ecommerce/monthly-sales-chart.html` + `table-02` | Biểu đồ doanh thu/chi phí và bảng chi tiết P&L. |
| 4 | **`fnb-pos`** (Dữ liệu bán lẻ POS) | Dòng 1137 | `forms/form-elements` + `tables/table-01` | Lọc ca làm việc, bảng giao dịch bán lẻ. |
| 5 | **`fnb-sites`** (Quản lý 14 cơ sở) | Dòng 1232 | `tables/table-03` (Action buttons & filter) | Danh mục nhà bếp, điểm bán, nhân sự. |
| 6 | **`fnb-stock`** (Tồn kho bếp & điểm bán) | Dòng 1279 | `ecommerce-metrics` + `tables/table-01` | 4 KPI tồn kho điểm bán, bảng chi tiết tồn. |
| 7 | **`fnb-counts`** (Phiếu kiểm kê bếp) | Dòng 1429 | `forms/default-inputs` + `tables/table-01` | Form nhập số kiểm kê mù/mở, bảng lệch. |
| 8 | **`fnb-receipts`** (Nhập hàng NCC / Hub) | Dòng 1568 | `forms/form-elements` + `tables/table-01` | Lập phiếu nhận hàng từ kho tổng / nhà cung cấp. |
| 9 | **`fnb-waste`** (Hủy & Hao hụt nguyên liệu) | Dòng 1637 | `forms/form-elements` + `tables/table-01` | Biên bản hủy hàng hư hỏng, quá hạn. |
| 10 | **`wh-dashboard`** (Tổng quan kho tổng) | Dòng 1706 | `ecommerce/*` (5 KPI + 3 Charts + Recent table) | 5 KPI SAP, Monthly Inbound/Outbound, Safety Gauge. |
| 11 | **`wh-stock`** (Tra cứu & Định mức kho tổng) | Dòng 2009 | `tables/table-01` + `profile/modal` | Bảng tồn kho chính, phân trang, lọc, bulk select. |
| 12 | **`wh-reorder`** (Gợi ý đặt hàng ROP) | Dòng 2138 | `tables/table-04` | Danh sách mặt hàng chạm ngưỡng đặt hàng. |
| 13 | **`wh-leadtime`** (Thời gian giao hàng NCC) | Dòng 2177 | `tables/table-01` | Theo dõi lead time thực tế so với cam kết. |
| 14 | **`wh-posap`** (Đồng bộ đơn hàng SAP) | Dòng 2210 | `tables/table-02` | Kiểm tra trạng thái đồng bộ hóa PO từ SAP ERP. |
| 15 | **`portal-voucher`** (Quản lý phiếu kho) | Dòng 2243 | `ecommerce-metrics` + `tables/table-01` | Thống kê số lượng phiếu Nhập - Xuất - Chuyển. |
| 16 | **`portal-search`** (Tra cứu lịch sử vật tư) | Dòng 2350 | `forms/form-elements` + `tables/table-01` | Lọc đa chiều theo mã lô, hạn dùng, chứng từ. |
| 17 | **`portal-order`** (Tạo yêu cầu cấp phát) | Dòng 2403 | `forms/form-elements` + `forms/select-inputs` | Form đặt nguyên liệu cho bếp cơ sở. |
| 18 | **`portal-history`** (Lịch sử giao dịch kho) | Dòng 2503 | `tables/table-01` | Timeline nhập xuất kho thời gian thực. |
| 19 | **`portal-baocao`** (Báo cáo tổng hợp xuất nhập tồn) | Dòng 2551 | `ecommerce/statistics-chart` + `tables/table-03` | Biểu đồ diện tích và bảng số liệu XNT. |
| 20 | **`portal-kiemke`** (Kiểm kê định kỳ kho tổng) | Dòng 2836 | `ecommerce/monthly-target` + `tables/table-01` | So sánh thực tế vs sổ sách SAP, biểu đồ lệch. |
| 21 | **`tab-404`** (Màn hình không tìm thấy) | Dòng 3273 | `pages/error-404.html` | Trang 404 TailAdmin với hình ảnh minh họa SVG. |
| 22 | **`googleAuthModal`** (Modal đăng nhập Google) | Dòng 3580 | `pages/signin.html` (`others/auth/sign-in`) | Khung đăng nhập Google One-Tap & GIS. |
| 23 | **`modalEditItem`** (Modal sửa định mức tồn) | Dòng 4073 | `profile/edit-personal-info-modal.html` | Form popup sửa Min/Max/Lead time. |

---

## III. BẢNG KIỂM TRA CHECKLIST 9 NHÓM COMPONENT (GIỐNG / LỆCH / THIẾU)

| Nhóm Component | Trạng thái | Vị trí (`public/index.html`) | Chi tiết hiện trạng so với TailAdmin Free | Hành động khắc phục ở các giai đoạn sau |
| :--- | :---: | :--- | :--- | :--- |
| **1. Shell: Sidebar** | ⚠️ **Lệch** | Dòng 278–560 | - Kích thước đã chuẩn `w-72.5`, nền `dark:bg-black`.<br>- **Lệch**: z-index đang dùng `z-50` thay vì chuẩn TailAdmin `z-9999`.<br>- **Lệch**: Mobile backdrop dùng `bg-black/60` thay vì `bg-gray-900/50 backdrop-blur-xs` với `z-99`.<br>- **Thiếu**: Skip-link `sr-only` cho accessibility (`<a class="sr-only" href="#main-content">skip to main content</a>`).<br>- **Lệch**: Các mục menu đang có inline styles và class hard-code `#465fff`, `#ecf3ff`. | Chuẩn hóa toàn bộ class sidebar về `@utility menu-item`, `menu-item-active/inactive`, áp đúng z-index `z-9999` và thêm skip-link. |
| **1. Shell: Header** | ⚠️ **Lệch** | Dòng 565–664 | - Đã có thanh tìm kiếm nhanh, kbd badge, theme toggler, user info.<br>- **Lệch**: Ô search đang dùng `bg-gray-50/90` thủ công, chưa dùng wrapper `data-slot="input-group"` chuẩn TailAdmin với `has-[:focus]:ring-3 has-[:focus]:ring-brand-500/20`.<br>- **Lệch**: Kbd badge đang dùng `font-mono text-[10px]` thay vì `group/badge font-medium tracking-[-0.2px]`.<br>- **Lệch**: Theme toggle đang dùng icon Lucide thay vì cặp SVG inline Sun/Moon của TailAdmin.<br>- **Thiếu**: Preloader toàn cục của TailAdmin khi tải trang. | Thay thế cấu trúc header bằng đúng template `app-layout/header/index.html`, cấy SVG inline Sun/Moon và search input group chuẩn. |
| **2. Metric Card KPI** | ⚠️ **Lệch** | Dòng 695, 715, 734, 754, 1304, 1715... (40 vị trí) | - Cấu trúc thẻ card đã có bo góc `rounded-2xl` và viền `border-gray-200 dark:border-gray-800`.<br>- **Lệch nghiêm trọng**: Tiêu đề số lượng KPI đang dùng `text-2xl font-bold font-mono` hoặc `tracking-tight`. TailAdmin gốc dùng chuẩn: `text-title-sm font-bold text-gray-800 dark:text-white/90` và **không dùng font-mono**.<br>- **Lệch**: Khung icon KPI một số nơi dùng `w-10 h-10 rounded-xl` thay vì `h-12 w-12 rounded-xl [&>svg]:size-6`.<br>- **Lệch**: Badge % tăng/giảm chưa có hiệu ứng `[text-shadow:0_4px_4px_var(--color-green-200)]`. | Cập nhật 100% metric card về đúng mẫu `ecommerce-metrics.html`: bỏ `text-2xl`, bỏ `font-mono`, áp `text-title-sm`, icon `size-12`, badge chuẩn shadow. |
| **3. Table: Bảng dữ liệu** | ⚠️ **Lệch** | Dòng 803, 915, 1251, 1408, 1785, 2035... (25 bảng) | - Bao bọc bảng đã có `rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3`.<br>- **Lệch**: Các cột số liệu trong bảng đang bị gán class `.font-mono` và `font-mono` hard-code 524 vị trí.<br>- **Lệch**: Các badge trạng thái trong bảng một số nơi đang có viền `border border-gray-200`. TailAdmin table badges không có viền.<br>- **Giống**: thead `border-b border-gray-100 dark:border-white/5`, th `px-5 py-3 text-xs font-medium text-gray-500`, tr hover `hover:bg-gray-50/50 dark:hover:bg-white/2`. | Gỡ bỏ toàn bộ `font-mono` khỏi th/td, thay bằng `tabular-nums`; loại bỏ border trên badge trạng thái trong bảng. |
| **4. Form Elements** | ⚠️ **Lệch** | Dòng 303, 614, 787, 847, 1459, 2015, 2415... (128 vị trí) | - Input đã có chiều cao `h-11` và bo góc `rounded-[10px]`.<br>- **Lệch**: Một số input đang có class focus màu đỏ cũ `focus:border-[#ed263a]` hoặc viền thủ công.<br>- **Lệch**: Chưa áp focus ring chuẩn TailAdmin `focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 dark:focus:border-brand-500/40`.<br>- **Lệch**: Dropdown `<select>` đang dùng style mặc định của trình duyệt ở một số filter, chưa bọc custom chevron như `select-inputs.html`. | Đồng bộ hóa toàn bộ input/select/textarea về đúng chuẩn `forms/form-elements/default-inputs.html`. |
| **5. Buttons & Badges** | ⚠️ **Lệch** | Dòng 318, 641, 648, 1446, 2025, 2465... | - **Lệch**: Nút bấm đang dùng hiệu ứng co giãn `active:scale-95`. TailAdmin Free chuẩn dùng `active:translate-y-px`.<br>- **Lệch**: Focus ring trên button chưa chuẩn `focus-visible:ring-3 focus-visible:ring-brand-500/20 focus-visible:outline-hidden`.<br>- **Lệch**: Badges nhiều nơi thiếu `[text-shadow]` đặc trưng của TailAdmin. | Thay `active:scale-95` bằng `active:translate-y-px`, áp dụng bộ class button variants từ `ui-elements/buttons/variants.html`. |
| **6. ApexCharts** | ⚠️ **Lệch** | Dòng 5809, 5862, 5923, 6214, 12099 (5 biểu đồ) | - Đã cấu hình ApexCharts tương thích sáng/tối.<br>- **Lệch**: `fontFamily` trong biểu đồ đang để cứng `"Be Vietnam Pro, sans-serif"`. Chuẩn TailAdmin yêu cầu: `"Outfit, 'Be Vietnam Pro', sans-serif"`.<br>- **Lệch**: Cấu hình Bar Chart cột bo góc `borderRadius: 8`, `columnWidth: "38%"`, toolbar `show: false`, màu gradient fill `#7592FF` $\rightarrow$ `#465FFF` một số chỗ chưa đồng bộ hoàn toàn với `monthly-sales-chart.js`.<br>- **Lệch**: Tooltip và datalabels đang hard-code mã màu hex (`#64748b`, `#1e293b`). | Cập nhật options của cả 5 biểu đồ khớp 100% code mẫu trong `src/js/components/ecommerce/*.js`. |
| **7. Signin & Error 404** | ⚠️ **Lệch** | Dòng 3273 (`tab-404`), Dòng 3580 (`googleAuthModal`) | - `tab-404` đã có cấu trúc cơ bản nhưng dùng hình ảnh minh họa chưa khớp tỷ lệ TailAdmin gốc.<br>- `googleAuthModal` đang ở dạng pop-up đơn giản, chưa theo bố cục chia đôi màn hình đặc trưng của `signin.html` (`auth-cover.html`). | Áp dụng đúng bố cục lưới của `error-404.html` (tiêu đề `text-2xl xl:text-[64px] font-bold`) và chuẩn hóa modal đăng nhập Google. |
| **8. Dark Mode System** | ⚠️ **Lệch** | Dòng 2, 30, 161, 648, 6252 | - Đã có class `dark` trên `<html>` và lưu `localStorage`.<br>- **Thiếu**: Thuộc tính `data-color-scheme="dark"` / `"light"` trên `<html>` như TailAdmin Theme Manager.<br>- **Lệch**: Đoạn script khởi tạo theme ở `<head>` chưa tối ưu để ngăn chặn hiện tượng nhấp nháy sáng (Flash of unstyled content / FOUC). | Thêm script inline chống nháy ở đầu `<head>` đồng bộ cả `darkMode` và `data-color-scheme`. |
| **9. A11y & Focus States** | ⚠️ **Lệch** | Toàn bộ file | - Đã có `focus-ring` ở một số nút.<br>- **Thiếu**: Nhiều nút bấm, dropdown và modal thiếu các thuộc tính trợ năng: `aria-label`, `aria-expanded`, `aria-haspopup="menu"`, `role="menuitem"`, `x-cloak` chống giật layout khi load. | Bổ sung đầy đủ thuộc tính ARIA và `x-cloak` cho mọi dropdown, modal, drawer navigation. |

---

## IV. BẢNG THỐNG KÊ GIÁ TRỊ HARD-CODE TRONG `public/index.html`

### 1. Thống Kê 48 Mã Màu Hex Hard-Code (Cần Token Hóa 100%)
Qua quét tự động toàn bộ 12.107 dòng code của `public/index.html`, phát hiện **48 mã màu Hex khác nhau** với tổng cộng hơn **450 lần xuất hiện**:

| Mã Hex | Số lần | Dòng tiêu biểu | Phân loại hiện tại | Kế hoạch xử lý theo Design Tokens |
| :--- | :---: | :--- | :--- | :--- |
| `#465fff` | **184** | 80, 87, 100, 283, 318, 591, 657 | Màu xanh thương hiệu TailAdmin | Thay toàn bộ bằng class `bg-brand-500`, `text-brand-500`, `border-brand-500`. |
| `#7592ff` | **70** | 99, 204, 239, 318, 320, 1771 | Màu xanh nhạt Dark Mode | Thay bằng `text-brand-400`, `dark:text-brand-400`, `bg-brand-400`. |
| `#ed263a` | **98** | 303, 549, 779, 787, 796, 1291 | **Màu đỏ cam Orbit cũ (Lệch)** | **LOẠI BỎ TOÀN BỘ**. Thay thế bằng `border-brand-500` hoặc `text-brand-500`. |
| `#d01a2f` | **10** | 841, 943, 3007, 3163, 3322 | Màu đỏ đậm cũ | Thay bằng thang `red-600` hoặc `brand-600` tương ứng. |
| `#3641f5` | **14** | 101, 684, 1291, 1446, 1581 | Màu hover xanh đậm | Thay bằng `hover:bg-brand-600`, `active:bg-brand-700`. |
| `#ecf3ff` | **14** | 95, 318, 586, 1771, 2077 | Màu nền xanh nhạt menu active | Thay bằng `bg-brand-50`, `dark:bg-brand-500/[0.12]`. |
| `#101828` | **8** | 106, 109, 122, 156, 164 | Màu đen bề mặt Dark surface | Thay bằng `dark:bg-black` hoặc `dark:bg-white/3`. |
| `#000000` | **2** | 108, 163 | Nền đen tuyệt đối | Dùng `dark:bg-black`. |
| `#111827`, `#1f2937` | **5** | 110, 111, 166, 167 | Viền & nền Dark cũ | Thay bằng `dark:border-gray-800` hoặc `dark:border-white/5`. |
| `#f9fafb`, `#ffffff` | **9** | 114, 117, 151, 152 | Nền trắng / xám nhạt | Dùng `bg-gray-50`, `bg-white`. |
| `#1f4e79` | **4** | 4964, 6758, 6803, 9603 | Màu Navy tiêu đề xuất Excel | **Giữ nguyên trong hàm JS xuất Excel** (Theo ngoại lệ DEVIATIONS.md). |
| `#64748b`, `#1e293b`, `#f1f5f9` | **13** | 5757, 5758, 6070, 6207 | Màu trục & lưới trong ApexCharts | Chuyển thành đọc từ token CSS hoặc biến theme tập trung. |
| `#1f1a1a`, `#1e1a1a`, `#1a1616` | **16** | 1280, 1409, 1512, 1609, 9371 | Mã màu tối lạ tự chế | Thay bằng `dark:bg-white/3` hoặc `dark:bg-black`. |

> **Mục tiêu nghiệm thu Giai đoạn 2:** Kết quả `grep` tìm mã màu hex trong file HTML (ngoài hàm xuất Excel) phải bằng **0**.

### 2. Danh Sách Các Class Lệch Khác
- **`font-mono` (524 lần):** Đang bị rải khắp các thẻ `<td>`, thẻ `<th>`, KPI card, input mã đơn hàng. **Kế hoạch:** Xóa bỏ hoàn toàn, thay thế bằng `tabular-nums` trên font `Outfit`.
- **`rounded-[10px]` sai chỗ:** Đang dùng trên nhiều container thay vì chỉ trên buttons/inputs như mẫu gốc.
- **`text-2xl` cho KPI (40 vị trí):** TailAdmin dùng `text-title-sm font-bold`.
- **`active:scale-95`:** TailAdmin dùng `active:translate-y-px` trên các button.

---

## V. DANH SÁCH THƯ VIỆN CDN & KẾ HOẠCH GHIM PHIÊN BẢN

| Thư viện | Hiện trạng trong `index.html` | Đánh giá rủi ro | Kế hoạch chuẩn hóa theo TailAdmin Free |
| :--- | :--- | :--- | :--- |
| **Tailwind CSS** | `<script src="https://cdn.tailwindcss.com"></script>` (Play CDN v3) | Không hỗ trợ đầy đủ Tailwind v4 `@theme`, `@utility`, hiệu năng render chậm, không kiểm soát được phiên bản. | **GỠ BỎ HOÀN TOÀN PLAY CDN**. Dùng `@tailwindcss/cli` build từ `src/css/style.css` ra `public/assets/app.css` (minified), tích hợp vào workflow CI. |
| **Lucide Icons** | `<script src="https://unpkg.com/lucide@latest"></script>` (Unpinned) | Dùng `@latest` dễ bị lỗi vỡ icon khi thư viện nâng cấp phiên bản; nhiều icon lệch nét vẽ so với TailAdmin. | - **Thay bằng SVG inline TailAdmin** cho sidebar, header, theme toggle, search, kbd, caret.<br>- Với các icon nghiệp vụ F&B đặc thù: Ghim phiên bản cố định `https://unpkg.com/lucide@0.475.0/dist/umd/lucide.min.js`, ép `stroke-width="1.5"`. |
| **ApexCharts** | `<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>` (Unpinned) | Chưa ghim phiên bản. | Ghim cố định phiên bản: `https://cdn.jsdelivr.net/npm/apexcharts@4.3.0/dist/apexcharts.min.js`. |
| **Flatpickr** | `<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>` (Unpinned) | Chưa ghim phiên bản. | Ghim cố định phiên bản: `https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.js` và `flatpickr@4.6.13/dist/flatpickr.min.css`. |
| **SheetJS (xlsx-style)** | `<script src="https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js"></script>` | Đã ghim phiên bản 1.2.0 | **Giữ nguyên** để phục vụ xuất Excel theo chuẩn Aptos. |
| **Google GIS Auth** | `<script src="https://accounts.google.com/gsi/client" async defer></script>` | Sanctioned API Google | **Giữ nguyên** để đảm bảo luồng xác thực OAuth. |

---

## VI. BẢNG ĐỐI CHIẾU TYPOGRAPHY & FONT STACK

```
Bản tham chiếu TailAdmin:   font-outfit: Outfit, sans-serif
Bản chuẩn hóa WMS:          --font-sans: Outfit, "Be Vietnam Pro", sans-serif;
```

1. **Outfit (Google Fonts Variable `wght@100..900`):** Đóng vai trò là font hiển thị chính cho toàn bộ chữ cái Latin, tiêu đề tiếng Anh, nhãn hệ thống và chữ số. Tính năng `tabular-nums` (`tnum 1`) của Outfit giúp các cột số thẳng hàng tuyệt đối mà không cần dùng đến font monospace.
2. **Be Vietnam Pro (`wght@300..700`):** Đóng vai trò là fallback duy nhất và hoàn hảo cho các ký tự có dấu thanh tiếng Việt phức tạp (như `ậ, ẵ, ợ, ứ, ỳ`).
3. **Loại bỏ JetBrains Mono:** Không còn bất kỳ định dạng font mono nào trên số liệu KPI hay bảng biểu.
4. **Trang kiểm thử font nội bộ:** Đã tạo file [test-font.html](file:///D:/Query/kho_gia_vi_cloudflare/test-font.html) kiểm tra ma trận hiển thị chuỗi ký tự `"Ạ Ả Ấ Ầ Ẩ Ẫ Ậ Ắ Ằ Ơ Ờ Ợ Ư Ừ Ự Ỵ Ỷ Ỹ Đ 0123456789 ₫"` ở 6 cỡ chữ (12, 14, 16, 18, 20, 24px) và 4 độ dày (400, 500, 600, 700).

---

## VII. PHÁT HIỆN NGOÀI PHẠM VI (OUT-OF-SCOPE FINDINGS)

Trong quá trình phân tích code frontend và backend, phát hiện các điểm sau (ghi nhận để theo dõi, tuân thủ nguyên tắc **KHÔNG TỰ Ý SỬA** để tránh ảnh hưởng đến hệ thống đang chạy):
1. **Google GIS Client ID:** Trong file `public/index.html` (dòng ~3585), thuộc tính `data-client_id` đang cấu hình client ID Google OAuth. Không được thay đổi chuỗi này để tránh ngắt quãng luồng đăng nhập của nhân viên kho.
2. **Quyền truy cập Role-based (RBAC):** Các hàm kiểm tra quyền như `checkRolePermission()`, `hasAdminRole()` dựa trên các thuộc tính `data-cat` và `data-tab`. Khi chuẩn hóa class menu và sidebar, phải bảo toàn nguyên vẹn các thuộc tính `data-tab`, `data-cat`, và `onclick="switchTab(...)"`.
3. **Endpoint `/api/dashboard-summary`:** Endpoint trả về dữ liệu tổng hợp cho 5 metric card và các chart. Cần giữ nguyên cấu trúc JSON response (`total_skus`, `total_sap_value`, `rop_alerts`, `near_expiry_count`, `slow_moving_count`).

---

## VIII. KẾ HOẠCH THỰC THI CHO CÁC GIAI ĐOẠN TIẾP THEO

- **Giai đoạn 1 (Nền tảng):**
  - Cài đặt `@tailwindcss/cli` và `@tailwindcss/forms` vào `package.json`.
  - Tạo `src/css/style.css` chứa 100% tokens từ TailAdmin Free.
  - Cấu hình npm script `build:css` biên dịch ra `public/assets/app.css`.
  - Cập nhật `.github/workflows/deploy.yml` chạy `npm ci && npm run build:css` trước khi deploy.
  - Ghim phiên bản các thư viện CDN.
- **Giai đoạn 2 (Font & Token):**
  - Áp dụng font stack Outfit + Be Vietnam Pro.
  - Quét sạch 48 mã hex hard-code và 524 vị trí `font-mono`.
  - Chuẩn hóa toàn bộ badge và KPI card.
- **Giai đoạn 3 (Components):**
  - Lần lượt chuẩn hóa Sidebar, Header, Breadcrumb, Table wrapper, Form controls, Buttons, Modals, 5 ApexCharts theo checklist.
- **Giai đoạn 4 (Màn hình):**
  - Đồng bộ chi tiết từng màn hình nghiệp vụ: `wh-dashboard`, `fnb-chain`, `wh-stock`, `fnb-stock`, `portal-order`, `portal-kiemke`, các màn còn lại và `tab-404`.
- **Giai đoạn 5 (Visual Regression QA):**
  - Chụp ảnh so sánh đối chiếu đa kích thước (375px, 768px, 1440px ở cả Light và Dark mode).
  - Đo đạc computed style từng pixel để nghiệm thu.

---
*Báo cáo được lập bởi: Senior Front-end Engineer & Visual Fidelity QA*  
*Trạng thái: **GIAI ĐOẠN 0 HOÀN TẤT — ĐANG CHỜ DUYỆT ĐỂ BƯỚC VÀO GIAI ĐOẠN 1**.*
