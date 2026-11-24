export interface UserMatrixUser {
  id?: number | string;
  email: string;
  full_name?: string;
  role_code: string;
  status?: string;
  created_at?: string;
  avatar_url?: string;
  assignedSite?: string;
}

export interface UserMatrixFeature {
  code: string;
  name: string;
  group: string;
  groupName: string;
  color: string;
  icon?: string;
}

export interface RolePermission {
  role_code: string;
  feature_code: string;
  can_view: number;
}

export interface UserPermission {
  user_email: string;
  feature_code: string;
  can_view: number;
}

export interface UserMatrixData {
  users: UserMatrixUser[];
  features: UserMatrixFeature[];
  rolePermissions: RolePermission[];
  userPermissions: UserPermission[];
}

export interface ResolvedPermission {
  isGranted: boolean;
  type: 'CUSTOM_GRANT' | 'CUSTOM_REVOKE' | 'ROLE_DEFAULT' | 'NONE';
  label: string;
  badgeClass: string;
}

export interface CurrentUserSession {
  email: string;
  fullName?: string;
  role: string;
  roleCode?: string;
  assignedSite?: string;
  site?: string;
  avatarUrl?: string;
  permissions?: Record<string, { canView?: boolean; canCreate?: boolean; canEdit?: boolean; canDelete?: boolean; isCustom?: boolean; isRevoked?: boolean }>;
}
