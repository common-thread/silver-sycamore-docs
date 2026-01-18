# Phase 23: UI Refresh - Context

**Gathered:** 2026-01-18 (updated)
**Status:** Ready for planning

<vision>
## How This Should Work

**Brand Kit + Style Guides as Content**

The main style guide becomes a **Brand Kit** — a first-class content page where staff can download logos, copy color codes, and see typography examples. It's the parent of the design system.

Two **Style Guides** sit below as variants: one for the wedding app, one for the staff hub. Same component structure, but the Brand Kit has all the downloadable assets. The variants document how the base system was adapted for each use case.

All three are visible, accessible web pages in the wiki. Staff can browse them, reference them, download what they need.

**Navigation That Works**

Current state: documents buried in categories, too many clicks, some content not even accessible from nav.

Vision: Keep the current nav structure but make **category pages actually useful**. When you click "Procedures" or "References," you land on a page that's not just a flat card list but has:
- Grouped/sectioned content (related docs together)
- Quick previews (see what's in a doc before clicking)
- Visual hierarchy (important stuff prominent)

Nothing hidden or buried. Every document findable.

**Visual Polish Everywhere**

The app should look **finished**, not like a prototype. This means:
- Buttons, cards, inputs look polished (rounded corners, shadows, hover effects)
- Document rendering is editorial, not raw markdown (typography, spacing, lists)
- Components feel refined, not default/generic

</vision>

<essential>
## What Must Be Nailed

All three equally important — can't ship without:

1. **Brand Kit + Style Guides as content** — Design system documented and downloadable (logos, colors, typography)
2. **Navigation that works** — Find any document easily, clear structure, nothing buried
3. **Visual polish everywhere** — Buttons, cards, layouts, document rendering all look finished

</essential>

<specifics>
## Specific Ideas

**Brand Kit page:**
- Download logos & assets (PNG/SVG for presentations, docs)
- Copy color codes (hex values, see the palette)
- See typography examples (font names, sizes, usage guidelines)

**Hierarchy:**
- Brand Kit = main (downloadable assets)
- Wedding Style Guide = variant (documents adaptation)
- Staff Hub Style Guide = variant (documents adaptation)

**Category pages:**
- Not flat card lists
- Grouped content with clear headings
- Quick previews of doc content
- Visual hierarchy (important stuff prominent)

**Document rendering:**
- Editorial typography (Playfair headings, DM Sans body)
- Proper spacing, lists, tables
- Not raw markdown conversion

**Component polish:**
- Border radius on buttons, cards, inputs
- Shadows and hover effects
- Champagne accents on focus states

</specifics>

<notes>
## Additional Context

Previous attempts (23-01, 23-02) were insufficient — they did code refactoring without visible changes. This phase needs to deliver **visible** improvement across:
- Brand Kit content pages
- Navigation/category page layouts
- Component styling
- Document rendering

No specific design reference — just make it work and look polished.

</notes>

---

*Phase: 23-ui-refresh*
*Context gathered: 2026-01-18*
