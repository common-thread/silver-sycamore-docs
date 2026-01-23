"use client";

import { usePermissions, Action, Role } from "@/hooks/usePermissions";
import Skeleton from "@/components/ui/Skeleton";

interface PermissionGuardProps {
  children: React.ReactNode;
  action?: Action;
  role?: Role;
  fallback?: React.ReactNode;
  showSkeleton?: boolean;
}

export function PermissionGuard({
  children,
  action,
  role,
  fallback = null,
  showSkeleton = false,
}: PermissionGuardProps) {
  const { can, hasRole, isLoading } = usePermissions();

  if (isLoading) {
    return showSkeleton ? (
      <div style={{ opacity: 0.5 }}>
        <Skeleton variant="text" width="100%" />
      </div>
    ) : null;
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
