# Coding Conventions

**Analysis Date:** 2026-01-16

## Naming Patterns

**Files:**
- PascalCase for React components: `Header.tsx`, `FormBuilder.tsx`, `NotificationBell.tsx`
- camelCase for utilities/modules: `usePermissions.ts`, `roles.ts`, `documents.ts`
- kebab-case for route directories: `[category]/`, `[formId]/edit/`
- `*.spec.ts` for test files: `basic.spec.ts`, `notifications.spec.ts`

**Functions:**
- camelCase for all functions: `getCurrentUser`, `handleSubmit`, `fetchDocuments`
- No special prefix for async functions
- `handle*` for event handlers: `handleClick`, `handleChange`, `handleSubmit`
- Convex queries: `list`, `byId`, `bySlug`, `byCategory`, `search`
- Convex mutations: `create`, `update`, `delete`, `add`, `remove`

**Variables:**
- camelCase for variables: `isSaving`, `formData`, `currentUser`
- Boolean prefix pattern: `is*`, `has*`, `can*` (`isSaving`, `hasError`, `canEdit`)
- CONSTANT_CASE for true constants: `SCREENSHOT_DIR`, `AUTH_DIR`
- camelCase for object constants: `navItems`, `subcategories`

**Types:**
- PascalCase for interfaces: `User`, `Document`, `FormField` (no `I` prefix)
- PascalCase for type aliases: `ButtonVariant`, `FormFieldType`
- Props suffix for component props: `HeaderProps`, `ButtonProps`

**Database Tables:**
- camelCase plural: `documents`, `userProfiles`, `formSchemas`, `channelMembers`
- Indexes: `by_[field]` pattern: `by_category`, `by_slug`, `by_userId`

## Code Style

**Formatting:**
- 2-space indentation
- Double quotes for strings: `"use client"`, `import { useState } from "react"`
- Semicolons required
- ESLint enforced via `app/eslint.config.mjs`

**Linting:**
- ESLint 9.x with Next.js recommended rules
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Run: `bun run lint` (if script exists)

**Styling:**
- Inline styles with `style` prop preferred over className
- CSS variables for design tokens in `globals.css`
- Tailwind CSS available but design token approach emphasized

## Import Organization

**Order:**
1. React/Next.js imports: `import { useState } from "react"`
2. External packages: `import { useQuery } from "convex/react"`
3. Internal modules: `import { api } from "../../convex/_generated/api"`
4. Relative imports: `import { Button } from "./ui/Button"`
5. Type imports: `import type { Id } from "./_generated/dataModel"`

**Grouping:**
- Blank line between groups
- No strict alphabetical ordering observed

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)

## Error Handling

**Patterns:**
- Try/catch in mutation handlers
- Error messages displayed via console or UI alerts
- Convex validation via `v.string()`, `v.id()`, etc.

**Error Types:**
- Throw on invalid input, missing auth, not found
- Generic catch with user-friendly message: `"Failed to save. Please try again."`

## Logging

**Framework:**
- Console.log for debugging
- No structured logging library

**Patterns:**
- Console.log in test files for progress
- No logging in production code (minimal)

## Comments

**When to Comment:**
- JSDoc blocks for global setup functions
- Section comments in CSS with decorative borders
- Inline comments for non-obvious logic

**JSDoc/TSDoc:**
- Used for global setup and complex functions
- Not consistently applied to all public APIs

**TODO Comments:**
- Format: `// TODO: description`
- Some with acknowledgment: `// Note: In production, consider...`

## Function Design

**Size:**
- Some large functions exist (see CONCERNS.md)
- Preference for smaller, focused functions

**Parameters:**
- Convex functions use `args` object with schema validation
- React components use destructured props

**Return Values:**
- Explicit returns preferred
- `Promise<void>` for mutations with side effects

## Module Design

**Exports:**
- Named exports for Convex functions: `export const list = query({...})`
- Default export for React components common but not universal
- Barrel files not commonly used

**Client Directive:**
- `"use client"` at top of every client component
- Server components are the default (no directive)

## Component Patterns

**Structure:**
```typescript
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ComponentName() {
  const data = useQuery(api.module.queryName);
  const mutate = useMutation(api.module.mutationName);

  // State
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const handleSubmit = async () => {
    // ...
  };

  // Render
  return (
    <div style={{ /* inline styles */ }}>
      {/* content */}
    </div>
  );
}
```

## Design Token Usage

**CSS Variables (in `globals.css`):**
- `--color-*`: Colors (`--color-ink`, `--color-accent`, `--color-surface`)
- `--font-*`: Typography (`--font-display`, `--font-body`)
- `--text-*`: Type scale (`--text-xs` through `--text-5xl`)
- `--space-*`: Spacing (`--space-3`, `--space-4`)
- `--leading-*`: Line heights
- `--tracking-*`: Letter spacing

**Usage:**
```css
font-family: var(--font-display);
color: var(--color-ink);
font-size: var(--text-lg);
```

---

*Convention analysis: 2026-01-16*
*Update when patterns change*
