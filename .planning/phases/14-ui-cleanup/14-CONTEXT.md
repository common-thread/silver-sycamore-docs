# Phase 14: UI Cleanup - Context

**Gathered:** 2026-01-16
**Status:** Ready for planning (replaces existing 14-01-PLAN.md)

<vision>
## How This Should Work

This app is a Notion-lite with tight PR-style version control — not a document preview/download system like the old Jekyll site. Staff come here to find and read procedures, not to download files.

The nav was built before all the features were added and is now a mess. It needs to reflect the actual app: wiki, messaging, forms, and personal workspace — all visible, flat, clear. User-based views can come later with auth/role filtering.

No technical BS. Staff don't need to know if something is a .md or .pdf file. They just need to find what they're looking for, fast.

Documents should render, not preview. If content isn't converted to markdown yet, that's a gap to flag and fix — not something to build "download" fallbacks for.

</vision>

<essential>
## What Must Be Nailed

- **Clean navigation** — Flat nav showing all available features (Knowledge Base, Messages, Forms, My Workspace). Everything visible so we can see what we're building. Custom role-based views come later.
- **Remove all technical noise** — No file type labels, no emojis, no source paths, no "preview coming soon" patterns
- **No download fallbacks** — Documents render or they're flagged as needing conversion. This isn't a file server.
- **Title and description are sacred** — Document identity matters, everything else is clutter

</essential>

<specifics>
## Specific Ideas

- Nav should be flat list for now: all features at same level
- Everything we have a page for should be in the nav
- Any unconverted content should be flagged as an issue to track (for next milestone planning)
- After this milestone, remap codebase to assess state and catalog gaps
- Build a list of known issues/gaps to inform next milestone discussion

</specifics>

<notes>
## Additional Context

**Scope expanded from original plan:** Original 14-01-PLAN.md was narrow (just remove emojis/labels from DocumentViewer). This context captures the bigger picture — the whole app needs to feel clean and navigable, not just the document viewer.

**Existing 14-01-PLAN.md needs rewrite:** The current plan focused on the wrong thing (preview fallbacks). New plan should focus on:
1. Nav cleanup — make it reflect the actual app
2. Remove technical indicators throughout
3. Flag any unconverted content as issues

**Future work (not this phase):**
- Role-based nav views
- Content conversion for any remaining binary files
- Next milestone planning after codebase remap

</notes>

---

*Phase: 14-ui-cleanup*
*Context gathered: 2026-01-16*
