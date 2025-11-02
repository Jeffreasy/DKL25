/**
 * Permission Context
 * Provides RBAC permission checks throughout the application
 */

import { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import type { Permission } from '../types/auth';

interface PermissionCheck {
  resource: string;
  action: string;
}

interface PermissionContextType {
  permissions: Permission[];
  hasPermission: (resource: string, action: string) => boolean;
  hasAnyPermission: (checks: PermissionCheck[]) => boolean;
  hasAllPermissions: (checks: PermissionCheck[]) => boolean;
  isAdmin: boolean;
  isStaff: boolean;
  getUserRoles: () => string[];
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const { user } = useAuth();
  
  // Memoize permissions array
  const permissions = useMemo(() => user?.permissions || [], [user?.permissions]);

  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      return permissions.some(
        (p) => p.resource === resource && p.action === action
      );
    },
    [permissions]
  );

  /**
   * Check if user has ANY of the specified permissions
   */
  const hasAnyPermission = useCallback(
    (checks: PermissionCheck[]): boolean => {
      return checks.some((check) => hasPermission(check.resource, check.action));
    },
    [hasPermission]
  );

  /**
   * Check if user has ALL of the specified permissions
   */
  const hasAllPermissions = useCallback(
    (checks: PermissionCheck[]): boolean => {
      return checks.every((check) => hasPermission(check.resource, check.action));
    },
    [hasPermission]
  );

  /**
   * Check if user is admin
   */
  const isAdmin = useMemo(() => {
    return hasPermission('admin', 'access');
  }, [hasPermission]);

  /**
   * Check if user is staff (or admin)
   */
  const isStaff = useMemo(() => {
    return hasPermission('staff', 'access') || isAdmin;
  }, [hasPermission, isAdmin]);

  /**
   * Get user's role names
   */
  const getUserRoles = useCallback((): string[] => {
    return user?.roles?.map((r) => r.name) || [];
  }, [user?.roles]);

  const value: PermissionContextType = {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isStaff,
    getUserRoles,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

/**
 * Hook to use permission context
 */
export function usePermissions() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}

/**
 * Helper hook for specific permission check
 */
export function useHasPermission(resource: string, action: string): boolean {
  const { hasPermission } = usePermissions();
  return useMemo(
    () => hasPermission(resource, action),
    [hasPermission, resource, action]
  );
}

/**
 * Helper hook to require permissions (throws if not authorized)
 */
export function useRequirePermission(resource: string, action: string): void {
  const hasPermission = useHasPermission(resource, action);
  
  if (!hasPermission) {
    throw new Error(`Permission denied: ${resource}:${action}`);
  }
}