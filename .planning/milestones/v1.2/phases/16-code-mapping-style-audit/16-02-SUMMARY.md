# Plan Summary: 16-02 Style Violations Audit

## Overview

| Attribute | Value |
|-----------|-------|
| Plan | 16-02-PLAN.md |
| Phase | 16-code-mapping-style-audit |
| Start | 2026-01-16T17:45:00Z |
| End | 2026-01-16T18:05:00Z |
| Duration | ~20 minutes |
| Status | COMPLETE |

## Tasks Completed

| Task | Status | Commit |
|------|--------|--------|
| Audit components against design tokens | Done | be22d85 |
| Document design system coverage and gaps | Done | 60cb384 |

## Deliverables

### STYLE-VIOLATIONS.md

Comprehensive style audit document containing:

1. **YAML Frontmatter** - Machine-parseable violation data
   - 89 total violations catalogued
   - Violations indexed by file, line, type, current value, recommended value, and priority

2. **Executive Summary** - High-level findings
   - Spacing violations: 28 (31.5%)
   - Typography violations: 24 (27.0%)
   - Color violations: 21 (23.6%)
   - Border/radius violations: 8 (9.0%)
   - Transition violations: 5 (5.6%)
   - Shadow violations: 3 (3.4%)

3. **Violations by Component** - Detailed breakdown
   - HIGH: Header, DocumentViewer, FormRenderer (34 violations)
   - MEDIUM: FormBuilder, CommentSection, MessageList (38 violations)
   - LOW: Button, Input, Select, Badge, Card (17 violations)

4. **Worst Offenders**
   - FormRenderer.tsx: 18 violations
   - FormBuilder.tsx: 15 violations
   - MessageList.tsx: 8 violations
   - Header.tsx: 8 violations
   - DocumentViewer.tsx: 8 violations

5. **Design System Coverage Analysis**
   - Token usage analysis (heavily used vs underutilized)
   - Component consistency analysis (compliant, partial, non-compliant)
   - Gap identification (missing tokens, deprecated patterns)

6. **Phase 17 Recommendations**
   - Quick wins: Error color, typography, spacing token adoption
   - Medium effort: Transition, shadow, border radius standardization
   - Complex: Add missing tokens, create shared constants, unify forms

## Key Insights

### Critical Finding: Error Color
The hardcoded `#C75050` error color appears 21 times across 5 components. Should be replaced with `var(--color-error)` which is the design-system sanctioned `#8B4D4D`.

### Token Adoption Gap
The design system has comprehensive tokens but components prefer hardcoded values:
- `--space-*` tokens exist but components use `1rem`, `1.5rem` directly
- `--text-*` tokens exist but components use `0.875rem`, `0.8125rem` directly
- `--font-*` weight tokens exist but components use `500`, `600` directly

### Consistency Pattern
Color tokens (`--color-ink`, `--color-accent`, `--color-border`) are well-adopted. Typography and spacing tokens are not.

## Files Changed

- Created: `.planning/phases/16-code-mapping-style-audit/STYLE-VIOLATIONS.md`

## Impact on Phase 17

This audit provides:
1. **Prioritized fix list** - 89 violations ranked by impact
2. **Find-replace tables** - Enables rapid implementation
3. **Decision points** - Border radius approach needs stakeholder input
4. **Architecture recommendations** - Token constants file, form unification

## Notes

- Audit covered all 53 components in `app/src/components/`
- Line numbers are approximate (may shift with edits)
- Some violations share patterns (e.g., all form error colors)
- Phase 17 can batch-fix entire violation categories
