import { query, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// ============================================
// TYPES
// ============================================

/**
 * Activity types for the activity log
 */
export type ActivityType =
  | "procedure_started"
  | "procedure_completed"
  | "checklist_completed"
  | "form_submitted"
  | "form_received";

// ============================================
// AUTH HELPER
// ============================================

// Helper to get current user ID from auth (follows established pattern from forms.ts)
// In development, falls back to first available user if auth fails
async function getCurrentUser(ctx: { auth: any; db: any }) {
  const identity = await ctx.auth.getUserIdentity();

  if (identity) {
    const user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), identity.email))
      .first();

    if (user) {
      return user;
    }
  }

  // Development fallback: use first available user if no auth
  const devUser = await ctx.db.query("users").first();
  return devUser || null;
}

// ============================================
// INTERNAL HELPER FOR LOGGING ACTIVITY
// ============================================

/**
 * Log activity to the activityLog table.
 * This is an internal helper called from other modules (dynamicContent, forms).
 * Not exposed to client directly.
 */
export async function logActivityInternal(
  ctx: MutationCtx,
  activity: {
    userId: Id<"users">;
    type: ActivityType;
    instanceId?: Id<"dynamicContentInstances">;
    documentId?: Id<"documents">;
    formSubmissionId?: Id<"formSubmissions">;
    title: string;
    fromUserId?: Id<"users">;
  }
) {
  await ctx.db.insert("activityLog", {
    userId: activity.userId,
    type: activity.type,
    instanceId: activity.instanceId,
    documentId: activity.documentId,
    formSubmissionId: activity.formSubmissionId,
    title: activity.title,
    fromUserId: activity.fromUserId,
    createdAt: Date.now(),
  });
}

// ============================================
// QUERIES
// ============================================

/**
 * Get recent activity for the current user.
 * Used by ActivitySidebar for compact view.
 * Real-time: Convex auto-updates when activity changes.
 */
export const getRecentActivity = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return [];

    const limit = args.limit ?? 10;

    // Query activity log ordered by createdAt desc
    const activity = await ctx.db
      .query("activityLog")
      .withIndex("by_user_recent", (q) => q.eq("userId", currentUser._id))
      .order("desc")
      .take(limit);

    return activity;
  },
});

/**
 * Get activity dashboard data with filtering and pagination.
 * Used by ActivityDashboard for full view.
 */
export const getActivityDashboard = query({
  args: {
    type: v.optional(
      v.union(
        v.literal("procedure_started"),
        v.literal("procedure_completed"),
        v.literal("checklist_completed"),
        v.literal("form_submitted"),
        v.literal("form_received")
      )
    ),
    dateFrom: v.optional(v.number()),
    dateTo: v.optional(v.number()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return { items: [], nextCursor: null };

    const limit = args.limit ?? 20;

    // Query activity for user ordered by createdAt desc
    let activityQuery = ctx.db
      .query("activityLog")
      .withIndex("by_user_recent", (q) => q.eq("userId", currentUser._id))
      .order("desc");

    // Collect all activity for filtering
    const allActivity = await activityQuery.collect();

    // Apply filters
    let filtered = allActivity;

    // Filter by type
    if (args.type) {
      filtered = filtered.filter((a) => a.type === args.type);
    }

    // Filter by date range
    if (args.dateFrom) {
      filtered = filtered.filter((a) => a.createdAt >= args.dateFrom!);
    }
    if (args.dateTo) {
      filtered = filtered.filter((a) => a.createdAt <= args.dateTo!);
    }

    // Handle cursor-based pagination
    let startIndex = 0;
    if (args.cursor) {
      const cursorIndex = filtered.findIndex((a) => a._id === args.cursor);
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1;
      }
    }

    // Get paginated results
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Determine next cursor
    const hasMore = startIndex + limit < filtered.length;
    const nextCursor = hasMore ? paginated[paginated.length - 1]?._id : null;

    return {
      items: paginated,
      nextCursor,
    };
  },
});

/**
 * Get activity counts by type for the current user.
 * Useful for dashboard summary.
 */
export const getActivityCounts = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) {
      return {
        procedure_started: 0,
        procedure_completed: 0,
        checklist_completed: 0,
        form_submitted: 0,
        form_received: 0,
        total: 0,
      };
    }

    const activity = await ctx.db
      .query("activityLog")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .collect();

    const counts: Record<string, number> = {
      procedure_started: 0,
      procedure_completed: 0,
      checklist_completed: 0,
      form_submitted: 0,
      form_received: 0,
    };

    for (const item of activity) {
      if (counts[item.type] !== undefined) {
        counts[item.type]++;
      }
    }

    return {
      ...counts,
      total: activity.length,
    };
  },
});
