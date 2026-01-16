---
phase: 03-user-profiles
plan: 01
completed: true
---

# Plan 03-01 Summary: User Schema and Profile Storage

## What Was Built

### userProfiles Table
Added to `convex/schema.ts`:
- `userId` - links to auth users table
- `displayName` - optional display name
- `role` - "admin" | "manager" | "staff"
- `department` - optional department
- `avatarUrl` - optional avatar URL
- `createdAt` / `updatedAt` - timestamps
- Indexes: `by_userId`, `by_role`

### User Functions (convex/users.ts)
- `getCurrentUser` - Get authenticated user with profile
- `getProfile` - Get profile by userId
- `updateProfile` - Update profile fields
- `ensureProfile` - Create profile if doesn't exist
- `makeFirstUserAdmin` - First user becomes admin (run once)
- `setUserRole` - Admin-only role assignment
- `listUsers` - Admin-only user listing
- `createProfileForUser` - Internal mutation for auth callback

### Auto-Profile Creation (convex/auth.ts)
Updated auth to auto-create profile on signup via callback:
```typescript
callbacks: {
  async afterUserCreatedOrUpdated(ctx, { userId }) {
    await ctx.runMutation(internal.users.createProfileForUser, { userId });
  },
}
```

## Technical Notes

- Used `internalMutation` for profile creation to get proper schema types in auth callback
- Default role is "staff" for new users
- Profile creation is idempotent (checks if exists first)

## Verification
- [x] userProfiles table in schema
- [x] users.ts with profile functions
- [x] Auto-profile creation on signup
- [x] Convex dev syncs without errors

## Next
Plan 03-02: Role definitions and permissions.ts
