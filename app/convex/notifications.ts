import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

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

// Helper to get user display info
async function getUserDisplayInfo(ctx: { db: any }, userId: Id<"users">) {
  const user = await ctx.db.get(userId);
  if (!user) return { id: userId, displayName: "Unknown", avatarUrl: undefined };

  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q: any) => q.eq("userId", userId))
    .first();

  return {
    id: userId,
    displayName: profile?.displayName || user.name || user.email || "Unknown",
    avatarUrl: profile?.avatarUrl,
  };
}

// Helper to get channel display info
async function getChannelDisplayInfo(ctx: { db: any }, channelId: Id<"channels">) {
  const channel = await ctx.db.get(channelId);
  if (!channel) return { id: channelId, name: "Unknown Channel", type: "public" };

  return {
    id: channelId,
    name: channel.name,
    type: channel.type,
  };
}

// ============================================
// QUERIES
// ============================================

// Get user's notifications (paginated, newest first)
export const listNotifications = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.id("notifications")),
  },
  handler: async (ctx, { limit = 20, cursor }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return { notifications: [], nextCursor: null };

    // Get notifications for this user
    let notificationsQuery = ctx.db
      .query("notifications")
      .withIndex("by_user", (q: any) => q.eq("userId", currentUser.user._id))
      .order("desc"); // Newest first

    // Apply cursor if provided
    if (cursor) {
      const cursorNotification = await ctx.db.get(cursor);
      if (cursorNotification) {
        notificationsQuery = ctx.db
          .query("notifications")
          .filter((q: any) =>
            q.and(
              q.eq(q.field("userId"), currentUser.user._id),
              q.lt(q.field("createdAt"), cursorNotification.createdAt)
            )
          )
          .order("desc");
      }
    }

    // Get notifications + 1 to check for more
    const notifications = await notificationsQuery.take(limit + 1);

    // Determine if there are more notifications
    const hasMore = notifications.length > limit;
    const paginatedNotifications = hasMore ? notifications.slice(0, limit) : notifications;

    // Enrich each notification with sender and channel info
    const enrichedNotifications = await Promise.all(
      paginatedNotifications.map(async (notification) => {
        const fromUser = await getUserDisplayInfo(ctx, notification.fromUserId);
        const channel = await getChannelDisplayInfo(ctx, notification.channelId);

        return {
          ...notification,
          fromUser,
          channel,
        };
      })
    );

    return {
      notifications: enrichedNotifications,
      nextCursor: hasMore ? paginatedNotifications[paginatedNotifications.length - 1]._id : null,
    };
  },
});

// Get count of unread notifications for badge
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return 0;

    // Count unread notifications
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q: any) =>
        q.eq("userId", currentUser.user._id).eq("isRead", false)
      )
      .collect();

    return unreadNotifications.length;
  },
});

// ============================================
// MUTATIONS
// ============================================

// Create notifications for @mentions in a message
export const createMentionNotifications = mutation({
  args: {
    messageId: v.id("messages"),
    channelId: v.id("channels"),
    content: v.string(),
    authorId: v.id("users"),
  },
  handler: async (ctx, { messageId, channelId, content, authorId }) => {
    // Parse @[userId] mentions from content
    const mentionRegex = /@\[([^\]]+)\]/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }

    if (mentions.length === 0) return { created: 0 };

    const now = Date.now();
    let created = 0;

    for (const mentionedUserId of mentions) {
      // Don't notify the author if they mention themselves
      if (mentionedUserId === authorId) continue;

      // Check if this user exists
      const user = await ctx.db.get(mentionedUserId as Id<"users">);
      if (!user) continue;

      // Check if user already has an unread notification for this message
      const existingNotification = await ctx.db
        .query("notifications")
        .filter((q: any) =>
          q.and(
            q.eq(q.field("userId"), mentionedUserId),
            q.eq(q.field("messageId"), messageId),
            q.eq(q.field("isRead"), false)
          )
        )
        .first();

      if (existingNotification) continue;

      // Create notification
      await ctx.db.insert("notifications", {
        userId: mentionedUserId as Id<"users">,
        type: "mention",
        channelId,
        messageId,
        fromUserId: authorId,
        isRead: false,
        createdAt: now,
      });

      created++;
    }

    return { created };
  },
});

// Mark a single notification as read
export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, { notificationId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const notification = await ctx.db.get(notificationId);
    if (!notification) throw new Error("Notification not found");

    // Only the recipient can mark as read
    if (notification.userId !== currentUser.user._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(notificationId, { isRead: true });

    return { success: true };
  },
});

// Mark all user's notifications as read
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    // Get all unread notifications for this user
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q: any) =>
        q.eq("userId", currentUser.user._id).eq("isRead", false)
      )
      .collect();

    // Mark each as read
    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, { isRead: true });
    }

    return { marked: unreadNotifications.length };
  },
});
