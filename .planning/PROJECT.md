# Silver Sycamore Staff Hub

## What This Is

An internal knowledge management and communication platform for Silver Sycamore Venue and Pine Street Cafe staff. Combines a versioned wiki for operational documentation, comments and suggestion workflows for collaborative improvement, personal workspaces for staff, and Slack-like messaging channels — all built on Convex with a Typeform-inspired archive aesthetic.

## Core Value

Staff use it daily as the single go-to place for procedures, knowledge, and team communication — replacing scattered Google Drives, binders, and external tools.

## Requirements

### Validated

- Document viewing with Markdown rendering — existing
- Category/subcategory navigation — existing
- Convex backend with documents, categories, initiatives tables — existing
- Import script for markdown → Convex sync — existing
- Basic E2E test coverage — existing
- Dual deployment: Jekyll (GitHub Pages) + Next.js (Vercel) — existing

### Active

**Foundation**
- [ ] Authentication system (Convex Auth)
- [ ] User profiles and permissions model
- [ ] New design system (Typeform-style, serif fonts, black/white archive aesthetic)

**Wiki Core**
- [ ] Document versioning with controlled backend
- [ ] Full-text search UI (Convex query exists, needs frontend)
- [ ] Refined document browsing and navigation
- [ ] Markdown source of truth: `/docs/` → Jekyll + Convex → Next.js

**Personal Workspace**
- [ ] Personal folders for each user
- [ ] Document duplication (copy server docs to personal space)
- [ ] Folder sharing (user-to-user, groups)

**Comments + Suggestions**
- [ ] Threaded comments on documents (Notion-style)
- [ ] @mentions in comments
- [ ] Suggestion workflow for proposing changes to official docs
- [ ] PR-style promotion (user doc → replace official doc)

**Messaging**
- [ ] Slack-like channels (public, private)
- [ ] Direct messages
- [ ] File sharing and attachments in channels
- [ ] @mention notifications to inbox
- [ ] Full channel features (create, archive, invite)

**Forms (from existing planning)**
- [ ] Digitize 15 paper-based forms (booking, HR, operations)
- [ ] Interactive form system with Convex storage

### Out of Scope

- Real-time collaboration (Google Docs-style simultaneous editing) — adds complexity without proportional value for small team
- External user access (vendors, clients) — internal tool only
- Mobile native apps — web-only, responsive design sufficient
- Office document editing in-browser — store as files, display Markdown

## Context

**Existing Codebase:**
- Next.js App Router application in `app/` with Convex backend
- Jekyll static site at root for GitHub Pages deployment
- 74 operational documents organized into 5 categories (services, clients, staff, operations, deliverables)
- Heritage Elegance theme (Tailwind v4, custom fonts)
- Import script syncs `/docs/` markdown to Convex database

**User Workflow:**
- Builder/architect (you) works via Claude Code + direct markdown edits
- Management collaborates to build out wiki content
- Staff expands usage once handbook/onboarding docs are complete

**Planning Documents:**
- `00-exploration-summary.md` — initial exploration findings
- `01-document-inventory.md` — 74 documents cataloged
- `02-form-schemas.md` — JSON schemas for 17 forms
- `03-architecture-analysis.md` — technical design and migration plan

**Rollout Plan:**
- Phase 1: Management + builder (<5 users)
- Phase 2: Full staff after content maturation

## Constraints

- **Backend**: Keep Convex — existing infrastructure, real-time capabilities needed
- **Dual Systems**: Keep Jekyll running during transition — GitHub Pages serves legacy site
- **Content Source**: `/docs/` markdown files are single source of truth — both systems read from here
- **Design**: Typeform-inspired, serif bold fonts, black/white archive aesthetic — easy to read, clean
- **Messaging**: Build custom on Convex — full control, no external dependencies

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use frontend-design skill for UI | Anthropic skill ensures consistent, high-quality UI implementation | ✓ Good |
| Build custom messaging vs integrate | Full control, stay on Convex, no external service costs | — Pending |
| Comments read-only on official docs | Users suggest via comments/PRs, you control official content | — Pending |
| Personal folders vs flat personal docs | Folder structure matches user mental model, enables organization | — Pending |
| Markdown as source of truth | Enables Claude Code workflow, version control, deterministic sync | — Pending |
| Playwright for E2E verification | Captures screenshots at checkpoints, headless CI-friendly, good Next.js integration | ✓ Good |
| Chrome MCP for auth verification | Convex Auth state doesn't persist in Playwright; Chrome MCP uses real browser sessions | ✓ Good |
| E2E auth via storageState | Test user seeding + Playwright storageState persists real auth cookies between tests | ✓ Good |

---
*Last updated: 2026-01-15 after Phase 9 completion*
