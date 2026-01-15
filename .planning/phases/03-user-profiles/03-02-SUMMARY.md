---
phase: 03-user-profiles
plan: 02
completed: true
---

# Plan 03-02 Summary: Role Hierarchy and Permissions

## What Was Built

### Role Definitions (convex/lib/roles.ts)
- `ROLES` constant: admin, manager, staff
- `ROLE_HIERARCHY`: staff → manager → admin
- `hasRoleLevel()`: Check if user meets minimum role
- `ACTIONS`: view_content, edit_content, delete_content, manage_users, view_analytics
- `ROLE_PERMISSIONS`: Maps roles to allowed actions
- `canPerform()`: Check if role can do action

### Permission Matrix
| Action | Staff | Manager | Admin |
|--------|-------|---------|-------|
| view_content | ✓ | ✓ | ✓ |
| edit_content | | ✓ | ✓ |
| delete_content | | | ✓ |
| manage_users | | | ✓ |
| view_analytics | | ✓ | ✓ |

### Server-Side Helpers (convex/permissions.ts)
- `getCurrentUserRole()`: Get role from profile
- `canUserPerform()`: Check action permission
- `assertPermission()`: Throw if not allowed
- `hasRequiredRole()`: Check role hierarchy

## Usage Example
```typescript
import { assertPermission } from "./permissions";

export const deleteDocument = mutation({
  handler: async (ctx, { id }) => {
    await assertPermission(ctx, "delete_content");
    // ... delete logic
  },
});
```

## Verification
- [x] lib/roles.ts with constants and helpers
- [x] permissions.ts with server-side checks
- [x] Admin setup mutation (already in users.ts)
- [x] Convex dev syncs

## Next
Plan 03-03: UI permission guards and hooks
