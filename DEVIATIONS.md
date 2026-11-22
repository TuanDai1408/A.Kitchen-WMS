# TÀI LIỆU QUY CHUẨN KỸ THUẬT VÀ CÁC ĐIỂM ĐIỀU CHỈNH (DEVIATIONS)
## Hệ Thống Giao Diện A.Kitchen-WMS (TailAdmin + Tailwind CSS v4)

Tài liệu này ghi nhận các quyết định kỹ thuật, sự khác biệt (deviations) so với thiết kế lý thuyết và cơ sở logic giải pháp đã triển khai trên nhánh `feat/ui-design-system`.

---

### 1. Xử Lý Đơn Vị Chiều Cao Điều Khiển: `rem` vs `px` (Quy chuẩn 40px)
- **Vấn đề thực tế**:
  Trong `src/css/style.css`, ứng dụng cấu hình `:root { font-size: 14px; }` nhằm phù hợp với tỷ lệ hiển thị của font Estedad (x-height nhỏ ~0.49em). Trong Tailwind CSS chuẩn, lớp `h-10` được biên dịch thành `height: 2.5rem`. Do đó, `2.5rem * 14px = 35px`, không đạt chiều cao chuẩn 40px theo yêu cầu thiết kế hệ thống.
- **Giải pháp triển khai**:
  Định nghĩa tường minh các thuộc tính chiều cao pixel trong các lớp thành phần Design System tại `src/css/style.css`:
  ```css
  .input, .select, .date-input, .btn, .header-control {
    height: 40px !important;
    min-height: 40px !important;
    box-sizing: border-box;
  }
  .btn-sm {
    height: 32px !important;
    min-height: 32px !important;
  }
  ```
  Nhờ đó, toàn bộ ô nhập liệu, hộp chọn, nút bấm và các điều khiển trên thanh điều hướng đầu trang (header controls) luôn đạt chuẩn đồng đều tuyệt đối 40px trên mọi kích thước màn hình.

---

### 2. Xử Lý Font Chữ: Estedad, Inter và JetBrains Mono
- **Vấn đề thực tế**:
  1. Font **Estedad** khi bật thuộc tính số học bảng (`tabular-nums` / `tnum 1`) khiến bề rộng các chữ số và ký tự dấu gạch ngang bị bè to lên tới `0.74em` (tăng ~42% chiều rộng so với thông thường). Điều này làm các chuỗi mã chứng từ (ví dụ: `CT-20261117-012625-K001`) và ngày tháng (`22/11/2026`) bị ngắt xuống 2 dòng trong bảng và thẻ di động.
  2. Font Estedad thiếu ký hiệu tiền tệ Việt Nam Đồng (`₫`) và một số ký tự dấu tiếng Việt hiếm.
- **Giải pháp triển khai**:
  - **Font chính (`--font-sans`)**: Dùng `Estedad` tự lưu trữ nội bộ (self-hosted WOFF2, không tải CDN ngoài) cho toàn bộ tiêu đề, nhãn, nội dung văn bản thông thường.
  - **Dự phòng & Ký hiệu tiền tệ**: Sử dụng `Inter` tải trước nội bộ (subsets `latin` + `vietnamese`) làm fallback ngay sau Estedad, đảm bảo ký hiệu `₫` hiển thị chuẩn đẹp, không bao giờ bị rơi về font hệ thống mặc định (Arial/Times).
  - **Quy tắc chữ số dạng bảng (`.num`)**:
    Chỉ áp dụng chữ số bảng (`tabular-nums`) cho các cột số tiền, số lượng, tỷ lệ phần trăm và ngày tháng bằng lớp `.num` kết hợp font `Inter`:
    ```css
    .num {
      font-family: 'Inter', var(--font-sans);
      font-variant-numeric: tabular-nums;
      font-feature-settings: 'tnum' 1;
      letter-spacing: 0;
    }
    ```
    Bề rộng hiển thị của "22/11/2026" ở cỡ 14px giảm từ 118px xuống 82.72px (đạt chỉ tiêu $\le 90\text{px}$).
  - **Mã định danh (`.code`)**:
    Sử dụng font `JetBrains Mono` với cỡ 12px, không bật `tnum`, cố định không ngắt dòng (`white-space: nowrap`), giúp mã chứng từ nằm trọn vẹn 1 dòng.
  - **Chỉ số KPI độc lập**:
    Sử dụng chữ số nguyên bản của Estedad (proportional figures), tắt triệt để `tabular-nums` để giữ dáng chữ số thanh thoát, tự nhiên.

---

### 3. Tối Ưu Hóa & Loại Bỏ `!important` Trong CSS
- **Hiện trạng ban đầu**: Có **78 vị trí** sử dụng cờ `!important`, bao gồm các quy tắc ép font-weight và font-size toàn cục (`.font-bold { font-weight: 600 !important }`, `.text-xs { font-size: 12px !important }`, `.kpi-value { font-size: 27px !important }`) gây phá vỡ tính phân cấp (cascade) của CSS.
- **Điều chỉnh**:
  - Triệt tiêu 58 vị trí `!important` không cần thiết.
  - Giữ lại đúng **20 vị trí** thực sự đặc thù và không thể thay thế:
    1. Ép chiều cao cố định 40px cho các nút và ô nhập liệu thanh header (`.header-control`) nhằm chống lại việc framework cha ghi đè.
    2. Các lớp tiện ích đặc dụng: ẩn in ấn (`.no-print { display: none !important }`), thu gọn thanh bên sidebar (`.sidebar-collapsed { width: 0 !important }`), và các trạng thái chuyển động của modal/bottom-sheet.

---

### 4. Chuẩn Hóa Bộ Lọc Ngày & Tháng (Lược Bỏ Chuỗi Tiếng Anh)
- **Vấn đề thực tế**:
  Thẻ `<input type="month">` mặc định của các trình duyệt hiển thị chuỗi tháng bằng tiếng Anh (ví dụ: "November 2026").
- **Giải pháp triển khai**:
  Giữ nguyên thẻ input ẩn `<input type="month" id="globalMonthPicker">` và sự kiện `onchange="onGlobalMonthChange()"` để bảo toàn 100% logic nghiệp vụ hiện có; đồng thời bọc ngoài bằng một nút `.select` hiển thị định dạng chuẩn tiếng Việt (ví dụ: `Tháng 11/2026`) có icon lịch SVG. Khi người dùng nhấp chuột, nút gọi phương thức `showPicker()` của input gốc.

---

### 5. Bảo Toàn Nghiệp Vụ & Mã Nguồn
- **Quy tắc tuyệt đối**:
  1. Không can thiệp hoặc thay đổi backend (`src/index.js`, Cloudflare Worker, Supabase, API endpoints).
  2. Giữ nguyên 100% ID phần tử HTML, tên hàm JavaScript toàn cục, các sự kiện `onclick`, `onchange`, `onsubmit` và các khóa lưu trữ trong `localStorage`.
  3. Mọi công cụ phụ trợ (tools kiểm thử, build) được đặt riêng trong thư mục `tools/` và không can thiệp vào bundle triển khai chính.
