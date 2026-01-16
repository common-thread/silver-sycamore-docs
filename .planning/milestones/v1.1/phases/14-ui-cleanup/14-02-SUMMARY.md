---
phase: 14-ui-cleanup
plan: 02
subsystem: ui
tags: [react, design-tokens, brand-compliance, document-viewer, catalog]

# Dependency graph
requires:
  - phase: 13-brand-foundation
    provides: Design tokens, brand style guide, color palette
provides:
  - Clean document viewer without technical indicators
  - Simplified catalog table (Document + Subcategory only)
  - Brand-compliant placeholder styling
affects: [15-custom-dropdowns, ui-components]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pending conversion pattern: Simple message for unconverted documents"
    - "Brand token usage: CSS custom properties for all colors"

key-files:
  created: []
  modified:
    - app/src/components/DocumentViewer.tsx
    - app/src/app/catalog/page.tsx

key-decisions:
  - "Removed Type column entirely rather than hiding - not useful for staff"
  - "Used 'pending conversion' message instead of download prompts"

patterns-established:
  - "Binary file placeholder: Simple centered message with brand tokens"
  - "Table simplification: Only show columns that add value"

issues-created: []

# Metrics
duration: 5min
completed: 2026-01-16
---

# Phase 14 Plan 02: Clean Document Viewer and Catalog Summary

**Removed technical indicators (emojis, file types, source paths) from document UI, replacing with brand-compliant clean styling**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-16T23:08:00Z
- **Completed:** 2026-01-16T23:13:00Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments

- Cleaned DocumentViewer binary file placeholder - removed emojis, typeLabels, sourceFile display
- Replaced verbose placeholder with clean "This document is pending conversion." message
- Removed Type column from catalog page - staff don't need to see .md/.pdf/.docx
- Applied brand tokens throughout (--color-paper-warm, --color-ink-muted, --color-accent)

## Task Commits

Each task was committed atomically:

1. **Task 1: Clean DocumentViewer binary file placeholder** - `1eea54b` (feat)
2. **Task 2: Remove Type column from catalog page** - `c554d3d` (feat)
3. **Task 3: Verify build and brand compliance** - verified in this session (no code changes)

**Plan metadata:** (this commit)

## Files Created/Modified

- `app/src/components/DocumentViewer.tsx` - Removed emoji display, typeLabels object, sourceFile paragraph; replaced with clean brand-compliant placeholder card
- `app/src/app/catalog/page.tsx` - Removed Type column header and data cell; table now shows only Document and Subcategory

## Decisions Made

1. **Removed Type column entirely** - Staff browsing documents don't benefit from seeing "md" vs "docx". The content matters, not the source format.
2. **"Pending conversion" message** - Rather than offering download links for unconverted files (which implies they're usable), show a clear message that conversion is pending. This sets correct expectations.
3. **No download prompts for binary files** - Per 14-CONTEXT.md, unconverted content is a gap to fix, not a feature to surface.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all verifications passed on first attempt.

## Next Phase Readiness

- Phase 14 complete (both plans finished)
- Ready for Phase 15: Custom Dropdowns
- No blockers or concerns

---
*Phase: 14-ui-cleanup*
*Completed: 2026-01-16*
