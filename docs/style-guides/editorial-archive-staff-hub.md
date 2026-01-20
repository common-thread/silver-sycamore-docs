---
title: Editorial Archive - Staff Hub Variant
description: Internal-use design variant optimized for daily staff workflows
contentType: guide
---

# Editorial Archive - Staff Hub Variant

Internal-use design variant optimized for daily staff workflows. Information-dense, all-day readable, focused on productivity over polish.

---

## Design Philosophy

This variant adapts the Editorial Archive system for internal staff use. Think scholarly research portal meets modern productivity tool. The goal is comfortable extended use, not impressive first impressions.

**Key Differences from Main:**
- Reduced visual flourish, more functional density
- Smaller shadows and subtle hover effects
- Champagne accents used sparingly (reserved for completion states)
- Optimized for all-day use, not brief sessions
- Print-friendly layouts

---

## Typography Adjustments

### Functional Hierarchy

Staff Hub uses the same type scale but with tighter application:

| Context | Main Variant | Staff Hub |
|---------|--------------|-----------|
| Page titles | `--text-4xl` (40px) | `--text-2xl` (26px) |
| Section headers | `--text-3xl` (32px) | `--text-xl` (22px) |
| Card titles | `--text-xl` (22px) | `--text-lg` (19px) |
| Body text | `--text-base` (17px) | `--text-base` (17px) |

### Increased Information Density

```css
/* Staff Hub prose has tighter margins */
.prose h2 {
  margin-top: var(--space-8);   /* vs space-12 in main */
  margin-bottom: var(--space-3); /* vs space-4 in main */
}

.prose p {
  margin-bottom: var(--space-4); /* vs space-5 in main */
}
```

---

## Color Adjustments

### Champagne Usage

In Staff Hub, champagne is reserved for:
- Completion indicators (checkmarks, progress bars)
- Focus states (keyboard navigation)
- Selected states (active navigation)

**Not used for:**
- Decorative borders
- Card hover states
- Section backgrounds

### Status-Forward Palette

Staff workflows rely heavily on status colors:

| Status | Usage |
|--------|-------|
| Success green | Completed steps, approved items |
| Warning amber | Pending items, due-soon deadlines |
| Error red | Overdue items, validation errors |
| Info blue | Informational notices, tips |

---

## Component Modifications

### Buttons

**Staff Hub buttons are more compact:**

```css
.btn {
  padding: var(--space-3) var(--space-5);
  box-shadow: var(--shadow-xs);       /* vs shadow-sm in wedding */
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);         /* vs -2px in wedding */
  box-shadow: var(--shadow-sm);        /* vs shadow-md in wedding */
}
```

### Cards

**Reduced elevation for less visual noise:**

```css
.card {
  box-shadow: var(--shadow-xs);       /* Minimal shadow */
}

.card-interactive:hover {
  border-color: var(--color-border-strong);  /* Not champagne */
  box-shadow: var(--shadow-sm);              /* Subtle lift */
  transform: translateY(-1px);               /* Minimal movement */
}
```

### Progress Elements

**Compact step indicators:**

| Element | Wedding | Staff Hub |
|---------|---------|-----------|
| Progress bar height | 8px | 6px |
| Step indicator size | 32px | 24px |
| Checkbox size | 24px | 20px |

```css
.progress-bar { height: 6px; }
.step-indicator { width: 24px; height: 24px; }
.checkbox { width: 20px; height: 20px; }
```

### Forms

**Denser form layouts:**

```css
.form-input {
  padding: var(--space-3) var(--space-4);  /* Compact padding */
}

.form-label {
  margin-bottom: var(--space-1);           /* Tight label spacing */
}
```

---

## Procedure and Checklist UI

Staff Hub is optimized for procedure execution and checklist completion.

### Step Item Styling

```css
.procedure-step {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-default);
}

.procedure-step:hover {
  background: var(--color-paper-warm);
}

.procedure-step-complete {
  background: var(--color-paper-warm);
}
```

### Step Number Styling

```css
.procedure-step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 2px solid var(--color-border-strong);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-ink-muted);
}

.procedure-step-complete .procedure-step-number {
  border-color: var(--color-success);
  background: var(--color-success);
  color: var(--color-paper-white);
}
```

### Completion Banner

```css
.completion-banner {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-success-light);
}

.completion-banner-text {
  font-size: var(--text-sm);
  color: var(--color-success-dark);
}
```

---

## List Styling

Staff Hub includes specialized list item components:

### Document List Item

```css
.list-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  transition: background var(--duration-fast);
}

.list-item-interactive:hover {
  background: var(--color-paper-warm);
}

.list-item-completed {
  background: var(--color-paper-warm);
}

.list-item-completed .list-item-title {
  color: var(--color-ink-muted);
  text-decoration: line-through;
}
```

### Metadata Display

```css
.list-item-meta {
  font-size: var(--text-xs);
  color: var(--color-ink-muted);
}
```

---

## Navigation Styling

### Header Navigation

Staff Hub uses an editorial tab bar:

```css
.header-nav-link {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-ink-light);
  border-bottom: 2px solid transparent;
}

.header-nav-link:hover {
  color: var(--color-ink);
  border-color: var(--color-border-strong);
}

.header-nav-link-active {
  font-weight: var(--font-semibold);
  color: var(--color-accent);
  border-color: var(--color-accent);
}
```

### Quick Action Cards

```css
.quick-action-card {
  padding: var(--space-5);
  background: var(--color-paper-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  transition: all var(--duration-fast);
}

.quick-action-card:hover {
  border-color: var(--color-champagne);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

---

## Badge System

Staff Hub badges are more compact:

```css
.badge {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-2xs);           /* 11px */
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  border-radius: var(--radius-sm);
}
```

| Badge | Background | Text |
|-------|------------|------|
| Default | Paper-mid | Ink-light |
| Success | Success-light | Success-dark |
| Warning | Warning-light | Warning-dark |
| Error | Error-light | Error-dark |
| Info | Info-light | Info-dark |
| Accent | Champagne-light | Champagne-deep |

---

## Print Styles

Staff Hub includes print optimization:

```css
@media print {
  body {
    background: white;
    color: black;
  }

  .btn, .button, nav, .no-print {
    display: none !important;
  }

  .content-section {
    border: 1px solid #ccc;
    page-break-inside: avoid;
  }

  .procedure-step {
    page-break-inside: avoid;
  }
}
```

---

## Responsive Behavior

### Mobile Adjustments (768px)

```css
@media (max-width: 768px) {
  .content-section {
    padding: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .page-title {
    font-size: var(--text-xl);
  }

  .quick-action-card {
    padding: var(--space-4);
  }

  .procedure-step {
    padding: var(--space-3);
  }
}
```

---

## Usage Guidelines

1. **Use for internal staff tools** - Procedures, checklists, wiki content, activity logs
2. **Prioritize scannability** - Users should find information quickly
3. **Use status colors meaningfully** - Green for done, amber for pending, red for overdue
4. **Keep champagne restrained** - Reserve for completion states and focus indicators
5. **Support print** - Staff may print procedures for physical reference
6. **Test for all-day comfort** - Avoid eye strain with warm tones and generous text sizing
