# Phase 18: Content Audit + Type Decisions - Context

**Gathered:** 2026-01-17
**Status:** Ready for planning

<vision>
## How This Should Work

A systematic, rules-based content audit that classifies every document with full coherence. The system applies the 5 defined content types (procedure, reference, form, checklist, guide) using detection heuristics, identifies redundant content (documents that exist as both markdown and form builder entries), and produces a clean tracker I can reference.

This is automation-first: define rules, let them classify, then focus attention on edge cases that need human judgment.

</vision>

<essential>
## What Must Be Nailed

- **Accurate type assignments** — Every document gets the right classification based on its actual content and intent
- **Redundancy identification** — Find content that exists in two places and needs consolidation
- **Clean tracker** — A structured markdown file in .planning that serves as the reference for all content decisions

All three matter equally. The output needs full coherence, not partial coverage.

</essential>

<specifics>
## Specific Ideas

- Tracker lives in `.planning/phases/18-content-audit-type-decisions/` as a committed markdown file
- Apply heuristics from DESIRED-STATE.md section 4.2 (numbered steps → procedure, checkboxes → checklist, "Form" in title → form, tables → reference, fallback → guide)
- Edge cases get flagged separately with best-guess classification + reasoning for manual review
- Track each document's: current state, intended purpose, content type assignment, and any notes on redundancy

</specifics>

<notes>
## Additional Context

This phase builds on Phase 16's architectural foundation. The content types, detection rules, and overall vision are already defined in DESIRED-STATE.md — this phase is about applying that framework to the actual content.

The goal is to enable Phase 19's information architecture redesign and Phase 20's semantic rendering. Without accurate content type assignments, those phases can't deliver purpose-based navigation or type-specific rendering.

</notes>

---

*Phase: 18-content-audit-type-decisions*
*Context gathered: 2026-01-17*
