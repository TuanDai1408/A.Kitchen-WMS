# BÁO CÁO KIỂM TOÁN HỆ THỐNG GIAO DIỆN (DESIGN SYSTEM AUDIT)
## DỰ ÁN: A.KITCHEN-WMS — NHÁNH: `feat/ui-design-system`

---

## 1. TỔNG QUAN GIAI ĐOẠN 0: ĐO LƯỜNG BASELINE (HIỆN TRẠNG)

Trước khi tiến hành chuẩn hóa Design System, toàn bộ mã nguồn frontend (`public/index.html` và `src/css/style.css`) đã được quét tự động bằng công cụ đo lường chuyên biệt ([tools/audit_baseline.mjs](file:///d:/Query/kho_gia_vi_cloudflare/tools/audit_baseline.mjs)).

### Bảng Đo Lường Baseline Hiện Trạng:

| Chỉ số kỹ thuật | Đo lường thực tế (Baseline) | Mục tiêu Design System | Đánh giá hiện trạng |
| :--- | :---: | :---: | :--- |
| **Kiểu class thẻ `<select>`** | **33 kiểu** / 65 phần tử | $\le$ 3 kiểu | Phân mảnh nghiêm trọng, padding và viền không đồng bộ |
| **Kiểu class thẻ `<input>`** | **69 kiểu** / 104 phần tử | $\le$ 6 kiểu | Chiều cao không đều (`text-xs` ép 12px lẫn `14px`, padding lệch) |
| **Kiểu class thẻ `<button>`** | **157 kiểu** / 251 phần tử | $\le$ 12 kiểu | Hỗn loạn các lớp màu, padding, độ bo góc |
| **Kiểu class thẻ `<th>` (Header)** | **126 kiểu** / 271 phần tử | $\le$ 4 kiểu | Lẫn lộn `uppercase`, `tracking-wider`, padding tự do |
| **Kiểu class thẻ `<td>` (Cell)** | **199 kiểu** / 391 phần tử | $\le$ 25 kiểu | Không có chuẩn cột dữ liệu, ngắt dòng tùy tiện |
| **Kiểu class thẻ Huy hiệu (`badge`)** | **97 kiểu** / 125 phần tử | $\le$ 6 biến thể token | Chỉ 2/70 huy hiệu có `whitespace-nowrap`, gây vỡ 2 dòng |
| **Quy tắc `!important` trong CSS** | **70 vị trí** | $\le$ 10 vị trí | Nhiều quy tắc ép toàn cục gây xung đột cascade |
| **Vị trí áp dụng `tabular-nums`** | **320 vị trí** | Quy ước lại qua `.num` | Áp dụng tràn lan lên cả mã SKU, ngày tháng gây bè chữ số |
| **Số emoji trong HTML** | **94 emoji** (61 thẻ `<option>`) | **0 emoji** | Dùng icon không chuẩn (📷, ⚠️, ✅, 🛒, 📦...) |
| **Số nút dùng màu `bg-emerald-*`** | **16 nút** | **0 nút** (chuyển sang brand) | Xung đột với màu thương hiệu chính `#19723C` (`brand-600`) |
| **Lớp `tracking-wider` trong HTML** | **58 vị trí** | $\le$ 2 (chỉ sidebar) | Giãn chữ quá mức gây tràn ngang ô bảng |
| **Ô nhập `<input type="date">`** | **14 phần tử** | Chuẩn hóa `.date-input` | Picker gốc không đồng bộ icon và padding |
| **Ô nhập `<input type="month">`** | **5 phần tử** | Chuẩn hóa tiếng Việt | Hiển thị chuỗi tiếng Anh mặc định trình duyệt ("November 2026") |

---

## 2. NGUYÊN NHÂN GỐC RỄ ĐÃ ĐƯỢC XÁC MINH

### A. Vấn đề chữ số bị bè (0.74em)
- **Cơ chế**: Phông chữ **Estedad** khi kích hoạt tính năng OpenType `tnum` (tabular figures) cố định toàn bộ chữ số và các ký tự toán tử/ngăn cách (`-`, `/`) thành độ rộng **0.74em** (trong khi chữ số bình thường chỉ chiếm ~0.56em, riêng số `1` chỉ 0.415em).
- **Hệ quả**:
  - Chuỗi ngày tháng `2026-11-17` bị phình rộng thêm **42%**.
  - Mã chứng từ `CT-20261117-012625-K001` bị phình rộng thêm **34%**.
  - Kết quả trên màn hình: Toàn bộ mã chứng từ và ngày tháng tại bảng `#portal-search` bị ngắt thành 2 dòng, khoảng cách giữa các con số thưa bất thường.
- **Nguồn gốc**: Quy tắc CSS ép toàn cục trong `style.css`:
  ```css
  .tabular-nums, .num, .font-mono, .pos-mono, .font-receipt, [data-num] {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum" 1;
  }
  ```
  kết hợp với hơn 320 vị trí gắn class `tabular-nums` trực tiếp trong HTML.

### B. Thiếu hệ thống thành phần (Design System Components)
- Không có các lớp chuẩn như `.input`, `.select`, `.btn`, `.badge`, `.data-table`.
- Mỗi lập trình viên khi viết HTML tự ghép một chuỗi tiện ích Tailwind dài từ 10 - 25 class:
  - Một số input có `py-1 px-1.5`, số khác có `py-2 px-3`, số khác `p-2`.
  - Một số input có `text-xs` (bị ép 12px `!important`), số khác kế thừa `14px`, dẫn đến chiều cao các ô trong cùng một thanh bộ lọc bị lệch nhau (từ 32px đến 42px).

### C. Huy hiệu (Badges) và Tiêu đề cột bảng vỡ dòng
- 70 huy hiệu `px-2 py-0.5 rounded` chỉ có 2 huy hiệu mang `whitespace-nowrap`, khiến nhãn `"Hóa đơn GTGT"` bị bẻ thành `"Hóa đơn"` và `"GTGT"`, `"Phiếu nhập kho"` bị bẻ thành `"Phiếu nhập"` và `"kho"`.
- Cột tiêu đề `"TỆP ĐÍNH KÈM"` mang class `uppercase tracking-wider` bị ép bẻ thành 3 dòng trên màn hình desktop.
- Huy hiệu tệp đính kèm dùng màu lỗi `rose-50 text-rose-600` cho thông tin trung tính số lượng tệp.

### D. Xung đột ngôn ngữ và yếu tố thừa
- Bộ chọn tháng toàn cục `<input type="month" id="globalMonthPicker">` hiển thị `"November 2026"` do dùng trình điều khiển bản địa của trình duyệt.
- Thanh điều hướng xuất hiện chip `"Tra Cứu Chứng Từ"` trùng lặp với menu đang kích hoạt ở sidebar.
- Sidebar còn tồn tại huy hiệu phụ `"Portal"` và các nhãn nhóm in HOA toàn bộ kèm `tracking-wider`.

---

## 3. DANH SÁCH DỮ LIỆU CẦN LÀM SẠCH (DATA SANITIZATION)

*Lưu ý: Không can thiệp sửa đổi cấu trúc CSDL hay API backend trong đợt này. Ghi nhận để xử lý hiển thị an toàn trên giao diện và đề xuất backend bổ sung cờ phân loại.*

| Giá trị dữ liệu hiện tại | Vị trí xuất hiện | Tác động giao diện | Giải pháp xử lý Frontend | Đề xuất giải pháp Backend |
| :--- | :--- | :--- | :--- | :--- |
| `"unknown"` / `null` / `""` | Cột **Người nhập** (`created_by`) | Hiển thị chuỗi kỹ thuật xấu | Thay bằng dấu gạch ngang trung tính `"—"` | Gán giá trị mặc định khi tạo chứng từ |
| `"NCC Test Import"` | Cột **Nhà cung cấp** | Lẫn dữ liệu kiểm thử vào danh sách thực | Giữ nguyên hiển thị (không tự ý ẩn) | Thêm cột `is_test BOOLEAN DEFAULT FALSE` |
| `"Test Supplier"` | Cột **Nhà cung cấp** | Lẫn dữ liệu kiểm thử vào danh sách thực | Giữ nguyên hiển thị | Thêm cờ lọc loại bỏ đơn test |
| `"Admin Test"` | Cột **Người nhập** | Dữ liệu nhân viên kiểm thử | Giữ nguyên hiển thị | Chuyển dữ liệu kiểm thử sang schema dev |
| `"Import Excel"` | Cột **Người nhập** | Không phải định danh người dùng chuẩn | Hiển thị dạng nhãn nguồn dữ liệu | Chuẩn hóa tài khoản hệ thống |

---

## 4. HÌNH ẢNH MINH CHỨNG BASELINE (#portal-search)

Toàn bộ 4 ảnh chụp kiểm thử tự động tại tab `#portal-search` trước khi sửa đổi:

1. **Desktop (1440x900) - Giao diện Sáng (Light Mode)**:
   - File: [baseline_portal_search_desktop_light.png](file:///C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/screenshots/baseline_portal_search_desktop_light.png)
   - *Chi tiết thấy rõ: Mã chứng từ và ngày tháng bị ngắt 2 dòng, khoảng cách chữ số thưa, nút Xuất Excel màu emerald, huy hiệu GTGT vỡ 2 dòng, header Tệp đính kèm vỡ 3 dòng.*

2. **Desktop (1440x900) - Giao diện Tối (Dark Mode)**:
   - File: [baseline_portal_search_desktop_dark.png](file:///C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/screenshots/baseline_portal_search_desktop_dark.png)
   - *Chi tiết thấy rõ: Tương phản nền tối với bảng dữ liệu, các vấn đề ngắt dòng tương tự bản sáng.*

3. **Mobile (390x844) - Giao diện Sáng (Light Mode)**:
   - File: [baseline_portal_search_mobile_light.png](file:///C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/screenshots/baseline_portal_search_mobile_light.png)
   - *Chi tiết thấy rõ: Thẻ dạng card trên mobile bị vỡ mã `CT-...-K001` và ngày nhận thành 2 dòng, các ô filter lệch chiều cao.*

4. **Mobile (390x844) - Giao diện Tối (Dark Mode)**:
   - File: [baseline_portal_search_mobile_dark.png](file:///C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/screenshots/baseline_portal_search_mobile_dark.png)
   - *Chi tiết thấy rõ: Hiển thị mobile dark mode với các thẻ chứng từ rời rạc.*

---

## 5. KẾ HOẠCH TRIỂN KHAI THEO GIAI ĐOẠN

- [x] **Giai đoạn 0: Đo Baseline** (Đã hoàn tất, chưa sửa code sản phẩm).
- [ ] **Giai đoạn 1: Sửa lỗi số bị bè** (Quy ước `.num` dùng `Inter` + `tnum`, `.code` dùng `JetBrains Mono`, bảo vệ chữ số mặc định Estedad).
- [ ] **Giai đoạn 2: Hệ điều khiển biểu mẫu & Nút** (`.field`, `.input`, `.select`, `.btn-*`, loại bỏ nút emerald & emoji trong option).
- [ ] **Giai đoạn 3: Hệ bảng, Huy hiệu & Dữ liệu** (`.data-table`, `.badge-*`, `.file-chip`, các hàm tiện ích `cellCode`, `cellDate`, `cellPerson`...).
- [ ] **Giai đoạn 4: Header & Sidebar** (Chuẩn hóa chiều cao 40px, tiếng Việt "Tháng 11/2026", dọn dẹp nhãn thừa).
- [ ] **Giai đoạn 5: Khung trang thống nhất** (`.page-header`, `.filter-bar`, `.table-card`).
- [ ] **Giai đoạn 6: Áp dụng toàn bộ ứng dụng & Dọn dẹp `!important`**.
