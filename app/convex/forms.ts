import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// FORM FIELD TYPE DEFINITIONS
// ============================================

/**
 * Supported form field types for the form builder.
 * These types are stored as JSON string in the schema.
 */
export type FormFieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "time"
  | "email"
  | "tel"
  | "select"
  | "multiselect"
  | "checkbox"
  | "file";

/**
 * Form field definition structure.
 * Fields are stored as a JSON string array in the formSchemas.fields column.
 */
export type FormField = {
  name: string; // Unique field identifier
  type: FormFieldType;
  label: string; // Display label
  required: boolean;
  options?: string[]; // For select/multiselect types
  placeholder?: string;
};

/**
 * Parse and validate form fields from JSON string.
 * Returns the parsed array or throws on invalid structure.
 */
export function parseFormFields(fieldsJson: string): FormField[] {
  try {
    const parsed = JSON.parse(fieldsJson);

    if (!Array.isArray(parsed)) {
      throw new Error("Fields must be an array");
    }

    const validTypes: FormFieldType[] = [
      "text",
      "textarea",
      "number",
      "date",
      "time",
      "email",
      "tel",
      "select",
      "multiselect",
      "checkbox",
      "file",
    ];

    for (const field of parsed) {
      if (typeof field.name !== "string" || !field.name) {
        throw new Error("Each field must have a name string");
      }
      if (typeof field.type !== "string" || !validTypes.includes(field.type as FormFieldType)) {
        throw new Error(`Invalid field type: ${field.type}`);
      }
      if (typeof field.label !== "string") {
        throw new Error("Each field must have a label string");
      }
      if (typeof field.required !== "boolean") {
        throw new Error("Each field must have a required boolean");
      }
      // Validate options for select/multiselect
      if ((field.type === "select" || field.type === "multiselect") && field.options) {
        if (!Array.isArray(field.options) || !field.options.every((o: unknown) => typeof o === "string")) {
          throw new Error("Options must be an array of strings for select/multiselect fields");
        }
      }
    }

    return parsed as FormField[];
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON format for fields");
    }
    throw error;
  }
}

/**
 * Safely parse form fields, returning empty array on error.
 * Useful for display purposes where we don't want to crash on invalid data.
 */
export function safeParseFormFields(fieldsJson: string): FormField[] {
  try {
    return parseFormFields(fieldsJson);
  } catch {
    return [];
  }
}

// ============================================
// AUTH HELPERS
// ============================================

// Helper to get current user ID from auth (follows established pattern from channels.ts)
// In development, falls back to first available user if auth fails (for easier testing)
async function getCurrentUser(ctx: { auth: any; db: any }) {
  const identity = await ctx.auth.getUserIdentity();

  if (identity) {
    const user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), identity.email))
      .first();

    if (user) {
      const profile = await ctx.db
        .query("userProfiles")
        .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
        .first();

      return { user, profile };
    }
  }

  // Development fallback: use first available user if no auth
  // This only works if users exist in the database
  const devUser = await ctx.db.query("users").first();
  if (devUser) {
    const devProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q: any) => q.eq("userId", devUser._id))
      .first();
    return { user: devUser, profile: devProfile };
  }

  return null;
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

// Get submissions routed to current user (with form info)
export const getMyReceivedSubmissions = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return [];

    // Get all submissions and filter by routeToUserIds
    // Note: In production, consider adding an index for this pattern
    const allSubmissions = await ctx.db.query("formSubmissions").collect();

    const filteredSubmissions = allSubmissions.filter(
      (sub) =>
        sub.routeToUserIds &&
        sub.routeToUserIds.includes(currentUser.user._id)
    );

    // Enrich with form title
    const enrichedSubmissions = await Promise.all(
      filteredSubmissions.map(async (sub) => {
        const form = await ctx.db.get(sub.formSchemaId);
        return {
          ...sub,
          formTitle: form?.title || "Unknown Form",
        };
      })
    );

    return enrichedSubmissions;
  },
});

// Get submission counts for all forms owned by current user
export const getSubmissionCounts = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return {};

    // Get all forms owned by user
    const forms = await ctx.db
      .query("formSchemas")
      .withIndex("by_owner", (q) => q.eq("ownerId", currentUser.user._id))
      .collect();

    // Get submission counts for each form
    const counts: Record<string, number> = {};
    for (const form of forms) {
      const submissions = await ctx.db
        .query("formSubmissions")
        .withIndex("by_schema", (q) => q.eq("formSchemaId", form._id))
        .collect();
      counts[form._id] = submissions.length;
    }

    return counts;
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

    // Create form with initial version 1
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
      version: 1,
      createdAt: now,
      updatedAt: now,
    });

    // Create initial version record
    await ctx.db.insert("formSchemaVersions", {
      formSchemaId: id,
      version: 1,
      title: args.title,
      fields: args.fields,
      createdAt: now,
      createdBy: currentUser.user._id,
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

    const now = Date.now();
    const updates: Record<string, unknown> = { updatedAt: now };
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.category !== undefined) updates.category = args.category;
    if (args.fields !== undefined) updates.fields = args.fields;
    if (args.status !== undefined) updates.status = args.status;

    // Check if fields have changed - if so, create a new version
    const fieldsChanged = args.fields !== undefined && args.fields !== form.fields;

    if (fieldsChanged) {
      const currentVersion = form.version || 1;
      const newVersion = currentVersion + 1;
      updates.version = newVersion;

      // Create version record with snapshot of new fields
      await ctx.db.insert("formSchemaVersions", {
        formSchemaId: args.id,
        version: newVersion,
        title: args.title || form.title,
        fields: args.fields!,
        createdAt: now,
        createdBy: currentUser.user._id,
      });
    }

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

/**
 * Validate submitted form data against the form schema.
 * Throws detailed errors on validation failure.
 */
function validateFormSubmission(
  fieldsJson: string,
  dataJson: string
): { validatedData: Record<string, unknown>; errors: string[] } {
  const errors: string[] = [];

  // Parse the form fields schema
  let fields: FormField[];
  try {
    fields = parseFormFields(fieldsJson);
  } catch (_e) {
    throw new Error("Invalid form schema");
  }

  // Parse the submitted data
  let submittedData: Record<string, unknown>;
  try {
    submittedData = JSON.parse(dataJson);
    if (typeof submittedData !== "object" || submittedData === null || Array.isArray(submittedData)) {
      throw new Error("Submitted data must be an object");
    }
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error("Invalid JSON in submitted data");
    }
    throw e;
  }

  // Build a set of valid field names for quick lookup
  const validFieldNames = new Set(fields.map((f) => f.name));
  const validatedData: Record<string, unknown> = {};

  // Check for unknown fields (strict mode - reject unknown fields)
  for (const key of Object.keys(submittedData)) {
    if (!validFieldNames.has(key)) {
      errors.push(`Unknown field: ${key}`);
    }
  }

  // Validate each field
  for (const field of fields) {
    const value = submittedData[field.name];
    const isEmpty = value === undefined || value === null || value === "";

    // Required field check
    if (field.required && isEmpty) {
      errors.push(`Required field missing: ${field.label}`);
      continue;
    }

    // Skip validation for empty optional fields
    if (isEmpty) {
      continue;
    }

    // Type-specific validation
    switch (field.type) {
      case "text":
      case "textarea":
        if (typeof value !== "string") {
          errors.push(`${field.label} must be text`);
        } else {
          validatedData[field.name] = value;
        }
        break;

      case "number":
        // Accept string numbers from form inputs
        const numValue = typeof value === "string" ? parseFloat(value) : value;
        if (typeof numValue !== "number" || isNaN(numValue)) {
          errors.push(`${field.label} must be a number`);
        } else {
          validatedData[field.name] = numValue;
        }
        break;

      case "date":
      case "time":
        if (typeof value !== "string") {
          errors.push(`${field.label} must be a valid ${field.type}`);
        } else {
          validatedData[field.name] = value;
        }
        break;

      case "email":
        if (typeof value !== "string") {
          errors.push(`${field.label} must be text`);
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(`${field.label} must be a valid email address`);
          } else {
            validatedData[field.name] = value;
          }
        }
        break;

      case "tel":
        if (typeof value !== "string") {
          errors.push(`${field.label} must be text`);
        } else {
          validatedData[field.name] = value;
        }
        break;

      case "select":
        if (typeof value !== "string") {
          errors.push(`${field.label} must be a single selection`);
        } else if (field.options && !field.options.includes(value)) {
          errors.push(`${field.label} has invalid option: ${value}`);
        } else {
          validatedData[field.name] = value;
        }
        break;

      case "multiselect":
        if (!Array.isArray(value)) {
          errors.push(`${field.label} must be a list of selections`);
        } else {
          const invalidOptions = value.filter(
            (v) => typeof v !== "string" || (field.options && !field.options.includes(v))
          );
          if (invalidOptions.length > 0) {
            errors.push(`${field.label} has invalid options: ${invalidOptions.join(", ")}`);
          } else {
            validatedData[field.name] = value;
          }
        }
        break;

      case "checkbox":
        if (typeof value !== "boolean") {
          errors.push(`${field.label} must be true or false`);
        } else {
          validatedData[field.name] = value;
        }
        break;

      case "file":
        // File fields contain objects with name, type, size, data
        if (typeof value !== "object" || value === null) {
          errors.push(`${field.label} must be a file object`);
        } else {
          const fileObj = value as Record<string, unknown>;
          if (typeof fileObj.name !== "string" || typeof fileObj.type !== "string") {
            errors.push(`${field.label} has invalid file format`);
          } else {
            validatedData[field.name] = value;
          }
        }
        break;

      default:
        // For any unrecognized field type, accept string values
        if (typeof value === "string") {
          validatedData[field.name] = value;
        } else {
          errors.push(`${field.label} has unsupported field type`);
        }
    }
  }

  return { validatedData, errors };
}

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

    // Validate submitted data against form schema (SECURITY: strict validation)
    const { validatedData, errors } = validateFormSubmission(form.fields, args.data);

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join("; ")}`);
    }

    // Get the current version ID for linking
    const currentVersion = form.version || 1;
    const versionRecord = await ctx.db
      .query("formSchemaVersions")
      .withIndex("by_schema_version", (q) =>
        q.eq("formSchemaId", args.formSchemaId).eq("version", currentVersion)
      )
      .first();

    // Store the validated data (re-serialize to ensure clean data)
    const id = await ctx.db.insert("formSubmissions", {
      formSchemaId: args.formSchemaId,
      formId: form.formId,
      schemaVersionId: versionRecord?._id,
      schemaVersion: currentVersion,
      data: JSON.stringify(validatedData),
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

// ============================================
// FORM SENDING (DELIVERY)
// ============================================

// Send form to recipient (creates send record with routing config)
export const sendForm = mutation({
  args: {
    formSchemaId: v.id("formSchemas"),
    recipientEmail: v.string(),
    recipientName: v.optional(v.string()),
    routeToUserIds: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    // Verify form exists and user has access (owner or published)
    const form = await ctx.db.get(args.formSchemaId);
    if (!form) throw new Error("Form not found");

    // Only owner can send forms (or staff if published)
    if (form.ownerId !== currentUser.user._id && !form.isPublished) {
      throw new Error("Not authorized to send this form");
    }

    // Create send record
    const sendId = await ctx.db.insert("formSends", {
      formSchemaId: args.formSchemaId,
      sentById: currentUser.user._id,
      recipientEmail: args.recipientEmail,
      recipientName: args.recipientName,
      routeToUserIds: args.routeToUserIds,
      sentAt: Date.now(),
    });

    return await ctx.db.get(sendId);
  },
});

// Get send history for a form (owner only)
export const getSends = query({
  args: { formSchemaId: v.id("formSchemas") },
  handler: async (ctx, { formSchemaId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return [];

    // Verify ownership
    const form = await ctx.db.get(formSchemaId);
    if (!form || form.ownerId !== currentUser.user._id) return [];

    return await ctx.db
      .query("formSends")
      .withIndex("by_form", (q) => q.eq("formSchemaId", formSchemaId))
      .collect();
  },
});

// ============================================
// FORM VERSION HISTORY
// ============================================

// Get version history for a form (owner only)
export const getVersionHistory = query({
  args: { formSchemaId: v.id("formSchemas") },
  handler: async (ctx, { formSchemaId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return [];

    // Verify ownership
    const form = await ctx.db.get(formSchemaId);
    if (!form || form.ownerId !== currentUser.user._id) return [];

    const versions = await ctx.db
      .query("formSchemaVersions")
      .withIndex("by_schema", (q) => q.eq("formSchemaId", formSchemaId))
      .collect();

    // Sort by version number descending (newest first)
    return versions.sort((a, b) => b.version - a.version);
  },
});

// Get a specific version's schema (for viewing submissions)
export const getVersionSchema = query({
  args: { versionId: v.id("formSchemaVersions") },
  handler: async (ctx, { versionId }) => {
    return await ctx.db.get(versionId);
  },
});

// Get submission with its schema version for display
export const getSubmissionWithSchema = query({
  args: { submissionId: v.id("formSubmissions") },
  handler: async (ctx, { submissionId }) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return null;

    const submission = await ctx.db.get(submissionId);
    if (!submission) return null;

    // Check if user has access (owns the form or is in route list)
    const form = await ctx.db.get(submission.formSchemaId);
    if (!form) return null;

    const isOwner = form.ownerId === currentUser.user._id;
    const isRouted = submission.routeToUserIds?.includes(currentUser.user._id);
    if (!isOwner && !isRouted) return null;

    // Get the schema version if available
    let schemaVersion = null;
    if (submission.schemaVersionId) {
      schemaVersion = await ctx.db.get(submission.schemaVersionId);
    }

    return {
      submission,
      form,
      schemaVersion,
    };
  },
});

// ============================================
// LEGACY FORM SEEDING
// ============================================

// Legacy form definitions from 02-form-schemas.md
const LEGACY_FORMS = [
  {
    formId: "booking-wedding",
    title: "Wedding Booking Form",
    category: "booking",
    fields: [
      { name: "name", type: "text", label: "Name", required: true },
      { name: "address", type: "text", label: "Address", required: true },
      { name: "phone", type: "tel", label: "Phone", required: true },
      { name: "workPhoneEmail", type: "text", label: "Work Phone/Email", required: false },
      { name: "ceremony", type: "text", label: "Ceremony", required: false },
      { name: "guestCount", type: "number", label: "Guest Count", required: true },
      { name: "ceremonyLocation", type: "text", label: "Ceremony Location", required: false },
      { name: "coordinator", type: "text", label: "Coordinator", required: false },
      { name: "additionalNeeds", type: "textarea", label: "Additional Needs", required: false },
      { name: "eventType", type: "text", label: "Event Type", required: true },
      { name: "eventTime", type: "time", label: "Event Time", required: true },
      { name: "receptionLocation", type: "text", label: "Reception Location", required: false },
      { name: "afterHoursRental", type: "text", label: "After Hours Rental", required: false },
      { name: "caterer", type: "text", label: "Caterer", required: false },
      { name: "linens", type: "text", label: "Linens", required: false },
      { name: "paymentDue", type: "date", label: "Payment Due", required: false },
      { name: "planningApptDate", type: "date", label: "Planning Appointment Date", required: false },
      { name: "decorApptDate", type: "date", label: "Decor Appointment Date", required: false },
      { name: "twoWeeksOutApptDate", type: "date", label: "Two Weeks Out Appointment Date", required: false },
      { name: "damageDeposit", type: "number", label: "Damage Deposit", required: false },
      { name: "depositReturned", type: "checkbox", label: "Deposit Returned", required: false },
      { name: "menuTasting", type: "text", label: "Menu Tasting", required: false },
      { name: "flowersFlorist", type: "text", label: "Flowers/Florist", required: false },
      { name: "anniversaryEmail", type: "email", label: "Anniversary Email", required: false },
    ],
    originalFile: "clients/booking/booking-form-wedding.md",
    status: "needs_redesign",
  },
  {
    formId: "booking-corporate",
    title: "Corporate Event Booking Form",
    category: "booking",
    fields: [
      { name: "responsibleParty", type: "text", label: "Responsible Party", required: true },
      { name: "company", type: "text", label: "Company", required: true },
      { name: "address", type: "text", label: "Address", required: true },
      { name: "city", type: "text", label: "City", required: true },
      { name: "cellPhone", type: "tel", label: "Cell Phone", required: true },
      { name: "email", type: "email", label: "Email", required: true },
      { name: "dateOfEvent", type: "date", label: "Date of Event", required: true },
      { name: "eventTime", type: "time", label: "Event Time", required: true },
      { name: "eventType", type: "text", label: "Event Type", required: true },
      { name: "guestCount", type: "number", label: "Guest Count", required: true },
      { name: "depositPaid", type: "number", label: "Deposit Paid", required: false },
      { name: "eventLocation", type: "text", label: "Event Location", required: true },
      { name: "additionalComments", type: "textarea", label: "Additional Comments", required: false },
    ],
    originalFile: "clients/booking/booking-form-corporate.md",
    status: "needs_redesign",
  },
  {
    formId: "booking-shower",
    title: "Shower/Small Party Booking Form",
    category: "booking",
    fields: [
      { name: "responsiblePartyName", type: "text", label: "Responsible Party Name", required: true },
      { name: "guestsOfHonor", type: "text", label: "Guest(s) of Honor", required: true },
      { name: "address", type: "text", label: "Address", required: true },
      { name: "cityAndZip", type: "text", label: "City and Zip Code", required: true },
      { name: "daytimePhone", type: "tel", label: "Daytime Phone", required: false },
      { name: "cellPhone", type: "tel", label: "Cell Phone", required: true },
      { name: "email", type: "email", label: "Email", required: true },
      { name: "dateOfEvent", type: "date", label: "Date of Event", required: true },
      { name: "eventTime", type: "time", label: "Event Time", required: true },
      { name: "partyType", type: "select", label: "Party Type", required: true, options: ["Baby Shower", "Bridal Shower", "Birthday Party", "Anniversary", "Other"] },
      { name: "guestCount", type: "number", label: "Guest Count", required: true },
      { name: "depositPaid", type: "number", label: "Deposit Paid", required: false },
      { name: "depositDate", type: "date", label: "Deposit Date", required: false },
      { name: "eventLocation", type: "text", label: "Event Location", required: true },
      { name: "cakeInfo", type: "textarea", label: "Cake Info", required: false },
      { name: "barInfo", type: "textarea", label: "Bar Info", required: false },
      { name: "menu", type: "textarea", label: "Menu", required: false },
      { name: "additionalComments", type: "textarea", label: "Additional Comments", required: false },
    ],
    originalFile: "clients/booking/booking-form-shower.md",
    status: "needs_redesign",
  },
  {
    formId: "hr-time-off-request",
    title: "Employee Time-Off Request Form",
    category: "hr",
    fields: [
      { name: "todaysDate", type: "date", label: "Today's Date", required: true },
      { name: "employeeName", type: "text", label: "Employee Name", required: true },
      { name: "requestType", type: "select", label: "Request Type", required: true, options: ["Days", "Hours"] },
      { name: "beginningOn", type: "date", label: "Beginning On", required: true },
      { name: "endingOn", type: "date", label: "Ending On", required: true },
      { name: "reason", type: "select", label: "Reason", required: true, options: ["Vacation", "Personal Leave", "Funeral / Bereavement", "Jury Duty", "Family Reasons", "Medical Leave", "To Vote", "Other"] },
      { name: "reasonOther", type: "text", label: "Other Reason (if applicable)", required: false },
      { name: "employeeSignatureDate", type: "date", label: "Employee Signature Date", required: true },
      { name: "approvalStatus", type: "select", label: "Approval Status", required: false, options: ["Approved", "Rejected"] },
      { name: "employerSignatureDate", type: "date", label: "Employer Signature Date", required: false },
      { name: "employerPrintName", type: "text", label: "Employer Print Name", required: false },
    ],
    originalFile: "staff/hr/hr-forms.md",
    status: "active",
  },
  {
    formId: "hr-employee-warning",
    title: "Employee Warning Form",
    category: "hr",
    fields: [
      { name: "employeeName", type: "text", label: "Employee Name", required: true },
      { name: "managerName", type: "text", label: "Manager Name", required: true },
      { name: "warningDate", type: "date", label: "Warning Date", required: true },
      { name: "previousDisciplineDate", type: "date", label: "Previous Discipline Date", required: false },
      { name: "warningReasons", type: "multiselect", label: "Warning Reasons", required: true, options: ["Absenteeism", "Failure to follow procedure", "Rudeness", "Tardiness", "Failure to meet performance", "Refusal to work overtime", "Policy violation", "Fighting", "Language", "Other"] },
      { name: "warningReasonOther", type: "text", label: "Other Reason (if applicable)", required: false },
      { name: "warningDetails", type: "textarea", label: "Warning Details", required: true },
      { name: "correctiveActionRequired", type: "textarea", label: "Corrective Action Required", required: true },
      { name: "employeePrintName", type: "text", label: "Employee Print Name", required: true },
      { name: "employeeSignatureDate", type: "date", label: "Employee Signature Date", required: true },
      { name: "supervisorPrintName", type: "text", label: "Supervisor Print Name", required: true },
      { name: "supervisorSignatureDate", type: "date", label: "Supervisor Signature Date", required: true },
    ],
    originalFile: "staff/hr/hr-forms.md",
    status: "active",
  },
  {
    formId: "operations-decor-appointment",
    title: "Decor Appointment Form",
    category: "operations",
    fields: [
      { name: "clientName", type: "text", label: "Client Name", required: true },
      { name: "eventDate", type: "date", label: "Event Date", required: true },
      { name: "appointmentDate", type: "date", label: "Appointment Date", required: true },
      { name: "decorSelections", type: "textarea", label: "Decor Selections", required: false },
      { name: "notes", type: "textarea", label: "Notes", required: false },
    ],
    originalFile: "operations/forms/decor-appointment.docx",
    status: "needs_redesign",
  },
  {
    formId: "operations-final-appointment",
    title: "Final Appointment Form",
    category: "operations",
    fields: [
      { name: "clientName", type: "text", label: "Client Name", required: true },
      { name: "eventDate", type: "date", label: "Event Date", required: true },
      { name: "appointmentDate", type: "date", label: "Appointment Date", required: true },
      { name: "finalDetails", type: "textarea", label: "Final Details", required: false },
      { name: "vendorConfirmations", type: "textarea", label: "Vendor Confirmations", required: false },
      { name: "notes", type: "textarea", label: "Notes", required: false },
    ],
    originalFile: "operations/forms/final-appointment.docx",
    status: "needs_redesign",
  },
  {
    formId: "operations-vendor-setup",
    title: "Vendor Setup Form",
    category: "operations",
    fields: [
      { name: "eventName", type: "text", label: "Event Name", required: true },
      { name: "eventDate", type: "date", label: "Event Date", required: true },
      { name: "vendorName", type: "text", label: "Vendor Name", required: true },
      { name: "vendorType", type: "text", label: "Vendor Type", required: true },
      { name: "arrivalTime", type: "time", label: "Arrival Time", required: true },
      { name: "setupRequirements", type: "textarea", label: "Setup Requirements", required: false },
      { name: "notes", type: "textarea", label: "Notes", required: false },
    ],
    originalFile: "operations/forms/vendor-setup.docx",
    status: "needs_redesign",
  },
  {
    formId: "operations-tasting",
    title: "Menu Tasting Form",
    category: "operations",
    fields: [
      { name: "clientName", type: "text", label: "Client Name", required: true },
      { name: "eventDate", type: "date", label: "Event Date", required: true },
      { name: "tastingDate", type: "date", label: "Tasting Date", required: true },
      { name: "guestCount", type: "number", label: "Guest Count", required: true },
      { name: "menuSelections", type: "textarea", label: "Menu Selections", required: false },
      { name: "dietaryRestrictions", type: "textarea", label: "Dietary Restrictions", required: false },
      { name: "notes", type: "textarea", label: "Notes", required: false },
    ],
    originalFile: "operations/forms/tasting-form.pdf",
    status: "needs_redesign",
  },
  {
    formId: "checklist-9-12-months",
    title: "Planning Checklist: 9-12 Months Out",
    category: "planning-checklist",
    fields: [
      { name: "clientName", type: "text", label: "Client Name", required: true },
      { name: "eventDate", type: "date", label: "Event Date", required: true },
      { name: "tasks", type: "textarea", label: "Tasks / Notes", required: false },
    ],
    originalFile: "clients/planning/checklist-9-12-months.docx",
    status: "needs_redesign",
  },
  {
    formId: "checklist-7-8-months",
    title: "Planning Checklist: 7-8 Months Out",
    category: "planning-checklist",
    fields: [
      { name: "clientName", type: "text", label: "Client Name", required: true },
      { name: "eventDate", type: "date", label: "Event Date", required: true },
      { name: "tasks", type: "textarea", label: "Tasks / Notes", required: false },
    ],
    originalFile: "clients/planning/checklist-7-8-months.docx",
    status: "needs_redesign",
  },
  {
    formId: "checklist-4-6-months",
    title: "Planning Checklist: 4-6 Months Out",
    category: "planning-checklist",
    fields: [
      { name: "clientName", type: "text", label: "Client Name", required: true },
      { name: "eventDate", type: "date", label: "Event Date", required: true },
      { name: "tasks", type: "textarea", label: "Tasks / Notes", required: false },
    ],
    originalFile: "clients/planning/checklist-4-6-months.docx",
    status: "needs_redesign",
  },
  {
    formId: "checklist-1-3-months",
    title: "Planning Checklist: 1-3 Months Out",
    category: "planning-checklist",
    fields: [
      { name: "clientName", type: "text", label: "Client Name", required: true },
      { name: "eventDate", type: "date", label: "Event Date", required: true },
      { name: "tasks", type: "textarea", label: "Tasks / Notes", required: false },
    ],
    originalFile: "clients/planning/checklist-1-3-months.docx",
    status: "needs_redesign",
  },
  {
    formId: "checklist-pre-wedding",
    title: "Pre-Wedding To Do List",
    category: "planning-checklist",
    fields: [
      { name: "clientName", type: "text", label: "Client Name", required: true },
      { name: "eventDate", type: "date", label: "Event Date", required: true },
      { name: "tasks", type: "textarea", label: "Tasks / Notes", required: false },
    ],
    originalFile: "clients/planning/pre-wedding-todo.docx",
    status: "needs_redesign",
  },
  {
    formId: "reset-checklist-hall",
    title: "Hall Reset Checklist",
    category: "operations-checklist",
    fields: [
      { name: "eventName", type: "text", label: "Event Name", required: true },
      { name: "eventDate", type: "date", label: "Event Date", required: true },
      { name: "completedBy", type: "text", label: "Completed By", required: false },
      { name: "tasks", type: "textarea", label: "Reset Tasks / Notes", required: false },
    ],
    originalFile: "clients/layouts/hall/reset-checklist.docx",
    status: "needs_redesign",
  },
  {
    formId: "reset-checklist-saloon",
    title: "Saloon Reset Checklist",
    category: "operations-checklist",
    fields: [
      { name: "eventName", type: "text", label: "Event Name", required: true },
      { name: "eventDate", type: "date", label: "Event Date", required: true },
      { name: "completedBy", type: "text", label: "Completed By", required: false },
      { name: "tasks", type: "textarea", label: "Reset Tasks / Notes", required: false },
    ],
    originalFile: "clients/layouts/saloon/reset-checklist.docx",
    status: "needs_redesign",
  },
  {
    formId: "day-of-music-list",
    title: "Music Selection Form",
    category: "day-of",
    fields: [
      { name: "clientName", type: "text", label: "Client Name", required: true },
      { name: "eventDate", type: "date", label: "Event Date", required: true },
      { name: "ceremonyMusic", type: "textarea", label: "Ceremony Music", required: false },
      { name: "receptionMusic", type: "textarea", label: "Reception Music", required: false },
      { name: "doNotPlayList", type: "textarea", label: "Do Not Play List", required: false },
      { name: "specialRequests", type: "textarea", label: "Special Requests", required: false },
    ],
    originalFile: "clients/day-of/music-list.docx",
    status: "needs_redesign",
  },
];

// Seed legacy forms (admin/staff runs this to pre-populate forms)
export const seedLegacyForms = mutation({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const now = Date.now();
    const results: { created: string[]; skipped: string[] } = {
      created: [],
      skipped: [],
    };

    for (const legacyForm of LEGACY_FORMS) {
      // Check if form already exists by formId
      const existing = await ctx.db
        .query("formSchemas")
        .withIndex("by_formId", (q) => q.eq("formId", legacyForm.formId))
        .first();

      if (existing) {
        results.skipped.push(legacyForm.formId);
        continue;
      }

      // Create form as draft owned by current user
      await ctx.db.insert("formSchemas", {
        formId: legacyForm.formId,
        title: legacyForm.title,
        description: `Legacy form (status: ${legacyForm.status}). Original file: ${legacyForm.originalFile}`,
        category: legacyForm.category,
        fields: JSON.stringify(legacyForm.fields),
        originalFile: legacyForm.originalFile,
        status: "draft",
        ownerId: currentUser.user._id,
        isPublished: false,
        createdAt: now,
        updatedAt: now,
      });

      results.created.push(legacyForm.formId);
    }

    return {
      message: `Seeded ${results.created.length} forms, skipped ${results.skipped.length} existing`,
      created: results.created,
      skipped: results.skipped,
    };
  },
});
