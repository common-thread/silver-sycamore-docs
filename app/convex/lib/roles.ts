// Role definitions for Silver Sycamore Staff Hub
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Role hierarchy (higher index = more permissions)
export const ROLE_HIERARCHY: Role[] = ["staff", "manager", "admin"];

// Check if roleA has at least the permissions of roleB
export function hasRoleLevel(userRole: Role, requiredRole: Role): boolean {
  const userLevel = ROLE_HIERARCHY.indexOf(userRole);
  const requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
  return userLevel >= requiredLevel;
}

// Permission actions
export const ACTIONS = {
  VIEW_CONTENT: "view_content",
  EDIT_CONTENT: "edit_content",
  DELETE_CONTENT: "delete_content",
  MANAGE_USERS: "manage_users",
  VIEW_ANALYTICS: "view_analytics",
} as const;

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];

// Role-action mapping
export const ROLE_PERMISSIONS: Record<Role, Action[]> = {
  staff: ["view_content"],
  manager: ["view_content", "edit_content", "view_analytics"],
  admin: ["view_content", "edit_content", "delete_content", "manage_users", "view_analytics"],
};

export function canPerform(role: Role, action: Action): boolean {
  return ROLE_PERMISSIONS[role]?.includes(action) ?? false;
}
