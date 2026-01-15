import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id, Doc } from "./_generated/dataModel";

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

// List user's folders (optionally filtered by parent)
export const list = query({
  args: {
    parentId: v.optional(v.id("personalFolders")),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    if (args.parentId) {
      return await ctx.db
        .query("personalFolders")
        .withIndex("by_owner_parent", (q: any) =>
          q.eq("ownerId", userId).eq("parentId", args.parentId)
        )
        .collect();
    }

    // Root level folders (no parent)
    return await ctx.db
      .query("personalFolders")
      .withIndex("by_owner", (q: any) => q.eq("ownerId", userId))
      .filter((q: any) => q.eq(q.field("parentId"), undefined))
      .collect();
  },
});

// Get all folders for user (for folder tree)
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("personalFolders")
      .withIndex("by_owner", (q: any) => q.eq("ownerId", userId))
      .collect();
  },
});

// Get single folder by ID
export const get = query({
  args: { id: v.id("personalFolders") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return null;

    const folder = await ctx.db.get(args.id);
    if (!folder || folder.ownerId !== userId) return null;

    return folder;
  },
});

// Create new folder
export const create = mutation({
  args: {
    name: v.string(),
    parentId: v.optional(v.id("personalFolders")),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify parent folder ownership if provided
    if (args.parentId) {
      const parentFolder = await ctx.db.get(args.parentId);
      if (!parentFolder || parentFolder.ownerId !== userId) {
        throw new Error("Parent folder not found or access denied");
      }
    }

    return await ctx.db.insert("personalFolders", {
      ownerId: userId,
      name: args.name,
      parentId: args.parentId,
      createdAt: Date.now(),
    });
  },
});

// Rename folder
export const rename = mutation({
  args: {
    id: v.id("personalFolders"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const folder = await ctx.db.get(args.id);
    if (!folder || folder.ownerId !== userId) {
      throw new Error("Folder not found or access denied");
    }

    await ctx.db.patch(args.id, { name: args.name });
  },
});

// Delete folder (must be empty)
export const remove = mutation({
  args: { id: v.id("personalFolders") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const folder = await ctx.db.get(args.id);
    if (!folder || folder.ownerId !== userId) {
      throw new Error("Folder not found or access denied");
    }

    // Check for child folders
    const childFolders = await ctx.db
      .query("personalFolders")
      .withIndex("by_owner_parent", (q: any) =>
        q.eq("ownerId", userId).eq("parentId", args.id)
      )
      .first();

    if (childFolders) {
      throw new Error("Cannot delete folder: contains subfolders");
    }

    // Check for documents in folder
    const docsInFolder = await ctx.db
      .query("personalDocuments")
      .withIndex("by_owner_folder", (q: any) =>
        q.eq("ownerId", userId).eq("folderId", args.id)
      )
      .first();

    if (docsInFolder) {
      throw new Error("Cannot delete folder: contains documents");
    }

    await ctx.db.delete(args.id);
  },
});

// Move folder to different parent
export const move = mutation({
  args: {
    id: v.id("personalFolders"),
    parentId: v.optional(v.id("personalFolders")), // null = root
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const folder = await ctx.db.get(args.id);
    if (!folder || folder.ownerId !== userId) {
      throw new Error("Folder not found or access denied");
    }

    // Prevent moving folder into itself or descendants
    if (args.parentId) {
      if (args.parentId === args.id) {
        throw new Error("Cannot move folder into itself");
      }

      const parentFolder = await ctx.db.get(args.parentId);
      if (!parentFolder || parentFolder.ownerId !== userId) {
        throw new Error("Parent folder not found or access denied");
      }

      // Check if target is a descendant of the folder being moved
      let currentParent: Id<"personalFolders"> | undefined = parentFolder.parentId;
      while (currentParent) {
        if (currentParent === args.id) {
          throw new Error("Cannot move folder into its own descendant");
        }
        const ancestor = await ctx.db.get(currentParent) as Doc<"personalFolders"> | null;
        currentParent = ancestor?.parentId;
      }
    }

    await ctx.db.patch(args.id, { parentId: args.parentId });
  },
});

// Get folder path (for breadcrumbs)
export const getPath = query({
  args: { id: v.id("personalFolders") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    const path: Array<{ _id: string; name: string }> = [];
    let currentId: Id<"personalFolders"> | undefined = args.id;

    while (currentId) {
      const folder = await ctx.db.get(currentId) as Doc<"personalFolders"> | null;
      if (!folder || folder.ownerId !== userId) break;

      path.unshift({ _id: folder._id, name: folder.name });
      currentId = folder.parentId;
    }

    return path;
  },
});
