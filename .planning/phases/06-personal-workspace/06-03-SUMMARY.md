---
phase: 06-personal-workspace
plan: 03
completed: true
---

# Plan 06-03 Summary: Document Duplication

## What Was Built

### Copy Mutation (convex/personalDocuments.ts)
Already implemented in Plan 06-01:
```typescript
copyFromWiki: mutation({
  args: {
    documentId: v.id("documents"),
    folderId: v.optional(v.id("personalFolders")),
  },
  // Creates personal copy with sourceDocumentId reference
})
```

### FolderPicker Component (src/components/FolderPicker.tsx)
- Modal dialog with backdrop
- "Workspace Root" option at top
- Hierarchical folder tree with indent levels
- Selected folder highlighting
- Cancel and "Copy Here" buttons
- Empty state when no folders exist

### Copy to Workspace Button (src/app/[category]/[slug]/page.tsx)
- Added next to VersionBadge in document header
- Only visible for authenticated users
- Opens FolderPicker on click
- Shows "Copying..." state during operation
- Redirects to workspace after successful copy

### Source Document Link (from Plan 06-02)
Already implemented in personal document page:
- Shows "Copied from: [Title]" with link to original
- Shows "Original removed" if source deleted

### Copy Indicator (from Plan 06-02)
Already implemented in PersonalDocList:
- "from wiki" badge on copied documents

## User Flow

1. User views wiki document
2. Clicks "Copy to Workspace" button
3. FolderPicker modal opens
4. User selects destination (root or folder)
5. Clicks "Copy Here"
6. Document copied, user redirected to workspace editor
7. Source link shown in personal document

## Documents API Addition

Added `byId` query to convex/documents.ts:
```typescript
export const byId = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
```

## Verification

- [x] FolderPicker component created
- [x] Copy button shows for authenticated users
- [x] Folder selection works
- [x] Copy creates document with source reference
- [x] Redirects to workspace after copy
- [x] TypeScript compiles

## Phase 06 Complete

All three plans executed:
1. **06-01**: Personal folder schema and storage
2. **06-02**: Personal workspace UI
3. **06-03**: Document duplication

Personal workspace is now complete:
- Users can create personal folders
- Users can create personal documents
- Users can copy wiki documents to workspace
- Auto-save with debounce in editor
- Source tracking for copied documents
