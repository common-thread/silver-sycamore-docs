# Testing Patterns

**Analysis Date:** 2026-01-16

## Test Framework

**Runner:**
- Playwright 1.57+ (`@playwright/test`)
- Config: `app/playwright.config.ts`

**Assertion Library:**
- Playwright built-in `expect`
- Matchers: `toBeVisible`, `toHaveText`, `toHaveURL`

**Run Commands:**
```bash
cd app
bun run test                              # Run all tests
bun run test:ui                           # Run with Playwright UI
bun run test -- --project=basic           # Run only basic tests
bun run test -- path/to/file.spec.ts      # Single file
```

## Test File Organization

**Location:**
- `app/e2e/*.spec.ts` - All E2E tests in dedicated directory
- Not co-located with source files

**Naming:**
- kebab-case with `.spec.ts` suffix: `basic.spec.ts`, `notifications.spec.ts`
- Setup files: `global-setup.ts`
- Utilities: `utils/clerk-test-users.ts`

**Structure:**
```
app/e2e/
  .auth/                          # Authenticated session storage (gitignored)
    staff.json
    manager.json
  utils/
    clerk-test-users.ts           # Test user seeding utilities
  test-results/                   # Playwright artifacts
  global-setup.ts                 # Global setup (user seeding, auth)
  basic.spec.ts                   # Basic infrastructure tests
  homepage.spec.ts                # Homepage tests
  documents.spec.ts               # Document tests
  navigation.spec.ts              # Navigation tests
  notifications.spec.ts           # Notification system tests
  suggestion-workflow.spec.ts     # Approval workflow tests
  uat-verification.spec.ts        # User acceptance tests
  README.md                       # Test documentation
```

## Test Structure

**Suite Organization:**
```typescript
import { test, expect } from "@playwright/test";
import { setupClerkTestingToken } from "@clerk/testing/playwright";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    // Setup Clerk testing token
    await setupClerkTestingToken({ page });
  });

  test("should do expected behavior", async ({ page }) => {
    // Navigate
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Act
    const element = page.locator("button[title='Action']");
    await element.click();

    // Assert
    await expect(element).toBeVisible({ timeout: 10000 });
  });
});
```

**Patterns:**
- `test.beforeEach` for per-test setup (Clerk token)
- `test.beforeAll` for suite-level setup (directories)
- `page.waitForLoadState("networkidle")` for page loads
- Explicit timeouts on assertions: `{ timeout: 10000 }`

## Test Projects

**Configured in `playwright.config.ts`:**

1. **basic** - No authentication required
   - Test match: `/basic\.spec\.ts/`
   - Browser: Desktop Chrome
   - Purpose: Public pages, infrastructure validation

2. **setup** - Authentication setup
   - Test match: `global-setup.ts`
   - Purpose: Seed users, create auth state

3. **staff-tests** - Authenticated staff user
   - Storage state: `e2e/.auth/staff.json`
   - Dependencies: `['setup']`
   - Purpose: Core feature tests

4. **manager-tests** - Authenticated manager user
   - Storage state: `e2e/.auth/manager.json`
   - Dependencies: `['setup']`
   - Purpose: Approval workflow tests

## Authentication Testing

**Global Setup (`global-setup.ts`):**
```typescript
async function globalSetup(config: FullConfig) {
  // 1. Seed test users via Clerk Backend SDK
  await seedAllTestUsers();

  // 2. Initialize @clerk/testing
  await clerkSetup();

  // 3. Sign in each user and save browser state
  // Creates: .auth/staff.json, .auth/manager.json
}
```

**Test Users:**
- Staff: `e2e-staff@example.com` (primary test account)
- Manager: `e2e-manager@example.com` (approval workflows)
- Created via Clerk Backend SDK with auto-verified emails

**Token Setup in Tests:**
```typescript
import { setupClerkTestingToken } from "@clerk/testing/playwright";

test.beforeEach(async ({ page }) => {
  await setupClerkTestingToken({ page });
});
```

## Mocking

**Framework:**
- No explicit mocking framework
- Uses real Convex backend (test database)
- Clerk test mode for authentication

**What's Mocked:**
- Clerk auth tokens via `@clerk/testing`

**What's NOT Mocked:**
- Convex backend (real serverless functions)
- Database operations (real data)

## Coverage

**Requirements:**
- No enforced coverage target
- E2E-only approach (no unit test coverage)

**Tracked Areas:**
- Public page accessibility
- Authentication flows
- Core feature workflows (documents, notifications, suggestions)

## Common Test Patterns

**Page Navigation & Waiting:**
```typescript
await page.goto("/");
await page.waitForLoadState("networkidle");
await page.waitForLoadState("domcontentloaded");
```

**Element Interaction:**
```typescript
const button = page.locator('button[title="Notifications"]');
await expect(button).toBeVisible({ timeout: 10000 });
await button.click();
```

**Screenshot Capture:**
```typescript
const SCREENSHOT_DIR = path.join(__dirname, "screenshots");

await page.screenshot({
  path: path.join(SCREENSHOT_DIR, "test-01.png"),
  fullPage: true,
});
```

**Assertions with Timeout:**
```typescript
await expect(title.first()).toBeVisible({ timeout: 10000 });
await expect(page).toHaveURL(/\/dashboard/);
```

## Playwright Configuration

**Key Settings (`playwright.config.ts`):**
```typescript
{
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
  },

  outputDir: './e2e/test-results',

  webServer: {
    command: 'bun dev --port 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
    timeout: 120000,
  }
}
```

## Test Types

**E2E Tests (only type present):**
- Full browser automation
- Real backend, real database
- Test user flows end-to-end

**Unit Tests:**
- Not currently implemented
- No Jest, Vitest, or similar framework detected

**Integration Tests:**
- Covered by E2E tests
- No separate integration test layer

## Test Documentation

**README (`app/e2e/README.md`):**
- 160+ lines of documentation
- Covers setup, running, troubleshooting
- Documents test user credentials

**In-File Documentation:**
- JSDoc comments on global setup
- Console.log statements for test progress

## Running Tests

**Prerequisites:**
1. Start dev server: `cd app && bun run dev` (port 3001)
2. Start Convex: `npx convex dev` (separate terminal)
3. Environment: `.env.local` with Clerk credentials
4. Clerk Dashboard: Email+Password auth enabled

**Commands:**
```bash
cd app
bun run test           # All tests
bun run test:ui        # With Playwright UI
```

---

*Testing analysis: 2026-01-16*
*Update when test patterns change*
