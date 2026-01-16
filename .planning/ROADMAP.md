# Roadmap: Silver Sycamore Staff Hub

## Overview

Transform the existing Next.js/Convex wiki foundation into a comprehensive internal knowledge management and communication platform. Starting with design system refresh and authentication, then building wiki enhancements, personal workspaces, collaborative features, and finally messaging and forms — delivering a unified staff hub that replaces scattered tools.

## Milestones

- ✅ [v1.0 MVP](milestones/v1.0-ROADMAP.md) (Phases 1-11) — SHIPPED 2026-01-16
- ✅ [v1.1 Content Pipeline & Branding](milestones/v1.1-ROADMAP.md) (Phases 12-15) — SHIPPED 2026-01-16
- 📋 **v1.2 Content Architecture** — Planning

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

<details>
<summary>v1.1 Content Pipeline & Branding (Phases 12-15) — SHIPPED 2026-01-16</summary>

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 12 | Content Pipeline | 1/1 | Complete | 2026-01-16 |
| 13 | Brand Foundation | 1/1 | Complete | 2026-01-16 |
| 14 | UI Cleanup | 2/2 | Complete | 2026-01-16 |
| 15 | Custom Dropdowns | 1/1 | Complete | 2026-01-16 |

**Total:** 5 plans

**Delivered:**
- Index.md parser for deterministic content seeding (62/65 docs authoritative)
- Complete brand foundation: 4 logo variants, design tokens, style guide
- Consolidated navigation into single flat feature row
- Cleaned document viewer and catalog (removed technical indicators)
- Premium Select component replacing all native selects

</details>

## 📋 v1.2 Content Architecture (Planning)

**Milestone Goal:** First-principles refactoring of content architecture — how documents are mapped, displayed, and navigated based on intent rather than blind markdown conversion.

See STATE.md for full backlog.

## Progress

_v1.1 complete. v1.2 in planning._
