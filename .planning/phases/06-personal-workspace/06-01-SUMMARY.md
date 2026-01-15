---
phase: 06-personal-workspace
plan: 01
completed: true
---

# Plan 06-01 Summary: Personal Folder Schema and Storage

## What Was Built

### Schema Additions (convex/schema.ts)

**personalFolders table:**
```typescript
personalFolders: defineTable({
  ownerId: v.id("users"),
  name: v.string(),
  parentId: v.optional(v.id("personalFolders")), // Nested folders
  createdAt: v.number(),
})
  .index("by_owner", ["ownerId"])
  .index("by_owner_parent", ["ownerId", "parentId"]),
```

**personalDocuments table:**
```typescript
personalDocuments: defineTable({
  ownerId: v.id("users"),
  title: v.string(),
  content: v.string(),
  folderId: v.optional(v.id("personalFolders")),
  sourceDocumentId: v.optional(v.id("documents")), // If copied from wiki
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_owner", ["ownerId"])
  .index("by_owner_folder", ["ownerId", "folderId"]),
```

### Personal Documents API (convex/personalDocuments.ts)

Queries:
- `list` - Get documents at root or in specific folder
- `listAll` - Get all user's documents
- `get` - Get single document by ID

Mutations:
- `create` - Create new personal document
- `update` - Update title/content
- `remove` - Delete document
- `moveToFolder` - Move document to different folder
- `copyFromWiki` - Copy wiki document to personal workspace

### Personal Folders API (convex/personalFolders.ts)

Queries:
- `list` - Get folders at root or in specific parent
- `listAll` - Get all user's folders
- `get` - Get single folder by ID
- `getPath` - Get folder ancestors (for breadcrumbs)

Mutations:
- `create` - Create new folder
- `rename` - Rename folder
- `remove` - Delete folder (must be empty)
- `move` - Move folder to different parent

## Security Model

All queries and mutations verify:
1. User is authenticated
2. User owns the resource (folder or document)

Folder operations prevent:
- Moving folder into itself
- Moving folder into its own descendant
- Deleting non-empty folders

## Verification

- [x] Schema updated with both tables
- [x] personalDocuments.ts created with all operations
- [x] personalFolders.ts created with all operations
- [x] TypeScript compiles without errors
