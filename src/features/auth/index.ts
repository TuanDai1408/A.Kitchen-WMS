/**
 * Module 13: Google Authentication, Multi-Account Session & Dynamic RBAC Engine
 */

import {
  repairAtobMojibake,
  loadPersistedUser,
  GOOGLE_CLIENT_ID,
  APP_SYSTEM_ROLES,
  FEATURE_TITLES,
  DEFAULT_SITES_LIST
} from './constants';

import {
  gCurrentUser,
  isForceAuthModal,
  getSavedAccounts,
  saveAccountToList,
  removeSavedAccount,
  switchToSavedAccount,
  renderSavedAccountsInLoginModal,
  renderSavedAccountsInProfileModal,
  handleUserProfileClick,
  openUserProfileModal,
  closeUserProfileModal
} from './accounts';

import {
  selectedModalRegion,
  tempSelectedSite,
  getAppSitesList,
  selectModalRegion,
  renderSitesOptions,
  filterSiteOptionCards,
  selectSiteOption,
  updateSelectedSiteLabel,
  checkAndPromptUserSite,
  openSiteSelectorModal,
  saveSiteSelection,
  canUserSwitchSite
} from './sites-modal';

import {
  cachedAccessRequests,
  pendingRequestFeature,
  pendingRequestFeatureName,
  openRequestAccessModal,
  closeRequestAccessModal,
  openRequestAccessForSite,
  submitRequestAccess,
  checkPendingAccessRequests,
  openAdminApprovalModal,
  closeAdminApprovalModal,
  renderAdminRequestsTable,
  handleApproveRequest
} from './access-requests';

import {
  initRbacAuth,
  syncCurrentUserPermissions,
  updateUIForUnauthenticated,
  applyUserSessionToUI,
  canAccessTab,
  gSystemTabVisibility,
  setSystemTabVisibility,
  loadPersistedTabVisibility,
  gSystemTabOrder,
  setSystemTabOrder,
  loadPersistedTabOrder,
  applyCustomTabOrderToUI,
  renderRoleSwitcherModal,
  openRoleSwitcherModal,
  closeRoleSwitcherModal,
  openRequestAccessForRole,
  switchRoleAction,
  renderLoginRoleSelection
} from './rbac-session';

import {
  loadSystemTabVisibility,
  openTabVisibilityModal,
  closeTabVisibilityModal,
  toggleTabVisibilityItem,
  setAllTabsVisible,
  moveTabItem,
  moveTabGroup,
  resetTabOrderToDefault,
  filterTabVisibility,
  onTabVisSearch,
  renderTabVisibilityList,
  saveSystemTabVisibility
} from './tab-visibility-modal';

import {
  initGoogleGIS,
  handleGoogleLoginResponse,
  promptGoogleOneTap,
  openGoogleAuthModal,
  closeGoogleAuthModal,
  loginWithGoogle,
  dangXuatAdmin
} from './google-gis';

import {
  filterGlobalQuickSearch,
  filterSidebarMenu
} from './search-filter';

import { getCleanInitials } from '@/ts/utils/formatters';

export * from './types';
export * from './constants';
export * from './accounts';
export * from './sites-modal';
export * from './access-requests';
export * from './rbac-session';
export * from './tab-visibility-modal';
export * from './google-gis';
export * from './search-filter';

// Bind to window for HTML inline event handlers & backwards compatibility
if (typeof window !== 'undefined') {
  const w = window as any;

  // Constants & Utilities
  w.repairAtobMojibake = repairAtobMojibake;
  w.loadPersistedUser = loadPersistedUser;
  w.getCleanInitials = getCleanInitials;
  w.GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID;
  w.APP_SYSTEM_ROLES = APP_SYSTEM_ROLES;
  w.FEATURE_TITLES = FEATURE_TITLES;
  w.DEFAULT_SITES_LIST = DEFAULT_SITES_LIST;

  // Global User Session State
  w.gCurrentUser = gCurrentUser;
  w.isForceAuthModal = isForceAuthModal;

  // Multi-Account Operations
  w.getSavedAccounts = getSavedAccounts;
  w.saveAccountToList = saveAccountToList;
  w.removeSavedAccount = removeSavedAccount;
  w.switchToSavedAccount = switchToSavedAccount;
  w.renderSavedAccountsInLoginModal = renderSavedAccountsInLoginModal;
  w.renderSavedAccountsInProfileModal = renderSavedAccountsInProfileModal;
  w.handleUserProfileClick = handleUserProfileClick;
  w.openUserProfileModal = openUserProfileModal;
  w.closeUserProfileModal = closeUserProfileModal;

  // Sites Modal
  w.selectedModalRegion = selectedModalRegion;
  w.tempSelectedSite = tempSelectedSite;
  w.getAppSitesList = getAppSitesList;
  w.selectModalRegion = selectModalRegion;
  w.renderSitesOptions = renderSitesOptions;
  w.filterSiteOptionCards = filterSiteOptionCards;
  w.selectSiteOption = selectSiteOption;
  w.updateSelectedSiteLabel = updateSelectedSiteLabel;
  w.checkAndPromptUserSite = checkAndPromptUserSite;
  w.openSiteSelectorModal = openSiteSelectorModal;
  w.saveSiteSelection = saveSiteSelection;
  w.canUserSwitchSite = canUserSwitchSite;

  // Access Requests & Admin Approval
  w.cachedAccessRequests = cachedAccessRequests;
  w.pendingRequestFeature = pendingRequestFeature;
  w.pendingRequestFeatureName = pendingRequestFeatureName;
  w.openRequestAccessModal = openRequestAccessModal;
  w.closeRequestAccessModal = closeRequestAccessModal;
  w.openRequestAccessForSite = openRequestAccessForSite;
  w.submitRequestAccess = submitRequestAccess;
  w.checkPendingAccessRequests = checkPendingAccessRequests;
  w.openAdminApprovalModal = openAdminApprovalModal;
  w.closeAdminApprovalModal = closeAdminApprovalModal;
  w.renderAdminRequestsTable = renderAdminRequestsTable;
  w.handleApproveRequest = handleApproveRequest;

  // RBAC Session & Navigation
  w.initRbacAuth = initRbacAuth;
  w.syncCurrentUserPermissions = syncCurrentUserPermissions;
  w.updateUIForUnauthenticated = updateUIForUnauthenticated;
  w.applyUserSessionToUI = applyUserSessionToUI;
  w.canAccessTab = canAccessTab;
  w.renderRoleSwitcherModal = renderRoleSwitcherModal;
  w.openRoleSwitcherModal = openRoleSwitcherModal;
  w.closeRoleSwitcherModal = closeRoleSwitcherModal;
  w.openRequestAccessForRole = openRequestAccessForRole;
  w.switchRoleAction = switchRoleAction;
  w.renderLoginRoleSelection = renderLoginRoleSelection;

  // Master Tab Visibility & Reorder Operations (trantuandai2508 exclusive)
  w.gSystemTabVisibility = gSystemTabVisibility;
  w.setSystemTabVisibility = setSystemTabVisibility;
  w.loadPersistedTabVisibility = loadPersistedTabVisibility;
  w.gSystemTabOrder = gSystemTabOrder;
  w.setSystemTabOrder = setSystemTabOrder;
  w.loadPersistedTabOrder = loadPersistedTabOrder;
  w.applyCustomTabOrderToUI = applyCustomTabOrderToUI;
  w.loadSystemTabVisibility = loadSystemTabVisibility;
  w.openTabVisibilityModal = openTabVisibilityModal;
  w.closeTabVisibilityModal = closeTabVisibilityModal;
  w.toggleTabVisibilityItem = toggleTabVisibilityItem;
  w.setAllTabsVisible = setAllTabsVisible;
  w.moveTabItem = moveTabItem;
  w.moveTabGroup = moveTabGroup;
  w.resetTabOrderToDefault = resetTabOrderToDefault;
  w.filterTabVisibility = filterTabVisibility;
  w.onTabVisSearch = onTabVisSearch;
  w.renderTabVisibilityList = renderTabVisibilityList;
  w.saveSystemTabVisibility = saveSystemTabVisibility;

  // Google GIS & Auth Modals
  w.initGoogleGIS = initGoogleGIS;
  w.handleGoogleLoginResponse = handleGoogleLoginResponse;
  w.promptGoogleOneTap = promptGoogleOneTap;
  w.openGoogleAuthModal = openGoogleAuthModal;
  w.closeGoogleAuthModal = closeGoogleAuthModal;
  w.loginWithGoogle = loginWithGoogle;
  w.dangXuatAdmin = dangXuatAdmin;

  // Search & Filter
  w.filterGlobalQuickSearch = filterGlobalQuickSearch;
  w.filterSidebarMenu = filterSidebarMenu;

  // Wrap switchTab with RBAC access check
  const _origSwitchTab = w.switchTab;
  w._origSwitchTab = _origSwitchTab;
  w.switchTab = function(tabId: string, btn?: HTMLElement, forceReload: boolean = false) {
    if (!w.gCurrentUser) {
      w.gCurrentUser = loadPersistedUser();
    }
    if (!w.gCurrentUser) {
      openGoogleAuthModal(true);
      return;
    }

    // Nếu tài khoản bị KHÓA hoàn toàn
    if (w.gCurrentUser.status === 'LOCKED') {
      if (typeof _origSwitchTab === 'function') {
        _origSwitchTab('tab-account-locked');
      }
      return;
    }

    // Nếu không có quyền truy cập tab
    if (!canAccessTab(tabId)) {
      if (typeof w.showToast === 'function') {
        if (gSystemTabVisibility[tabId] === true) {
          w.showToast('Chức năng này đã bị ẩn bởi Quản trị viên tối cao (trantuandai2508)', 'error');
        } else {
          w.showToast('Bạn không có quyền truy cập chức năng này', 'warning');
        }
      }
      const firstAllowedBtn = document.querySelector('#sidebar .nav-btn:not(.hidden)');
      const safeTabId = firstAllowedBtn ? firstAllowedBtn.getAttribute('data-tab') : 'tab-403';
      if (safeTabId && typeof _origSwitchTab === 'function') {
        _origSwitchTab(safeTabId);
      }
      return;
    }

    if (typeof _origSwitchTab === 'function') {
      _origSwitchTab(tabId, btn, forceReload);
    }
  };

  // Wire DOMContentLoaded initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initRbacAuth();
      initGoogleGIS();
    });
  } else {
    setTimeout(() => {
      initRbacAuth();
      initGoogleGIS();
    }, 50);
  }
}
