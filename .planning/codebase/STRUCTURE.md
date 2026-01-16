# Codebase Structure

**Analysis Date:** 2026-01-16

## Directory Layout

### Visual Tree

```
silver-sycamore-docs/
├── app/                            # [Layer: Application]
│   ├── convex/                     # Backend serverless functions
│   │   ├── _generated/             # Auto-generated types & API
│   │   ├── lib/                    # Shared utilities
│   │   │   └── roles.ts            # RBAC definitions
│   │   ├── schema.ts               # Database schema (27+ tables)
│   │   ├── auth.ts                 # Clerk/Convex auth setup
│   │   ├── documents.ts            # Document CRUD
│   │   ├── forms.ts                # Form builder backend
│   │   ├── messages.ts             # Team chat
│   │   ├── channels.ts             # Chat channels
│   │   ├── suggestions.ts          # Document suggestions
│   │   ├── notifications.ts        # Notification system
│   │   ├── personalDocuments.ts    # User workspace
│   │   └── ... (15 more modules)
│   │
│   ├── src/                        # Frontend source
│   │   ├── app/                    # Next.js App Router pages
│   │   │   ├── layout.tsx          # Root layout
│   │   │   ├── page.tsx            # Home/dashboard
│   │   │   ├── globals.css         # Design tokens + styles
│   │   │   ├── [category]/[slug]/  # Dynamic document routes
│   │   │   ├── catalog/            # Document catalog
│   │   │   ├── forms/              # Form management
│   │   │   ├── messages/           # Team messaging
│   │   │   ├── workspace/          # Personal workspace
│   │   │   ├── suggestions/        # Document suggestions
│   │   │   ├── signin/             # Authentication
│   │   │   └── style-guide/        # Design system docs
│   │   │
│   │   ├── components/             # Reusable React components (48+)
│   │   │   ├── ui/                 # Base UI primitives
│   │   │   ├── Header.tsx          # Main navigation
│   │   │   ├── FormBuilder.tsx     # Form creation
│   │   │   ├── FormRenderer.tsx    # Form display
│   │   │   ├── DocumentViewer.tsx  # Document display
│   │   │   ├── MessageList.tsx     # Chat messages
│   │   │   ├── PermissionGuard.tsx # Role-based rendering
│   │   │   └── ... (40+ more)
│   │   │
│   │   ├── hooks/                  # Custom React hooks
│   │   │   └── usePermissions.ts   # Client-side permissions
│   │   │
│   │   └── proxy.ts                # Clerk middleware
│   │
│   ├── e2e/                        # Playwright E2E tests
│   │   ├── .auth/                  # Auth state storage
│   │   ├── utils/                  # Test utilities
│   │   ├── global-setup.ts         # Test user seeding
│   │   └── *.spec.ts               # Test files
│   │
│   ├── public/                     # Static assets
│   ├── scripts/                    # Utility scripts
│   │
│   └── [Config files]
│       ├── package.json            # Dependencies
│       ├── tsconfig.json           # TypeScript config
│       ├── next.config.ts          # Next.js config
│       ├── playwright.config.ts    # E2E test config
│       └── eslint.config.mjs       # Linting rules
│
├── .planning/                      # [Layer: Planning]
│   ├── codebase/                   # Codebase documentation
│   ├── phases/                     # Phase plans
│   ├── ROADMAP.md                  # Project roadmap
│   └── STATE.md                    # Current status
│
├── docs/                           # [Layer: Documentation]
├── CLAUDE.md                       # Project conventions
└── README.md                       # Project overview
```

## Directory Purposes

**app/convex/**
- Purpose: Backend serverless functions and database schema
- Contains: Query, Mutation, Action functions; schema definition
- Key files: `schema.ts` (database), `auth.ts` (authentication), domain modules
- Subdirectories: `_generated/` (auto-generated), `lib/` (utilities)

**app/src/app/**
- Purpose: Next.js App Router pages and routes
- Contains: Page components, layouts, route handlers
- Key files: `layout.tsx` (root), `page.tsx` (home), `globals.css` (styles)
- Subdirectories: Route segments matching URL paths

**app/src/components/**
- Purpose: Reusable React components
- Contains: UI components, feature components, layout components
- Key files: `Header.tsx`, `FormBuilder.tsx`, `ConvexClientProvider.tsx`
- Subdirectories: `ui/` for base primitives

**app/src/hooks/**
- Purpose: Custom React hooks
- Contains: `usePermissions.ts` for client-side permission checks
- Key files: `usePermissions.ts`

**app/e2e/**
- Purpose: Playwright end-to-end tests
- Contains: Test specs, test utilities, auth state
- Key files: `global-setup.ts`, `*.spec.ts` test files
- Subdirectories: `.auth/` (browser state), `utils/` (helpers)

**.planning/**
- Purpose: GSD project planning artifacts
- Contains: Roadmap, state tracking, phase plans, codebase docs
- Key files: `ROADMAP.md`, `STATE.md`
- Subdirectories: `phases/`, `codebase/`

## Key File Locations

**Entry Points:**
- `app/src/app/layout.tsx` - Root layout, provider setup
- `app/src/app/page.tsx` - Home page / dashboard

**Configuration:**
- `app/tsconfig.json` - TypeScript config (`@/*` → `./src/*`)
- `app/next.config.ts` - Next.js configuration
- `app/eslint.config.mjs` - ESLint with Next.js rules
- `app/.env.local` - Environment variables (gitignored)
- `app/convex.json` - Convex project config

**Core Logic:**
- `app/convex/schema.ts` - Database table definitions
- `app/convex/documents.ts` - Document CRUD operations
- `app/convex/forms.ts` - Form builder backend
- `app/convex/lib/roles.ts` - Role-based access control

**Testing:**
- `app/playwright.config.ts` - Playwright configuration
- `app/e2e/global-setup.ts` - Test user seeding
- `app/e2e/*.spec.ts` - E2E test files

**Documentation:**
- `CLAUDE.md` - Project conventions for Claude
- `README.md` - Project overview
- `.planning/STATE.md` - Current project state

## Naming Conventions

**Files:**
- `PascalCase.tsx` - React components (`Header.tsx`, `FormBuilder.tsx`)
- `camelCase.ts` - Functions/utilities (`usePermissions.ts`, `roles.ts`)
- `kebab-case/` - Route directories (`[category]/[slug]/`)
- `*.spec.ts` - Test files (`basic.spec.ts`)

**Directories:**
- `camelCase` - Feature modules in convex (`personalFolders.ts`)
- `kebab-case` - Route segments in app router
- `lowercase` - Standard directories (`components/`, `hooks/`)

**Special Patterns:**
- `[param]/` - Dynamic route segments (`[category]/`, `[formId]/`)
- `page.tsx` - Page component (Next.js convention)
- `layout.tsx` - Layout component (Next.js convention)
- `_generated/` - Auto-generated code (Convex)

## Where to Add New Code

**New Feature:**
- Primary code: `app/convex/[feature].ts` (backend) + `app/src/app/[route]/` (pages)
- Components: `app/src/components/[Component].tsx`
- Tests: `app/e2e/[feature].spec.ts`

**New Component:**
- Implementation: `app/src/components/[ComponentName].tsx`
- UI primitive: `app/src/components/ui/[ComponentName].tsx`
- Types: Inline in component file or in component file

**New Route/Page:**
- Definition: `app/src/app/[route]/page.tsx`
- Layout: `app/src/app/[route]/layout.tsx` (if needed)
- Tests: `app/e2e/[route].spec.ts`

**New Convex Module:**
- Implementation: `app/convex/[module].ts`
- Schema: Add table to `app/convex/schema.ts`
- Types: Auto-generated in `app/convex/_generated/`

**Utilities:**
- Shared backend: `app/convex/lib/[utility].ts`
- Shared frontend: `app/src/hooks/[useHook].ts`
- Client hooks: `app/src/hooks/[useFeature].ts`

## Special Directories

**app/convex/_generated/**
- Purpose: Auto-generated Convex types and API definitions
- Source: Generated by `npx convex dev`
- Committed: Yes (needed for TypeScript)
- Note: Do not edit manually

**app/.next/**
- Purpose: Next.js build output
- Source: Generated by `bun run build` / `bun run dev`
- Committed: No (in .gitignore)

**app/e2e/.auth/**
- Purpose: Authenticated browser state for tests
- Source: Generated by `global-setup.ts`
- Committed: No (in .gitignore)

---

*Structure analysis: 2026-01-16*
*Update when directory structure changes*
