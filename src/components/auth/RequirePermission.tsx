/**
 * Require Permission Component
 * Shows/hides content based on user permissions
 */

import { usePermissions } from '../../contexts/PermissionContext';

interface RequirePermissionProps {
  children: React.ReactNode;
  resource: string;
  action: string;
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on permissions
 * 
 * @example
 * <RequirePermission resource="contact" action="write">
 *   <DeleteButton />
 * </RequirePermission>
 * 
 * @example
 * <RequirePermission 
 *   resource="admin" 
 *   action="access"
 *   fallback={<p>Admin toegang vereist</p>}
 * >
 *   <AdminPanel />
 * </RequirePermission>
 */
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

/**
 * Shorthand for admin-only content
 */
export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RequirePermission resource="admin" action="access" fallback={fallback}>
      {children}
    </RequirePermission>
  );
}

/**
 * Shorthand for staff+ content
 */
export function StaffOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { isStaff } = usePermissions();

  if (!isStaff) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Component that renders different content based on permission
 */
interface ConditionalPermissionProps {
  resource: string;
  action: string;
  granted: React.ReactNode;
  denied: React.ReactNode;
}

export function ConditionalPermission({
  resource,
  action,
  granted,
  denied,
}: ConditionalPermissionProps) {
  const { hasPermission } = usePermissions();

  return <>{hasPermission(resource, action) ? granted : denied}</>;
}