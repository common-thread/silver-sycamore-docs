# Roadmap: Silver Sycamore Staff Hub

## Overview

Transform the existing Next.js/Convex wiki foundation into a comprehensive internal knowledge management and communication platform. Starting with design system refresh and authentication, then building wiki enhancements, personal workspaces, collaborative features, and finally messaging and forms — delivering a unified staff hub that replaces scattered tools.

## Milestones

- ✅ [v1.0 MVP](milestones/v1.0-ROADMAP.md) (Phases 1-11) — SHIPPED 2026-01-16
- ✅ [v1.1 Content Pipeline & Branding](milestones/v1.1-ROADMAP.md) (Phases 12-15) — SHIPPED 2026-01-16
- 🚧 **v1.2 Content Architecture** — Phases 16-23 (in progress)

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

## 🚧 v1.2 Content Architecture (In Progress)

**Milestone Goal:** First-principles refactoring of content architecture — how documents are mapped, displayed, and navigated based on intent rather than blind markdown conversion.

### Phase 16: Code Mapping + Style Audit - COMPLETE

**Goal**: Complete codebase mapping (current + desired state visual), style violation inventory
**Depends on**: v1.1 complete
**Research**: Unlikely (internal analysis work)
**Plans**: 3/3
**Completed**: 2026-01-17

Plans:
- [x] 16-01: User flows and navigation mapping (USER-FLOWS.md)
- [x] 16-02: Component-to-data flow mapping and style audit (COMPONENT-MAP.md, STYLE-VIOLATIONS.md)
- [x] 16-03: Target architecture documentation (DESIRED-STATE.md)

### Phase 17: Base Component Fixes - COMPLETE

**Goal**: Fix components so styling inherits correctly, establish enforcement layer
**Depends on**: Phase 16
**Research**: Unlikely (existing design system patterns)
**Plans**: 4/4
**Completed**: 2026-01-17

Plans:
- [x] 17-01: Error color foundation (add tokens, replace hardcoded colors)
- [x] 17-02: Header and DocumentViewer token adoption
- [x] 17-03: FormRenderer and FormBuilder token adoption
- [x] 17-04: CommentSection, MessageList, and UI primitives token adoption

### Phase 18: Content Audit + Type Decisions - COMPLETE

**Goal**: Full content tracker, apply rules-based type decisions, flag edge cases
**Depends on**: Phase 17
**Research**: Unlikely (internal content review)
**Plans**: 1/1
**Completed**: 2026-01-17

Plans:
- [x] 18-FIX: Evidence-based content classification (70 documents, 5 types)

### Phase 19: Redundant Content Resolution + IA Redesign - COMPLETE

**Goal**: Eliminate duplicates, design new information architecture
**Depends on**: Phase 18
**Research**: Unlikely (internal IA work)
**Plans**: 3/3
**Completed**: 2026-01-17

Plans:
- [x] 19-01: Schema + Seed Migration (contentType field, mapping, redundant form exclusion)
- [x] 19-02: Navigation Components (QuickActionNav, Header restructure)
- [x] 19-03: Home Page + Verification (listing pages, visual checkpoint)

### Phase 20: Semantic Formatting + Progressive Disclosure

**Goal**: Implement new IA, accordions/collapsible components
**Depends on**: Phase 19
**Research**: Unlikely (internal UI components)
**Plans**: TBD

Plans:
- [ ] 20-01: TBD

### Phase 21: Form Builder Visual Rebuild

**Goal**: Section-based builder like Google Forms
**Depends on**: Phase 20
**Research**: Likely (form builder UX patterns)
**Research topics**: Google Forms UX patterns, modern form builder approaches, drag-and-drop section builders
**Plans**: TBD

Plans:
- [ ] 21-01: TBD

### Phase 22: Forms in Workspace + Universal Comments

**Goal**: Extended collaboration features — forms in workspace, full @mentions implementation
**Depends on**: Phase 21
**Research**: Unlikely (extending existing patterns)
**Plans**: TBD

Plans:
- [ ] 22-01: TBD

### Phase 23: Create Flows + Dashboard

**Goal**: Fix folder/document creation, simple management dashboard
**Depends on**: Phase 22
**Research**: Unlikely (fixing existing code + internal patterns)
**Plans**: TBD

Plans:
- [ ] 23-01: TBD

## Progress

| Phase | Milestone | Plans | Status | Completed |
|-------|-----------|-------|--------|-----------|
| 16. Code Mapping + Style Audit | v1.2 | 3/3 | Complete | 2026-01-17 |
| 17. Base Component Fixes | v1.2 | 4/4 | Complete | 2026-01-17 |
| 18. Content Audit + Type Decisions | v1.2 | 1/1 | Complete | 2026-01-17 |
| 19. Redundant Content + IA Redesign | v1.2 | 3/3 | Complete | 2026-01-17 |
| 20. Semantic Formatting + Progressive Disclosure | v1.2 | 0/? | Not started | - |
| 21. Form Builder Visual Rebuild | v1.2 | 0/? | Not started | - |
| 22. Forms in Workspace + Universal Comments | v1.2 | 0/? | Not started | - |
| 23. Create Flows + Dashboard | v1.2 | 0/? | Not started | - |
