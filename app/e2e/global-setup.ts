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

import { seedAllTestUsers, TEST_USERS, findUserByEmail, createSignInToken, type TestUserType } from "./utils/clerk-test-users";

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

    await signInWithClerk(staffPage, baseURL, "staff");
    await staffContext.storageState({ path: STAFF_STORAGE_STATE });
    console.log(`[Global Setup] Staff auth state saved to ${STAFF_STORAGE_STATE}`);
    await staffContext.close();

    // Setup manager user
    console.log(`[Global Setup] Signing in manager user: ${TEST_USERS.manager.email}`);
    const managerContext = await browser.newContext();
    const managerPage = await managerContext.newPage();
    setupPageLogging(managerPage, "manager");

    await signInWithClerk(managerPage, baseURL, "manager");
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
 * Sign in a user using Clerk's sign-in token via JavaScript execution
 *
 * Uses Clerk Backend SDK to create a sign-in token, then executes JavaScript
 * on the page to use Clerk's frontend SDK with the ticket strategy.
 *
 * This approach works with Clerk's hosted sign-in pages where the embedded
 * clerk.signIn() helper doesn't work directly.
 */
async function signInWithClerk(
  page: Page,
  baseURL: string,
  userType: TestUserType
): Promise<void> {
  const user = TEST_USERS[userType];

  console.log(`[Auth] Creating sign-in token for ${user.email}...`);

  // Get user ID (user should already exist from seeding)
  const existingUser = await findUserByEmail(user.email);
  if (!existingUser) {
    throw new Error(`Test user ${user.email} not found - run seeding first`);
  }
  const token = await createSignInToken(existingUser.id);

  console.log(`[Auth] Navigating to app to load Clerk...`);

  // Navigate to app to load Clerk SDK
  await page.goto(baseURL, { timeout: 60000 });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(3000);

  console.log(`[Auth] Page URL: ${page.url()}`);

  // Take screenshot before sign-in
  await page.screenshot({
    path: path.join(AUTH_DIR, `before-signin-${user.email.split("@")[0]}.png`),
    fullPage: true,
  });

  // Wait for Clerk to be available
  console.log(`[Auth] Waiting for Clerk to load...`);

  const clerkLoaded = await page.evaluate(async () => {
    // Wait up to 10 seconds for Clerk
    for (let i = 0; i < 20; i++) {
      if (typeof window !== "undefined" && (window as unknown as { Clerk?: unknown }).Clerk) {
        return true;
      }
      await new Promise((r) => setTimeout(r, 500));
    }
    return false;
  });

  if (!clerkLoaded) {
    await page.screenshot({
      path: path.join(AUTH_DIR, `clerk-not-loaded-${user.email.split("@")[0]}.png`),
      fullPage: true,
    });
    throw new Error("Clerk SDK did not load on the page");
  }

  console.log(`[Auth] Clerk loaded, signing in with ticket strategy...`);

  // Use Clerk's frontend SDK to sign in with the ticket
  const signInResult = await page.evaluate(async (ticketToken: string) => {
    try {
      const clerk = (window as unknown as { Clerk: { client: { signIn: { create: (params: { strategy: string; ticket: string }) => Promise<{ status: string }> } } } }).Clerk;
      const signIn = await clerk.client.signIn.create({
        strategy: "ticket",
        ticket: ticketToken,
      });
      return { success: true, status: signIn.status };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }, token);

  if (!signInResult.success) {
    await page.screenshot({
      path: path.join(AUTH_DIR, `signin-error-${user.email.split("@")[0]}.png`),
      fullPage: true,
    });
    throw new Error(`Clerk signIn failed: ${signInResult.error}`);
  }

  console.log(`[Auth] Sign-in result: ${signInResult.status}`);

  // If sign-in succeeded, set the session and wait for redirect
  if (signInResult.status === "complete") {
    console.log(`[Auth] Setting active session...`);

    await page.evaluate(async () => {
      const clerk = (window as unknown as { Clerk: { setActive: (params: { session: string }) => Promise<void>; client: { signIn: { createdSessionId: string } } } }).Clerk;
      await clerk.setActive({
        session: clerk.client.signIn.createdSessionId,
      });
    });

    // Wait for Clerk to redirect back to app
    console.log(`[Auth] Waiting for redirect to app...`);
    try {
      await page.waitForURL((url) => url.origin === new URL(baseURL).origin, {
        timeout: 15000,
      });
    } catch {
      // If redirect doesn't happen, manually navigate
      console.log(`[Auth] Redirect timeout, manually navigating...`);
      await page.goto(baseURL, { timeout: 60000, waitUntil: "domcontentloaded" });
    }
  }

  await page.waitForTimeout(3000);

  console.log(`[Auth] After sign-in, URL: ${page.url()}`);

  // Take screenshot after sign-in
  await page.screenshot({
    path: path.join(AUTH_DIR, `after-signin-${user.email.split("@")[0]}.png`),
    fullPage: true,
  });

  // Verify authentication
  const isAuthenticated = await verifyAuthentication(page);
  if (!isAuthenticated) {
    await page.screenshot({
      path: path.join(AUTH_DIR, `auth-verify-${user.email.split("@")[0]}.png`),
      fullPage: true,
    });
    throw new Error(`Authentication verification failed for ${user.email}`);
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
