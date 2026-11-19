# HƯỚNG DẪN KIẾN TRÚC UI/UX TAILADMIN FREE (TAILWIND CSS V4 BUILD)
## Dự Án: A.Kitchen-WMS (Siba Food ERP & Kho Chuỗi F&B)

Tài liệu này là **Single Source of Truth** về tiêu chuẩn thiết kế UI/UX của toàn bộ hệ sinh thái **A.Kitchen-WMS**, sao chép trung thực 100% ngôn ngữ thiết kế của template **TailAdmin Free** (HTML + Tailwind v4 + Alpine.js).

---

## 1. KIẾN TRÚC BUILD & BUNDLING STACK

Khác với các phiên bản cũ sử dụng Play CDN v3 (`cdn.tailwindcss.com`), hệ thống hiện tại đã chuyển đổi hoàn toàn sang **Tailwind CSS v4 Standalone Build**:

- **Công cụ biên dịch:** `@tailwindcss/cli` v4.3.5
- **Plugins tích hợp:** `@tailwindcss/forms` v0.5.11
- **File định nghĩa Tokens & Utilities:** `src/css/style.css` (Cấu hình `@theme`, `@utility`, `@custom-variant dark`). **Tuyệt đối không tạo `tailwind.config.js`**.
- **File CSS đầu ra đã nén (Minified):** `public/assets/app.css` (Tự động biên dịch trong ~150-300ms).
- **Lệnh npm trong `package.json`:**
  ```json
  "scripts": {
    "dev": "wrangler dev",
    "build:css": "tailwindcss -i ./src/css/style.css -o ./public/assets/app.css --minify",
    "dev:css": "tailwindcss -i ./src/css/style.css -o ./public/assets/app.css --watch",
    "deploy": "wrangler deploy"
  }
  ```
- **Tự động hóa CI/CD (`.github/workflows/deploy.yml`):**
  GitHub Actions tự động chạy `npm ci && npm run build:css` trước khi thực thi `wrangler deploy` lên Cloudflare Workers.

---

## 2. QUY CHUẨN DESIGN TOKENS (TAILADMIN V4 THEME)

### 2.1. Bảng Màu Thương Hiệu (Brand Scale)
- **Brand Primary:** `#465FFF` (RGB: `70, 95, 255`) $\rightarrow$ class: `bg-brand-500`, `text-brand-500`, `border-brand-500`.
- **Thang màu chuẩn:**
  - `brand-50`: `rgba(236, 243, 255, 1)` (Nền menu active, nền badge info nhẹ)
  - `brand-100`: `rgba(221, 233, 255, 1)`
  - `brand-200`: `rgba(194, 214, 255, 1)`
  - `brand-300`: `rgba(156, 185, 255, 1)` (Viền focus input)
  - `brand-400`: `rgba(117, 146, 255, 1)` (Chữ brand trong Dark Mode)
  - `brand-500`: `rgba(70, 95, 255, 1)` (Chính - Primary)
  - `brand-600`: `rgba(54, 65, 245, 1)` (Hover state)
  - `brand-700`: `rgba(42, 49, 216, 1)` (Active state)
  - `brand-800`: `rgba(37, 45, 174, 1)`
  - `brand-900`: `rgba(38, 46, 137, 1)`
  - `brand-950`: `rgba(22, 25, 80, 1)`

### 2.2. Nền Tảng Màu Sáng / Tối (Light & Dark Mode)
- **Light Mode:**
  - Nền body: `bg-gray-50` (`#f9fafb`)
  - Bề mặt Card / Modal / Popover: `bg-white` (`#ffffff`)
  - Viền Card / Table: `border-gray-200` (`#e5e7eb`), viền dòng bảng: `border-gray-100` (`#f3f4f6`)
  - Chữ chính: `text-gray-800` (`#1f2937`) hoặc `text-gray-900`
  - Chữ phụ / Subtitle / Label: `text-gray-500` (`#6b7280`)
- **Dark Mode:**
  - Nền body: `dark:bg-black` (`#101828`)
  - Bề mặt Card: `dark:bg-white/3` (`rgba(255, 255, 255, 0.03)`)
  - Bề mặt Modal / Header / Dropdown: `dark:bg-gray-900` hoặc `dark:bg-[#1E2635]`
  - Viền: `dark:border-gray-800` hoặc `dark:border-white/5`
  - Chữ chính: `dark:text-white/90`
  - Chữ phụ: `dark:text-gray-400`
- **Đồng bộ trạng thái theme:**
  Lưu `localStorage.getItem("darkMode")` kết hợp `localStorage.getItem("orbit_theme")`, đồng thời cập nhật thuộc tính `data-color-scheme="dark"|"light"` trên thẻ `<html>` để chống nháy sáng (FOUC) khi tải trang.

### 2.3. Hệ Thống Đổ Bóng (Box Shadows)
- `shadow-theme-xs`: `0px 1px 2px 0px rgba(16, 24, 40, 0.05)` (Dùng cho Card, Input, Button)
- `shadow-theme-sm`: `0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)`
- `shadow-theme-md`: `0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)`
- `shadow-theme-lg`: `0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)`
- `shadow-theme-xl`: `0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)` (Dùng cho Modal Dialog)
- `shadow-focus-ring`: `0px 0px 0px 4px rgba(70, 95, 255, 0.12)` (Focus state)

### 2.4. Phân Định Z-Index Chuẩn TailAdmin
- `z-1`: 1
- `z-9`: 9
- `z-99`: 99 (Mobile Drawer Backdrop)
- `z-999`: 999
- `z-9999`: 9999 (Sidebar Navigation Aside)
- `z-99999`: 99999 (Modal Dialog Wrapper)
- `z-999999`: 999999 (Preloader toàn cục)

---

## 3. QUY CHUẨN TYPOGRAPHY (OUTFIT & BE VIETNAM PRO)

| Mục đích | Font quy định | Cỡ chữ & Dòng | Thuộc tính đặc biệt |
| :--- | :--- | :--- | :--- |
| **Giao diện Web, Dashboard, Thẻ nội dung** | `Outfit, "Be Vietnam Pro", sans-serif` | Body: 14px (`text-sm`), Heading: 18px (`text-title-sm`) | Font chính là Outfit (Google Fonts Variable wght 100-900), tự động fallback sang Be Vietnam Pro khi gặp ký tự có dấu kép tiếng Việt. |
| **Chữ số, KPI, Bảng dữ liệu, Mã đơn hàng** | `Outfit, "Be Vietnam Pro", sans-serif` | 14px (`text-sm`) hoặc 18px (`text-title-sm font-bold`) | **Bật class `tabular-nums`** (`font-feature-settings: 'tnum' 1;`) để cố định độ rộng con số, thẳng hàng dọc tuyệt đối. **Đã loại bỏ hoàn toàn font monospace**. |
| **Xuất File Báo Cáo Excel (.xlsx)** | **Aptos** | Header: 11pt Bold (Nền Navy `#1F4E79`, Chữ trắng)<br>Data: 11pt Regular | Căn phải số tiền, căn giữa ngày tháng/ID, căn trái văn bản. Bật Freeze Panes và AutoFilter. |

---

## 4. BỘ COMPONENT CHUẨN (COMPONENT CATALOG)

### 4.1. Shell: Sidebar & Header
- **Sidebar Wrapper:**
  `class="sidebar fixed top-0 left-0 z-9999 flex h-screen w-72.5 flex-col border-r border-gray-200 bg-white px-5 transition-all duration-300 -translate-x-full xl:static xl:translate-x-0 dark:border-gray-800 dark:bg-black select-none shadow-2xl xl:shadow-none"`
- **Menu Item Active:**
  `class="menu-item menu-item-active bg-brand-50 text-brand-500 dark:bg-brand-500/[0.12] dark:text-brand-400"`
- **Menu Item Inactive:**
  `class="menu-item menu-item-inactive text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-gray-300"`
- **Header Global Search Bar:**
  ```html
  <div data-slot="input-group" class="group/input-group relative flex h-11 w-full min-w-0 items-center rounded-[10px] border border-gray-200 bg-transparent shadow-theme-xs outline-hidden transition-colors has-[input:focus]:border-brand-300 has-[input:focus]:ring-3 has-[input:focus]:ring-brand-500/20 dark:border-gray-800 dark:bg-white/3 dark:has-[input:focus]:border-brand-500/40">
    <!-- Icon Search -->
    <!-- Input Field -->
    <!-- Kbd Badge Ctrl/⌘+K -->
  </div>
  ```

### 4.2. Metric Card KPI
```html
<div class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-theme-xs dark:border-gray-800 dark:bg-white/3">
  <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white/90 [&>svg]:size-6">
    <!-- Icon SVG Inline / Lucide stroke-width 1.5 -->
  </div>
  <div class="mt-5 flex items-end justify-between">
    <div>
      <span class="text-sm text-gray-500 dark:text-gray-400">Tên Chỉ Số KPI</span>
      <h4 class="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 tabular-nums">1.234.567 ₫</h4>
    </div>
    <span class="inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 rounded-lg bg-green-50 px-2.5 py-0.5 text-sm font-medium whitespace-nowrap text-green-600 transition-colors select-none [text-shadow:0_4px_4px_var(--color-green-200)] dark:bg-green-500/15 dark:text-green-500 dark:[text-shadow:0_4px_4px_rgba(18,183,106,0.20)]">
      +11.01%
    </span>
  </div>
</div>
```

### 4.3. Data Table
- **Wrapper:** `overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3`
- **thead:** `border-b border-gray-100 dark:border-white/5`
- **th:** `px-5 py-3 text-start text-xs font-medium text-gray-500 sm:px-6 dark:text-gray-400`
- **tbody:** `divide-y divide-gray-100 dark:divide-white/5`
- **tr hover:** `transition hover:bg-gray-50/50 dark:hover:bg-white/2`
- **td:** `px-5 py-4 text-start text-sm text-gray-500 sm:px-6 dark:text-gray-400 tabular-nums`

### 4.4. Form Elements & Buttons
- **Input Text:**
  `class="h-11 w-full min-w-0 rounded-[10px] border border-gray-300 bg-white px-4 py-2.5 text-sm font-normal text-gray-800 shadow-theme-xs outline-hidden transition-colors placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-500/40"`
- **Button Primary:**
  `class="inline-flex items-center justify-center gap-2 rounded-[10px] border border-transparent bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-all outline-none select-none hover:bg-brand-600 focus-visible:ring-3 focus-visible:ring-brand-500/20 active:translate-y-px"`
- **Button Outline:**
  `class="inline-flex items-center justify-center gap-2 rounded-[10px] border border-gray-300 bg-transparent px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs transition-all outline-none select-none hover:bg-gray-50 hover:text-gray-800 focus-visible:ring-3 focus-visible:ring-gray-300/50 active:translate-y-px dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white"`

### 4.5. Modal Dialog
- **Backdrop:**
  `class="fixed inset-0 z-99999 bg-gray-400/50 backdrop-blur-[32px] dark:bg-black/80 flex items-center justify-center p-4 sm:p-5"`
- **Dialog Box:**
  `class="relative no-scrollbar flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 dark:bg-gray-900 shadow-theme-xl"`
- **Close Button:**
  `class="absolute top-5 right-5 z-20 flex size-9 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-all outline-none select-none hover:bg-gray-200 hover:text-gray-600 active:translate-y-px dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-300"`

---

## 5. HƯỚNG DẪN THÊM MÀN HÌNH MỚI (NEW SCREEN GUIDELINE)

Khi phát triển thêm màn hình nghiệp vụ mới cho hệ thống WMS, lập trình viên bắt buộc tuân thủ 4 bước:
1. **Khai báo thẻ `<section id="tên-màn-hình" class="tab-panel space-y-6">`** bên trong `<main>`.
2. **Khai báo mục điều hướng trong Sidebar:**
   Sử dụng nút bấm với thuộc tính `onclick="switchTab('tên-màn-hình', this)"` và class `menu-item menu-item-inactive`.
3. **Sử dụng đúng Design Tokens:**
   - Dùng class tiện ích của Tailwind v4, không bao giờ viết mã màu hex trực tiếp (`#...`).
   - Sử dụng thẻ KPI `rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3`.
   - Tiêu đề số lượng dùng `text-title-sm font-bold tabular-nums`.
4. **Biên dịch CSS:**
   Chạy lệnh `npm run build:css` để cập nhật các utility class mới vào file `public/assets/app.css`.

---
*Tài liệu được cập nhật ngày: 19/11/2026*  
*Người chịu trách nhiệm kỹ thuật: Senior Front-end Engineer*
