---
phase: 12-content-pipeline
plan: 01
subsystem: database
tags: [content-seeding, markdown-parsing, metadata-extraction]

# Dependency graph
requires:
  - phase: 11
    provides: import-documents script infrastructure
provides:
  - index.md parser utility for authoritative metadata
  - deterministic title/description extraction
  - nested subcategory path handling
affects: [content-pipeline, future-imports]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Parse index.md tables for authoritative metadata"
    - "Build lookup keys from category/relativePath/filename"

key-files:
  created:
    - app/scripts/lib/indexParser.ts
  modified:
    - app/scripts/import-documents.ts

key-decisions:
  - "Use index.md as source of truth for document metadata"
  - "Fall back to heuristics for documents not listed in index.md"
  - "Track full relative path for nested subcategory matching"

patterns-established:
  - "Index.md parser: extract title/description from markdown tables and lists"
  - "Lookup key format: category/relativePath/filename-without-ext"

issues-created: []

# Metrics
duration: 12min
completed: 2026-01-15
---

# Phase 12 Plan 01: Index.md Parser Summary

**Deterministic content seeding via index.md metadata parsing, replacing filename heuristics with authoritative source of truth**

## Performance

- **Duration:** 12 min
- **Started:** 2026-01-15T19:45:00Z
- **Completed:** 2026-01-15T19:57:00Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments
- Parser utility extracts document metadata from all 5 index.md files (64 entries)
- Import script uses parsed metadata as primary source with heuristic fallback
- Nested subcategories handled correctly (e.g., layouts/hall, layouts/town)
- 62 of 65 documents now use authoritative metadata (was 0 before this change)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create index.md parser utility** - `4c10507` (feat)
2. **Task 2: Integrate parser into import script** - `40898ce` (feat)
3. **Task 3: Verify import accuracy (fix nested paths)** - `74cf071` (fix)

## Files Created/Modified
- `app/scripts/lib/indexParser.ts` - New parser utility for extracting metadata from index.md files
- `app/scripts/import-documents.ts` - Updated to use parsed metadata with heuristic fallback

## Decisions Made
- **Lookup key format:** `category/relativePath/filename-without-ext` enables matching nested subcategories
- **Subcategory storage:** Store immediate parent directory as subcategory in Convex (e.g., "hall" not "layouts/hall")
- **Heuristic fallback:** Keep existing titleFromFilename and extractDescription functions for documents not in index.md

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Nested subcategory path matching**
- **Found during:** Task 3 (Import verification)
- **Issue:** Room Layouts documents used heuristics because path was `clients/hall/head-table` but index.md had `clients/layouts/hall/head-table`
- **Fix:** Track full relative path from category root, build lookup key using full path
- **Files modified:** app/scripts/import-documents.ts
- **Verification:** Import now shows `[index.md]` for all layout documents
- **Committed in:** 74cf071

---

**Total deviations:** 1 auto-fixed (bug in path handling), 0 deferred
**Impact on plan:** Essential fix for correct index.md matching. No scope creep.

## Issues Encountered
None - all planned work completed successfully.

## Next Phase Readiness
- Content pipeline foundation ready for next plan
- Import script produces deterministic, authoritative metadata
- 3 documents still use heuristics (not in index.md): off-premise-menu.docx, tasting-form.pdf, recipe-app/README.md

---
*Phase: 12-content-pipeline*
*Completed: 2026-01-15*
