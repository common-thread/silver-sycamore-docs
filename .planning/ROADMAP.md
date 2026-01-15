# Roadmap: Silver Sycamore Staff Hub

## Overview

Transform the existing Next.js/Convex wiki foundation into a comprehensive internal knowledge management and communication platform. Starting with design system refresh and authentication, then building wiki enhancements, personal workspaces, collaborative features, and finally messaging and forms — delivering a unified staff hub that replaces scattered tools.

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Design System** - Typeform-inspired aesthetic with serif fonts and archive theme
- [ ] **Phase 2: Authentication** - Convex Auth integration with user sessions
- [ ] **Phase 3: User Profiles & Permissions** - User model, roles, and permission checks
- [ ] **Phase 4: Wiki Search & Navigation** - Full-text search UI and refined browsing
- [ ] **Phase 5: Document Versioning** - Version history with controlled backend
- [ ] **Phase 6: Personal Workspace** - Personal folders and document duplication
- [ ] **Phase 7: Folder Sharing** - User-to-user and group sharing capabilities
- [ ] **Phase 8: Comments System** - Threaded comments with @mentions
- [ ] **Phase 9: Suggestion Workflow** - Propose changes and PR-style promotion
- [ ] **Phase 10: Messaging Channels** - Public/private channels and direct messages
- [ ] **Phase 11: Forms System** - Interactive forms for 15 digitized paper forms

## Phase Details

### Phase 1: Design System
**Goal**: Establish Typeform-inspired visual language — serif bold fonts, black/white archive aesthetic, clean readable components
**Depends on**: Nothing (first phase)
**Research**: Unlikely (internal styling, established Tailwind patterns)
**Plans**: TBD

Plans:
- [ ] 01-01: Typography and color foundation
- [ ] 01-02: Core UI components (buttons, inputs, cards)
- [ ] 01-03: Layout components and page templates

### Phase 2: Authentication
**Goal**: Implement Convex Auth for secure user login and session management
**Depends on**: Phase 1 (needs styled login UI)
**Research**: Likely (Convex Auth setup)
**Research topics**: Convex Auth configuration, session strategy, auth providers (email/password vs OAuth)
**Plans**: TBD

Plans:
- [ ] 02-01: Convex Auth setup and configuration
- [ ] 02-02: Login/logout UI and flows
- [ ] 02-03: Session management and protected routes

### Phase 3: User Profiles & Permissions
**Goal**: Create user profile system with role-based permissions for content access control
**Depends on**: Phase 2 (requires auth)
**Research**: Likely (permission model architecture)
**Research topics**: Role definitions (admin, manager, staff), permission check patterns, Convex access control
**Plans**: TBD

Plans:
- [ ] 03-01: User schema and profile storage
- [ ] 03-02: Role and permission definitions
- [ ] 03-03: Permission check middleware and UI guards

### Phase 4: Wiki Search & Navigation
**Goal**: Build search UI for existing Convex full-text search and improve document browsing
**Depends on**: Phase 1 (needs styled components)
**Research**: Unlikely (Convex query exists, frontend implementation only)
**Plans**: TBD

Plans:
- [ ] 04-01: Search UI with instant results
- [ ] 04-02: Enhanced category navigation
- [ ] 04-03: Document breadcrumbs and related docs

### Phase 5: Document Versioning
**Goal**: Track document version history with ability to view and restore previous versions
**Depends on**: Phase 3 (needs permission checks for version management)
**Research**: Unlikely (internal Convex patterns)
**Plans**: TBD

Plans:
- [ ] 05-01: Version schema and storage
- [ ] 05-02: Version history UI
- [ ] 05-03: Version comparison and restore

### Phase 6: Personal Workspace
**Goal**: Give each user a personal folder for their own documents and copies
**Depends on**: Phase 3 (needs user context)
**Research**: Unlikely (internal data modeling)
**Plans**: TBD

Plans:
- [ ] 06-01: Personal folder schema and storage
- [ ] 06-02: Personal workspace UI
- [ ] 06-03: Document duplication (copy server docs to personal)

### Phase 7: Folder Sharing
**Goal**: Enable users to share personal folders with individuals or groups
**Depends on**: Phase 6 (needs personal folders)
**Research**: Unlikely (builds on existing patterns)
**Plans**: TBD

Plans:
- [ ] 07-01: Sharing schema (user-to-user, groups)
- [ ] 07-02: Share dialog and permissions UI
- [ ] 07-03: Shared folder access and views

### Phase 8: Comments System
**Goal**: Threaded comments on documents with @mention support
**Depends on**: Phase 3 (needs user profiles for mentions)
**Research**: Unlikely (standard comment patterns)
**Plans**: TBD

Plans:
- [ ] 08-01: Comment schema and storage
- [ ] 08-02: Threaded comment UI
- [ ] 08-03: @mention autocomplete and linking

### Phase 9: Suggestion Workflow
**Goal**: Allow users to propose changes to official docs via PR-style workflow
**Depends on**: Phase 8 (comments inform suggestions), Phase 5 (versioning for comparisons)
**Research**: Unlikely (internal workflow patterns)
**Plans**: TBD

Plans:
- [ ] 09-01: Suggestion schema and states
- [ ] 09-02: Create and manage suggestions UI
- [ ] 09-03: Review and promotion workflow

### Phase 10: Messaging Channels
**Goal**: Slack-like messaging with public/private channels and DMs
**Depends on**: Phase 3 (needs user profiles)
**Research**: Likely (real-time architecture)
**Research topics**: Convex real-time subscriptions, message pagination, channel membership patterns, notification system
**Plans**: TBD

Plans:
- [ ] 10-01: Channel and message schemas
- [ ] 10-02: Channel list and creation UI
- [ ] 10-03: Message thread UI with real-time updates
- [ ] 10-04: Direct messages
- [ ] 10-05: File sharing in channels
- [ ] 10-06: @mention notifications and inbox

### Phase 11: Forms System
**Goal**: Digitize 15 paper forms with interactive input and Convex storage
**Depends on**: Phase 3 (needs user context for form submissions)
**Research**: Unlikely (JSON schemas already defined in 02-form-schemas.md)
**Plans**: TBD

Plans:
- [ ] 11-01: Form renderer component
- [ ] 11-02: Form submission storage
- [ ] 11-03: Form list and submission views

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Design System | 0/3 | Not started | - |
| 2. Authentication | 0/3 | Not started | - |
| 3. User Profiles & Permissions | 0/3 | Not started | - |
| 4. Wiki Search & Navigation | 0/3 | Not started | - |
| 5. Document Versioning | 0/3 | Not started | - |
| 6. Personal Workspace | 0/3 | Not started | - |
| 7. Folder Sharing | 3/3 | Complete | 2026-01-15 |
| 8. Comments System | 3/3 | Complete | 2026-01-15 |
| 9. Suggestion Workflow | 0/3 | Not started | - |
| 10. Messaging Channels | 0/6 | Not started | - |
| 11. Forms System | 0/3 | Not started | - |
