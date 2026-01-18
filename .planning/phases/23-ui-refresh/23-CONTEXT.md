# Phase 23: UI Refresh - Context

**Gathered:** 2026-01-18
**Status:** Ready for planning

<vision>
## How This Should Work

The frontend-design skill gets **creative freedom** to optimize this app's visual design for its use case: an internal staff wiki+ (procedures, references, checklists, guides, forms, messaging, workspaces).

**Starting point:** The existing style guide in `app/src/app/globals.css` serves as orientation/northstar — same design tokens, same Editorial Archive aesthetic.

**Reference for adaptation:** The wedding app (`../wedding-package-contract-generator/app/globals.css`) shows how the base style guide was adapted for a different use case (client-facing wedding demo). That variant has:
- Full button system (primary, secondary, ghost, accent)
- Card variants (interactive, accent, subtle, featured)
- Badge system
- Form styling classes
- Layout utilities (container, flex, grid)
- More animations
- Skeleton loaders

**This app's variant** should be optimized for:
- Daily internal use by staff
- Information-dense content (procedures, references, checklists)
- All-day readability
- Professional but not flashy

The frontend-design skill determines the specific optimizations based on impact and the app's use case.

</vision>

<essential>
## What Must Be Nailed

- **Custom variant creation** — Not just polish, but a thoughtful adaptation of the base style guide for this specific app's needs
- **Consistency with brand** — Same Editorial Archive DNA (Playfair + DM Sans, champagne accents, warm paper tones) but refined for internal tool use
- **Design skill unleashed** — Let frontend-design make the calls on what improves the experience

</essential>

<specifics>
## Specific Ideas

**Reference the existing style guides:**
- Base: `app/src/app/globals.css` (current staff hub tokens)
- Adapted variant example: `../wedding-package-contract-generator/app/globals.css`

**Key difference from wedding variant:**
- Wedding app = client-facing, demo/presentation mode
- Staff hub = internal, daily-use productivity tool

**Let frontend-design determine:**
- What scope makes sense (full refresh vs focused areas)
- What feel works best (efficient, calm, refined, etc.)
- What components need attention vs what's fine as-is

</specifics>

<notes>
## Additional Context

This phase was originally planned as "Phase 24 (post-v1.2): UI Refresh" in the backlog, noted as:
- Dynamic content UI (procedures, checklists) needs visual polish
- Current implementation is functional but rough
- Defer until after functionality complete

The user's direction is clear: **trust the frontend-design skill** to make the right calls about scope, feel, and execution. The skill should analyze the codebase, understand the use case, and deliver a refined visual experience.

</notes>

---

*Phase: 23-ui-refresh*
*Context gathered: 2026-01-18*
