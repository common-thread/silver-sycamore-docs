/**
 * Playwright Global Setup for E2E Tests with Clerk Authentication
 *
 * This script runs before all tests to:
 * 1. Seed test users via Clerk Backend SDK (auto-verified emails)
 * 2. Initialize @clerk/testing for bot detection bypass
 * 3. Save minimal browser state for test reuse
 *
 * Test users are automatically created if they don't exist:
 * - e2e-staff@example.com (staff) - Primary test account
 * - e2e-manager@example.com (manager) - For approval workflows
 *
 * IMPORTANT: This setup requires Email+Password authentication to be enabled
 * in the Clerk Dashboard for interactive sign-in to work. If only Google OAuth
 * is enabled, the sign-in will redirect to Google and fail.
 *
 * To enable Email+Password in Clerk Dashboard:
 * 1. Go to Configure > Email, Phone, Username
 * 2. Enable "Password" under "Authentication strategies"
 */

import { clerkSetup } from "@clerk/testing/playwright";
import { chromium, type FullConfig, type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env.local
import { config } from "dotenv";
config({ path: path.join(__dirname, "..", ".env.local") });

import { seedAllTestUsers, TEST_USERS } from "./utils/clerk-test-users";

const AUTH_DIR = path.join(__dirname, ".auth");
const STAFF_STORAGE_STATE = path.join(AUTH_DIR, "staff.json");
const MANAGER_STORAGE_STATE = path.join(AUTH_DIR, "manager.json");

// Export for use in tests
export { TEST_USERS, STAFF_STORAGE_STATE, MANAGER_STORAGE_STATE };

async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL || "http://localhost:3001";

  console.log("[Global Setup] Starting E2E test setup with Clerk...");
  console.log(`[Global Setup] Base URL: ${baseURL}`);

  // Ensure .auth directory exists
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  // Step 1: Seed test users via Clerk Backend SDK
  console.log("[Global Setup] Seeding test users via Clerk Backend SDK...");
  try {
    await seedAllTestUsers();
  } catch (error) {
    console.error("[Global Setup] Failed to seed test users:", error);
    throw error;
  }

  // Step 2: Initialize Clerk testing (sets up testing token for bot bypass)
  console.log("[Global Setup] Initializing Clerk testing...");
  await clerkSetup();

  // Step 3: Sign in users and save storage state
  const browser = await chromium.launch({ headless: true });

  try {
    // Setup staff user
    console.log(`[Global Setup] Signing in staff user: ${TEST_USERS.staff.email}`);
    const staffContext = await browser.newContext();
    const staffPage = await staffContext.newPage();
    setupPageLogging(staffPage, "staff");

    await signInWithClerk(staffPage, baseURL, TEST_USERS.staff);
    await staffContext.storageState({ path: STAFF_STORAGE_STATE });
    console.log(`[Global Setup] Staff auth state saved to ${STAFF_STORAGE_STATE}`);
    await staffContext.close();

    // Setup manager user
    console.log(`[Global Setup] Signing in manager user: ${TEST_USERS.manager.email}`);
    const managerContext = await browser.newContext();
    const managerPage = await managerContext.newPage();
    setupPageLogging(managerPage, "manager");

    await signInWithClerk(managerPage, baseURL, TEST_USERS.manager);
    await managerContext.storageState({ path: MANAGER_STORAGE_STATE });
    console.log(`[Global Setup] Manager auth state saved to ${MANAGER_STORAGE_STATE}`);
    await managerContext.close();

    console.log("[Global Setup] Setup complete!");
  } catch (error) {
    console.error("[Global Setup] Failed:", error);
    // Take screenshot on failure
    const debugPage = await browser.newPage();
    await debugPage.goto(`${baseURL}/signin`);
    await debugPage.waitForTimeout(2000);
    await debugPage.screenshot({
      path: path.join(AUTH_DIR, "setup-failure.png"),
      fullPage: true,
    });
    throw error;
  } finally {
    await browser.close();
  }
}

function setupPageLogging(page: Page, userType: string) {
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log(`[${userType}] Browser Error: ${msg.text().slice(0, 300)}`);
    }
  });
  page.on("pageerror", (error) => {
    console.log(`[${userType}] Page Error: ${error.message}`);
  });
}

/**
 * Sign in a user using interactive Clerk SignIn UI on the hosted sign-in page
 *
 * This function handles the Clerk hosted sign-in flow:
 * 1. Navigate to app (redirects to Clerk sign-in)
 * 2. Enter email address
 * 3. Enter password (requires Email+Password auth enabled in Clerk Dashboard)
 * 4. Submit and wait for redirect back to app
 *
 * If Clerk redirects to Google OAuth, it means Email+Password auth is not enabled.
 */
async function signInWithClerk(
  page: Page,
  baseURL: string,
  user: { email: string; password: string }
): Promise<void> {
  // Navigate to app - this will redirect to Clerk's hosted sign-in page
  await page.goto(baseURL, { timeout: 60000 });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(3000);

  console.log(`[Auth] Navigated to: ${page.url()}`);

  // Take screenshot before sign-in
  await page.screenshot({
    path: path.join(AUTH_DIR, `signin-page-${user.email.split("@")[0]}.png`),
    fullPage: true,
  });

  // Find and fill the email input
  const emailInput = page.locator('input[name="identifier"], input[type="email"]').first();
  await emailInput.waitFor({ timeout: 10000 });
  await emailInput.fill(user.email);
  console.log(`[Auth] Entered email: ${user.email}`);

  // Click Continue
  const continueButton = page.locator('button:has-text("Continue")').first();
  await continueButton.click();
  await page.waitForTimeout(3000);

  // Check current URL
  const currentUrl = page.url();
  console.log(`[Auth] After Continue, URL: ${currentUrl}`);

  // If redirected to Google OAuth, throw helpful error
  if (currentUrl.includes("accounts.google.com")) {
    await page.screenshot({
      path: path.join(AUTH_DIR, `oauth-redirect-${user.email.split("@")[0]}.png`),
      fullPage: true,
    });
    throw new Error(
      `\n\n` +
      `=================================================================\n` +
      `CLERK AUTHENTICATION SETUP REQUIRED\n` +
      `=================================================================\n` +
      `\n` +
      `Clerk redirected to Google OAuth instead of showing password field.\n` +
      `This means Email+Password authentication is NOT enabled.\n` +
      `\n` +
      `To fix this, enable Email+Password in Clerk Dashboard:\n` +
      `\n` +
      `1. Go to https://dashboard.clerk.com\n` +
      `2. Select your application (optimal-caribou-74)\n` +
      `3. Go to Configure > Email, Phone, Username\n` +
      `4. Under "Authentication strategies", enable "Password"\n` +
      `5. Save changes and re-run tests\n` +
      `\n` +
      `Alternatively, if you only want to use Google OAuth:\n` +
      `- E2E tests will need to be configured differently\n` +
      `- Contact your team lead for guidance\n` +
      `=================================================================\n`
    );
  }

  // Wait for password field to appear
  const passwordInput = page.locator('input[type="password"]').first();
  const hasPasswordField = await passwordInput.isVisible({ timeout: 10000 }).catch(() => false);

  if (!hasPasswordField) {
    await page.screenshot({
      path: path.join(AUTH_DIR, `no-password-${user.email.split("@")[0]}.png`),
      fullPage: true,
    });
    throw new Error(
      `Password field not visible after entering email. ` +
      `Email+Password authentication may not be enabled in Clerk Dashboard.`
    );
  }

  // Enter password
  await passwordInput.fill(user.password);
  console.log(`[Auth] Entered password`);

  // Click Continue/Sign in button
  const submitButton = page.locator('button:has-text("Continue"), button:has-text("Sign in")').first();
  await submitButton.click();

  // Wait for redirect back to the app
  try {
    await page.waitForURL((url) => url.origin === new URL(baseURL).origin, {
      timeout: 30000,
    });
    console.log(`[Auth] Redirected to app: ${page.url()}`);
  } catch {
    await page.screenshot({
      path: path.join(AUTH_DIR, `signin-timeout-${user.email.split("@")[0]}.png`),
      fullPage: true,
    });
    throw new Error(`Sign-in redirect timeout. Current URL: ${page.url()}`);
  }

  // Wait for the app to fully load
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  // Verify authentication
  const isAuthenticated = await verifyAuthentication(page);
  if (!isAuthenticated) {
    await page.screenshot({
      path: path.join(AUTH_DIR, `auth-verify-${user.email.split("@")[0]}.png`),
      fullPage: true,
    });
    throw new Error("Authentication verification failed after sign-in");
  }

  console.log(`[Auth] User ${user.email} signed in successfully`);
}

/**
 * Verifies that the user is authenticated by checking for authenticated UI elements.
 */
async function verifyAuthentication(page: Page): Promise<boolean> {
  await page.waitForTimeout(2000);

  // Check for UserButton or NotificationBell which indicate logged-in state
  const isAuthenticated = await page
    .locator(
      'button[title="Notifications"], [data-clerk-user-button], .cl-userButtonTrigger'
    )
    .first()
    .isVisible({ timeout: 5000 })
    .catch(() => false);

  return isAuthenticated;
}

export default globalSetup;
