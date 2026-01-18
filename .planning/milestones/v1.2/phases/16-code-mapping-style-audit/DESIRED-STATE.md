---
vision: First-principles content architecture
problems_addressed: 7
target_content_types:
  - procedure
  - reference
  - form
  - checklist
  - guide
nav_restructure: purpose-based
component_changes:
  keep:
    - Button
    - Input
    - Select
    - Badge
    - Card
    - SearchBar
    - SearchResults
    - NotificationBell
    - NotificationInbox
    - MessageList
    - MessageItem
    - MessageInput
    - ChannelList
    - UserMenu
    - Logo
  refactor:
    - Header (token adoption)
    - DocumentViewer (semantic rendering)
    - FormRenderer (token adoption)
    - FormBuilder (token adoption, split concerns)
    - CommentSection (token adoption)
    - CommentItem (token adoption)
    - CategoryGrid (dynamic categories)
    - CategoryNav (purpose-based)
    - PageHeader (token adoption)
  new:
    - Accordion
    - CollapsibleSection
    - ContentTypeRenderer
    - ProcedureSteps
    - ChecklistView
    - ReferenceCard
    - QuickActionNav
---

# Target Architecture: v1.2 Content Architecture

**Purpose:** Bridge current state (from USER-FLOWS.md, COMPONENT-MAP.md) and style violations (from STYLE-VIOLATIONS.md) to desired state for v1.2 content architecture refactoring.

**Created:** 2026-01-17
**Phase:** 16-code-mapping-style-audit

---

## 1. Vision Synthesis

The v1.2 milestone addresses 7 core problems with a first-principles approach to content architecture. Each problem maps to a specific desired state:

### Problem-to-Solution Matrix

| # | Problem | Current State | Desired State |
|---|---------|---------------|---------------|
| 1 | Blind markdown conversion | Headers/hierarchy blindly followed, causing duplicate titles (h1 in markdown + title from metadata) | **Intent-based rendering**: Renderer analyzes content structure, strips redundant headers, applies semantic formatting based on content type |
| 2 | No style guide adherence | 89 violations: inline styles, hardcoded values (`#C75050`, `0.875rem`, `1.5rem`) | **Design token enforcement**: All components use CSS custom properties exclusively. No hardcoded colors, spacing, typography |
| 3 | No semantic formatting | One-size-fits-all ReactMarkdown rendering regardless of content type | **Type-specific formatting**: Procedures get numbered steps with visual progress. Checklists render as interactive checkboxes. References show structured metadata |
| 4 | Missing progressive disclosure | Flat content display, long documents scroll forever | **Accordions and collapsibles**: Sections collapse by default. FAQ-style content expandable. Progressive reveal reduces cognitive load |
| 5 | Misleading navigation | "Clients" implies client list but contains booking/planning forms. Category-based nav structure | **Purpose-based navigation**: Nav reflects user intent ("Book an Event", "Day-Of Procedures") not content location. Quick actions surface common tasks |
| 6 | Redundant content | Some forms exist as BOTH markdown docs AND in form builder | **Single source of truth**: Each piece of content exists in exactly one authoritative location. Forms in form builder. Procedures in documents. Clear ownership |
| 7 | No content type decisions | Everything is "document" regardless of purpose | **Explicit content types**: Each document has a declared type (procedure, reference, form, checklist, guide) that determines its rendering strategy |

---

## 2. Target Navigation Architecture

Based on USER-FLOWS.md pain points and v1.2 vision, the navigation should shift from category-based to purpose-based.

### Current Navigation (Category-Based)

```
Home | Services | Clients | Staff | Operations | Deliverables | Messages | Forms | Workspace
```

**Problems identified in USER-FLOWS.md:**
- "Clients" is misleading (contains forms, not client list)
- Category pages are static (subcategory lists hardcoded)
- No cross-feature navigation between related content
- Search is content-only, no filtering by type

### Target Navigation (Purpose-Based)

**Scaffold - Phase 19 will refine:**

```
Dashboard | Procedures | References | Forms | Messages | Workspace
                       |
                       v
             Quick Action Surface
```

**Key principles:**

1. **User intent over content location**: "How do I...?" not "Where is the file...?"
2. **Quick actions prominent**: Most common tasks (new booking form, event day checklist) one click away
3. **Dynamic filtering**: Search can filter by content type, not just full-text
4. **Cross-linking**: Documents link to related forms, procedures reference other procedures

### Navigation Component Changes

| Current Component | Change | Rationale |
|-------------------|--------|-----------|
| `Header.tsx` nav items | Restructure around purpose categories | Align with user mental model |
| `CategoryNav.tsx` | Replace with purpose-based nav or deprecate | Categories don't map to user intent |
| `CategoryGrid.tsx` | Transform to Quick Actions grid | Surface common tasks, not category counts |
| N/A | New: `QuickActionNav` | Purpose-driven navigation hub |

### Flexibility Points (for Phase 19)

- Exact nav item names TBD (user research may inform)
- Quick action selection based on usage analytics if available
- Mobile navigation pattern open (hamburger vs bottom nav)
- Subcategory organization pending content audit results

---

## 3. Target Component Architecture

Based on COMPONENT-MAP.md analysis and style violations, components fall into three categories:

### 3.1 Keep As-Is

These components are well-implemented and don't need structural changes:

| Component | Category | Reason |
|-----------|----------|--------|
| `Button` | ui-primitive | Good structure, just needs token adoption |
| `Input` | ui-primitive | Well-encapsulated, token adoption needed |
| `Select` | ui-primitive | Recently rebuilt (Phase 15), solid |
| `Badge` | ui-primitive | Simple, works well |
| `Card` | ui-primitive | Good abstraction |
| `SearchBar` | shared | Works, needs token adoption |
| `SearchResults` | shared | Good data flow |
| `NotificationBell` | feature | Clean implementation |
| `NotificationInbox` | feature | Works well |
| `MessageList` | feature | Good real-time integration |
| `MessageItem` | feature | Solid, complex but appropriate |
| `MessageInput` | feature | Works with @mentions |
| `ChannelList` | feature | Clean |
| `UserMenu` | feature | Simple, works |
| `Logo` | ui-primitive | SVG, no styling issues |

### 3.2 Refactor for Design System Compliance

These need style violations fixed (Phase 17):

| Component | LOC | Violations | Refactor Focus |
|-----------|-----|------------|----------------|
| `Header.tsx` | 154 | 8 | Token adoption for spacing, typography, transitions |
| `DocumentViewer.tsx` | 148 | 8 | Token adoption + prepare for semantic rendering |
| `FormRenderer.tsx` | 510 | 18 | Token adoption (7 error color, 6 typography, 4 spacing) |
| `FormBuilder.tsx` | 605 | 15 | Token adoption + consider splitting into smaller components |
| `CommentSection.tsx` | 202 | 10 | Token adoption |
| `CommentItem.tsx` | 597 | TBD | Token adoption, consider simplifying |
| `CategoryGrid.tsx` | 65 | Low | Prepare for purpose-based transformation |
| `CategoryNav.tsx` | 165 | Low | Prepare for purpose-based transformation |
| `PageHeader.tsx` | 122 | Low | Token adoption |

**Phase 17 priority order:**
1. Error color standardization (#C75050 -> var(--color-error)) - 21 instances
2. Typography token adoption - 24 violations
3. Spacing token adoption - 28 violations
4. Transition standardization - 5 violations
5. Border radius consistency - 8 violations

### 3.3 Create New Components

These support the v1.2 content architecture vision:

| New Component | Purpose | Phase |
|---------------|---------|-------|
| `Accordion` | Collapsible section wrapper | 20 |
| `CollapsibleSection` | Content-aware collapsible with header | 20 |
| `ContentTypeRenderer` | Routes to type-specific rendering | 20 |
| `ProcedureSteps` | Renders numbered procedure with visual progress | 20 |
| `ChecklistView` | Interactive checkbox rendering for checklists | 20 |
| `ReferenceCard` | Metadata-rich reference document display | 20 |
| `QuickActionNav` | Purpose-driven navigation hub | 19 |

**Component architecture principles:**
- Composition over complexity (small focused components)
- Design tokens exclusively (no inline values)
- Props-driven variants (not internal conditionals)
- Data-agnostic where possible (receive data, don't query)

---

## 4. Content Type System

### 4.1 Content Type Definitions

Each document will have an explicit content type that determines its rendering strategy:

| Content Type | Description | Rendering Strategy | Example |
|--------------|-------------|-------------------|---------|
| `procedure` | Step-by-step instructions | Numbered steps, visual progress, completion tracking | "How to Set Up for a Wedding" |
| `reference` | Factual information to consult | Metadata-rich display, quick scanning, search-optimized | "Venue Capacity Chart", "Pricing Guide" |
| `form` | Data collection interface | Redirect to form builder, no markdown rendering | "Client Intake Form" |
| `checklist` | Items to complete | Interactive checkboxes, progress indicator | "Event Day Checklist" |
| `guide` | Explanatory content | Prose-optimized, collapsible sections, TOC | "Onboarding Guide for New Staff" |

### 4.2 Type Detection Rules

**For Phase 18 content audit:**

1. **Explicit declaration** (preferred): Document metadata includes `contentType` field
2. **Heuristic detection** (fallback):
   - Contains numbered steps + imperative verbs -> `procedure`
   - Contains checkboxes or bullet lists of tasks -> `checklist`
   - Title contains "Form" or "Intake" -> consider `form`
   - Contains tables of data/specs -> `reference`
   - Default fallback -> `guide`

### 4.3 Type-to-Renderer Mapping

```
contentType -> Renderer Component
├── procedure -> ProcedureSteps
├── reference -> ReferenceCard + standard ReactMarkdown
├── form -> FormRenderer (redirect to /forms/[id])
├── checklist -> ChecklistView
└── guide -> ReactMarkdown with CollapsibleSection
```

### 4.4 Extensibility (for Phase 18)

The content type system should be:
- **Additive**: New types can be added without breaking existing content
- **Graceful degradation**: Unknown types fall back to `guide` rendering
- **Override-capable**: Individual documents can customize their rendering

---

## 5. Data Model Changes

### 5.1 Documents Table Extension

**Current schema (from COMPONENT-MAP.md data flows):**
```
documents:
  - title
  - slug
  - content
  - category
  - version
  - ...
```

**Target schema addition:**
```
documents:
  - title
  - slug
  - content
  - category
  - version
  - contentType: "procedure" | "reference" | "form" | "checklist" | "guide"  # NEW
  - formId?: Id<formSchemas>  # NEW - link to form if contentType is "form"
  - ...
```

### 5.2 Navigation Structure

**Current:** Categories table drives nav
**Target:** Purpose-based nav configuration (possibly static or configurable)

**Flexibility point:** Phase 19 will determine if purpose nav is:
- Hardcoded in Header.tsx
- Database-driven via new config table
- JSON configuration file

---

## 6. Implementation Scaffold

### Phase 17: Base Component Fixes

**Scope:** Fix 89 style violations across components

**Priority order from STYLE-VIOLATIONS.md:**
1. **Quick wins (find-replace):**
   - Error color: `#C75050` -> `var(--color-error)` (21 instances)
   - Typography: hardcoded sizes -> `var(--text-*)` tokens (24 instances)
   - Spacing: hardcoded rem -> `var(--space-*)` tokens (28 instances)

2. **Medium effort (component review):**
   - Transitions: `180ms ease-out` -> `var(--duration-fast) var(--ease-out)`
   - Shadows: custom rgba -> `var(--shadow-*)` tokens
   - Border radius: `4px` -> `0` (brand aesthetic decision made in Phase 16)

3. **Complex (architecture changes):**
   - Add missing tokens to globals.css (error variants, half-step spacing)
   - Consider splitting FormBuilder (605 LOC) into smaller components

**Verification:** Style violation count drops to 0

### Phase 18: Content Audit + Type Decisions

**Scope:** Review all content, assign content types, identify redundancy

**Framework to apply:**
1. Scan all documents in Convex
2. Apply type detection rules (see 4.2)
3. Flag edge cases for human decision
4. Mark redundant content (form + markdown doc)
5. Output: Content type assignments, redundancy report

**Flexibility point:** Phase 18 will validate content types against actual content. May discover new types or find some types unused.

### Phase 19: IA Redesign

**Scope:** Implement purpose-based navigation

**From this document:**
- Replace category-based nav with purpose-based nav
- Transform CategoryGrid to Quick Actions
- Implement QuickActionNav component
- Cross-link related content

**Flexibility point:** Exact nav structure determined by Phase 18 content audit results

### Phase 20: Semantic Formatting + Progressive Disclosure

**Scope:** Type-specific rendering components

**New components from section 3.3:**
- Accordion / CollapsibleSection
- ContentTypeRenderer (routing layer)
- ProcedureSteps, ChecklistView, ReferenceCard

**Integration:**
- DocumentViewer routes through ContentTypeRenderer
- ContentTypeRenderer selects renderer based on document.contentType
- Default fallback for untyped content

### Phases 21-23: Form Builder + Workspace + Creation Flows

**Scope:** Extended features building on v1.2 foundation

- Phase 21: Visual form builder rebuild (section-based like Google Forms)
- Phase 22: Forms in workspace, universal @mention comments
- Phase 23: Fix broken folder/document creation, management dashboard

**Dependencies:** All depend on Phases 17-20 completing successfully

---

## 7. Change Categories

### Style Enforcement (Quick Wins from STYLE-VIOLATIONS.md)

| Category | Count | Example | Phase |
|----------|-------|---------|-------|
| Color tokens | 21 | `#C75050` -> `var(--color-error)` | 17 |
| Typography tokens | 24 | `0.875rem` -> `var(--text-sm)` | 17 |
| Spacing tokens | 28 | `1.5rem` -> `var(--space-6)` | 17 |
| Transition tokens | 5 | `180ms ease-out` -> token | 17 |
| Border tokens | 8 | `4px` -> `0` (brand) | 17 |
| Shadow tokens | 3 | Custom rgba -> `var(--shadow-*)` | 17 |

### Structure Changes (Component Splitting/Combining)

| Change | Component | Rationale | Phase |
|--------|-----------|-----------|-------|
| Split | FormBuilder (605 LOC) | Too many responsibilities | 17 or 21 |
| Split | CommentItem (597 LOC) | Complex state + mutations | 17 |
| Transform | CategoryGrid -> QuickActions | Purpose-based nav | 19 |
| Deprecate | CategoryNav | Purpose-based nav replaces | 19 |

### New Capabilities

| Capability | Components | Phase |
|------------|------------|-------|
| Progressive disclosure | Accordion, CollapsibleSection | 20 |
| Semantic rendering | ContentTypeRenderer, ProcedureSteps, etc. | 20 |
| Purpose-based nav | QuickActionNav | 19 |
| Content types | documents.contentType field | 18 |

### Data Model Changes

| Change | Table | Field | Phase |
|--------|-------|-------|-------|
| Add | documents | contentType | 18 |
| Add | documents | formId | 18 |
| Consider | new table | navConfig | 19 |

---

## 8. Flexibility Points

These are explicitly marked for subsequent phases to adapt:

### Navigation Structure (Phase 19)

- Exact nav items and naming TBD (content audit will inform)
- Static vs dynamic nav configuration decision pending
- Mobile navigation pattern open

### Content Types (Phase 18)

- May discover additional types during content audit
- May find some types unnecessary
- Detection heuristics may need refinement

### Component Boundaries (Phase 17)

- FormBuilder split decision depends on refactoring complexity
- Additional components may be identified during token adoption
- Some violations may require new tokens vs just adoption

### Rendering Strategies (Phase 20)

- Specific rendering for each content type will be designed during Phase 20
- May need additional components discovered during implementation
- Accessibility considerations may drive changes

---

## 9. Success Metrics

How to measure v1.2 success:

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| Style violations | 89 | 0 | Run style audit after Phase 17 |
| Content type coverage | 0% | 100% | All documents have explicit contentType |
| Redundant content | Present | Eliminated | Audit for dual form+markdown |
| Navigation clarity | Category-based | Purpose-based | User feedback, task completion |
| Token adoption | Partial | Full | Grep for hardcoded values |
| Progressive disclosure | None | Implemented | Accordions on long docs |

### Quality Gates

**Phase 17 exit:**
- [ ] Style violation count = 0
- [ ] All components use design tokens exclusively

**Phase 18 exit:**
- [ ] All documents have contentType assigned
- [ ] Redundancy report complete

**Phase 19 exit:**
- [ ] Purpose-based navigation live
- [ ] Quick actions surface top tasks

**Phase 20 exit:**
- [ ] Semantic rendering active for all content types
- [ ] Progressive disclosure implemented

**v1.2 milestone exit:**
- [ ] All 7 problems from vision addressed
- [ ] Staff feedback positive on navigation clarity

---

*Target Architecture: 2026-01-17*
*Phase: 16-code-mapping-style-audit*
*Plan: 16-03*
