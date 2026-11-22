import fs from 'fs';

const cssPath = 'src/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Add pixel font size scale to @theme
const themeMarker = '--font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;';
const themeScale = `
  --text-xs: 12px;
  --text-xs--line-height: 16px;
  --text-sm: 14px;
  --text-sm--line-height: 20px;
  --text-base: 16px;
  --text-base--line-height: 24px;
  --text-lg: 18px;
  --text-lg--line-height: 28px;
  --text-xl: 20px;
  --text-xl--line-height: 28px;
  --text-2xl: 24px;
  --text-2xl--line-height: 32px;`;

if (!css.includes('--text-xs: 12px;')) {
  css = css.replace(themeMarker, themeMarker + themeScale);
  console.log('Added pixel font-size scale to @theme');
}

// 2. Replace the modal styles with explicit pixel values
const modalSectionMarker = '/* ==========================================================================\n   MODAL / POPUP DESIGN SYSTEM';
const modalIdx = css.indexOf('/* ==========================================================================\n   MODAL / POPUP DESIGN SYSTEM');

const newModalCss = `/* ==========================================================================
   MODAL / POPUP DESIGN SYSTEM (CHUẨN HÓA CỠ CHỮ THEO ESTEDAD SYSTEM)
   ========================================================================== */

/* 1. Modal Dialog Container */
[id$="Modal"],
[id^="modal"],
.modal-card,
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
  font-size: 14px;
}

/* 2. Tiêu đề Modal (Modal Title) - Chuẩn 18px (text-lg), semibold */
[id$="Modal"] h3,
[id^="modal"] h3,
[id$="Modal"] h4,
[id^="modal"] h4,
[id$="Modal"] .modal-title,
[id^="modal"] .modal-title,
#modalTitle,
#receiptModalTitle,
#invDetailModalTitle,
#detailItemName {
  font-size: 18px !important;
  line-height: 26px !important;
  font-weight: 600 !important;
}

/* 3. Phụ đề Modal (Modal Subtitle) - Chuẩn 13px */
[id$="Modal"] p,
[id^="modal"] p,
[id$="Modal"] .modal-subtitle,
[id^="modal"] .modal-subtitle,
#receiptModalSubtitle,
#invDetailModalSub {
  font-size: 13px !important;
  line-height: 18px !important;
}

/* 4. Thân Modal (Modal Body Container) - Kế thừa 14px */
#modalBody,
#invDetailModalBody,
[id$="Modal"] .overflow-y-auto,
[id^="modal"] .overflow-y-auto,
.modal-body {
  font-size: 14px !important;
  line-height: 1.5 !important;
}

/* 5. Nhãn trường Form trong Modal - Chuẩn 13px font-medium */
[id$="Modal"] label,
[id^="modal"] label,
[id$="Modal"] .field-label,
[id^="modal"] .field-label {
  font-size: 13px !important;
  font-weight: 500 !important;
  line-height: 18px !important;
}

/* 6. Ô nhập liệu trong Modal - Chuẩn 14px */
[id$="Modal"] input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]),
[id^="modal"] input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]),
[id$="Modal"] select,
[id^="modal"] select,
[id$="Modal"] textarea,
[id^="modal"] textarea,
[id$="Modal"] .input,
[id^="modal"] .input,
[id$="Modal"] .select,
[id^="modal"] .select {
  font-size: 14px !important;
}

/* 7. Bảng trong Modal (Modal Table Headers & Cells) - Chuẩn 13px / 14px */
[id$="Modal"] table th,
[id^="modal"] table th {
  font-size: 13px !important;
  font-weight: 500 !important;
  padding: 0.625rem 0.75rem !important;
  text-transform: none !important;
  letter-spacing: normal !important;
}

[id$="Modal"] table td,
[id^="modal"] table td {
  font-size: 14px !important;
  line-height: 1.4 !important;
  padding: 0.625rem 0.75rem !important;
}

/* 8. Huy hiệu trong Modal - Chuẩn 12px min */
[id$="Modal"] .badge,
[id^="modal"] .badge,
[id$="Modal"] [class*="rounded-full"],
[id^="modal"] [class*="rounded-full"] {
  font-size: 12px !important;
  line-height: 16px !important;
}
`;

if (modalIdx !== -1) {
  css = css.slice(0, modalIdx) + newModalCss;
} else {
  css += '\n' + newModalCss;
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Updated style.css with pixel font-sizes');
