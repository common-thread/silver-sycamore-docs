# Codebase Concerns

**Analysis Date:** 2026-01-14

## Tech Debt

**Dual System Architecture:**
- Issue: Two separate systems (Jekyll at root, Next.js in `app/`) serving similar purposes
- Why: Migration from Jekyll to Next.js in progress
- Impact: Maintenance overhead, potential content sync issues
- Fix approach: Complete migration to Next.js + Convex, deprecate Jekyll site

**No Authentication:**
- Issue: No user authentication implemented yet
- Files: No auth files present in `app/convex/` or `app/src/`
- Why: MVP phase, focused on core functionality first
- Impact: All data publicly accessible, no user-specific features
- Fix approach: Implement Convex Auth for role-based access control

## Known Bugs

**No critical bugs detected**
- Codebase is relatively new and clean
- No TODO/FIXME comments found in source files

## Security Considerations

**Public Data Access:**
- Risk: All Convex queries/mutations are accessible without authentication
- Files: `app/convex/*.ts` (all functions)
- Current mitigation: None - acceptable for internal documentation
- Recommendations: Add Convex Auth before exposing to external users

**Environment Variables:**
- Risk: Improper env var handling
- Current mitigation: Proper use of `.env.local` (gitignored), `NEXT_PUBLIC_` prefix
- Recommendations: None needed - following best practices

## Performance Bottlenecks

**No significant performance issues detected**
- Convex provides real-time sync efficiently
- 74 documents is a small dataset
- Indexes defined on frequently queried fields

## Fragile Areas

**Dynamic Route Parameters:**
- Files: `app/src/app/[category]/[slug]/page.tsx`
- Why fragile: Relies on slug matching between URL and database
- Common failures: 404 if slug doesn't match, null handling needed
- Safe modification: Always check query results before rendering
- Test coverage: E2E tests cover basic navigation

**Convex Schema:**
- Files: `app/convex/schema.ts`
- Why fragile: Schema changes require migration consideration
- Common failures: Breaking changes to field types
- Safe modification: Use Convex schema migrations, add optional fields
- Test coverage: No unit tests for schema validation

## Scaling Limits

**Convex Free Tier:**
- Current capacity: Free tier limits (check Convex pricing)
- Limit: Unknown specific limits for calculating-vole-961 deployment
- Symptoms at limit: Function timeouts, database query limits
- Scaling path: Upgrade to Convex Pro tier if needed

**Document Count:**
- Current: 74 documents
- Limit: Convex handles thousands of documents efficiently
- No immediate scaling concerns

## Dependencies at Risk

**Bleeding Edge Versions:**
- React 19.2.3 - Very recent, potential undiscovered issues
- Next.js 16.1.1 - Latest version, may have breaking changes
- Risk: API changes, compatibility issues, community support lag
- Impact: May need to handle deprecation warnings
- Migration plan: Monitor changelogs, test before upgrading

**Tailwind CSS v4:**
- Risk: Major version upgrade from v3, syntax changes
- Impact: Some v3 utilities may not work
- Migration plan: Already on v4, follow official migration guide

## Missing Critical Features

**Form Handling:**
- Problem: formSchemas and formSubmissions tables exist but no UI implementation
- Files: `app/convex/schema.ts` (schema only)
- Current workaround: Forms tracked in documentation but not digital
- Blocks: 15 forms need digitizing per exploration summary
- Implementation complexity: Medium (Convex mutations + React forms)

**Search Functionality:**
- Problem: Search query exists (`app/convex/documents.ts`) but no UI
- Files: `search` function defined but not used in components
- Current workaround: Manual navigation through categories
- Blocks: Quick document lookup
- Implementation complexity: Low (add search input, call existing query)

**File Upload:**
- Problem: `files` table exists but no upload UI
- Files: `app/convex/schema.ts` (schema only)
- Current workaround: None - attachments not functional
- Blocks: Document attachments, procedure media
- Implementation complexity: Medium (Convex storage API + upload UI)

## Test Coverage Gaps

**No Unit Tests:**
- What's not tested: Convex functions, utility logic
- Risk: Backend bugs undetected until E2E tests or production
- Priority: Medium
- Difficulty to test: Low - add Vitest for Convex function testing

**No Component Tests:**
- What's not tested: React components in isolation
- Risk: UI bugs, prop handling issues
- Priority: Low (E2E tests cover critical paths)
- Difficulty to test: Low - add React Testing Library

**Limited E2E Coverage:**
- What's not tested: Edge cases, error states, empty states
- Risk: User experience issues on edge cases
- Priority: Medium
- Difficulty to test: Low - expand existing Playwright tests

---

*Concerns audit: 2026-01-14*
*Update as issues are fixed or new ones discovered*
