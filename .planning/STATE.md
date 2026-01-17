# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-16)

**Core value:** Staff use it daily as the single go-to place for procedures, knowledge, and team communication.
**Current focus:** v1.2 Content Architecture

## Current Position

Phase: 17 of 23 (Base Component Fixes) - IN PROGRESS
Plan: 17-03 COMPLETE (3 of 4 plans)
Status: Form system components (FormRenderer, FormBuilder) token adoption complete
Last activity: 2026-01-16 — Plan 17-03 completed

Progress: ██████░░░░ 25% (plans 6 of ~24 in v1.2)

## Performance Metrics

**v1.0 Summary:**
- Total plans completed: 37
- Total execution time: 8h 20min
- Average per plan: 14 min

**v1.1 Progress:**
- Plans completed: 5 (12-01, 13-01, 14-01, 14-02, 15-01)
- Phases complete: 4 of 4 (12, 13, 14, 15) - MILESTONE COMPLETE

**v1.2 Progress:**
- Plans completed: 6 (16-01, 16-02, 16-03, 17-01, 17-02, 17-03)
- Phases complete: 1 of 8 (Phase 16 complete, Phase 17 in progress)

## Accumulated Context

### Decisions

Key decisions logged in PROJECT.md.

Phase 14 decisions:
- Removed Type column entirely from catalog (staff don't need file extensions)
- "Pending conversion" message for binary files (not download prompts)
- Consolidated navigation to single flat row (removed redundant Catalog link)

Phase 15 decisions:
- Auto-search when options > 5 items (searchable="auto")
- No portal needed - position:absolute relative to container
- 180ms ease-out animations matching Input component
- Border-radius: 0 to match brand aesthetic

Phase 16 decisions:
- Error color `#C75050` should become `var(--color-error)` (#8B4D4D)
- Border-radius should be `0` consistently (brand aesthetic)
- Typography/spacing tokens exist but need adoption
- Phase 17 will fix high-priority violations first
- Content types defined: procedure, reference, form, checklist, guide
- Navigation: Purpose-based replaces category-based (Phase 19)
- Components: 15 keep, 9 refactor, 7 new (see DESIRED-STATE.md)

### Deferred Issues

- ~~**Deterministic content seeding** — Import script uses heuristics instead of parsing index.md tables.~~ RESOLVED in Phase 12
- ~~**Technical indicators in UI** — File type labels, emojis need removal from document viewer.~~ RESOLVED in Phase 14
- ~~**Custom dropdowns** — Replace native HTML select elements with styled components.~~ RESOLVED in Phase 15

**v1.2 Backlog (captured 2026-01-16):**

**CORE INITIATIVE: First-Principles Content Architecture Refactoring**

The current state is blind markdown-to-app conversion without considering intent or purpose. Need a complete rethink of how content is mapped, displayed, and navigated.

**Problems to solve:**
1. **Blind markdown conversion** — Headers/hierarchy blindly followed, causing duplicate titles, confused structure
2. **No style guide adherence** — Rendered documents don't follow established design system
3. **No semantic formatting** — Content not formatted based on type/intent (procedures vs reference vs forms)
4. **Missing progressive disclosure** — Need accordions, collapsible sections for long content
5. **Misleading navigation** — "Clients" nav implies client list but contains client-related forms; many similar issues
6. **Redundant content** — Some forms exist as BOTH markdown docs AND in form builder
7. **No content type decisions** — Need to decide per-document: form? editable doc? static reference?

**Required: Content State Tracker**
Create structured log tracking each document's:
- Current state (markdown, form, hybrid)
- Intended purpose (procedure, reference, intake form, checklist, etc.)
- Desired end state (form builder form, styled document, interactive guide)
- Missing elements (sections, accordions, better hierarchy)

**Vision reminder:** Mini Notion + Mini Slack + Mini Google Forms — unified, purpose-built for this company.

---

**Additional backlog items:**
- **Folder/document creation broken** — Create folder and create document flows not working
- **Form builder overhaul** — Visual section-based builder like Google Forms (not modal-heavy)
- **Forms in workspace** — Allow forms to be added to workspace (not just docs)
- **Universal comments with @mentions** — Comment on anything, @mention people/documents with linking

### Pending Todos

None — Milestone v1.1 complete.

### Blockers/Concerns

None active.

### Roadmap Evolution

- Milestone v1.1 created: Content Pipeline & Branding, 5 phases (Phase 12-16)
- v1.1 restructured: Consolidated design tokens + style guide into Phase 13 (Brand Foundation), now 4 phases (12-15)
- Milestone v1.2 created: Content Architecture, 8 phases (Phase 16-23)

## Session Continuity

Last session: 2026-01-16
Stopped at: Plan 17-03 complete
Resume file: None

### Next Steps

1. **Execute Plan 17-04** — CommentSection and MessageList token adoption
2. Complete Phase 17, move to Phase 18
3. Reference STYLE-VIOLATIONS.md for remaining violation details
