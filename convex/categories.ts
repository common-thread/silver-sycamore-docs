import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get all categories ordered
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").withIndex("by_order").collect();
  },
});

// Query to get a category by slug
export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Create a new category
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    order: v.number(),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", args);
  },
});

// Update a category
export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    return await ctx.db.patch(id, filteredUpdates);
  },
});
