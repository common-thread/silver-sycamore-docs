/**
 * Centralized authentication utilities for Convex functions.
 *
 * This module provides properly typed helpers for authentication,
 * replacing the duplicated `getCurrentUser` functions across files.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id, Doc } from "../_generated/dataModel";
import { Role, canPerform, Action } from "./roles";

// Context type that works for both queries and mutations
type AuthContext = QueryCtx | MutationCtx;

// Return type for getCurrentUser
export interface CurrentUser {
  user: Doc<"users">;
  profile: Doc<"userProfiles"> | null;
  role: Role;
}

/**
 * Get the current authenticated user with their profile.
 * Returns null if not authenticated or user not found.
 *
 * @example
 * ```ts
 * const currentUser = await getCurrentUser(ctx);
 * if (!currentUser) return null; // Not authenticated
 *
 * // Access user data
 * console.log(currentUser.user.email);
 * console.log(currentUser.role); // "staff" | "manager" | "admin"
 * ```
 */
export async function getCurrentUser(ctx: AuthContext): Promise<CurrentUser | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  // Find user by email from auth identity
  const user = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("email"), identity.email))
    .first();

  if (!user) return null;

  // Get profile for role information
  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q) => q.eq("userId", user._id))
    .first();

  return {
    user,
    profile,
    role: (profile?.role as Role) ?? "staff",
  };
}

/**
 * Get the current user ID without full profile lookup.
 * Useful for lightweight ownership checks.
 *
 * @example
 * ```ts
 * const userId = await getCurrentUserId(ctx);
 * if (!userId) throw new Error("Not authenticated");
 * ```
 */
export async function getCurrentUserId(ctx: AuthContext): Promise<Id<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("email"), identity.email))
    .first();

  return user?._id ?? null;
}

/**
 * Require authentication, throwing if not authenticated.
 * Use this at the start of mutations that require auth.
 *
 * @example
 * ```ts
 * handler: async (ctx, args) => {
 *   const currentUser = await requireAuth(ctx);
 *   // Safe to use currentUser here - guaranteed non-null
 * }
 * ```
 */
export async function requireAuth(ctx: AuthContext): Promise<CurrentUser> {
  const currentUser = await getCurrentUser(ctx);
  if (!currentUser) {
    throw new Error("Not authenticated");
  }
  return currentUser;
}

/**
 * Require authentication and a specific permission.
 * Throws if not authenticated or lacking permission.
 *
 * @example
 * ```ts
 * handler: async (ctx, args) => {
 *   const currentUser = await requirePermission(ctx, "edit_content");
 *   // User is authenticated and has edit_content permission
 * }
 * ```
 */
export async function requirePermission(
  ctx: AuthContext,
  action: Action
): Promise<CurrentUser> {
  const currentUser = await requireAuth(ctx);

  if (!canPerform(currentUser.role, action)) {
    throw new Error(`Permission denied: ${action} requires higher role`);
  }

  return currentUser;
}

/**
 * Check if the current user owns a resource.
 *
 * @example
 * ```ts
 * const document = await ctx.db.get(args.id);
 * if (!await isOwner(ctx, document?.ownerId)) {
 *   throw new Error("Access denied");
 * }
 * ```
 */
export async function isOwner(
  ctx: AuthContext,
  ownerId: Id<"users"> | undefined
): Promise<boolean> {
  if (!ownerId) return false;

  const userId = await getCurrentUserId(ctx);
  return userId === ownerId;
}

/**
 * Check if current user has at least the specified role level.
 *
 * @example
 * ```ts
 * if (await hasRole(ctx, "manager")) {
 *   // User is manager or admin
 * }
 * ```
 */
export async function hasRole(
  ctx: AuthContext,
  requiredRole: Role
): Promise<boolean> {
  const currentUser = await getCurrentUser(ctx);
  if (!currentUser) return false;

  const roleHierarchy: Role[] = ["staff", "manager", "admin"];
  const userLevel = roleHierarchy.indexOf(currentUser.role);
  const requiredLevel = roleHierarchy.indexOf(requiredRole);

  return userLevel >= requiredLevel;
}
