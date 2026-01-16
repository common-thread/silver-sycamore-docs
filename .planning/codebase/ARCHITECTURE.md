# Architecture

**Analysis Date:** 2026-01-16

## Pattern Overview

**Overall:** Full-Stack BaaS (Backend-as-a-Service) Application

**Key Characteristics:**
- Next.js App Router for frontend with React Server Components
- Convex serverless functions for backend (no traditional REST API)
- RPC-style API calls via Convex React client
- Real-time data subscriptions via `useQuery`
- Clerk + Convex Auth for authentication

## Architecture Diagram

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        Browser["Browser"]
        NextApp["Next.js App Router<br/>app/src/app/"]
        Components["React Components<br/>app/src/components/"]
        Hooks["Custom Hooks<br/>app/src/hooks/"]
    end

    subgraph Provider["Provider Layer"]
        ConvexProvider["ConvexClientProvider<br/>+ ClerkProvider"]
        ConvexReact["Convex React Client<br/>useQuery/useMutation"]
    end

    subgraph Backend["Backend Layer (Convex)"]
        Queries["Query Functions<br/>(read-only)"]
        Mutations["Mutation Functions<br/>(write operations)"]
        Actions["Action Functions<br/>(async tasks)"]
    end

    subgraph Data["Data Layer"]
        Schema["Schema Definition<br/>convex/schema.ts"]
        Database["Convex Database<br/>(27+ tables)"]
        Storage["File Storage"]
    end

    subgraph Auth["Auth Layer"]
        Clerk["Clerk Auth"]
        ConvexAuth["Convex Auth"]
        Permissions["Permission System<br/>convex/lib/roles.ts"]
    end

    Browser --> NextApp
    NextApp --> Components
    Components --> Hooks
    Components --> ConvexProvider
    ConvexProvider --> ConvexReact
    ConvexReact --> Queries
    ConvexReact --> Mutations
    Queries --> Schema
    Mutations --> Schema
    Schema --> Database
    Mutations --> Storage
    Browser --> Clerk
    Clerk --> ConvexAuth
    ConvexAuth --> Permissions
    Queries --> Permissions
    Mutations --> Permissions
```

## Layers

**Presentation Layer:**
- Purpose: Render UI and handle user interactions
- Contains: React components, page routes, layouts
- Location: `app/src/app/` (pages), `app/src/components/` (48+ components)
- Depends on: Provider layer for data access
- Used by: Browser (end users)

**Provider Layer:**
- Purpose: Connect frontend to backend, manage auth state
- Contains: `ConvexClientProvider`, Clerk provider wrappers
- Location: `app/src/components/ConvexClientProvider.tsx`
- Depends on: Convex SDK, Clerk SDK
- Used by: All components needing data/auth

**Backend Layer (Convex Functions):**
- Purpose: Business logic, data validation, access control
- Contains: Query, Mutation, and Action functions (23 modules)
- Location: `app/convex/*.ts`
- Depends on: Data layer, Auth layer
- Used by: Provider layer via RPC calls

**Data Layer:**
- Purpose: Persistent storage, schema definition
- Contains: Table definitions, indexes, search indexes
- Location: `app/convex/schema.ts`
- Depends on: Convex platform
- Used by: Backend layer

**Auth Layer:**
- Purpose: Identity management, permissions
- Contains: Clerk integration, role-based access control
- Location: `app/convex/auth.ts`, `app/convex/lib/roles.ts`, `app/convex/permissions.ts`
- Depends on: Clerk service
- Used by: All layers

## Data Flow

**Client Query Flow:**

```mermaid
sequenceDiagram
    participant User as User (Browser)
    participant Component as React Component
    participant ConvexReact as Convex React Client
    participant ConvexFn as Convex Function
    participant DB as Convex Database
    participant Auth as Clerk Auth

    User->>Component: Page Load / Action
    Component->>ConvexReact: useQuery(api.module.fn)
    ConvexReact->>Auth: Get Auth Token
    Auth-->>ConvexReact: JWT Token
    ConvexReact->>ConvexFn: Call Query + Token
    ConvexFn->>ConvexFn: Verify Auth (ctx.auth)
    ConvexFn->>ConvexFn: Check Permissions
    ConvexFn->>DB: ctx.db.query(table)
    DB-->>ConvexFn: Results
    ConvexFn-->>ConvexReact: Return Data
    ConvexReact-->>Component: Update State
    Component->>User: Render UI
```

**State Management:**
- Server state: Managed by Convex (real-time subscriptions)
- Client state: React `useState` for local UI state
- No external state library (Redux, Zustand, etc.)

## Key Abstractions

**Convex Module:**
- Purpose: Encapsulate domain logic (documents, forms, messages, etc.)
- Examples: `app/convex/documents.ts`, `app/convex/forms.ts`, `app/convex/channels.ts`
- Pattern: Exports queries, mutations, actions per domain
- API: `api.module.functionName` via `_generated/api`

**Permission System:**
- Purpose: Role-based access control
- Server: `app/convex/lib/roles.ts` defines roles (staff, manager, admin)
- Server: `app/convex/permissions.ts` provides permission checks
- Client: `app/src/hooks/usePermissions.ts` for UI access control
- Pattern: `canUserPerform(ctx, action)` / `usePermissions().can(action)`

**Schema Tables:**
- Purpose: Define data structure and indexes
- Location: `app/convex/schema.ts`
- Pattern: `defineTable()` with fields, indexes, search indexes
- Tables: documents, userProfiles, formSchemas, messages, channels, etc.

## Entry Points

**Frontend Entry:**
- Location: `app/src/app/layout.tsx`
- Triggers: Browser navigation
- Responsibilities: Set up providers, render layout shell

**Page Routes:**
- Location: `app/src/app/[route]/page.tsx`
- Triggers: URL navigation
- Responsibilities: Fetch data, render page content

**Backend Entry:**
- Location: `app/convex/*.ts` module exports
- Triggers: `useQuery`/`useMutation` calls from client
- Responsibilities: Validate, authorize, execute business logic

## Error Handling

**Strategy:** Try/catch with user-friendly error messages

**Patterns:**
- Backend: Throw errors in Convex functions, caught by client
- Frontend: Try/catch in mutation handlers, display toast/alert
- Validation: Convex schema validation via `v.string()`, `v.number()`, etc.

## Cross-Cutting Concerns

**Logging:**
- Console.log for debugging
- No structured logging framework

**Validation:**
- Convex values (`v.string()`, `v.id()`, etc.) at function boundaries
- No additional schema validation (Zod, Yup)

**Authentication:**
- Clerk middleware protects routes
- Convex functions check `ctx.auth.getUserIdentity()`
- Permission checks via `permissions.ts` helpers

---

*Architecture analysis: 2026-01-16*
*Update when major patterns change*
