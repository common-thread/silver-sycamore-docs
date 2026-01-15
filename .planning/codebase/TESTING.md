# Testing Patterns

**Analysis Date:** 2026-01-14

## Test Framework

**Runner:**
- Playwright 1.57.0 - E2E testing
- Config: `app/playwright.config.ts`

**Assertion Library:**
- Playwright built-in expect
- Matchers: toBeVisible, toHaveURL, toContainText, etc.

**Run Commands:**
```bash
cd app && bun run test:e2e          # Run all E2E tests
cd app && bun run test:e2e:ui       # Interactive UI mode
cd app && bunx playwright test      # Direct Playwright command
```

## Test File Organization

**Location:**
- `app/e2e/*.spec.ts` - All E2E tests in dedicated directory

**Naming:**
- {feature}.spec.ts for test files
- Examples: `homepage.spec.ts`, `documents.spec.ts`, `navigation.spec.ts`

**Structure:**
```
app/
├── e2e/
│   ├── homepage.spec.ts     # Homepage tests
│   ├── documents.spec.ts    # Document functionality
│   └── navigation.spec.ts   # Navigation flows
└── playwright.config.ts     # Playwright configuration
```

## Test Structure

**Suite Organization:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    await page.goto('/');

    // Act
    await page.click('button');

    // Assert
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

**Patterns:**
- test.describe for grouping related tests
- Async/await for all page interactions
- Page Object Model not used (direct selectors)
- No shared setup files detected

## Mocking

**Framework:**
- No mocking observed in E2E tests
- Tests run against actual Convex backend

**Patterns:**
- E2E tests use real data from Convex
- No API mocking or stubbing detected

**What to Mock:**
- Not applicable (E2E tests use real services)

## Fixtures and Factories

**Test Data:**
- No fixture files detected
- Tests rely on seeded database data
- `app/convex/seed.ts` provides initial data

**Location:**
- No dedicated fixtures directory
- Seed data in Convex functions

## Coverage

**Requirements:**
- No coverage requirements detected
- E2E tests only (no unit test coverage)

**Configuration:**
- Playwright does not provide code coverage by default
- No coverage tooling configured

## Test Types

**Unit Tests:**
- Not detected (no unit test framework configured)
- Vitest/Jest not in dependencies

**Integration Tests:**
- Not detected

**E2E Tests:**
- Playwright for full browser testing
- Tests complete user flows
- Location: `app/e2e/`

## Common Patterns

**Page Navigation:**
```typescript
test('navigates to category page', async ({ page }) => {
  await page.goto('/');
  await page.click('a[href="/catalog"]');
  await expect(page).toHaveURL('/catalog');
});
```

**Element Assertions:**
```typescript
test('displays document content', async ({ page }) => {
  await page.goto('/catalog/bar-program');
  await expect(page.locator('h1')).toContainText('Bar Program');
  await expect(page.locator('.content')).toBeVisible();
});
```

**Waiting for Content:**
```typescript
test('loads dynamic content', async ({ page }) => {
  await page.goto('/');
  // Playwright auto-waits for elements
  await expect(page.getByRole('heading')).toBeVisible();
});
```

## Test Configuration

**playwright.config.ts:**
- Base URL: localhost:3000
- Browser: Chromium (default)
- Retries: Configured for CI stability
- Screenshots/Video: On failure

**Running Tests:**
```bash
# Start dev server first
cd app && bun dev

# In another terminal
cd app && bun run test:e2e
```

## Dual Testing Strategy

**Known Limitation:** Convex Auth session state does not persist properly in Playwright's browser context. Authenticated users appear logged in but queries return `null` for `ctx.auth.getUserIdentity()`. This affects tests that verify auth-dependent data.

**Strategy:**

| Tool | Use For | Why |
|------|---------|-----|
| Playwright | Bulk E2E tests, CI, non-auth flows | Fast, headless, parallelizable, good Next.js integration |
| Chrome MCP | Auth-dependent verification, checkpoint:human-verify tasks | Real browser session, auth state persists correctly |

**Playwright Tests (Primary):**
- UI rendering and layout verification
- Navigation flows
- Form interactions (non-authenticated)
- Component visibility checks
- CI/CD pipeline integration
- Location: `app/e2e/*.spec.ts`

**Chrome MCP Tests (Auth Scenarios):**
- Verifying data created by authenticated users
- Testing permission-based visibility
- Suggestion workflow verification (author vs reviewer views)
- Personal workspace operations
- Any test requiring `ctx.auth.getUserIdentity()` in Convex queries
- Location: `.planning/verification/` (manual verification scripts)

**Decision:** Use Playwright for ~90% of tests, Chrome MCP for auth-critical verification.

## E2E Authentication Strategy

**Problem:** Convex Auth session state doesn't persist properly in Playwright's browser context. Authenticated users appear logged in but `ctx.auth.getUserIdentity()` returns `null` in Convex queries.

**Solution:** Test user seeding + Playwright storageState

### How It Works

1. **Test User Seeding** (`convex/testAuth.ts`)
   - Dedicated test users created via Convex function
   - Credentials known to test suite
   - Users have appropriate roles for testing (staff, manager, admin)

2. **Auth Setup Script** (`e2e/auth.setup.ts`)
   - Runs before test suite via Playwright `globalSetup`
   - Performs real sign-in flow through the UI
   - Saves browser state to `.auth/user.json`

3. **StorageState Reuse**
   - Subsequent tests load saved state via `storageState` option
   - Cookies and localStorage persisted between tests
   - No sign-in required per test — fast and reliable

### Running Authenticated Tests

```bash
# First run generates auth state
cd app && bun run test:e2e

# Auth state cached in .auth/user.json
# Delete to force re-authentication
rm -rf app/.auth
```

### Test User Credentials

Test users are seeded by the test setup and should not be used in production:
- See `convex/testAuth.ts` for test user definitions
- Credentials are deterministic for CI reproducibility

### When to Use Each Approach

| Scenario | Approach |
|----------|----------|
| Standard E2E flows with auth | Playwright + storageState |
| Complex auth state verification | Chrome MCP (real browser) |
| CI/CD pipeline | Playwright + storageState |
| Manual verification | Chrome MCP |

## Gaps and Recommendations

**Current State:**
- E2E tests only (Playwright)
- Chrome MCP for auth verification
- No unit tests for Convex functions
- No component tests

**Potential Additions:**
- Vitest for unit testing Convex functions
- React Testing Library for component tests
- Test coverage reporting

---

*Testing analysis: 2026-01-14*
*Strategy updated: 2026-01-15 (Playwright + Chrome MCP dual approach)*
