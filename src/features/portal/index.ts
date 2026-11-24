import {
  uploadedFiles,
  onChonFile,
  onSelectFiles,
  renderUploadedFiles,
  removeFile,
  resetChungTuForm,
  resetVoucherForm,
  luuChungTuForm,
  saveVoucher,
  taiTemplateChungTu,
  importExcelChungTu,
  searchVouchers,
  viewVoucherDetail
} from './vouchers';

import {
  bcAnhFiles,
  bcNguoiBaoCaoChange,
  tinhTongSuat,
  bcChonAnh,
  bcRenderAnh,
  bcXoaAnh,
  resetBaoCao,
  guiBaoCao,
  submitCateringReport
} from './catering-report';

import {
  auditRawItems,
  auditItems,
  loadAudit,
  populateAuditFilters,
  onAuditNganhChange,
  filterAuditItems,
  onKkDiscrepancyFilterChange,
  resetAuditFilters,
  updateAuditCounts,
  renderAuditList,
  onAuditChange,
  saveAudit,
  exportAuditExcel
} from './audit';

import {
  fmtDate,
  cellCode,
  cellDate,
  cellBadge,
  cellFiles,
  cellPerson,
  cellSite
} from './helpers';

import { escapeHtml } from '@/ts/utils/formatters';

export * from './types';
export * from './helpers';
export * from './vouchers';
export * from './catering-report';
export * from './audit';

// Bind to window for HTML inline event handlers & backwards compatibility
if (typeof window !== 'undefined') {
  const w = window as any;

  // Vouchers
  w.uploadedFiles = uploadedFiles;
  w.onChonFile = onChonFile;
  w.onSelectFiles = onSelectFiles;
  w.renderUploadedFiles = renderUploadedFiles;
  w.removeFile = removeFile;
  w.resetChungTuForm = resetChungTuForm;
  w.resetVoucherForm = resetVoucherForm;
  w.luuChungTuForm = luuChungTuForm;
  w.saveVoucher = saveVoucher;
  w.taiTemplateChungTu = taiTemplateChungTu;
  w.importExcelChungTu = importExcelChungTu;
  w.searchVouchers = searchVouchers;
  w.viewVoucherDetail = viewVoucherDetail;

  // Catering Report
  w.bcAnhFiles = bcAnhFiles;
  w.bcNguoiBaoCaoChange = bcNguoiBaoCaoChange;
  w.tinhTongSuat = tinhTongSuat;
  w.bcChonAnh = bcChonAnh;
  w.bcRenderAnh = bcRenderAnh;
  w.bcXoaAnh = bcXoaAnh;
  w.resetBaoCao = resetBaoCao;
  w.guiBaoCao = guiBaoCao;
  w.submitCateringReport = submitCateringReport;

  // Audit
  w.auditRawItems = auditRawItems;
  w.auditItems = auditItems;
  w.loadAudit = loadAudit;
  w.populateAuditFilters = populateAuditFilters;
  w.onAuditNganhChange = onAuditNganhChange;
  w.filterAuditItems = filterAuditItems;
  w.onKkDiscrepancyFilterChange = onKkDiscrepancyFilterChange;
  w.resetAuditFilters = resetAuditFilters;
  w.updateAuditCounts = updateAuditCounts;
  w.renderAuditList = renderAuditList;
  w.onAuditChange = onAuditChange;
  w.saveAudit = saveAudit;
  w.exportAuditExcel = exportAuditExcel;

  // Formatters & Cells
  w.fmtDate = fmtDate;
  w.cellCode = cellCode;
  w.cellDate = cellDate;
  w.cellBadge = cellBadge;
  w.cellFiles = cellFiles;
  w.cellPerson = cellPerson;
  w.cellSite = cellSite;
  w.escapeHtml = escapeHtml;
}
