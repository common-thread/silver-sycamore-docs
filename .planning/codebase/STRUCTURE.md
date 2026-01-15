# Codebase Structure

**Analysis Date:** 2026-01-14

## Directory Layout

```
silver-sycamore-docs/
├── app/                    # Next.js application (primary development)
│   ├── convex/            # Convex backend functions
│   ├── e2e/               # Playwright E2E tests
│   ├── public/            # Static assets
│   └── src/               # Next.js source code
│       ├── app/           # App Router pages
│       └── components/    # React components
├── _posts/                # Jekyll blog posts (legacy)
├── _layouts/              # Jekyll layouts (legacy)
├── _includes/             # Jekyll includes (legacy)
├── _site/                 # Jekyll build output (gitignored)
├── .planning/             # Project planning documents
│   └── codebase/          # Codebase analysis (this directory)
└── scripts/               # Utility scripts
```

## Directory Purposes

**app/**
- Purpose: Next.js application with Convex backend
- Contains: All active development code
- Key files: `package.json`, `next.config.ts`, `tailwind.config.ts`
- Subdirectories: convex/, e2e/, src/

**app/convex/**
- Purpose: Convex backend functions and schema
- Contains: TypeScript modules defining queries, mutations, schema
- Key files:
  - `schema.ts` - Database schema (11 tables)
  - `documents.ts` - Document CRUD operations
  - `categories.ts` - Category operations
  - `initiatives.ts` - Initiative tracking
  - `seed.ts` - Database seeding functions
- Subdirectories: `_generated/` (auto-generated, gitignored)

**app/src/app/**
- Purpose: Next.js App Router pages
- Contains: Route components, layouts
- Key files:
  - `layout.tsx` - Root layout with ConvexClientProvider
  - `page.tsx` - Homepage
  - `globals.css` - Tailwind base + Heritage Elegance theme
- Subdirectories: `catalog/`, `clients/`, `services/`, `staff/`, `operations/`, `deliverables/`, `[category]/[slug]/`

**app/src/components/**
- Purpose: Reusable React components
- Contains: UI components used across pages
- Key files:
  - `Breadcrumb.tsx` - Navigation breadcrumbs
  - `CategoryGrid.tsx` - Category card display
  - `ContentBox.tsx` - Styled content wrapper
  - `ConvexClientProvider.tsx` - Convex React context
  - `DocumentList.tsx` - Document listing component
  - `DocumentViewer.tsx` - Markdown document renderer
  - `InitiativesTable.tsx` - Project status table
  - `LogoPlaceholder.tsx` - Brand placeholder

**app/e2e/**
- Purpose: Playwright end-to-end tests
- Contains: Test specifications
- Key files:
  - `homepage.spec.ts` - Homepage tests
  - `documents.spec.ts` - Document functionality tests
  - `navigation.spec.ts` - Navigation flow tests
- Subdirectories: None

**.planning/**
- Purpose: Project planning and documentation
- Contains: Exploration summaries, architecture analysis
- Key files:
  - `00-exploration-summary.md` - Initial exploration
  - `03-architecture-analysis.md` - Technical analysis
- Subdirectories: `codebase/` (this analysis)

**Jekyll directories (_posts/, _layouts/, _includes/):**
- Purpose: Legacy static documentation site
- Contains: Markdown posts, HTML templates
- Note: GitHub Pages deployment, separate from Next.js app

## Key File Locations

**Entry Points:**
- `app/src/app/layout.tsx` - Next.js root layout
- `app/src/app/page.tsx` - Homepage
- `app/convex/schema.ts` - Database schema definition

**Configuration:**
- `app/package.json` - Dependencies and scripts
- `app/tsconfig.json` - TypeScript configuration
- `app/next.config.ts` - Next.js configuration
- `app/tailwind.config.ts` - Tailwind theme
- `app/playwright.config.ts` - E2E test configuration
- `app/.env.local` - Environment variables (gitignored)

**Core Logic:**
- `app/convex/documents.ts` - Document queries and mutations
- `app/convex/categories.ts` - Category operations
- `app/src/components/DocumentViewer.tsx` - Document rendering

**Testing:**
- `app/e2e/*.spec.ts` - Playwright E2E tests

**Documentation:**
- `README.md` - Project overview
- `.planning/` - Planning documents

## Naming Conventions

**Files:**
- kebab-case.ts - Convex functions (`documents.ts`, `categories.ts`)
- PascalCase.tsx - React components (`DocumentViewer.tsx`)
- kebab-case.spec.ts - Test files (`homepage.spec.ts`)
- page.tsx, layout.tsx - Next.js special files

**Directories:**
- kebab-case - Feature directories
- [param] - Dynamic route segments (`[category]`, `[slug]`)
- _prefix - Jekyll special directories (`_posts`, `_layouts`)

**Special Patterns:**
- `page.tsx` - Next.js page component
- `layout.tsx` - Next.js layout component
- `*.spec.ts` - Playwright test files

## Where to Add New Code

**New Page:**
- Primary code: `app/src/app/{route}/page.tsx`
- Layout if needed: `app/src/app/{route}/layout.tsx`
- Tests: `app/e2e/{feature}.spec.ts`

**New Component:**
- Implementation: `app/src/components/{ComponentName}.tsx`
- No separate types file (inline TypeScript)

**New Convex Function:**
- Queries/Mutations: `app/convex/{resource}.ts`
- Schema changes: `app/convex/schema.ts`

**New E2E Test:**
- Implementation: `app/e2e/{feature}.spec.ts`

**Utilities:**
- Shared helpers: `app/src/lib/` (create if needed)
- Not currently present

## Special Directories

**app/convex/_generated/**
- Purpose: Auto-generated Convex client code
- Source: Generated by `npx convex dev`
- Committed: No (gitignored)

**_site/**
- Purpose: Jekyll build output
- Source: Generated by Jekyll build
- Committed: No (gitignored)

**node_modules/**
- Purpose: Installed dependencies
- Source: Package manager
- Committed: No (gitignored)

---

*Structure analysis: 2026-01-14*
*Update when directory structure changes*
