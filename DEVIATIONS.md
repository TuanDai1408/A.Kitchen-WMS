# DEVIATIONS: Các Quyết Định Thiết Kế & Sai Lệch Có Chủ Đích So Với Mẫu Gốc TailAdmin

Tài liệu này ghi nhận các điểm điều chỉnh (deliberate design deviations) so với template gốc **TailAdmin HTML/Tailwind v4** nhằm phù hợp với đặc thù của hệ thống **A.Kitchen-WMS** (Data App cho chuỗi nhà hàng F&B / Kho vận tại Việt Nam).

---

## 1. Lựa Chọn Hệ Chữ: `Inter` Thay Vì `Outfit`

- **Mẫu TailAdmin gốc**: Sử dụng phông chữ `Outfit` làm font chính.
- **Quyết định điều chỉnh**: Thay thế hoàn toàn bằng `Inter` (`wght@400;500;600;700`).
- **Lý do**:
  1. **Hiển thị tiếng Việt hoàn hảo**: `Inter` có bộ ký tự dấu tiếng Việt được tối ưu hóa xuất sắc ở các kích thước nhỏ (11px - 14px), không bị lỗi dính dấu, lệch trọng âm hoặc nhảy dòng như `Outfit`.
  2. **Tối ưu hiển thị số liệu & bảng biểu**: `Inter` hỗ trợ `font-variant-numeric: tabular-nums` (`tnum`) với các con số thẳng tắp theo trục dọc, rất quan trọng đối với màn hình tài chính (P&L, Doanh thu, Tồn kho).
  3. **Độ trung tính cao**: Tạo cảm giác tin cậy, nghiêm túc của một phần mềm quản trị chuỗi doanh nghiệp thay vì phong cách marketing tiêu dùng.

---

## 2. Hệ Thống Màu Thương Hiệu: Bảo Tồn Màu Tông Xanh Brand (`#19723C`) & Cam Accent (`#FF600F`)

- **Mẫu TailAdmin gốc**: Sử dụng tông màu xanh dương (`#465FFF` / indigo) làm tông brand mặc định.
- **Quyết định điều chỉnh**:
  - Giữ vững bảng màu brand của A.Kitchen:
    - Xanh lá thương hiệu: `--color-brand-600: #19723C`, `--color-brand-50: #f0fdf4`, `--color-brand-500: #22c55e`.
    - Cam điểm nhấn: `--color-accent-600: #FF600F`, `--color-accent-50: #fff7ed`.
  - Bổ sung bộ token ngữ nghĩa TailAdmin:
    - Success: `--color-success-50: #ecfdf5`, `--color-success-500: #10b981`, `--color-success-600: #059669`.
    - Error: `--color-error-50: #fef2f2`, `--color-error-500: #f43f5e`, `--color-error-600: #e11d48`.
    - Warning: `--color-warning-50: #fffbeb`, `--color-warning-500: #f59e0b`, `--color-warning-600: #d97706`.
- **Lý do**: Đảm bảo nhận diện thương hiệu nhất quán của tập đoàn ẩm thực, đồng thời chuẩn hóa chỉ báo tốt/xấu theo đúng chuẩn trực quan quốc tế.

---

## 3. Bổ Sung Biến Thể Rút Gọn (`kpi-card-compact`)

- **Mẫu TailAdmin gốc**: Chỉ cung cấp thẻ KPI kích thước tiêu chuẩn (`p-5` hoặc `p-6`), phù hợp với các trang dashboard tổng quan (overview).
- **Quyết định điều chỉnh**: Bổ sung biến thể `kpi-card-compact` (`p-4`, nhãn `text-xs font-medium`, số `text-xl font-semibold`, không icon hoặc icon thu nhỏ `size-8`).
- **Lý do**:
  - Ứng dụng WMS có nhiều màn hình dữ liệu mật độ cao (Dense Data Screens) như Quản lý tồn kho (`fnb-stock`, `wh-stock`), Quản lý phiếu đếm (`fnb-counts`).
  - Người dùng nghiệp vụ kho cần xem được cả 4 chỉ số tổng quát và danh sách hàng chục dòng bảng biểu mà không phải cuộn trang quá nhiều trên laptop 13-14 inch.

---

## 4. Cơ Chế Chỉ Số "Thấp Hơn Là Tốt" (Lower-Is-Better)

- **Mẫu TailAdmin gốc**: Mặc định tăng là xanh (mũi tên lên), giảm là đỏ (mũi tên xuống).
- **Quyết định điều chỉnh**: Thêm cờ `deltaGood` trong hàm `renderKpi`:
  - Đối với các chỉ số chi phí như Food Cost % (`chainAvgFoodCost`), Labor Cost % (`chainAvgLaborCost`), Tồn âm (`fnbStockKpiNegative`), Hao hụt:
    - Nếu giá trị nằm dưới ngưỡng mục tiêu (ví dụ $\le 43\%$ với Food Cost, $\le 19\%$ với Labor Cost), badge tự động nhận kiểu `kpi-delta-good` (xanh).
    - Nếu vượt ngưỡng cho phép, badge tự động nhận kiểu `kpi-delta-bad` (đỏ) kèm cảnh báo.
- **Lý do**: Phản ánh chính xác thực tế vận hành F&B: giảm chi phí nguyên vật liệu và nhân công là thành tích tích cực, không phải tiêu cực.

---

## 5. Rút Gọn Số Tiền Thông Minh (`fmtCompactVND`)

- **Mẫu TailAdmin gốc**: Thường hiển thị số tiền đô-la Mỹ dạng ngắn gọn (`$45.2K`, `$1.2M`).
- **Quyết định điều chỉnh**: Viết hàm chuẩn hóa `fmtCompactVND(n)` dành riêng cho Đồng Việt Nam:
  - $\ge 1.000.000.000$ VNĐ $\rightarrow$ Hiển thị dạng compact: `v: "6,35", u: "tỷ ₫"` (đặt số và đơn vị trong tooltip/aria-label đầy đủ).
  - $\ge 1.000.000$ VNĐ $\rightarrow$ Hiển thị dạng compact: `v: "450,5", u: "tr ₫"`.
  - Dưới 1 triệu VNĐ $\rightarrow$ Hiển thị số tiền chuẩn định dạng tiếng Việt kèm ký hiệu `₫`.
- **Lý do**: Số tiền VNĐ thường có 9 đến 12 chữ số. Nếu ghi đầy đủ `6.350.000.000 ₫` trên màn hình mobile 360px sẽ làm vỡ khung hoặc bị cắt chữ. Dạng rút gọn kết hợp `title` tooltip vừa đảm bảo thẩm mỹ vừa cung cấp đủ thông tin chi tiết.
