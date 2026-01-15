import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Helper: Get current user and profile
async function getCurrentUserWithProfile(ctx: any) {
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

  return { user, profile, identity };
}

// Helper: Check if user is manager or admin
function isManagerOrAdmin(profile: any): boolean {
  return profile && ["admin", "manager"].includes(profile.role);
}

// Helper: Enrich suggestion with author info
async function enrichWithAuthor(ctx: any, suggestion: any) {
  const author = await ctx.db.get(suggestion.authorId);
  const authorProfile = author
    ? await ctx.db
        .query("userProfiles")
        .withIndex("by_userId", (q: any) => q.eq("userId", author._id))
        .first()
    : null;

  let reviewer: any = null;
  let reviewerProfile: any = null;
  if (suggestion.reviewedBy) {
    reviewer = await ctx.db.get(suggestion.reviewedBy);
    if (reviewer) {
      reviewerProfile = await ctx.db
        .query("userProfiles")
        .withIndex("by_userId", (q: any) => q.eq("userId", reviewer._id))
        .first();
    }
  }

  return {
    ...suggestion,
    author: author
      ? {
          _id: author._id,
          name: author.name,
          email: author.email,
        }
      : null,
    authorDisplayName: authorProfile?.displayName || author?.name || "Unknown",
    reviewer: reviewer
      ? {
          _id: reviewer._id,
          name: reviewer.name,
          email: reviewer.email,
        }
      : null,
    reviewerDisplayName: reviewerProfile?.displayName || reviewer?.name || null,
  };
}

// ============ QUERIES ============

// Get all suggestions for a document (newest first)
export const listByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const suggestions = await ctx.db
      .query("suggestions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();

    // Sort by createdAt descending (newest first)
    const sorted = suggestions.sort((a, b) => b.createdAt - a.createdAt);

    // Enrich with author info
    return Promise.all(sorted.map((s) => enrichWithAuthor(ctx, s)));
  },
});

// Get user's suggestions across all docs (newest first)
export const listByAuthor = query({
  args: { authorId: v.id("users") },
  handler: async (ctx, args) => {
    const suggestions = await ctx.db
      .query("suggestions")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .collect();

    // Sort by createdAt descending (newest first)
    const sorted = suggestions.sort((a, b) => b.createdAt - a.createdAt);

    // Enrich with document info
    return Promise.all(
      sorted.map(async (s) => {
        const doc = await ctx.db.get(s.documentId);
        return {
          ...s,
          documentTitle: doc?.title || "Unknown Document",
          documentSlug: doc?.slug || null,
        };
      })
    );
  },
});

// Get all pending suggestions (for reviewers), enriched with author info
export const listPending = query({
  handler: async (ctx) => {
    const suggestions = await ctx.db
      .query("suggestions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    // Sort by createdAt descending (newest first)
    const sorted = suggestions.sort((a, b) => b.createdAt - a.createdAt);

    // Enrich with author and document info
    return Promise.all(
      sorted.map(async (s) => {
        const enriched = await enrichWithAuthor(ctx, s);
        const doc = await ctx.db.get(s.documentId);
        return {
          ...enriched,
          documentTitle: doc?.title || "Unknown Document",
          documentSlug: doc?.slug || null,
        };
      })
    );
  },
});

// Get single suggestion with author/reviewer info
export const getById = query({
  args: { id: v.id("suggestions") },
  handler: async (ctx, args) => {
    const suggestion = await ctx.db.get(args.id);
    if (!suggestion) return null;

    const enriched = await enrichWithAuthor(ctx, suggestion);
    const doc = await ctx.db.get(suggestion.documentId);

    return {
      ...enriched,
      documentTitle: doc?.title || "Unknown Document",
      documentSlug: doc?.slug || null,
      documentContent: doc?.content || null, // For comparison
    };
  },
});

// ============ MUTATIONS ============

// Create a new suggestion (starts as draft)
export const create = mutation({
  args: {
    documentId: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    changeNote: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"suggestions">> => {
    const userInfo = await getCurrentUserWithProfile(ctx);
    if (!userInfo) throw new Error("Not authenticated");

    // Get the document to copy current content as starting point
    const doc = await ctx.db.get(args.documentId);
    if (!doc) throw new Error("Document not found");

    const now = Date.now();

    return await ctx.db.insert("suggestions", {
      documentId: args.documentId,
      authorId: userInfo.user._id,
      status: "draft",
      title: args.title ?? doc.title,
      content: args.content ?? doc.content,
      changeNote: args.changeNote,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a draft suggestion (only author, only drafts)
export const update = mutation({
  args: {
    id: v.id("suggestions"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    changeNote: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    const userInfo = await getCurrentUserWithProfile(ctx);
    if (!userInfo) throw new Error("Not authenticated");

    const suggestion = await ctx.db.get(args.id);
    if (!suggestion) throw new Error("Suggestion not found");

    // Only author can update
    if (suggestion.authorId !== userInfo.user._id) {
      throw new Error("Permission denied: only the author can update this suggestion");
    }

    // Only drafts can be updated
    if (suggestion.status !== "draft") {
      throw new Error("Cannot update: suggestion is no longer a draft");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.title !== undefined) updates.title = args.title;
    if (args.content !== undefined) updates.content = args.content;
    if (args.changeNote !== undefined) updates.changeNote = args.changeNote;

    await ctx.db.patch(args.id, updates);
  },
});

// Submit a draft for review (draft → pending)
export const submit = mutation({
  args: { id: v.id("suggestions") },
  handler: async (ctx, args): Promise<void> => {
    const userInfo = await getCurrentUserWithProfile(ctx);
    if (!userInfo) throw new Error("Not authenticated");

    const suggestion = await ctx.db.get(args.id);
    if (!suggestion) throw new Error("Suggestion not found");

    // Only author can submit
    if (suggestion.authorId !== userInfo.user._id) {
      throw new Error("Permission denied: only the author can submit this suggestion");
    }

    // Only drafts can be submitted
    if (suggestion.status !== "draft") {
      throw new Error("Cannot submit: suggestion is not a draft");
    }

    await ctx.db.patch(args.id, {
      status: "pending",
      updatedAt: Date.now(),
    });
  },
});

// Approve a pending suggestion (pending → approved, manager/admin only)
export const approve = mutation({
  args: {
    id: v.id("suggestions"),
    reviewNote: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    const userInfo = await getCurrentUserWithProfile(ctx);
    if (!userInfo) throw new Error("Not authenticated");

    if (!isManagerOrAdmin(userInfo.profile)) {
      throw new Error("Permission denied: only managers and admins can approve suggestions");
    }

    const suggestion = await ctx.db.get(args.id);
    if (!suggestion) throw new Error("Suggestion not found");

    if (suggestion.status !== "pending") {
      throw new Error("Cannot approve: suggestion is not pending");
    }

    await ctx.db.patch(args.id, {
      status: "approved",
      reviewedBy: userInfo.user._id,
      reviewNote: args.reviewNote,
      updatedAt: Date.now(),
    });
  },
});

// Reject a pending suggestion (pending → rejected, manager/admin only)
export const reject = mutation({
  args: {
    id: v.id("suggestions"),
    reviewNote: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    const userInfo = await getCurrentUserWithProfile(ctx);
    if (!userInfo) throw new Error("Not authenticated");

    if (!isManagerOrAdmin(userInfo.profile)) {
      throw new Error("Permission denied: only managers and admins can reject suggestions");
    }

    const suggestion = await ctx.db.get(args.id);
    if (!suggestion) throw new Error("Suggestion not found");

    if (suggestion.status !== "pending") {
      throw new Error("Cannot reject: suggestion is not pending");
    }

    await ctx.db.patch(args.id, {
      status: "rejected",
      reviewedBy: userInfo.user._id,
      reviewNote: args.reviewNote,
      updatedAt: Date.now(),
    });
  },
});

// Delete a draft suggestion (only author, only drafts)
export const deleteSuggestion = mutation({
  args: { id: v.id("suggestions") },
  handler: async (ctx, args): Promise<void> => {
    const userInfo = await getCurrentUserWithProfile(ctx);
    if (!userInfo) throw new Error("Not authenticated");

    const suggestion = await ctx.db.get(args.id);
    if (!suggestion) throw new Error("Suggestion not found");

    // Only author can delete
    if (suggestion.authorId !== userInfo.user._id) {
      throw new Error("Permission denied: only the author can delete this suggestion");
    }

    // Only drafts can be deleted
    if (suggestion.status !== "draft") {
      throw new Error("Cannot delete: only draft suggestions can be deleted");
    }

    await ctx.db.delete(args.id);
  },
});

// Promote an approved suggestion to update the official document (manager/admin only)
export const promote = mutation({
  args: { id: v.id("suggestions") },
  handler: async (ctx, args): Promise<{ success: boolean; documentId: Id<"documents"> }> => {
    const userInfo = await getCurrentUserWithProfile(ctx);
    if (!userInfo) throw new Error("Not authenticated");

    if (!isManagerOrAdmin(userInfo.profile)) {
      throw new Error("Permission denied: only managers and admins can promote suggestions");
    }

    const suggestion = await ctx.db.get(args.id);
    if (!suggestion) throw new Error("Suggestion not found");

    if (suggestion.status !== "approved") {
      throw new Error("Cannot promote: suggestion must be approved first");
    }

    if (suggestion.appliedAt) {
      throw new Error("Cannot promote: changes have already been applied");
    }

    // Get the author's name for the change note
    const author = await ctx.db.get(suggestion.authorId);
    const authorProfile = author
      ? await ctx.db
          .query("userProfiles")
          .withIndex("by_userId", (q: any) => q.eq("userId", author._id))
          .first()
      : null;
    const authorName = authorProfile?.displayName || author?.name || "Unknown";

    // Get current document state for versioning
    const doc = await ctx.db.get(suggestion.documentId);
    if (!doc) throw new Error("Document not found");

    // Create version snapshot of current state before updating
    const versions = await ctx.db
      .query("documentVersions")
      .withIndex("by_document", (q: any) => q.eq("documentId", suggestion.documentId))
      .collect();
    const nextVersion = versions.length === 0 ? 1 : Math.max(...versions.map((v: any) => v.version)) + 1;

    await ctx.db.insert("documentVersions", {
      documentId: suggestion.documentId,
      version: nextVersion,
      title: doc.title,
      content: doc.content,
      category: doc.category,
      subcategory: doc.subcategory,
      editedBy: userInfo.user._id,
      editedByName: userInfo.user.name || userInfo.identity.email || undefined,
      changeNote: `Applied suggestion from ${authorName}: ${suggestion.changeNote}`,
      createdAt: Date.now(),
    });

    // Update the document with suggestion content
    await ctx.db.patch(suggestion.documentId, {
      title: suggestion.title,
      content: suggestion.content,
      version: nextVersion,
      updatedAt: Date.now(),
    });

    // Mark suggestion as applied
    await ctx.db.patch(args.id, {
      appliedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true, documentId: suggestion.documentId };
  },
});
