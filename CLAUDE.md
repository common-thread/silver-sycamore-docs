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
