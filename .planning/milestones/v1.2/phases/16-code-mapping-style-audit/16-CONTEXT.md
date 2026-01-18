# Phase 16: Code Mapping + Style Audit - Context

**Gathered:** 2026-01-16
**Status:** Ready for planning

<vision>
## How This Should Work

This phase creates the foundation for v1.2's content architecture refactoring. Before fixing anything, we need to deeply understand:

1. **Current state** — How the codebase actually works today. Map the flow from user perspective (what they see/click) through to architecture (which components render what, how data flows from Convex to screen).

2. **Desired state scaffold** — Based on the v1.2 vision (first-principles content architecture), document what the architecture SHOULD look like. This is a scaffold, not a detailed spec — subsequent phases will adapt as they go.

3. **Style violations** — Inventory of where the UI breaks from the established design system. Scope determined by analyzing the codebase (style guide, tokens, component patterns).

The outputs should work for both humans (readable flow diagrams, clear narratives) and machines (structured data subsequent phases can consume programmatically).

</vision>

<essential>
## What Must Be Nailed

- **Comprehensive current-state mapping** — User flow perspective mapped to architecture. How does clicking "Clients" in nav result in what renders? What components are involved?
- **Desired state scaffold** — Clear enough to guide subsequent phases, flexible enough to adapt. Based on v1.2 backlog problems (blind markdown, no semantic formatting, misleading navigation, etc.)
- **Style violation inventory** — Systematic list of where UI deviates from design system. Machine-parseable for Phase 17 (Base Component Fixes) to consume.

All three are equally important — they build on each other.

</essential>

<specifics>
## Specific Ideas

- Dual-format outputs: human-readable (user can see the flow) AND machine-friendly (agents can parse)
- Don't over-specify desired state — create scaffold that subsequent phases interpret
- Style violation scope: determined by analyzing what the codebase has (style guide, design tokens, component patterns)

</specifics>

<notes>
## Additional Context

**v1.2 Milestone Vision (from STATE.md backlog):**

Core initiative: First-principles content architecture refactoring. The current state is blind markdown-to-app conversion without considering intent or purpose.

Problems this milestone solves:
1. Blind markdown conversion — headers/hierarchy blindly followed
2. No style guide adherence — rendered documents don't follow design system
3. No semantic formatting — content not formatted based on type/intent
4. Missing progressive disclosure — need accordions, collapsible sections
5. Misleading navigation — "Clients" nav implies client list but contains forms
6. Redundant content — forms exist as BOTH markdown docs AND in form builder
7. No content type decisions — need to decide per-document: form? editable doc? static reference?

Vision: Mini Notion + Mini Slack + Mini Google Forms — unified, purpose-built for this company.

This phase provides the analytical foundation. Subsequent phases (17-23) do the actual fixing.

</notes>

---

*Phase: 16-code-mapping-style-audit*
*Context gathered: 2026-01-16*
