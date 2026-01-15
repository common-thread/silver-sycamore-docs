import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Get all versions for a document (newest first)
export const listByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const versions = await ctx.db
      .query("documentVersions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();

    // Sort by version descending (newest first)
    return versions.sort((a, b) => b.version - a.version);
  },
});

// Get specific version by document and version number
export const getVersion = query({
  args: {
    documentId: v.id("documents"),
    version: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documentVersions")
      .withIndex("by_document_version", (q) =>
        q.eq("documentId", args.documentId).eq("version", args.version)
      )
      .first();
  },
});

// Get the latest version number for a document
export const getLatestVersionNumber = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const versions = await ctx.db
      .query("documentVersions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();

    if (versions.length === 0) return 0;
    return Math.max(...versions.map((v) => v.version));
  },
});

// Internal mutation to create a version snapshot
export const createVersionSnapshot = internalMutation({
  args: {
    documentId: v.id("documents"),
    title: v.string(),
    content: v.string(),
    category: v.string(),
    subcategory: v.optional(v.string()),
    editedBy: v.optional(v.id("users")),
    editedByName: v.optional(v.string()),
    changeNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get current version number
    const versions = await ctx.db
      .query("documentVersions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();

    const nextVersion = versions.length === 0 ? 1 : Math.max(...versions.map((v) => v.version)) + 1;

    // Create version snapshot
    await ctx.db.insert("documentVersions", {
      documentId: args.documentId,
      version: nextVersion,
      title: args.title,
      content: args.content,
      category: args.category,
      subcategory: args.subcategory,
      editedBy: args.editedBy,
      editedByName: args.editedByName,
      changeNote: args.changeNote,
      createdAt: Date.now(),
    });

    return nextVersion;
  },
});

// Get version count for a document
export const getVersionCount = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const versions = await ctx.db
      .query("documentVersions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
    return versions.length;
  },
});

// Restore a document to a previous version (manager/admin only)
export const restoreVersion = mutation({
  args: {
    documentId: v.id("documents"),
    version: v.number(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; newVersion: number }> => {
    // Check authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get user and check permissions
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();
    if (!user) throw new Error("User not found");

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!profile || !["admin", "manager"].includes(profile.role)) {
      throw new Error("Permission denied: only managers and admins can restore versions");
    }

    // Get current document
    const doc = await ctx.db.get(args.documentId);
    if (!doc) throw new Error("Document not found");

    // Get the version to restore
    const versionToRestore = await ctx.db
      .query("documentVersions")
      .withIndex("by_document_version", (q) =>
        q.eq("documentId", args.documentId).eq("version", args.version)
      )
      .first();
    if (!versionToRestore) throw new Error("Version not found");

    // Create snapshot of current state before restoring
    const versions = await ctx.db
      .query("documentVersions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
    const nextVersion = versions.length === 0 ? 1 : Math.max(...versions.map((v) => v.version)) + 1;

    await ctx.db.insert("documentVersions", {
      documentId: args.documentId,
      version: nextVersion,
      title: doc.title,
      content: doc.content,
      category: doc.category,
      subcategory: doc.subcategory,
      editedBy: user._id,
      editedByName: user.name || identity.email || undefined,
      changeNote: `Restored from v${args.version}`,
      createdAt: Date.now(),
    });

    // Restore document to old version's content
    await ctx.db.patch(args.documentId, {
      title: versionToRestore.title,
      content: versionToRestore.content,
      category: versionToRestore.category,
      subcategory: versionToRestore.subcategory,
      version: nextVersion,
      updatedAt: Date.now(),
    });

    return { success: true, newVersion: nextVersion };
  },
});
