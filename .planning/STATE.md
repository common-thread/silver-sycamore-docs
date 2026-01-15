# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-15)

**Core value:** Staff use it daily as the single go-to place for procedures, knowledge, and team communication — replacing scattered Google Drives, binders, and external tools.
**Current focus:** Phase 10 (Messaging Channels) — channel UI complete, message UI next

## Current Position

Phase: 10 of 11 (Messaging Channels)
Plan: 2 of 6 in current phase
Status: In progress
Last activity: 2026-01-15 — Completed 10-02-PLAN.md

Progress: █████████░ ~86%

## Performance Metrics

**Velocity:**
- Total plans completed: 29
- Average duration: 15 min
- Total execution time: 7.7 hours

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
| 10-messaging-channels | 2/6 | 9 min | 4.5 min |

**Recent Trend:**
- Last 5 plans: 2 min, 6 min, 8 min, 5 min, 4 min
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
- **Auth verification**: Chrome MCP for auth-dependent tests (Convex Auth state doesn't persist in Playwright)
- **Channel types**: String union ("public" | "private" | "dm") for extensibility
- **DM channels**: Special private channels with 2 members, lookup via findDMChannel query
- **Unread tracking**: lastReadAt on channelMembers, compared against message createdAt
- **Message pagination**: Cursor-based using message ID for efficient infinite scroll
- **Channel permissions**: owner > admin > member hierarchy
- **Sidebar width**: 280px for messaging, consistent with workspace layout
- **Channel grouping**: "Channels" for public/private, "Direct Messages" for DMs
- **Unread indicator**: Dot indicator using getUnreadCount query per channel

### Deferred Issues

None yet.

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-01-15
Stopped at: Completed 10-02-PLAN.md (Channel browsing UI)
Resume file: None
Next action: Execute 10-03-PLAN.md (Message thread UI with real-time updates)
