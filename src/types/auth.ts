/**
 * Authentication and User Role Type Definitions for A.Kitchen WMS
 */

export type UserRole = 'ADMIN' | 'KHO_TRUONG' | 'BEP_TRUONG' | 'KE_TOAN' | 'STAFF';

export interface CurrentUser {
  email: string;
  name: string;
  role: UserRole;
  site: string;
  site_id?: string;
  site_name?: string;
  picture?: string;
}

export interface RoleDefinition {
  code: UserRole;
  title: string;
  desc: string;
  badgeColor: string;
  permissions: string[];
}

export interface SavedAccount {
  email: string;
  name: string;
  role: UserRole;
  site: string;
  avatar?: string;
}

export interface AccessRequest {
  id: number;
  user_email: string;
  user_name: string;
  current_role: string;
  requested_role: UserRole;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
}
