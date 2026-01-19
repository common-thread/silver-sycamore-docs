# Silver Sycamore Staff Hub

## What This Is

An internal knowledge management and communication platform for Silver Sycamore Venue and Pine Street Cafe staff. Combines a versioned wiki for operational documentation, comments and suggestion workflows for collaborative improvement, personal workspaces for staff, and Slack-like messaging channels — all built on Convex with a Typeform-inspired archive aesthetic.

## Core Value

Staff use it daily as the single go-to place for procedures, knowledge, and team communication — replacing scattered Google Drives, binders, and external tools.

## Current State

**Version:** v1.3 Wiki Content Transposition (shipped 2026-01-19)
**Codebase:** ~72,000 LOC TypeScript, Next.js 15 + Convex (reduced from v1.0 via feature extraction)
**Features (main branch):** Wiki with context-based navigation, auth toggle, search, versioning, workspaces
**Features (feature/full-v1 branch):** Full v1.0 features including messaging, forms builder, comments, suggestions

## Requirements

### Validated

- Design system (Typeform-style, Playfair/DM Sans, ink/paper/bronze) — v1.0
- Authentication system (Convex Auth with Password provider) — v1.0
- User profiles and permissions model (staff/manager/admin roles) — v1.0
- Document versioning with controlled backend — v1.0
- Full-text search UI with category navigation — v1.0
- Personal folders for each user — v1.0
- Document duplication (copy server docs to personal space) — v1.0
- Folder sharing (user-to-user, groups) — v1.0
- Threaded comments on documents (Notion-style) — v1.0
- @mentions in comments — v1.0
- Suggestion workflow for proposing changes to official docs — v1.0
- PR-style promotion (user doc → replace official doc) — v1.0
- Slack-like channels (public, private) — v1.0
- Direct messages — v1.0
- File sharing and attachments in channels — v1.0
- @mention notifications to inbox — v1.0
- Digitize 15+ paper-based forms — v1.0 (17 forms seeded)
- Interactive form system with Convex storage — v1.0

### Active

**Future Enhancements**
- [ ] Binary file preview (docx, xlsx, pdf viewers)
- [ ] Deployment to production hosting
- [ ] User acceptance testing with staff

**Feature Restoration (from feature/full-v1)**
- [ ] Messaging channels and DMs
- [ ] Forms builder
- [ ] Comments system
- [ ] Suggestion workflow

### Out of Scope

- Real-time collaboration (Google Docs-style simultaneous editing) — adds complexity without proportional value for small team
- External user access (vendors, clients) — internal tool only
- Mobile native apps — web-only, responsive design sufficient
- Office document editing in-browser — store as files, display Markdown

## Context

**Jekyll Legacy Site:**
- GitHub Pages at splurfa.github.io/silver-sycamore-docs
- index.md files contain authoritative document metadata (titles, descriptions in tables)
- Individual doc files contain content only
- This is the source of truth for initial content seeding

**Data Model:**
- Seed data: Comes from deterministic markdown sources (to be fixed in v1.1)
- Runtime data: Created by users directly in Convex, doesn't need markdown round-trip

**Rollout Plan:**
- Phase 1: Management + builder (<5 users)
- Phase 2: Full staff after content maturation

## Constraints

- **Backend**: Keep Convex — existing infrastructure, real-time capabilities needed
- **Content Source**: `/docs/` markdown + index.md files are source of truth for seeding
- **Design**: Typeform-inspired, serif bold fonts, archive aesthetic — easy to read, clean
- **Messaging**: Built custom on Convex — full control, no external dependencies

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Playfair Display + DM Sans fonts | Editorial character, high legibility | ✓ Good |
| Ink/paper/bronze color system | Archival aesthetic, warm not stark | ✓ Good |
| Convex Auth with Password provider | Simple for internal staff | ✓ Good |
| Role hierarchy (staff/manager/admin) | Clear permission matrix | ✓ Good |
| Personal workspace separate tables | Clean data isolation | ✓ Good |
| @[userId] mention format | Database stability, resolved at render | ✓ Good |
| Suggestion state machine | Clear workflow states | ✓ Good |
| Channel types as string union | Extensibility for future types | ✓ Good |
| Cursor-based message pagination | Efficient infinite scroll | ✓ Good |
| Form ownership model | Clear accountability | ✓ Good |
| Heuristic description extraction | Quick implementation | ✓ Good — replaced by index.md parser in v1.1 |
| Parse index.md for metadata | Deterministic, matches Jekyll | ✓ Good — v1.1 |
| Context-based navigation | Matches user mental model (Events/Services/Operations) | ✓ Good — v1.3 |
| Feature branch for full v1 | Preserve features while simplifying main | ✓ Good — v1.3 |
| Content type templates | Consistent transposition methodology | ✓ Good — v1.3 |

---
*Last updated: 2026-01-19 after v1.3 milestone*
