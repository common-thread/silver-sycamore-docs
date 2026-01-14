# Architecture Analysis - Silver Sycamore Docs

**Generated:** 2026-01-13
**Current Stack:** Jekyll + GitHub Pages
**Target Stack:** Next.js + Convex

---

## Current Site Structure Overview

### Technology Stack
- **Static site generator:** Jekyll
- **Theme:** GitHub Pages Primer (v0.6.0)
- **Hosting:** GitHub Pages at `https://splurfa.github.io/silver-sycamore-docs`
- **Build pipeline:** GitHub Actions workflow with LibreOffice conversion for Office files

### Document Statistics
- Total documents: 68 cataloged (74 actual files)
- Markdown files: ~35
- Office files (.docx, .xlsx): ~38
- PDF files: 1

---

## Navigation Structure

The site uses a flat navigation defined in `_data/navigation.yml`:

```
Home (/)
+-- Services (/services/)
+-- Clients (/clients/)
+-- Staff (/staff/)
+-- Operations (/operations/)
+-- Deliverables (/deliverables/)
+-- Catalog (/CATALOG)
```

---

## Category Hierarchy & Document Organization

### 1. Services (10 documents)
Purpose: What the venue provides - packages, pricing, menus

**Subcategories:**
- Wedding Packages (5): dream, simple-elegance, food-truck, reception-only, salon-town-merry
- Event Packages (4): reception-hall, salon-banquet, salon-party, company-picnic
- Catering (2): wedding menu, off-premise menu
- Add-Ons (2): wedding add-ons, salon party add-ons

### 2. Clients (33 documents)
Purpose: Client-facing materials for booking through event day

**Subcategories:**
- Booking (4): wedding, corporate, shower, contract
- Planning (7): spreadsheets + checklists by timeline
- Day-Of (8): timelines, processionals, music, games
- Room Layouts (14): by venue space (Hall, Saloon, Town, Tea Room, Open House)

### 3. Staff (8 documents)
Purpose: Employee materials - training, procedures, HR

**Subcategories:**
- Training (4): program, manual, schedule, sales script
- Procedures (3): service protocols, closing, phone system
- HR (1): time-off and warning forms

### 4. Operations (9 documents)
Purpose: Running the business - operational forms, tracking

**Subcategories:**
- Forms (4): final appointment, decor, vendor, tasting
- Bar (2): alcohol tracker, event list
- Catering (1): sign-up sheet
- Facilities (2): maintenance, venue layout

### 5. Deliverables (1 document)
Purpose: Projects built during consulting engagement

- Recipe App README

---

## External Integrations to Preserve

| Integration | URL | Backend | Notes |
|-------------|-----|---------|-------|
| Pine Street Cafe Recipe App | https://pine-street-cafe-recipes.vercel.app | Convex `recipes` table | 278 recipes, live |
| Square Off-Premise Catering | https://silver-sycamore-catering.square.site/ | Square | External link |
| Convex Backend | - | `recipes`, `logins` tables | Existing infrastructure |
| GitHub Pages | https://splurfa.github.io/silver-sycamore-docs | Jekyll build | Current hosting |

---

## Build Pipeline Analysis

The GitHub Actions workflow (`pages.yml`) performs:

1. **Office Document Conversion** - LibreOffice converts .docx/.xlsx to HTML
2. **Wrapper Generation** - Creates .md wrappers for converted HTML
3. **Jekyll Build** - Builds static site
4. **Asset Copy** - Copies HTML/PDF to `_site/`
5. **GitHub Pages Deploy** - Deploys to Pages

**Migration Options for Office Files:**
- Continue conversion in build step (server-side)
- Store document content directly in Convex
- Use client-side rendering for complex documents
- Keep Office files as downloadable assets

---

## Proposed Convex Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Documents table - core content storage
  documents: defineTable({
    title: v.string(),
    slug: v.string(),
    category: v.string(),           // "services" | "clients" | "staff" | "operations" | "deliverables"
    subcategory: v.optional(v.string()), // "wedding-packages" | "booking" | "training" | etc.
    content: v.string(),            // Markdown content
    sourceFile: v.optional(v.string()), // Original filename
    sourceType: v.optional(v.string()), // "md" | "docx" | "xlsx" | "pdf"
    description: v.optional(v.string()),
    status: v.optional(v.string()), // "draft" | "review" | "published"
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_slug", ["slug"])
    .index("by_category_subcategory", ["category", "subcategory"])
    .searchIndex("search_content", { searchField: "content", filterFields: ["category"] }),

  // Categories table - for dynamic navigation
  categories: defineTable({
    name: v.string(),               // "Services", "Clients", etc.
    slug: v.string(),               // "services", "clients", etc.
    description: v.string(),
    order: v.number(),
    icon: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"]),

  // Subcategories table - nested organization
  subcategories: defineTable({
    categoryId: v.id("categories"),
    name: v.string(),               // "Wedding Packages"
    slug: v.string(),               // "wedding-packages"
    description: v.string(),
    order: v.number(),
  })
    .index("by_category", ["categoryId"])
    .index("by_slug", ["slug"]),

  // Initiatives table - project tracking
  initiatives: defineTable({
    title: v.string(),
    status: v.string(),             // "active" | "upcoming" | "completed"
    phase: v.optional(v.string()),
    nextActions: v.optional(v.string()),
    completedDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    order: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"]),

  // Files table - binary file storage
  files: defineTable({
    documentId: v.optional(v.id("documents")),
    name: v.string(),
    storageId: v.id("_storage"),
    mimeType: v.string(),
    size: v.number(),
    uploadedAt: v.number(),
  })
    .index("by_document", ["documentId"]),

  // Venue spaces table - for room layouts
  venueSpaces: defineTable({
    name: v.string(),               // "Hall", "Saloon", "Town", "Tea Room"
    slug: v.string(),
    capacity: v.optional(v.number()),
    description: v.optional(v.string()),
  })
    .index("by_slug", ["slug"]),

  // Room layouts table - layout configurations
  roomLayouts: defineTable({
    venueSpaceId: v.id("venueSpaces"),
    name: v.string(),               // "Head Table", "Rounds for 120"
    guestCount: v.optional(v.number()),
    content: v.string(),            // Layout description/diagram
    fileId: v.optional(v.id("files")),
  })
    .index("by_venue", ["venueSpaceId"]),

  // Packages table - wedding/event packages
  packages: defineTable({
    type: v.string(),               // "wedding" | "event" | "catering"
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.optional(v.number()),
    pricePerPerson: v.optional(v.number()),
    duration: v.optional(v.string()),
    inclusions: v.array(v.string()),
    documentId: v.optional(v.id("documents")),
    order: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_slug", ["slug"]),

  // Staff procedures table - SOPs
  procedures: defineTable({
    title: v.string(),
    slug: v.string(),
    category: v.string(),           // "training" | "procedures" | "hr"
    content: v.string(),
    steps: v.optional(v.array(v.object({
      order: v.number(),
      title: v.string(),
      description: v.string(),
    }))),
    documentId: v.optional(v.id("documents")),
  })
    .index("by_category", ["category"])
    .index("by_slug", ["slug"]),
});
```

---

## Proposed Next.js App Structure

```
app/
+-- page.tsx                      # Dashboard (from index.md)
+-- catalog/
|   +-- page.tsx                  # Full catalog view
+-- initiatives/
|   +-- page.tsx                  # Project tracking
+-- services/
|   +-- page.tsx                  # Services hub
|   +-- wedding-packages/
|   |   +-- page.tsx
|   |   +-- [slug]/page.tsx
|   +-- event-packages/
|   |   +-- page.tsx
|   |   +-- [slug]/page.tsx
|   +-- catering/
|   |   +-- page.tsx
|   +-- add-ons/
|       +-- page.tsx
+-- clients/
|   +-- page.tsx                  # Clients hub
|   +-- booking/
|   |   +-- page.tsx
|   +-- planning/
|   |   +-- page.tsx
|   +-- day-of/
|   |   +-- page.tsx
|   +-- layouts/
|       +-- page.tsx
|       +-- [space]/page.tsx      # hall, saloon, town, tea-room
+-- staff/
|   +-- page.tsx                  # Staff hub
|   +-- training/
|   |   +-- page.tsx
|   +-- procedures/
|   |   +-- page.tsx
|   +-- hr/
|       +-- page.tsx
+-- operations/
|   +-- page.tsx                  # Operations hub
|   +-- forms/
|   |   +-- page.tsx
|   +-- bar/
|   |   +-- page.tsx
|   +-- catering/
|   |   +-- page.tsx
|   +-- facilities/
|       +-- page.tsx
+-- deliverables/
    +-- page.tsx
    +-- recipe-app/
        +-- page.tsx
```

---

## Migration Priorities

### Phase 1: Core Infrastructure
- Set up Convex schema with `documents` and `categories` tables
- Build document viewer component
- Migrate Markdown content first (35 files)
- Estimated effort: 2-3 days

### Phase 2: Navigation & Search
- Implement category/subcategory navigation
- Add full-text search via Convex search indexes
- Build breadcrumb system
- Estimated effort: 1-2 days

### Phase 3: Office Documents
- Convert Office files to Markdown or store as files
- Implement file download/preview for complex documents
- Estimated effort: 2-3 days

### Phase 4: Dashboard Features
- Implement initiatives tracker with real-time updates
- Add document status management
- Build admin interface for content editing
- Estimated effort: 2-3 days

---

## Key Technical Decisions

| Decision | Recommendation | Rationale |
|----------|---------------|-----------|
| Content storage | Convex documents table | Enables search, real-time updates, access control |
| Office files | Convert to Markdown + store originals | Markdown for display, originals for download |
| Navigation | Dynamic from categories table | Allows future reorganization without code changes |
| Search | Convex search index | Built-in full-text search, no external service needed |
| File storage | Convex file storage | Unified backend, automatic CDN |
| Authentication | Clerk (if needed) | Integrates with Convex, staff-only areas |

---

## Risk Mitigation

1. **Content Loss:** Export all Jekyll content before migration
2. **Broken Links:** Create redirect map from old URLs to new
3. **Office Formatting:** Test complex documents, keep originals as fallback
4. **Search Quality:** Tune search index, add category filters
5. **Performance:** Use Convex caching, optimize document queries
