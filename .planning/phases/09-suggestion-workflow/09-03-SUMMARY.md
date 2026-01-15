---
phase: 09-suggestion-workflow
plan: 03
subsystem: ui
tags: [react, review, diff, promotion, permissions, e2e]

# Dependency graph
requires:
  - phase: 09-suggestion-workflow
    provides: suggestions API with state machine and CRUD operations
  - phase: 05-versioning
    provides: VersionCompare pattern for diff display
provides:
  - SuggestionDiff component for comparing changes
  - SuggestionReview component with approve/reject flow
  - Review dashboard at /suggestions/review
  - Promotion mutation applying approved changes
affects: []

# Tech tracking
tech-stack:
  added:
    - playwright (E2E testing)
  patterns:
    - Line-by-line diff display with color coding
    - Manager/admin gated review pages
    - Promotion workflow with version attribution

key-files:
  created:
    - app/src/components/SuggestionDiff.tsx
    - app/src/components/SuggestionReview.tsx
    - app/src/app/suggestions/review/page.tsx
    - app/src/app/suggestions/review/[id]/page.tsx
    - app/e2e/suggestion-workflow.spec.ts
  modified:
    - app/convex/suggestions.ts
    - app/convex/schema.ts

key-decisions:
  - "Diff display: Line-by-line with green additions, red deletions, strikethrough"
  - "Review notes: Required for rejection, optional for approval"
  - "Promotion: Uses existing document update flow for automatic versioning"
  - "E2E verification: Playwright for checkpoint tasks with screenshot capture"

patterns-established:
  - "Review gating: Check role in component before rendering actions"
  - "Promotion attribution: changeNote includes original author name"
  - "E2E checkpoints: Playwright tests capture screenshots for verification"

issues-created: []

# Metrics
duration: 8min
completed: 2026-01-15
---

# Phase 9 Plan 3: Review and Promotion Workflow Summary

**Complete review workflow enabling managers/admins to approve, reject, and promote suggestions to official documents with E2E verification**

## Performance

- **Duration:** 8 min
- **Started:** 2026-01-15T18:05:00Z
- **Completed:** 2026-01-15T18:13:00Z
- **Tasks:** 3 (2 implementation + 1 checkpoint)
- **Files modified:** 7

## Accomplishments

- Created SuggestionDiff component showing line-by-line changes with color coding
- Created SuggestionReview component with full approve/reject/promote flow
- Built /suggestions/review dashboard listing pending suggestions
- Built /suggestions/review/[id] detail page with diff view and actions
- Added promote mutation applying approved changes to documents
- Added appliedAt field to suggestions schema for tracking promotions
- Created Playwright E2E test covering full suggestion workflow
- Captured verification screenshots in .planning/verification/09-03/

## Task Commits

Each task was committed atomically:

1. **Task 1: Create SuggestionDiff and SuggestionReview components** - `614e9c6` (feat)
2. **Task 2: Create review pages and promotion mutation** - `b45f100` (feat)
3. **Task 3: E2E verification checkpoint** - Playwright test created

## Files Created/Modified

- `app/src/components/SuggestionDiff.tsx` - Line-by-line diff with green/red coloring
- `app/src/components/SuggestionReview.tsx` - Full review UI with approve/reject/promote
- `app/src/app/suggestions/review/page.tsx` - Review dashboard (managers/admins only)
- `app/src/app/suggestions/review/[id]/page.tsx` - Review detail with breadcrumbs
- `app/convex/suggestions.ts` - Added promote mutation
- `app/convex/schema.ts` - Added appliedAt field to suggestions
- `app/e2e/suggestion-workflow.spec.ts` - E2E test for full workflow

## Decisions Made

- **Diff display**: Line-by-line comparison with additions in green, deletions in red with strikethrough
- **Review notes**: Required when rejecting (must explain why), optional for approvals
- **Promotion flow**: Uses existing document.update which auto-creates version snapshot
- **E2E verification**: Playwright captures screenshots at key workflow steps

## Deviations from Plan

- Added Playwright E2E test infrastructure for checkpoint verification (enhancement)
- Screenshots captured to .planning/verification/09-03/ for audit trail

## Issues Encountered

None

## Phase Completion

Phase 9 (Suggestion Workflow) is now complete with all 3 plans executed:
- 09-01: Suggestion schema and API (state machine, CRUD)
- 09-02: Create and manage suggestions UI (forms, dashboard)
- 09-03: Review and promotion workflow (diff, approve, promote)

Full workflow verified: create suggestion -> submit -> review -> approve -> promote to document

---
*Phase: 09-suggestion-workflow*
*Completed: 2026-01-15*
