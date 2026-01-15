# Project Conventions for Claude

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

```bash
cd app
bun run dev          # Start Next.js dev server
npx convex dev       # Start Convex backend (separate terminal)
```

## Testing

```bash
cd app
bun run test         # Run Playwright E2E tests
bun run test:ui      # Run tests with UI
```

## Tech Stack

- Next.js 15 (App Router)
- Convex (backend + database)
- Convex Auth (Password provider)
- Tailwind CSS
- TypeScript

## Design System

- Fonts: Playfair Display (display), DM Sans (body)
- Colors: Ink/paper/bronze palette (see globals.css)
- Aesthetic: Typeform-inspired, archival/editorial
