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

// Helper to get author info for a message
async function getAuthorInfo(ctx: { db: any }, authorId: string) {
  const user = await ctx.db.get(authorId);
  if (!user) return { id: authorId, displayName: "Unknown", avatarUrl: undefined };

  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q: any) => q.eq("userId", authorId))
    .first();

  return {
    id: authorId,
    displayName: profile?.displayName || user.name || user.email || "Unknown",
    avatarUrl: profile?.avatarUrl,
  };
}

// ============================================
// QUERIES
// ============================================

// Get messages for a channel (paginated, newest first)
export const listMessages = query({
  args: {
    channelId: v.id("channels"),
    limit: v.optional(v.number()),
    cursor: v.optional(v.id("messages")), // Message ID to paginate from
  },
  handler: async (ctx, { channelId, limit = 50, cursor }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return { messages: [], nextCursor: null };

    // Check membership
    const membership = await getMembership(
      ctx,
      channelId,
      currentUser.user._id
    );
    if (!membership) return { messages: [], nextCursor: null };

    // Get messages for this channel
    let messagesQuery = ctx.db
      .query("messages")
      .withIndex("by_channel_created", (q: any) => q.eq("channelId", channelId))
      .order("desc"); // Newest first

    // Apply cursor if provided (get messages older than cursor)
    if (cursor) {
      const cursorMessage = await ctx.db.get(cursor);
      if (cursorMessage) {
        messagesQuery = ctx.db
          .query("messages")
          .withIndex("by_channel_created", (q: any) =>
            q.eq("channelId", channelId).lt("createdAt", cursorMessage.createdAt)
          )
          .order("desc");
      }
    }

    // Get messages + 1 to check for more
    const messages = await messagesQuery.take(limit + 1);

    // Determine if there are more messages
    const hasMore = messages.length > limit;
    const paginatedMessages = hasMore ? messages.slice(0, limit) : messages;

    // Add author info to each message
    const messagesWithAuthors = await Promise.all(
      paginatedMessages.map(async (message) => ({
        ...message,
        author: await getAuthorInfo(ctx, message.authorId),
      }))
    );

    return {
      messages: messagesWithAuthors,
      nextCursor: hasMore ? paginatedMessages[paginatedMessages.length - 1]._id : null,
    };
  },
});

// Get a single message by ID
export const getMessage = query({
  args: { messageId: v.id("messages") },
  handler: async (ctx, { messageId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return null;

    const message = await ctx.db.get(messageId);
    if (!message) return null;

    // Check membership
    const membership = await getMembership(
      ctx,
      message.channelId,
      currentUser.user._id
    );
    if (!membership) return null;

    return {
      ...message,
      author: await getAuthorInfo(ctx, message.authorId),
    };
  },
});

// Get replies to a parent message (for threading)
export const getThreadMessages = query({
  args: { parentId: v.id("messages") },
  handler: async (ctx, { parentId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return [];

    // Get parent message to verify channel membership
    const parent = await ctx.db.get(parentId);
    if (!parent) return [];

    // Check membership
    const membership = await getMembership(
      ctx,
      parent.channelId,
      currentUser.user._id
    );
    if (!membership) return [];

    // Get all replies to this message
    const replies = await ctx.db
      .query("messages")
      .withIndex("by_parent", (q) => q.eq("parentId", parentId))
      .collect();

    // Sort by createdAt ascending (oldest first for threads)
    replies.sort((a, b) => a.createdAt - b.createdAt);

    // Add author info to each reply
    const repliesWithAuthors = await Promise.all(
      replies.map(async (reply) => ({
        ...reply,
        author: await getAuthorInfo(ctx, reply.authorId),
      }))
    );

    return repliesWithAuthors;
  },
});

// Get count of unread messages in a channel
export const getUnreadCount = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, { channelId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return 0;

    // Check membership and get lastReadAt
    const membership = await getMembership(
      ctx,
      channelId,
      currentUser.user._id
    );
    if (!membership) return 0;

    const lastReadAt = membership.lastReadAt || 0;

    // Count messages created after lastReadAt
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_channel_created", (q: any) =>
        q.eq("channelId", channelId).gt("createdAt", lastReadAt)
      )
      .collect();

    return unreadMessages.length;
  },
});

// ============================================
// MUTATIONS
// ============================================

// Send a message to a channel
export const sendMessage = mutation({
  args: {
    channelId: v.id("channels"),
    content: v.string(),
    parentId: v.optional(v.id("messages")),
    fileId: v.optional(v.id("files")),
  },
  handler: async (ctx, { channelId, content, parentId, fileId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    // Check membership
    const membership = await getMembership(
      ctx,
      channelId,
      currentUser.user._id
    );
    if (!membership) throw new Error("Not a member of this channel");

    // Validate content is not empty
    if (!content.trim()) {
      throw new Error("Message content cannot be empty");
    }

    // If parentId provided, verify it exists and is in the same channel
    if (parentId) {
      const parent = await ctx.db.get(parentId);
      if (!parent) throw new Error("Parent message not found");
      if (parent.channelId !== channelId) {
        throw new Error("Parent message is not in this channel");
      }
    }

    const now = Date.now();

    const messageId = await ctx.db.insert("messages", {
      channelId,
      authorId: currentUser.user._id,
      content: content.trim(),
      parentId,
      fileId,
      isEdited: false,
      createdAt: now,
      updatedAt: now,
    });

    // Return the new message with author info
    const newMessage = await ctx.db.get(messageId);
    return {
      ...newMessage,
      author: await getAuthorInfo(ctx, currentUser.user._id),
    };
  },
});

// Edit a message (author only)
export const editMessage = mutation({
  args: {
    messageId: v.id("messages"),
    content: v.string(),
  },
  handler: async (ctx, { messageId, content }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const message = await ctx.db.get(messageId);
    if (!message) throw new Error("Message not found");

    // Only author can edit
    if (message.authorId !== currentUser.user._id) {
      throw new Error("Only the author can edit this message");
    }

    // Validate content is not empty
    if (!content.trim()) {
      throw new Error("Message content cannot be empty");
    }

    await ctx.db.patch(messageId, {
      content: content.trim(),
      isEdited: true,
      updatedAt: Date.now(),
    });

    // Return updated message with author info
    const updatedMessage = await ctx.db.get(messageId);
    return {
      ...updatedMessage,
      author: await getAuthorInfo(ctx, currentUser.user._id),
    };
  },
});

// Delete a message (author or channel admin/owner)
export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, { messageId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const message = await ctx.db.get(messageId);
    if (!message) throw new Error("Message not found");

    const isAuthor = message.authorId === currentUser.user._id;

    // Check if user is channel admin/owner
    const membership = await getMembership(
      ctx,
      message.channelId,
      currentUser.user._id
    );
    if (!membership) throw new Error("Not a member of this channel");

    const isChannelAdmin =
      membership.role === "owner" || membership.role === "admin";

    if (!isAuthor && !isChannelAdmin) {
      throw new Error("Not authorized to delete this message");
    }

    // Delete the message (hard delete)
    await ctx.db.delete(messageId);

    // Also delete any replies to this message
    const replies = await ctx.db
      .query("messages")
      .withIndex("by_parent", (q) => q.eq("parentId", messageId))
      .collect();

    for (const reply of replies) {
      await ctx.db.delete(reply._id);
    }

    return { success: true };
  },
});
