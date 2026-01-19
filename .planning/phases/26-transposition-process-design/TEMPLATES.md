# Content Type Template Specifications

**Phase:** 26-transposition-process-design
**Purpose:** Visual presentation templates for each content type to enable systematic, consistent transposition in Phase 27.

**Guiding Principle:** Style guide is guidance, document intent wins. If a document's purpose is better served by deviating from the template, deviate.

---

## 1. Procedure Template

**Count:** 10 documents (plus 2 reclassified from reference)
**Reclassifications:** wedding-processional.md, quinceanera-processional.md

### Required Frontmatter

```yaml
---
title: [Clear action-oriented title]
description: [One sentence: what this procedure accomplishes]
contentType: procedure
---
```

### Heading Structure

```markdown
# [Procedure Title]

[Brief intro paragraph - what this is and when to use it]

## Section Name

### Subsection (if needed)

1. Step one description
2. Step two description
3. Step three description
```

### Step Formatting Rules

- **Use numbered lists** for sequential steps, not prose paragraphs
- **One action per step** - keep each step focused
- **Imperative voice** - "Close the register" not "The register should be closed"
- **Bold key items** within steps for scannability: "Press **F12** to export"
- **NO ALL CAPS** for emphasis - use bold instead

### Example Snippet

```markdown
---
title: Closing Procedures
description: End-of-day tasks for shutting down operations
contentType: procedure
---

# Closing Procedures

Complete these tasks at the end of each business day before leaving.

## Register Closeout

1. Print the daily sales report by pressing **F12**
2. Count the cash drawer and verify against report total
3. Place cash in deposit bag with date label
4. Lock deposit bag in safe

## Facility Security

1. Walk through all rooms checking for guests
2. Turn off all lights except emergency exits
3. Arm the security system using code **####**
4. Lock front door and verify it's secured
```

### Common Fixes Needed

| Issue | Fix |
|-------|-----|
| **ALL CAPS** emphasis | Replace with **bold** |
| Steps as prose paragraphs | Convert to numbered list |
| Mixed numbered/bulleted lists | Standardize to numbered for steps |
| Missing intro paragraph | Add brief context sentence |
| "Source: filename" in content | Move to frontmatter or remove |

---

## 2. Reference Template

**Count:** 32 documents (minus 2 reclassified to procedure, plus 2 reclassified from procedure)
**Reclassifications:** maintenance-schedule.md, training-schedule.md (from procedure to reference)

### Required Frontmatter

```yaml
---
title: [Descriptive title]
description: [One sentence: what information this provides]
contentType: reference
---
```

### Structure Guidelines

- **Lead with the most-used information** - don't bury it
- **Use tables for structured data** - pricing, schedules, comparisons
- **Use bullet lists for unstructured data** - vendor contacts, tips
- **One concept per section** - split large references into logical chunks
- **Scannable headings** - users should find info without reading everything

### Table Formatting

```markdown
| Column A | Column B | Column C |
|----------|----------|----------|
| Data     | Data     | Data     |
```

- Always include header row
- Use consistent column alignment
- Keep tables focused (fewer than 7 columns ideal)
- For pricing tables, put price in rightmost column

### Example Snippet

```markdown
---
title: Wedding Add-On Services
description: Optional services and pricing for wedding packages
contentType: reference
---

# Wedding Add-On Services

Enhancements available for any wedding package. Pricing is per event unless noted.

## Ceremony Additions

| Service | Description | Price |
|---------|-------------|-------|
| Unity candle ceremony | Includes candles, holders, table | $75 |
| Sand ceremony | Two colors of sand with display vase | $50 |
| Additional officiant time | Per 30-minute block | $100 |

## Reception Upgrades

- **Extended bar service** - $25/person/hour beyond package
- **Premium liquor upgrade** - $15/person
- **Champagne toast** - $8/person (included in Dream package)
```

### Pricing/Menu Specific Patterns

- Always include "per person", "per event", or "each" with prices
- Group by category with clear H2 headings
- Mark package inclusions: "(included in Package Name)"
- Show price ranges where applicable: "$50-75"

### Common Fixes Needed

| Issue | Fix |
|-------|-----|
| Tables used for layout, not data | Convert to lists or restructure |
| Missing table headers | Add descriptive header row |
| Inconsistent price formats | Standardize: $X or $X/person |
| No contextual intro | Add one-sentence purpose statement |
| Excessive whitespace | Single blank line between sections |

---

## 3. Checklist Template

**Count:** 5 documents (plus 1 reclassified from procedure)
**Reclassifications:** pre-wedding-todo.md (from procedure to checklist)

### Required Frontmatter

```yaml
---
title: [Checklist title]
description: [What this checklist ensures]
contentType: checklist
---
```

### Checkbox Syntax

```markdown
- [ ] Unchecked item
- [x] Checked item (for examples only)
```

### Section Grouping

```markdown
# [Checklist Title]

[Brief intro - when to use this checklist]

## [Section Name]

- [ ] Item one
- [ ] Item two
- [ ] Item three

## [Next Section]

- [ ] Item one
- [ ] Item two
```

### Example Snippet

```markdown
---
title: Pre-Wedding Week Tasks
description: Tasks to complete in the week before a wedding event
contentType: checklist
---

# Pre-Wedding Week Tasks

Complete all items during the week leading up to the wedding date.

## Venue Preparation

- [ ] Confirm final guest count with client
- [ ] Verify catering numbers are updated
- [ ] Walk through setup with event coordinator
- [ ] Test all A/V equipment

## Vendor Coordination

- [ ] Confirm florist delivery time
- [ ] Confirm cake delivery time
- [ ] Send timeline to DJ/band
- [ ] Verify photographer arrival time

## Day-Before Tasks

- [ ] Set up tables per layout diagram
- [ ] Place linens and centerpieces
- [ ] Stock bar with inventory per pull sheet
- [ ] Do final walkthrough with manager
```

### Common Fixes Needed

| Issue | Fix |
|-------|-----|
| Prose format "Do X, then Y" | Convert to checkbox items |
| Numbered lists for tasks | Convert to checkboxes |
| Items without sections | Group logically with H2 headings |
| Vague items "Prepare things" | Make specific and actionable |

---

## 4. Guide Template

**Count:** 5 documents (no reclassifications after removing recipe-app/README.md)
**Note:** recipe-app/README.md to be removed from docs/ entirely (deliverable, not documentation)

### Required Frontmatter

```yaml
---
title: [Guide title]
description: [What this guide covers]
contentType: guide
---
```

### Structure Guidelines

Guides are longer-form explanatory content. They differ from procedures (which are step-by-step) and references (which are lookup tables).

- **Introduction** - What this guide is and who it's for
- **Concept sections** - Explain the "why" and "how" at a conceptual level
- **Cross-references** - Link to related procedures, references, checklists
- **Summary or key takeaways** - Reinforce main points

### Example Snippet

```markdown
---
title: Editorial Archive Design System
description: Design principles and patterns for the Silver Sycamore brand
contentType: guide
---

# Editorial Archive Design System

This guide documents the visual language and design patterns used across Silver Sycamore properties.

## Design Philosophy

The Editorial Archive system draws inspiration from vintage publishing and archival documents. Think scholarly journals, vintage newspapers, and museum catalogs.

**Core principles:**
- Typography-forward design with minimal decoration
- Warm, paper-like backgrounds that reduce eye strain
- Champagne accents used sparingly for elegance

## Variants

Three variants serve different contexts:

| Variant | Use Case | Key Difference |
|---------|----------|----------------|
| Main | Marketing site | More flourish, larger type |
| Wedding | Client portal | Romantic, elegant details |
| Staff Hub | Internal tools | Dense, functional, all-day use |

See also:
- [Staff Hub Style Guide](/style-guides/editorial-archive-staff-hub)
- [Wedding Variant Guide](/style-guides/editorial-archive-wedding)
```

### Common Fixes Needed

| Issue | Fix |
|-------|-----|
| Too procedural (step-by-step) | Reclassify as procedure or restructure |
| Too sparse (just a list) | Expand with explanatory content or reclassify |
| No clear structure | Add intro, sections, summary |

---

## 5. Form Template (Keep with Catalog)

**Count:** 18 documents
**Decision:** Keep all form docs with type=form. Create forms catalog in wiki.

### Required Frontmatter

```yaml
---
title: [Form name]
description: [What this form collects]
contentType: form
---
```

### Structure for Form Documentation

Form documents serve as documentation/reference for what the form collects, not as fillable forms (the form builder is authoritative for data collection).

```markdown
# [Form Name]

> **Use the Form Builder:** This form is available in the Forms section for data collection. This document serves as field reference.

## Purpose

[One paragraph explaining when and why this form is used]

## Fields

| Field | Description | Required |
|-------|-------------|----------|
| Client name | Full legal name | Yes |
| Event date | Preferred date | Yes |
| Guest count | Estimated attendees | No |

## Notes

[Any special instructions or context for form use]
```

### Example Snippet

```markdown
---
title: Wedding Booking Form
description: Initial information collection for wedding inquiries
contentType: form
---

# Wedding Booking Form

> **Use the Form Builder:** This form is available in the Forms section for data collection. This document serves as field reference.

## Purpose

Collect initial contact and event details when a prospective client inquires about wedding services. This information is used for follow-up and initial planning discussions.

## Fields

| Field | Description | Required |
|-------|-------------|----------|
| Couple names | Both partners' names | Yes |
| Contact email | Primary contact email | Yes |
| Contact phone | Primary phone number | Yes |
| Preferred date | Wedding date (or range) | Yes |
| Guest count | Estimated attendance | Yes |
| Venue preference | Hall, Saloon, Town, etc. | No |
| How did you hear about us? | Marketing source | No |

## Notes

- Form responses create a lead in the CRM
- Follow up within 24 hours of submission
- See Sales Script for call preparation
```

### Common Fixes Needed

| Issue | Fix |
|-------|-----|
| Fill-in-the-blank format | Convert to field documentation table |
| No form builder reference | Add the callout banner |
| Missing field descriptions | Add descriptions and required flags |

---

## 6. Fallback Template

For documents that don't fit cleanly into the five content types, or where classification confidence is low.

### When to Use

- Document purpose is unclear
- Content spans multiple types (procedure + reference hybrid)
- Special format needed (large data dumps, legacy content)
- Uncertain about reclassification

### Required Frontmatter

```yaml
---
title: [Descriptive title]
description: [Best attempt at one-sentence summary]
contentType: reference  # Default to reference when unsure
notes: "[Why this uses fallback template]"
---
```

### Structure

```markdown
# [Title]

[Intro paragraph explaining the document's purpose]

## Content

[Preserve original structure as much as possible while fixing rendering issues]

---

*Note: This document uses the fallback template. [Reason]*
```

### Escalation Criteria

Escalate to user (don't guess) when:

1. **Classification unclear** - Document could reasonably be 2+ types
2. **Intent unclear** - Can't determine what the document is trying to accomplish
3. **Large file (>25KB)** - May need special handling or splitting
4. **Broken references** - Links/images that can't be resolved
5. **Outdated content** - Information that may be incorrect or superseded

### Escalation Format

When asking the user:

```
**Classification Needed:** [filename]

**Current state:** [brief description of what the document contains]
**Options:**
1. [Option A with rationale]
2. [Option B with rationale]
3. [Other suggestion]

**My recommendation:** [if you have one]

Which approach would you like me to take?
```

---

## Quick Reference Table

| Type | Frontmatter | Key Structure | Step/Item Format |
|------|-------------|---------------|------------------|
| Procedure | title, description, contentType=procedure | Intro + H2 sections + numbered steps | Numbered list (1. 2. 3.) |
| Reference | title, description, contentType=reference | Intro + H2 sections + tables/lists | Tables for data, bullets for lists |
| Checklist | title, description, contentType=checklist | Intro + H2 sections + checkboxes | - [ ] checkbox format |
| Guide | title, description, contentType=guide | Intro + concept sections + cross-refs | Paragraphs + supporting tables |
| Form | title, description, contentType=form | Banner + purpose + field table + notes | Field documentation table |
| Fallback | title, description, contentType=reference, notes | Preserve original + fix rendering | Depends on content |

---

## Content Removal (Per Checkpoint)

The following items should be **removed** during transposition, not templated:

### Index Files (6 files)

Remove entirely - type-based navigation is sufficient:
- clients/index.md
- operations/index.md
- deliverables/index.md
- services/index.md
- staff/index.md
- style-guides/index.md

### Deliverable Documentation (1 file)

Remove from docs/ - this is a deliverable, not documentation:
- deliverables/recipe-app/README.md
- Recipe app should be linked from home page: https://pine-street-cafe-recipes.vercel.app/

---

*Template specifications created: 2026-01-18*
*Phase: 26-transposition-process-design*
