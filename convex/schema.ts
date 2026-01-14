import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_slug", ["slug"])
    .index("by_category_subcategory", ["category", "subcategory"])
    .searchIndex("search_content", { searchField: "content", filterFields: ["category"] }),

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
    completedDate: v.optional(v.string()),
    notes: v.optional(v.string()),
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
});
