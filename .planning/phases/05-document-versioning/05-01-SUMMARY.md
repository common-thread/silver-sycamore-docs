---
phase: 05-document-versioning
plan: 01
completed: true
---

# Plan 05-01 Summary: Version Schema and Storage

## What Was Built

### Schema Changes (convex/schema.ts)

**documents table** - Added:
- `version` field (optional number) - tracks current version number

**documentVersions table** - New:
```typescript
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
  .index("by_document_version", ["documentId", "version"])
```

### Version Queries (convex/versions.ts)
- `listByDocument` - Get all versions for a document (newest first)
- `getVersion` - Get specific version by documentId and version number
- `getLatestVersionNumber` - Get highest version number
- `createVersionSnapshot` - Internal: create new version entry
- `getVersionCount` - Count total versions for document

### Document Updates (convex/documents.ts)
- `create` mutation now sets `version: 1`
- `update` mutation now:
  1. Snapshots current state before updating
  2. Tracks who made the edit (editedBy, editedByName)
  3. Accepts optional `changeNote` for edit description
  4. Increments version number

## How Versioning Works
1. When document is created → version = 1
2. When document is updated:
   - Current state saved to documentVersions table
   - New content applied to document
   - Version number incremented
3. All history preserved indefinitely

## Verification
- [x] documentVersions table in schema
- [x] versions.ts with queries
- [x] Document update creates version
- [x] Convex dev syncs

## Next
Plan 05-02: Version history UI
