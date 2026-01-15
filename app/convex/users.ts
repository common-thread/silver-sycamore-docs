import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Internal mutation for creating profile (called from auth callback)
export const createProfileForUser = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    // Check if profile exists
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!existing) {
      await ctx.db.insert("userProfiles", {
        userId,
        role: "staff", // Default role
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

// Get current authenticated user with profile
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Find user by email (from auth identity)
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) return null;

    // Get profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      profile: profile
        ? {
            displayName: profile.displayName,
            role: profile.role,
            department: profile.department,
            avatarUrl: profile.avatarUrl,
          }
        : null,
    };
  },
});

// Get profile by userId
export const getProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

// Update current user's profile
export const updateProfile = mutation({
  args: {
    displayName: v.optional(v.string()),
    department: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) throw new Error("User not found");

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {
      ...args,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Create profile if doesn't exist (called after signup)
export const ensureProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) throw new Error("User not found");

    // Check if profile exists
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (existing) {
      return { profileId: existing._id, created: false };
    }

    // Create default profile
    const profileId = await ctx.db.insert("userProfiles", {
      userId: user._id,
      role: "staff", // Default role
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { profileId, created: true };
  },
});

// Make first user admin (can only be run once)
export const makeFirstUserAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if any admin exists
    const existingAdmin = await ctx.db
      .query("userProfiles")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .first();

    if (existingAdmin) {
      throw new Error("Admin already exists");
    }

    // Get current user
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) throw new Error("User not found");

    // Get their profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, { role: "admin", updatedAt: Date.now() });
      return { success: true, message: "You are now an admin" };
    }

    throw new Error("Profile not found - sign in first");
  },
});

// Admin-only: Set user role
export const setUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.string(),
  },
  handler: async (ctx, { userId, role }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if current user is admin
    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!currentUser) throw new Error("User not found");

    const currentProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
      .first();

    if (currentProfile?.role !== "admin") {
      throw new Error("Only admins can change roles");
    }

    // Validate role
    if (!["admin", "manager", "staff"].includes(role)) {
      throw new Error("Invalid role");
    }

    // Update target user's role
    const targetProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!targetProfile) throw new Error("Target profile not found");

    await ctx.db.patch(targetProfile._id, { role, updatedAt: Date.now() });

    return { success: true };
  },
});

// List all users (admin only)
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Check if admin
    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!currentUser) return [];

    const currentProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
      .first();

    if (currentProfile?.role !== "admin") return [];

    // Get all profiles with user info
    const profiles = await ctx.db.query("userProfiles").collect();

    const usersWithProfiles = await Promise.all(
      profiles.map(async (profile) => {
        const user = await ctx.db.get(profile.userId);
        return {
          id: profile.userId,
          email: user?.email,
          name: user?.name,
          role: profile.role,
          department: profile.department,
          displayName: profile.displayName,
        };
      })
    );

    return usersWithProfiles;
  },
});
