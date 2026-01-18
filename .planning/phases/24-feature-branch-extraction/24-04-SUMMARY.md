---
phase: 24-feature-branch-extraction
plan: 04
subsystem: ui
tags: [forms, comments, extraction, cleanup]

requires:
  - phase: 24-01
    provides: feature/full-v1 branch preserves all features

provides:
  - Forms builder routes removed from main branch
  - Form builder components removed (5 files)
  - Comment system removed (3 files)
  - Document pages updated with connector comments

affects: [navigation-cleanup, build-verification]

tech-stack:
  added: []
  patterns: [connector-comments]

key-files:
  created: []
  modified:
    - app/src/app/layout.tsx
    - app/src/app/[category]/[slug]/page.tsx
    - app/src/app/workspace/page.tsx
    - app/src/components/Header.tsx

key-decisions:
  - "Keep FormRenderer.tsx for share link functionality"
  - "Use connector comments for restoration guidance"

patterns-established:
  - "CONNECTOR comment pattern: // CONNECTOR: [feature] - restore from feature/full-v1"

issues-created: []

duration: 12min
completed: 2026-01-18
---

# Phase 24 Plan 04: Forms and Comments Removal Summary

**Removed forms builder UI (5 components) and comment system (3 components) with connector comments for restoration**

## Performance

- **Duration:** 12 min
- **Started:** 2026-01-18T15:30:00Z
- **Completed:** 2026-01-18T15:42:00Z
- **Tasks:** 3/3
- **Files modified:** 12

## Accomplishments

- Deleted entire `/forms` route directory (5 route files)
- Removed 5 form builder components (FormBuilder, FieldEditor, DraggableFieldCard, FormShareDialog, SubmissionViewer)
- Removed 3 comment components (CommentSection, CommentItem, MentionInput)
- Updated document detail page and workspace page with connector comments
- Build passes with all removed features

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove forms builder routes** - `5d02994` (feat)
2. **Task 2: Remove form builder components** - `dbe8c89` (feat)
3. **Task 3: Remove comment system** - `bdf81d2` (feat)

## Files Created/Modified

**Deleted:**
- `app/src/app/forms/page.tsx` - Form listing route
- `app/src/app/forms/new/page.tsx` - Create form route
- `app/src/app/forms/[formId]/edit/page.tsx` - Edit form route
- `app/src/app/forms/[formId]/submissions/page.tsx` - Form submissions route
- `app/src/app/forms/submissions/page.tsx` - All submissions route
- `app/src/components/FormBuilder.tsx` - Form creation UI
- `app/src/components/FieldEditor.tsx` - Field configuration
- `app/src/components/DraggableFieldCard.tsx` - Drag-drop field arrangement
- `app/src/components/FormShareDialog.tsx` - Form sharing dialog
- `app/src/components/SubmissionViewer.tsx` - Submission viewer
- `app/src/components/CommentSection.tsx` - Threaded comments
- `app/src/components/CommentItem.tsx` - Individual comment display
- `app/src/components/MentionInput.tsx` - @mention support

**Modified:**
- `app/src/app/layout.tsx` - Added connector comment for forms routes
- `app/src/app/[category]/[slug]/page.tsx` - Removed CommentSection, added connector
- `app/src/app/workspace/page.tsx` - Removed ActivitySidebar reference, added connector

## Decisions Made

- **Keep FormRenderer.tsx:** Preserved for share link functionality (used by `/f/[formId]` and `/share/[token]` routes)
- **Connector comment pattern:** Using `// CONNECTOR: [feature] - restore from feature/full-v1` to mark restoration points

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed Header.tsx import errors**
- **Found during:** Task 3 (Comment system removal - build verification)
- **Issue:** Header.tsx still imported NotificationBell (removed in Plan 02) and had nav links to /messages, /forms, /activity routes
- **Fix:** Removed NotificationBell import, removed nav items for removed routes, added connector comments
- **Files modified:** app/src/components/Header.tsx
- **Verification:** Build passes
- **Committed in:** dbe8c89 (part of Task 2 commit)

**2. [Rule 3 - Blocking] Fixed workspace page ActivitySidebar import**
- **Found during:** Task 3 (Comment system removal - build verification)
- **Issue:** Workspace page imported ActivitySidebar (removed in Plan 03)
- **Fix:** Removed import and component usage, added connector comment
- **Files modified:** app/src/app/workspace/page.tsx
- **Verification:** Build passes
- **Committed in:** bdf81d2 (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking), 0 deferred
**Impact on plan:** Both fixes necessary for build to pass. Cross-dependencies from parallel plan execution.

## Issues Encountered

None - all issues were handled via deviation rules.

## Next Phase Readiness

- Forms and comments fully extracted from main branch
- Build passes with clean output
- Ready for Plan 05 (navigation cleanup) and Plan 06 (final verification)

---
*Phase: 24-feature-branch-extraction*
*Completed: 2026-01-18*
