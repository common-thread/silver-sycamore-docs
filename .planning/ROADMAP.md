# Roadmap: Silver Sycamore Staff Hub

## Overview

Transform the existing Next.js/Convex wiki foundation into a comprehensive internal knowledge management and communication platform. Starting with design system refresh and authentication, then building wiki enhancements, personal workspaces, collaborative features, and finally messaging and forms — delivering a unified staff hub that replaces scattered tools.

## Milestones

- ✅ [v1.0 MVP](milestones/v1.0-ROADMAP.md) (Phases 1-11) — SHIPPED 2026-01-16
- ✅ [v1.1 Content Pipeline & Branding](milestones/v1.1-ROADMAP.md) (Phases 12-15) — SHIPPED 2026-01-16
- ✅ [v1.2 Content Architecture](milestones/v1.2-ROADMAP.md) (Phases 16-23) — SHIPPED 2026-01-18
- 🚧 **v1.3 Wiki Content Transposition** — Phases 24-28 (in progress)

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

<details>
<summary>v1.2 Content Architecture (Phases 16-23) — SHIPPED 2026-01-18</summary>

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 16 | Code Mapping + Style Audit | 3/3 | Complete | 2026-01-17 |
| 17 | Base Component Fixes | 4/4 | Complete | 2026-01-17 |
| 18 | Content Audit + Type Decisions | 1/1 | Complete | 2026-01-17 |
| 19 | Redundant Content + IA Redesign | 4/4 | Complete | 2026-01-17 |
| 20 | Dynamic Content System | 6/6 | Complete | 2026-01-17 |
| 21 | Form Builder Visual Rebuild | 2/2 | Complete | 2026-01-18 |
| 22 | Create Flows + Dashboard | - | Deferred | - |
| 23 | UI Refresh | 3/3 | Complete | 2026-01-18 |

**Total:** 23 plans, 6 days execution time

**Delivered:**
- Complete codebase mapping with 28 routes, 51 components documented
- Design token adoption across all major components
- Evidence-based content classification (70 documents, 5 types)
- Purpose-based navigation replacing category-based
- Dynamic content system (procedures, checklists, activity, sharing)
- Visual form builder with drag-and-drop
- Staff Hub style guide as wiki content
- Visible CSS polish (border-radius, focus rings, prose styling)

**Known Issues for v1.3:**
- Procedures feature not tested — may need merge with checklists
- 12 content type misclassifications identified
- Create flows error handling deferred

</details>

### 🚧 v1.3 Wiki Content Transposition (In Progress)

**Milestone Goal:** Transform raw markdown into properly contextualized wiki content that adheres to the style guide and makes sense within the app UI. Defer secondary features to a branch.

#### Phase 24: Feature Branch Extraction

**Goal**: Move deferred features (comments, messaging, forms builder, procedures, checklists) to a separate branch, simplify main codebase
**Depends on**: v1.2 complete
**Research**: Unlikely (git operations, internal work)
**Plans**: 5 in 3 waves

Plans:
- [x] 24-01: Branch Creation + Auth Toggle (Wave 1) — Complete 2026-01-18
- [x] 24-02: Messaging + Notifications Extraction (Wave 2) — Complete 2026-01-18
- [x] 24-03: Interactive Content Simplification (Wave 2, parallel) — Complete 2026-01-18
- [x] 24-04: Forms + Comments Extraction (Wave 2, parallel) — Complete 2026-01-18
- [x] 24-05: Navigation Cleanup + Verification (Wave 3) — Complete 2026-01-18

#### Phase 25: Content Source Audit

**Goal**: Investigate all source files (markdown, JSON), catalog formats, identify what needs transposition
**Depends on**: Phase 24
**Research**: Unlikely (internal file analysis)
**Plans**: TBD

Plans:
- [ ] 25-01: TBD

#### Phase 26: Transposition Process Design

**Goal**: Create methodology for analyzing document intent and conversion to UI context
**Depends on**: Phase 25
**Research**: Unlikely (methodology work, internal)
**Plans**: TBD

Plans:
- [ ] 26-01: TBD

#### Phase 27: Content Transposition Execution

**Goal**: Apply transposition methodology to all wiki documents (scope determined by audit)
**Depends on**: Phase 26
**Research**: Unlikely (applying established methodology)
**Plans**: TBD

Plans:
- [ ] 27-01: TBD

#### Phase 28: Navigation & Catalog Refinement

**Goal**: Restructure wiki navigation based on transposed content, remove duplication, fix illogical organization
**Depends on**: Phase 27
**Research**: Unlikely (internal restructuring)
**Plans**: TBD

Plans:
- [ ] 28-01: TBD

## Progress

| Phase | Milestone | Plans | Status | Completed |
|-------|-----------|-------|--------|-----------|
| 24. Feature Branch Extraction | v1.3 | 5/5 | Complete | 2026-01-18 |
| 25. Content Source Audit | v1.3 | 0/? | Not started | - |
| 26. Transposition Process Design | v1.3 | 0/? | Not started | - |
| 27. Content Transposition Execution | v1.3 | 0/? | Not started | - |
| 28. Navigation & Catalog Refinement | v1.3 | 0/? | Not started | - |
