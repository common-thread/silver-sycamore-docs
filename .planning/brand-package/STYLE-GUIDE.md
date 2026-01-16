# Silver Sycamore Brand Style Guide

Complete visual identity documentation for implementing the Silver Sycamore brand.

---

## Brand Overview

### Aesthetic

**Editorial Archive** - warm, scholarly, effortlessly readable

The Silver Sycamore brand evokes the feeling of a beautifully curated archive or a well-designed editorial publication. It balances warmth with sophistication, creating interfaces that feel timeless rather than trendy.

### Core Principles

1. **Warmth** - Avoid cold, clinical whites. Use warm off-whites and champagne accents.
2. **Readability** - Generous typography sizing for comfortable, extended reading.
3. **Refinement** - Subtle interactions and transitions. Never jarring or flashy.
4. **Timelessness** - Classic typographic hierarchy. Avoid trendy design patterns.

### Inspiration

- Typeform's conversational, approachable UI
- Editorial magazine layouts
- Library and archive aesthetics
- Warm, scholarly environments

---

## Logo System

### Logo Variants

The logo system consists of four variants for different contexts:

| Variant | File | Aspect Ratio | Original Size | Use Case |
|---------|------|--------------|---------------|----------|
| **Full Logo** | `logo-full.png` | 1.5:1 | 1536 x 1024 | Primary mark. Hero sections, landing pages |
| **Icon Mark** | `logo-icon.png` | 2.13:1 | 1436 x 673 | Favicons, app icons, social avatars |
| **Wordmark** | `logo-text.png` | 5.9:1 | 1511 x 256 | Horizontal layouts, footers, compact headers |
| **Horizontal** | `logo-horizontal.png` | 4:1 | 4000 x 1000 | Navigation bars, header lockups |

### Recommended Sizes

**Full Logo (1.5:1 aspect)**
| Size | Dimensions | Context |
|------|------------|---------|
| Small | 72 x 48px | Header usage |
| Medium | 120 x 80px | Standard display |
| Large | 225 x 150px | Hero sections |

**Icon Mark (2.13:1 aspect)**
| Size | Dimensions | Context |
|------|------------|---------|
| Small | 64 x 30px | Compact headers |
| Medium | 96 x 45px | Standard display |
| Large | 256 x 120px | Feature sections |

**Wordmark (5.9:1 aspect)**
| Size | Dimensions | Context |
|------|------------|---------|
| Small | 142 x 24px | Minimum legible |
| Medium | 177 x 30px | Standard header |
| Large | 295 x 50px | Large display |

**Horizontal Lockup (4:1 aspect)**
| Size | Dimensions | Context |
|------|------------|---------|
| Small | 160 x 40px | Compact headers |
| Medium | 240 x 60px | Standard display |
| Large | 400 x 100px | Hero sections |

### Minimum Sizes

- **Full logo:** 48px height minimum
- **Wordmark:** 24px height minimum
- **Icon mark:** 30px height minimum
- **Horizontal:** 40px height minimum

Below these sizes, legibility suffers. Use the icon mark for very small applications.

### Clear Space

Maintain clear space equal to the height of the "S" in the wordmark on all sides. Never place other elements within this exclusion zone.

### Background Guidelines

- Use on light backgrounds only (paper-white through paper-warm)
- Ensure sufficient contrast for legibility
- Avoid busy or patterned backgrounds

### Prohibited Uses

- Never stretch or distort
- Never rotate
- Never add effects (shadows, glows, outlines)
- Never change colors
- Never place on low-contrast backgrounds
- Always use provided assets

---

## Color Palette

### Ink System (Text Colors)

For text hierarchy with warm undertones.

| Name | Hex | Token | Usage |
|------|-----|-------|-------|
| **Black** | `#0F0F0F` | `--color-ink-black` | Darkest text, high emphasis |
| **Ink** | `#1A1A1A` | `--color-ink` | Primary text color |
| **Dark** | `#2D2D2D` | `--color-ink-dark` | Secondary headings |
| **Mid** | `#404040` | `--color-ink-mid` | Body text alternative |
| **Light** | `#5C5C5C` | `--color-ink-light` | Secondary body text |
| **Muted** | `#7A7A7A` | `--color-ink-muted` | Captions, tertiary text |
| **Subtle** | `#A0A0A0` | `--color-ink-subtle` | Placeholders, disabled |

### Paper System (Background Colors)

For background layers with warm off-whites.

| Name | Hex | Token | Usage |
|------|-----|-------|-------|
| **White** | `#FFFFFF` | `--color-paper-white` | Cards, modals, inputs |
| **Paper** | `#FAF9F7` | `--color-paper` | Page background |
| **Warm** | `#F5F4F2` | `--color-paper-warm` | Section backgrounds, hover |
| **Mid** | `#E8E8E6` | `--color-paper-mid` | Dividers, skeletons |
| **Dark** | `#D4D4D2` | `--color-paper-dark` | Strong dividers |

### Champagne Accents

Warm golden tones for emphasis and interaction.

| Name | Hex | Token | Usage |
|------|-----|-------|-------|
| **Champagne** | `#C9B896` | `--color-champagne` | Focus rings, selection |
| **Light** | `#E5DFD1` | `--color-champagne-light` | Accent backgrounds |
| **Dark** | `#A69A7A` | `--color-champagne-dark` | Accent borders, markers |
| **Deep** | `#8B7355` | `--color-champagne-deep` | Primary accent, links |

**Accent Aliases:**
- `--color-accent`: `#8B7355` (champagne-deep)
- `--color-accent-hover`: `#6B5740` (darker for hover)
- `--color-accent-light`: `#E5DFD1` (champagne-light)

### Status Colors

Semantic colors for feedback and state.

| Status | Main | Light | Dark |
|--------|------|-------|------|
| **Success** | `#3D6B4F` | `#E8F0EB` | `#2D5039` |
| **Warning** | `#8B7355` | `#F5F0E8` | `#6B5740` |
| **Error** | `#8B4D4D` | `#F5E8E8` | `#6B3939` |
| **Info** | `#4A6B8A` | `#E8EEF5` | `#3A5570` |

### Border Colors

| Name | Hex | Token | Usage |
|------|-----|-------|-------|
| **Default** | `#E5E5E3` | `--color-border` | Standard borders |
| **Strong** | `#D1D1CF` | `--color-border-strong` | Emphasized borders |
| **Subtle** | `#EFEFED` | `--color-border-subtle` | Light dividers |

---

## Typography

### Font Families

**Display: Playfair Display**
- Use for: Headings, titles, display text
- Weights: 400, 500, 600, 700
- Character: Elegant, editorial, scholarly
- Token: `--font-display`

**Body: DM Sans**
- Use for: Body text, UI elements, labels
- Weights: 400, 500, 600, 700
- Character: Clean, readable, modern
- Token: `--font-body`

**Mono: JetBrains Mono** (optional)
- Use for: Code, technical data
- Token: `--font-mono`

### Loading Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Type Scale

The scale uses slightly larger sizes than typical for improved readability.

| Level | Size | Token | Font | Weight | Usage |
|-------|------|-------|------|--------|-------|
| Display | 52px | `--text-5xl` | Display | 700 | Hero headlines |
| H1 | 40px | `--text-4xl` | Display | 700 | Page titles |
| H2 | 32px | `--text-3xl` | Display | 600 | Section titles |
| H3 | 26px | `--text-2xl` | Display | 600 | Subsections |
| H4 | 22px | `--text-xl` | Display | 600 | Card titles |
| H5 | 19px | `--text-lg` | Display | 500 | Small headings |
| Lead | 19px | `--text-lg` | Body | 400 | Lead paragraphs |
| Body | 17px | `--text-base` | Body | 400 | Default text |
| Secondary | 15px | `--text-sm` | Body | 400 | Secondary text |
| Caption | 13px | `--text-xs` | Body | 500 | Labels, metadata |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--leading-tight` | 1.2 | Headings |
| `--leading-snug` | 1.35 | Subheadings |
| `--leading-normal` | 1.5 | UI text |
| `--leading-relaxed` | 1.7 | Body (default) |
| `--leading-loose` | 1.85 | Long-form prose |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-tight` | -0.025em | Large headings |
| `--tracking-snug` | -0.015em | Medium headings |
| `--tracking-normal` | 0 | Body text |
| `--tracking-wide` | 0.05em | Small labels |
| `--tracking-wider` | 0.1em | Uppercase labels |

### Heading Styles

```css
h1 {
  font-family: var(--font-display);
  font-size: var(--text-4xl);      /* 40px */
  font-weight: var(--font-bold);   /* 700 */
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--color-ink);
}

h2 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);      /* 32px */
  font-weight: var(--font-semibold); /* 600 */
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-snug);
  color: var(--color-ink);
}
```

### Eyebrow Text Pattern

Small uppercase labels above headings:

```css
.eyebrow {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--color-champagne-deep);
}
```

---

## Component Patterns

### Buttons

Four button variants for different contexts:

**Primary** - Main actions, form submissions
```css
.btn-primary {
  background: var(--color-ink);
  color: var(--color-paper-white);
  padding: var(--space-3) var(--space-5);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: none;
  border-radius: var(--radius-md);
  transition: all var(--duration-normal) var(--ease-default);
}
.btn-primary:hover {
  background: var(--color-ink-dark);
  transform: translateY(-1px);
}
```

**Secondary** - Supporting actions
```css
.btn-secondary {
  background: var(--color-paper-white);
  color: var(--color-ink);
  border: 1px solid var(--color-border-strong);
  /* Same padding, font, radius as primary */
}
.btn-secondary:hover {
  background: var(--color-paper-warm);
  border-color: var(--color-ink-subtle);
}
```

**Ghost** - Tertiary actions, cancel buttons
```css
.btn-ghost {
  background: transparent;
  color: var(--color-ink-light);
  border: none;
  /* Same padding, font, radius as primary */
}
.btn-ghost:hover {
  background: var(--color-paper-warm);
  color: var(--color-ink);
}
```

**Accent** - Highlighted, special emphasis
```css
.btn-accent {
  background: var(--color-champagne-deep);
  color: var(--color-paper-white);
  /* Same padding, font, radius as primary */
}
.btn-accent:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-champagne);
}
```

**Button Sizes**
| Size | Padding | Font Size |
|------|---------|-----------|
| Small | `--space-2` `--space-4` | `--text-xs` |
| Default | `--space-3` `--space-5` | `--text-sm` |
| Large | `--space-4` `--space-6` | `--text-base` |

### Form Inputs

```css
.form-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-ink);
  background: var(--color-paper-white);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  transition: all var(--duration-normal) var(--ease-default);
}

.form-input::placeholder {
  color: var(--color-ink-subtle);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-champagne);
  box-shadow: 0 0 0 3px var(--color-champagne-light);
}

.form-input:disabled {
  background: var(--color-paper-warm);
  color: var(--color-ink-muted);
}

.form-input-error {
  border-color: var(--color-error);
}
```

### Cards

```css
.card {
  background: var(--color-paper-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: all var(--duration-normal) var(--ease-default);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* Accent variant - featured content */
.card-accent {
  border-color: var(--color-champagne);
  background: linear-gradient(
    to bottom,
    var(--color-champagne-light) 0%,
    var(--color-paper-white) 100%
  );
}

/* Subtle variant - archived/secondary content */
.card-subtle {
  background: var(--color-paper-warm);
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border-radius: var(--radius-full);
  border: 1px solid currentColor;
}

/* Status variants */
.badge-draft { color: var(--color-ink-muted); }
.badge-pending { color: var(--color-warning); }
.badge-approved { color: var(--color-success); }
.badge-archived { color: var(--color-ink-subtle); }
.badge-error { color: var(--color-error); }

/* Filled variants */
.badge-filled {
  border-color: transparent;
}
.badge-filled.badge-approved {
  background: var(--color-success-light);
  color: var(--color-success-dark);
}
```

### Loading States

**Spinner**
```css
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-champagne-deep);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**Skeleton**
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-paper-mid) 25%,
    var(--color-paper-warm) 50%,
    var(--color-paper-mid) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## Spacing

### Spacing Scale

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--space-1` | 0.25rem | 4px | Tight gaps |
| `--space-2` | 0.5rem | 8px | Small gaps |
| `--space-3` | 0.75rem | 12px | Component padding |
| `--space-4` | 1rem | 16px | Default gaps |
| `--space-5` | 1.25rem | 20px | Medium gaps |
| `--space-6` | 1.5rem | 24px | Section padding |
| `--space-8` | 2rem | 32px | Large gaps |
| `--space-10` | 2.5rem | 40px | Section margins |
| `--space-12` | 3rem | 48px | Large sections |
| `--space-16` | 4rem | 64px | Page sections |
| `--space-20` | 5rem | 80px | Hero padding |
| `--space-24` | 6rem | 96px | Large hero |

### Semantic Aliases

| Alias | Maps To | Usage |
|-------|---------|-------|
| `--space-xs` | `--space-1` | Tight spacing |
| `--space-sm` | `--space-2` | Small gaps |
| `--space-md` | `--space-4` | Default gaps |
| `--space-lg` | `--space-6` | Section gaps |
| `--space-xl` | `--space-8` | Large gaps |
| `--space-2xl` | `--space-12` | Extra large |

---

## Shadows

| Token | Usage |
|-------|-------|
| `--shadow-xs` | Subtle elevation |
| `--shadow-sm` | Cards at rest |
| `--shadow-md` | Cards on hover |
| `--shadow-lg` | Dropdowns, popovers |
| `--shadow-xl` | Modals |
| `--shadow-champagne` | Accent button hover |
| `--shadow-champagne-lg` | Featured elements |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Code blocks, small badges |
| `--radius-md` | 6px | Buttons, inputs |
| `--radius-lg` | 8px | Cards |
| `--radius-xl` | 12px | Modals, large panels |
| `--radius-full` | 9999px | Pills, avatars |

---

## Transitions

### Durations

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Micro-interactions |
| `--duration-normal` | 200ms | Standard transitions |
| `--duration-slow` | 300ms | Larger animations |
| `--duration-slower` | 500ms | Page transitions |

### Easing

| Token | Usage |
|-------|-------|
| `--ease-default` | Most transitions |
| `--ease-in` | Elements entering |
| `--ease-out` | Elements exiting |
| `--ease-in-out` | Longer animations |

### Standard Transition

```css
transition: all var(--duration-normal) var(--ease-default);
```

---

## Focus States

```css
:focus-visible {
  outline: 2px solid var(--color-champagne);
  outline-offset: 2px;
}
```

---

## Selection

```css
::selection {
  background: var(--color-champagne);
  color: var(--color-ink-black);
}
```

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | 0 | Default |
| `--z-dropdown` | 100 | Dropdowns |
| `--z-sticky` | 200 | Sticky headers |
| `--z-overlay` | 300 | Overlays |
| `--z-modal` | 400 | Modals |
| `--z-popover` | 500 | Popovers |
| `--z-toast` | 600 | Toasts |
| `--z-tooltip` | 700 | Tooltips |

---

## Implementation Checklist

When implementing Silver Sycamore brand:

- [ ] Load Playfair Display and DM Sans fonts
- [ ] Import or copy design tokens
- [ ] Set body background to `--color-paper`
- [ ] Set body text color to `--color-ink`
- [ ] Apply display font to all headings
- [ ] Use champagne accents sparingly for emphasis
- [ ] Ensure all interactive elements have focus states
- [ ] Use the spacing scale consistently
- [ ] Test typography at all sizes for readability
- [ ] Verify color contrast meets accessibility standards
