import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("initiatives").order("asc").collect();
  },
});

export const byStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("initiatives")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    status: v.string(),
    phase: v.optional(v.string()),
    nextActions: v.optional(v.string()),
    notes: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("initiatives", {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("initiatives"),
    title: v.optional(v.string()),
    status: v.optional(v.string()),
    phase: v.optional(v.string()),
    nextActions: v.optional(v.string()),
    completedDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    return await ctx.db.patch(id, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

// Delete all initiatives (for re-seeding)
export const deleteAll = mutation({
  handler: async (ctx) => {
    const initiatives = await ctx.db.query("initiatives").collect();
    for (const init of initiatives) {
      await ctx.db.delete(init._id);
    }
    return { deleted: initiatives.length };
  },
});
