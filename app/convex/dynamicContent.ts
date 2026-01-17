import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Parse steps from document content based on content type.
 * - For procedures: Extract h2 headers as steps
 * - For checklists: Extract markdown list items
 */
function parseStepsFromContent(
  content: string,
  contentType: "procedure" | "checklist" | "form"
): string[] {
  if (contentType === "procedure") {
    // Extract h2 headers as steps (## Step Title)
    const h2Regex = /^##\s+(.+)$/gm;
    const steps: string[] = [];
    let match;
    while ((match = h2Regex.exec(content)) !== null) {
      steps.push(match[1].trim());
    }
    return steps;
  }

  if (contentType === "checklist") {
    // Extract markdown list items (- [ ] Item or - Item)
    const listRegex = /^[-*]\s+(?:\[[ x]\]\s+)?(.+)$/gm;
    const steps: string[] = [];
    let match;
    while ((match = listRegex.exec(content)) !== null) {
      steps.push(match[1].trim());
    }
    return steps;
  }

  // For forms, return empty (forms handle their own fields)
  return [];
}

/**
 * Start a new instance for a procedure, checklist, or form.
 * Creates a fresh completion tracking record.
 */
export const startInstance = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    // Get the document
    const doc = await ctx.db.get(documentId);
    if (!doc) {
      throw new Error("Document not found");
    }

    // Validate content type
    const validTypes = ["procedure", "checklist", "form"];
    if (!doc.contentType || !validTypes.includes(doc.contentType)) {
      throw new Error(
        `Document must have contentType of procedure, checklist, or form. Got: ${doc.contentType || "undefined"}`
      );
    }

    const sourceType = doc.contentType as "procedure" | "checklist" | "form";

    // Parse steps from content
    const steps = parseStepsFromContent(doc.content, sourceType);

    // Get current user if authenticated
    const identity = await ctx.auth.getUserIdentity();
    let userId: Id<"users"> | undefined = undefined;
    let sessionId: string | undefined = undefined;

    if (identity) {
      // Look up user by email
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), identity.email))
        .first();
      if (user) {
        userId = user._id;
      }
      // Store session ID for future anonymous linking
      sessionId = identity.tokenIdentifier;
    }

    // Create the instance
    const instanceId = await ctx.db.insert("dynamicContentInstances", {
      sourceDocumentId: documentId,
      sourceType,
      userId,
      sessionId,
      status: "in_progress",
      completionData: JSON.stringify({ steps: steps.map(() => false) }),
      completedSteps: 0,
      totalSteps: steps.length,
      startedAt: Date.now(),
    });

    // Log activity if user is authenticated
    if (userId) {
      await ctx.db.insert("activityLog", {
        userId,
        type: "procedure_started",
        instanceId,
        documentId,
        title: doc.title,
        createdAt: Date.now(),
      });
    }

    return instanceId;
  },
});

/**
 * Complete or uncomplete a step in an instance.
 * Updates completion data atomically and recalculates progress.
 */
export const completeStep = mutation({
  args: {
    instanceId: v.id("dynamicContentInstances"),
    stepIndex: v.number(),
    completed: v.boolean(),
  },
  handler: async (ctx, { instanceId, stepIndex, completed }) => {
    // Get the instance
    const instance = await ctx.db.get(instanceId);
    if (!instance) {
      throw new Error("Instance not found");
    }

    // Verify access (owner or session match)
    const identity = await ctx.auth.getUserIdentity();
    let hasAccess = false;

    if (instance.userId) {
      // Instance has a user owner - check if current user matches
      if (identity) {
        const user = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("email"), identity.email))
          .first();
        if (user && user._id === instance.userId) {
          hasAccess = true;
        }
      }
    } else if (instance.sessionId) {
      // Anonymous instance - check session match
      if (identity?.tokenIdentifier === instance.sessionId) {
        hasAccess = true;
      }
    } else {
      // No owner - allow access (legacy or public)
      hasAccess = true;
    }

    if (!hasAccess) {
      throw new Error("Access denied");
    }

    // Parse and update completion data
    const data = JSON.parse(instance.completionData) as { steps: boolean[] };

    // Validate step index
    if (stepIndex < 0 || stepIndex >= data.steps.length) {
      throw new Error(`Invalid step index: ${stepIndex}`);
    }

    data.steps[stepIndex] = completed;

    // Recalculate completed steps
    const completedSteps = data.steps.filter(Boolean).length;
    const isFullyComplete = completedSteps === instance.totalSteps;

    // Update instance
    await ctx.db.patch(instanceId, {
      completionData: JSON.stringify(data),
      completedSteps,
      status: isFullyComplete ? "completed" : "in_progress",
      completedAt: isFullyComplete ? Date.now() : undefined,
    });

    // Log completion if fully complete and user is authenticated
    if (isFullyComplete && instance.userId) {
      const doc = await ctx.db.get(instance.sourceDocumentId);
      const activityType =
        instance.sourceType === "procedure"
          ? "procedure_completed"
          : instance.sourceType === "checklist"
            ? "checklist_completed"
            : "form_submitted";

      await ctx.db.insert("activityLog", {
        userId: instance.userId,
        type: activityType,
        instanceId,
        documentId: instance.sourceDocumentId,
        title: doc?.title ?? "Unknown",
        createdAt: Date.now(),
      });
    }

    // Return the updated instance
    return await ctx.db.get(instanceId);
  },
});

/**
 * Get user's active instance for a document.
 * Returns in_progress instance if exists, otherwise null.
 */
export const getInstanceForDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // For anonymous, would need sessionId passed in - return null for now
      return null;
    }

    // Look up user
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();
    if (!user) {
      return null;
    }

    // Find active instance for this user and document
    const instance = await ctx.db
      .query("dynamicContentInstances")
      .withIndex("by_user_source", (q) =>
        q.eq("userId", user._id).eq("sourceDocumentId", documentId)
      )
      .filter((q) => q.eq(q.field("status"), "in_progress"))
      .first();

    return instance;
  },
});

/**
 * Get user's instances with optional status filter.
 * Returns instances ordered by startedAt descending.
 */
export const getUserInstances = query({
  args: {
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { status, limit = 20 }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Look up user
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();
    if (!user) {
      return [];
    }

    // Query instances
    let query = ctx.db
      .query("dynamicContentInstances")
      .withIndex("by_user", (q) => q.eq("userId", user._id));

    // Filter by status if provided
    if (status) {
      query = query.filter((q) => q.eq(q.field("status"), status));
    }

    // Get instances ordered by startedAt desc
    const instances = await query.collect();

    // Sort by startedAt descending and limit
    return instances
      .sort((a, b) => b.startedAt - a.startedAt)
      .slice(0, limit);
  },
});

/**
 * Get instance by ID with document info.
 */
export const getInstance = query({
  args: { instanceId: v.id("dynamicContentInstances") },
  handler: async (ctx, { instanceId }) => {
    const instance = await ctx.db.get(instanceId);
    if (!instance) {
      return null;
    }

    const document = await ctx.db.get(instance.sourceDocumentId);
    return {
      ...instance,
      document,
    };
  },
});
