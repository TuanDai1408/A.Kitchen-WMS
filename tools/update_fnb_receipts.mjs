import fs from 'fs';

const filePath = 'public/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const receiptsStart = content.indexOf('<section id="fnb-receipts"');
const receiptsEnd = content.indexOf('<section id="fnb-waste"');

if (receiptsStart === -1 || receiptsEnd === -1) {
  console.error('Could not find fnb-receipts section boundaries');
  process.exit(1);
}

const newReceiptsMarkup = `<section id="fnb-receipts" class="tab-panel space-y-4">
        <!-- Sub-nav bar -->
        <div class="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 w-fit max-w-full overflow-x-auto shadow-theme-xs select-none">
          <button onclick="switchTab('wh-dashboard')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><i data-lucide="layout-dashboard" class="w-4 h-4 text-emerald-500"></i><span>Tổng quan kho</span></button>
          <button onclick="switchTab('fnb-counts')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><i data-lucide="clipboard-check" class="w-4 h-4 text-brand-600"></i><span>Kiểm kê hằng ngày</span></button>
          <button onclick="switchTab('fnb-receipts')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shrink-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs border border-gray-200 dark:border-gray-700"><i data-lucide="package-plus" class="w-4 h-4 text-indigo-500"></i><span>Nhập hàng</span></button>
          <button onclick="switchTab('fnb-waste')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><i data-lucide="trash-2" class="w-4 h-4 text-rose-500"></i><span>Hủy hàng &amp; hao hụt</span></button>
        </div>

        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Nhập hàng điểm bán</h1>
            <p class="page-subtitle">Tiếp nhận đơn hàng PO/PR từ nhà cung cấp &amp; bếp trung tâm, kiểm đếm thực tế và cập nhật tồn kho</p>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <select id="fnbReceiptFilterSite" class="hidden"><option value="K001">K001</option></select>
            <button onclick="openManualReceiptModal()" class="btn btn-primary" title="Tạo phiếu nhập hàng thủ công cho các mặt hàng chưa có PO/PR">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>Nhập hàng thủ công</span>
            </button>
          </div>
        </div>

        <!-- Sub-view Navigation Switcher (PO List vs Receipt History) -->
        <div class="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
          <button id="fnbReceiptTabBtnPo" onclick="switchFnbReceiptSubView('po')" class="btn btn-primary btn-sm">
            <i data-lucide="file-text" class="w-4 h-4"></i>
            <span>Đơn đặt hàng chờ nhập kho (PO / PR)</span>
            <span id="fnbReceiptBadgePendingCount" class="ml-1 badge badge-neutral px-1.5 py-0.2 num">0</span>
          </button>
          <button id="fnbReceiptTabBtnHistory" onclick="switchFnbReceiptSubView('history')" class="btn btn-secondary btn-sm">
            <i data-lucide="history" class="w-4 h-4"></i>
            <span>Lịch sử phiếu nhập kho điểm bán</span>
            <span id="fnbReceiptBadgeHistoryCount" class="ml-1 badge badge-neutral px-1.5 py-0.2 num">0</span>
          </button>
        </div>

        <!-- VIEW 1: DANH SÁCH ĐƠN ĐẶT HÀNG PO/PR (MẶC ĐỊNH) -->
        <div id="fnbPoListView" class="space-y-4">
          <!-- Filter Toolbar -->
          <div class="filter-bar">
            <div class="relative flex-1 min-w-[220px]">
              <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
              <input type="text" id="fnbPoSearchInput" oninput="onFnbPoSearchInput(this.value)" placeholder="Tìm số PO, nhà cung cấp, bếp..." class="input pl-9 w-full">
            </div>

            <div class="field w-48">
              <select id="fnbPoStatusFilter" onchange="loadFnbPoList()" class="select">
                <option value="">Tất cả trạng thái</option>
                <option value="OPEN" selected>Chờ nhập kho (OPEN)</option>
                <option value="COMPLETED">Đã nhập kho (COMPLETED)</option>
              </select>
            </div>

            <div class="field w-48">
              <select id="fnbPoSupplierFilter" onchange="renderFnbPoTable(document.getElementById('fnbPoSearchInput')?.value || '')" class="select">
                <option value="">Tất cả nguồn hàng</option>
                <option value="SIBA">Bếp Trung Tâm Siba</option>
                <option value="BAF">BaF Meat / MeatDeli</option>
                <option value="SPICE">Gia vị &amp; Hàng khô</option>
                <option value="VEG">Rau củ Đà Lạt</option>
              </select>
            </div>

            <button onclick="loadFnbPoList()" class="btn btn-secondary">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i> Làm mới
            </button>
            <button onclick="openManualReceiptModal()" class="btn btn-secondary" title="Nhập hàng trực tiếp cho các mặt hàng chưa có PO/PR">
              <i data-lucide="plus" class="w-4 h-4"></i> Nhập ngoài PO/PR
            </button>
          </div>

          <!-- PO Desktop Table -->
          <div class="table-card p-5">
            <div id="fnbPoSummaryText" class="text-xs text-gray-500 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800 num">
              Đang tải danh sách PO...
            </div>
            <div class="table-scroll">
              <table class="data-table">
                <thead>
                  <tr>
                    <th class="col-code">Số đơn PO / PR</th>
                    <th class="col-date">Ngày đặt</th>
                    <th>Nhà cung cấp / Bếp trung tâm</th>
                    <th class="col-num text-center">Số mặt hàng</th>
                    <th class="col-num text-right">Tổng SL đặt</th>
                    <th class="col-num text-right">Tổng tiền đặt (VNĐ)</th>
                    <th class="col-badge text-center">Trạng thái</th>
                    <th class="col-actions text-center w-32">Thao tác</th>
                  </tr>
                </thead>
                <tbody id="fnbPoTableBody">
                </tbody>
              </table>
            </div>

            <!-- PO Mobile Card View -->
            <div id="fnbPoMobileCards" class="block lg:hidden space-y-3 mt-4"></div>
          </div>
        </div>

        <!-- VIEW 2: LỊCH SỬ PHIẾU NHẬP KHO ĐIỂM BÁN -->
        <div id="fnbReceiptHistoryView" class="space-y-4 hidden">
          <!-- Toolbar -->
          <div class="filter-bar">
            <div class="text-xs text-gray-500 dark:text-gray-400 flex-1">
              Danh sách phiếu đã nhập kho tại điểm bán (nhập theo PO và nhập thủ công ngoài đơn).
            </div>
            <div class="flex items-center gap-2">
              <button onclick="loadFnbReceiptsHistory()" class="btn btn-secondary">
                <i data-lucide="refresh-cw" class="w-4 h-4"></i> Làm mới
              </button>
              <button onclick="openManualReceiptModal()" class="btn btn-primary" title="Tạo phiếu nhập hàng thủ công ngoài PO / PR">
                <i data-lucide="plus" class="w-4 h-4"></i> Nhập hàng thủ công
              </button>
            </div>
          </div>

          <!-- Receipts Table (Desktop) -->
          <div class="table-card p-5">
            <div class="table-scroll">
              <table class="data-table">
                <thead>
                  <tr>
                    <th class="col-code">Mã phiếu nhập</th>
                    <th>Điểm bán</th>
                    <th class="col-date">Ngày nhập thực tế</th>
                    <th>Nhà cung cấp / Nguồn</th>
                    <th class="col-code">Số đơn PO / HĐ</th>
                    <th class="col-num text-right">Tổng tiền nhập (VNĐ)</th>
                    <th>Người nhập</th>
                    <th class="col-actions text-center w-24">Chi tiết</th>
                  </tr>
                </thead>
                <tbody id="fnbReceiptsTableBody">
                </tbody>
              </table>
            </div>

            <!-- Receipts Mobile Card View -->
            <div id="fnbReceiptsMobileCards" class="block lg:hidden space-y-3 mt-4"></div>
          </div>
        </div>
      </section>
`;

content = content.substring(0, receiptsStart) + newReceiptsMarkup + content.substring(receiptsEnd);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated fnb-receipts in index.html');
