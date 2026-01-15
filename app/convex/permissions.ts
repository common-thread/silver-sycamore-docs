import { QueryCtx, MutationCtx } from "./_generated/server";
import { Role, Action, canPerform, hasRoleLevel } from "./lib/roles";

// Get current user's role from profile
export async function getCurrentUserRole(
  ctx: QueryCtx | MutationCtx
): Promise<Role | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("email"), identity.email))
    .first();

  if (!user) return null;

  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q) => q.eq("userId", user._id))
    .first();

  return (profile?.role as Role) ?? "staff";
}

// Check if current user can perform action
export async function canUserPerform(
  ctx: QueryCtx | MutationCtx,
  action: Action
): Promise<boolean> {
  const role = await getCurrentUserRole(ctx);
  if (!role) return false;
  return canPerform(role, action);
}

// Assert permission or throw
export async function assertPermission(
  ctx: QueryCtx | MutationCtx,
  action: Action
): Promise<void> {
  const canDo = await canUserPerform(ctx, action);
  if (!canDo) {
    throw new Error(`Permission denied: ${action}`);
  }
}

// Check if current user has at least required role level
export async function hasRequiredRole(
  ctx: QueryCtx | MutationCtx,
  requiredRole: Role
): Promise<boolean> {
  const role = await getCurrentUserRole(ctx);
  if (!role) return false;
  return hasRoleLevel(role, requiredRole);
}
