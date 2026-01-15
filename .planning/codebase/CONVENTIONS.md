# Coding Conventions

**Analysis Date:** 2026-01-14

## Naming Patterns

**Files:**
- kebab-case.ts for Convex functions (`documents.ts`, `categories.ts`)
- PascalCase.tsx for React components (`DocumentViewer.tsx`, `CategoryGrid.tsx`)
- page.tsx, layout.tsx for Next.js special files
- *.spec.ts for Playwright test files

**Functions:**
- camelCase for all functions
- Convex queries: `list`, `byCategory`, `bySlug`, `search`
- Convex mutations: `create`, `update`, `deleteAll`
- React handlers: `onClick`, `onSubmit` (standard React patterns)

**Variables:**
- camelCase for variables
- UPPER_SNAKE_CASE for constants (not observed, likely camelCase used)

**Types:**
- PascalCase for interfaces and types
- Convex schema uses `v.string()`, `v.number()` validators
- Inferred types from Convex schema (no manual type definitions)

## Code Style

**Formatting:**
- No Prettier config detected (uses defaults or none)
- 2 space indentation (TypeScript standard)
- Single quotes for strings (inferred from Next.js conventions)

**Linting:**
- ESLint 9 configured
- Config: `app/eslint.config.mjs`
- Extends: @typescript-eslint (implied)

## Import Organization

**Order (inferred from Next.js conventions):**
1. React/Next.js imports (`"use client"`, React)
2. External packages (convex, react-markdown)
3. Internal modules (@/components, @/lib)
4. Relative imports (./utils, ../types)

**Path Aliases:**
- `@/` maps to `app/src/` (Next.js standard)

## Error Handling

**Patterns:**
- Minimal explicit error handling observed
- Convex queries return null for not-found
- Conditional rendering for null/undefined data

**Error Types:**
- No custom error classes observed
- Relies on TypeScript for type safety

## Logging

**Framework:**
- Console logging only (console.log, console.error)
- No structured logging library

**Patterns:**
- Development debugging via console
- No production logging strategy observed

## Comments

**When to Comment:**
- Minimal comments in codebase (clean, self-documenting code)
- JSDoc not used extensively

**TODO Comments:**
- None detected (clean codebase)

## Function Design

**Size:**
- Small, focused functions
- Convex functions are single-purpose (one query/mutation per export)

**Parameters:**
- Convex functions use object destructuring: `({ slug }: { slug: string })`
- React components use typed props

**Return Values:**
- Convex queries return data or null
- React components return JSX

## Module Design

**Exports:**
- Named exports for Convex functions
- Default exports for React components (Next.js convention)

**Barrel Files:**
- Not used (direct imports to specific files)

## React Patterns

**Components:**
- Functional components with TypeScript
- `"use client"` directive for client components
- Server components by default (Next.js App Router)

**Hooks:**
- `useQuery` for Convex reactive queries
- `useMutation` for Convex mutations
- Standard React hooks (useState, useEffect as needed)

**Props:**
- Inline TypeScript types
- Destructured in function signature

## Convex Patterns

**Schema Definition:**
```typescript
defineSchema({
  tableName: defineTable({
    field: v.string(),
    optionalField: v.optional(v.string()),
  }).index("by_field", ["field"]),
})
```

**Query Pattern:**
```typescript
export const queryName = query({
  args: { param: v.string() },
  handler: async (ctx, { param }) => {
    return await ctx.db.query("table")
      .withIndex("by_field", q => q.eq("field", param))
      .collect();
  },
});
```

**Mutation Pattern:**
```typescript
export const mutationName = mutation({
  args: { field: v.string() },
  handler: async (ctx, { field }) => {
    return await ctx.db.insert("table", { field });
  },
});
```

## CSS Patterns

**Tailwind CSS v4:**
- Utility classes in className
- CSS variables for theme (`--color-ink`, `--color-cream`)
- Custom theme in `app/src/app/globals.css`

**Heritage Elegance Theme:**
- `--color-ink: #1E1E1E` (dark text)
- `--color-cream: #F9F5F0` (background)
- `--font-display: 'Cormorant Garamond'` (headings)
- `--font-body: 'Source Sans 3'` (body text)

---

*Convention analysis: 2026-01-14*
*Update when patterns change*
