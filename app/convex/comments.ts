import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Helper to get author info for a comment
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

// Get current user from auth context
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

// Get all comments for a wiki document
export const getByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_document", (q) => q.eq("documentId", documentId))
      .collect();

    // Sort by createdAt ascending (oldest first)
    comments.sort((a, b) => a.createdAt - b.createdAt);

    // Add author info to each comment
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => ({
        ...comment,
        author: await getAuthorInfo(ctx, comment.authorId),
      }))
    );

    return commentsWithAuthors;
  },
});

// Get all comments for a personal document
export const getByPersonalDocument = query({
  args: { personalDocumentId: v.id("personalDocuments") },
  handler: async (ctx, { personalDocumentId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_personal_document", (q) =>
        q.eq("personalDocumentId", personalDocumentId)
      )
      .collect();

    // Sort by createdAt ascending (oldest first)
    comments.sort((a, b) => a.createdAt - b.createdAt);

    // Add author info to each comment
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => ({
        ...comment,
        author: await getAuthorInfo(ctx, comment.authorId),
      }))
    );

    return commentsWithAuthors;
  },
});

// Get replies to a specific comment (for lazy-loading threads)
export const getThread = query({
  args: { parentId: v.id("comments") },
  handler: async (ctx, { parentId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const replies = await ctx.db
      .query("comments")
      .withIndex("by_parent", (q) => q.eq("parentId", parentId))
      .collect();

    // Sort by createdAt ascending (oldest first)
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

// Create a new comment
export const add = mutation({
  args: {
    documentId: v.optional(v.id("documents")),
    personalDocumentId: v.optional(v.id("personalDocuments")),
    parentId: v.optional(v.id("comments")),
    content: v.string(),
  },
  handler: async (ctx, { documentId, personalDocumentId, parentId, content }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    // Validate exactly one of documentId or personalDocumentId is provided
    const hasDocument = documentId !== undefined;
    const hasPersonalDocument = personalDocumentId !== undefined;

    if (hasDocument === hasPersonalDocument) {
      throw new Error(
        "Must provide exactly one of documentId or personalDocumentId"
      );
    }

    // Validate content is not empty
    if (!content.trim()) {
      throw new Error("Comment content cannot be empty");
    }

    const now = Date.now();

    const commentId = await ctx.db.insert("comments", {
      documentId,
      personalDocumentId,
      authorId: currentUser.user._id,
      parentId,
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    });

    // Return the new comment with author info
    const newComment = await ctx.db.get(commentId);
    return {
      ...newComment,
      author: await getAuthorInfo(ctx, currentUser.user._id),
    };
  },
});

// Update a comment (only author can edit)
export const update = mutation({
  args: {
    commentId: v.id("comments"),
    content: v.string(),
  },
  handler: async (ctx, { commentId, content }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const comment = await ctx.db.get(commentId);
    if (!comment) throw new Error("Comment not found");

    // Only author can edit
    if (comment.authorId !== currentUser.user._id) {
      throw new Error("Only the author can edit this comment");
    }

    // Validate content is not empty
    if (!content.trim()) {
      throw new Error("Comment content cannot be empty");
    }

    await ctx.db.patch(commentId, {
      content: content.trim(),
      updatedAt: Date.now(),
    });

    // Return updated comment with author info
    const updatedComment = await ctx.db.get(commentId);
    return {
      ...updatedComment,
      author: await getAuthorInfo(ctx, currentUser.user._id),
    };
  },
});

// Delete a comment (author OR admin/manager can delete)
// Also deletes all child replies (cascade)
export const remove = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, { commentId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const comment = await ctx.db.get(commentId);
    if (!comment) throw new Error("Comment not found");

    const isAuthor = comment.authorId === currentUser.user._id;
    const isPrivileged =
      currentUser.profile?.role === "admin" ||
      currentUser.profile?.role === "manager";

    if (!isAuthor && !isPrivileged) {
      throw new Error("Not authorized to delete this comment");
    }

    // Recursively delete all child replies
    const deleteReplies = async (parentId: Id<"comments">) => {
      const replies = await ctx.db
        .query("comments")
        .withIndex("by_parent", (q) => q.eq("parentId", parentId))
        .collect();

      for (const reply of replies) {
        // Delete nested replies first
        await deleteReplies(reply._id);
        await ctx.db.delete(reply._id);
      }
    };

    // Delete all replies to this comment
    await deleteReplies(commentId);

    // Delete the comment itself
    await ctx.db.delete(commentId);

    return { success: true };
  },
});
