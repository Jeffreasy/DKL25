/**
 * Authentication & Authorization Types
 * JWT-based authentication with RBAC permissions
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  refresh_token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  naam: string;
  rol: string; // Legacy role for backward compatibility
  permissions: Permission[];
  roles?: Role[];
  is_actief: boolean;
  laatste_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  is_system_role?: boolean;
}

export interface JWTClaims {
  sub: string; // user ID
  email: string;
  role: string; // legacy
  roles: string[];
  rbac_active: boolean;
  exp: number;
  iat: number;
  iss: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  token: string;
  refresh_token: string;
}

export interface ProfileResponse {
  user: User;
}

export interface ResetPasswordRequest {
  current_password: string;
  new_password: string;
}

export interface AuthError {
  error: string;
  code?: string;
}

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'dkl_access_token',
  REFRESH_TOKEN: 'dkl_refresh_token',
  USER: 'dkl_user',
} as const;

// Token expiry times (in milliseconds)
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: 20 * 60 * 1000, // 20 minutes
  REFRESH_TOKEN: 7 * 24 * 60 * 60 * 1000, // 7 days
  REFRESH_BEFORE: 5 * 60 * 1000, // Refresh 5 minutes before expiry
} as const;