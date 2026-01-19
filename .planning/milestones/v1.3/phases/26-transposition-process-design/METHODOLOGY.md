# Transposition Methodology

**Phase:** 26-transposition-process-design
**Purpose:** Step-by-step process for transposing 62 wiki documents from raw markdown to properly contextualized Staff Hub content.

**Guiding Principle:** Systematic but not rigid. When uncertain about intent or approach, ask rather than guess.

---

## 1. Overview

### Scope

| Metric | Count |
|--------|-------|
| **Total documents to transpose** | 62 |
| **Documents to remove** | 7 (6 index.md + 1 recipe-app README) |
| **Quick wins (1-2 hours)** | 28 |
| **Medium effort (4-6 hours)** | 24 |
| **Heavy lift (2-4 hours)** | 10 |
| **Estimated total effort** | 7-12 hours |

### Approach

**Batch-by-type:** Process all documents of one content type together before moving to the next. This enables consistent pattern application and faster throughput.

**Execution order:**
1. Remove index files and recipe-app README (cleanup first)
2. Procedures (10 + 2 reclassified = 12 documents)
3. References (32 - 2 reclassified + 2 reclassified = 32 documents)
4. Checklists (5 + 1 reclassified = 6 documents)
5. Guides (5 - 1 removed = 4 documents)
6. Forms (18 documents)

### Reference Documents

- **TEMPLATES.md** - Visual specifications for each content type
- **AUDIT.md** - Source inventory and prioritized list (Phase 25)
- **Staff Hub style guide** - CSS patterns (docs/style-guides/editorial-archive-staff-hub.md)

---

## 2. Pre-Transposition Checklist

Before starting any document, verify:

- [ ] Document classification is correct (check AUDIT.md Section 7 for reclassifications)
- [ ] Document is not in the removal list (6 index.md files + recipe-app/README.md)
- [ ] No blocking rendering issues that need special handling (AUDIT.md Section 3)
- [ ] Any special notes from AUDIT.md Section 8 are understood

### Reclassifications to Apply

| Document | From | To |
|----------|------|-----|
| wedding-processional.md | reference | procedure |
| quinceanera-processional.md | reference | procedure |
| pre-wedding-todo.md | procedure | checklist |
| maintenance-schedule.md | procedure | reference |
| training-schedule.md | procedure | reference |

### Content to Remove

| Path | Reason |
|------|--------|
| clients/index.md | Type-based navigation sufficient |
| services/index.md | Type-based navigation sufficient |
| staff/index.md | Type-based navigation sufficient |
| operations/index.md | Type-based navigation sufficient |
| deliverables/index.md | Type-based navigation sufficient |
| style-guides/index.md | Type-based navigation sufficient |
| deliverables/recipe-app/README.md | Deliverable, not documentation |

---

## 3. Transposition Process (Per Document)

### Step 1: Read Original Document

Open the document and read it completely. Ask:
- What is this document's **purpose**?
- Who is the **intended user**?
- When would they **use** this?
- What **action** does it enable?

### Step 2: Verify Classification

Check if the document is classified correctly based on its content:

| Content Type | Identifying Characteristics |
|--------------|----------------------------|
| **Procedure** | Sequential steps to accomplish a task |
| **Reference** | Information to look up (prices, contacts, layouts) |
| **Checklist** | Tasks to complete (not necessarily sequential) |
| **Guide** | Explanatory content teaching concepts |
| **Form** | Data collection fields (redirect to form builder) |

If classification is wrong, apply reclassification from the list above. If uncertain, escalate to user.

### Step 3: Add/Update Frontmatter

Add the required frontmatter block at the top of the file:

```yaml
---
title: [Clear, descriptive title]
description: [One sentence explaining the document's purpose]
contentType: [procedure|reference|checklist|guide|form]
---
```

**Frontmatter rules:**
- Title should match the H1 heading (or improve upon it)
- Description is for search and preview - make it useful
- Use the verified contentType from Step 2

### Step 4: Apply Template Structure

Reference **TEMPLATES.md** for the content type's structure.

**Key transformations:**

| Content Type | Key Structure Changes |
|--------------|----------------------|
| Procedure | Add intro paragraph, convert prose to numbered steps |
| Reference | Organize with H2 sections, format data as tables |
| Checklist | Group items with H2 sections, use `- [ ]` checkbox syntax |
| Guide | Add intro, concept sections, cross-references |
| Form | Add form builder banner, create field documentation table |

### Step 5: Fix Rendering Issues

Address common rendering problems:

| Issue | Fix |
|-------|-----|
| **Excessive whitespace** | Single blank line between sections |
| **Double-spaced lines** | Remove extra blank lines within paragraphs |
| **ALL CAPS emphasis** | Replace with **bold** |
| **Broken image references** | Remove image syntax or fix path |
| **&nbsp; artifacts** | Remove HTML entities |
| **Inconsistent heading levels** | Use H1 for title, H2 for sections, H3 for subsections |
| **"Source: filename" inline** | Remove or move to frontmatter |
| **Outdated dates** | Remove specific dates or update |

### Step 6: Final Verification

Before moving to next document:

- [ ] Frontmatter is complete (title, description, contentType)
- [ ] Structure matches template specification
- [ ] No rendering issues remain
- [ ] Document intent is preserved (original purpose still clear)
- [ ] If uncertain about anything, escalate rather than guess

---

## 4. Batch Execution Order

### Wave 1: Cleanup (Pre-execution)

Remove files that shouldn't be transposed:

```
docs/clients/index.md
docs/services/index.md
docs/staff/index.md
docs/operations/index.md
docs/deliverables/index.md
docs/style-guides/index.md
docs/deliverables/recipe-app/README.md
```

### Wave 2: Quick Wins (28 documents)

**Priority 1a: Add Frontmatter Only (15 documents)**

These have good structure, just need metadata:

| Path | Notes |
|------|-------|
| services/catering/catering-menu.md | Well-structured menu |
| services/catering/off-premise-menu.md | Well-structured menu |
| services/add-ons/addons-wedding.md | Good pricing table |
| services/add-ons/packages-salon-parties.md | Multiple packages |
| services/wedding-packages/package-dream.md | Package details |
| services/wedding-packages/package-food-truck.md | Package details |
| services/wedding-packages/package-reception-only.md | Package details |
| services/wedding-packages/package-salon-town-merry.md | Package details |
| services/wedding-packages/package-simple-elegance.md | Package details |
| services/event-packages/package-salon-banquet.md | Package details |
| services/event-packages/packages-reception-hall.md | Multiple packages |
| services/event-packages/proposal-company-picnic.md | Proposal template |
| services/event-packages/salon-party-packages.md | Multiple packages |
| staff/procedures/service-protocols.md | 23-step protocol |

**Priority 1b: Remove Excessive Whitespace (8 documents)**

| Path | Notes |
|------|-------|
| clients/day-of/timeline-first-look.md | Double-spaced from conversion |
| clients/day-of/timeline-evening-6-11pm.md | Double-spaced from conversion |
| clients/day-of/timeline-first-dance-after-dinner.md | Double-spaced from conversion |
| clients/day-of/timeline-micro-wedding.md | Double-spaced from conversion |
| clients/layouts/hall/head-table.md | Clean up + fix/remove broken images |
| clients/layouts/hall/rounds-120.md | Clean up + fix/remove broken images |
| clients/layouts/town/head-table.md | Clean up |
| clients/layouts/saloon/rounds-20.md | Clean up |

**Priority 1c: Deprecate Form Duplicates (5 documents)**

Per checkpoint decision (keep forms with catalog), convert these to form documentation format:

| Path | Form Builder Equivalent |
|------|------------------------|
| clients/booking/booking-form-wedding.md | Wedding Booking Form |
| clients/booking/booking-form-shower.md | Shower/Small Party Booking Form |
| clients/booking/booking-form-corporate.md | Corporate Event Booking Form |
| staff/hr/hr-forms.md | Time-Off Request + Warning Form |
| operations/forms/decor-appointment.md | Decor Appointment Form |

### Wave 3: Medium Effort (24 documents)

**Priority 2a: Restructure for Procedure UI (10 documents)**

| Path | Changes Needed |
|------|----------------|
| staff/procedures/closing-procedures.md | Flatten structure, clear numbered steps |
| staff/procedures/phone-system-guide.md | Clarify step sequence |
| staff/training/training-manual.md | Break into sections, numbered steps |
| staff/training/training-program.md | Day-by-day as numbered steps |
| staff/training/sales-script.md | Script format optimization |
| clients/day-of/wedding-processional.md | **Reclassify as procedure**, ceremony steps |
| clients/day-of/quinceanera-processional.md | **Reclassify as procedure**, ceremony steps |

**Priority 2b: Restructure for Reference UI (8 documents)**

| Path | Changes Needed |
|------|----------------|
| operations/bar/alcohol-pull-tracker.md | Optimize table format |
| operations/facilities/venue-layout.md | Simplify 18KB content |
| operations/facilities/maintenance-schedule.md | **Reclassify from procedure**, format as table |
| staff/training/training-schedule.md | **Reclassify from procedure**, format as table |
| clients/day-of/shoe-game-questions.md | Format as bulleted list |
| clients/booking/contract-package-shower.md | Clean up structure |

**Priority 2c: Fix Checklist Format (6 documents)**

| Path | Changes Needed |
|------|----------------|
| clients/planning/checklist-1-3-months.md | Format as proper checklist |
| clients/planning/checklist-4-6-months.md | Format as proper checklist |
| clients/planning/checklist-7-8-months.md | Format as proper checklist |
| clients/planning/checklist-9-12-months.md | Format as proper checklist |
| clients/planning/pre-wedding-todo.md | **Reclassify as checklist**, use checkbox syntax |
| clients/layouts/hall/reset-checklist.md | Format as proper checklist (already checklist type) |

### Wave 4: Heavy Lift (10 documents)

| Path | Scope |
|------|-------|
| operations/forms/tasting-form.md | 205B stub - either create content or remove |
| clients/layouts/hall/head-table.md | Broken images need decision |
| clients/layouts/hall/rounds-120.md | Broken images need decision |
| clients/layouts/open-house/general.md | Very small, may need expansion |
| clients/layouts/open-house/hall.md | Vendor directory |
| operations/catering/catering-sign-up.md | 70KB database dump - may need truncation |
| clients/planning/bridal-planning-2024.md | 28KB spreadsheet - may need simplification |
| clients/planning/micro-wedding-planning.md | 28KB spreadsheet - may need simplification |
| staff/training/training-manual.md | 11.4KB needs major restructuring |

### Wave 5: Remaining Forms (13 documents)

Complete form documentation format for remaining form-type documents:

| Path |
|------|
| clients/day-of/music-list.md |
| operations/bar/bar-event-list.md |
| operations/forms/final-appointment.md |
| operations/forms/vendor-setup.md |
| clients/layouts/hall/reset-checklist.md (already a checklist) |
| clients/layouts/saloon/reset-checklist.md |
| clients/planning/bridal-planning-2024.md |
| clients/planning/micro-wedding-planning.md |

Note: Some form-type documents overlap with other waves. Process once per document.

---

## 5. Quality Checks

### Per-Document Checks

After each document, verify:

| Check | Pass Criteria |
|-------|---------------|
| **Frontmatter valid** | Has title, description, contentType |
| **Structure compliant** | Matches template for content type |
| **No rendering issues** | No whitespace, broken refs, ALL CAPS |
| **Intent preserved** | Original purpose still clear |

### Per-Batch Checks

After completing each content type batch:

| Check | Pass Criteria |
|-------|---------------|
| **Consistent appearance** | All documents of type look similar |
| **All documents processed** | Count matches expected |
| **Reclassifications applied** | Flagged documents moved to correct type |

### Final Checks

Before declaring transposition complete:

| Check | Pass Criteria |
|-------|---------------|
| **62 documents processed** | All on the list touched |
| **7 documents removed** | Index files + recipe-app README gone |
| **No orphaned content** | All documents accessible via type-based nav |
| **Style guide compliance** | Spot-check random documents |

---

## 6. Edge Case Handling

### When to Use Fallback Template

Use the fallback template (see TEMPLATES.md Section 6) when:

1. Document classification is unclear after reading
2. Content spans multiple types (procedure + reference hybrid)
3. Special format is needed that templates don't cover
4. Large data dump that can't be reasonably restructured

### When to Escalate to User

**Always escalate (don't guess) when:**

1. **Classification uncertain** - Could reasonably be 2+ types
2. **Intent unclear** - Can't determine document's purpose
3. **Large file (>25KB)** - May need splitting or special handling
4. **Broken references** - Images/links that can't be resolved
5. **Outdated content** - Information that may be incorrect
6. **Removal candidate** - Content that might not belong

**Escalation format:**

```
**Decision Needed:** [filename]

**Current state:** [what the document contains]
**Issue:** [why escalation is needed]
**Options:**
1. [Option with rationale]
2. [Option with rationale]

**My recommendation:** [if you have one]
```

### Large Files (>25KB)

Three documents exceed 25KB:
- operations/catering/catering-sign-up.md (70KB)
- clients/planning/bridal-planning-2024.md (28KB)
- clients/planning/micro-wedding-planning.md (28KB)

**Options:**
1. **Truncate** - Keep summary, remove full data
2. **Split** - Break into multiple documents
3. **Keep as-is** - Add frontmatter only, preserve content
4. **Redirect** - Point to form builder if appropriate

Escalate for decision on each.

---

## 7. Completion Criteria

### What "Done" Looks Like (Per Document)

A document is "done" when:

1. Frontmatter is complete and valid
2. Structure matches content type template
3. Rendering issues are fixed
4. Original intent is preserved
5. Document is accessible via type-based navigation

### What "Done" Looks Like (Phase 27)

Phase 27 (transposition execution) is complete when:

1. All 62 documents have been transposed
2. All 7 removal candidates have been removed
3. All 5 reclassifications have been applied
4. Quality checks pass for all batches
5. No escalations remain unresolved

### Phase 27 Handoff Checklist

Before Phase 27 begins, verify:

- [ ] TEMPLATES.md is finalized (no changes expected)
- [ ] METHODOLOGY.md is finalized (no changes expected)
- [ ] All checkpoint decisions are applied to documents
- [ ] Execution order is confirmed
- [ ] Estimated effort is realistic (7-12 hours)

---

## Appendix: Document Counts by Type

| Content Type | Original Count | Reclassified In | Reclassified Out | Removed | Final Count |
|--------------|----------------|-----------------|------------------|---------|-------------|
| procedure | 10 | +2 | -3 | 0 | 9 |
| reference | 32 | +2 | -2 | 0 | 32 |
| checklist | 5 | +1 | 0 | 0 | 6 |
| guide | 5 | 0 | 0 | -1 (recipe-app) | 4 |
| form | 18 | 0 | 0 | 0 | 18 |
| index (remove) | 6 | 0 | 0 | -6 | 0 |
| **Total** | **76** | | | **-7** | **69** |

Note: Some documents appear in multiple categories in AUDIT.md due to dual classification. The actual unique document count for transposition is 62.

---

*Methodology created: 2026-01-18*
*Phase: 26-transposition-process-design*
