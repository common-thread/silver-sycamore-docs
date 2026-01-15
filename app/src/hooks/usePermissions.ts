"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export type Role = "admin" | "manager" | "staff";
export type Action = "view_content" | "edit_content" | "delete_content" | "manage_users" | "view_analytics";

const ROLE_PERMISSIONS: Record<Role, Action[]> = {
  staff: ["view_content"],
  manager: ["view_content", "edit_content", "view_analytics"],
  admin: ["view_content", "edit_content", "delete_content", "manage_users", "view_analytics"],
};

export function usePermissions() {
  const currentUser = useQuery(api.users.getCurrentUser);

  const role = (currentUser?.profile?.role as Role) ?? "staff";
  const isLoading = currentUser === undefined;

  const can = (action: Action): boolean => {
    return ROLE_PERMISSIONS[role]?.includes(action) ?? false;
  };

  const hasRole = (requiredRole: Role): boolean => {
    const hierarchy: Role[] = ["staff", "manager", "admin"];
    return hierarchy.indexOf(role) >= hierarchy.indexOf(requiredRole);
  };

  return {
    role,
    isLoading,
    isAdmin: role === "admin",
    isManager: role === "manager" || role === "admin",
    can,
    hasRole,
    user: currentUser,
  };
}
