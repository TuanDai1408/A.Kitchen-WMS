import fs from 'fs';

let html = fs.readFileSync('public/index.html', 'utf8');

const targetSection = `<section id="portal-voucher" class="tab-panel space-y-4">
        <!-- Top filter bar -->
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <select id="ctVung" class="hidden"></select>
          <select id="ctSite" class="hidden"></select>
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Nghiệp vụ:</span>
            <select id="ctVoucherTypeFilter" onchange="if(typeof onCtTypeFilterChange==='function')onCtTypeFilterChange(this.value)" class="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
              <option value="ALL">Tất cả nghiệp vụ chứng từ</option>
              <option value="NHAP_NCC">Nhập mua Nhà Cung Cấp</option>
              <option value="NHAP_BTT">Nhập từ Bếp Trung Tâm</option>
              <option value="XUAT_TRA">Xuất trả Nhà Cung Cấp</option>
              <option value="DIEU_CHUYEN">Điều chuyển nội bộ</option>
            </select>
          </div>
          <button onclick="resetChungTuForm()" class="px-4 py-2 bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl flex items-center gap-1.5 border border-gray-300 dark:border-gray-700 transition-all">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Làm mới form
          </button>
        </div>

        <div class="space-y-4">
          <!-- CARD 1: IMPORT HÀNG LOẠT BẰNG EXCEL -->
          <div class="bg-white dark:bg-white/3 p-4 sm:p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-xs">
            <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-3">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <i data-lucide="file-spreadsheet" class="w-4 h-4 text-brand-600"></i>
                Import Chứng Từ Hàng Loạt Bằng File Excel
              </h3>
              <span class="text-[11px] px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 font-medium border border-brand-200/60 dark:border-brand-800/60">Mẫu chuẩn</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
              Tải file mẫu (đã có sẵn 1 dòng dữ liệu ví dụ), điền thông tin chứng từ rồi tải lên. Cột bắt buộc: <b>Site</b>, <b>Loại hóa đơn</b>. Định dạng ngày: <code class="bg-gray-100 dark:bg-gray-800/80 px-1 py-0.5 rounded text-gray-700 dark:text-gray-200 tabular-nums">yyyy-mm-dd</code>.<br>
              Cột <b>"Link ảnh (Drive)"</b>: dán liên kết Google Drive chia sẻ quyền xem để hệ thống tự động trích xuất xem ảnh trực tiếp.
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <button onclick="taiTemplateChungTu()" class="px-3.5 py-2 bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold rounded-lg text-xs flex items-center gap-2 border border-gray-300 dark:border-gray-700 shadow-xs transition-all">
                <i data-lucide="download" class="w-3.5 h-3.5 text-gray-600 dark:text-gray-300"></i>
                Tải Template Excel Mẫu
              </button>
              <label class="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all">
                <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                <span>Chọn File &amp; Import Excel</span>
                <input type="file" id="ctImportFile" accept=".xlsx, .xls" class="hidden" onchange="importExcelChungTu(this)">
              </label>
              <span id="importInfo" class="text-xs text-gray-500 dark:text-gray-400 font-medium"></span>
            </div>
            <div id="importResult" class="mt-3"></div>
          </div>

          <!-- CARD 2: NHẬP THỦ CÔNG 1 CHỨNG TỪ -->
          <div class="bg-white dark:bg-white/3 p-4 sm:p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-xs">
            <div class="pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <i data-lucide="receipt" class="w-4 h-4 text-brand-600"></i>
                Nhập Thủ Công 1 Chứng Từ Giao Nhận Hàng
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Lưu trữ hóa đơn GTGT, biên bản giao nhận, phiếu xuất kho và đính kèm tệp chứng thực vào hệ thống.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label class="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Loại hóa đơn / Chứng từ <span class="text-rose-500">*</span></label>
                <select id="ctLoai" class="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"></select>
              </div>
              <div>
                <label class="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Nhà cung cấp / Đối tác</label>
                <input type="text" id="ctNCC" placeholder="VD: Công ty TNHH Thực Phẩm ABC" class="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs">
              </div>
              <div>
                <label class="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Ngày xuất hóa đơn <span class="text-rose-500">*</span></label>
                <input type="date" id="ctNgayXuat" class="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg tabular-nums bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs font-mono">
              </div>
              <div>
                <label class="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Ngày nhận hàng thực tế <span class="text-rose-500">*</span></label>
                <input type="date" id="ctNgayNhan" class="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg tabular-nums bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs font-mono">
              </div>
              <div>
                <label class="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Tên người giao hàng</label>
                <input type="text" id="ctNguoiGiao" placeholder="Tên tài xế / người giao hàng..." class="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs">
              </div>
              <div>
                <label class="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Tên người nhận hàng</label>
                <input type="text" id="ctNguoiNhan" placeholder="Tên thủ kho / bếp trưởng..." class="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs">
              </div>
              <div class="md:col-span-2 lg:col-span-3">
                <label class="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Ghi chú bổ sung</label>
                <textarea id="ctGhiChu" rows="2" placeholder="Ghi chú thêm về quy cách, bao bì, số lượng thực nhận..." class="w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"></textarea>
              </div>
              <div class="md:col-span-2 lg:col-span-3">
                <label class="font-semibold text-gray-700 dark:text-gray-300 block mb-1">File đính kèm (nhiều file — ảnh, PDF, Excel, Word · tối đa 20MB/tệp)</label>
                <label class="border border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-500 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 dark:bg-gray-900/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/40 transition-all text-center">
                  <i data-lucide="upload-cloud" class="w-6 h-6 text-brand-600 mb-1.5"></i>
                  <span class="text-xs text-gray-700 dark:text-gray-200 font-semibold">Kéo thả hoặc <b class="text-brand-600 underline">bấm để chọn file chứng từ</b></span>
                  <span class="text-[10.5px] text-gray-400 dark:text-gray-500 mt-0.5">Hỗ trợ JPG, PNG, PDF, XLSX, DOCX (Tối đa 20MB/file)</span>
                  <input type="file" id="ctFile" multiple class="hidden" onchange="onChonFile(this)">
                </label>
                <div id="ctFileList" class="space-y-1.5 mt-2.5"></div>
              </div>
            </div>

            <div class="flex justify-end gap-2.5 mt-5 pt-3.5 border-t border-gray-100 dark:border-gray-800">
              <button type="button" onclick="resetChungTuForm()" class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all">
                Hủy / Làm mới
              </button>
              <button type="button" id="btnLuuCT" onclick="luuChungTuForm()" class="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-all">
                <i data-lucide="save" class="w-4 h-4"></i> Lưu chứng từ
              </button>
            </div>
          </div>
        </div>
      </section>`;

const replacement = `<section id="portal-voucher" class="tab-panel space-y-5">
        <div class="page-header">
          <div>
            <h1 class="page-title">Tạo & duyệt chứng từ</h1>
            <p class="page-subtitle">Nhập chứng từ giao nhận hàng thủ công hoặc tải lên hàng loạt bằng tệp Excel</p>
          </div>
        </div>

        <div class="filter-bar">
          <select id="ctVung" class="hidden"></select>
          <select id="ctSite" class="hidden"></select>
          <div class="field">
            <label for="ctVoucherTypeFilter" class="field-label">Nghiệp vụ chứng từ</label>
            <select id="ctVoucherTypeFilter" onchange="if(typeof onCtTypeFilterChange==='function')onCtTypeFilterChange(this.value)" class="select">
              <option value="ALL">Tất cả nghiệp vụ chứng từ</option>
              <option value="NHAP_NCC">Nhập mua Nhà Cung Cấp</option>
              <option value="NHAP_BTT">Nhập từ Bếp Trung Tâm</option>
              <option value="XUAT_TRA">Xuất trả Nhà Cung Cấp</option>
              <option value="DIEU_CHUYEN">Điều chuyển nội bộ</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="resetChungTuForm()" class="btn btn-secondary w-full sm:w-auto">
              <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
              <span>Làm mới form</span>
            </button>
          </div>
        </div>

        <div class="space-y-5">
          <!-- CARD 1: IMPORT HÀNG LOẠT BẰNG EXCEL -->
          <div class="table-card p-5">
            <div class="flex items-center justify-between pb-3.5 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i data-lucide="file-spreadsheet" class="w-5 h-5 text-brand-600 dark:text-brand-400"></i>
                Import chứng từ hàng loạt bằng file Excel
              </h3>
              <span class="badge badge-brand">Mẫu chuẩn</span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              Tải file mẫu (đã có sẵn 1 dòng dữ liệu ví dụ), điền thông tin chứng từ rồi tải lên. Cột bắt buộc: <b>Site</b>, <b>Loại hóa đơn</b>. Định dạng ngày: <code class="code">yyyy-mm-dd</code>.<br>
              Cột <b>"Link ảnh (Drive)"</b>: dán liên kết Google Drive chia sẻ quyền xem để hệ thống tự động trích xuất xem ảnh trực tiếp.
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <button onclick="taiTemplateChungTu()" class="btn btn-secondary">
                <i data-lucide="download" class="w-4 h-4"></i>
                <span>Tải template Excel</span>
              </button>
              <label class="btn btn-primary cursor-pointer">
                <i data-lucide="upload" class="w-4 h-4"></i>
                <span>Chọn file & import</span>
                <input type="file" id="ctImportFile" accept=".xlsx, .xls" class="hidden" onchange="importExcelChungTu(this)">
              </label>
              <span id="importInfo" class="text-sm text-gray-500 dark:text-gray-400 font-medium"></span>
            </div>
            <div id="importResult" class="mt-3"></div>
          </div>

          <!-- CARD 2: NHẬP THỦ CÔNG 1 CHỨNG TỪ -->
          <div class="table-card p-5">
            <div class="pb-3.5 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i data-lucide="receipt" class="w-5 h-5 text-brand-600 dark:text-brand-400"></i>
                Nhập thủ công 1 chứng từ giao nhận hàng
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Lưu trữ hóa đơn GTGT, biên bản giao nhận, phiếu xuất kho và đính kèm tệp chứng thực vào hệ thống.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="field">
                <label for="ctLoai" class="field-label">Loại hóa đơn / Chứng từ <span class="text-rose-500">*</span></label>
                <select id="ctLoai" class="select"></select>
              </div>
              <div class="field">
                <label for="ctNCC" class="field-label">Nhà cung cấp / Đối tác</label>
                <input type="text" id="ctNCC" placeholder="VD: Công ty TNHH Thực Phẩm ABC" class="input">
              </div>
              <div class="field">
                <label for="ctNgayXuat" class="field-label">Ngày xuất hóa đơn <span class="text-rose-500">*</span></label>
                <input type="date" id="ctNgayXuat" class="input">
              </div>
              <div class="field">
                <label for="ctNgayNhan" class="field-label">Ngày nhận hàng thực tế <span class="text-rose-500">*</span></label>
                <input type="date" id="ctNgayNhan" class="input">
              </div>
              <div class="field">
                <label for="ctNguoiGiao" class="field-label">Tên người giao hàng</label>
                <input type="text" id="ctNguoiGiao" placeholder="Tên tài xế / người giao hàng..." class="input">
              </div>
              <div class="field">
                <label for="ctNguoiNhan" class="field-label">Tên người nhận hàng</label>
                <input type="text" id="ctNguoiNhan" placeholder="Tên thủ kho / bếp trưởng..." class="input">
              </div>
              <div class="field md:col-span-2 lg:col-span-3">
                <label for="ctGhiChu" class="field-label">Ghi chú bổ sung</label>
                <textarea id="ctGhiChu" rows="2" placeholder="Ghi chú thêm về quy cách, bao bì, số lượng thực nhận..." class="textarea"></textarea>
              </div>
              <div class="field md:col-span-2 lg:col-span-3">
                <label class="field-label">File đính kèm (nhiều file — ảnh, PDF, Excel, Word · tối đa 20MB/tệp)</label>
                <label class="border border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-500 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 dark:bg-gray-900/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/40 transition-all text-center">
                  <i data-lucide="upload-cloud" class="w-6 h-6 text-brand-600 dark:text-brand-400 mb-1.5"></i>
                  <span class="text-sm text-gray-700 dark:text-gray-200 font-medium">Kéo thả hoặc <b class="text-brand-600 dark:text-brand-400 underline">bấm để chọn file chứng từ</b></span>
                  <span class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Hỗ trợ JPG, PNG, PDF, XLSX, DOCX (Tối đa 20MB/file)</span>
                  <input type="file" id="ctFile" multiple class="hidden" onchange="onChonFile(this)">
                </label>
                <div id="ctFileList" class="space-y-1.5 mt-2.5"></div>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button type="button" onclick="resetChungTuForm()" class="btn btn-secondary">
                Hủy / Làm mới
              </button>
              <button type="button" id="btnLuuCT" onclick="luuChungTuForm()" class="btn btn-primary">
                <i data-lucide="save" class="w-4 h-4"></i>
                <span>Lưu chứng từ</span>
              </button>
            </div>
          </div>
        </div>
      </section>`;

const norm = s => s.replace(/\r\n/g, '\n');
const normHtml = norm(html);
const normTarget = norm(targetSection);

if (!normHtml.includes(normTarget)) {
  console.error('Target section not found in index.html');
  process.exit(1);
}

const isCRLF = html.includes('\r\n');
const rep = isCRLF ? replacement.replace(/\n/g, '\r\n') : replacement;
const targ = isCRLF ? targetSection.replace(/\n/g, '\r\n') : targetSection;

html = html.replace(targ, rep);
fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Successfully updated portal-voucher!');
