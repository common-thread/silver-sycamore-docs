# Content Rendering - Second Pass Notes

## Current State (after v1 implementation)

### What's Working
- **Timeline rendering** - Time patterns (`HH:MM am/pm`) detected and styled with:
  - Champagne vertical line + dot markers
  - Monospace time badges with champagne background
  - Clean event text layout
- **Duplicate H1 stripping** - Leading H1 removed when it matches document title
- **Section headers** - H2s have champagne accent bar
- **CSS architecture** - Clean separation in globals.css under "CONTENT TYPES" section

### What's NOT Working
- **Checklists** - Source content doesn't use `[ ]` markdown checkbox syntax
- **Procedure steps** - Plain numbered lists, no step styling

## Root Cause Analysis

The content was transposed as plain markdown without semantic markers:
- Checklists are just `- Item` not `- [ ] Item`
- Procedures are just `1. Step` not structured step components

The `contentType` field EXISTS in schema and is set on documents, but rendering ignores it.

## Options for Fix

### Option A: contentType-aware rendering (recommended)
Pass contentType to DocumentViewer, use it to:
- checklist/procedure → Render ALL list items as checkboxes
- reference → Keep timeline detection active (already works)
- form → Link to form system
- guide → Standard prose

### Option B: Re-transpose content with proper syntax
Would require updating all 62+ documents in database

### Option C: Hybrid
Use contentType for list styling, keep pattern detection for timelines

### Component Architecture for Reader/Editor

**Current:** DocumentViewer is read-only, uses ReactMarkdown

**Future considerations:**
- Editor mode needs editable checkboxes (toggle state)
- Timeline entries could be editable (time picker + text)
- Consider extracting render logic to shared components:
  - `<ChecklistItem checked={} onChange={} />` - works in both modes
  - `<TimelineEntry time={} event={} onEdit={} />` - editable or display
  - `<SectionHeader>` - consistent styling

### Potential Component Upgrades

```
src/components/
  content/
    ChecklistItem.tsx      # Reusable checkbox with read/edit modes
    TimelineEntry.tsx      # Time badge + event, supports editing
    SectionHeader.tsx      # Styled H2 with accent bar
    ContentRenderer.tsx    # Smart router based on contentType
```

### contentType-aware rendering
Schema has contentType: procedure | reference | form | checklist | guide

Could route:
- checklist → Force checkbox rendering for all list items
- procedure → Numbered steps with progress tracking
- reference → Timeline-aware rendering
- form → Link to form builder / submission view
- guide → Standard prose

## Completed Phase 2

- [x] contentType-aware list rendering implemented
  - ContentTypeRenderer passes `forceCheckboxes` based on contentType
  - DocumentViewer accepts prop and applies to all list items
  - checklist + procedure types now render with checkboxes

## Future TODOs

- [ ] Add edit mode to ChecklistItem (toggle state, persist to Convex)
- [ ] Create TimelineEntry as standalone component for reuse
- [ ] Consider "procedure steps" component with completion tracking
- [ ] Extract reusable components to src/components/content/
