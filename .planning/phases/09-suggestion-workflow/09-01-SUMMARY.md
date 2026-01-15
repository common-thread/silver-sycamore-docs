---
phase: 09-suggestion-workflow
plan: 01
subsystem: api
tags: [convex, suggestions, state-machine, workflow, permissions]

# Dependency graph
requires:
  - phase: 05-versioning
    provides: documentVersions pattern with content snapshots
  - phase: 08-comments
    provides: author enrichment pattern for user info
provides:
  - suggestions table with state machine (draft/pending/approved/rejected)
  - full CRUD API for suggestion management
  - permission checks for author/reviewer roles
affects: [09-02, 09-03]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - state machine enforcement in mutations
    - author enrichment helper for user info
    - manager/admin permission checks for review actions

key-files:
  created:
    - app/convex/suggestions.ts
  modified:
    - app/convex/schema.ts

key-decisions:
  - "State machine as string field: 'draft' | 'pending' | 'approved' | 'rejected' for simplicity"
  - "Full content storage not diffs: easier comparison and restoration"
  - "Permission model: authors control draft lifecycle, managers/admins review"

patterns-established:
  - "PR-style workflow: draft -> submit -> review -> approve/reject"
  - "Author enrichment helper for consistent user info display"

issues-created: []

# Metrics
duration: 2min
completed: 2026-01-15
---

# Phase 9 Plan 1: Suggestion Schema and API Summary

**PR-style suggestion workflow with state machine enforcement and role-based permissions for document change proposals**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-15T17:51:11Z
- **Completed:** 2026-01-15T17:53:45Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created suggestions table with state machine (draft/pending/approved/rejected)
- Built full CRUD API with 4 queries and 6 mutations
- Enforced permission model: authors own drafts, managers/admins review
- State transitions validated at mutation level

## Task Commits

Each task was committed atomically:

1. **Task 1: Create suggestions schema** - `5f02c6b` (feat)
2. **Task 2: Create suggestions API** - `52da051` (feat)

## Files Created/Modified

- `app/convex/schema.ts` - Added suggestions table with 10 fields and 4 indexes
- `app/convex/suggestions.ts` - New file with queries (listByDocument, listByAuthor, listPending, getById) and mutations (create, update, submit, approve, reject, deleteSuggestion)

## Decisions Made

- **State machine as string**: Used simple string field for status rather than complex enum, matching existing patterns
- **Full content storage**: Store complete document content in suggestions, not diffs, for simpler comparison
- **Permission hierarchy**: Authors control their own suggestions until submitted, then managers/admins take over for review

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Phase Readiness

- Suggestion schema and API complete, ready for UI in 09-02
- All state transitions work via Convex dashboard testing
- Permission checks verified for author/reviewer separation

---
*Phase: 09-suggestion-workflow*
*Completed: 2026-01-15*
