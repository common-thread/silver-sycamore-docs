# Content Tracker

**Generated:** 2026-01-17
**Phase:** 18-content-audit-type-decisions
**Purpose:** Systematic content type classification for all documents and forms

---

## Summary

- **Total documents:** 65
- **Total forms (formSchemas):** 18
- **By content type:**
  - procedure: 13 documents
  - reference: 21 documents
  - form: 12 documents
  - checklist: 4 documents
  - guide: 15 documents
- **Redundant content:** 13 items (documents that exist in both markdown and form builder)
- **Edge cases (needs human review):** 12 documents

---

## Document Classifications

### Procedures

Step-by-step instructions with numbered steps and imperative verbs.

| Document | Category | Confidence | Notes |
|----------|----------|------------|-------|
| Admin Training Manual | staff/training | high | Contains numbered steps with imperative verbs |
| Waitstaff Training Program | staff/training | high | Contains numbered steps with imperative verbs |
| Points of Service (23 Steps) | staff/procedures | high | Contains numbered steps with imperative verbs |
| Phone System Guide | staff/procedures | high | Contains numbered steps with imperative verbs |
| Daily Closing Procedures | staff/procedures | high | Contains numbered steps with imperative verbs |
| Phone Sales Script | staff/training | medium | Script for staff to follow |
| Maintenance Schedule | operations/facilities | medium | Day-by-day task schedule with imperative verbs (reclassified from guide) |
| Wedding Processional | clients/day-of | medium | Binary file - event sequence/timeline |
| Timeline: Evening 6-11pm | clients/day-of | medium | Binary file - event sequence/timeline |
| Timeline: Micro Wedding | clients/day-of | medium | Binary file - event sequence/timeline |
| Quinceanera Processional | clients/day-of | medium | Binary file - event sequence/timeline |
| Timeline: First Dance After Dinner | clients/day-of | medium | Binary file - event sequence/timeline |
| Timeline: First Look | clients/day-of | medium | Binary file - event sequence/timeline |

### References

Factual lookup data: menus, packages, pricing, venue layouts, specifications.

| Document | Category | Confidence | Notes |
|----------|----------|------------|-------|
| Wedding Catering Menu | services/catering | high | Contains tables with pricing/specification data |
| Reception Hall Packages | services/event-packages | high | Contains tables with pricing/specification data |
| Salon Banquet Package | services/event-packages | high | Contains tables with pricing/specification data |
| Company Picnic Proposal | services/event-packages | high | Contains tables with pricing/specification data |
| Wedding Add-Ons | services/add-ons | high | Contains tables with pricing/specification data |
| Salon Party Add-Ons | services/add-ons | high | Contains tables with pricing/specification data |
| Salon Party Packages | services/event-packages | high | Package options with pricing - reclassified from form |
| Shower Contract Package | clients/booking | medium | Package/menu/pricing document |
| Salon & Town Merry Package | services/wedding-packages | medium | Package/menu/pricing document |
| Food Truck Fun Package | services/wedding-packages | medium | Package/menu/pricing document |
| Simple Elegance Package | services/wedding-packages | medium | Package/menu/pricing document |
| Dream Package | services/wedding-packages | medium | Package/menu/pricing document |
| Reception Only Package | services/wedding-packages | medium | Package/menu/pricing document |
| Venue Layout | operations/facilities | medium | Binary file - venue/seating reference |
| Alcohol Pull Tracker | operations/bar | medium | Binary file - data tracking document |
| Rounds for 120 | clients/hall | medium | Binary file - venue/seating reference |
| Head Table (hall) | clients/hall | medium | Binary file - venue/seating reference |
| Rounds for 20 | clients/saloon | medium | Binary file - venue/seating reference |
| Head Table (town) | clients/town | medium | Binary file - venue/seating reference |
| Round Tables | clients/town | medium | Binary file - venue/seating reference |
| Bridal Planning Sheet 2024 | clients/planning | medium | Binary file - data tracking document |
| Micro Wedding Planning | clients/planning | medium | Binary file - data tracking document |
| Off Premise Menu | services/catering | medium | Binary file - menu reference |

### Forms (redirect to form builder)

Data collection interfaces - these should use the form builder, not markdown rendering.

| Document | Category | Confidence | Form Builder Entry | Resolution |
|----------|----------|------------|-------------------|------------|
| HR Forms | staff/hr | high | Employee Time-Off Request Form, Employee Warning Form | keep form builder |
| Wedding Booking Form | clients/booking | high | Wedding Booking Form | keep form builder |
| Shower/Small Party Booking Form | clients/booking | high | Shower/Small Party Booking Form | keep form builder |
| Corporate Booking Form | clients/booking | high | Corporate Event Booking Form | keep form builder |
| Vendor Setup Form | operations/forms | medium | Vendor Setup Form | keep form builder |
| Tasting Form | operations/forms | medium | Menu Tasting Form | keep form builder |
| Decor Appointment Form | operations/forms | medium | Decor Appointment Form | keep form builder |
| Final Appointment Form | operations/forms | medium | Final Appointment Form | keep form builder |
| Music List | clients/day-of | medium | Music Selection Form | keep form builder |
| Shoe Game Questions | clients/day-of | medium | - | consider form builder |

### Checklists

Items to complete with checkbox or bullet-list format.

| Document | Category | Confidence | Form Builder Entry | Resolution |
|----------|----------|------------|-------------------|------------|
| Reset Checklist (hall) | clients/hall | medium | Hall Reset Checklist | keep form builder |
| Reset Checklist (saloon) | clients/saloon | medium | Saloon Reset Checklist | keep form builder |
| README | deliverables/recipe-app | high | - | keep as guide, not operational content |

**Note:** The README has checkbox items but is project documentation, not operational content. It should be classified as `guide`.

### Guides

Explanatory prose content, training materials, general documentation.

| Document | Category | Confidence | Notes |
|----------|----------|------------|-------|
| Training Schedule | staff/training | high | Training/guide/manual content |
| README | deliverables/recipe-app | medium | Project documentation (reclassified from checklist) |
| Bar Event List | operations/bar | low | Binary file - cannot analyze content |
| Catering Sign-Up Sheet | operations/catering | low | Binary file - cannot analyze content |
| Standard | clients/tea-room | low | Binary file - cannot analyze content |
| Valentine's Day | clients/tea-room | low | Binary file - cannot analyze content |
| Aubrey 100 | clients/town | low | Binary file - cannot analyze content |
| Aubrey 75 | clients/town | low | Binary file - cannot analyze content |
| Town | clients/open-house | low | Binary file - cannot analyze content |
| Hall | clients/open-house | low | Binary file - cannot analyze content |
| General | clients/open-house | low | Binary file - cannot analyze content |
| Saloon | clients/open-house | low | Binary file - cannot analyze content |
| 4-6 Months Out | clients/planning | low | Binary file - should be checklist |
| Pre-Wedding To Do List | clients/planning | low | Binary file - should be checklist |
| 9-12 Months Out | clients/planning | low | Binary file - should be checklist |
| 1-3 Months Out | clients/planning | low | Binary file - should be checklist |
| 7-8 Months Out | clients/planning | low | Binary file - should be checklist |

---

## Form Builder Entries (formSchemas)

All forms currently in the form builder system.

| Form Title | Form ID | Category | Original File | Status |
|------------|---------|----------|---------------|--------|
| Test Feedback Form | test-feedback-form | general | - | active |
| Music Selection Form | day-of-music-list | day-of | clients/day-of/music-list.docx | draft |
| Saloon Reset Checklist | reset-checklist-saloon | operations-checklist | clients/layouts/saloon/reset-checklist.docx | draft |
| Hall Reset Checklist | reset-checklist-hall | operations-checklist | clients/layouts/hall/reset-checklist.docx | draft |
| Pre-Wedding To Do List | checklist-pre-wedding | planning-checklist | clients/planning/pre-wedding-todo.docx | draft |
| Planning Checklist: 1-3 Months Out | checklist-1-3-months | planning-checklist | clients/planning/checklist-1-3-months.docx | draft |
| Planning Checklist: 4-6 Months Out | checklist-4-6-months | planning-checklist | clients/planning/checklist-4-6-months.docx | draft |
| Planning Checklist: 7-8 Months Out | checklist-7-8-months | planning-checklist | clients/planning/checklist-7-8-months.docx | draft |
| Planning Checklist: 9-12 Months Out | checklist-9-12-months | planning-checklist | clients/planning/checklist-9-12-months.docx | draft |
| Menu Tasting Form | operations-tasting | operations | operations/forms/tasting-form.pdf | draft |
| Vendor Setup Form | operations-vendor-setup | operations | operations/forms/vendor-setup.docx | draft |
| Final Appointment Form | operations-final-appointment | operations | operations/forms/final-appointment.docx | draft |
| Decor Appointment Form | operations-decor-appointment | operations | operations/forms/decor-appointment.docx | draft |
| Employee Warning Form | hr-employee-warning | hr | staff/hr/hr-forms.md | draft |
| Employee Time-Off Request Form | hr-time-off-request | hr | staff/hr/hr-forms.md | draft |
| Shower/Small Party Booking Form | booking-shower | booking | clients/booking/booking-form-shower.md | draft |
| Corporate Event Booking Form | booking-corporate | booking | clients/booking/booking-form-corporate.md | draft |
| Wedding Booking Form | booking-wedding | booking | clients/booking/booking-form-wedding.md | draft |

---

## Redundancy Report

Documents that exist in both markdown/document format AND in the form builder.

| Document | Document Location | Duplicate Form | Resolution |
|----------|-------------------|----------------|------------|
| HR Forms | staff/hr/hr-forms.md | Employee Time-Off Request Form, Employee Warning Form | **keep form** - deprecate document |
| Wedding Booking Form | clients/booking/booking-form-wedding.md | Wedding Booking Form | **keep form** - deprecate document |
| Shower/Small Party Booking Form | clients/booking/booking-form-shower.md | Shower/Small Party Booking Form | **keep form** - deprecate document |
| Corporate Booking Form | clients/booking/booking-form-corporate.md | Corporate Event Booking Form | **keep form** - deprecate document |
| Vendor Setup Form | operations/forms/vendor-setup.docx | Vendor Setup Form | **keep form** - binary can be archived |
| Tasting Form | operations/forms/tasting-form.pdf | Menu Tasting Form | **keep form** - binary can be archived |
| Decor Appointment Form | operations/forms/decor-appointment.docx | Decor Appointment Form | **keep form** - binary can be archived |
| Final Appointment Form | operations/forms/final-appointment.docx | Final Appointment Form | **keep form** - binary can be archived |
| Music List | clients/day-of/music-list.docx | Music Selection Form | **keep form** - binary can be archived |
| Reset Checklist (hall) | clients/hall/reset-checklist.docx | Hall Reset Checklist | **keep form** - binary can be archived |
| Reset Checklist (saloon) | clients/saloon/reset-checklist.docx | Saloon Reset Checklist | **keep form** - binary can be archived |
| Planning checklists (5 docs) | clients/planning/*.docx | Planning Checklist forms (5) | **keep form** - binaries can be archived |

**Resolution Summary:**
- **13 redundant items identified**
- **Recommended action:** Keep form builder entries as authoritative source, archive or deprecate document versions
- Forms are interactive, support submissions, and have structured fields - better for data collection than static documents

---

## Edge Cases (Needs Human Review)

Documents where classification is uncertain or content could not be analyzed.

| Document | Best Guess | Confidence | Reason |
|----------|------------|------------|--------|
| Bar Event List | guide | low | Binary DOCX - cannot analyze content. Could be reference or procedure. |
| Catering Sign-Up Sheet | guide | low | Binary XLSX - likely a form/tracker. Consider form builder. |
| Standard (tea-room) | guide | low | Binary DOCX - unknown purpose. Likely venue setup reference. |
| Valentine's Day (tea-room) | guide | low | Binary DOCX - likely event-specific setup reference. |
| Aubrey 100 | guide | low | Binary DOCX - likely venue layout reference for 100 guests. |
| Aubrey 75 | guide | low | Binary DOCX - likely venue layout reference for 75 guests. |
| Town (open-house) | guide | low | Binary DOCX - likely event setup procedure or checklist. |
| Hall (open-house) | guide | low | Binary DOCX - likely event setup procedure or checklist. |
| General (open-house) | guide | low | Binary DOCX - likely general event procedures. |
| Saloon (open-house) | guide | low | Binary DOCX - likely event setup procedure or checklist. |
| 4-6 Months Out | guide | low | Binary DOCX - title suggests checklist, has form builder entry. |
| Shoe Game Questions | form | medium | Binary DOCX - could be reference list or form. |

**Recommended Actions:**
1. Convert binary files to markdown for proper classification
2. For checklist documents (4-6 Months, etc.), use form builder entry as source of truth
3. Open-house documents likely need manual review to determine if they're procedures, checklists, or references

---

## Classification Statistics

### By Confidence Level

| Confidence | Count | Percentage |
|------------|-------|------------|
| High | 26 | 40% |
| Medium | 27 | 42% |
| Low | 12 | 18% |

### By Source Type

| Source Type | Count | Notes |
|-------------|-------|-------|
| Markdown (.md) | 23 | Fully analyzable, high confidence |
| Binary (DOCX/XLSX/PDF) | 42 | Limited analysis, title-based inference |

### Binary Files by Inferred Type

| Inferred Type | Count |
|---------------|-------|
| reference (venue/seating) | 8 |
| procedure (timeline) | 6 |
| form | 6 |
| checklist | 2 |
| guide (unknown) | 12 |
| reference (tracker/planning) | 5 |
| reference (menu) | 1 |
| form (sign-up sheet) | 1 |

---

## Next Phase Readiness

### For Phase 19 (IA Redesign)

Content type assignments enable purpose-based navigation:
- **Procedures** (13): Staff how-to content, event timelines
- **References** (21): Lookup content - packages, menus, pricing, layouts
- **Forms** (12): Client-facing data collection via form builder
- **Checklists** (4): Interactive task completion
- **Guides** (15): Training materials, documentation

### For Phase 20 (Semantic Rendering)

Each content type maps to a specific renderer:
- `procedure` -> ProcedureSteps component
- `reference` -> ReferenceCard + standard ReactMarkdown
- `form` -> FormRenderer (redirect to /forms/[id])
- `checklist` -> ChecklistView component
- `guide` -> ReactMarkdown with CollapsibleSection

### Outstanding Issues

1. **Binary file conversion needed:** 12 low-confidence documents need conversion to markdown
2. **Form builder completeness:** Some form builder entries are in "draft" status and need publishing
3. **Redundancy cleanup:** 13 redundant items need document versions deprecated/archived

---

*Tracker generated: 2026-01-17*
*Phase: 18-content-audit-type-decisions*
*Plan: 18-01*
