---
phase: 27-wiki-content-transposition
plan: 04
subsystem: docs
tags: [markdown, frontmatter, layouts, timelines, reference]

# Dependency graph
requires:
  - phase: 27-01
    provides: index files removed, docs directory cleaned
provides:
  - 18 client reference documents transposed with frontmatter
  - Timeline documents properly formatted
  - Layout documents (hall, saloon, town, tea-room, open-house) with frontmatter
  - Shoe game questions formatted as categorized bullet list
affects: [27-08, navigation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - reference contentType for lookup information
    - tables for structured layout data
    - categorized bullet lists for question banks

key-files:
  created: []
  modified:
    - docs/clients/day-of/timeline-first-look.md
    - docs/clients/day-of/timeline-evening-6-11pm.md
    - docs/clients/day-of/timeline-first-dance-after-dinner.md
    - docs/clients/day-of/timeline-micro-wedding.md
    - docs/clients/day-of/shoe-game-questions.md
    - docs/clients/layouts/hall/head-table.md
    - docs/clients/layouts/hall/rounds-120.md
    - docs/clients/layouts/saloon/rounds-20.md
    - docs/clients/layouts/town/head-table.md
    - docs/clients/layouts/town/round-tables.md
    - docs/clients/layouts/town/aubrey-75.md
    - docs/clients/layouts/town/aubrey-100.md
    - docs/clients/layouts/tea-room/standard.md
    - docs/clients/layouts/tea-room/valentines-day.md
    - docs/clients/layouts/open-house/general.md
    - docs/clients/layouts/open-house/hall.md
    - docs/clients/layouts/open-house/saloon.md
    - docs/clients/layouts/open-house/town.md

key-decisions:
  - "All layout documents use reference contentType with tables for structured data"
  - "Vendor directories preserved in open-house documents as tables"
  - "Shoe game questions organized by category with bullet lists"

patterns-established:
  - "Layout reference pattern: frontmatter + intro + elements table + seating arrangement"
  - "Timeline reference pattern: frontmatter + intro + ceremony/reception tables"
  - "Question bank pattern: categorized bullet lists with descriptive intro"

issues-created: []

# Metrics
duration: ~15min (spread across multiple agents)
completed: 2026-01-19
---

# Plan 04: Client References Summary

**18 client reference documents transposed with frontmatter, including timelines, venue layouts, and shoe game questions**

## Performance

- **Duration:** ~15 min (spread across multiple agent sessions)
- **Started:** 2026-01-19
- **Completed:** 2026-01-19
- **Tasks:** 5
- **Files modified:** 18

## Accomplishments

- 4 timeline documents cleaned up with proper frontmatter and table formatting
- 3 hall/saloon layout documents fixed with layout element tables
- 4 town layout documents transposed with seating arrangement tables
- 6 tea-room and open-house documents formatted with vendor directories preserved
- 1 shoe game questions document organized into 5 categories

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix timeline documents** - `941854c` (docs)
2. **Task 2: Fix hall and saloon layout documents** - `4366320` (docs)
3. **Task 3: Transpose town layout documents** - `c75efb1` (docs)
4. **Task 4: Transpose tea-room and open-house layouts** - `17d78ad` (docs)
5. **Task 5: Transpose shoe-game-questions** - `253a067` (docs)

## Files Modified

### Timeline Documents
- `docs/clients/day-of/timeline-first-look.md` - First look wedding timeline
- `docs/clients/day-of/timeline-evening-6-11pm.md` - Evening event timeline
- `docs/clients/day-of/timeline-first-dance-after-dinner.md` - Post-dinner first dance timeline
- `docs/clients/day-of/timeline-micro-wedding.md` - Micro wedding timeline

### Hall/Saloon Layouts
- `docs/clients/layouts/hall/head-table.md` - Hall head table configuration for 110 guests
- `docs/clients/layouts/hall/rounds-120.md` - Hall round tables for 120 guests
- `docs/clients/layouts/saloon/rounds-20.md` - Saloon round tables for 20 guests

### Town Layouts
- `docs/clients/layouts/town/head-table.md` - Town head table layout
- `docs/clients/layouts/town/round-tables.md` - Town round tables layout
- `docs/clients/layouts/town/aubrey-75.md` - Aubrey 75 guest configuration
- `docs/clients/layouts/town/aubrey-100.md` - Aubrey 100 guest configuration

### Tea Room Layouts
- `docs/clients/layouts/tea-room/standard.md` - Standard tea room configuration
- `docs/clients/layouts/tea-room/valentines-day.md` - Valentine's Day special layout

### Open House Layouts
- `docs/clients/layouts/open-house/general.md` - General open house setup
- `docs/clients/layouts/open-house/hall.md` - Hall open house with vendor directory
- `docs/clients/layouts/open-house/saloon.md` - Saloon open house with vendors
- `docs/clients/layouts/open-house/town.md` - Town open house setup

### Miscellaneous
- `docs/clients/day-of/shoe-game-questions.md` - Question bank for shoe game activity

## Decisions Made

- All layout documents use `contentType: reference` since they are lookup information
- Broken image references (.gif files) replaced with descriptive text tables
- Vendor information preserved as tables in open-house documents
- Shoe game questions grouped into 5 logical categories

## Deviations from Plan

None - plan executed exactly as specified. All files already had proper formatting when executed (completed by previous agent sessions).

## Issues Encountered

None - all transpositions completed successfully.

## Next Phase Readiness

- Client reference documents complete with proper frontmatter
- Layout documents can be navigated via type-based navigation
- Ready for remaining Wave 2 plans (03, 05, 06, 07)

---
*Phase: 27-wiki-content-transposition*
*Plan: 04*
*Completed: 2026-01-19*
