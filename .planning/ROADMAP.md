# Roadmap: Silver Sycamore Staff Hub

## Overview

Transform the existing Next.js/Convex wiki foundation into a comprehensive internal knowledge management and communication platform. Starting with design system refresh and authentication, then building wiki enhancements, personal workspaces, collaborative features, and finally messaging and forms — delivering a unified staff hub that replaces scattered tools.

## Milestones

- ✅ [v1.0 MVP](milestones/v1.0-ROADMAP.md) (Phases 1-11) — SHIPPED 2026-01-16
- ✅ [v1.1 Content Pipeline & Branding](milestones/v1.1-ROADMAP.md) (Phases 12-15) — SHIPPED 2026-01-16
- 🚧 **v1.2 Content Architecture** — Phases 16-22 (in progress)

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
**Plans**: 4/4
**Completed**: 2026-01-17

Plans:
- [x] 19-01: Schema + Seed Migration (contentType field, mapping, redundant form exclusion)
- [x] 19-02: Navigation Components (QuickActionNav, Header restructure)
- [x] 19-03: Home Page + Verification (listing pages, visual checkpoint)
- [x] 19-FIX: Import index.md files as guide documents

### Phase 20: Dynamic Content System - FIX PENDING

**Goal**: Complete infrastructure for interactive dynamic content — procedures, checklists, and forms that staff can complete, track, and share. Includes semantic rendering, completion lifecycle, activity tracking, and sharing workflows.
**Depends on**: Phase 19
**Research**: Unlikely (patterns defined in CONTEXT.md, schema design from codebase exploration)
**Plans**: 5/5 + FIX
**Status**: Core complete, fix plan pending for binary content conversion

Plans:
- [x] 20-01: Schema Foundation (dynamicContentInstances, activityLog, shareLinks tables)
- [x] 20-02: Completion Tracking (dynamicContent.ts mutations/queries, ProcedureSteps, ChecklistView)
- [x] 20-03: Activity System (activity.ts, ActivitySidebar, ActivityDashboard)
- [x] 20-04: Sharing System (sharing.ts, ShareLinkDialog, /share/[token] page)
- [x] 20-05: Integration (ContentTypeRenderer, activity page, wiring)
- [x] 20-FIX: Binary Content Conversion (convert 39 DOCX/XLSX/PDF files to markdown)

### Phase 21: Form Builder Visual Rebuild - COMPLETE

**Goal**: Section-based builder like Google Forms — visual drag-and-drop interface
**Depends on**: Phase 20
**Research**: Level 1 (dnd-kit is the modern standard, no deep research needed)
**Plans**: 2/2
**Completed**: 2026-01-18

Plans:
- [x] 21-01: Foundation + DraggableFieldCard (dnd-kit, inline editing component)
- [x] 21-02: FormBuilder Integration + Visual Verification (refactor, browser testing)

### Phase 22: Create Flows + Dashboard - DEFERRED

**Goal**: Add error handling to folder/document creation flows, simple management dashboard
**Depends on**: Phase 21
**Research**: Unlikely (fixing existing code + internal patterns)
**Plans**: TBD
**Status**: Deferred — flows work when authenticated, error handling is UX polish not blocking

**Findings from investigation (2026-01-18):**
- Create folder/document mutations work correctly when user is logged in
- Missing: try/catch in UI handlers, error toasts, redirect to signin on auth failure
- Low priority since core functionality works

Plans:
- [ ] 22-01: TBD (when resumed)

## Progress

| Phase | Milestone | Plans | Status | Completed |
|-------|-----------|-------|--------|-----------|
| 16. Code Mapping + Style Audit | v1.2 | 3/3 | Complete | 2026-01-17 |
| 17. Base Component Fixes | v1.2 | 4/4 | Complete | 2026-01-17 |
| 18. Content Audit + Type Decisions | v1.2 | 1/1 | Complete | 2026-01-17 |
| 19. Redundant Content + IA Redesign | v1.2 | 4/4 | Complete | 2026-01-17 |
| 20. Dynamic Content System | v1.2 | 6/6 | Complete | 2026-01-17 |
| 21. Form Builder Visual Rebuild | v1.2 | 2/2 | Complete | 2026-01-18 |
| 22. Create Flows + Dashboard | v1.2 | 0/? | Deferred | - |
