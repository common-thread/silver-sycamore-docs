# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-15)

**Core value:** Staff use it daily as the single go-to place for procedures, knowledge, and team communication — replacing scattered Google Drives, binders, and external tools.
**Current focus:** Milestone 1.0 Complete — All 11 phases done

## Current Position

Phase: 11 of 11 (Forms System) — COMPLETE
Plan: 5 of 5 in current phase
Status: Complete
Last activity: 2026-01-16 — Completed 11-05-PLAN.md (Form Submissions)

Progress: ██████████ 100%

## Performance Metrics

**Velocity:**
- Total plans completed: 37
- Average duration: 14 min
- Total execution time: 8h 20min

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
| 10-messaging-channels | 6/6 | 30 min | 5 min |
| 11-forms-system | 5/5 | 24 min | 5 min |

**Recent Trend:**
- Last 5 plans: 4 min, 4 min, 4 min, 4 min, 8 min
- Trend: steady acceleration

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
- **Mention batch lookup**: Top-level component queries all mentions, passes map to children
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
- **Message date grouping**: Dividers showing "Today", "Yesterday", or "Jan 15" format
- **Message auto-scroll**: Scroll to bottom on new messages, not on initial page load
- **Enter-to-send**: Enter sends message, Shift+Enter for newline, dropdown blocks send
- **DM naming**: Empty string channel name, UI shows partner's displayName
- **DM idempotency**: findOrCreateDM returns existing channel or creates new
- **DM header**: Shows partner avatar/name, hides member count and settings
- **E2E auth strategy**: Test user seeding + Playwright storageState — real auth flow, cookies persisted between tests
- **Notification creation**: Inline in sendMessage mutation for atomic behavior
- **Notification badge**: Count for 1-9, "9+" for overflow, hidden when 0
- **E2E test modes**: Static verification (no credentials) vs interactive (with Clerk keys)
- **Form ownership**: Forms have ownerId, only owners can update/publish/delete
- **Public form submission**: submitResponse mutation requires no auth for external respondents
- **Form field storage**: Fields stored as JSON string, validated at parse time with parseFormFields helper
- **Field editor as modal**: Consistent with CreateChannelDialog pattern for focused editing
- **Auto-generate field name**: Slugify from label (lowercase, underscore-separated) reduces manual input
- **Inline SVG icons**: Use simple inline SVG components instead of lucide-react to avoid adding dependencies
- **Submission state machine**: idle/submitting/success/error pattern for clear flow management

### Deferred Issues

- **Custom dropdowns needed**: Replace native HTML `<select>` elements with custom-built dropdown components. User wants full design control — no system/OS styling anywhere in the UI. Affects: FormBuilder field type selector, category selector, any other dropdowns.

### Pending Todos

None yet.

### Blockers/Concerns

- **[RESOLVED] Playwright auth persistence**: Convex Auth state didn't persist in Playwright browser context. Fixed with test user seeding + storageState approach — real auth flow runs once, cookies saved and reused.

## Session Continuity

Last session: 2026-01-16
Stopped at: Completed 11-05-PLAN.md (Form Submissions)
Resume file: None
Next action: Milestone 1.0 complete. Consider verification or next milestone planning.
