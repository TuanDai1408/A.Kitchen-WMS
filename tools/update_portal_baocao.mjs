import fs from 'fs';

const filePath = 'public/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const baocaoStart = content.indexOf('<section id="portal-baocao"');
const baocaoEnd = content.indexOf('<section id="portal-kiemke"');

if (baocaoStart === -1 || baocaoEnd === -1) {
  console.error('Could not find portal-baocao section boundaries');
  process.exit(1);
}

const newBaocaoMarkup = `<section id="portal-baocao" class="tab-panel space-y-4">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Báo cáo suất ăn ca</h1>
            <p class="page-subtitle">Ghi nhận sản lượng suất ăn, tình hình giao nhận, nhân sự và ý kiến khách hàng</p>
          </div>
        </div>

        <!-- Top filter bar -->
        <div class="filter-bar">
          <select id="bcVung" class="hidden"></select>
          <select id="bcSite" class="hidden"></select>
          <div class="field flex-1 min-w-[200px]">
            <label class="field-label">Ca báo cáo</label>
            <select id="bcShiftSelect" name="Ca báo cáo" class="select">
              <option value="CA_SANG">Ca Sáng (06:00 - 14:00)</option>
              <option value="CA_CHIEU">Ca Chiều (14:00 - 22:00)</option>
              <option value="CA_TOI">Ca Tối / Giao Ca Đêm</option>
              <option value="CA_HC">Hành Chính / Trọn Ngày</option>
            </select>
          </div>
          <button onclick="resetBaoCao()" class="btn btn-secondary self-end">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Làm mới form
          </button>
        </div>

        <!-- Banner cảnh báo Site -->
        <div class="p-3.5 rounded-lg border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-200">
          <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 shrink-0"></i>
          <div>
            <b>Lưu ý quan trọng:</b> Chọn đúng tên <b>Điểm bán (Site)</b> đang quản lý trên thanh điều hướng phía trên trước khi ghi nhận và gửi báo cáo ca bếp.
          </div>
        </div>

        <form id="bcForm" onsubmit="return false;" class="space-y-4">
          <!-- NHÓM 1: THÔNG TIN CHUNG -->
          <div class="table-card p-5">
            <div class="pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i data-lucide="calendar" class="w-4 h-4 text-brand-600"></i>
                1. Thông tin chung
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="field">
                <label class="field-label">Ngày báo cáo <span class="text-rose-500">*</span></label>
                <input type="date" id="bcNgay" name="Ngày báo cáo" class="input">
              </div>
              <div class="field">
                <label class="field-label">Người báo cáo <span class="text-rose-500">*</span></label>
                <select id="bcNguoiBaoCao" onchange="bcNguoiBaoCaoChange()" class="select">
                  <option value="">-- Chọn người báo cáo --</option>
                  <option value="Bếp trưởng">Bếp trưởng</option>
                  <option value="Quản lý Site">Quản lý Site</option>
                  <option value="Bếp chính">Bếp chính</option>
                  <option value="Thủ kho">Thủ kho</option>
                  <option value="Giám sát vận hành">Giám sát vận hành</option>
                  <option value="Khác">Khác (Tự nhập tên)...</option>
                </select>
                <input type="text" id="bcNguoiBaoCaoKhac" placeholder="Nhập họ và tên người báo cáo mới" class="input mt-2 hidden">
              </div>
            </div>
          </div>

          <!-- NHÓM 2: SỐ LIỆU SUẤT ĂN -->
          <div class="table-card p-5">
            <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i data-lucide="utensils" class="w-4 h-4 text-accent-500"></i>
                2. Số liệu suất ăn trong ngày
              </h3>
              <span class="text-xs text-gray-500 dark:text-gray-400">Bắt buộc nhập các ô (*), có thể nhập số 0</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div class="field">
                <label class="field-label">Suất KH - Sáng <span class="text-rose-500">*</span></label>
                <input type="number" min="0" value="0" id="bcSang" name="Số suất ăn khách hàng - Sáng" oninput="tinhTongSuat()" class="input num text-right font-medium">
              </div>
              <div class="field">
                <label class="field-label">Suất KH - Trưa <span class="text-rose-500">*</span></label>
                <input type="number" min="0" value="0" id="bcTrua" name="Số suất ăn khách hàng - Trưa" oninput="tinhTongSuat()" class="input num text-right font-medium">
              </div>
              <div class="field">
                <label class="field-label">Suất KH - Chiều <span class="text-rose-500">*</span></label>
                <input type="number" min="0" value="0" id="bcChieu" name="Số suất ăn khách hàng - Chiều" oninput="tinhTongSuat()" class="input num text-right font-medium">
              </div>
              <div class="field">
                <label class="field-label">Suất Nhân viên <span class="text-rose-500">*</span></label>
                <input type="number" min="0" value="0" id="bcNhanVien" name="Số suất ăn nhân viên" oninput="tinhTongSuat()" class="input num text-right font-medium">
              </div>
              <div class="field">
                <label class="field-label">Suất ăn Hủy <span class="text-rose-500">*</span></label>
                <input type="number" min="0" value="0" id="bcHuy" name="Số suất ăn hủy" oninput="tinhTongSuat()" class="input num text-right font-medium text-rose-600 dark:text-rose-400">
              </div>
              <div class="field">
                <label class="field-label text-brand-700 dark:text-brand-400 font-semibold">Tổng suất đã xuất (Tự tính)</label>
                <input type="text" id="bcTong" value="0" disabled readonly class="input num text-right font-bold bg-brand-50/50 dark:bg-brand-950/20 text-brand-700 dark:text-brand-400 border-brand-200 dark:border-brand-800">
              </div>
              <div class="field">
                <label class="field-label">Suất Lưu mẫu <span class="text-rose-500">*</span></label>
                <input type="number" min="0" value="0" id="bcLuuMau" name="Số suất ăn lưu mẫu" class="input num text-right font-medium">
              </div>
              <div class="field">
                <label class="field-label">Suất Giáo viên (Cả ngày)</label>
                <input type="number" min="0" value="0" id="bcGiaoVien" name="Số suất ăn giáo viên (Cả ngày)" class="input num text-right font-medium">
              </div>
            </div>
          </div>

          <!-- NHÓM 3: GIAO HÀNG · NGUYÊN VẬT LIỆU · THIẾT BỊ -->
          <div class="table-card p-5">
            <div class="pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i data-lucide="truck" class="w-4 h-4 text-blue-600"></i>
                3. Giao hàng · Nguyên vật liệu · Thiết bị
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="field">
                <label class="field-label">Giờ giao suất ăn so với kế hoạch</label>
                <select id="bcGioGiao" name="Giờ giao suất ăn so với kế hoạch" class="select">
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="Đúng giờ">Đúng giờ</option>
                  <option value="Sớm hơn">Sớm hơn</option>
                  <option value="Trễ hơn">Trễ hơn</option>
                </select>
              </div>
              <div class="field">
                <label class="field-label">Lý do nếu giao trễ</label>
                <input type="text" id="bcLyDoTre" name="Lý do nếu giao trễ" placeholder="Ghi rõ lý do kẹt xe, chế biến chậm..." class="input">
              </div>
              <div class="field">
                <label class="field-label">Tình trạng NVL (thiếu hụt/đổi trả nếu có)</label>
                <textarea id="bcTinhTrangNVL" name="Tình trạng nguyên vật liệu (thiếu hụt/đổi trả nếu có)" rows="2" placeholder="Ghi nhận tình trạng rau củ, thịt cá, hạn dùng..." class="textarea"></textarea>
              </div>
              <div class="field">
                <label class="field-label">Sự cố thiết bị / máy móc (nếu có)</label>
                <textarea id="bcSuCoThietBi" name="Sự cố thiết bị/máy móc (nếu có)" rows="2" placeholder="Tủ đông, bếp gas, lò nướng, hút mùi..." class="textarea"></textarea>
              </div>
            </div>
          </div>

          <!-- NHÓM 4: DƯ / THẤT THOÁT -->
          <div class="table-card p-5">
            <div class="pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i data-lucide="trash-2" class="w-4 h-4 text-amber-600"></i>
                4. Suất ăn dư / thất thoát
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="field">
                <label class="field-label">Suất ăn dư/thất thoát - Số lượng</label>
                <input type="number" min="0" value="0" id="bcSuatDu" name="Suất ăn dư/thất thoát - số lượng" class="input num text-right">
              </div>
              <div class="field">
                <label class="field-label">Nguyên nhân dư/thất thoát</label>
                <input type="text" id="bcNguyenNhanDu" name="Nguyên nhân dư/thất thoát" placeholder="Khách báo hủy đột xuất, thời tiết..." class="input">
              </div>
            </div>
          </div>

          <!-- NHÓM 5: NHÂN SỰ -->
          <div class="table-card p-5">
            <div class="pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i data-lucide="users" class="w-4 h-4 text-indigo-600"></i>
                5. Nhân sự ca bếp
              </h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="field">
                <label class="field-label">Số nhân viên có mặt</label>
                <input type="number" min="0" value="0" id="bcStaffCoMat" name="Số nhân viên có mặt" class="input num text-right">
              </div>
              <div class="field">
                <label class="field-label">Số nhân viên vắng</label>
                <input type="number" min="0" value="0" id="bcStaffVang" name="Số nhân viên vắng" class="input num text-right">
              </div>
              <div class="field">
                <label class="field-label">Số nhân viên tăng ca</label>
                <input type="number" min="0" value="0" id="bcStaffTangCa" name="Số nhân viên tăng ca" class="input num text-right">
              </div>
              <div class="field sm:col-span-3">
                <label class="field-label">Sự cố nhân sự (nếu có)</label>
                <input type="text" id="bcSuCoNhanSu" name="Sự cố nhân sự (nếu có)" placeholder="Nghỉ ốm đột xuất, thiếu người ca tối..." class="input">
              </div>
            </div>
          </div>

          <!-- NHÓM 6: PHẢN HỒI KHÁCH HÀNG -->
          <div class="table-card p-5">
            <div class="pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i data-lucide="message-square" class="w-4 h-4 text-purple-600"></i>
                6. Phản hồi từ khách hàng
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="field">
                <label class="field-label">Số lượng khiếu nại</label>
                <input type="number" min="0" value="0" id="bcKhieuNai" name="Số lượng khiếu nại từ khách hàng" class="input num text-right">
              </div>
              <div class="field">
                <label class="field-label">Số lượng khen ngợi</label>
                <input type="number" min="0" value="0" id="bcKhenNgoi" name="Số lượng khen ngợi từ khách hàng" class="input num text-right">
              </div>
              <div class="field">
                <label class="field-label">Phân loại khiếu nại</label>
                <select id="bcPhanLoaiKhieuNai" name="Phân loại khiếu nại (nếu có)" class="select">
                  <option value="">-- Không có khiếu nại --</option>
                  <option value="Chất lượng món ăn">Chất lượng món ăn</option>
                  <option value="Vệ sinh an toàn thực phẩm">Vệ sinh an toàn thực phẩm</option>
                  <option value="Thái độ phục vụ">Thái độ phục vụ</option>
                  <option value="Số lượng/định lượng">Số lượng/định lượng</option>
                  <option value="Giao trễ">Giao trễ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div class="field">
                <label class="field-label">Mức độ nghiêm trọng</label>
                <select id="bcMucDo" name="Mức độ nghiêm trọng của phản ánh" class="select">
                  <option value="">-- Chọn mức độ --</option>
                  <option value="Thấp">Thấp</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Cao">Cao</option>
                  <option value="Nghiêm trọng">Nghiêm trọng</option>
                </select>
              </div>
              <div class="field md:col-span-2 lg:col-span-4">
                <label class="field-label">Chi tiết ý kiến phản hồi từ khách hàng</label>
                <textarea id="bcChiTietPhanHoi" name="Chi tiết ý kiến khách hàng" rows="2" placeholder="Ghi nhận cụ thể nội dung phản hồi, món ăn liên quan, thời gian..." class="textarea"></textarea>
              </div>
            </div>
          </div>

          <!-- NHÓM 7: CHI PHÍ PHÁT SINH NGOÀI KẾ HOẠCH -->
          <div class="table-card p-5">
            <div class="pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i data-lucide="banknote" class="w-4 h-4 text-emerald-600"></i>
                7. Chi phí ngoài kế hoạch
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="field">
                <label class="field-label">Có phát sinh chi phí ngoài kế hoạch?</label>
                <select id="bcPhatSinhChiPhi" name="Có phát sinh chi phí ngoài kế hoạch không?" class="select">
                  <option value="Không">Không</option>
                  <option value="Có">Có</option>
                </select>
              </div>
              <div class="field">
                <label class="field-label">Số tiền và lý do (nếu có phát sinh)</label>
                <input type="text" id="bcChiPhiLyDo" name="Số tiền và lý do (nếu có phát sinh)" placeholder="VD: 500.000đ - mua thêm bình gas khẩn cấp" class="input">
              </div>
            </div>
          </div>

          <!-- NHÓM 8: HÌNH ẢNH & ĐỀ XUẤT -->
          <div class="table-card p-5">
            <div class="pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i data-lucide="camera" class="w-4 h-4 text-rose-600"></i>
                8. Hình ảnh &amp; kiến nghị đề xuất
              </h3>
            </div>
            <div class="space-y-4">
              <div class="field">
                <label class="field-label">Hình ảnh món ăn / khu bếp trong ngày (tối đa 20MB/ảnh)</label>
                <label class="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-500 p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-center">
                  <i data-lucide="image" class="w-8 h-8 text-gray-400 mb-2"></i>
                  <span class="text-gray-700 dark:text-gray-200 text-sm font-medium">Kéo thả hoặc <b class="text-brand-600 dark:text-brand-400 underline">bấm để chọn ảnh</b></span>
                  <span class="text-xs text-gray-400 dark:text-gray-500 mt-1">Ảnh thực tế khay cơm, món ăn, vệ sinh an toàn khu bếp</span>
                  <input type="file" id="bcAnh" accept="image/*" multiple class="hidden" onchange="bcChonAnh(this)">
                </label>
                <div id="bcAnhList" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-3"></div>
              </div>
              <div class="field">
                <label class="field-label">Đề xuất / kiến nghị từ site (nếu có)</label>
                <textarea id="bcDeXuat" name="Đề xuất / kiến nghị từ site (nếu có)" rows="3" placeholder="Kiến nghị nâng cấp công cụ dụng cụ, hỗ trợ nhân sự, đổi nhà cung cấp..." class="textarea"></textarea>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pb-8">
            <button type="button" onclick="resetBaoCao()" class="btn btn-secondary">
              Làm mới form
            </button>
            <button type="button" id="btnGuiBaoCao" onclick="guiBaoCao()" class="btn btn-primary">
              <i data-lucide="send" class="w-4 h-4"></i> Gửi báo cáo ca bếp
            </button>
          </div>
        </form>
      </section>
`;

content = content.substring(0, baocaoStart) + newBaocaoMarkup + content.substring(baocaoEnd);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated portal-baocao in index.html');
