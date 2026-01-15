# Technology Stack

**Analysis Date:** 2026-01-14

## Languages

**Primary:**
- TypeScript 5.x - All application code (`app/src/`, `app/convex/`)

**Secondary:**
- JavaScript - Build scripts, config files
- Markdown - Documentation and Jekyll site content (root `_posts/`, `_layouts/`)

## Runtime

**Environment:**
- Node.js (implied by Next.js)
- Bun as primary runtime and package manager

**Package Manager:**
- Bun
- Lockfile: `app/bun.lock` present

## Frameworks

**Core:**
- Next.js 16.1.1 - App Router for frontend (`app/src/app/`)
- React 19.2.3 - UI framework (bleeding edge)
- Convex 1.31.4 - Backend-as-a-Service (database, API, real-time sync)

**Testing:**
- Playwright 1.57.0 - E2E testing (`app/e2e/`)

**Build/Dev:**
- TypeScript 5.x - Type checking and compilation
- Tailwind CSS v4 - Styling with Heritage Elegance theme
- ESLint 9 - Linting

**Legacy System:**
- Jekyll 4.3.4 - Static site generator (GitHub Pages at root)

## Key Dependencies

**Critical:**
- convex ^1.31.4 - Backend database, queries, mutations, real-time subscriptions
- react-markdown ^10.1.0 - Markdown rendering in document viewer

**Infrastructure:**
- @tailwindcss/postcss - CSS processing
- clsx - Conditional class names

## Configuration

**Environment:**
- `.env.local` in `app/` directory (gitignored)
- Required vars: `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOYMENT`
- Convex URL: `https://calculating-vole-961.convex.cloud`

**Build:**
- `app/tsconfig.json` - TypeScript config with strict mode
- `app/next.config.ts` - Next.js configuration
- `app/tailwind.config.ts` - Tailwind theme (Heritage Elegance palette)
- `app/playwright.config.ts` - E2E test configuration

## Platform Requirements

**Development:**
- Any platform with Node.js and Bun
- Convex CLI for backend development (`npx convex dev`)

**Production:**
- Next.js app: Vercel deployment (implied)
- Convex backend: Convex Cloud (`calculating-vole-961`)
- Jekyll site: GitHub Pages (root directory)

---

*Stack analysis: 2026-01-14*
*Update after major dependency changes*
