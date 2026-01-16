# Roadmap: Silver Sycamore Staff Hub

## Overview

Transform the existing Next.js/Convex wiki foundation into a comprehensive internal knowledge management and communication platform. Starting with design system refresh and authentication, then building wiki enhancements, personal workspaces, collaborative features, and finally messaging and forms — delivering a unified staff hub that replaces scattered tools.

## Milestones

- ✅ [v1.0 MVP](milestones/v1.0-ROADMAP.md) (Phases 1-11) — SHIPPED 2026-01-16
- 🚧 **v1.1 Content Pipeline & Branding** - Phases 12-16 (in progress)

## Completed Milestones

<details>
<summary>v1.0 MVP (Phases 1-11) — SHIPPED 2026-01-16</summary>

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | Design System | 3/3 | Complete | 2026-01-14 |
| 2 | Authentication | 3/3 | Complete | 2026-01-14 |
| 3 | User Profiles & Permissions | 3/3 | Complete | 2026-01-15 |
| 4 | Wiki Search & Navigation | 3/3 | Complete | 2026-01-15 |
| 5 | Document Versioning | 3/3 | Complete | 2026-01-15 |
| 6 | Personal Workspace | 3/3 | Complete | 2026-01-15 |
| 7 | Folder Sharing | 3/3 | Complete | 2026-01-15 |
| 8 | Comments System | 3/3 | Complete | 2026-01-15 |
| 9 | Suggestion Workflow | 3/3 | Complete | 2026-01-15 |
| 10 | Messaging Channels | 6/6 | Complete | 2026-01-15 |
| 11 | Forms System | 5/5 | Complete | 2026-01-16 |

**Total:** 37 plans, 8h 20min execution time

**Delivered:**
- Typeform-inspired design system with Playfair Display/DM Sans typography
- Convex Auth with role-based permissions (staff/manager/admin)
- Full-text wiki search with category navigation
- Document versioning with restore capability
- Personal workspaces with folder sharing
- Threaded comments with @mentions
- PR-style suggestion workflow
- Slack-like messaging channels with DMs
- Interactive forms system with 17 legacy forms seeded

**Known Issues for v1.1:**
- Content seeding uses heuristic extraction instead of parsing index.md tables
- Technical indicators (file type labels) need removal from document viewer

</details>

## 🚧 v1.1 Content Pipeline & Branding (In Progress)

**Milestone Goal:** Fix content import reliability, clean up UI artifacts, and establish company-wide branding standards.

**Constraints:**
- Frontend-design skill required for all UI/design decisions
- Wedding style guide as baseline (monochrome palette + champagne accents)
- Logo assets from wedding project need to be copied

### Phase 12: Content Pipeline - COMPLETE

**Goal:** Deterministic content seeding - parse index.md tables for document titles/descriptions instead of heuristic extraction
**Depends on:** v1.0 complete
**Research:** Unlikely (internal patterns, parsing existing files)
**Plans:** 1/1

Plans:
- [x] 12-01: Index.md parser with import script integration

### Phase 13: UI Cleanup

**Goal:** Remove file type labels (.md, .pdf), technical emojis, and other developer-facing indicators from the document viewer
**Depends on:** Phase 12
**Research:** Unlikely (UI cleanup, internal work)
**Plans:** TBD

Plans:
- [ ] 13-01: TBD

### Phase 14: Design Tokens

**Goal:** Establish design tokens file (CSS custom properties + exportable JSON) and component library foundation
**Depends on:** Phase 13
**Research:** Unlikely (CSS custom properties, established patterns)
**Plans:** TBD

Plans:
- [ ] 14-01: TBD

### Phase 15: Style Guide

**Goal:** Create in-app style guide documentation page with logo usage guidelines (proper spacing, centering, approved/prohibited uses)
**Depends on:** Phase 14
**Research:** Unlikely (documentation, internal patterns)
**Plans:** TBD

Plans:
- [ ] 15-01: TBD

### Phase 16: Custom Dropdowns

**Goal:** Replace native HTML select elements with styled dropdown components that match the design system
**Depends on:** Phase 15
**Research:** Unlikely (component development, established patterns)
**Plans:** TBD

Plans:
- [ ] 16-01: TBD

## Progress

| Phase | Milestone | Plans | Status | Completed |
|-------|-----------|-------|--------|-----------|
| 12. Content Pipeline | v1.1 | 1/1 | Complete | 2026-01-16 |
| 13. UI Cleanup | v1.1 | 0/? | Not started | - |
| 14. Design Tokens | v1.1 | 0/? | Not started | - |
| 15. Style Guide | v1.1 | 0/? | Not started | - |
| 16. Custom Dropdowns | v1.1 | 0/? | Not started | - |
