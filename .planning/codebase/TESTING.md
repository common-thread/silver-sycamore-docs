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

## Gaps and Recommendations

**Current State:**
- E2E tests only
- No unit tests for Convex functions
- No component tests

**Potential Additions:**
- Vitest for unit testing Convex functions
- React Testing Library for component tests
- Test coverage reporting

---

*Testing analysis: 2026-01-14*
*Update when test patterns change*
