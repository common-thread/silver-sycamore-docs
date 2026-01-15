import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Query to get all documents
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});

// Query to get documents by category
export const byCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Query to get a single document by slug
export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Query to get a single document by ID
export const byId = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Search documents
export const search = query({
  args: { searchQuery: v.string(), category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let searchBuilder = ctx.db
      .query("documents")
      .withSearchIndex("search_content", (q) => {
        let search = q.search("content", args.searchQuery);
        if (args.category) {
          search = search.eq("category", args.category);
        }
        return search;
      });
    return await searchBuilder.collect();
  },
});

// Create a new document
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    category: v.string(),
    subcategory: v.optional(v.string()),
    content: v.string(),
    sourceFile: v.optional(v.string()),
    sourceType: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("documents", {
      ...args,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a document (creates version snapshot)
export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    content: v.optional(v.string()),
    sourceFile: v.optional(v.string()),
    sourceType: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    changeNote: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    const { id, changeNote, ...updates } = args;

    // Get current document state
    const doc = await ctx.db.get(id);
    if (!doc) throw new Error("Document not found");

    // Get current user for edit tracking
    const identity = await ctx.auth.getUserIdentity();
    let editedBy: Id<"users"> | undefined = undefined;
    let editedByName: string | undefined = undefined;

    if (identity) {
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), identity.email))
        .first();
      if (user) {
        editedBy = user._id;
        editedByName = user.name || identity.email || undefined;
      }
    }

    // Create version snapshot of current state before updating
    const newVersion: number = await ctx.runMutation(internal.versions.createVersionSnapshot, {
      documentId: id,
      title: doc.title,
      content: doc.content,
      category: doc.category,
      subcategory: doc.subcategory,
      editedBy,
      editedByName,
      changeNote,
    });

    // Apply updates
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(id, {
      ...filteredUpdates,
      version: newVersion,
      updatedAt: Date.now(),
    });
  },
});

// Get related documents (same category, excluding current)
export const related = query({
  args: {
    documentId: v.id("documents"),
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("documents")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();

    // Filter out current document and limit
    return docs
      .filter((d) => d._id !== args.documentId)
      .slice(0, args.limit ?? 5);
  },
});

// Delete all documents (for re-import)
export const deleteAll = mutation({
  handler: async (ctx) => {
    const docs = await ctx.db.query("documents").collect();
    for (const doc of docs) {
      await ctx.db.delete(doc._id);
    }
    return { deleted: docs.length };
  },
});
