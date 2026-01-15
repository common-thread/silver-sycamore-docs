"use client";

import { usePermissions, Action, Role } from "@/hooks/usePermissions";

interface PermissionGuardProps {
  children: React.ReactNode;
  action?: Action;
  role?: Role;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  action,
  role,
  fallback = null,
}: PermissionGuardProps) {
  const { can, hasRole, isLoading } = usePermissions();

  if (isLoading) {
    return null; // Or a loading indicator
  }

  if (action && !can(action)) {
    return <>{fallback}</>;
  }

  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Convenience components
export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <PermissionGuard role="admin" fallback={fallback}>{children}</PermissionGuard>;
}

export function ManagerOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <PermissionGuard role="manager" fallback={fallback}>{children}</PermissionGuard>;
}

export function CanEdit({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <PermissionGuard action="edit_content" fallback={fallback}>{children}</PermissionGuard>;
}
