# Phase 24: Feature Branch Extraction - Context

**Gathered:** 2026-01-18
**Status:** Ready for planning

<vision>
## How This Should Work

The goal is to properly scope down the main branch to focus on wiki content transposition, while preserving all the feature work we've built. This isn't about deleting work — it's about creating clean boundaries so we can operate on a simpler codebase now, with clear paths back to the fuller feature set later.

Think of it like a developer who's realized their scope has grown beyond the current focus. The professional move: branch the feature work properly, document what connects where, and establish a clean working baseline. Not messy deletion — clean separation with marked connectors.

Auth should use an environment toggle approach. The auth system stays in the code, but an env variable controls whether it's enforced. When disabled, the app works as single-user (no login screens, no permission blocks). When enabled, full auth kicks in. This gives flexibility without code removal.

</vision>

<essential>
## What Must Be Nailed

- **Simpler working app now** — The main branch must be clean and usable for wiki-focused work without feature clutter
- **Nothing lost** — Every feature we built (comments, messaging, forms builder, procedures, checklists) is preserved on a branch and can return
- **Clear boundaries** — Obvious documentation of what connects where. Marked connectors show exactly how to re-enable features

</essential>

<specifics>
## Specific Ideas

- Environment variable toggle for auth enforcement (not code removal)
- Use best practices for scope extraction — the kind developers use when they've overbuilt on main
- Mark connectors between trimmed codebase and extracted features
- Keep extraction branch as a return path, not an archive

</specifics>

<notes>
## Additional Context

User is not a developer but understands the intent clearly: reduce scope to wiki core without losing work. The approach should follow established developer practices for handling scope creep after the fact.

Priority order is equal across all three outcomes — this needs to achieve simplicity, preservation, and documentation equally well.

</notes>

---

*Phase: 24-feature-branch-extraction*
*Context gathered: 2026-01-18*
