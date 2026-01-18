---
layout: default
title: Editorial Archive - Main Style Guide
---

# Editorial Archive Style Guide

The foundation design system for Silver Sycamore applications. A warm, scholarly, effortlessly readable aesthetic.

---

## Design Philosophy

Think Typeform's approachable UI meets editorial magazine layouts. The aesthetic balances professionalism with warmth, creating an environment where users feel comfortable spending extended time.

**Core Tenets:**
- **Warmth over sterility** - Avoid cold whites and stark contrasts
- **Readability first** - Typography sized for comfort, not density
- **Subtle refinement** - Interactions that feel polished, not flashy
- **Timeless appeal** - Classic patterns that won't feel dated

---

## Typography

### Font Families

| Token | Font | Fallbacks | Usage |
|-------|------|-----------|-------|
| `--font-display` | Playfair Display | Georgia, Times New Roman, serif | Headings, titles |
| `--font-body` | DM Sans | system-ui, sans-serif | Body text, UI elements |
| `--font-mono` | JetBrains Mono | monospace | Code, technical content |

### Type Scale

Generous sizing optimized for comfortable reading:

| Token | Size | Usage |
|-------|------|-------|
| `--text-xs` | 13px | Labels, metadata |
| `--text-sm` | 15px | Secondary text, captions |
| `--text-base` | 17px | Body text (intentionally larger than 16px) |
| `--text-lg` | 19px | Lead paragraphs |
| `--text-xl` | 22px | H4 headings |
| `--text-2xl` | 26px | H3 headings |
| `--text-3xl` | 32px | H2 headings |
| `--text-4xl` | 40px | H1 headings |
| `--text-5xl` | 52px | Display, hero text |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--leading-tight` | 1.2 | Headings |
| `--leading-snug` | 1.35 | Subheadings |
| `--leading-normal` | 1.5 | UI text |
| `--leading-relaxed` | 1.7 | Body default |
| `--leading-loose` | 1.85 | Long-form prose |

---

## Color System

### Ink (Text Hierarchy)

Warm undertones throughout, avoiding pure black.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-ink-black` | #0F0F0F | Darkest emphasis |
| `--color-ink` | #1A1A1A | Primary text |
| `--color-ink-dark` | #2D2D2D | Secondary headings |
| `--color-ink-mid` | #404040 | Body alternative |
| `--color-ink-light` | #5C5C5C | Secondary body |
| `--color-ink-muted` | #7A7A7A | Tertiary, captions |
| `--color-ink-subtle` | #A0A0A0 | Placeholders, disabled |

### Paper (Backgrounds)

Warm off-whites that avoid clinical coldness.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-paper-white` | #FFFFFF | Cards, modals, inputs |
| `--color-paper` | #FAF9F7 | Page background |
| `--color-paper-warm` | #F5F4F2 | Section backgrounds, hover |
| `--color-paper-mid` | #E8E8E6 | Dividers, skeletons |
| `--color-paper-dark` | #D4D4D2 | Strong dividers, badges |

### Champagne (Accents)

Warm golden tones for emphasis, used sparingly.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-champagne` | #C9B896 | Selection, focus rings |
| `--color-champagne-light` | #E5DFD1 | Accent backgrounds |
| `--color-champagne-dark` | #A69A7A | List markers, borders |
| `--color-champagne-deep` | #8B7355 | Primary accent, links |
| `--color-accent-hover` | #6B5740 | Accent hover state |

### Status Colors

| Status | Base | Light | Dark |
|--------|------|-------|------|
| Success | #3D6B4F | #E8F0EB | #2D5039 |
| Warning | #8B7355 | #F5F0E8 | #6B5740 |
| Error | #8B4D4D | #F5E8E8 | #6B3939 |
| Info | #4A6B8A | #E8EEF5 | #3A5570 |

---

## Spacing

Consistent 4px base unit system:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps |
| `--space-2` | 8px | Small gaps |
| `--space-3` | 12px | Default button padding |
| `--space-4` | 16px | Default section gap |
| `--space-5` | 20px | Card padding |
| `--space-6` | 24px | Section margins |
| `--space-8` | 32px | Large gaps |
| `--space-10` | 40px | Section separators |
| `--space-12` | 48px | Page sections |

---

## Borders and Radius

### Border Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-border` | #E5E5E3 | Default borders |
| `--color-border-strong` | #D1D1CF | Emphasized borders |
| `--color-border-subtle` | #EFEFED | Subtle dividers |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Badges, code |
| `--radius-md` | 6px | Buttons, inputs |
| `--radius-lg` | 8px | Cards |
| `--radius-xl` | 12px | Modals, panels |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows

Subtle depth without harsh contrasts:

| Token | Usage |
|-------|-------|
| `--shadow-xs` | Subtle lift |
| `--shadow-sm` | Default cards |
| `--shadow-md` | Hover states |
| `--shadow-lg` | Dropdowns |
| `--shadow-xl` | Modals |
| `--shadow-champagne` | Accent emphasis |

---

## Component Guidelines

### Buttons

- Primary: Solid ink background, white text
- Secondary: Outlined, transparent background
- Ghost: No border, minimal styling
- Accent: Champagne-deep background for CTAs

### Cards

- White background with subtle border
- Hover: Lift effect with champagne border hint
- Padding: `--space-5` to `--space-6`

### Forms

- Inputs: White background, subtle border
- Focus: Champagne focus ring (3px spread)
- Labels: Uppercase, tracking-wider, muted color

### Tables

- Warm paper header background
- Alternating row hover states
- Border-collapse with subtle separators
