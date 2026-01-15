# E2E Test Suite

This directory contains end-to-end tests for the Silver Sycamore application using Playwright with Clerk authentication.

## Prerequisites

### 1. Dev Server Running

The tests expect the app to be running on `localhost:3001`:

```bash
cd app
bun run dev          # Start Next.js on port 3001
npx convex dev       # Start Convex backend (separate terminal)
```

### 2. Clerk Dashboard Configuration (REQUIRED)

**Email+Password authentication must be enabled** in the Clerk Dashboard for E2E tests to work:

1. Go to https://dashboard.clerk.com
2. Select your application (`optimal-caribou-74`)
3. Navigate to **Configure > Email, Phone, Username**
4. Under **Authentication strategies**, enable **"Password"**
5. Save changes

Without this configuration, the tests will fail with a redirect to Google OAuth.

### 3. Test Users (Auto-Created)

Test users are **automatically seeded** via the Clerk Backend SDK when tests run:

| Email | Password | Purpose |
|-------|----------|---------|
| `e2e-staff@example.com` | `SilverSycamoreE2E#2025!Staff` | Primary test account |
| `e2e-manager@example.com` | `SilverSycamoreE2E#2025!Manager` | Approval workflow tests |

Users are created with auto-verified emails. If they already exist, their passwords are updated to match the configured values.

## Running Tests

### Full Test Suite

Run all tests including authenticated tests:

```bash
cd app
bun run test
```

### Basic Tests Only (No Auth Required)

Run infrastructure tests that don't require authentication:

```bash
cd app
bun run test --project=basic
```

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
  .auth/                     # Authenticated session storage (gitignored)
  utils/
    clerk-test-users.ts      # Test user seeding via Clerk Backend SDK
  global-setup.ts            # Clerk authentication setup
  basic.spec.ts              # Basic infrastructure tests (no auth)
  homepage.spec.ts           # Homepage tests (requires auth)
  documents.spec.ts          # Document page tests (requires auth)
  navigation.spec.ts         # Navigation tests (requires auth)
  notifications.spec.ts      # Notification system tests (requires auth)
  suggestion-workflow.spec.ts # Suggestion workflow tests (requires auth)
  README.md                  # This file
```

## How Authentication Works

1. **Global Setup** (`global-setup.ts`):
   - Seeds test users via Clerk Backend SDK
   - Initializes `@clerk/testing` for bot detection bypass
   - Signs in each test user interactively via Clerk's hosted sign-in page
   - Saves authenticated browser state (`storageState`) for reuse

2. **Test Execution**:
   - Tests load the saved `storageState` to start already authenticated
   - `@clerk/testing`'s `setupClerkTestingToken()` is called to bypass bot detection

3. **Playwright Projects**:
   - `basic`: No authentication (tests public pages)
   - `staff-tests`: Uses staff user's `storageState`
   - `manager-tests`: Uses manager user's `storageState`

## Environment Variables

The following are required in `app/.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

These are used by:
- Next.js app for Clerk authentication
- E2E tests for Clerk Backend SDK (user seeding)
- `@clerk/testing` for testing token setup

## Troubleshooting

### "Redirected to Google OAuth" Error

This means Email+Password authentication is NOT enabled in Clerk Dashboard:

1. Go to https://dashboard.clerk.com
2. Configure > Email, Phone, Username
3. Enable "Password" under Authentication strategies
4. Save and re-run tests

### "Password has been found in an online data breach" Error

The test password was rejected by Clerk's breach detection. Update the password in `e2e/utils/clerk-test-users.ts` to use a unique password.

### "Authentication verification failed" Error

After sign-in, the test couldn't find authenticated UI elements. This could mean:
- The sign-in didn't complete successfully
- The app's authenticated UI elements have changed
- Check the screenshots in `e2e/.auth/` for debugging

### Page Not Loading

1. Verify the dev server is running on port 3001
2. Verify Convex backend is running
3. Check for errors in the server console

## Screenshots

Test screenshots are saved to:
- `e2e/.auth/` - Authentication flow debugging
- `e2e/test-results/` - Playwright test artifacts
- `.planning/verification/e2e-upgrade/` - E2E upgrade verification

## Configuration

- `playwright.config.ts` - Playwright configuration
- Test timeout: 30 seconds (configurable)
- Base URL: `http://localhost:3001`
- Screenshots: On for all tests
- Video: Retained on failure
