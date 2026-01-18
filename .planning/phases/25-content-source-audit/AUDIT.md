# Content Source Audit

**Phase:** 25-content-source-audit
**Generated:** 2026-01-18
**Purpose:** Comprehensive inventory of all source content files with analysis of rendering issues, style compliance, and transposition recommendations for Phase 26.

---

## Executive Summary

| Metric | Count |
|--------|-------|
| **Total source files** | 111 |
| **Markdown files (.md)** | 74 |
| **Binary files (.docx/.xlsx/.pdf)** | 37 |
| **Index/navigation files** | 6 |
| **Content-bearing documents** | 68 (excluding index files) |
| **Documents needing transposition** | 62 |
| **Quick wins (minor fixes)** | 28 |
| **Medium effort** | 24 |
| **Heavy lift** | 10 |

**Key Finding:** Content was imported but never transposed for the app UI context. Documents retain their original "print document" formatting rather than being optimized for interactive staff hub use.

---

## Section 1: File Inventory

### 1.1 Markdown Files by Category

#### clients/ (31 files)

| Path | Filename | Size | Content Type | Has Frontmatter | Notes |
|------|----------|------|--------------|-----------------|-------|
| booking/ | booking-form-corporate.md | 956B | form | No | Fill-in-blank form |
| booking/ | booking-form-shower.md | 1.2KB | form | No | Fill-in-blank form |
| booking/ | booking-form-wedding.md | 1.4KB | form | No | Fill-in-blank form |
| booking/ | contract-package-shower.md | 1.8KB | reference | No | Contract terms + pricing |
| day-of/ | music-list.md | 1.2KB | form | No | Fill-in-blank form |
| day-of/ | quinceanera-processional.md | 1.5KB | reference | No | Ceremony order reference |
| day-of/ | shoe-game-questions.md | 1.5KB | reference | No | Question bank |
| day-of/ | timeline-evening-6-11pm.md | 513B | reference | No | Timeline reference |
| day-of/ | timeline-first-dance-after-dinner.md | 601B | reference | No | Timeline reference |
| day-of/ | timeline-first-look.md | 647B | reference | No | Timeline reference |
| day-of/ | timeline-micro-wedding.md | 510B | reference | No | Timeline reference |
| day-of/ | wedding-processional.md | 2.7KB | procedure | No | Ceremony order with positions |
| layouts/hall/ | head-table.md | 555B | reference | No | Layout diagram (broken images) |
| layouts/hall/ | reset-checklist.md | 347B | checklist | No | Reset inventory |
| layouts/hall/ | rounds-120.md | 347B | reference | No | Layout diagram (broken images) |
| layouts/open-house/ | general.md | 285B | reference | No | Layout reference |
| layouts/open-house/ | hall.md | 808B | reference | No | Vendor directory |
| layouts/open-house/ | saloon.md | 392B | reference | No | Vendor directory |
| layouts/open-house/ | town.md | 474B | reference | No | Layout reference |
| layouts/saloon/ | reset-checklist.md | 308B | checklist | No | Reset inventory |
| layouts/saloon/ | rounds-20.md | 358B | reference | No | Layout reference |
| layouts/tea-room/ | standard.md | 377B | reference | No | Layout reference |
| layouts/tea-room/ | valentines-day.md | 718B | reference | No | Layout reference |
| layouts/town/ | aubrey-75.md | 782B | reference | No | Layout reference |
| layouts/town/ | aubrey-100.md | 836B | reference | No | Layout reference |
| layouts/town/ | head-table.md | 340B | reference | No | Layout reference |
| layouts/town/ | round-tables.md | 602B | reference | No | Layout reference |
| planning/ | bridal-planning-2024.md | 28KB | form | No | Large planning spreadsheet |
| planning/ | checklist-1-3-months.md | 1.9KB | checklist | No | Planning checklist |
| planning/ | checklist-4-6-months.md | 2.4KB | checklist | No | Planning checklist |
| planning/ | checklist-7-8-months.md | 2.2KB | checklist | No | Planning checklist |
| planning/ | checklist-9-12-months.md | 1.5KB | checklist | No | Planning checklist |
| planning/ | micro-wedding-planning.md | 28KB | form | No | Large planning spreadsheet |
| planning/ | pre-wedding-todo.md | 884B | procedure | No | Week-of task list |

#### services/ (13 files)

| Path | Filename | Size | Content Type | Has Frontmatter | Notes |
|------|----------|------|--------------|-----------------|-------|
| add-ons/ | addons-wedding.md | 1.8KB | reference | No | Pricing table |
| add-ons/ | packages-salon-parties.md | 6.5KB | reference | No | Pricing + packages |
| catering/ | catering-menu.md | 6.8KB | reference | No | Full menu + pricing |
| catering/ | off-premise-menu.md | 5.7KB | reference | No | Off-site catering menu |
| event-packages/ | package-salon-banquet.md | 2.8KB | reference | No | Package details + pricing |
| event-packages/ | packages-reception-hall.md | 3.8KB | reference | No | Multiple packages |
| event-packages/ | proposal-company-picnic.md | 1.5KB | reference | No | Proposal template |
| event-packages/ | salon-party-packages.md | 5.8KB | reference | No | Multiple packages |
| wedding-packages/ | package-dream.md | 2.7KB | reference | No | Premium package details |
| wedding-packages/ | package-food-truck.md | 1.1KB | reference | No | Package details |
| wedding-packages/ | package-reception-only.md | 966B | reference | No | Package details |
| wedding-packages/ | package-salon-town-merry.md | 1.3KB | reference | No | Package details |
| wedding-packages/ | package-simple-elegance.md | 1.3KB | reference | No | Package details |

#### staff/ (10 files)

| Path | Filename | Size | Content Type | Has Frontmatter | Notes |
|------|----------|------|--------------|-----------------|-------|
| hr/ | hr-forms.md | 2.1KB | form | No | Time-off + warning forms |
| procedures/ | closing-procedures.md | 5.4KB | procedure | No | Multi-section closing routines |
| procedures/ | phone-system-guide.md | 3.5KB | procedure | No | Phone operation steps |
| procedures/ | service-protocols.md | 4.9KB | procedure | No | 23-step service protocol |
| training/ | sales-script.md | 2.6KB | procedure | No | Phone script dialogue |
| training/ | training-manual.md | 11.4KB | procedure | No | 12-section training |
| training/ | training-program.md | 3.5KB | procedure | No | 5-day onboarding |
| training/ | training-schedule.md | 678B | procedure | No | Day-by-day schedule |

#### operations/ (10 files)

| Path | Filename | Size | Content Type | Has Frontmatter | Notes |
|------|----------|------|--------------|-----------------|-------|
| bar/ | alcohol-pull-tracker.md | 937B | reference | No | Inventory table |
| bar/ | bar-event-list.md | 539B | form | No | Event bar setup form |
| catering/ | catering-sign-up.md | 70KB | reference | No | Large event database |
| facilities/ | maintenance-schedule.md | 2.4KB | procedure | No | Weekly task schedule |
| facilities/ | venue-layout.md | 18KB | reference | No | Multi-sheet layout guide |
| forms/ | decor-appointment.md | 502B | form | No | Appointment form |
| forms/ | final-appointment.md | 1.8KB | form | No | Pre-wedding meeting form |
| forms/ | tasting-form.md | 205B | reference | No | Stub (actual is PDF) |
| forms/ | vendor-setup.md | 588B | form | No | Vendor coordination form |

#### deliverables/ (2 files)

| Path | Filename | Size | Content Type | Has Frontmatter | Notes |
|------|----------|------|--------------|-----------------|-------|
| - | index.md | 331B | guide | Yes | Live projects index |
| recipe-app/ | README.md | 820B | checklist | No | Project status + todos |

#### style-guides/ (4 files)

| Path | Filename | Size | Content Type | Has Frontmatter | Notes |
|------|----------|------|--------------|-----------------|-------|
| - | index.md | 1.3KB | guide | Yes | Style guide navigation |
| - | editorial-archive-main.md | 5.4KB | guide | Yes | Main design system |
| - | editorial-archive-wedding.md | 5.1KB | guide | Yes | Wedding variant |
| - | editorial-archive-staff-hub.md | 8.2KB | guide | Yes | Staff hub variant |

### 1.2 Index Files Analysis

The docs/ directory contains 6 index.md files serving as category navigation pages.

| File | Structure | Link Style | Issues |
|------|-----------|------------|--------|
| clients/index.md | Tables + lists | Mixed (.md, .html) | Inconsistent link extensions |
| services/index.md | Tables | Mostly no extension | Good |
| staff/index.md | Tables | No extension | Good |
| operations/index.md | Tables | Mixed (.html, no ext) | Inconsistent |
| deliverables/index.md | Tables | Folder links | Good |
| style-guides/index.md | Tables | No extension | Good |

**Issue:** Index files use inconsistent link extensions (.html vs no extension vs .md). Some reference GitHub Pages URLs rather than internal routes.

### 1.3 Binary Files (37 files)

These files exist alongside their markdown conversions from Phase 20-FIX.

| Category | Count | Types | Status |
|----------|-------|-------|--------|
| clients/day-of/ | 8 | .docx | Converted to .md |
| clients/planning/ | 7 | .docx (4), .xlsx (2) | Converted to .md |
| clients/layouts/ | 17 | .docx | Converted to .md |
| operations/ | 4 | .docx (2), .xlsx (2), .pdf (1) | Converted (except PDF) |
| services/ | 1 | .docx | Converted to .md |

**Resolution:** Binary files are retained as originals. Markdown conversions are the canonical source for the app. The PDF (tasting-form.pdf) was not converted and has a stub markdown file.

---

## Section 2: Navigation Mapping

### 2.1 Current Nav Structure (Header.tsx)

| Nav Item | Route | Content Source | Document Count |
|----------|-------|----------------|----------------|
| Home | / | QuickActionNav cards | - |
| Procedures | /procedures | contentType="procedure" | 10 |
| References | /references | contentType="reference" | 32 |
| Checklists | /checklists | contentType="checklist" | 5 |
| Guides | /guides | contentType="guide" | 5 |
| Style Guides | /style-guides | docs/style-guides/ | 4 |
| My Workspace | /workspace | User workspace | - |

### 2.2 Docs/ to Nav Mapping

| Docs Directory | Primary Nav Target | Notes |
|----------------|-------------------|-------|
| clients/booking/ | References or Forms | Booking forms should route to form builder |
| clients/day-of/ | References | Timelines, processionals |
| clients/planning/ | Checklists | Planning checklists |
| clients/layouts/ | References | Venue layouts |
| services/ | References | Packages, menus, pricing |
| staff/procedures/ | Procedures | Core procedures |
| staff/training/ | Procedures | Training procedures |
| staff/hr/ | Forms (redirect) | HR forms in form builder |
| operations/ | Mixed | Forms, references, procedures |
| deliverables/ | Guides | Project documentation |
| style-guides/ | Style Guides | Design system docs |

### 2.3 Navigation Issues

1. **No direct access to docs/ structure** - Users navigate by content type, not by original folder structure
2. **Index.md files orphaned** - Category navigation pages not visible in type-based nav
3. **Mixed content in operations/** - Contains forms, references, and procedures
4. **Booking forms duplicated** - Exist as markdown AND in form builder

---

## Section 3: Rendering Issues

### 3.1 Breaking Issues (Severity: High)

| Issue | Affected Files | Impact |
|-------|----------------|--------|
| **Broken image references** | layouts/hall/head-table.md, layouts/hall/rounds-120.md, etc. | Images show as broken links (reference .gif files that don't exist) |
| **Excessive whitespace** | timeline-first-look.md, other converted files | Double-spaced lines create poor reading experience |
| **Raw HTML artifacts** | Some converted docs | `&nbsp;` entities, inline styles |

### 3.2 Degraded Issues (Severity: Medium)

| Issue | Affected Files | Impact |
|-------|----------------|--------|
| **No frontmatter** | 68/74 markdown files | Missing metadata (title, description, contentType) |
| **Inconsistent heading hierarchy** | closing-procedures.md, training-manual.md | Mix of H1/H2/H3 without clear structure |
| **Tables without headers** | booking forms, appointment forms | Tables used for layout, not data |
| **Numbered lists as prose** | service-protocols.md | 23 steps formatted as numbered sections, not as list |
| **Bold for emphasis overuse** | Multiple procedures | **ALL CAPS** and **bold** used for emphasis |

### 3.3 Cosmetic Issues (Severity: Low)

| Issue | Affected Files | Impact |
|-------|----------------|--------|
| **Inconsistent formatting** | Multiple | Some use `---` dividers, some don't |
| **Source attribution** | closing-procedures.md, service-protocols.md | "Source:" metadata inline rather than in frontmatter |
| **Date references** | Some documents | Outdated dates (e.g., "Revised: 08-26-20") |
| **Contact info in content** | package-dream.md | Address, phone, URL in document body |

---

## Section 4: Style Compliance Report

### 4.1 Staff Hub Style Guide Requirements

Per `docs/style-guides/editorial-archive-staff-hub.md`:

| Requirement | Compliance Status | Notes |
|-------------|-------------------|-------|
| Typography hierarchy (H1 < H2 < H3) | Partial | Many docs use inconsistent levels |
| Information density | Poor | Many docs too sparse or too dense |
| Status colors for completion | N/A | Content doesn't use status indicators |
| Procedure step styling | Poor | Steps not using procedure-step CSS |
| Reference scanability | Partial | Some tables, but not optimized |
| Print-friendly layouts | Unknown | Not tested |

### 4.2 Content Type Compliance

| Content Type | Count | Compliant | Non-Compliant | Issues |
|--------------|-------|-----------|---------------|--------|
| procedure | 10 | 0 | 10 | Not using numbered step UI, inconsistent structure |
| reference | 32 | 15 | 17 | Some have good tables, others lack structure |
| checklist | 5 | 0 | 5 | Not using checkbox UI, formatted as prose |
| guide | 5 | 4 | 1 | Index files good, deliverables README needs work |
| form | 18 | 0 | 18 | Should redirect to form builder, not render markdown |

### 4.3 Intent vs Presentation Mismatch

**Key Problem:** Content was written for print/static documents but is displayed in an interactive web app.

| Document Type | Original Intent | Current Presentation | Should Be |
|---------------|-----------------|---------------------|-----------|
| Closing Procedures | Printed checklist | Static markdown | Interactive procedure with step completion |
| Service Protocols | Training poster | Static markdown | Numbered steps with completion tracking |
| Planning Checklists | Printed handout | Static prose | Interactive checklist with checkboxes |
| Booking Forms | Paper form | Static table | Form builder form (already exists) |
| Timeline References | Reference card | Static list | Clean timeline view with times emphasized |

---

## Section 5: Gap Analysis

### 5.1 Missing Content

| Expected Content | Status | Notes |
|------------------|--------|-------|
| tasting-form.pdf content | Missing | Only stub markdown exists |
| Binary file images | Missing | Layout diagrams reference .gif files that don't exist |
| Cross-references | Incomplete | Some docs reference other docs that may not be linked |

### 5.2 Incomplete Documents

| Document | Issue | Recommended Action |
|----------|-------|-------------------|
| tasting-form.md | 205B stub, no real content | Create from PDF or use form builder |
| layouts with broken images | Image references don't resolve | Either fix images or remove image syntax |

### 5.3 Outdated Content

| Document | Outdated Element | Notes |
|----------|------------------|-------|
| service-protocols.md | "Revised: 08-26-20" | Date references 2020 |
| checklist-1-3-months.md | Vendor recommendations | May need verification |
| hr-forms.md | Form formats | May need modernization |

### 5.4 Orphaned Content

| Document | Issue | Resolution |
|----------|-------|------------|
| All index.md files | Not accessible via type-based navigation | Consider adding to Guides or removing |
| contract-package-shower.md | Contract mixed with pricing | Split or clarify |

---

## Section 6: Redundancy Report

### 6.1 Form Builder Duplicates (18 items)

Per Phase 18 CONTENT-TRACKER.md, these documents duplicate form builder entries:

| Document | Form Builder Equivalent | Resolution |
|----------|------------------------|------------|
| booking-form-wedding.md | Wedding Booking Form | **Keep form builder, deprecate doc** |
| booking-form-shower.md | Shower/Small Party Booking Form | **Keep form builder, deprecate doc** |
| booking-form-corporate.md | Corporate Event Booking Form | **Keep form builder, deprecate doc** |
| hr-forms.md | Time-Off Request + Warning Form | **Keep form builder, deprecate doc** |
| music-list.md | Music Selection Form | **Keep form builder, deprecate doc** |
| decor-appointment.md | Decor Appointment Form | **Keep form builder, deprecate doc** |
| final-appointment.md | Final Appointment Form | **Keep form builder, deprecate doc** |
| vendor-setup.md | Vendor Setup Form | **Keep form builder, deprecate doc** |
| bar-event-list.md | Bar Event List | **Keep form builder, deprecate doc** |
| reset-checklist (hall).md | Hall Reset Checklist | **Keep form builder, deprecate doc** |
| reset-checklist (saloon).md | Saloon Reset Checklist | **Keep form builder, deprecate doc** |
| bridal-planning-2024.md | Bridal Planning Sheet | **Keep form builder, deprecate doc** |
| micro-wedding-planning.md | Micro Wedding Planning | **Keep form builder, deprecate doc** |
| checklist-1-3-months.md | Planning Checklist | **Keep form builder, archive doc** |
| checklist-4-6-months.md | Planning Checklist | **Keep form builder, archive doc** |
| checklist-7-8-months.md | Planning Checklist | **Keep form builder, archive doc** |
| checklist-9-12-months.md | Planning Checklist | **Keep form builder, archive doc** |
| tasting-form.md | Menu Tasting Form | **Keep form builder, archive PDF** |

### 6.2 Binary/Markdown Duplicates (37 items)

Each binary file (.docx/.xlsx) has a corresponding markdown conversion. The markdown is canonical; binaries are retained as originals.

**Resolution:** No action needed. Binary files serve as backup/reference only.

---

## Section 7: Content Type Misclassifications

The following documents may need reclassification based on content analysis:

| Document | Current Type | Should Be | Rationale |
|----------|--------------|-----------|-----------|
| wedding-processional.md | reference | procedure | Contains ordered steps for ceremony |
| quinceanera-processional.md | reference | procedure | Contains ordered ceremony positions |
| contract-package-shower.md | reference | reference | Correctly typed but needs clarification |
| pre-wedding-todo.md | procedure | checklist | Task list, not step-by-step procedure |
| maintenance-schedule.md | procedure | reference | Day-by-day schedule, not a procedure |
| shoe-game-questions.md | reference | reference | Correctly typed |
| training-schedule.md | procedure | reference | Schedule reference, not procedure |
| catering-sign-up.md | reference | reference | Event database (correctly typed) |
| recipe-app/README.md | checklist | guide | Project documentation with todos |
| deliverables/index.md | guide | guide | Correctly typed |
| All timelines | reference | reference | Correctly typed |
| All layouts | reference | reference | Correctly typed |

**Total Potential Reclassifications:** 6 documents

---

## Section 8: Prioritized Transposition List

### Priority 1: Quick Wins (28 documents)

Low effort, high impact. Changes can be made quickly with clear improvements.

#### 8.1a Add Frontmatter Only (15 documents)

These documents have good structure but need metadata:

| Document | Action |
|----------|--------|
| All style-guides/*.md | Already have frontmatter (skip) |
| services/catering/catering-menu.md | Add frontmatter |
| services/catering/off-premise-menu.md | Add frontmatter |
| services/add-ons/addons-wedding.md | Add frontmatter |
| services/add-ons/packages-salon-parties.md | Add frontmatter |
| services/wedding-packages/*.md (5 files) | Add frontmatter |
| services/event-packages/*.md (4 files) | Add frontmatter |
| staff/procedures/service-protocols.md | Add frontmatter |

#### 8.1b Remove Excessive Whitespace (8 documents)

These have double-spaced lines from conversion:

| Document | Action |
|----------|--------|
| clients/day-of/timeline-first-look.md | Remove extra blank lines |
| clients/day-of/timeline-evening-6-11pm.md | Remove extra blank lines |
| clients/day-of/timeline-first-dance-after-dinner.md | Remove extra blank lines |
| clients/day-of/timeline-micro-wedding.md | Remove extra blank lines |
| clients/layouts/hall/head-table.md | Clean up, fix/remove broken images |
| clients/layouts/hall/rounds-120.md | Clean up, fix/remove broken images |
| clients/layouts/town/head-table.md | Clean up |
| clients/layouts/saloon/rounds-20.md | Clean up |

#### 8.1c Deprecate Form Duplicates (5 documents)

Route to form builder instead:

| Document | Action |
|----------|--------|
| clients/booking/booking-form-wedding.md | Add redirect note or remove |
| clients/booking/booking-form-shower.md | Add redirect note or remove |
| clients/booking/booking-form-corporate.md | Add redirect note or remove |
| staff/hr/hr-forms.md | Add redirect note or remove |
| operations/forms/decor-appointment.md | Add redirect note or remove |

### Priority 2: Medium Effort (24 documents)

Require content restructuring but not complete rewrite.

#### 8.2a Restructure for Procedure UI (10 documents)

| Document | Changes Needed |
|----------|----------------|
| staff/procedures/closing-procedures.md | Flatten structure, clear numbered steps |
| staff/procedures/service-protocols.md | Extract 23 steps as proper list |
| staff/procedures/phone-system-guide.md | Clarify step sequence |
| staff/training/training-manual.md | Break into sections, numbered steps |
| staff/training/training-program.md | Day-by-day as numbered steps |
| staff/training/training-schedule.md | Reclassify as reference |
| staff/training/sales-script.md | Script format optimization |
| operations/facilities/maintenance-schedule.md | Reclassify as reference, format as table |
| clients/day-of/wedding-processional.md | Reclassify as procedure |
| clients/day-of/quinceanera-processional.md | Reclassify as procedure |

#### 8.2b Restructure for Reference UI (8 documents)

| Document | Changes Needed |
|----------|----------------|
| operations/bar/alcohol-pull-tracker.md | Optimize table format |
| operations/facilities/venue-layout.md | Simplify large content |
| operations/catering/catering-sign-up.md | Simplify 70KB database dump |
| clients/planning/bridal-planning-2024.md | Simplify 28KB spreadsheet |
| clients/planning/micro-wedding-planning.md | Simplify 28KB spreadsheet |
| clients/booking/contract-package-shower.md | Clean up structure |
| clients/day-of/shoe-game-questions.md | Format as bulleted list |
| deliverables/recipe-app/README.md | Reclassify as guide |

#### 8.2c Fix Checklist Format (6 documents)

| Document | Changes Needed |
|----------|----------------|
| clients/planning/checklist-1-3-months.md | Format as proper checklist |
| clients/planning/checklist-4-6-months.md | Format as proper checklist |
| clients/planning/checklist-7-8-months.md | Format as proper checklist |
| clients/planning/checklist-9-12-months.md | Format as proper checklist |
| clients/planning/pre-wedding-todo.md | Reclassify as checklist |
| layouts/hall/reset-checklist.md | Format as proper checklist |

### Priority 3: Heavy Lift (10 documents)

Require significant rewriting, merging, or structural changes.

| Document | Scope |
|----------|-------|
| operations/forms/tasting-form.md | Create content from PDF or remove |
| All broken image layouts (5 files) | Either restore images or rewrite as text descriptions |
| Index.md files (6 files) | Decide: integrate into nav, convert to guides, or remove |
| staff/training/training-manual.md | 11KB document needs major restructuring |
| Large spreadsheet conversions (2 files) | May need to stay as-is or link to form builder |

---

## Section 9: Scope Summary for Phase 26

### 9.1 Total Transposition Scope

| Category | Count | Estimated Effort |
|----------|-------|------------------|
| Quick wins (frontmatter, whitespace, deprecate) | 28 | 1-2 hours |
| Medium effort (restructure) | 24 | 4-6 hours |
| Heavy lift (rewrite/decisions) | 10 | 2-4 hours |
| **Total** | 62 | 7-12 hours |

### 9.2 Documents NOT Needing Transposition (12)

| Category | Documents | Reason |
|----------|-----------|--------|
| Style guides | 4 | Already well-formatted with frontmatter |
| Good references | 8 | Properly structured tables and content |

### 9.3 Recommended Phase 26 Approach

1. **Batch by type** - Process all procedures together, all references together
2. **Frontmatter first** - Add metadata to enable proper typing
3. **Address form duplicates** - Clear decision on deprecate vs redirect
4. **Fix rendering issues** - Whitespace, broken images
5. **Restructure for UI** - Adapt content for interactive use
6. **Heavy lift last** - Large files and index decisions

---

## Section 10: Recommendations

### 10.1 Immediate Actions (Before Phase 26)

1. **Decide form duplicate strategy** - Remove, redirect notice, or keep as reference?
2. **Decide index.md fate** - Integrate, convert, or remove?
3. **Confirm content type reclassifications** - 6 documents may need type changes

### 10.2 Phase 26 Methodology Suggestions

1. Create frontmatter template with required fields (title, description, contentType)
2. Establish whitespace cleanup rules (single blank lines between sections)
3. Define procedure step format (numbered list with specific structure)
4. Define checklist format (checkbox markdown syntax)
5. Create reference format guidelines (tables, scannable structure)

### 10.3 Out of Scope for v1.3

1. Binary file cleanup (retain as originals)
2. Form builder enhancements (separate initiative)
3. New content creation (focus on transposition)
4. Index.md integration (may defer to v1.4)

---

*Audit generated: 2026-01-18*
*Phase: 25-content-source-audit*
*Plan: 25-01*
