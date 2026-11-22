import fs from 'fs';

// =========================================================================
// 1. UPDATE src/css/style.css
// =========================================================================
const cssPath = 'src/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

const modalCssMarker = '/* ==========================================================================\n   MODAL / POPUP DESIGN SYSTEM (CHUẨN HÓA CỠ CHỮ THEO ESTEDAD SYSTEM)\n   ========================================================================== */';

if (!css.includes('MODAL / POPUP DESIGN SYSTEM')) {
  const modalCss = `
/* ==========================================================================
   MODAL / POPUP DESIGN SYSTEM (CHUẨN HÓA CỠ CHỮ THEO ESTEDAD SYSTEM)
   ========================================================================== */

/* 1. Modal Dialog Container */
[id$="Modal"],
[id^="modal"],
#generalModal,
#addUserModal,
#editUserModal,
#createReceiptModal,
#modalManualReceipt,
#createWasteModal,
#googleAuthModal,
#userProfileModal,
#siteSelectorModal,
#requestAccessModal,
#adminApprovalModal,
#roleSwitcherModal,
#modalInventoryDetail,
#modalWhItemHistory,
#modalWhItemBatches,
#modalEditItem,
#modalFastReceipt,
#modalFastIssue {
  font-family: var(--font-sans);
}

/* 2. Tiêu đề Modal (Modal Title) - Chuẩn 18px (text-lg), semibold */
[id$="Modal"] h3,
[id^="modal"] h3,
[id$="Modal"] h4,
[id^="modal"] h4,
#modalTitle,
#receiptModalTitle,
#invDetailModalTitle,
#detailItemName {
  font-size: 1.125rem !important; /* 18px */
  line-height: 1.625rem !important;
  font-weight: 600 !important;
}

/* 3. Phụ đề Modal (Modal Subtitle) - Chuẩn 13px */
[id$="Modal"] p,
[id^="modal"] p,
[id$="Modal"] .modal-subtitle,
[id^="modal"] .modal-subtitle,
#receiptModalSubtitle,
#invDetailModalSub {
  font-size: 0.8125rem !important; /* 13px */
  line-height: 1.25rem !important;
}

/* 4. Thân Modal (Modal Body) - Chuẩn 14px (text-sm) */
#modalBody,
#invDetailModalBody,
[id$="Modal"] .overflow-y-auto,
[id^="modal"] .overflow-y-auto {
  font-size: 0.875rem !important; /* 14px */
  line-height: 1.5 !important;
}

/* 5. Nhãn trường Form trong Modal - Chuẩn 13px font-medium */
[id$="Modal"] label,
[id^="modal"] label,
[id$="Modal"] .field-label,
[id^="modal"] .field-label {
  font-size: 0.8125rem !important; /* 13px */
  font-weight: 500 !important;
  line-height: 1.25rem !important;
}

/* 6. Ô nhập liệu trong Modal - Chuẩn 14px */
[id$="Modal"] input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]),
[id^="modal"] input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]),
[id$="Modal"] select,
[id^="modal"] select,
[id$="Modal"] textarea,
[id^="modal"] textarea {
  font-size: 0.875rem !important; /* 14px */
}

/* 7. Bảng trong Modal (Modal Table Headers & Cells) - Chuẩn 13px / 14px */
[id$="Modal"] table th,
[id^="modal"] table th {
  font-size: 0.8125rem !important; /* 13px */
  font-weight: 600 !important;
  padding: 0.625rem 0.75rem !important;
  text-transform: none !important;
  letter-spacing: normal !important;
}

[id$="Modal"] table td,
[id^="modal"] table td {
  font-size: 0.875rem !important; /* 14px */
  line-height: 1.4 !important;
  padding: 0.625rem 0.75rem !important;
}

/* 8. Huy hiệu trong Modal - Không dưới 12px */
[id$="Modal"] .badge,
[id^="modal"] .badge {
  font-size: 0.75rem !important; /* 12px */
  line-height: 1rem !important;
}
`;
  css += modalCss;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Appended modal typography styles to src/css/style.css');
}

// =========================================================================
// 2. UPDATE public/index.html
// =========================================================================
const htmlPath = 'public/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace generalModal title and body classes
html = html.replace(
  '<h3 id="modalTitle" class="font-semibold text-sm text-gray-900 dark:text-white">Chi tiết</h3>',
  '<h3 id="modalTitle" class="font-semibold text-lg text-gray-900 dark:text-white">Chi tiết</h3>'
);
html = html.replace(
  '<div id="modalBody" class="p-5 overflow-y-auto text-xs space-y-4"></div>',
  '<div id="modalBody" class="p-5 overflow-y-auto text-sm space-y-4"></div>'
);

// Replace createWasteModal title
html = html.replace(
  '<h3 class="font-semibold text-sm text-gray-900 dark:text-white">Ghi Biên Bản Hủy Hàng / Hao Hụt</h3>',
  '<h3 class="font-semibold text-lg text-gray-900 dark:text-white">Ghi Biên Bản Hủy Hàng / Hao Hụt</h3>'
);

// Replace modalEditItem title and body
html = html.replace(
  '<h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">',
  '<h3 class="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">'
);
html = html.replace(
  '<div class="space-y-3.5 text-xs">',
  '<div class="space-y-4 text-sm">'
);

// Replace modalFastReceipt title & modalFastIssue title
html = html.replace(
  '<h3 class="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">\n          <i data-lucide="package-plus" class="w-4 h-4 text-emerald-600"></i> Nhập Kho Lô Mới',
  '<h3 class="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">\n          <i data-lucide="package-plus" class="w-5 h-5 text-brand-600"></i> Nhập Kho Lô Mới'
);
html = html.replace(
  '<h3 class="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">\n          <i data-lucide="package-minus" class="w-4 h-4 text-amber-600"></i> Xuất Kho Gia Vị',
  '<h3 class="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">\n          <i data-lucide="package-minus" class="w-5 h-5 text-accent-600"></i> Xuất Kho Gia Vị'
);

// Replace roleSwitcherModal title
html = html.replace(
  '<h4 class="font-semibold text-sm text-gray-900 dark:text-white">Chuyển Vai Trò Kiểm Thử</h4>',
  '<h3 class="font-semibold text-lg text-gray-900 dark:text-white">Chuyển Vai Trò Kiểm Thử</h3>'
);
html = html.replace(
  '<p class="text-[10.5px] text-gray-400">Kiểm tra ngay giao diện phân quyền từng vị trí</p>',
  '<p class="text-xs text-gray-500 dark:text-gray-400">Kiểm tra ngay giao diện phân quyền từng vị trí</p>'
);

// Replace invDetailModal
html = html.replace(
  '<h3 id="invDetailModalTitle" class="font-semibold text-sm text-gray-900 dark:text-white">Chi Tiết Chứng Từ</h3>',
  '<h3 id="invDetailModalTitle" class="font-semibold text-lg text-gray-900 dark:text-white">Chi Tiết Chứng Từ</h3>'
);
html = html.replace(
  '<p id="invDetailModalSub" class="text-[10.5px] text-gray-400">A.Kitchen WMS Database</p>',
  '<p id="invDetailModalSub" class="text-xs text-gray-500 dark:text-gray-400">A.Kitchen WMS Database</p>'
);
html = html.replace(
  '<div id="invDetailModalBody" class="p-5 overflow-y-auto space-y-3 text-xs custom-scrollbar">',
  '<div id="invDetailModalBody" class="p-5 overflow-y-auto space-y-3 text-sm custom-scrollbar">'
);

// Replace createReceiptModal body text-xs with text-sm
html = html.replace(
  '<div class="p-6 overflow-y-auto space-y-4 text-xs custom-scrollbar">',
  '<div class="p-6 overflow-y-auto space-y-4 text-sm custom-scrollbar">'
);

// Replace modalManualReceipt body text-xs with text-sm
html = html.replace(
  '<div class="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs custom-scrollbar">',
  '<div class="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm custom-scrollbar">'
);

// Replace modalInventoryDetail body text-xs with text-sm
html = html.replace(
  '<div class="overflow-y-auto space-y-5 py-4 custom-scrollbar flex-1 text-xs">',
  '<div class="overflow-y-auto space-y-5 py-4 custom-scrollbar flex-1 text-sm">'
);

// Replace requestAccessModal body text-xs with text-sm
html = html.replace(
  '<div class="p-6 space-y-4 text-xs">',
  '<div class="p-6 space-y-4 text-sm">'
);

// Replace userProfileModal body text-xs with text-sm
html = html.replace(
  '<div class="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs custom-scrollbar">',
  '<div class="p-5 sm:p-6 overflow-y-auto space-y-4 text-sm custom-scrollbar">'
);

// Replace all tables in modals from <table class="w-full text-left text-xs border-collapse"> to <table class="data-table">
html = html.replaceAll('<table class="w-full text-left text-xs border-collapse">', '<table class="data-table">');
html = html.replaceAll('<table class="w-full text-left text-xs" id="whHistTable">', '<table class="data-table" id="whHistTable">');
html = html.replaceAll('<table class="w-full text-left text-xs" id="whBatchesTable">', '<table class="data-table" id="whBatchesTable">');
html = html.replaceAll('<table class="w-full text-left text-xs">', '<table class="data-table">');
html = html.replaceAll('<table class="w-full text-xs">', '<table class="data-table">');
html = html.replaceAll('<table class="data-table text-xs">', '<table class="data-table">');

// Clean up remaining tiny text in tabs
html = html.replaceAll('text-[9px]', 'text-xs');
html = html.replaceAll('text-[9.5px]', 'text-xs');
html = html.replaceAll('text-[10px]', 'text-xs');
html = html.replaceAll('text-[10.5px]', 'text-xs');
html = html.replaceAll('text-[11px]', 'text-xs');

// Upgrade viewVoucherDetail render in JS
const oldVoucherDetailTarget = `            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                <div>Mã: <b class="tabular-nums">\${v.voucher_code}</b></div>
                <div>Loại: <b>\${v.invoice_type}</b></div>
                <div>Site: <b>\${v.site_name}</b></div>
                <div>Nhà cung cấp: <b>\${v.supplier_name || '—'}</b></div>
              </div>
              <div><b>Ghi chú:</b> <p class="text-gray-600 dark:text-gray-300 mt-1">\${v.note || 'Không có ghi chú'}</p></div>
              <div>
                <b>Tệp đính kèm:</b>
                <div class="mt-2 space-y-1">
                  \${v.files && v.files.length ? v.files.map(f => \`
                    <div class="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800/80 rounded-lg">
                      <span>📎 \${f.file_name}</span>
                      <a href="\${f.file_link}" target="_blank" class="px-2 py-1 bg-white border border-gray-300 dark:border-gray-700 rounded font-bold text-brand-700">Mở</a>
                    </div>
                  \`).join('') : '<p class="text-gray-400 dark:text-gray-500">Không có tệp đính kèm</p>'}
                </div>
              </div>
            </div>`;

const newVoucherDetailReplacement = `            <div class="space-y-4 text-sm">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200 dark:border-gray-800 text-sm">
                <div><span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Mã chứng từ:</span> <span class="code font-semibold text-brand-600 dark:text-brand-400 text-sm">\${v.voucher_code}</span></div>
                <div><span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Loại chứng từ:</span> <span class="font-medium text-gray-900 dark:text-white">\${v.invoice_type}</span></div>
                <div><span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Điểm nhận:</span> <span class="font-medium text-gray-900 dark:text-white">\${v.site_name}</span></div>
                <div><span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Nhà cung cấp:</span> <span class="font-medium text-gray-900 dark:text-white">\${v.supplier_name || '—'}</span></div>
              </div>
              <div class="p-3.5 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Ghi chú:</span>
                <p class="text-gray-800 dark:text-gray-200">\${v.note || 'Không có ghi chú'}</p>
              </div>
              <div>
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-2">Tệp tài liệu đính kèm:</span>
                <div class="space-y-2">
                  \${v.files && v.files.length ? v.files.map(f => \`
                    <div class="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800">
                      <span class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <i data-lucide="file-text" class="w-4 h-4 text-brand-500"></i>
                        <span>\${f.file_name}</span>
                      </span>
                      <a href="\${f.file_link}" target="_blank" class="btn btn-sm btn-secondary">Mở tệp</a>
                    </div>
                  \`).join('') : '<p class="text-sm text-gray-400 dark:text-gray-500 italic p-3 text-center bg-gray-50 dark:bg-gray-800/30 rounded-xl">Không có tệp đính kèm</p>'}
                </div>
              </div>
            </div>`;

if (html.includes(oldVoucherDetailTarget)) {
  html = html.replace(oldVoucherDetailTarget, newVoucherDetailReplacement);
  console.log('Upgraded viewVoucherDetail markup in JS');
} else {
  // Try CRLF variant
  const oldVoucherDetailCrlf = oldVoucherDetailTarget.replace(/\n/g, '\r\n');
  if (html.includes(oldVoucherDetailCrlf)) {
    html = html.replace(oldVoucherDetailCrlf, newVoucherDetailReplacement.replace(/\n/g, '\r\n'));
    console.log('Upgraded viewVoucherDetail markup in JS (CRLF)');
  }
}

// Upgrade viewOrderDetail render in JS
html = html.replaceAll('<table class="w-full text-xs">\n                  <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">Mã</th>', '<table class="data-table">\n                  <thead><tr><th class="col-code">Mã</th>');
html = html.replaceAll('<table class="w-full text-xs">\r\n                  <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">Mã</th>', '<table class="data-table">\r\n                  <thead><tr><th class="col-code">Mã</th>');

// Upgrade site cards in window.renderSitesOptions
html = html.replaceAll('<div class="font-bold text-xs text-gray-900 dark:text-white truncate flex items-center gap-2">', '<div class="font-semibold text-sm text-gray-900 dark:text-white truncate flex items-center gap-2">');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully upgraded public/index.html with unified typography!');
