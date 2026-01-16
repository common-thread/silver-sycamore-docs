# Technology Stack

**Analysis Date:** 2026-01-16

## Languages

**Primary:**
- TypeScript 5.x - All application code (`app/src/`, `app/convex/`)

**Secondary:**
- JavaScript - Build scripts, config files
- CSS - Design tokens and global styles (`app/src/app/globals.css`)

## Runtime

**Environment:**
- Node.js (via Next.js runtime)
- Bun (alternative runtime used for scripts)

**Package Manager:**
- Bun - `app/bun.lock`, `app/package.json`
- Lockfile: `bun.lock` present
- Exception: Convex CLI uses `npx convex ...`

## Frameworks

**Core:**
- Next.js 15 (App Router) - `app/package.json`
- React 19 - `app/package.json`
- Convex - Backend-as-a-Service platform

**Testing:**
- Playwright 1.57+ - E2E testing (`app/playwright.config.ts`)

**Build/Dev:**
- TypeScript 5.x - Compilation
- ESLint 9.x - Linting (`app/eslint.config.mjs`)
- PostCSS - CSS processing (`app/postcss.config.mjs`)

## Key Dependencies

**Critical:**
- `convex` - Backend database and serverless functions
- `@clerk/nextjs` ^6.36.7 - Authentication (primary)
- `@convex-dev/auth` ^0.0.90 - Authentication (secondary, password provider)
- `react-markdown` ^10.1.0 - Content rendering

**Infrastructure:**
- `@clerk/backend` ^2.29.2 - Server-side auth
- `@clerk/testing` ^1.13.28 - Test authentication

**UI:**
- `tailwindcss` 4.x - Styling via `@tailwindcss/postcss`
- Google Fonts API - Playfair Display (display), DM Sans (body)

## Configuration

**Environment:**
- `.env.local` for environment variables (gitignored)
- Key vars: `CONVEX_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

**Build:**
- `tsconfig.json` - TypeScript config with `@/*` path alias to `./src/*`
- `next.config.ts` - Next.js configuration (minimal)
- `eslint.config.mjs` - ESLint with Next.js recommended rules
- `postcss.config.mjs` - PostCSS with Tailwind plugin

## Platform Requirements

**Development:**
- macOS/Linux/Windows (any platform with Node.js/Bun)
- Bun runtime installed globally
- Two terminals required: `bun run dev` + `npx convex dev`

**Production:**
- Vercel deployment target (`.vercel/project.json` present)
- Convex cloud backend (`calculating-vole-961.convex.cloud`)

---

*Stack analysis: 2026-01-16*
*Update after major dependency changes*
