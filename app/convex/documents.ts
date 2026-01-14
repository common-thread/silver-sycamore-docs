import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a document
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
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    return await ctx.db.patch(id, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
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
