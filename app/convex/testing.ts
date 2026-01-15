/**
 * Testing utilities for E2E tests.
 * These mutations are internal and should only be called from test setup scripts.
 */
import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * Check if test users exist by email pattern.
 * Test users follow the pattern: e2e-staff-{date}@test.com, e2e-manager-{date}@test.com
 */
export const getTestUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    // Find all users with e2e- prefix in email
    const allUsers = await ctx.db.query("users").collect();
    const testUsers = allUsers.filter(
      (user) =>
        user.email?.startsWith("e2e-staff") ||
        user.email?.startsWith("e2e-manager")
    );

    return testUsers.map((user) => ({
      id: user._id,
      email: user.email,
    }));
  },
});

/**
 * Update a test user's role in their profile.
 * This is called after the user has been created via the auth flow.
 */
export const setTestUserRole = internalMutation({
  args: {
    email: v.string(),
    role: v.string(),
  },
  handler: async (ctx, { email, role }) => {
    // Validate role
    if (!["admin", "manager", "staff"].includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }

    // Find user by email
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .first();

    if (!user) {
      throw new Error(`User not found: ${email}`);
    }

    // Find their profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!profile) {
      throw new Error(`Profile not found for user: ${email}`);
    }

    // Update role
    await ctx.db.patch(profile._id, {
      role,
      updatedAt: Date.now(),
    });

    return { success: true, userId: user._id, role };
  },
});

/**
 * Clean up all E2E test users and their data.
 * Useful for resetting test state between runs.
 */
export const cleanupTestUsers = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Find all users with e2e- prefix in email
    const allUsers = await ctx.db.query("users").collect();
    const testUsers = allUsers.filter(
      (user) =>
        user.email?.startsWith("e2e-staff") ||
        user.email?.startsWith("e2e-manager")
    );

    let cleaned = 0;

    for (const user of testUsers) {
      // Delete profile
      const profile = await ctx.db
        .query("userProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .first();

      if (profile) {
        await ctx.db.delete(profile._id);
      }

      // Note: The user record itself is managed by convex-auth
      // We only clean up the userProfiles we control
      cleaned++;
    }

    return { cleaned, users: testUsers.map((u) => u.email) };
  },
});
