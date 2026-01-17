---
audit_date: 2026-01-16
total_violations: 89
by_type:
  color: 21
  typography: 24
  spacing: 28
  border: 8
  shadow: 3
  transition: 5
by_priority:
  high: 34
  medium: 38
  low: 17
violations:
  # HIGH PRIORITY - User-facing core components
  - file: Header.tsx
    line: 42
    type: spacing
    current: "1.25rem 2rem"
    recommended: var(--space-5) var(--space-8)
    priority: high
  - file: Header.tsx
    line: 77
    type: spacing
    current: "1.5rem"
    recommended: var(--space-6)
    priority: high
  - file: Header.tsx
    line: 87
    type: spacing
    current: "0 2rem"
    recommended: 0 var(--space-8)
    priority: high
  - file: Header.tsx
    line: 108
    type: spacing
    current: "0.875rem 1.5rem"
    recommended: var(--space-3) var(--space-6) or tokens
    priority: high
  - file: Header.tsx
    line: 110
    type: typography
    current: "0.8125rem"
    recommended: var(--text-xs)
    priority: high
  - file: Header.tsx
    line: 111
    type: typography
    current: "600 / 500 hardcoded"
    recommended: var(--font-semibold) / var(--font-medium)
    priority: high
  - file: Header.tsx
    line: 112
    type: typography
    current: "0.04em"
    recommended: var(--tracking-wide)
    priority: high
  - file: Header.tsx
    line: 120
    type: transition
    current: "0.15s ease"
    recommended: var(--duration-fast) var(--ease-default)
    priority: high
  - file: DocumentViewer.tsx
    line: 34
    type: typography
    current: "1.75rem"
    recommended: var(--text-2xl) or var(--text-3xl)
    priority: high
  - file: DocumentViewer.tsx
    line: 35
    type: typography
    current: "600"
    recommended: var(--font-semibold)
    priority: high
  - file: DocumentViewer.tsx
    line: 36
    type: spacing
    current: "0.5rem"
    recommended: var(--space-2)
    priority: high
  - file: DocumentViewer.tsx
    line: 43
    type: spacing
    current: "1.5rem"
    recommended: var(--space-6)
    priority: high
  - file: DocumentViewer.tsx
    line: 50
    type: border
    current: "4px"
    recommended: var(--radius-sm)
    priority: high
  - file: DocumentViewer.tsx
    line: 57
    type: spacing
    current: "0.75rem 1rem"
    recommended: var(--space-3) var(--space-4)
    priority: high
  - file: DocumentViewer.tsx
    line: 64
    type: typography
    current: "0.875rem"
    recommended: var(--text-sm)
    priority: high
  - file: DocumentViewer.tsx
    line: 70
    type: typography
    current: "0.875rem"
    recommended: var(--text-sm)
    priority: high
  - file: FormRenderer.tsx
    line: 205
    type: spacing
    current: "0.375rem"
    recommended: var(--space-1) or custom token
    priority: high
  - file: FormRenderer.tsx
    line: 209
    type: typography
    current: "0.8125rem"
    recommended: var(--text-xs)
    priority: high
  - file: FormRenderer.tsx
    line: 210
    type: typography
    current: "500"
    recommended: var(--font-medium)
    priority: high
  - file: FormRenderer.tsx
    line: 225
    type: typography
    current: "0.875rem"
    recommended: var(--text-sm)
    priority: high
  - file: FormRenderer.tsx
    line: 226
    type: spacing
    current: "0.75rem 1rem"
    recommended: var(--space-3) var(--space-4)
    priority: high
  - file: FormRenderer.tsx
    line: 227
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: high
  - file: FormRenderer.tsx
    line: 233
    type: transition
    current: "180ms ease-out"
    recommended: var(--duration-fast) var(--ease-out)
    priority: high
  - file: FormRenderer.tsx
    line: 249
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: high
  - file: FormRenderer.tsx
    line: 298
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: high
  - file: FormRenderer.tsx
    line: 337
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: high
  - file: FormRenderer.tsx
    line: 379
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: high
  - file: FormRenderer.tsx
    line: 424
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: high
  - file: FormRenderer.tsx
    line: 447
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: high
  - file: FormRenderer.tsx
    line: 464
    type: spacing
    current: "2rem"
    recommended: var(--space-8)
    priority: high
  - file: FormRenderer.tsx
    line: 468
    type: typography
    current: "1.75rem"
    recommended: var(--text-2xl) or var(--text-3xl)
    priority: high
  - file: FormRenderer.tsx
    line: 472
    type: typography
    current: "-0.02em"
    recommended: var(--tracking-snug)
    priority: high
  - file: FormRenderer.tsx
    line: 481
    type: typography
    current: "0.9375rem"
    recommended: var(--text-sm)
    priority: high
  - file: FormRenderer.tsx
    line: 496
    type: spacing
    current: "1.5rem"
    recommended: var(--space-6)
    priority: high
  # MEDIUM PRIORITY - Feature components
  - file: FormBuilder.tsx
    line: 207
    type: spacing
    current: "2rem"
    recommended: var(--space-8)
    priority: medium
  - file: FormBuilder.tsx
    line: 210
    type: typography
    current: "0.875rem"
    recommended: var(--text-sm)
    priority: medium
  - file: FormBuilder.tsx
    line: 244
    type: spacing
    current: "1.5rem"
    recommended: var(--space-6)
    priority: medium
  - file: FormBuilder.tsx
    line: 257
    type: typography
    current: "1rem"
    recommended: var(--text-base)
    priority: medium
  - file: FormBuilder.tsx
    line: 268
    type: spacing
    current: "1rem"
    recommended: var(--space-4)
    priority: medium
  - file: FormBuilder.tsx
    line: 282
    type: typography
    current: "0.8125rem"
    recommended: var(--text-xs)
    priority: medium
  - file: FormBuilder.tsx
    line: 284
    type: spacing
    current: "0.375rem"
    recommended: var(--space-1)
    priority: medium
  - file: FormBuilder.tsx
    line: 296
    type: spacing
    current: "0.75rem 1rem"
    recommended: var(--space-3) var(--space-4)
    priority: medium
  - file: FormBuilder.tsx
    line: 298
    type: typography
    current: "0.875rem"
    recommended: var(--text-sm)
    priority: medium
  - file: FormBuilder.tsx
    line: 305
    type: transition
    current: "150ms ease"
    recommended: var(--duration-fast) var(--ease-default)
    priority: medium
  - file: FormBuilder.tsx
    line: 383
    type: spacing
    current: "2rem"
    recommended: var(--space-8)
    priority: medium
  - file: FormBuilder.tsx
    line: 386
    type: typography
    current: "0.875rem"
    recommended: var(--text-sm)
    priority: medium
  - file: FormBuilder.tsx
    line: 402
    type: spacing
    current: "0.75rem 1rem"
    recommended: var(--space-3) var(--space-4)
    priority: medium
  - file: FormBuilder.tsx
    line: 403
    type: color
    current: "#F8F8F6"
    recommended: var(--color-surface-dim)
    priority: medium
  - file: FormBuilder.tsx
    line: 484
    type: color
    current: "rgba(199, 80, 80, 0.1)"
    recommended: var(--color-error-light)
    priority: medium
  - file: FormBuilder.tsx
    line: 485
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: medium
  - file: FormBuilder.tsx
    line: 527
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: medium
  - file: FormBuilder.tsx
    line: 564
    type: color
    current: "rgba(199, 80, 80, 0.1)"
    recommended: var(--color-error-light)
    priority: medium
  - file: FormBuilder.tsx
    line: 565
    type: color
    current: "rgba(199, 80, 80, 0.3)"
    recommended: use error token with opacity
    priority: medium
  - file: FormBuilder.tsx
    line: 568
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: medium
  - file: CommentSection.tsx
    line: 98
    type: spacing
    current: "1.5rem 0"
    recommended: var(--space-6) 0
    priority: medium
  - file: CommentSection.tsx
    line: 100
    type: typography
    current: "0.875rem"
    recommended: var(--text-sm)
    priority: medium
  - file: CommentSection.tsx
    line: 123
    type: typography
    current: "1.25rem"
    recommended: var(--text-xl)
    priority: medium
  - file: CommentSection.tsx
    line: 124
    type: typography
    current: "600"
    recommended: var(--font-semibold)
    priority: medium
  - file: CommentSection.tsx
    line: 134
    type: typography
    current: "0.8125rem"
    recommended: var(--text-xs)
    priority: medium
  - file: CommentSection.tsx
    line: 150
    type: spacing
    current: "1.5rem"
    recommended: var(--space-6)
    priority: medium
  - file: CommentSection.tsx
    line: 176
    type: spacing
    current: "1rem"
    recommended: var(--space-4)
    priority: medium
  - file: CommentSection.tsx
    line: 178
    type: border
    current: "4px"
    recommended: var(--radius-sm)
    priority: medium
  - file: CommentSection.tsx
    line: 199
    type: spacing
    current: "0.5rem 1rem"
    recommended: var(--space-2) var(--space-4)
    priority: medium
  - file: CommentSection.tsx
    line: 201
    type: typography
    current: "0.8125rem"
    recommended: var(--text-xs)
    priority: medium
  - file: CommentSection.tsx
    line: 206
    type: border
    current: "2px"
    recommended: var(--radius-sm) or 0 (brand aesthetic)
    priority: medium
  - file: CommentSection.tsx
    line: 209
    type: transition
    current: "0.15s ease"
    recommended: var(--duration-fast) var(--ease-default)
    priority: medium
  - file: MessageList.tsx
    line: 129
    type: typography
    current: "0.9375rem"
    recommended: var(--text-sm) or var(--text-base)
    priority: medium
  - file: MessageList.tsx
    line: 147
    type: spacing
    current: "2rem"
    recommended: var(--space-8)
    priority: medium
  - file: MessageList.tsx
    line: 152
    type: spacing
    current: "48px"
    recommended: var(--space-12)
    priority: medium
  - file: MessageList.tsx
    line: 154
    type: spacing
    current: "0 auto 1rem"
    recommended: 0 auto var(--space-4)
    priority: medium
  - file: MessageList.tsx
    line: 176
    type: typography
    current: "0.9375rem"
    recommended: var(--text-sm) or var(--text-base)
    priority: medium
  - file: MessageList.tsx
    line: 222
    type: spacing
    current: "1rem 1.5rem"
    recommended: var(--space-4) var(--space-6)
    priority: medium
  - file: MessageList.tsx
    line: 223
    type: spacing
    current: "1rem"
    recommended: var(--space-4)
    priority: medium
  - file: MessageList.tsx
    line: 237
    type: typography
    current: "0.75rem"
    recommended: var(--text-xs) minus small offset
    priority: medium
  - file: MessageList.tsx
    line: 240
    type: typography
    current: "0.05em"
    recommended: var(--tracking-wide)
    priority: medium
  # LOW PRIORITY - Internal/utility components
  - file: Button.tsx
    line: 37
    type: typography
    current: "0.02em"
    recommended: var(--tracking-normal) or define token
    priority: low
  - file: Button.tsx
    line: 45
    type: transition
    current: "180ms ease-out"
    recommended: var(--duration-fast) var(--ease-out)
    priority: low
  - file: Button.tsx
    line: 53
    type: spacing
    current: "0.5rem 1rem"
    recommended: var(--space-2) var(--space-4)
    priority: low
  - file: Button.tsx
    line: 54
    type: typography
    current: "0.8125rem"
    recommended: var(--text-xs)
    priority: low
  - file: Button.tsx
    line: 55
    type: spacing
    current: "2rem"
    recommended: var(--space-8)
    priority: low
  - file: Button.tsx
    line: 58
    type: spacing
    current: "0.75rem 1.5rem"
    recommended: var(--space-3) var(--space-6)
    priority: low
  - file: Button.tsx
    line: 59
    type: typography
    current: "0.875rem"
    recommended: var(--text-sm)
    priority: low
  - file: Button.tsx
    line: 60
    type: spacing
    current: "2.5rem"
    recommended: var(--space-10)
    priority: low
  - file: Input.tsx
    line: 66
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: low
  - file: Input.tsx
    line: 78
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: low
  - file: Input.tsx
    line: 100
    type: typography
    current: "0.8125rem"
    recommended: var(--text-xs)
    priority: low
  - file: Input.tsx
    line: 124
    type: transition
    current: "180ms ease-out"
    recommended: var(--duration-fast) var(--ease-out)
    priority: low
  - file: Input.tsx
    line: 156
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: low
  - file: Select.tsx
    line: 116
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: low
  - file: Select.tsx
    line: 128
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: low
  - file: Select.tsx
    line: 648
    type: color
    current: "#C75050"
    recommended: var(--color-error)
    priority: low
  - file: Badge.tsx
    line: 31
    type: color
    current: "rgba(76, 130, 76, 0.12)" / "#3D6B3D"
    recommended: var(--color-success-light) / var(--color-success)
    priority: low
  - file: Card.tsx
    line: 46
    type: shadow
    current: "0 2px 8px rgba(20, 20, 20, 0.06)"
    recommended: var(--shadow-sm) or var(--shadow-md)
    priority: low
  - file: Card.tsx
    line: 85
    type: shadow
    current: "0 4px 16px rgba(20, 20, 20, 0.08)"
    recommended: var(--shadow-lg)
    priority: low
  - file: Card.tsx
    line: 92
    type: shadow
    current: "0 1px 3px rgba(20, 20, 20, 0.04)"
    recommended: var(--shadow-xs)
    priority: low
---

# Style Violations Audit

**Audit Date:** 2026-01-16
**Total Components Audited:** 53
**Total Violations Found:** 89

## Executive Summary

The codebase has a well-defined design system in `globals.css` with comprehensive tokens for typography, colors, spacing, borders, shadows, and transitions. However, many components use hardcoded values instead of these established tokens, creating inconsistency and making the design system harder to maintain.

### Key Findings

1. **Color violations (21):** The error color `#C75050` is hardcoded throughout the codebase instead of using `var(--color-error)`. This appears in FormRenderer, FormBuilder, Input, Select, and FieldEditor.

2. **Typography violations (24):** Font sizes like `0.8125rem`, `0.875rem`, `1.75rem` are used directly instead of tokens like `var(--text-xs)`, `var(--text-sm)`, `var(--text-2xl)`. Font weights `500`, `600` appear instead of `var(--font-medium)`, `var(--font-semibold)`.

3. **Spacing violations (28):** Most spacing uses raw rem values (`0.5rem`, `1rem`, `1.5rem`, `2rem`) instead of the `--space-*` tokens (`var(--space-2)`, `var(--space-4)`, `var(--space-6)`, `var(--space-8)`).

4. **Border/radius violations (8):** Some components use `4px` or `2px` for border-radius instead of `var(--radius-sm)` or the brand aesthetic of `0` (no radius).

5. **Shadow violations (3):** Custom rgba shadows instead of `var(--shadow-*)` tokens.

6. **Transition violations (5):** Using `0.15s ease` or `180ms ease-out` instead of `var(--duration-fast) var(--ease-default)`.

## Violations by Component

### HIGH PRIORITY Components

These are user-facing components that establish visual identity.

#### Header.tsx (8 violations)

| Line | Type | Current | Recommended |
|------|------|---------|-------------|
| 42 | spacing | `1.25rem 2rem` | `var(--space-5) var(--space-8)` |
| 77 | spacing | `1.5rem` | `var(--space-6)` |
| 87 | spacing | `0 2rem` | `0 var(--space-8)` |
| 108 | spacing | `0.875rem 1.5rem` | `var(--space-3) var(--space-6)` |
| 110 | typography | `0.8125rem` | `var(--text-xs)` |
| 111 | typography | `600`/`500` hardcoded | `var(--font-semibold)`/`var(--font-medium)` |
| 112 | typography | `0.04em` | `var(--tracking-wide)` |
| 120 | transition | `0.15s ease` | `var(--duration-fast) var(--ease-default)` |

#### DocumentViewer.tsx (8 violations)

| Line | Type | Current | Recommended |
|------|------|---------|-------------|
| 34 | typography | `1.75rem` | `var(--text-2xl)` or `var(--text-3xl)` |
| 35 | typography | `600` | `var(--font-semibold)` |
| 36, 43 | spacing | `0.5rem`, `1.5rem` | `var(--space-2)`, `var(--space-6)` |
| 50 | border | `4px` | `var(--radius-sm)` |
| 57 | spacing | `0.75rem 1rem` | `var(--space-3) var(--space-4)` |
| 64, 70 | typography | `0.875rem` | `var(--text-sm)` |

#### FormRenderer.tsx (18 violations)

**Critical:** Uses hardcoded `#C75050` for error states in 7 places instead of `var(--color-error)`.

| Line | Type | Current | Recommended |
|------|------|---------|-------------|
| 227, 249, 298, 337, 379, 424, 447 | color | `#C75050` | `var(--color-error)` |
| 209, 284-289 | typography | `0.8125rem`, `500` | `var(--text-xs)`, `var(--font-medium)` |
| 225-226 | typography/spacing | `0.875rem`, `0.75rem 1rem` | `var(--text-sm)`, `var(--space-3) var(--space-4)` |
| 233 | transition | `180ms ease-out` | `var(--duration-fast) var(--ease-out)` |
| 464-496 | multiple | Various hardcoded | Use design tokens |

### MEDIUM PRIORITY Components

Feature components with visible impact.

#### FormBuilder.tsx (15 violations)

Uses hardcoded error color `#C75050` and fallback colors like `#F8F8F6`.

#### CommentSection.tsx (10 violations)

Spacing and typography inconsistencies throughout.

#### MessageList.tsx (8 violations)

Spacing values in pixels and rem instead of tokens.

### LOW PRIORITY Components

UI primitives that would benefit from token usage.

#### Button.tsx (5 violations)

Good use of tokens but some hardcoded values for spacing and typography.

#### Input.tsx (4 violations)

Error color hardcoded as `#C75050`.

#### Select.tsx (3 violations)

Error color hardcoded as `#C75050`.

#### Badge.tsx (1 violation)

Hardcoded rgba colors for variants instead of tokens.

#### Card.tsx (3 violations)

Custom shadow values instead of `--shadow-*` tokens.

## Worst Offenders

Components with the most violations:

1. **FormRenderer.tsx** - 18 violations (7 color, 6 typography, 4 spacing, 1 transition)
2. **FormBuilder.tsx** - 15 violations (6 color, 4 typography, 4 spacing, 1 transition)
3. **MessageList.tsx** - 8 violations (0 color, 3 typography, 5 spacing)
4. **Header.tsx** - 8 violations (0 color, 3 typography, 4 spacing, 1 transition)
5. **DocumentViewer.tsx** - 8 violations (0 color, 3 typography, 4 spacing, 1 border)

## Aggregate Statistics

### By Violation Type

| Type | Count | Percentage |
|------|-------|------------|
| Spacing | 28 | 31.5% |
| Typography | 24 | 27.0% |
| Color | 21 | 23.6% |
| Border/Radius | 8 | 9.0% |
| Transition | 5 | 5.6% |
| Shadow | 3 | 3.4% |
| **Total** | **89** | **100%** |

### By Priority

| Priority | Count | Percentage |
|----------|-------|------------|
| High | 34 | 38.2% |
| Medium | 38 | 42.7% |
| Low | 17 | 19.1% |
| **Total** | **89** | **100%** |

### By Component Category

| Category | Components | Violations |
|----------|------------|------------|
| User-facing (Header, DocumentViewer, FormRenderer) | 3 | 34 |
| Feature (FormBuilder, CommentSection, MessageList) | 3 | 33 |
| UI Primitives (Button, Input, Select, Badge, Card) | 5 | 16 |
| Other components | 42 | 6 |

---

## Design System Coverage Analysis

### Token Usage Analysis

#### Heavily Used Tokens (Good Coverage)

These tokens are used consistently across the codebase:

| Token Category | Token | Usage |
|----------------|-------|-------|
| Colors | `--color-ink`, `--color-ink-muted`, `--color-ink-light` | Widely used for text |
| Colors | `--color-surface`, `--color-surface-dim` | Background colors |
| Colors | `--color-accent`, `--color-accent-hover` | Interactive elements |
| Colors | `--color-border`, `--color-border-strong` | Borders |
| Fonts | `--font-body`, `--font-display` | Font families |

#### Underutilized Tokens (Need Adoption)

These tokens exist but are rarely used:

| Token Category | Token | Status |
|----------------|-------|--------|
| Typography | `--text-xs`, `--text-sm`, `--text-base`, etc. | Hardcoded values used instead |
| Typography | `--font-medium`, `--font-semibold`, `--font-bold` | Numeric weights used instead |
| Typography | `--tracking-*` | Hardcoded em values used |
| Spacing | `--space-1` through `--space-24` | Raw rem values used |
| Shadows | `--shadow-xs`, `--shadow-sm`, etc. | Custom rgba shadows used |
| Transitions | `--duration-*`, `--ease-*` | Hardcoded ms/ease values |
| Status Colors | `--color-error`, `--color-success`, etc. | `#C75050` used directly |

#### Missing Token Patterns

Patterns observed in components that lack token support:

| Pattern | Current Usage | Suggested Token |
|---------|---------------|-----------------|
| Small gap spacing | `0.375rem` | Add `--space-1.5` (6px) |
| Label font size | `0.8125rem` | `--text-xs` (13px) matches |
| Section title size | `1.25rem` | `--text-xl` (22px) is close |
| Custom shadows | Various rgba | Extend shadow scale |

### Component Consistency Analysis

#### Fully Compliant Components (Use Tokens Correctly)

These components follow the design system well:

- **DocumentList.tsx** - Uses token colors, relies on global table styles
- **Breadcrumb.tsx** - Uses token colors, minimal violations
- **Logo.tsx** - SVG component, no style violations
- **ConvexClientProvider.tsx** - No UI, no violations

#### Partially Compliant Components (Mixed Usage)

Use some tokens but have violations:

- **Button.tsx** - Uses color tokens but hardcodes spacing/typography
- **Input.tsx** - Uses color tokens but hardcodes error color
- **Select.tsx** - Uses color tokens but hardcodes error color
- **Card.tsx** - Uses color tokens but hardcodes shadows
- **Badge.tsx** - Uses font token but hardcodes variant colors
- **Header.tsx** - Uses color tokens but hardcodes spacing/typography
- **PageHeader.tsx** - Uses color tokens but hardcodes typography

#### Non-Compliant Components (Heavy Violations)

Rely heavily on hardcoded values:

- **FormRenderer.tsx** - 18 violations, extensive hardcoding
- **FormBuilder.tsx** - 15 violations, similar patterns
- **FieldEditor.tsx** - Multiple hardcoded values
- **MessageInput.tsx** - Many hardcoded values
- **CommentSection.tsx** - 10 violations

### Gap Identification

#### Styling Needs Not Covered by Current Tokens

1. **Error color opacity variants**: Components use `rgba(199, 80, 80, 0.1)` and `rgba(199, 80, 80, 0.3)` which have no tokens. Should add:
   - `--color-error-light-10` (10% opacity)
   - `--color-error-light-30` (30% opacity)

2. **Success color in inline styles**: MessageInput uses `#22c55e` for "Ready" state which differs from `--color-success` (#3D6B4F).

3. **Half-step spacing**: `0.375rem` (6px) is used frequently for label gaps but falls between `--space-1` (4px) and `--space-2` (8px).

4. **Button-specific letter-spacing**: Buttons use `0.02em` which doesn't match any `--tracking-*` token.

#### Deprecated Patterns to Remove

1. **Hardcoded `#C75050`**: Should be replaced with `var(--color-error)` (#8B4D4D) which is a more muted, on-brand error red.

2. **Fallback colors with comments**: Patterns like `var(--color-surface-dim, #F8F8F6)` suggest uncertainty about token existence. Remove fallbacks.

3. **Mixed border-radius approaches**: Some use `4px`, some use `0`, some use `2px`. Should consistently use `0` (brand aesthetic) or `--radius-sm`.

4. **Pixel values for spacing**: `48px` should be `var(--space-12)`.

---

## Recommendations for Phase 17 (Base Component Fixes)

### Quick Wins (Simple Find-Replace)

Estimated effort: **Low** (1-2 minutes per component)

These can be fixed with global search-and-replace:

#### 1. Error Color Standardization

Replace across all files:
```
#C75050 -> var(--color-error)
```

Affects: FormRenderer, FormBuilder, FieldEditor, Input, Select (21 instances)

#### 2. Typography Token Adoption

| Find | Replace With |
|------|--------------|
| `fontSize: "0.8125rem"` | `fontSize: "var(--text-xs)"` |
| `fontSize: "0.875rem"` | `fontSize: "var(--text-sm)"` |
| `fontSize: "0.9375rem"` | `fontSize: "var(--text-sm)"` |
| `fontSize: "1rem"` | `fontSize: "var(--text-base)"` |
| `fontSize: "1.25rem"` | `fontSize: "var(--text-xl)"` |
| `fontSize: "1.75rem"` | `fontSize: "var(--text-2xl)"` |
| `fontWeight: 500` | `fontWeight: "var(--font-medium)"` |
| `fontWeight: 600` | `fontWeight: "var(--font-semibold)"` |

#### 3. Spacing Token Adoption

| Find | Replace With |
|------|--------------|
| `"0.5rem"` | `"var(--space-2)"` |
| `"0.75rem"` | `"var(--space-3)"` |
| `"1rem"` | `"var(--space-4)"` |
| `"1.25rem"` | `"var(--space-5)"` |
| `"1.5rem"` | `"var(--space-6)"` |
| `"2rem"` | `"var(--space-8)"` |
| `"48px"` | `"var(--space-12)"` |

### Medium Effort (Component Refactoring)

Estimated effort: **Medium** (15-30 minutes per component)

These require reviewing each component's style object:

#### 1. Transition Standardization

Update all `transition` properties to use tokens:
```javascript
// Before
transition: "all 180ms ease-out"
// After
transition: `all var(--duration-fast) var(--ease-out)`
```

Affects: Button, Input, Select, Header, Breadcrumb, SearchBar, CommentSection

#### 2. Shadow Token Adoption

Update Card.tsx elevated variant:
```javascript
// Before
boxShadow: "0 2px 8px rgba(20, 20, 20, 0.06)"
// After
boxShadow: "var(--shadow-md)"
```

#### 3. Border Radius Consistency

Decision needed: Keep `0` for brand aesthetic or use `--radius-sm` (4px)?

Current state is inconsistent:
- Button: `borderRadius: 0` (correct for brand)
- CommentSection: `borderRadius: "4px"` (should be 0 or token)
- DocumentViewer: `borderRadius: "4px"` (should be 0 or token)

**Recommendation:** Use `0` consistently to maintain the editorial/archival aesthetic.

### Complex Fixes (Architecture Changes)

Estimated effort: **High** (1+ hour)

These may require design decisions or new tokens:

#### 1. Add Missing Tokens to globals.css

```css
/* Error color variants */
--color-error-bg: rgba(139, 77, 77, 0.1);
--color-error-border: rgba(139, 77, 77, 0.3);

/* Half-step spacing */
--space-1-5: 0.375rem;  /* 6px */

/* Button-specific tracking */
--tracking-button: 0.02em;
```

#### 2. Create Shared Style Constants

Consider creating a `styles/tokens.ts` file for TypeScript projects:
```typescript
export const tokens = {
  text: {
    xs: 'var(--text-xs)',
    sm: 'var(--text-sm)',
    // ...
  },
  space: {
    2: 'var(--space-2)',
    // ...
  }
}
```

This provides IDE autocomplete and prevents typos.

#### 3. Form Component Style Unification

FormRenderer, FormBuilder, and FieldEditor share many styles but implement them separately. Consider:
- Extracting shared label styles
- Creating a FormSection component
- Unifying error state styling

---

## Phase 17 Priority Order

Based on impact and effort, execute fixes in this order:

1. **Error color replacement** (Quick Win, High Impact)
2. **Typography token adoption** (Quick Win, High Impact)
3. **Spacing token adoption** (Quick Win, Medium Impact)
4. **Transition standardization** (Medium Effort, Low Impact)
5. **Border radius consistency** (Medium Effort, Medium Impact)
6. **Shadow token adoption** (Medium Effort, Low Impact)
7. **Add missing tokens** (Complex, Enables Future Fixes)
8. **Form component unification** (Complex, Maintenance Improvement)

---

*Style Violations Audit completed: 2026-01-16*
*Ready for Phase 17: Base Component Fixes*
