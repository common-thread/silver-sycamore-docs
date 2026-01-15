import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Helper to get current user from auth context
async function getCurrentUser(ctx: { auth: any; db: any }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .filter((q: any) => q.eq(q.field("email"), identity.email))
    .first();

  if (!user) return null;

  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
    .first();

  return { user, profile };
}

// Helper to check if user is member of a channel
async function getMembership(
  ctx: { db: any },
  channelId: string,
  userId: string
) {
  return ctx.db
    .query("channelMembers")
    .withIndex("by_channel_user", (q: any) =>
      q.eq("channelId", channelId).eq("userId", userId)
    )
    .first();
}

// Helper to get user info for member display
async function getMemberInfo(ctx: { db: any }, userId: string) {
  const user = await ctx.db.get(userId);
  if (!user) return null;

  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q: any) => q.eq("userId", userId))
    .first();

  return {
    id: userId,
    email: user.email,
    name: user.name,
    displayName: profile?.displayName,
    avatarUrl: profile?.avatarUrl,
  };
}

// ============================================
// QUERIES
// ============================================

// Get all channels where user is a member
export const listUserChannels = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return [];

    // Get all memberships for current user
    const memberships = await ctx.db
      .query("channelMembers")
      .withIndex("by_user", (q) => q.eq("userId", currentUser.user._id))
      .collect();

    // Get channel details for each membership
    const channelsWithMembership = await Promise.all(
      memberships.map(async (membership) => {
        const channel = await ctx.db.get(membership.channelId);
        if (!channel || channel.isArchived) return null;

        // For DM channels, get the other user's info
        let dmPartner = null;
        if (channel.type === "dm") {
          const allMembers = await ctx.db
            .query("channelMembers")
            .withIndex("by_channel", (q) => q.eq("channelId", channel._id))
            .collect();
          const otherMember = allMembers.find(
            (m) => m.userId !== currentUser.user._id
          );
          if (otherMember) {
            dmPartner = await getMemberInfo(ctx, otherMember.userId);
          }
        }

        return {
          ...channel,
          dmPartner,
          membership: {
            role: membership.role,
            joinedAt: membership.joinedAt,
            lastReadAt: membership.lastReadAt,
          },
        };
      })
    );

    // Filter out nulls (archived channels)
    return channelsWithMembership.filter(
      (c): c is NonNullable<typeof c> => c !== null
    );
  },
});

// Get single channel by ID (only if user is member)
export const getChannel = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, { channelId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return null;

    // Check membership
    const membership = await getMembership(
      ctx,
      channelId,
      currentUser.user._id
    );
    if (!membership) return null;

    const channel = await ctx.db.get(channelId);
    if (!channel || channel.isArchived) return null;

    return {
      ...channel,
      membership: {
        role: membership.role,
        joinedAt: membership.joinedAt,
        lastReadAt: membership.lastReadAt,
      },
    };
  },
});

// Get all members of a channel with their profiles
export const getChannelMembers = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, { channelId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return [];

    // Check membership
    const membership = await getMembership(
      ctx,
      channelId,
      currentUser.user._id
    );
    if (!membership) return [];

    // Get all memberships for this channel
    const memberships = await ctx.db
      .query("channelMembers")
      .withIndex("by_channel", (q) => q.eq("channelId", channelId))
      .collect();

    // Get member info for each
    const membersWithInfo = await Promise.all(
      memberships.map(async (m) => {
        const userInfo = await getMemberInfo(ctx, m.userId);
        if (!userInfo) return null;

        return {
          ...userInfo,
          role: m.role,
          joinedAt: m.joinedAt,
        };
      })
    );

    return membersWithInfo.filter(
      (m): m is NonNullable<typeof m> => m !== null
    );
  },
});

// Find existing DM channel between two users
export const findDMChannel = query({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, { otherUserId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return null;

    // Get all DM channels the current user is in
    const myMemberships = await ctx.db
      .query("channelMembers")
      .withIndex("by_user", (q) => q.eq("userId", currentUser.user._id))
      .collect();

    // Check each channel to see if it's a DM with the other user
    for (const membership of myMemberships) {
      const channel = await ctx.db.get(membership.channelId);
      if (!channel || channel.type !== "dm" || channel.isArchived) continue;

      // Check if other user is also a member
      const otherMembership = await getMembership(
        ctx,
        membership.channelId,
        otherUserId
      );
      if (otherMembership) {
        return {
          ...channel,
          membership: {
            role: membership.role,
            joinedAt: membership.joinedAt,
            lastReadAt: membership.lastReadAt,
          },
        };
      }
    }

    return null;
  },
});

// Get the other user's profile in a DM channel
export const getDMPartner = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, { channelId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return null;

    // Verify channel is a DM and user is a member
    const channel = await ctx.db.get(channelId);
    if (!channel || channel.type !== "dm" || channel.isArchived) return null;

    const membership = await getMembership(ctx, channelId, currentUser.user._id);
    if (!membership) return null;

    // Get all members of the DM
    const memberships = await ctx.db
      .query("channelMembers")
      .withIndex("by_channel", (q) => q.eq("channelId", channelId))
      .collect();

    // Find the other member (not current user)
    const otherMembership = memberships.find(
      (m) => m.userId !== currentUser.user._id
    );
    if (!otherMembership) return null;

    // Get the other user's info
    return getMemberInfo(ctx, otherMembership.userId);
  },
});

// ============================================
// MUTATIONS
// ============================================

// Create a new public or private channel
export const createChannel = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("public"), v.literal("private")),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { name, type, description }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const now = Date.now();

    // Create the channel
    const channelId = await ctx.db.insert("channels", {
      name: name.trim(),
      type,
      description: description?.trim(),
      creatorId: currentUser.user._id,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    });

    // Add creator as owner
    await ctx.db.insert("channelMembers", {
      channelId,
      userId: currentUser.user._id,
      role: "owner",
      joinedAt: now,
      lastReadAt: now,
    });

    return { channelId };
  },
});

// Update channel name/description (owner/admin only)
export const updateChannel = mutation({
  args: {
    channelId: v.id("channels"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { channelId, name, description }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    // Check membership and role
    const membership = await getMembership(
      ctx,
      channelId,
      currentUser.user._id
    );
    if (!membership) throw new Error("Not a member of this channel");
    if (membership.role !== "owner" && membership.role !== "admin") {
      throw new Error("Only owners and admins can update channel");
    }

    const channel = await ctx.db.get(channelId);
    if (!channel || channel.isArchived) throw new Error("Channel not found");

    const updates: Record<string, any> = { updatedAt: Date.now() };
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description?.trim();

    await ctx.db.patch(channelId, updates);

    return { success: true };
  },
});

// Archive a channel (owner only)
export const archiveChannel = mutation({
  args: { channelId: v.id("channels") },
  handler: async (ctx, { channelId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    // Check membership and role
    const membership = await getMembership(
      ctx,
      channelId,
      currentUser.user._id
    );
    if (!membership) throw new Error("Not a member of this channel");
    if (membership.role !== "owner") {
      throw new Error("Only owners can archive channel");
    }

    await ctx.db.patch(channelId, {
      isArchived: true,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Join a public channel
export const joinChannel = mutation({
  args: { channelId: v.id("channels") },
  handler: async (ctx, { channelId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const channel = await ctx.db.get(channelId);
    if (!channel || channel.isArchived) throw new Error("Channel not found");

    // Can only join public channels
    if (channel.type !== "public") {
      throw new Error("Cannot join private channels - must be invited");
    }

    // Check if already a member
    const existing = await getMembership(ctx, channelId, currentUser.user._id);
    if (existing) throw new Error("Already a member of this channel");

    const now = Date.now();

    await ctx.db.insert("channelMembers", {
      channelId,
      userId: currentUser.user._id,
      role: "member",
      joinedAt: now,
      lastReadAt: now,
    });

    return { success: true };
  },
});

// Leave a channel (can't leave if owner)
export const leaveChannel = mutation({
  args: { channelId: v.id("channels") },
  handler: async (ctx, { channelId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const membership = await getMembership(
      ctx,
      channelId,
      currentUser.user._id
    );
    if (!membership) throw new Error("Not a member of this channel");

    if (membership.role === "owner") {
      throw new Error("Owners cannot leave channel - transfer ownership first");
    }

    await ctx.db.delete(membership._id);

    return { success: true };
  },
});

// Add a user to a channel (owner/admin only for private channels)
export const addMember = mutation({
  args: {
    channelId: v.id("channels"),
    userId: v.id("users"),
    role: v.optional(v.union(v.literal("admin"), v.literal("member"))),
  },
  handler: async (ctx, { channelId, userId, role = "member" }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const channel = await ctx.db.get(channelId);
    if (!channel || channel.isArchived) throw new Error("Channel not found");

    // Check requester's membership and role
    const requesterMembership = await getMembership(
      ctx,
      channelId,
      currentUser.user._id
    );
    if (!requesterMembership) throw new Error("Not a member of this channel");

    // For private channels, only owner/admin can add
    if (channel.type === "private") {
      if (
        requesterMembership.role !== "owner" &&
        requesterMembership.role !== "admin"
      ) {
        throw new Error("Only owners and admins can add members to private channels");
      }
    }

    // Check if user is already a member
    const existing = await getMembership(ctx, channelId, userId);
    if (existing) throw new Error("User is already a member");

    const now = Date.now();

    await ctx.db.insert("channelMembers", {
      channelId,
      userId,
      role,
      joinedAt: now,
      lastReadAt: now,
    });

    return { success: true };
  },
});

// Remove a user from a channel (owner/admin only)
export const removeMember = mutation({
  args: {
    channelId: v.id("channels"),
    userId: v.id("users"),
  },
  handler: async (ctx, { channelId, userId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    // Check requester's membership and role
    const requesterMembership = await getMembership(
      ctx,
      channelId,
      currentUser.user._id
    );
    if (!requesterMembership) throw new Error("Not a member of this channel");

    if (
      requesterMembership.role !== "owner" &&
      requesterMembership.role !== "admin"
    ) {
      throw new Error("Only owners and admins can remove members");
    }

    // Find target's membership
    const targetMembership = await getMembership(ctx, channelId, userId);
    if (!targetMembership) throw new Error("User is not a member");

    // Can't remove the owner
    if (targetMembership.role === "owner") {
      throw new Error("Cannot remove the channel owner");
    }

    // Admins can't remove other admins (only owner can)
    if (
      targetMembership.role === "admin" &&
      requesterMembership.role !== "owner"
    ) {
      throw new Error("Only owners can remove admins");
    }

    await ctx.db.delete(targetMembership._id);

    return { success: true };
  },
});

// Update lastReadAt for current user in a channel
export const updateLastRead = mutation({
  args: { channelId: v.id("channels") },
  handler: async (ctx, { channelId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const membership = await getMembership(
      ctx,
      channelId,
      currentUser.user._id
    );
    if (!membership) throw new Error("Not a member of this channel");

    await ctx.db.patch(membership._id, {
      lastReadAt: Date.now(),
    });

    return { success: true };
  },
});

// Find or create a DM channel with another user (idempotent)
export const findOrCreateDM = mutation({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, { otherUserId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    // Cannot DM yourself
    if (otherUserId === currentUser.user._id) {
      throw new Error("Cannot create DM with yourself");
    }

    // Check if other user exists
    const otherUser = await ctx.db.get(otherUserId);
    if (!otherUser) throw new Error("User not found");

    // Look for existing DM channel
    const myMemberships = await ctx.db
      .query("channelMembers")
      .withIndex("by_user", (q) => q.eq("userId", currentUser.user._id))
      .collect();

    for (const membership of myMemberships) {
      const channel = await ctx.db.get(membership.channelId);
      if (!channel || channel.type !== "dm" || channel.isArchived) continue;

      // Check if other user is also a member
      const otherMembership = await getMembership(
        ctx,
        membership.channelId,
        otherUserId
      );
      if (otherMembership) {
        // Found existing DM
        return { channelId: channel._id, created: false };
      }
    }

    // No existing DM found, create new one
    const now = Date.now();

    const channelId = await ctx.db.insert("channels", {
      name: "", // DMs display the other user's name, not channel name
      type: "dm",
      description: undefined,
      creatorId: currentUser.user._id,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    });

    // Add both users as members
    await ctx.db.insert("channelMembers", {
      channelId,
      userId: currentUser.user._id,
      role: "member",
      joinedAt: now,
      lastReadAt: now,
    });

    await ctx.db.insert("channelMembers", {
      channelId,
      userId: otherUserId,
      role: "member",
      joinedAt: now,
      lastReadAt: undefined, // Other user hasn't read it yet
    });

    return { channelId, created: true };
  },
});
