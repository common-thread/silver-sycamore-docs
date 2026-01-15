# Phase 02 Research: Convex Auth for Next.js

## Overview

Convex Auth is Convex's native authentication library. It provides password auth, OAuth, magic links, and OTPs. For this internal Staff Hub, password authentication is the best fit.

## Key Resources

- [Convex Auth Docs](https://docs.convex.dev/auth/convex-auth)
- [Next.js Server-Side Auth](https://labs.convex.dev/auth/authz/nextjs)
- [Password Provider Setup](https://labs.convex.dev/auth/config/passwords)

## Current State

The project has an existing Convex setup in `app/convex/` with:
- Documents, categories, subcategories
- Initiatives
- Form schemas and submissions
- Packages, procedures, files

**No authentication is currently implemented.**

Current provider: `ConvexProvider` from `convex/react` in `src/components/ConvexClientProvider.tsx`

## Installation

```bash
npm install @convex-dev/auth @auth/core@0.37.0
npx @convex-dev/auth  # Automated setup
```

## Configuration Files Needed

### 1. convex/auth.config.ts
```typescript
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
```

### 2. convex/auth.ts
```typescript
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});
```

### 3. convex/schema.ts (update)
```typescript
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // existing tables...
});
```

## Next.js App Router Integration

### Provider Setup
Replace `ConvexProvider` with `ConvexAuthNextjsServerProvider`:

```typescript
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

// In layout.tsx
<ConvexAuthNextjsServerProvider>
  {children}
</ConvexAuthNextjsServerProvider>
```

### Client Provider
```typescript
"use client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";

export function ConvexClientProvider({ children }) {
  return (
    <ConvexAuthProvider client={convex}>
      {children}
    </ConvexAuthProvider>
  );
}
```

### Middleware (middleware.ts)
```typescript
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/signin"]);
const isProtectedRoute = createRouteMatcher(["/", "/services(.*)", "/clients(.*)", "/staff(.*)", "/operations(.*)", "/deliverables(.*)", "/catalog(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/");
  }
  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/signin");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

## React Hooks

```typescript
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

// Check auth state
const { isLoading, isAuthenticated } = useConvexAuth();

// Sign in/out actions
const { signIn, signOut } = useAuthActions();

// Sign in with password
await signIn("password", { email, password, flow: "signIn" });

// Sign up
await signIn("password", { email, password, flow: "signUp" });

// Sign out
await signOut();
```

## Password Auth Flows

1. **Sign Up**: `flow: "signUp"` - creates new user
2. **Sign In**: `flow: "signIn"` - authenticates existing user
3. **Reset**: `flow: "reset"` then `flow: "reset-verification"` - password recovery
4. **Email Verification**: `flow: "email-verification"` - optional

## Environment Variables

Required in `.env.local`:
```
CONVEX_DEPLOYMENT=...
NEXT_PUBLIC_CONVEX_URL=...
AUTH_SECRET=... # Generate with: openssl rand -base64 32
```

## Auth Tables Added by authTables

- `users` - user records
- `authAccounts` - auth provider accounts
- `authSessions` - active sessions
- `authRefreshTokens` - refresh tokens
- `authVerificationCodes` - verification codes
- `authVerifiers` - verification keys
- `authRateLimits` - rate limiting

## Recommended Approach

For Silver Sycamore Staff Hub:
1. **Password auth only** - simple for internal staff
2. **No email verification initially** - can add later if needed
3. **All routes protected** except /signin
4. **30-day session cookie** - convenient for daily use

## Plan Breakdown

1. **02-01**: Backend setup - schema, auth.ts, auth.config.ts
2. **02-02**: Frontend setup - provider, signin page, signout
3. **02-03**: Route protection - middleware, protected routes, session UI
