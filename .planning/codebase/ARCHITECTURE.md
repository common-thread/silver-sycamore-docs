# Architecture

**Analysis Date:** 2026-01-14

## Pattern Overview

**Overall:** Dual-System Repository with Migration in Progress

**Key Characteristics:**
- Jekyll static site (root) for legacy GitHub Pages documentation
- Next.js App Router application (`app/`) for dynamic document management
- Convex backend-as-a-service for real-time data
- File-based routing with dynamic segments
- Real-time reactive queries via Convex subscriptions

## Layers

**Presentation Layer:**
- Purpose: React components and Next.js pages
- Contains: Page components, UI components, layouts
- Location: `app/src/app/`, `app/src/components/`
- Depends on: Convex queries for data
- Used by: Browser/end users

**Data Layer:**
- Purpose: Backend functions and database schema
- Contains: Queries, mutations, schema definitions, seed data
- Location: `app/convex/`
- Depends on: Convex runtime
- Used by: Presentation layer via React hooks

**Legacy Layer:**
- Purpose: Static documentation site
- Contains: Jekyll templates, markdown posts, assets
- Location: Root directory (`_posts/`, `_layouts/`, `_includes/`)
- Depends on: Jekyll build system
- Used by: GitHub Pages deployment

## Data Flow

**Document View Request:**

1. User navigates to `/catalog/bar-program` (Next.js route)
2. App Router renders `app/src/app/[category]/[slug]/page.tsx`
3. Component calls `useQuery(api.documents.bySlug, { slug })`
4. Convex client subscribes to real-time query
5. Convex backend executes query against database
6. Data returned and rendered via `DocumentViewer` component
7. Real-time updates pushed automatically on data changes

**State Management:**
- Server state: Convex reactive queries (real-time sync)
- No client-side state management library (React state only)
- URL-based routing state via Next.js App Router

## Key Abstractions

**Convex Queries:**
- Purpose: Read operations with real-time subscriptions
- Examples: `app/convex/documents.ts` (list, byCategory, bySlug, search)
- Pattern: Exported functions called via `useQuery` hook

**Convex Mutations:**
- Purpose: Write operations with optimistic updates
- Examples: `app/convex/documents.ts` (create, update, deleteAll)
- Pattern: Exported functions called via `useMutation` hook

**React Components:**
- Purpose: Reusable UI building blocks
- Examples: `app/src/components/DocumentViewer.tsx`, `CategoryGrid.tsx`
- Pattern: Functional components with TypeScript props

**Page Components:**
- Purpose: Route-specific layouts and data fetching
- Examples: `app/src/app/page.tsx`, `app/src/app/[category]/[slug]/page.tsx`
- Pattern: Next.js App Router conventions

## Entry Points

**Next.js App:**
- Location: `app/src/app/layout.tsx`
- Triggers: HTTP request to app routes
- Responsibilities: Root layout, ConvexClientProvider, global styles

**Convex Backend:**
- Location: `app/convex/` (all .ts files)
- Triggers: Client-side query/mutation calls
- Responsibilities: Database operations, business logic

**Jekyll Site:**
- Location: `index.html`, `_layouts/default.html`
- Triggers: GitHub Pages deployment
- Responsibilities: Static documentation rendering

## Error Handling

**Strategy:** Not explicitly implemented (minimal error handling observed)

**Patterns:**
- Convex queries return null for not-found cases
- Components handle null/undefined data with conditional rendering
- No global error boundary detected

## Cross-Cutting Concerns

**Logging:**
- Console logging only (development)
- No structured logging framework

**Validation:**
- Convex schema validation (database layer)
- TypeScript compile-time type checking
- No runtime form validation library detected

**Authentication:**
- Not implemented yet
- Planned: Convex Auth for user access control

**Styling:**
- Tailwind CSS v4 with Heritage Elegance theme
- CSS variables for brand colors (`--color-ink`, `--color-cream`, etc.)
- Custom fonts: Cormorant Garamond (display), Source Sans 3 (body)

---

*Architecture analysis: 2026-01-14*
*Update when major patterns change*
