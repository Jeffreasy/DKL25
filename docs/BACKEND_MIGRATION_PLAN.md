# 🚀 Complete Backend Migration Plan - DKL25 Frontend

> **Doel:** 100% migratie van Supabase authenticatie naar Go backend met JWT + RBAC  
> **Status:** Planning - Gereed voor implementatie  
> **Datum:** 2025-11-01  
> **Geschatte tijd:** 3-5 dagen  

---

## 📋 Executive Summary

### Huidige Situatie
- ✅ **Backend:** Go API met volledige JWT auth + RBAC (v1.48.0+)
- ❌ **Frontend:** Gebruikt nog Supabase voor authenticatie
- ❌ **Data Fetching:** Meng van Supabase queries en backend API calls
- ❌ **Email:** Gebruikt n8n webhook (buiten backend om)
- ❌ **Permissions:** Geen RBAC implementatie in frontend

### Doelstelling
- ✅ 100% JWT authenticatie via backend
- ✅ Token management (access 20min, refresh 7 dagen)
- ✅ RBAC permission checks in frontend
- ✅ Alle data via backend API endpoints
- ✅ Email service via backend
- ✅ Protected routes met granulaire permissions
- ✅ Verwijderen van Supabase dependencies

---

## 🏗️ Architectuur Overzicht

### VOOR (Huidig)
```
┌─────────────────── FRONTEND ────────────────────┐
│                                                  │
│  ┌──────────────┐        ┌──────────────────┐  │
│  │ AuthProvider │───────→│ Supabase Auth    │  │
│  │ (Supabase)   │        │ (signIn/signOut) │  │
│  └──────────────┘        └──────────────────┘  │
│         │                                        │
│         ↓                                        │
│  ┌──────────────────────────────────────────┐  │
│  │ Data Fetching                            │  │
│  │ • createApiService (Supabase queries)    │  │
│  │ • Direct supabase.from() calls           │  │
│  │ • Geen permissions checks                │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ Email Service                            │  │
│  │ • Direct naar n8n webhook                │  │
│  │ • Geen backend involvement               │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
└──────────────────────────────────────────────────┘
          ↓ Direct queries
┌──────────────────────────────────────────────────┐
│           Supabase Cloud                         │
│  • users (auth.users)                            │
│  • public.aanmeldingen, partners, etc.           │
└──────────────────────────────────────────────────┘
```

### NA (Doel)
```
┌─────────────────── FRONTEND ────────────────────┐
│                                                  │
│  ┌──────────────┐        ┌──────────────────┐  │
│  │ AuthProvider │───────→│ JWT Token        │  │
│  │ (JWT)        │        │ Management       │  │
│  └──────────────┘        └──────────────────┘  │
│         │                          ↓             │
│         │                 ┌──────────────────┐  │
│         │                 │ Token Refresh    │  │
│         │                 │ (Auto 15min)     │  │
│         │                 └──────────────────┘  │
│         ↓                                        │
│  ┌──────────────────────────────────────────┐  │
│  │ Permission Context                       │  │
│  │ • usePermissions() hook                  │  │
│  │ • hasPermission(resource, action)        │  │
│  │ • User roles & permissions               │  │
│  └──────────────────────────────────────────┘  │
│         │                                        │
│         ↓                                        │
│  ┌──────────────────────────────────────────┐  │
│  │ Protected Routes                         │  │
│  │ • ProtectedRoute component               │  │
│  │ • Permission-based rendering             │  │
│  └──────────────────────────────────────────┘  │
│         │                                        │
│         ↓                                        │
│  ┌──────────────────────────────────────────┐  │
│  │ API Service Layer                        │  │
│  │ • apiClient (axios/fetch wrapper)        │  │
│  │ • Auto JWT in Authorization header       │  │
│  │ • Error handling (401/403/429)           │  │
│  │ • Auto token refresh on 401              │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
└──────────┼───────────────────────────────────────┘
           │ HTTP Requests (Bearer Token)
           ↓
┌─────────────────── GO BACKEND ──────────────────┐
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ Auth Endpoints                           │  │
│  │ • POST /api/auth/login                   │  │
│  │ • POST /api/auth/refresh                 │  │
│  │ • GET  /api/auth/profile                 │  │
│  │ • POST /api/auth/logout                  │  │
│  └──────────────────────────────────────────┘  │
│         │                                        │
│         ↓                                        │
│  ┌──────────────────────────────────────────┐  │
│  │ AuthMiddleware + PermissionMiddleware    │  │
│  │ • JWT validation                         │  │
│  │ • Permission checks (Redis cached)       │  │
│  │ • Rate limiting                          │  │
│  └──────────────────────────────────────────┘  │
│         │                                        │
│         ↓                                        │
│  ┌──────────────────────────────────────────┐  │
│  │ Protected Endpoints                      │  │
│  │ • /api/contacts (contact:read)           │  │
│  │ • /api/aanmeldingen (aanmelding:write)   │  │
│  │ • /api/partners (partner:read)           │  │
│  │ • /api/rbac/* (admin:access)             │  │
│  └──────────────────────────────────────────┘  │
│         │                                        │
│         ↓                                        │
│  ┌──────────────────────────────────────────┐  │
│  │ Email Service                            │  │
│  │ • POST /api/contact-email                │  │
│  │ • POST /api/aanmelding-email             │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
└──────────┼───────────────────────────────────────┘
           │ Database Queries
           ↓
┌──────────────────────────────────────────────────┐
│  PostgreSQL (via Supabase/Direct)                │
│  • gebruikers (users met rol + RBAC)             │
│  • roles, permissions, user_roles                │
│  • refresh_tokens                                │
│  • aanmeldingen, partners, sponsors, etc.        │
│                                                   │
│  Redis Cache                                     │
│  • Permission cache (5 min TTL)                  │
│  • Rate limiting                                 │
└──────────────────────────────────────────────────┘
```

---

## 📦 Benodigde Nieuwe Files

### 1. Core Authentication
```
src/
├── services/
│   ├── auth/
│   │   ├── authService.ts          # JWT auth service
│   │   ├── tokenManager.ts         # Token storage & refresh
│   │   └── types.ts                # Auth types
│   ├── api/
│   │   ├── apiClient.ts            # Axios wrapper met interceptors
│   │   └── endpoints.ts            # API endpoint definitions
│   └── permissions/
│       ├── permissionService.ts    # Permission checks
│       └── types.ts                # Permission types
```

### 2. Context & Hooks
```
src/
├── contexts/
│   ├── AuthContext.tsx             # NEW: JWT auth context
│   └── PermissionContext.tsx       # NEW: RBAC permissions context
├── hooks/
│   ├── auth/
│   │   ├── useAuth.ts              # Auth hook
│   │   ├── useLogin.ts             # Login logic
│   │   └── useLogout.ts            # Logout logic
│   └── permissions/
│       ├── usePermissions.ts       # Permission checks
│       └── useRequirePermission.ts # Permission guard hook
```

### 3. Components
```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx           # Login formulier
│   │   ├── ProtectedRoute.tsx      # Route guard
│   │   └── RequirePermission.tsx   # Component-level guard
│   └── common/
│       └── AuthRequired.tsx        # Auth wrapper component
```

### 4. Types
```
src/
├── types/
│   ├── auth.ts                     # Auth & JWT types
│   ├── permissions.ts              # RBAC types
│   └── api.ts                      # API response types
```

---

## 🔧 Implementatie Stappen

### FASE 1: Foundation (Dag 1)

#### 1.1 Backend API Service Layer
**File:** `src/services/api/apiClient.ts`

```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { tokenManager } from '../auth/tokenManager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dklemailservice.onrender.com';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor: Add JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = tokenManager.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: Handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle token expired (401)
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue request while refreshing
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await tokenManager.refreshToken();
            this.isRefreshing = false;
            
            // Retry queued requests with new token
            this.refreshSubscribers.forEach((callback) => callback(newToken));
            this.refreshSubscribers = [];

            // Retry original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            this.isRefreshing = false;
            this.refreshSubscribers = [];
            
            // Refresh failed - redirect to login
            tokenManager.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle permission denied (403)
        if (error.response?.status === 403) {
          console.error('Permission denied:', error.config?.url);
          // Optionally show toast notification
        }

        // Handle rate limit (429)
        if (error.response?.status === 429) {
          console.error('Rate limit exceeded:', error.config?.url);
          // Optionally show toast notification
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

#### 1.2 Token Manager
**File:** `src/services/auth/tokenManager.ts`

```typescript
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'dkl_access_token',
  REFRESH_TOKEN: 'dkl_refresh_token',
  USER: 'dkl_user',
} as const;

class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null;

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    
    // Schedule auto-refresh at 15 minutes (before 20min expiry)
    this.scheduleTokenRefresh();
  }

  clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  getUserData(): any {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  setUserData(user: any): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Refresh token at 15 minutes (5 min before expiry)
    this.refreshTimer = setTimeout(async () => {
      try {
        await this.refreshToken();
      } catch (error) {
        console.error('Auto token refresh failed:', error);
        this.clearTokens();
        window.location.href = '/login';
      }
    }, 15 * 60 * 1000); // 15 minutes
  }

  async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    this.setTokens(data.token, data.refresh_token);
    
    return data.token;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const tokenManager = new TokenManager();
```

#### 1.3 Auth Service
**File:** `src/services/auth/authService.ts`

```typescript
import { apiClient } from '../api/apiClient';
import { tokenManager } from './tokenManager';
import type { LoginCredentials, LoginResponse, User } from './types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', {
      email: credentials.email,
      wachtwoord: credentials.password,
    });

    if (response.success && response.token && response.refresh_token) {
      tokenManager.setTokens(response.token, response.refresh_token);
      tokenManager.setUserData(response.user);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
    }
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ user: User }>('/api/auth/profile');
    tokenManager.setUserData(response.user);
    return response.user;
  }

  async refreshToken(): Promise<string> {
    return tokenManager.refreshToken();
  }

  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  }

  getCurrentUser(): User | null {
    return tokenManager.getUserData();
  }
}

export const authService = new AuthService();
```

#### 1.4 Auth Types
**File:** `src/services/auth/types.ts`

```typescript
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
  rol: string; // Legacy role
  permissions: Permission[];
  roles?: Role[];
  is_actief: boolean;
}

export interface Permission {
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
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
```

### FASE 2: Authentication Context (Dag 1-2)

#### 2.1 Auth Context
**File:** `src/contexts/AuthContext.tsx`

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/auth/authService';
import type { User } from '../services/auth/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user profile:', error);
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    const userData = await authService.getProfile();
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

#### 2.2 Permission Context
**File:** `src/contexts/PermissionContext.tsx`

```typescript
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { Permission } from '../services/auth/types';

interface PermissionContextType {
  permissions: Permission[];
  hasPermission: (resource: string, action: string) => boolean;
  hasAnyPermission: (checks: Array<{ resource: string; action: string }>) => boolean;
  hasAllPermissions: (checks: Array<{ resource: string; action: string }>) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const permissions = user?.permissions || [];

  const hasPermission = (resource: string, action: string): boolean => {
    return permissions.some(
      (p) => p.resource === resource && p.action === action
    );
  };

  const hasAnyPermission = (checks: Array<{ resource: string; action: string }>): boolean => {
    return checks.some((check) => hasPermission(check.resource, check.action));
  };

  const hasAllPermissions = (checks: Array<{ resource: string; action: string }>): boolean => {
    return checks.every((check) => hasPermission(check.resource, check.action));
  };

  const value: PermissionContextType = {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}
```

### FASE 3: Protected Routes (Dag 2)

#### 3.1 Protected Route Component
**File:** `src/components/auth/ProtectedRoute.tsx`

```typescript
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePermission?: { resource: string; action: string };
  requireAnyPermission?: Array<{ resource: string; action: string }>;
  requireAllPermissions?: Array<{ resource: string; action: string }>;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check single permission
  if (requirePermission) {
    const hasAccess = hasPermission(requirePermission.resource, requirePermission.action);
    if (!hasAccess) {
      return fallback || <Navigate to="/unauthorized" replace />;
    }
  }

  // Check any permission
  if (requireAnyPermission) {
    const hasAccess = hasAnyPermission(requireAnyPermission);
    if (!hasAccess) {
      return fallback || <Navigate to="/unauthorized" replace />;
    }
  }

  // Check all permissions
  if (requireAllPermissions) {
    const hasAccess = hasAllPermissions(requireAllPermissions);
    if (!hasAccess) {
      return fallback || <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
```

#### 3.2 Require Permission Component
**File:** `src/components/auth/RequirePermission.tsx`

```typescript
import { usePermissions } from '../../contexts/PermissionContext';

interface RequirePermissionProps {
  children: React.ReactNode;
  resource: string;
  action: string;
  fallback?: React.ReactNode;
}

export function RequirePermission({
  children,
  resource,
  action,
  fallback = null,
}: RequirePermissionProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
```

### FASE 4: Data Migration (Dag 2-3)

#### 4.1 Backend API Endpoints
**File:** `src/services/api/endpoints.ts`

```typescript
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    profile: '/api/auth/profile',
    resetPassword: '/api/auth/reset-password',
  },

  // Contact & Registration
  contact: '/api/contact-email',
  registration: '/api/aanmelding-email',
  
  // Data endpoints
  aanmeldingen: '/api/aanmeldingen',
  partners: '/api/partners',
  sponsors: '/api/sponsors',
  photos: '/api/photos',
  videos: '/api/videos',
  albums: '/api/albums',
  program: '/api/program',
  radio: '/api/radio',
  
  // Email
  emails: '/api/emails',
  
  // RBAC (admin only)
  rbac: {
    permissions: '/api/rbac/permissions',
    roles: '/api/rbac/roles',
    userRoles: (userId: string) => `/api/users/${userId}/roles`,
    userPermissions: (userId: string) => `/api/users/${userId}/permissions`,
    cacheRefresh: '/api/rbac/cache/refresh',
  },
  
  // Utility
  underConstruction: '/api/under-construction/active',
  health: '/api/health',
} as const;
```

#### 4.2 Replace createApiService
**File:** `src/services/api/dataService.ts`

```typescript
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import type { BaseEntity, QueryOptions } from '../../types/base';

export function createDataService<T extends BaseEntity>(endpoint: string) {
  return {
    async fetchAll(options?: QueryOptions): Promise<T[]> {
      let url = endpoint;
      const params = new URLSearchParams();

      if (options?.visible !== undefined) {
        params.append('visible', String(options.visible));
      }
      if (options?.sortBy) {
        params.append('sortBy', options.sortBy);
      }
      if (options?.sortOrder) {
        params.append('sortOrder', options.sortOrder);
      }
      if (options?.limit) {
        params.append('limit', String(options.limit));
      }
      if (options?.offset) {
        params.append('offset', String(options.offset));
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      return apiClient.get<T[]>(url);
    },

    async fetchById(id: string): Promise<T> {
      return apiClient.get<T>(`${endpoint}/${id}`);
    },

    async create(data: Omit<T, keyof BaseEntity>): Promise<T> {
      return apiClient.post<T>(endpoint, data);
    },

    async update(id: string, data: Partial<T>): Promise<T> {
      return apiClient.put<T>(`${endpoint}/${id}`, data);
    },

    async delete(id: string): Promise<void> {
      return apiClient.delete<void>(`${endpoint}/${id}`);
    },

    async fetchVisible(): Promise<T[]> {
      return apiClient.get<T[]>(`${endpoint}?visible=true`);
    },
  };
}
```

#### 4.3 Email Service Migration
**File:** `src/services/email/emailService.ts`

```typescript
import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import type { ContactFormData } from '../../types/contact';

export class EmailService {
  async sendContactEmail(data: ContactFormData): Promise<void> {
    await apiClient.post(API_ENDPOINTS.contact, {
      naam: data.naam,
      email: data.email,
      bericht: data.bericht,
    });
  }

  async sendRegistrationEmail(data: any): Promise<void> {
    await apiClient.post(API_ENDPOINTS.registration, {
      naam: data.naam,
      email: data.email,
      rol: data.rol,
      afstand: data.afstand,
      ondersteuning: data.ondersteuning,
      bijzonderheden: data.bijzonderheden,
    });
  }
}

export const emailService = new EmailService();
```

### FASE 5: Update Components (Dag 3-4)

#### 5.1 Update FormContainer (Aanmelden)
```typescript
// REPLACE Supabase insert with backend API
import { apiClient } from '../../../services/api/apiClient';
import { API_ENDPOINTS } from '../../../services/api/endpoints';

// OLD:
// const { error: supabaseError } = await supabase
//   .from('aanmeldingen')
//   .insert([registrationData]);

// NEW:
await apiClient.post(API_ENDPOINTS.aanmeldingen, registrationData);
```

#### 5.2 Update Partners/Sponsors/etc Services
Replace all `createApiService` calls:

```typescript
// OLD:
import { supabase } from '../lib/supabase';
const service = createApiService<Partner>('partners');

// NEW:
import { createDataService } from '../services/api/dataService';
import { API_ENDPOINTS } from '../services/api/endpoints';
const service = createDataService<Partner>(API_ENDPOINTS.partners);
```

### FASE 6: Environment & Configuration (Dag 4)

#### 6.1 Update .env.example
```env
# Backend API
VITE_API_BASE_URL=https://dklemailservice.onrender.com

# Remove Supabase (deprecated)
# VITE_SUPABASE_URL=
# VITE_SUPABASE_ANON_KEY=
# VITE_SUPABASE_USER=
# VITE_SUPABASE_PASSWORD=
```

#### 6.2 Update App.tsx
```typescript
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PermissionProvider } from './contexts/PermissionContext';
import { NormalApp } from './components/NormalApp';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PermissionProvider>
          <NormalApp />
        </PermissionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

### FASE 7: Cleanup (Dag 5)

#### 7.1 Remove Supabase Dependencies
```bash
npm uninstall @supabase/supabase-js
```

#### 7.2 Delete Old Files
- `src/lib/supabase.ts` ❌
- `src/providers/AuthProvider.tsx` ❌ (replaced)
- `src/types/supabase.ts` ✅ (keep for database types)
- `src/lib/api/createApiService.ts` ❌ (replaced)

#### 7.3 Update Imports Across Codebase
Search and replace all:
- `from '../lib/supabase'` → use new services
- `from './lib/supabase'` → use new services
- `supabase.from(` → use `apiClient` or `createDataService`

---

## ✅ Testing Checklist

### Authentication
- [ ] Login with valid credentials works
- [ ] Login with invalid credentials shows error
- [ ] Logout clears tokens and redirects
- [ ] Token auto-refresh works at 15 minutes
- [ ] Expired token triggers re-login
- [ ] Rate limiting shows error after 5 attempts

### Authorization
- [ ] Admin can access `/admin`
- [ ] Regular user gets 403 on admin routes
- [ ] Permission-based UI elements render correctly
- [ ] `RequirePermission` component hides unauthorized content

### Data Fetching
- [ ] Partners load via backend API
- [ ] Sponsors load via backend API
- [ ] Photos/Videos/Albums load correctly
- [ ] Contact form submits to backend
- [ ] Registration form submits to backend

### Error Handling
- [ ] 401 triggers token refresh
- [ ] 403 shows permission denied message
- [ ] 429 shows rate limit message
- [ ] Network errors show user-friendly message

### Performance
- [ ] Login completes in < 500ms
- [ ] Data fetching completes in < 2s
- [ ] No console errors or warnings
- [ ] Token refresh is transparent to user

---

## 🚀 Deployment Plan

### Pre-Deployment
1. ✅ Verify backend is on v1.48.0+
2. ✅ Ensure all RBAC migrations are applied
3. ✅ Test with staging backend first
4. ✅ Create default admin user if needed
5. ✅ Verify CORS settings include frontend domain

### Deployment Steps
1. Build frontend with new auth system
2. Deploy to staging
3. Run full test suite
4. Deploy to production
5. Monitor error logs for 24 hours
6. Remove Supabase environment variables

### Rollback Plan
If critical issues:
1. Revert to previous deployment
2. Re-add Supabase env vars
3. Investigate and fix issues
4. Re-deploy when ready

---

## 📊 Migration Timeline

| Fase | Taken | Tijd | Status |
|------|-------|------|--------|
| **Fase 1** | Foundation (API Client, Token Manager, Auth Service) | 8u | ⏳ Ready |
| **Fase 2** | Context & Providers (Auth, Permissions) | 4u | ⏳ Ready |
| **Fase 3** | Protected Routes & Components | 4u | ⏳ Ready |
| **Fase 4** | Data Migration (replace Supabase calls) | 12u | ⏳ Ready |
| **Fase 5** | Component Updates | 8u | ⏳ Ready |
| **Fase 6** | Configuration & Environment | 2u | ⏳ Ready |
| **Fase 7** | Testing & Cleanup | 4u | ⏳ Ready |
| **Totaal** | | **42u** (5-6 dagen) | |

---

## 🎯 Success Criteria

✅ **Volledig bereikt wanneer:**
1. Geen Supabase client authenticatie meer gebruikt
2. Alle API calls via backend met JWT tokens
3. Permission-based routing werkt correct
4. Token auto-refresh werkt zonder onderbreking
5. Email service via backend endpoints
6. Alle tests slagen
7. No console errors in productie
8. Performance metrics zijn vergelijkbaar of beter
9. Supabase package verwijderd uit dependencies
10. Documentatie is up-to-date

---

## 📚 References

- [Backend Auth Documentation](./AUTH_AND_RBAC.md)
- [API Endpoints](../backend/README.md)
- [JWT Best Practices](https://jwt.io/introduction)
- [React Context Best Practices](https://react.dev/reference/react/useContext)

---

**Status:** 📋 Planning Complete - Ready for Implementation  
**Next Action:** Creëer Fase 1 files en begin met API Client implementatie  
**Contact:** Backend team voor API vragen, Frontend team voor UI integratie