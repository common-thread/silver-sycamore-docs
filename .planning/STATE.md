# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-16)

**Core value:** Staff use it daily as the single go-to place for procedures, knowledge, and team communication.
**Current focus:** v1.2 Content Architecture

## Current Position

Phase: 19 of 23 (Redundant Content + IA Redesign)
Plan: 2 of 3 in current phase
Status: In progress
Last activity: 2026-01-17 — Completed 19-02-PLAN.md

Progress: █████████░ 42% (plans 10 of ~24 in v1.2)

## Performance Metrics

**v1.0 Summary:**
- Total plans completed: 37
- Total execution time: 8h 20min
- Average per plan: 14 min

**v1.1 Progress:**
- Plans completed: 5 (12-01, 13-01, 14-01, 14-02, 15-01)
- Phases complete: 4 of 4 (12, 13, 14, 15) - MILESTONE COMPLETE

**v1.2 Progress:**
- Plans completed: 10 (16-01, 16-02, 16-03, 17-01, 17-02, 17-03, 17-04, 18-FIX, 19-01, 19-02)
- Phases complete: 3 of 8 (Phase 16, Phase 17, Phase 18 complete)

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

Phase 18 decisions:
- 70 documents classified with evidence-based content type assignments
- Content distribution: reference (32), form (18), procedure (10), checklist (5), guide (5)
- 18 redundant items identified (documents that exist in both form builder and markdown/binary)
- Resolution: Form builder is authoritative for all data collection interfaces
- Only 1 unconvertible file (tasting-form.pdf) - all other binaries analyzed via GitHub Pages

Phase 19-01 decisions:
- 13 redundant forms identified for exclusion from import (form builder is authoritative)
- Actual content type counts from table analysis: 10 procedure, 36 reference, 14 form, 5 checklist, 5 guide
- 57 documents will be imported after excluding redundant items
- 4 planning checklists kept as checklists (guidance documents, not data collection forms)

Phase 19-02 decisions:
- Navigation reflects user intent (Procedures, References, Checklists, Guides) not content location
- QuickActionNav displays 5 action cards: 4 content types + Forms (links to existing forms section)
- Header nav reduced from 9 to 8 items by removing misleading category names (Services, Clients, Staff, Operations, Deliverables)

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
- **v1.2 milestone references added**: `.planning/milestones/v1.2-REFERENCES.md` ensures all phases inherit Phase 16 architectural guidance

## Session Continuity

Last session: 2026-01-17
Stopped at: Completed 19-02-PLAN.md (QuickActionNav + Header navigation)
Resume file: None

### Next Steps

1. **`/gsd:execute-plan .planning/phases/19-redundant-content-ia-redesign/19-03-PLAN.md`** — Execute home page + verification plan
2. Run import script to populate database with contentType-tagged documents
3. Create content type listing pages (/procedures, /references, /checklists, /guides)
