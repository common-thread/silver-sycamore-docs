# E2E Test Suite

This directory contains end-to-end tests for the Silver Sycamore application using Playwright.

## Prerequisites

1. **Dev server running**: The tests expect the app to be running on `localhost:3001`
   ```bash
   cd app
   bun run dev          # Start Next.js on port 3001
   npx convex dev       # Start Convex backend (separate terminal)
   ```

2. **Clerk test users**: For authenticated tests, create test users in Clerk Dashboard:
   - Go to https://dashboard.clerk.com > Your App > Users
   - Create users with email+password authentication:
     - `e2e-staff@test.local` / `TestPassword123!`
     - `e2e-manager@test.local` / `TestPassword123!`
   - Ensure email+password authentication is enabled in Clerk settings

## Running Tests

### Basic Tests (No Authentication)

Run infrastructure tests that don't require authentication:

```bash
cd app
SKIP_AUTH=1 bun run test --project=basic
```

### Full Test Suite (With Authentication)

Run all tests including authenticated notification tests:

```bash
cd app
bun run test
```

**Note**: This will fail if test users haven't been created in Clerk Dashboard.

### Specific Test Files

```bash
# Run only notification tests
bun run test e2e/notifications.spec.ts

# Run with UI mode
bun run test:ui
```

## Test Structure

```
e2e/
  .auth/                 # Authenticated session storage (gitignored)
  global-setup.ts        # Clerk authentication setup
  basic.spec.ts          # Basic infrastructure tests (no auth)
  notifications.spec.ts  # Notification system tests (requires auth)
  README.md              # This file
```

## Test Users

| Email | Password | Purpose |
|-------|----------|---------|
| e2e-staff@test.local | TestPassword123! | Primary test account |
| e2e-manager@test.local | TestPassword123! | Approval workflow tests |

## Screenshots

Test screenshots are saved to:
- `.planning/verification/e2e-upgrade/` - E2E upgrade verification
- `e2e/test-results/` - Playwright test artifacts

## Troubleshooting

### "Test user does not exist" Error

Create the test users manually in Clerk Dashboard. See Prerequisites above.

### Authentication Redirect Issues

If tests are redirected to Google OAuth instead of showing password input:
1. Verify email+password authentication is enabled in Clerk
2. Ensure the test user exists and has a password set

### Page Not Loading

1. Check that the dev server is running on port 3001
2. Check that Convex backend is running
3. Look for errors in the server console

## Configuration

- `playwright.config.ts` - Playwright configuration
- Test timeout: 30 seconds
- Base URL: `http://localhost:3001`
- Screenshots: On for all tests
- Video: Retained on failure
