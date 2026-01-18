# Phase 17: Base Component Fixes - Context

**Gathered:** 2026-01-17
**Status:** Ready for planning

<vision>
## How This Should Work

Components should just *work* — no visual surprises, no fighting with props or overrides. Every button, input, and card looks the same across the entire app. When building new features, developers grab a component and it comes out right automatically.

This is proactive foundation work during the build phase, addressing the 89 style violations identified in Phase 16 before inconsistencies compound. Fix what's there, then put guardrails in place so it stays clean.

</vision>

<essential>
## What Must Be Nailed

- **Visual consistency everywhere** — Every instance of a component looks identical, matching the brand aesthetic (ink/paper/bronze palette, 0 border-radius, proper typography)
- **Smart defaults** — Components work correctly out of the box without needing extra props or overrides
- **Prevention over just fixing** — Address the 34 high-priority violations AND establish enforcement so new code stays consistent

</essential>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for enforcement layer. Whatever technical approach works best (lint rules, component constraints, etc.) is fine as long as it prevents future drift.

</specifics>

<notes>
## Additional Context

This is proactive cleanup, not reactive problem-solving. No terribly visible inconsistencies yet because the app is still being built. The goal is to solidify the foundation now while it's still manageable.

Phase 16 documented 89 style violations with 34 marked high-priority. Key issues include:
- Error color `#C75050` should be `var(--color-error)` (#8B4D4D)
- Border-radius should be `0` consistently
- Typography/spacing tokens exist but need broader adoption

</notes>

---

*Phase: 17-base-component-fixes*
*Context gathered: 2026-01-17*
