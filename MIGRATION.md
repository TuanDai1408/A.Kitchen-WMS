# Hướng Dẫn Nâng Cấp Giao Diện (TailAdmin UI/UX Migration Guide)

Tài liệu này ghi lại toàn bộ hệ thống Design Tokens, kiến trúc App Shell, danh mục Component dùng chung, và quy chuẩn thêm màn hình mới cho hệ thống **A.Kitchen-WMS (Orbit Siba Food)** theo ngôn ngữ thiết kế của **TailAdmin Free**.

---

## 1. Hệ Thống Design Tokens (Tokens Reference)

Toàn bộ tokens được khai báo và cấu hình đồng bộ tại `tailwind.config` và khối `@theme / <style>` trong [public/index.html](public/index.html).

### 1.1. Thang Màu Thương Hiệu (Brand Palette)
- **Primary Brand Color**: `#465FFF` (`rgb(70, 95, 255)`)
- **Thang sắc độ chuẩn TailAdmin**:
  - `brand-50`: `rgba(236, 243, 255, 1)` (Nền tag / active badge)
  - `brand-100`: `rgba(221, 233, 255, 1)`
  - `brand-200`: `rgba(194, 214, 255, 1)`
  - `brand-300`: `rgba(156, 185, 255, 1)`
  - `brand-400`: `rgba(117, 146, 255, 1)`
  - `brand-500`: `rgba(70, 95, 255, 1)` — **Màu nút bấm & điểm nhấn chính**
  - `brand-600`: `rgba(54, 65, 245, 1)` (Hover state)
  - `brand-700`: `rgba(42, 49, 216, 1)`
  - `brand-800`: `rgba(37, 45, 174, 1)`
  - `brand-900`: `rgba(38, 46, 137, 1)`
  - `brand-950`: `rgba(22, 25, 80, 1)`

### 1.2. Màu Nền & Dark Mode Tokens
- **Light Mode**:
  - Background tổng thể: `#f9fafb` (`gray-50`)
  - Mặt phẳng Card / Surface: `#ffffff`
  - Đường viền Border: `#e5e7eb` (`gray-200`)
- **Dark Mode** (`html.dark`):
  - Background tổng thể: `#000000` (Đen chuẩn TailAdmin)
  - Mặt phẳng Card / Table: `dark:bg-white/3` hoặc `dark:bg-[#101828]`
  - Đường viền Border: `#1f2937` (`gray-800`) hoặc `white/5`
  - Chữ chính: `#ffffff` / `text-white/90`
  - Chữ phụ: `#94a3b8` (`gray-400`)

### 1.3. Typography & Font Chữ
- **Font chính**: `Be Vietnam Pro` (100% tiếng Việt có dấu không lỗi glyph) kết hợp `Outfit, sans-serif`.
- **Font số liệu / Hóa đơn**: `JetBrains Mono` bật thuộc tính `font-feature-settings: 'tnum' 1` để căn thẳng hàng dọc các con số (Tabular numbers).
- **Scale kích thước chữ**:
  - `text-title-sm`: `18px` / Line-height: `28px` (KPI number, Section Title)
  - `text-title-lg`: `20px` / Line-height: `30px` (Page Title)
  - `text-heading-six`: `24px` / Line-height: `32px`

### 1.4. Đổ Bóng (Box Shadows)
- `shadow-theme-xs`: `0px 1px 2px 0px rgba(16, 24, 40, 0.05)`
- `shadow-theme-sm`: `0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)`
- `shadow-theme-md`: `0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)`
- `shadow-theme-lg`: `0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)`
- `shadow-theme-xl`: `0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)`
- `focus-ring`: `0px 0px 0px 4px rgba(70, 95, 255, 0.12)`

### 1.5. Breakpoints & Z-Index
- `2xsm: 375px`, `xsm: 425px`, `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`, `3xl: 2000px`
- `z-index`: `1`, `9`, `99`, `999`, `9999`, `99999`

---

## 2. Kiến Trúc App Shell

- **Sidebar (`#sidebar`)**:
  - Độ rộng cố định `w-72.5` (`290px`) trên desktop (`lg:static lg:translate-x-0`).
  - Mobile: Drawer trượt off-canvas (`-translate-x-full`) kết hợp lớp phủ mờ `#overlay` (`bg-black/60 backdrop-blur-xs`).
  - Menu nhóm theo danh mục với class chuẩn TailAdmin: `.menu-item`, `.menu-item-active`, `.menu-item-inactive`.
- **Lưu trạng thái Tab (Route Persistence)**:
  - Khi người dùng chuyển tab, mã tab được lưu tự động vào `localStorage.setItem('orbit_active_tab', tabId)`.
  - Khi tải lại trang (F5), hệ thống tự động kích hoạt lại đúng tab đang xem dở.
- **Thanh Header Sticky (`<header>`)**:
  - Nút toggle sidebar cho mobile và desktop.
  - Ô tìm kiếm nhanh toàn cục tích hợp phím tắt **`Ctrl + K`** hoặc **`⌘K`**.
  - Bộ chuyển đổi theme Sáng/Tối đồng bộ cả 2 khóa `darkMode` và `orbit_theme`.
  - Nút thông tin tài khoản người dùng hiển thị avatar và vai trò RBAC.
- **Trang Lỗi 404 (`#tab-404`)**:
  - Tự động hiển thị khi người dùng yêu cầu một phân hệ hoặc mã tab không tồn tại trong hệ thống.

---

## 3. Danh Mục Component Dùng Chung (Component Catalog)

### 3.1. Thẻ Chỉ Số KPI (Metric Card)
```html
<div class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-theme-xs dark:border-gray-800 dark:bg-white/3">
  <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
    <i data-lucide="boxes" class="w-6 h-6"></i>
  </div>
  <div class="mt-4 flex items-end justify-between">
    <div>
      <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Tên Chỉ Số</span>
      <h4 class="mt-1.5 text-2xl font-bold font-mono tracking-tight text-gray-800 dark:text-white/90">1.250 Mã</h4>
    </div>
    <span class="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-500">
      <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> +5.4%
    </span>
  </div>
</div>
```

### 3.2. Bảng Dữ Liệu (Data Table)
- **Container**: `overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800`
- **Thead**: `bg-gray-50/75 dark:bg-white/2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-100 dark:border-gray-800`
- **Hàng Tbody**: `hover:bg-gray-50/60 dark:hover:bg-white/2 transition-colors`
- **Tính năng mở rộng**:
  - Hỗ trợ chọn nhiều dòng (Bulk select với checkbox).
  - Thanh đếm số lượng dòng đang chọn và nút xuất Excel nhanh.
  - Sắp xếp cột linh hoạt (`sortStockBy(col)`).
  - Phân trang chuẩn giao diện TailAdmin (`changeStockPage(delta)`).

### 3.3. Badges Trạng Thái
- **An toàn / Hoàn thành (Emerald)**:
  `bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40`
- **Cảnh báo / Cận Date (Amber)**:
  `bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40`
- **Nguy cơ / Hết hàng (Rose)**:
  `bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40`
- **Thương hiệu / Điểm nhấn (Brand)**:
  `bg-[#ecf3ff] text-[#465fff] dark:bg-[#465fff]/20 dark:text-[#7592ff]`

### 3.4. Modal Popup (TailAdmin Profile & Edit Style)
- Lớp nền mờ: `fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4`
- Thân hộp thoại: `bg-white dark:bg-[#101828] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xl`

### 3.5. Biểu Đồ ApexCharts
- **Font**: `'Be Vietnam Pro', 'Outfit', sans-serif`
- **Bo góc cột Bar**: `borderRadius: 8`
- **Màu sắc chuẩn**: `#465FFF` (Brand), `#10B981` (Emerald), `#F59E0B` (Amber), `#EF4444` (Rose)
- **Tự động chuyển đổi Dark Mode**: Hàm `updateApexChartsTheme(isDark)` cập nhật màu chữ tọa độ (`#94A3B8` / `#64748B`), màu lưới viền (`#1E293B` / `#F1F5F9`) và tooltip ngay khi người dùng bấm chuyển theme.

---

## 4. Quy Chuẩn Xuất File Excel (Excel Styling Standard)

Khi xuất báo cáo Excel (danh sách tồn kho, kiểm kê, chứng từ) qua hàm `exportStyledExcel(...)`:
- **Font mặc định**: **Aptos** (áp dụng cho toàn bộ tiêu đề và dữ liệu).
- **Tiêu đề cột (Header)**: Font Aptos, Size 11, In đậm, Nền xanh Navy `#1F4E79`, Chữ trắng, Căn giữa.
- **Dữ liệu**: Font Aptos, Size 11, Regular.
- **Căn lề**: Số căn phải, Mã ID/Ngày tháng căn giữa, Tên văn bản căn trái.
- **Thuộc tính**: Luôn bật Freeze Panes và AutoFilter.

---

## 5. Hướng Dẫn Thêm Màn Hình / Phân Hệ Mới Đúng Chuẩn

1. **Thêm mục Menu vào Sidebar**:
   ```html
   <li>
     <button onclick="switchTab('ten-tab-moi', this)" data-tab="ten-tab-moi" class="nav-btn menu-item menu-item-inactive w-full">
       <i data-lucide="icon-name" class="menu-icon w-4 h-4 text-gray-500"></i>
       <span class="truncate">Tên Phân Hệ Mới</span>
     </button>
   </li>
   ```
2. **Khai báo Section nội dung trong `<main>`**:
   ```html
   <section id="ten-tab-moi" class="tab-panel space-y-4">
     <!-- Sử dụng các thẻ Card, Table và Metric Cards chuẩn TailAdmin ở trên -->
   </section>
   ```
3. **Thêm Hook tải dữ liệu vào hàm `switchTab`**:
   ```javascript
   if (tabId === 'ten-tab-moi') loadTenTabMoi();
   ```
4. **Kiểm tra Responsive & Dark Mode**:
   - Thử nghiệm trên mobile `375px` và màn hình rộng `1440px`.
   - Kiểm tra hiển thị cả 2 chế độ Sáng (Light) và Tối (Dark).
