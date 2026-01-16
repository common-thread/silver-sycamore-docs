import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Helper to get current user ID from auth (follows established pattern from channels.ts)
async function getCurrentUser(ctx: { auth: any; db: any }) {
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

  return { user, profile };
}

// ============================================
// QUERIES
// ============================================

// List forms owned by current user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return [];

    return await ctx.db
      .query("formSchemas")
      .withIndex("by_owner", (q) => q.eq("ownerId", currentUser.user._id))
      .collect();
  },
});

// List all published forms (for staff to browse)
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return [];

    // Get all published forms
    const forms = await ctx.db.query("formSchemas").collect();
    return forms.filter((form) => form.isPublished);
  },
});

// Get single form by ID (owner or published)
export const get = query({
  args: { id: v.id("formSchemas") },
  handler: async (ctx, { id }) => {
    const form = await ctx.db.get(id);
    if (!form) return null;

    const currentUser = await getCurrentUser(ctx);

    // Owner can always access
    if (currentUser && form.ownerId === currentUser.user._id) {
      return form;
    }

    // Others can only access published forms
    if (form.isPublished) {
      return form;
    }

    return null;
  },
});

// Get form by string formId (for public access)
export const getByFormId = query({
  args: { formId: v.string() },
  handler: async (ctx, { formId }) => {
    const form = await ctx.db
      .query("formSchemas")
      .withIndex("by_formId", (q) => q.eq("formId", formId))
      .first();

    if (!form) return null;

    const currentUser = await getCurrentUser(ctx);

    // Owner can always access
    if (currentUser && form.ownerId === currentUser.user._id) {
      return form;
    }

    // Others can only access published forms
    if (form.isPublished) {
      return form;
    }

    return null;
  },
});

// Get submissions for a form (owner only)
export const getSubmissions = query({
  args: { formSchemaId: v.id("formSchemas") },
  handler: async (ctx, { formSchemaId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return [];

    // Verify ownership
    const form = await ctx.db.get(formSchemaId);
    if (!form || form.ownerId !== currentUser.user._id) return [];

    return await ctx.db
      .query("formSubmissions")
      .withIndex("by_schema", (q) => q.eq("formSchemaId", formSchemaId))
      .collect();
  },
});

// Get single submission by ID
export const getSubmission = query({
  args: { id: v.id("formSubmissions") },
  handler: async (ctx, { id }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return null;

    const submission = await ctx.db.get(id);
    if (!submission) return null;

    // Check if user owns the form
    const form = await ctx.db.get(submission.formSchemaId);
    if (!form || form.ownerId !== currentUser.user._id) {
      // Check if user is in routeToUserIds
      if (
        submission.routeToUserIds &&
        submission.routeToUserIds.includes(currentUser.user._id)
      ) {
        return submission;
      }
      // Check if user sent the form
      if (submission.sentById === currentUser.user._id) {
        return submission;
      }
      return null;
    }

    return submission;
  },
});

// Get submissions routed to current user
export const getMyReceivedSubmissions = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return [];

    // Get all submissions and filter by routeToUserIds
    // Note: In production, consider adding an index for this pattern
    const allSubmissions = await ctx.db.query("formSubmissions").collect();

    return allSubmissions.filter(
      (sub) =>
        sub.routeToUserIds &&
        sub.routeToUserIds.includes(currentUser.user._id)
    );
  },
});

// ============================================
// MUTATIONS
// ============================================

// Create new form (requires auth, sets ownerId)
export const create = mutation({
  args: {
    formId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    fields: v.string(), // JSON string of field definitions
    originalFile: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const now = Date.now();

    const id = await ctx.db.insert("formSchemas", {
      formId: args.formId,
      title: args.title,
      description: args.description,
      category: args.category,
      fields: args.fields,
      originalFile: args.originalFile,
      status: "draft",
      ownerId: currentUser.user._id,
      isPublished: false,
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(id);
  },
});

// Update form (owner only)
export const update = mutation({
  args: {
    id: v.id("formSchemas"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    fields: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const form = await ctx.db.get(args.id);
    if (!form) throw new Error("Form not found");
    if (form.ownerId !== currentUser.user._id) {
      throw new Error("Not authorized to update this form");
    }

    const updates: Record<string, any> = { updatedAt: Date.now() };
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.category !== undefined) updates.category = args.category;
    if (args.fields !== undefined) updates.fields = args.fields;
    if (args.status !== undefined) updates.status = args.status;

    await ctx.db.patch(args.id, updates);
    return await ctx.db.get(args.id);
  },
});

// Publish form (owner only)
export const publish = mutation({
  args: { id: v.id("formSchemas") },
  handler: async (ctx, { id }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const form = await ctx.db.get(id);
    if (!form) throw new Error("Form not found");
    if (form.ownerId !== currentUser.user._id) {
      throw new Error("Not authorized to publish this form");
    }

    await ctx.db.patch(id, {
      isPublished: true,
      status: "active",
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

// Unpublish form (owner only)
export const unpublish = mutation({
  args: { id: v.id("formSchemas") },
  handler: async (ctx, { id }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const form = await ctx.db.get(id);
    if (!form) throw new Error("Form not found");
    if (form.ownerId !== currentUser.user._id) {
      throw new Error("Not authorized to unpublish this form");
    }

    await ctx.db.patch(id, {
      isPublished: false,
      status: "draft",
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

// Delete form (owner only, hard delete)
export const remove = mutation({
  args: { id: v.id("formSchemas") },
  handler: async (ctx, { id }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const form = await ctx.db.get(id);
    if (!form) throw new Error("Form not found");
    if (form.ownerId !== currentUser.user._id) {
      throw new Error("Not authorized to delete this form");
    }

    // Delete all submissions for this form
    const submissions = await ctx.db
      .query("formSubmissions")
      .withIndex("by_schema", (q) => q.eq("formSchemaId", id))
      .collect();

    for (const submission of submissions) {
      await ctx.db.delete(submission._id);
    }

    // Delete the form
    await ctx.db.delete(id);

    return { success: true };
  },
});

// Submit response (public mutation - NO auth required for external respondents)
export const submitResponse = mutation({
  args: {
    formSchemaId: v.id("formSchemas"),
    data: v.string(), // JSON string of form responses
    respondentName: v.optional(v.string()),
    respondentEmail: v.optional(v.string()),
    sentById: v.optional(v.id("users")),
    routeToUserIds: v.optional(v.array(v.id("users"))),
  },
  handler: async (ctx, args) => {
    // Get the form (must exist and be published)
    const form = await ctx.db.get(args.formSchemaId);
    if (!form) throw new Error("Form not found");
    if (!form.isPublished) throw new Error("Form is not accepting submissions");

    const id = await ctx.db.insert("formSubmissions", {
      formSchemaId: args.formSchemaId,
      formId: form.formId,
      data: args.data,
      respondentName: args.respondentName,
      respondentEmail: args.respondentEmail,
      sentById: args.sentById,
      routeToUserIds: args.routeToUserIds,
      submittedAt: Date.now(),
      status: "pending",
    });

    return await ctx.db.get(id);
  },
});

// Delete submission (owner only)
export const deleteSubmission = mutation({
  args: { id: v.id("formSubmissions") },
  handler: async (ctx, { id }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const submission = await ctx.db.get(id);
    if (!submission) throw new Error("Submission not found");

    // Check if user owns the form
    const form = await ctx.db.get(submission.formSchemaId);
    if (!form || form.ownerId !== currentUser.user._id) {
      throw new Error("Not authorized to delete this submission");
    }

    await ctx.db.delete(id);

    return { success: true };
  },
});
