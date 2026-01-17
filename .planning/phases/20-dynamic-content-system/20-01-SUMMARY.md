---
phase: 20-dynamic-content-system
plan: 01
subsystem: database
tags: [convex, schema, dynamic-content, activity-tracking, sharing]

# Dependency graph
requires:
  - phase: 19-redundant-content-ia-redesign
    provides: contentType field on documents, purpose-based navigation
provides:
  - dynamicContentInstances table for tracking personal instances
  - activityLog table for user activity feeds
  - shareLinks table for internal/external document sharing
affects: [phase-20-02, phase-20-03, phase-20-04, activity-dashboard, sharing-workflow]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Union types for status enums
    - Optional fields for anonymous vs authenticated users
    - Denormalized title for display performance
    - Token-based sharing with expiration

key-files:
  created: []
  modified:
    - app/convex/schema.ts

key-decisions:
  - "Three tables: dynamicContentInstances, activityLog, shareLinks"
  - "sessionId field supports anonymous users alongside authenticated userId"
  - "completionData as JSON string for flexible step/form state storage"
  - "Title denormalized in activityLog for display without joins"

patterns-established:
  - "Instance tracking pattern: sourceDocumentId + userId/sessionId + status"
  - "Activity log pattern: type enum + optional references + denormalized context"
  - "Share link pattern: token-based URL with expiration and usage limits"

issues-created: []

# Metrics
duration: 4min
completed: 2026-01-17
---

# Phase 20 Plan 01: Schema Foundation Summary

**Three Convex tables (dynamicContentInstances, activityLog, shareLinks) deployed with indexes for tracking personal content instances, user activity, and document sharing**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-17T14:40:00Z
- **Completed:** 2026-01-17T14:44:00Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Added `dynamicContentInstances` table for tracking personal instances of procedures, checklists, and forms
- Added `activityLog` table for tracking user activity (procedure_started, procedure_completed, checklist_completed, form_submitted, form_received)
- Added `shareLinks` table for internal and external document sharing with token-based URLs
- All tables deployed to Convex with proper indexes for query performance

## Task Commits

Each task was committed atomically:

1. **Task 1: Add dynamicContentInstances table** - `c67cb92` (feat)
2. **Task 2: Add activityLog and shareLinks tables** - `4386938` (feat)

## Files Created/Modified

- `app/convex/schema.ts` - Added three new tables (dynamicContentInstances, activityLog, shareLinks) with indexes

## Decisions Made

- **sessionId for anonymous users:** Supports both authenticated users (userId) and anonymous visitors (sessionId) for public forms/procedures
- **completionData as JSON string:** Flexible storage for step states, form values, checkbox states without schema changes
- **Denormalized title in activityLog:** Avoids joins when displaying activity feed, title copied at event time
- **Token-based sharing:** shareToken enables URL-based access without exposing document IDs

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Phase Readiness

- Schema foundation complete, ready for content type renderers in 20-02
- Tables ready for instance creation, activity logging, and share link generation
- All indexes deployed for efficient queries by user, source document, session, status, token

---
*Phase: 20-dynamic-content-system*
*Completed: 2026-01-17*
