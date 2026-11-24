/**
 * Auth & RBAC Type Definitions
 */

export interface UserAccount {
  id?: string | number;
  email: string;
  fullName?: string;
  full_name?: string;
  avatarUrl?: string;
  role: string;
  roleName?: string;
  badgeColor?: string;
  assignedSite?: string;
  permissions?: Record<string, { canView?: boolean; canEdit?: boolean; canDelete?: boolean }> | null;
  approvedRoles?: string[];
  lastLogin?: number;
}

export interface AuthSavedAccount {
  id?: string | number;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: string;
  roleName: string;
  badgeColor: string;
  permissions?: Record<string, { canView?: boolean; canEdit?: boolean; canDelete?: boolean }> | null;
  assignedSite: string;
  lastLogin: number;
}

export interface AuthRoleDefinition {
  code: string;
  name: string;
  desc: string;
  color: string;
  icon: string;
}

export interface AuthSiteOption {
  code: string;
  name: string;
  ten?: string;
  region: string;
  desc: string;
  budget?: number;
}

export interface AuthAccessRequest {
  id: number;
  user_email: string;
  user_name?: string;
  requested_feature?: string;
  requested_role: string;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface FeatureTitleInfo {
  name: string;
  role: string;
  desc: string;
}
