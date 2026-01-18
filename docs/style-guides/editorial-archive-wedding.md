---
layout: default
title: Editorial Archive - Wedding Variant
---

# Editorial Archive - Wedding Variant

Client-facing design variant optimized for wedding packages, contracts, and demo presentations. Enhanced polish and subtle animation for first impressions.

---

## Design Philosophy

This variant amplifies the warmth and refinement of the base Editorial Archive system for client-facing contexts. Think elegant wedding invitation meets modern web application.

**Key Differences from Main:**
- More generous whitespace for breathing room
- Enhanced animations and transitions
- Slightly bolder champagne accents
- Premium hover and focus states
- Optimized for shorter sessions, not all-day use

---

## Typography Enhancements

### Responsive Headings

Wedding variant uses fluid typography that scales with viewport:

```css
h1 { font-size: clamp(2.5rem, 7vw, 3.25rem); }
h2 { font-size: clamp(2rem, 5vw, 2.5rem); }
h3 { font-size: clamp(1.625rem, 3.5vw, 2rem); }
```

### Enhanced Letter Spacing

Tighter tracking on large headings for elegance:

| Element | Tracking |
|---------|----------|
| H1 | -0.04em |
| H2 | -0.03em |
| H3 | -0.02em |
| H4 | -0.01em |

### Eyebrow Text

Champagne-colored labels above headings:

```css
.eyebrow {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--color-champagne-deep);
}
```

---

## Animation System

### Entrance Animations

Wedding variant includes staggered entrance effects:

| Class | Effect | Duration |
|-------|--------|----------|
| `.animate-fade-in` | Opacity 0 to 1 | 300ms |
| `.animate-fade-in-up` | Fade + slide up 20px | 300ms |
| `.animate-fade-in-down` | Fade + slide down 20px | 300ms |
| `.animate-slide-in-left` | Fade + slide left 30px | 300ms |
| `.animate-scale-in` | Fade + scale 0.95 to 1 | 200ms |

### Stagger Delays

```css
.delay-1 { animation-delay: 75ms; }
.delay-2 { animation-delay: 150ms; }
.delay-3 { animation-delay: 225ms; }
.delay-4 { animation-delay: 300ms; }
.delay-5 { animation-delay: 375ms; }
.delay-6 { animation-delay: 450ms; }
```

### Link Underlines

Animated underline that sweeps from right to left:

```css
.link-underline::after {
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 200ms ease;
}
.link-underline:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

---

## Enhanced Shadows

Wedding variant uses champagne-tinted shadows for highlighted elements:

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-champagne` | `0 4px 14px rgba(201, 184, 150, 0.25)` | Accent cards |
| `--shadow-champagne-lg` | `0 8px 24px rgba(201, 184, 150, 0.3)` | Featured sections |
| `--shadow-card` | Border + subtle shadow | Default cards |
| `--shadow-card-hover` | Champagne border + lift | Card hover |

---

## Component Enhancements

### Cards

**Featured Card Gradient:**
```css
.card-featured {
  border-color: var(--color-champagne);
  background: linear-gradient(
    to bottom,
    var(--color-champagne-light) 0%,
    var(--color-paper-white) 100%
  );
}
```

**Interactive Card Hover:**
```css
.card-interactive:hover {
  border-color: var(--color-champagne);
  box-shadow: var(--shadow-champagne);
  transform: translateY(-2px);
}
```

### Buttons

**Accent Button with Champagne Shadow:**
```css
.btn-accent:hover:not(:disabled) {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-champagne);
}
```

### Decorative Elements

**Divider with Champagne Color:**
```css
.divider {
  width: 60px;
  height: 1px;
  background: var(--color-champagne);
}
```

**Ornamental Line:**
```css
.ornament::before,
.ornament::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-champagne);
}
```

---

## Badge Variants

Wedding variant includes filled badge options:

| State | Background | Text |
|-------|------------|------|
| Draft | Paper-mid | Ink-light |
| Pending | Warning-light | Warning-dark |
| Sent | Info-light | Info-dark |
| Signed | Success-light | Success-dark |
| Declined | Error-light | Error-dark |

---

## Form Styling

### Focus States

Enhanced champagne focus ring:
```css
.form-input:focus {
  border-color: var(--color-champagne);
  box-shadow: 0 0 0 3px var(--color-champagne-light);
}
```

### Required Field Indicator
```css
.form-label-required::after {
  content: ' *';
  color: var(--color-error);
}
```

---

## Responsive Considerations

Wedding variant adjusts spacing at breakpoints:

| Breakpoint | Adjustments |
|------------|-------------|
| 1024px | Reduced large spacing values |
| 768px | Compact padding, smaller sections |
| 480px | Mobile-optimized spacing |

---

## Usage Guidelines

1. **Use for client-facing contexts** - Contract generators, package previews, proposals
2. **Leverage animations sparingly** - Entrance animations on initial load, not on every state change
3. **Emphasize with champagne** - Reserve champagne accents for CTAs and key information
4. **Maintain breathing room** - Don't overcrowd; this variant values whitespace
