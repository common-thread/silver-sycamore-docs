import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Helper to get current user ID from auth
async function getCurrentUserId(ctx: {
  auth: { getUserIdentity: () => Promise<{ email?: string } | null> };
  db: any;
}) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.email) return null;

  const user = await ctx.db
    .query("users")
    .filter((q: any) => q.eq(q.field("email"), identity.email))
    .first();

  return user?._id ?? null;
}

// Generate a secure random token
function generateToken(): string {
  // Use crypto.randomUUID() for secure token generation
  return crypto.randomUUID();
}

// Create a new share link for a document
export const createShareLink = mutation({
  args: {
    documentId: v.id("documents"),
    shareType: v.union(v.literal("internal"), v.literal("external")),
    sharedWithUserIds: v.optional(v.array(v.id("users"))),
    routeResultsTo: v.array(v.id("users")),
    expiresAt: v.optional(v.number()),
    maxUses: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Validate document exists and has dynamic contentType
    const document = await ctx.db.get(args.documentId);
    if (!document) throw new Error("Document not found");

    const dynamicTypes = ["procedure", "checklist", "form"];
    if (!document.contentType || !dynamicTypes.includes(document.contentType)) {
      throw new Error(
        "Only procedures, checklists, and forms can be shared via share links"
      );
    }

    // For internal shares, require sharedWithUserIds
    if (args.shareType === "internal" && (!args.sharedWithUserIds || args.sharedWithUserIds.length === 0)) {
      throw new Error("Internal shares must specify at least one user to share with");
    }

    // Validate routeResultsTo has at least one recipient
    if (args.routeResultsTo.length === 0) {
      throw new Error("Must specify at least one user to route results to");
    }

    // Generate secure token
    const shareToken = generateToken();

    // Create share link record
    const shareId = await ctx.db.insert("shareLinks", {
      documentId: args.documentId,
      shareToken,
      shareType: args.shareType,
      createdBy: userId,
      sharedWithUserIds: args.shareType === "internal" ? args.sharedWithUserIds : undefined,
      routeResultsTo: args.routeResultsTo,
      expiresAt: args.expiresAt,
      maxUses: args.maxUses,
      useCount: 0,
      createdAt: Date.now(),
    });

    return { shareId, token: shareToken };
  },
});

// Get share link metadata by token (public query - does not return document content)
export const getShareLink = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Find share link by token
    const shareLink = await ctx.db
      .query("shareLinks")
      .withIndex("by_token", (q: any) => q.eq("shareToken", args.token))
      .first();

    if (!shareLink) return null;

    // Check expiration
    if (shareLink.expiresAt && shareLink.expiresAt < Date.now()) {
      return { error: "expired", message: "This link has expired" };
    }

    // Check usage limit
    if (shareLink.maxUses && shareLink.useCount >= shareLink.maxUses) {
      return { error: "usage_exceeded", message: "This link has reached its usage limit" };
    }

    // Get document title for display (but not full content)
    const document = await ctx.db.get(shareLink.documentId);
    if (!document) {
      return { error: "not_found", message: "Document not found" };
    }

    // Get creator info
    const creator = await ctx.db.get(shareLink.createdBy);

    return {
      shareType: shareLink.shareType,
      documentTitle: document.title,
      contentType: document.contentType,
      createdBy: creator ? { name: creator.name, email: creator.email } : null,
      createdAt: shareLink.createdAt,
      expiresAt: shareLink.expiresAt,
      maxUses: shareLink.maxUses,
      useCount: shareLink.useCount,
    };
  },
});

// Access document via share link (validates access and returns content)
export const accessViaShareLink = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Find share link by token
    const shareLink = await ctx.db
      .query("shareLinks")
      .withIndex("by_token", (q: any) => q.eq("shareToken", args.token))
      .first();

    if (!shareLink) {
      return { error: "invalid", message: "This link is invalid or has been revoked" };
    }

    // Check expiration
    if (shareLink.expiresAt && shareLink.expiresAt < Date.now()) {
      return { error: "expired", message: "This link has expired" };
    }

    // Check usage limit
    if (shareLink.maxUses && shareLink.useCount >= shareLink.maxUses) {
      return { error: "usage_exceeded", message: "This link has reached its usage limit" };
    }

    // For internal links, verify user is authenticated AND in sharedWithUserIds
    if (shareLink.shareType === "internal") {
      const userId = await getCurrentUserId(ctx);
      if (!userId) {
        return { error: "access_denied", message: "You don't have access to this link. Please log in." };
      }

      if (!shareLink.sharedWithUserIds || !shareLink.sharedWithUserIds.includes(userId)) {
        return { error: "access_denied", message: "You don't have access to this link." };
      }
    }

    // For external links, allow anyone (no auth required)
    // Access is granted - get document content
    const document = await ctx.db.get(shareLink.documentId);
    if (!document) {
      return { error: "not_found", message: "Document not found" };
    }

    // Get creator info for attribution
    const creator = await ctx.db.get(shareLink.createdBy);

    return {
      success: true,
      document: {
        _id: document._id,
        title: document.title,
        content: document.content,
        contentType: document.contentType,
        category: document.category,
      },
      shareLink: {
        _id: shareLink._id,
        shareType: shareLink.shareType,
        routeResultsTo: shareLink.routeResultsTo,
      },
      sharedBy: creator ? { name: creator.name, email: creator.email } : null,
    };
  },
});

// Increment share link usage count (called when someone accesses via share link)
export const incrementShareLinkUsage = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Find share link by token
    const shareLink = await ctx.db
      .query("shareLinks")
      .withIndex("by_token", (q: any) => q.eq("shareToken", args.token))
      .first();

    if (!shareLink) {
      throw new Error("Share link not found");
    }

    // Increment useCount atomically
    await ctx.db.patch(shareLink._id, {
      useCount: shareLink.useCount + 1,
    });

    return { success: true, newUseCount: shareLink.useCount + 1 };
  },
});

// Get all share links for a document (created by current user)
export const getDocumentShareLinks = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    // Get all share links for this document created by current user
    const shareLinks = await ctx.db
      .query("shareLinks")
      .withIndex("by_document", (q: any) => q.eq("documentId", args.documentId))
      .collect();

    // Filter to only links created by current user
    const userShareLinks = shareLinks.filter(
      (link: any) => link.createdBy === userId
    );

    // Enrich with shared user info for internal links
    const enrichedLinks = await Promise.all(
      userShareLinks.map(async (link: any) => {
        let sharedWithUsers = null;
        if (link.shareType === "internal" && link.sharedWithUserIds) {
          sharedWithUsers = await Promise.all(
            link.sharedWithUserIds.map(async (uid: Id<"users">) => {
              const user = await ctx.db.get(uid);
              return user ? { id: uid, name: user.name, email: user.email } : null;
            })
          );
          sharedWithUsers = sharedWithUsers.filter(Boolean);
        }

        // Get route results to users
        const routeToUsers = await Promise.all(
          link.routeResultsTo.map(async (uid: Id<"users">) => {
            const user = await ctx.db.get(uid);
            return user ? { id: uid, name: user.name, email: user.email } : null;
          })
        );

        // Check if expired or usage exceeded
        const isExpired = link.expiresAt && link.expiresAt < Date.now();
        const isUsageExceeded = link.maxUses && link.useCount >= link.maxUses;

        return {
          _id: link._id,
          token: link.shareToken,
          shareType: link.shareType,
          sharedWithUsers,
          routeToUsers: routeToUsers.filter(Boolean),
          expiresAt: link.expiresAt,
          maxUses: link.maxUses,
          useCount: link.useCount,
          createdAt: link.createdAt,
          isActive: !isExpired && !isUsageExceeded,
          isExpired,
          isUsageExceeded,
        };
      })
    );

    return enrichedLinks;
  },
});

// Revoke (delete) a share link (only owner can revoke)
export const revokeShareLink = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Find share link by token
    const shareLink = await ctx.db
      .query("shareLinks")
      .withIndex("by_token", (q: any) => q.eq("shareToken", args.token))
      .first();

    if (!shareLink) {
      throw new Error("Share link not found");
    }

    // Verify ownership
    if (shareLink.createdBy !== userId) {
      throw new Error("Only the link creator can revoke it");
    }

    // Delete the share link
    await ctx.db.delete(shareLink._id);

    return { success: true };
  },
});
