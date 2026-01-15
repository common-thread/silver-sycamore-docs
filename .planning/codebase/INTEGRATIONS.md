# External Integrations

**Analysis Date:** 2026-01-14

## APIs & External Services

**Payment Processing:**
- Not detected (planned: Square integration for off-premise catering)

**Email/SMS:**
- Not detected

**External APIs:**
- Recipe App integration (planned) - Convex-based recipe database
  - Integration method: Convex cross-deployment queries (planned)
  - Purpose: Shared ingredients between Recipe App and venue documents

## Data Storage

**Databases:**
- Convex Cloud - Primary data store for Next.js application
  - Connection: via `NEXT_PUBLIC_CONVEX_URL` env var
  - Client: Convex React client (`useQuery`, `useMutation` hooks)
  - Deployment: `dev:calculating-vole-961`
  - Schema: `app/convex/schema.ts` - 11 tables

**Database Schema Tables:**
- `documents` - Venue documentation (74 documents)
- `categories` - Document categories (6 categories)
- `subcategories` - Nested categorization
- `initiatives` - Project tracking
- `files` - File attachments
- `venueSpaces` - Venue room definitions
- `roomLayouts` - Space configurations
- `packages` - Event packages
- `formSchemas` - Dynamic form definitions (17 forms)
- `formSubmissions` - Form submission data
- `procedures` - Operational procedures

**File Storage:**
- Convex file storage - Document attachments (`files` table)
  - SDK/Client: Convex storage API
  - Auth: Handled by Convex authentication

**Caching:**
- None detected (Convex handles real-time sync)

## Authentication & Identity

**Auth Provider:**
- Not implemented yet
- Convex Auth planned for future implementation

**OAuth Integrations:**
- None detected

## Monitoring & Observability

**Error Tracking:**
- None detected

**Analytics:**
- None detected

**Logs:**
- Console logging only (development)

## CI/CD & Deployment

**Hosting:**
- Next.js App: Vercel (implied by Next.js setup)
  - Deployment: Automatic on main branch push (standard Vercel setup)
  - Environment vars: Configured in Vercel dashboard

- Jekyll Site: GitHub Pages
  - Deployment: Automatic on main branch push
  - URL: Silver Sycamore documentation site

**CI Pipeline:**
- Not detected (no `.github/workflows/` files found)

## Environment Configuration

**Development:**
- Required env vars:
  - `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
  - `CONVEX_DEPLOYMENT` - Convex deployment identifier
- Secrets location: `app/.env.local` (gitignored)
- Local development: `npx convex dev` for backend, `bun dev` for frontend

**Staging:**
- Not detected (single Convex deployment)

**Production:**
- Secrets management: Vercel environment variables (Next.js), GitHub secrets (Jekyll)
- Convex deployment: Same as development (calculating-vole-961)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

---

*Integration audit: 2026-01-14*
*Update when adding/removing external services*
