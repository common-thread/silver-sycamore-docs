import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Helper to get current user ID from auth
async function getCurrentUserId(ctx: { auth: { getUserIdentity: () => Promise<{ email?: string } | null> }; db: any }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.email) return null;

  const user = await ctx.db
    .query("users")
    .filter((q: any) => q.eq(q.field("email"), identity.email))
    .first();

  return user?._id ?? null;
}

// Helper to check share access for a folder
async function hasShareAccess(
  ctx: any,
  folderId: Id<"personalFolders">,
  userId: Id<"users">
): Promise<{ hasAccess: boolean; permission: string | null }> {
  // Direct share
  const directShare = await ctx.db
    .query("folderShares")
    .withIndex("by_folder_user", (q: any) =>
      q.eq("folderId", folderId).eq("sharedWithUserId", userId)
    )
    .first();

  if (directShare) {
    return { hasAccess: true, permission: directShare.permission };
  }

  // Group shares
  const userGroups = await ctx.db
    .query("groupMembers")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .collect();

  for (const membership of userGroups) {
    const groupShare = await ctx.db
      .query("folderShares")
      .withIndex("by_folder_group", (q: any) =>
        q.eq("folderId", folderId).eq("sharedWithGroupId", membership.groupId)
      )
      .first();
    if (groupShare) {
      return { hasAccess: true, permission: groupShare.permission };
    }
  }

  return { hasAccess: false, permission: null };
}

// List user's personal documents (optionally filtered by folder)
// Supports both owned folders and shared folders
export const list = query({
  args: {
    folderId: v.optional(v.id("personalFolders")),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    if (args.folderId) {
      // Get the folder to check ownership/access
      const folder = await ctx.db.get(args.folderId);
      if (!folder) return [];

      // If user owns the folder, return their docs
      if (folder.ownerId === userId) {
        return await ctx.db
          .query("personalDocuments")
          .withIndex("by_owner_folder", (q: any) =>
            q.eq("ownerId", userId).eq("folderId", args.folderId)
          )
          .collect();
      }

      // Check for share access
      const shareAccess = await hasShareAccess(ctx, args.folderId, userId);
      if (shareAccess.hasAccess) {
        // User has share access - return folder owner's docs in this folder
        // with permission level attached
        const docs = await ctx.db
          .query("personalDocuments")
          .withIndex("by_owner_folder", (q: any) =>
            q.eq("ownerId", folder.ownerId).eq("folderId", args.folderId)
          )
          .collect();

        // Attach permission level to each document
        return docs.map((doc: any) => ({
          ...doc,
          _permission: shareAccess.permission,
        }));
      }

      return []; // No access to folder
    }

    // Root level documents (no folder) - only user's own docs
    return await ctx.db
      .query("personalDocuments")
      .withIndex("by_owner", (q: any) => q.eq("ownerId", userId))
      .filter((q: any) => q.eq(q.field("folderId"), undefined))
      .collect();
  },
});

// Get all documents for user (for sidebar counts, etc.)
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("personalDocuments")
      .withIndex("by_owner", (q: any) => q.eq("ownerId", userId))
      .collect();
  },
});

// Get single personal document by ID (owner or shared access via folder)
export const get = query({
  args: { id: v.id("personalDocuments") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return null;

    const doc = await ctx.db.get(args.id);
    if (!doc) return null;

    // Owner has full access
    if (doc.ownerId === userId) return doc;

    // Check for share access to the folder containing this document
    if (doc.folderId) {
      const shareAccess = await hasShareAccess(ctx, doc.folderId, userId);
      if (shareAccess.hasAccess) {
        return { ...doc, _permission: shareAccess.permission };
      }
    }

    return null; // No access
  },
});

// Create new personal document
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    folderId: v.optional(v.id("personalFolders")),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify folder ownership if provided
    if (args.folderId) {
      const folder = await ctx.db.get(args.folderId);
      if (!folder || folder.ownerId !== userId) {
        throw new Error("Folder not found or access denied");
      }
    }

    const now = Date.now();
    return await ctx.db.insert("personalDocuments", {
      ownerId: userId,
      title: args.title,
      content: args.content,
      folderId: args.folderId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update personal document
export const update = mutation({
  args: {
    id: v.id("personalDocuments"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const doc = await ctx.db.get(args.id);
    if (!doc || doc.ownerId !== userId) {
      throw new Error("Document not found or access denied");
    }

    await ctx.db.patch(args.id, {
      ...(args.title !== undefined && { title: args.title }),
      ...(args.content !== undefined && { content: args.content }),
      updatedAt: Date.now(),
    });
  },
});

// Delete personal document
export const remove = mutation({
  args: { id: v.id("personalDocuments") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const doc = await ctx.db.get(args.id);
    if (!doc || doc.ownerId !== userId) {
      throw new Error("Document not found or access denied");
    }

    await ctx.db.delete(args.id);
  },
});

// Move document to different folder
export const moveToFolder = mutation({
  args: {
    id: v.id("personalDocuments"),
    folderId: v.optional(v.id("personalFolders")), // null = root
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const doc = await ctx.db.get(args.id);
    if (!doc || doc.ownerId !== userId) {
      throw new Error("Document not found or access denied");
    }

    // Verify folder ownership if provided
    if (args.folderId) {
      const folder = await ctx.db.get(args.folderId);
      if (!folder || folder.ownerId !== userId) {
        throw new Error("Folder not found or access denied");
      }
    }

    await ctx.db.patch(args.id, {
      folderId: args.folderId,
      updatedAt: Date.now(),
    });
  },
});

// Copy wiki document to personal workspace
export const copyFromWiki = mutation({
  args: {
    documentId: v.id("documents"),
    folderId: v.optional(v.id("personalFolders")),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get source document
    const sourceDoc = await ctx.db.get(args.documentId);
    if (!sourceDoc) throw new Error("Source document not found");

    // Verify folder ownership if provided
    if (args.folderId) {
      const folder = await ctx.db.get(args.folderId);
      if (!folder || folder.ownerId !== userId) {
        throw new Error("Folder not found or access denied");
      }
    }

    const now = Date.now();
    return await ctx.db.insert("personalDocuments", {
      ownerId: userId,
      title: sourceDoc.title,
      content: sourceDoc.content,
      folderId: args.folderId,
      sourceDocumentId: args.documentId,
      createdAt: now,
      updatedAt: now,
    });
  },
});
