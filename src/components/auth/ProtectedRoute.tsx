/**
 * Protected Route Component
 * Guards routes that require authentication and/or specific permissions
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionContext';
import LoadingSpinner from '../common/LoadingSpinner';

interface PermissionCheck {
  resource: string;
  action: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePermission?: PermissionCheck;
  requireAnyPermission?: PermissionCheck[];
  requireAllPermissions?: PermissionCheck[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component that protects routes based on authentication and permissions
 * 
 * @example
 * // Require authentication only
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * 
 * @example
 * // Require specific permission
 * <ProtectedRoute requirePermission={{ resource: 'contact', action: 'read' }}>
 *   <ContactList />
 * </ProtectedRoute>
 * 
 * @example
 * // Require any of multiple permissions
 * <ProtectedRoute requireAnyPermission={[
 *   { resource: 'admin', action: 'access' },
 *   { resource: 'staff', action: 'access' }
 * ]}>
 *   <AdminPanel />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  fallback,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Check authentication first
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check single permission
  if (requirePermission) {
    const hasAccess = hasPermission(
      requirePermission.resource,
      requirePermission.action
    );
    
    if (!hasAccess) {
      return fallback ? <>{fallback}</> : <Navigate to="/unauthorized" replace />;
    }
  }

  // Check any permission (OR logic)
  if (requireAnyPermission && requireAnyPermission.length > 0) {
    const hasAccess = hasAnyPermission(requireAnyPermission);
    
    if (!hasAccess) {
      return fallback ? <>{fallback}</> : <Navigate to="/unauthorized" replace />;
    }
  }

  // Check all permissions (AND logic)
  if (requireAllPermissions && requireAllPermissions.length > 0) {
    const hasAccess = hasAllPermissions(requireAllPermissions);
    
    if (!hasAccess) {
      return fallback ? <>{fallback}</> : <Navigate to="/unauthorized" replace />;
    }
  }

  // All checks passed, render children
  return <>{children}</>;
}

/**
 * Shorthand for admin-only routes
 */
export function AdminRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute
      requirePermission={{ resource: 'admin', action: 'access' }}
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
}

/**
 * Shorthand for staff+ routes (staff or admin)
 */
export function StaffRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute
      requireAnyPermission={[
        { resource: 'staff', action: 'access' },
        { resource: 'admin', action: 'access' },
      ]}
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
}