---
phase: 05-document-versioning
plan: 03
completed: true
---

# Plan 05-03 Summary: Version Comparison and Restore

## What Was Built

### Restore Mutation (convex/versions.ts)
```typescript
export const restoreVersion = mutation({
  args: { documentId, version },
  // Only managers and admins can restore
  // Snapshots current before restoring
  // Applies old version content
  // Returns { success, newVersion }
});
```

### VersionCompare Component (src/components/VersionCompare.tsx)
- Line-by-line diff comparison
- Green highlighting for additions
- Red highlighting with strikethrough for removals
- Title change detection
- Monospace font for code-like display
- Scrollable with max height

### Version Detail Page (/[category]/[slug]/versions/[version])
- Shows version content with metadata
- "View Current" link back to main document
- "Compare to Current" toggle for diff view
- "Restore This Version" button (permission-gated)
- Shows editor name and change note
- "Current" badge if viewing active version

## Permission Model
- **View versions**: All authenticated users
- **Restore versions**: Managers and Admins only

## How Restore Works
1. User clicks "Restore This Version"
2. Confirmation dialog shown
3. Current state saved as new version (with note "Restored from vX")
4. Document updated with old version's content
5. User redirected to current document

## Verification
- [x] Restore mutation works with permission check
- [x] VersionCompare shows diff
- [x] Version detail page works
- [x] History links to versions
- [x] TypeScript compiles

## Phase 05 Complete

All three plans executed:
1. **05-01**: Version schema and storage
2. **05-02**: Version history UI
3. **05-03**: Comparison and restore

Document versioning is now complete:
- Every edit tracked automatically
- Full history viewable
- Diff comparison available
- Restore capability for managers/admins
