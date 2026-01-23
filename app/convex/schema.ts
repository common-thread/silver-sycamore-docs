import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // User profiles with role assignments
  userProfiles: defineTable({
    userId: v.id("users"),
    displayName: v.optional(v.string()),
    role: v.string(), // "admin" | "manager" | "staff"
    department: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_role", ["role"]),

  documents: defineTable({
    title: v.string(),
    slug: v.string(),
    category: v.string(),
    subcategory: v.optional(v.string()),
    content: v.string(),
    sourceFile: v.optional(v.string()),
    sourceType: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    version: v.optional(v.number()), // Current version number
    contentType: v.optional(v.union(
      v.literal("procedure"),
      v.literal("reference"),
      v.literal("form"),
      v.literal("checklist"),
      v.literal("guide")
    )), // Purpose-based content classification
    formId: v.optional(v.string()), // Link form-type documents to their form builder equivalent
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_slug", ["slug"])
    .index("by_category_subcategory", ["category", "subcategory"])
    .index("by_contentType", ["contentType"])
    .searchIndex("search_content", { searchField: "content", filterFields: ["category"] }),

  // Document version history
  documentVersions: defineTable({
    documentId: v.id("documents"),
    version: v.number(),
    title: v.string(),
    content: v.string(),
    category: v.string(),
    subcategory: v.optional(v.string()),
    editedBy: v.optional(v.id("users")),
    editedByName: v.optional(v.string()),
    changeNote: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_document", ["documentId"])
    .index("by_document_version", ["documentId", "version"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    order: v.number(),
    icon: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"]),

  subcategories: defineTable({
    categoryId: v.id("categories"),
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    order: v.number(),
  })
    .index("by_category", ["categoryId"])
    .index("by_slug", ["slug"]),

  initiatives: defineTable({
    title: v.string(),
    status: v.string(),
    phase: v.optional(v.string()),
    nextActions: v.optional(v.string()),
    dependency: v.optional(v.string()),
    completedDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    link: v.optional(v.string()),
    order: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"]),

  files: defineTable({
    documentId: v.optional(v.id("documents")),
    name: v.string(),
    storageId: v.id("_storage"),
    mimeType: v.string(),
    size: v.number(),
    uploadedAt: v.number(),
  })
    .index("by_document", ["documentId"]),

  venueSpaces: defineTable({
    name: v.string(),
    slug: v.string(),
    capacity: v.optional(v.number()),
    description: v.optional(v.string()),
  })
    .index("by_slug", ["slug"]),

  roomLayouts: defineTable({
    venueSpaceId: v.id("venueSpaces"),
    name: v.string(),
    guestCount: v.optional(v.number()),
    content: v.string(),
    fileId: v.optional(v.id("files")),
  })
    .index("by_venue", ["venueSpaceId"]),

  packages: defineTable({
    type: v.string(),
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.optional(v.number()),
    pricePerPerson: v.optional(v.number()),
    duration: v.optional(v.string()),
    inclusions: v.array(v.string()),
    documentId: v.optional(v.id("documents")),
    order: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_slug", ["slug"]),

  formSchemas: defineTable({
    formId: v.string(), // Unique identifier for public access
    title: v.string(),
    description: v.optional(v.string()), // Form description
    category: v.string(),
    fields: v.string(), // JSON string of field definitions
    originalFile: v.optional(v.string()),
    status: v.string(),
    ownerId: v.id("users"), // Who created/owns the form
    isPublished: v.boolean(), // Whether form is active/accessible
    version: v.optional(v.number()), // Current version number (starts at 1)
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_formId", ["formId"])
    .index("by_category", ["category"])
    .index("by_owner", ["ownerId"]),

  // Form schema version history - snapshots of form fields at each version
  formSchemaVersions: defineTable({
    formSchemaId: v.id("formSchemas"),
    version: v.number(), // Version number (1, 2, 3, ...)
    title: v.string(), // Title at this version
    fields: v.string(), // JSON snapshot of fields at this version
    createdAt: v.number(),
    createdBy: v.optional(v.id("users")), // Who made this version
  })
    .index("by_schema", ["formSchemaId"])
    .index("by_schema_version", ["formSchemaId", "version"]),

  formSubmissions: defineTable({
    formSchemaId: v.id("formSchemas"), // Reference to form schema
    formId: v.string(), // Copy of formId for easier lookup
    schemaVersionId: v.optional(v.id("formSchemaVersions")), // Version of form at submission time
    schemaVersion: v.optional(v.number()), // Version number for quick lookup
    data: v.string(), // JSON string of submitted form data
    respondentName: v.optional(v.string()), // Who filled out the form (external)
    respondentEmail: v.optional(v.string()), // Respondent's email (external)
    sentById: v.optional(v.id("users")), // Staff member who sent/initiated the form
    routeToUserIds: v.optional(v.array(v.id("users"))), // Additional staff recipients
    sendId: v.optional(v.id("formSends")), // Link to specific send record
    submittedAt: v.number(),
    status: v.string(),
  })
    .index("by_formId", ["formId"])
    .index("by_status", ["status"])
    .index("by_schema", ["formSchemaId"])
    .index("by_sentBy", ["sentById"])
    .index("by_send", ["sendId"])
    .index("by_schemaVersion", ["schemaVersionId"]),

  // Track form sends (who sent form to whom)
  formSends: defineTable({
    formSchemaId: v.id("formSchemas"),
    sentById: v.id("users"), // Staff who sent it
    recipientEmail: v.string(), // Who it was sent to
    recipientName: v.optional(v.string()),
    routeToUserIds: v.array(v.id("users")), // Additional recipients for responses
    sentAt: v.number(),
  })
    .index("by_form", ["formSchemaId"])
    .index("by_sender", ["sentById"]),

  procedures: defineTable({
    title: v.string(),
    slug: v.string(),
    category: v.string(),
    content: v.string(),
    steps: v.optional(v.string()),
    documentId: v.optional(v.id("documents")),
  })
    .index("by_category", ["category"])
    .index("by_slug", ["slug"]),

  // Personal workspace folders
  personalFolders: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    parentId: v.optional(v.id("personalFolders")), // Nested folders
    createdAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_owner_parent", ["ownerId", "parentId"]),

  // Personal workspace documents
  personalDocuments: defineTable({
    ownerId: v.id("users"),
    title: v.string(),
    content: v.string(),
    folderId: v.optional(v.id("personalFolders")), // Optional folder organization
    sourceDocumentId: v.optional(v.id("documents")), // If copied from wiki
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_owner_folder", ["ownerId", "folderId"]),

  // Folder sharing - individual share grants
  folderShares: defineTable({
    folderId: v.id("personalFolders"),
    sharedWithUserId: v.optional(v.id("users")), // Direct user share
    sharedWithGroupId: v.optional(v.id("shareGroups")), // Group share
    permission: v.string(), // "view" | "comment" | "edit"
    sharedBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_folder", ["folderId"])
    .index("by_user", ["sharedWithUserId"])
    .index("by_group", ["sharedWithGroupId"])
    .index("by_folder_user", ["folderId", "sharedWithUserId"])
    .index("by_folder_group", ["folderId", "sharedWithGroupId"]),

  // Ad-hoc groups for sharing
  shareGroups: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_owner", ["ownerId"]),

  // User membership in share groups
  groupMembers: defineTable({
    groupId: v.id("shareGroups"),
    userId: v.id("users"),
    addedAt: v.number(),
  })
    .index("by_group", ["groupId"])
    .index("by_user", ["userId"])
    .index("by_group_user", ["groupId", "userId"]),

  // Threaded document comments
  comments: defineTable({
    documentId: v.optional(v.id("documents")), // Wiki document being commented on
    personalDocumentId: v.optional(v.id("personalDocuments")), // Personal doc being commented on
    authorId: v.id("users"), // Who wrote the comment
    parentId: v.optional(v.id("comments")), // For threading (null = top-level, set = reply)
    content: v.string(), // Comment text (may contain @mentions as @[userId])
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_document", ["documentId"]) // Get all comments for a wiki doc
    .index("by_personal_document", ["personalDocumentId"]) // Get comments on personal docs
    .index("by_parent", ["parentId"]) // Get replies to a comment
    .index("by_author", ["authorId"]), // User's comment history

  // PR-style document change suggestions
  suggestions: defineTable({
    documentId: v.id("documents"), // The official doc being modified
    authorId: v.id("users"), // Who proposed the change
    status: v.string(), // State machine: "draft" | "pending" | "approved" | "rejected"
    title: v.string(), // Suggested new title
    content: v.string(), // Suggested new content (full document, not diff)
    changeNote: v.string(), // Description of what changed and why
    reviewedBy: v.optional(v.id("users")), // Who approved/rejected
    reviewNote: v.optional(v.string()), // Reviewer's feedback
    appliedAt: v.optional(v.number()), // When changes were promoted to document
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_document", ["documentId"]) // Get all suggestions for a doc
    .index("by_author", ["authorId"]) // User's suggestions
    .index("by_status", ["status"]) // Filter by state
    .index("by_document_status", ["documentId", "status"]), // Pending suggestions for a doc

  // Slack-like messaging channels
  channels: defineTable({
    name: v.string(), // Channel display name
    type: v.string(), // "public" | "private" | "dm" (DMs are 2-person private channels)
    description: v.optional(v.string()), // Optional channel description
    creatorId: v.id("users"), // Who created the channel
    isArchived: v.boolean(), // Soft delete
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_creator", ["creatorId"]),

  // Channel membership tracking
  channelMembers: defineTable({
    channelId: v.id("channels"),
    userId: v.id("users"),
    role: v.string(), // "owner" | "admin" | "member"
    joinedAt: v.number(),
    lastReadAt: v.optional(v.number()), // For unread tracking
  })
    .index("by_channel", ["channelId"])
    .index("by_user", ["userId"])
    .index("by_channel_user", ["channelId", "userId"]),

  // Channel messages with threading support
  messages: defineTable({
    channelId: v.id("channels"),
    authorId: v.id("users"),
    content: v.string(), // Message text with @[userId] mentions
    parentId: v.optional(v.id("messages")), // For threaded replies
    fileId: v.optional(v.id("files")), // Optional file attachment
    isEdited: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_channel", ["channelId"])
    .index("by_author", ["authorId"])
    .index("by_parent", ["parentId"])
    .index("by_channel_created", ["channelId", "createdAt"]),

  // User notifications (@mentions, DMs, etc.)
  notifications: defineTable({
    userId: v.id("users"), // Recipient
    type: v.string(), // "mention" | "dm" (extensible for future types)
    channelId: v.id("channels"), // Where the notification originated
    messageId: v.id("messages"), // The specific message
    fromUserId: v.id("users"), // Who triggered it
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_read", ["userId", "isRead"]),

  // Dynamic content instances - personal instances of procedures, checklists, and forms
  dynamicContentInstances: defineTable({
    // Source template
    sourceDocumentId: v.id("documents"),
    sourceType: v.union(
      v.literal("procedure"),
      v.literal("checklist"),
      v.literal("form")
    ),

    // Owner (null for anonymous)
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()), // For anonymous users

    // Completion state
    status: v.union(
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("submitted")
    ),
    completionData: v.string(), // JSON: step states, form values
    completedSteps: v.optional(v.number()), // Quick access to progress
    totalSteps: v.optional(v.number()),

    // Metadata
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    submittedTo: v.optional(v.array(v.id("users"))), // Who receives results
  })
    .index("by_source", ["sourceDocumentId"])
    .index("by_user", ["userId"])
    .index("by_user_source", ["userId", "sourceDocumentId"])
    .index("by_session", ["sessionId"])
    .index("by_session_source", ["sessionId", "sourceDocumentId"])
    .index("by_user_status", ["userId", "status"]),

  // Activity log - tracks user activity for dashboard and sidebar
  activityLog: defineTable({
    userId: v.id("users"),

    // What happened
    type: v.union(
      v.literal("procedure_started"),
      v.literal("procedure_completed"),
      v.literal("checklist_completed"),
      v.literal("form_submitted"),
      v.literal("form_received") // Someone submitted to this user
    ),

    // References
    instanceId: v.optional(v.id("dynamicContentInstances")),
    documentId: v.optional(v.id("documents")),
    formSubmissionId: v.optional(v.id("formSubmissions")),

    // Context
    title: v.string(), // Denormalized for display
    fromUserId: v.optional(v.id("users")), // Who triggered (for received items)

    // Timestamps
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_recent", ["userId", "createdAt"])
    .index("by_type", ["type"]),

  // Share links - enables internal and external sharing
  shareLinks: defineTable({
    // What's being shared
    documentId: v.id("documents"),

    // Link configuration
    shareToken: v.string(), // Random token for URL
    shareType: v.union(v.literal("internal"), v.literal("external")),

    // Access control
    createdBy: v.id("users"),
    sharedWithUserIds: v.optional(v.array(v.id("users"))), // Internal shares
    routeResultsTo: v.array(v.id("users")), // Who gets submissions

    // Expiration (optional)
    expiresAt: v.optional(v.number()),
    maxUses: v.optional(v.number()),
    useCount: v.number(),

    // Metadata
    createdAt: v.number(),
  })
    .index("by_token", ["shareToken"])
    .index("by_document", ["documentId"])
    .index("by_creator", ["createdBy"]),
});
