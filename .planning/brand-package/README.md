# Silver Sycamore Brand Package

A portable brand package for implementing the Silver Sycamore visual identity across projects.

## Contents

```
brand-package/
  README.md           # This file
  STYLE-GUIDE.md      # Complete brand documentation
  tokens.css          # CSS custom properties
  logos/
    logo-full.png        # Primary logo (1536x1024, 1.5:1)
    logo-icon.png        # Icon mark (1436x673, 2.13:1)
    logo-text.png        # Wordmark (1511x256, 5.9:1)
    logo-horizontal.png  # Horizontal lockup (4000x1000, 4:1)
```

## Quick Start

### 1. Add the Design Tokens

Copy `tokens.css` to your project and import it:

```css
@import './tokens.css';
```

Or copy the `:root` block directly into your global styles.

### 2. Load the Fonts

Add Google Fonts to your HTML:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Or in CSS/SCSS:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
```

### 3. Apply Base Styles

```css
body {
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  color: var(--color-ink);
  line-height: var(--leading-tight);
}
```

### 4. Add Logos

Copy the `logos/` folder to your public assets directory.

## Brand Essence

**Aesthetic:** Editorial Archive - warm, scholarly, effortlessly readable

**Key Principles:**
- Warm monochrome foundation with champagne accents
- Generous typography for comfortable reading
- Subtle, refined interactions
- Archival, timeless quality

## Resources

- See `STYLE-GUIDE.md` for complete brand documentation
- See `tokens.css` for all design tokens with comments
