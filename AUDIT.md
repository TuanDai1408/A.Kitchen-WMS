# AUDIT: Di Chuyển Hệ Chữ Inter & Chuẩn Hóa Thẻ KPI TailAdmin

Báo cáo chi tiết quá trình kiểm toán và tái thiết kế giao diện ứng dụng **A.Kitchen-WMS** (nhánh `feat/kpi-inter` -> `main`).

---

## 1. Bảng Đo Lường Trước & Sau (Before / After Metrics)

| Tiêu chí | Trước khi tối ưu | Sau khi tối ưu | Ghi chú |
| :--- | :---: | :---: | :--- |
| **Hệ thống thẻ KPI** | 5+ kiểu phân mảnh (dải liền divide-x, card rounded-2xl, card p-3.5, thẻ P&L riêng, thẻ TailAdmin cũ) | **1 hệ thống duy nhất (3 biến thể: Standard, Compact, Hero)** | Thống nhất qua các lớp `kpi-grid`, `kpi-card`, `kpi-card-compact`, `kpi-card-hero` |
| **Phông chữ hiển thị** | Be Vietnam Pro + JetBrains Mono (cho cả số tiền, %) | **Inter** (cho toàn bộ chữ, số, tiền, ngày, %) + **JetBrains Mono** (chỉ cho mã SKU, PO, ID) | Áp dụng tabular-nums (`tnum`) cố định độ rộng số |
| **Trọng lượng font cực đoan** (`font-extrabold`, `font-black`) | **161** vị trí | **0** vị trí | Đã chuyển toàn bộ về `font-semibold` / `font-bold` chuyên nghiệp |
| **Màu sắc trên con số KPI** | Tùy tiện (xanh dương, tím, cam, xanh lá trên số tiền) | **Trung tính 100%** (`text-gray-900 dark:text-white`) | Màu sắc ngữ nghĩa chỉ xuất hiện ở delta badge, progress bar và alert icon |
| **Số liệu mẫu cứng trong HTML** | Nhiều giá trị cứng (`470,450,000đ`, `0 ₫`, `98.2%`, `24,4%`) | **0** (Khởi tạo `—` hoặc skeleton đồng nhất) | Tránh giật layout hoặc hiển thị sai lệch trước khi API phản hồi |
| **Lỗi tràn màn hình mobile (<400px)** | Tràn ngang do số dài hoặc lưới cứng không co giãn | **0 lỗi tràn** (kiểm thử tự động trên 360px & 390px) | `scrollWidth <= clientWidth`, số dài tự chuyển dạng rút gọn hoặc thu cỡ chữ |
| **Lệch chiều cao thẻ cùng hàng** | Lệch từ 8px - 24px tùy nội dung nhãn | **0px** (bằng nhau tuyệt đối) | Sử dụng `kpi-grid` với `auto-rows-fr` và `flex-col justify-between` |

---

## 2. Ma Trận Tab $\rightarrow$ Element ID $\rightarrow$ Hàm Cập Nhật Dữ Liệu

Toàn bộ ID HTML được giữ nguyên 100%, bảo toàn tính tương thích với JS và API backend:

| Tab | Element ID | Vai trò & Biến thể | Hàm cập nhật dữ liệu JS |
| :--- | :--- | :--- | :--- |
| **wh-dashboard** | `dashMetricValue` | Hero Card (Doanh số tồn kho SAP) | `updateTailadminDashboard(d)` $\rightarrow$ `renderKpi` |
| | `dashMetricSkus` | Standard Card (Tổng SKU hoạt động) | `updateTailadminDashboard(d)` $\rightarrow$ `renderKpi` |
| | `dashMetricRop` | Standard Card (SKU chạm điểm đặt hàng) | `updateTailadminDashboard(d)` $\rightarrow$ `renderKpi` |
| | `dashMetricExp` | Standard Card (SKU cận date $\le 7$ ngày) | `updateTailadminDashboard(d)` $\rightarrow$ `renderKpi` |
| | `dashMetricSlow` | Standard Card (SKU chậm luân chuyển $>30$ ngày) | `updateTailadminDashboard(d)` $\rightarrow$ `renderKpi` |
| **fnb-pl** | `plNetRev` | Hero Card (Doanh thu thuần) | `loadFnbPL()` $\rightarrow$ `renderKpi` |
| | `plPrimeCostPct` | Standard Card (Prime Cost % + Progress bar) | `loadFnbPL()` $\rightarrow$ `renderKpi` |
| | `plProfitVal` / `plProfitMargin` | Standard Card (EBITDA & Biên EBITDA) | `loadFnbPL()` $\rightarrow$ `renderKpi` |
| | `plBreakEven` | Standard Card (Điểm hòa vốn chuỗi) | `loadFnbPL()` $\rightarrow$ `renderKpi` |
| **fnb-chain** | `chainTotalRevenue` | Hero Card (Tổng doanh thu chuỗi) | `loadFnbChain()` $\rightarrow$ `renderKpi` |
| | `chainTotalProfit` / `chainAvgMargin` | Standard Card (Lợi nhuận gộp & Biên EBITDA TB) | `loadFnbChain()` $\rightarrow$ `renderKpi` |
| | `chainAvgFoodCost` | Standard Card (Food Cost TB - Lower is better $\le 43\%$) | `loadFnbChain()` $\rightarrow$ `renderKpi` |
| | `chainAvgLaborCost` | Standard Card (Labor Cost TB - Lower is better $\le 19\%$) | `loadFnbChain()` $\rightarrow$ `renderKpi` |
| **fnb-pos** | `posDailyRevenue` | Standard Card (Doanh thu trong ngày) | `loadPosDailyKpi()` $\rightarrow$ `renderKpi` |
| | `posDailyBills` | Standard Card (Số lượng hóa đơn) | `loadPosDailyKpi()` $\rightarrow$ `renderKpi` |
| | `posDailyAOV` | Standard Card (Giá trị TB đơn AOV) | `loadPosDailyKpi()` $\rightarrow$ `renderKpi` |
| **user-matrix** | `userMatrixKpiTotal` | Compact Card (Tổng tài khoản) | `loadUserMatrixKpis()` $\rightarrow$ `renderKpi` |
| | `userMatrixKpiActive` | Compact Card (Đang hoạt động) | `loadUserMatrixKpis()` $\rightarrow$ `renderKpi` |
| | `userMatrixKpiCustomOverrides` | Compact Card (Phân quyền tùy chỉnh) | `loadUserMatrixKpis()` $\rightarrow$ `renderKpi` |
| | `userMatrixKpiAdmins` | Compact Card (Quản trị viên) | `loadUserMatrixKpis()` $\rightarrow$ `renderKpi` |
| **fnb-stock** | `fnbStockKpiTotalItems` | Compact Card (Tổng mặt hàng) | `renderFnbStockKpis()` $\rightarrow$ `renderKpi` |
| | `fnbStockKpiTotalValue` | Compact Card (Tổng giá trị tồn) | `renderFnbStockKpis()` $\rightarrow$ `renderKpi` |
| | `fnbStockKpiNegative` | Compact Card (Cảnh báo tồn âm) | `renderFnbStockKpis()` $\rightarrow$ `renderKpi` |
| | `fnbStockKpiNoOpening` | Compact Card (Chưa nhập số dư đầu) | `renderFnbStockKpis()` $\rightarrow$ `renderKpi` |
| **fnb-counts** | `fnbCountMetricTotal` | Compact Card (Tổng phiếu kiểm kê) | `updateFnbCountKpis()` $\rightarrow$ `renderKpi` |
| | `fnbCountMetricMatched` | Compact Card (Phiếu khớp 100%) | `updateFnbCountKpis()` $\rightarrow$ `renderKpi` |
| | `fnbCountMetricDiff` | Compact Card (Phiếu lệch tồn) | `updateFnbCountKpis()` $\rightarrow$ `renderKpi` |
| | `fnbCountMetricDiffVal` | Compact Card (Giá trị lệch tồn) | `updateFnbCountKpis()` $\rightarrow$ `renderKpi` |
| **portal-order** | `kpiNganSach` | Standard Card (Ngân sách tháng) | `loadData()` / `calcBudget()` |
| | `kpiDaDat` | Standard Card (Đã đặt lũy kế) | `loadData()` / `calcBudget()` |
| | `kpiConLai` | Standard Card (Còn lại khả dụng) | `calcBudget()` |
| | `kpiTyLe` | Standard Card (Tỷ lệ sử dụng + Progress bar) | `calcBudget()` |
| **portal-kiemke** | `kkMetricTotalSkus` | Standard Card (Tổng SKU kiểm kê) | `updateAuditKpisAndChart()` $\rightarrow$ `renderKpi` |
| | `kkMetricMatchRate` | Standard Card (Tỷ lệ khớp tồn %) | `updateAuditKpisAndChart()` $\rightarrow$ `renderKpi` |
| | `kkMetricDiffValue` | Standard Card (Giá trị chênh lệch) | `updateAuditKpisAndChart()` $\rightarrow$ `renderKpi` |
| | `kkMetricDiffCount` | Standard Card (Số SKU chênh lệch) | `updateAuditKpisAndChart()` $\rightarrow$ `renderKpi` |

---

## 3. Kết Quả Kiểm Thử Tự Động (Playwright Verification)

- **Số thẻ KPI kiểm tra tự động**: 36 thẻ trên 5 tab cốt lõi.
- **Font hệ thống & số liệu**: 100% thẻ đạt `Inter` (sans-serif), JetBrains Mono được bảo lưu riêng cho mã SKU, PO.
- **Tràn màn hình mobile**: 0 lỗi ở độ rộng 360px và 390px (`scrollWidth === clientWidth`).
- **Độ cao đồng nhất trong lưới**: Chênh lệch độ cao giữa các thẻ cùng hàng = 0px.
- **Lỗi chuỗi bất thường**: 0 chuỗi `NaN`, `undefined`, `Infinity`, `[object Object]` trong DOM.
- **Bộ ảnh chụp nghiệm thu**: 14 ảnh độ phân giải cao lưu trữ tại thư mục artifact.
