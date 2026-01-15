---
phase: 08-comments-system
plan: 01
subsystem: database, api
tags: [convex, comments, threading, crud]

requires:
  - phase: 03-user-profiles
    provides: userProfiles table for author display info
  - phase: 06-personal-workspace
    provides: personalDocuments table for comment targets
provides:
  - Comments schema with threading support
  - Full CRUD API for comments on wiki and personal docs
  - Cascade delete for comment threads
affects: [08-02, 08-03] # Comment UI and @mentions will need these

tech-stack:
  added: []
  patterns:
    - "Cascade delete for nested comments"
    - "Author info enrichment on queries"

key-files:
  created:
    - app/convex/comments.ts
  modified:
    - app/convex/schema.ts

key-decisions:
  - "Comments support both wiki documents and personal documents via optional fields"
  - "Threading via parentId (null = top-level, set = reply)"
  - "Cascade delete removes all child replies when parent deleted"

issues-created: []

duration: 2min
completed: 2026-01-15
---

# Phase 8 Plan 01: Comments Schema and API Summary

**Threaded comments schema with full CRUD API supporting wiki and personal documents**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-15T08:00:14Z
- **Completed:** 2026-01-15T08:02:19Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Comments table with all required fields and indexes for efficient querying
- Full CRUD API with getByDocument, getByPersonalDocument, getThread queries
- Author-only edit, author/admin/manager delete with cascade for replies

## Task Commits

Each task was committed atomically:

1. **Task 1: Add comments table to schema** - `c6c3019` (feat)
2. **Task 2: Create comment CRUD operations** - `0c76ab8` (feat)

## Files Created/Modified

- `app/convex/schema.ts` - Added comments table with indexes
- `app/convex/comments.ts` - Full CRUD operations for comments

## Decisions Made

- **Optional document fields:** Comments have both documentId and personalDocumentId as optional, with validation requiring exactly one. This allows a single comments table to serve both wiki and personal docs.
- **Cascade delete:** When deleting a parent comment, all nested replies are recursively deleted first. This keeps data clean and prevents orphaned comments.
- **Author info enrichment:** All queries join userProfiles to return displayName and avatarUrl with each comment, avoiding N+1 queries in the UI.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Phase Readiness

- Comments backend complete, ready for 08-02 (Threaded comment UI)
- API provides all data needed for displaying threads with author info

---
*Phase: 08-comments-system*
*Completed: 2026-01-15*
