/**
 * Module 12: RBAC & User Management + Vouchers RBAC
 */

import {
  gUserMatrixData,
  loadUserMatrix,
  renderUserMatrixKPIs,
  filterUserMatrix,
  resolveUserFeaturePermission,
  renderUserMatrixTable,
  renderUserMatrixMobile,
  toggleUserPermission,
  bulkSetUserPermissions,
  resetUserFeaturePermission
} from './user-matrix';

import {
  openAddUserModal,
  closeAddUserModal,
  submitAddUser,
  openEditUserModal,
  closeEditUserModal,
  submitEditUserRole,
  toggleEditUserGranularFlag,
  bulkToggleEditUserGranularField,
  filterEditUserGranularList,
  resetUserAllPermsPrompt,
  resetUserRolePermissions,
  bulkSetUserPermissionsPrompt,
  openConfirmToggleUserStatusModal,
  closeConfirmToggleUserStatusModal,
  executeToggleUserStatus,
  toggleUserStatusPrompt,
  openNewUserDefaultsModal,
  closeNewUserDefaultsModal,
  toggleNewUserDefaultFlag,
  toggleAllNewUserDefaults,
  saveNewUserDefaults
} from './user-modals';

import {
  _pendingDeleteVoucherCode,
  getAppCurrentUser,
  canEditVouchers,
  canDeleteVouchers,
  openEditVoucherModal,
  closeEditVoucherModal,
  onSelectEditVoucherFiles,
  removeEditVoucherFile,
  saveEditVoucher,
  confirmDeleteVoucher,
  closeDeleteVoucherModal,
  executeDeleteVoucher,
  searchVouchers,
  viewVoucherDetail
} from './vouchers-rbac';

import { exportUserMatrixExcel } from './export';

export * from './types';
export * from './user-matrix';
export * from './user-modals';
export * from './vouchers-rbac';
export * from './export';

// Bind globals to window for HTML inline event handlers & backwards compatibility
if (typeof window !== 'undefined') {
  const w = window as any;

  // User Matrix
  w.gUserMatrixData = gUserMatrixData;
  w.loadUserMatrix = loadUserMatrix;
  w.renderUserMatrixKPIs = renderUserMatrixKPIs;
  w.filterUserMatrix = filterUserMatrix;
  w.resolveUserFeaturePermission = resolveUserFeaturePermission;
  w.renderUserMatrixTable = renderUserMatrixTable;
  w.renderUserMatrixMobile = renderUserMatrixMobile;
  w.toggleUserPermission = toggleUserPermission;
  w.bulkSetUserPermissions = bulkSetUserPermissions;
  w.resetUserFeaturePermission = resetUserFeaturePermission;

  // User Modals & Actions
  w.openAddUserModal = openAddUserModal;
  w.closeAddUserModal = closeAddUserModal;
  w.submitAddUser = submitAddUser;
  w.openEditUserModal = openEditUserModal;
  w.closeEditUserModal = closeEditUserModal;
  w.submitEditUserRole = submitEditUserRole;
  w.toggleEditUserGranularFlag = toggleEditUserGranularFlag;
  w.bulkToggleEditUserGranularField = bulkToggleEditUserGranularField;
  w.filterEditUserGranularList = filterEditUserGranularList;
  w.resetUserAllPermsPrompt = resetUserAllPermsPrompt;
  w.resetUserRolePermissions = resetUserRolePermissions;
  w.bulkSetUserPermissionsPrompt = bulkSetUserPermissionsPrompt;
  w.openConfirmToggleUserStatusModal = openConfirmToggleUserStatusModal;
  w.closeConfirmToggleUserStatusModal = closeConfirmToggleUserStatusModal;
  w.executeToggleUserStatus = executeToggleUserStatus;
  w.toggleUserStatusPrompt = toggleUserStatusPrompt;
  w.openNewUserDefaultsModal = openNewUserDefaultsModal;
  w.closeNewUserDefaultsModal = closeNewUserDefaultsModal;
  w.toggleNewUserDefaultFlag = toggleNewUserDefaultFlag;
  w.toggleAllNewUserDefaults = toggleAllNewUserDefaults;
  w.saveNewUserDefaults = saveNewUserDefaults;

  // Vouchers RBAC & Management
  w._pendingDeleteVoucherCode = _pendingDeleteVoucherCode;
  w.getAppCurrentUser = getAppCurrentUser;
  w.canEditVouchers = canEditVouchers;
  w.canDeleteVouchers = canDeleteVouchers;
  w.openEditVoucherModal = openEditVoucherModal;
  w.closeEditVoucherModal = closeEditVoucherModal;
  w.onSelectEditVoucherFiles = onSelectEditVoucherFiles;
  w.removeEditVoucherFile = removeEditVoucherFile;
  w.saveEditVoucher = saveEditVoucher;
  w.confirmDeleteVoucher = confirmDeleteVoucher;
  w.closeDeleteVoucherModal = closeDeleteVoucherModal;
  w.executeDeleteVoucher = executeDeleteVoucher;
  w.searchVouchers = searchVouchers;
  w.viewVoucherDetail = viewVoucherDetail;

  // Export
  w.exportUserMatrixExcel = exportUserMatrixExcel;
}
