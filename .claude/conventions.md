# Code Conventions

This document defines coding conventions for the Silver Sycamore codebase.

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| React components | PascalCase | `DocumentViewer.tsx` |
| Convex functions | camelCase | `documents.ts` |
| Hooks | camelCase, `use` prefix | `usePermissions.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types | PascalCase | `Document.ts` |
| Constants | SCREAMING_SNAKE_CASE | `API_ENDPOINTS.ts` |

## Function Naming

| Prefix | Usage | Example |
|--------|-------|---------|
| `handle*` | Event handlers | `handleClick`, `handleSubmit` |
| `is*` | Boolean checks | `isAdmin`, `isLoading` |
| `has*` | Possession checks | `hasPermission`, `hasAccess` |
| `can*` | Capability checks | `canEdit`, `canDelete` |
| `get*` | Synchronous getters | `getUser`, `getDocumentById` |
| `fetch*` | Async data fetching | `fetchDocuments`, `fetchUser` |
| `create*` | Creation operations | `createDocument`, `createUser` |
| `update*` | Update operations | `updateDocument`, `updateUser` |
| `delete*` | Deletion operations | `deleteDocument`, `deleteUser` |

## Component Structure

```tsx
// 1. Imports (grouped and ordered)
import { useState, useEffect } from "react";          // React
import { useQuery, useMutation } from "convex/react"; // External libs
import { api } from "@/convex/_generated/api";        // Internal - API
import { Button } from "@/components/ui/button";      // Internal - Components
import { cn } from "@/lib/utils";                     // Internal - Utilities
import type { Document } from "@/types";              // Types (last)

// 2. Types/Interfaces (if component-specific)
interface DocumentCardProps {
  document: Document;
  onEdit?: (id: string) => void;
  className?: string;
}

// 3. Component definition
export function DocumentCard({ document, onEdit, className }: DocumentCardProps) {
  // 3a. Hooks (all hooks at top)
  const [isEditing, setIsEditing] = useState(false);
  const updateDocument = useMutation(api.documents.update);

  // 3b. Derived state / memos
  const canEdit = document.permissions.includes("edit");

  // 3c. Effects
  useEffect(() => {
    // Side effects here
  }, [dependency]);

  // 3d. Event handlers
  const handleEdit = () => {
    setIsEditing(true);
    onEdit?.(document._id);
  };

  // 3e. Render
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <h3>{document.title}</h3>
      {canEdit && <Button onClick={handleEdit}>Edit</Button>}
    </div>
  );
}
```

## Convex Backend Patterns

### Query with Authentication

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./lib/auth";

export const getDocument = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);  // Always check auth first

    const document = await ctx.db.get(args.id);
    if (!document) return null;

    // Check access permissions
    if (document.ownerId !== user._id && !document.isPublic) {
      return null;  // Don't reveal existence
    }

    return document;
  },
});
```

### Mutation with Permission Check

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./lib/auth";
import { assertPermission } from "./permissions";

export const updateDocument = mutation({
  args: {
    id: v.id("documents"),
    title: v.string()
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    await assertPermission(ctx, "edit_content");  // Check specific permission

    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new Error("Document not found");
    }

    await ctx.db.patch(args.id, {
      title: args.title,
      updatedAt: Date.now()
    });

    return args.id;
  },
});
```

## Role-Based Access Patterns

```typescript
import { hasRole, ROLES } from "./lib/roles";

// Check specific role
if (hasRole(user, ROLES.ADMIN)) {
  // Admin-only logic
}

// Check multiple roles
if (hasRole(user, [ROLES.ADMIN, ROLES.MANAGER])) {
  // Admin or manager logic
}

// Permission-based (preferred over role checks)
await assertPermission(ctx, "manage_users");
```

## Import Order

Imports should be grouped in this order, with a blank line between groups:

1. **React** - `react`, `react-dom`
2. **Next.js** - `next/*`
3. **External packages** - `convex/react`, `lucide-react`, etc.
4. **Internal - API** - `@/convex/_generated/*`
5. **Internal - Components** - `@/components/*`
6. **Internal - Hooks** - `@/hooks/*`
7. **Internal - Utilities** - `@/lib/*`, `@/utils/*`
8. **Internal - Types** - `@/types/*`
9. **Relative imports** - `./`, `../`
10. **CSS/Styles** - `*.css`

## Error Handling

```typescript
// In mutations - throw descriptive errors
throw new Error("Document not found");
throw new Error("Permission denied: edit_content required");

// In components - use error boundaries
// See: /app/src/components/ErrorBoundary.tsx

// In async operations - always handle rejection
try {
  await updateDocument({ id, title });
} catch (error) {
  console.error("Failed to update document:", error);
  // Show user feedback
}
```

## CSS/Styling

- Use Tailwind utility classes
- Use `cn()` utility for conditional classes
- Prefer design tokens from `globals.css`
- Avoid inline styles

```tsx
// Good
<div className={cn(
  "rounded-lg bg-paper text-ink",
  isActive && "ring-2 ring-bronze",
  className
)}>

// Avoid
<div style={{ backgroundColor: '#fff', borderRadius: '8px' }}>
```
