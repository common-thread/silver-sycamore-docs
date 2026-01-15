# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-14)

**Core value:** Staff use it daily as the single go-to place for procedures, knowledge, and team communication — replacing scattered Google Drives, binders, and external tools.
**Current focus:** Phase 7 — Folder Sharing

## Current Position

Phase: 7 of 11 (Folder Sharing)
Plan: 2 of 3 in current phase
Status: In progress
Last activity: 2026-01-15 — Completed 07-02-PLAN.md

Progress: ███████░░░ ~60%

## Performance Metrics

**Velocity:**
- Total plans completed: 20
- Average duration: 20 min
- Total execution time: 6.7 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-design-system | 3/3 | 105 min | 35 min |
| 02-authentication | 3/3 | 75 min | 25 min |
| 03-user-profiles | 3/3 | 75 min | 25 min |
| 04-wiki-search | 3/3 | 60 min | 20 min |
| 05-versioning | 3/3 | 45 min | 15 min |
| 06-personal-workspace | 3/3 | 30 min | 10 min |
| 07-folder-sharing | 2/3 | 14 min | 7 min |

**Recent Trend:**
- Last 5 plans: 10 min, 10 min, 12 min, 2 min
- Trend: accelerating

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- **Typography**: Playfair Display (display) + DM Sans (body) — editorial character, high legibility
- **Color palette**: Ink/paper/bronze system — archival aesthetic, warm not stark
- **Accent color**: #8B7355 bronze — evokes museum labels, aged brass
- **Authentication**: Convex Auth with Password provider — simple for internal staff
- **Session duration**: 30-day cookies — convenient for daily use
- **Route protection**: All routes protected except /signin
- **Role hierarchy**: staff → manager → admin with clear permission matrix
- **Profile storage**: Separate userProfiles table linked to auth users
- **Auto-profile**: Created via auth callback on signup with "staff" default
- **Search**: Debounced input (300ms), max 10 results, keyboard navigation
- **Categories**: Database-driven with fallback to hardcoded data
- **Breadcrumbs**: Chevron separators, document title display
- **Versioning**: Auto-snapshot on every update, full content stored
- **Version restore**: Managers/admins only, creates new version with old content
- **Personal workspace**: Separate tables for user documents and folders
- **Document copy**: Wiki docs can be copied to workspace with source tracking
- **Auto-save**: Editor debounces 1 second, shows save status
- **Sharing permissions**: view/comment/edit as strings for extensibility
- **Share resolution**: Highest permission wins when user has multiple access paths
- **Group management**: Only owners can modify groups, members can view

### Deferred Issues

None yet.

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-01-15
Stopped at: Completed 07-02-PLAN.md
Resume file: None
Next action: Continue with 07-03-PLAN.md (Shared folder views)
