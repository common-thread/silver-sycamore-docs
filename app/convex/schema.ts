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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_slug", ["slug"])
    .index("by_category_subcategory", ["category", "subcategory"])
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
    formId: v.string(),
    title: v.string(),
    category: v.string(),
    fields: v.string(),
    originalFile: v.optional(v.string()),
    status: v.string(),
  })
    .index("by_formId", ["formId"])
    .index("by_category", ["category"]),

  formSubmissions: defineTable({
    formSchemaId: v.id("formSchemas"),
    formId: v.string(),
    data: v.string(),
    submittedBy: v.optional(v.string()),
    submittedAt: v.number(),
    status: v.string(),
  })
    .index("by_formId", ["formId"])
    .index("by_status", ["status"]),

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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_document", ["documentId"]) // Get all suggestions for a doc
    .index("by_author", ["authorId"]) // User's suggestions
    .index("by_status", ["status"]) // Filter by state
    .index("by_document_status", ["documentId", "status"]), // Pending suggestions for a doc
});
