# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-15)

**Core value:** Staff use it daily as the single go-to place for procedures, knowledge, and team communication — replacing scattered Google Drives, binders, and external tools.
**Current focus:** Phase 10 next (Messaging Channels)

## Current Position

Phase: 9 of 11 complete (Suggestion Workflow)
Plan: 3 of 3 in current phase
Status: Phase complete
Last activity: 2026-01-15 — Completed 09-03-PLAN.md (Phase 9 complete)

Progress: █████████░ ~82%

## Performance Metrics

**Velocity:**
- Total plans completed: 27
- Average duration: 16 min
- Total execution time: 7.5 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-design-system | 3/3 | 105 min | 35 min |
| 02-authentication | 3/3 | 75 min | 25 min |
| 03-user-profiles | 3/3 | 75 min | 25 min |
| 04-wiki-search | 3/3 | 60 min | 20 min |
| 05-versioning | 3/3 | 45 min | 15 min |
| 06-personal-workspace | 3/3 | 30 min | 10 min |
| 07-folder-sharing | 3/3 | 22 min | 7 min |
| 08-comments-system | 3/3 | 12 min | 4 min |
| 09-suggestion-workflow | 3/3 | 16 min | 5 min |

**Recent Trend:**
- Last 5 plans: 2 min, 5 min, 2 min, 6 min, 8 min
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
- **Mention storage**: @[userId] format in content for database stability, resolved at render
- **Mention batch lookup**: Top-level comment queries all mentions, passes map to children
- **Suggestion state machine**: draft -> pending -> approved|rejected with string status field
- **Suggestion content**: Full document content stored (not diffs) for simpler comparison
- **Suggestion permissions**: Authors control drafts, managers/admins review pending
- **E2E verification**: Playwright for checkpoint tasks with screenshot capture

### Deferred Issues

None yet.

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-01-15
Stopped at: Completed Phase 9 (Suggestion Workflow)
Resume file: None
Next action: Plan Phase 10 (Messaging Channels)
