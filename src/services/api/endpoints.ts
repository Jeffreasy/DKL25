/**
 * API Endpoints
 * Centralized endpoint definitions for the backend API
 * Note: /api prefix is handled by Vite proxy in development
 */

export const API_ENDPOINTS = {
  // ==================== Authentication ====================
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    profile: '/api/auth/profile',
    resetPassword: '/api/auth/reset-password',
  },

  // ==================== Email Services ====================
  email: {
    contact: '/api/contact-email',
    registration: '/api/aanmelding-email',
    send: '/api/emails',
    fetch: '/api/emails',
  },

  // ==================== Public Data ====================
  aanmeldingen: '/api/aanmeldingen',
  partners: '/api/partners',
  sponsors: '/api/sponsors',
  
  // ==================== Media ====================
  photos: '/api/photos',
  videos: '/api/videos',
  albums: '/api/albums',
  
  // ==================== Content ====================
  program: '/api/program',
  radio: '/api/radio',
  socialEmbeds: '/api/social-embeds',
  socialLinks: '/api/social-links',
  
  // ==================== RBAC (Admin Only) ====================
  rbac: {
    permissions: '/api/rbac/permissions',
    roles: '/api/rbac/roles',
    roleDetails: (roleId: string) => `/api/rbac/roles/${roleId}`,
    rolePermissions: (roleId: string) => `/api/rbac/roles/${roleId}/permissions`,
    assignPermission: (roleId: string, permissionId: string) =>
      `/api/rbac/roles/${roleId}/permissions/${permissionId}`,
    userRoles: (userId: string) => `/api/users/${userId}/roles`,
    userPermissions: (userId: string) => `/api/users/${userId}/permissions`,
    assignRole: (userId: string) => `/api/users/${userId}/roles`,
    revokeRole: (userId: string, roleId: string) => `/api/users/${userId}/roles/${roleId}`,
    cacheRefresh: '/api/rbac/cache/refresh',
  },

  // ==================== User Management ====================
  users: {
    list: '/api/users',
    details: (userId: string) => `/api/users/${userId}`,
    create: '/api/users',
    update: (userId: string) => `/api/users/${userId}`,
    delete: (userId: string) => `/api/users/${userId}`,
  },

  // ==================== Contact Management ====================
  contacts: {
    list: '/api/contacts',
    details: (contactId: string) => `/api/contacts/${contactId}`,
    create: '/api/contacts',
    update: (contactId: string) => `/api/contacts/${contactId}`,
    delete: (contactId: string) => `/api/contacts/${contactId}`,
  },

  // ==================== Utility ====================
  underConstruction: '/api/under-construction/active',
  health: '/api/health',
  version: '/api/version',
} as const;

/**
 * Helper function to build query strings
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Common query parameters interface
 */
export interface QueryParams {
  visible?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  page?: number;
  search?: string;
}