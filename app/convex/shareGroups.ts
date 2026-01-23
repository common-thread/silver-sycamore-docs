import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { getCurrentUserId } from "./lib/auth";

// List groups current user owns
export const listMyGroups = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    const groups = await ctx.db
      .query("shareGroups")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();

    // Get member count for each group
    const groupsWithCounts = await Promise.all(
      groups.map(async (group) => {
        const members = await ctx.db
          .query("groupMembers")
          .withIndex("by_group", (q) => q.eq("groupId", group._id))
          .collect();

        return {
          ...group,
          memberCount: members.length,
        };
      })
    );

    return groupsWithCounts;
  },
});

// List groups current user is a member of (not owner)
export const listMyMemberships = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Get group details for each membership
    const groups = await Promise.all(
      memberships.map(async (membership) => {
        const group = await ctx.db.get(membership.groupId) as Doc<"shareGroups"> | null;
        if (!group) return null;

        // Get owner info
        const owner = await ctx.db.get(group.ownerId) as Doc<"users"> | null;

        // Get member count
        const members = await ctx.db
          .query("groupMembers")
          .withIndex("by_group", (q) => q.eq("groupId", group._id))
          .collect();

        return {
          _id: group._id,
          name: group.name,
          createdAt: group.createdAt,
          memberCount: members.length,
          owner: owner
            ? { id: owner._id, email: owner.email, name: owner.name }
            : null,
          joinedAt: membership.addedAt,
        };
      })
    );

    return groups.filter(Boolean);
  },
});

// Get single group with members
export const get = query({
  args: {
    id: v.id("shareGroups"),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return null;

    const group = await ctx.db.get(args.id);
    if (!group) return null;

    // Check if user owns or is member of the group
    const isMember = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_user", (q) =>
        q.eq("groupId", args.id).eq("userId", userId)
      )
      .first();

    if (group.ownerId !== userId && !isMember) return null;

    // Get members with user info
    const members = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) => q.eq("groupId", args.id))
      .collect();

    const membersWithInfo = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId) as Doc<"users"> | null;
        return {
          _id: member._id,
          userId: member.userId,
          email: user?.email,
          name: user?.name,
          addedAt: member.addedAt,
        };
      })
    );

    return {
      ...group,
      isOwner: group.ownerId === userId,
      members: membersWithInfo,
    };
  },
});

// Get all members of a group with user info
export const getMembers = query({
  args: {
    groupId: v.id("shareGroups"),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    const group = await ctx.db.get(args.groupId);
    if (!group) return [];

    // Check if user owns or is member of the group
    const isMember = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", userId)
      )
      .first();

    if (group.ownerId !== userId && !isMember) return [];

    const members = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    const membersWithInfo = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId) as Doc<"users"> | null;
        return {
          _id: member._id,
          userId: member.userId,
          email: user?.email,
          name: user?.name,
          addedAt: member.addedAt,
        };
      })
    );

    return membersWithInfo;
  },
});

// Create new group (any user can create groups)
export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    if (!args.name.trim()) {
      throw new Error("Group name cannot be empty");
    }

    return await ctx.db.insert("shareGroups", {
      name: args.name.trim(),
      ownerId: userId,
      createdAt: Date.now(),
    });
  },
});

// Rename group (owner only)
export const rename = mutation({
  args: {
    id: v.id("shareGroups"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const group = await ctx.db.get(args.id);
    if (!group || group.ownerId !== userId) {
      throw new Error("Group not found or access denied");
    }

    if (!args.name.trim()) {
      throw new Error("Group name cannot be empty");
    }

    await ctx.db.patch(args.id, { name: args.name.trim() });
  },
});

// Delete group (owner only, cascades)
export const remove = mutation({
  args: {
    id: v.id("shareGroups"),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const group = await ctx.db.get(args.id);
    if (!group || group.ownerId !== userId) {
      throw new Error("Group not found or access denied");
    }

    // Cascade delete: remove all folder shares referencing this group
    const shares = await ctx.db
      .query("folderShares")
      .withIndex("by_group", (q) => q.eq("sharedWithGroupId", args.id))
      .collect();
    for (const share of shares) {
      await ctx.db.delete(share._id);
    }

    // Cascade delete: remove all group members
    const members = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) => q.eq("groupId", args.id))
      .collect();
    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    // Delete the group itself
    await ctx.db.delete(args.id);
  },
});

// Add user to group (owner only)
export const addMember = mutation({
  args: {
    groupId: v.id("shareGroups"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getCurrentUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    const group = await ctx.db.get(args.groupId);
    if (!group || group.ownerId !== currentUserId) {
      throw new Error("Group not found or access denied");
    }

    // Verify target user exists
    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    // Check if already a member
    const existingMember = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", args.userId)
      )
      .first();

    if (existingMember) {
      throw new Error("User is already a member of this group");
    }

    return await ctx.db.insert("groupMembers", {
      groupId: args.groupId,
      userId: args.userId,
      addedAt: Date.now(),
    });
  },
});

// Remove user from group (owner only)
export const removeMember = mutation({
  args: {
    groupId: v.id("shareGroups"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getCurrentUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    const group = await ctx.db.get(args.groupId);
    if (!group || group.ownerId !== currentUserId) {
      throw new Error("Group not found or access denied");
    }

    // Find membership
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", args.userId)
      )
      .first();

    if (!membership) {
      throw new Error("User is not a member of this group");
    }

    await ctx.db.delete(membership._id);
  },
});
