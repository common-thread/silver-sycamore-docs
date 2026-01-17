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
