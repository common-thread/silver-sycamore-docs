# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a dual-system architecture:
- **Jekyll site** (root level) - Static documentation for GitHub Pages
- **Next.js app** (`/app`) - Full-stack application deployed to Vercel with Convex backend

## Prerequisites

- Node.js 18+
- bun (package manager): `curl -fsSL https://bun.sh/install | bash`

Quick setup:
```bash
cd app
bun install
```

## Package Manager

This project uses **bun** as the package manager. Always use bun commands:

- `bun install` (not npm install)
- `bun run <script>` (not npm run)
- `bunx <package>` (not npx)

**Exception:** Convex CLI commands use `npx convex ...` as it's a standalone tool.

## Directory Structure

- `/app` - Main Next.js application with Convex backend
- `/.planning` - GSD planning artifacts (ROADMAP.md, STATE.md, phases/)

## Running the App

**Port:** This app runs on **port 3000** (default). Port 3001 is used by a different project (wedding app).

### Quick Start (Both Frontend + Backend)

```bash
cd app
npx convex dev & bun run dev
```

This runs Convex backend and Next.js frontend together. Press Ctrl+C to stop both.

### Individual Commands

```bash
cd app
bun run dev          # Start Next.js dev server on port 3000
npx convex dev       # Start Convex backend (separate terminal)
```

### Troubleshooting

If port 3000 is occupied:
```bash
lsof -ti:3000 | xargs kill -9
```

If Convex needs restart:
```bash
pkill -f "convex dev"
npx convex dev
```

## Build & Lint

```bash
cd app
bun run build        # Build for production (runs TypeScript checks)
bun run lint         # Run ESLint
bun run lint --fix   # Auto-fix lint issues where possible
```

## Testing

```bash
cd app
bun run test                      # Run all Playwright E2E tests
bun run test:ui                   # Run tests with UI
bun run test e2e/basic.spec.ts   # Run a single test file
```

## Tech Stack

- Next.js 15 (App Router)
- Convex (backend + database)
- Convex Auth (Password provider)
- Tailwind CSS
- TypeScript

## Architecture Overview

This is a full-stack BaaS (Backend-as-a-Service) application:

**Frontend (`app/src/`):**
- `app/` - Next.js App Router pages and routes
- `components/` - 60+ React components
- `hooks/` - Custom hooks (e.g., `usePermissions.ts`)

**Backend (`app/convex/`):**
- 26 serverless function modules (documents, forms, messages, channels, etc.)
- `schema.ts` - Database schema (27+ tables)
- `lib/roles.ts` - Role-based access control (staff, manager, admin)
- `lib/auth.ts` - Centralized auth utilities
- `_generated/` - Auto-generated types & API (do not edit)

**Data Flow:**
- Client uses `useQuery`/`useMutation` hooks from Convex React client
- Real-time data subscriptions via Convex
- Authentication via Clerk + Convex Auth

For detailed architecture documentation, see `.planning/codebase/`:
- `ARCHITECTURE.md` - Data flow diagrams and layer descriptions
- `STRUCTURE.md` - Full directory layout and naming conventions
- `CONVENTIONS.md` - Code patterns and practices

## Jekyll Documentation Site

The root-level Jekyll site is for static documentation deployed to GitHub Pages.

**When to use:** Adding static docs, updating the public-facing documentation site.

**Local preview:**
```bash
bundle install
bundle exec jekyll serve
```

**Deployment:** Automatic via GitHub Actions on push to main.

## Design System

- Fonts: Playfair Display (display), DM Sans (body)
- Colors: Ink/paper/bronze palette (see globals.css)
- Aesthetic: Typeform-inspired, archival/editorial
- Layout patterns documented in `.planning/codebase/`

## Debugging

**Convex connection errors:**
- Check if `npx convex dev` is running
- Verify `.env.local` has correct `CONVEX_URL`

**TypeScript errors:**
- Run `bun run build` to see full error output
- Check `app/convex/_generated/` is up to date

**Auth issues:**
- Verify Clerk keys in `.env.local`
- Check browser console for auth errors

**Log locations:**
- Browser console for frontend errors
- Terminal running `npx convex dev` for backend errors

## Folders to Ignore

Do not modify these folders:
- `.agent/` - External agent system
- `.planning/` - Planning artifacts (read-only reference)
- `.gemini/` - Gemini configuration
- `app/convex/_generated/` - Auto-generated Convex types

## Verification Requirements

**All UI/visual verification must be self-performed by Claude:**

1. **Run the build yourself** - Don't ask the user to run builds or tests
2. **Use browser automation** - Test UI changes with the browser agent (claude-in-chrome)
3. **Take screenshots** - Save verification screenshots to `.planning/phases/{phase}/screenshots/`
4. **Provide review link** - Include path to screenshots folder in verification output
5. **User reviews screenshots** - User approval is based on reviewing the screenshots you provide

**Screenshot naming convention:**
- `{plan}-{task}-{description}.png` (e.g., `01-02-field-card-inline-edit.png`)

**Verification checkpoint format:**
```
## Verification Complete

Screenshots saved to: `.planning/phases/XX-name/screenshots/`

| Screenshot | Description |
|------------|-------------|
| 01-01-initial-state.png | Form builder before changes |
| 01-02-drag-reorder.png | Field reordering via drag |
```

This applies to all phases with UI changes or visual verification tasks.

## Full-App Screenshots (Playwright)

For capturing screenshots of all app pages at once:

**Location:** `.planning/screenshots/`

**Script:** `app/screenshot-pages.ts`

**Usage:**
```bash
cd app
bun run screenshot-pages.ts
```

**Output:**
- Screenshots saved to `.planning/screenshots/` (not in app folder)
- JSON report at `.planning/screenshots/report.json`
- Filenames: `{route-name}.png` (e.g., `home.png`, `events.png`, `deliverables.png`)

**When to run:**
- After major UI/styling changes
- Before milestone completion
- When auditing brand adherence
