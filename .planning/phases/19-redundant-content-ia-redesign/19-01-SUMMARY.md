---
phase: 19-redundant-content-ia-redesign
plan: 01
subsystem: database, import
tags: [convex, schema, content-types, import-script, typescript]

# Dependency graph
requires:
  - phase: 18-content-audit-type-decisions
    provides: CONTENT-TRACKER.md with 70 document classifications and redundancy analysis
provides:
  - contentType field in documents schema with union type
  - by_contentType index for efficient filtering
  - contentTypeMapping.ts utility with all document classifications
  - REDUNDANT_FORMS set with 13 items to exclude
  - Import script that assigns content types and excludes redundant forms
affects: [19-02 (navigation redesign), 20 (semantic rendering), catalog filtering]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Content type union type pattern for purpose-based classification
    - Lookup key format (category/subcategory/filename) for document mapping

key-files:
  created:
    - app/scripts/lib/contentTypeMapping.ts
  modified:
    - app/convex/schema.ts
    - app/convex/documents.ts
    - app/scripts/import-documents.ts

key-decisions:
  - "13 redundant forms identified for exclusion (form builder is authoritative)"
  - "Content types match CONTENT-TRACKER.md classifications: 10 procedure, 36 reference, 14 form, 5 checklist, 5 guide"
  - "57 documents will be imported after excluding 13 redundant items"

patterns-established:
  - "Content type classification: procedure (step-by-step), reference (lookup data), form (data collection), checklist (todo items), guide (navigation/prose)"

issues-created: []

# Metrics
duration: 12min
completed: 2026-01-17
---

# Phase 19 Plan 01: Content Type Schema and Import Summary

**Documents schema extended with contentType union field and import script updated to classify documents and exclude 13 redundant forms based on Phase 18 content audit**

## Performance

- **Duration:** 12 min
- **Started:** 2026-01-17T17:59:00Z
- **Completed:** 2026-01-17T18:11:00Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Documents table schema now includes contentType field with union type (procedure, reference, form, checklist, guide)
- Added by_contentType index for efficient filtering by purpose
- Created contentTypeMapping.ts utility with all 70 documents mapped to their types
- Import script now assigns content types and excludes 13 redundant form documents
- 57 documents will be imported (70 total - 13 redundant)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add contentType field to documents schema** - `efd77ae` (feat)
2. **Task 2: Create contentType mapping utility** - `86bae64` (feat)
3. **Task 3: Update import script to assign contentTypes and exclude redundant forms** - `271d973` (feat)

## Files Created/Modified

- `app/convex/schema.ts` - Added contentType union field, formId field, and by_contentType index
- `app/scripts/lib/contentTypeMapping.ts` - New utility with CONTENT_TYPE_MAP, REDUNDANT_FORMS, getContentType()
- `app/convex/documents.ts` - Updated create mutation to accept contentType and formId
- `app/scripts/import-documents.ts` - Added redundancy check, content type assignment, and statistics

## Decisions Made

- **13 redundant items identified:** booking-form-wedding, booking-form-corporate, booking-form-shower, hr-forms, music-list, decor-appointment, final-appointment, vendor-setup, tasting-form, bridal-planning-2024, micro-wedding-planning, reset-checklist (hall), reset-checklist (saloon)
- **4 planning checklists kept as checklists:** checklist-1-3-months, checklist-4-6-months, checklist-7-8-months, checklist-9-12-months (these are guidance documents, not data collection forms)
- **Content type counts from actual table analysis:** 10 procedure, 36 reference, 14 form, 5 checklist, 5 guide (note: CONTENT-TRACKER summary said 32 references/18 forms but actual tables show 36/14)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - Convex schema compiled successfully, TypeScript types verified.

## Next Phase Readiness

- Schema supports content-type based filtering via by_contentType index
- Import script ready to run (will import 57 non-redundant documents with contentType assigned)
- Ready for 19-02 to implement purpose-based navigation using contentType field
- Semantic rendering (Phase 20) can use contentType to select appropriate renderer

---
*Phase: 19-redundant-content-ia-redesign*
*Plan: 01*
*Completed: 2026-01-17*
