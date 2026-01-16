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

import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { chromium, type FullConfig, type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env.local
import { config } from "dotenv";
config({ path: path.join(__dirname, "..", ".env.local") });

import { seedAllTestUsers, TEST_USERS, type TestUserType } from "./utils/clerk-test-users";

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
 * Sign in a user using @clerk/testing's clerk.signIn() helper
 *
 * This uses the official Clerk testing library which handles:
 * - Bot detection bypass
 * - Programmatic sign-in with the test user
 */
async function signInWithClerk(
  page: Page,
  baseURL: string,
  userType: TestUserType
): Promise<void> {
  const user = TEST_USERS[userType];

  console.log(`[Auth] Starting sign-in for ${user.email}...`);

  // Navigate to the sign-in page to load Clerk's SignIn component
  await page.goto(`${baseURL}/signin`, { timeout: 60000, waitUntil: "domcontentloaded" });
  // Wait for Clerk to initialize (clerk.signIn will wait for window.Clerk.loaded)
  await page.waitForTimeout(3000);
  console.log(`[Auth] Sign-in page loaded, signing in with clerk.signIn()...`);

  // Use @clerk/testing's clerk.signIn() helper with email-based sign-in
  // This finds the user by email and uses ticket-based authentication
  await clerk.signIn({
    page,
    emailAddress: user.email,
  });

  console.log(`[Auth] clerk.signIn() completed, navigating to app...`);

  // Navigate to the app after sign-in
  await page.goto(baseURL, { timeout: 60000, waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  // Wait for session to be established
  await page.waitForTimeout(2000);

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
    throw new Error(`Authentication verification failed for ${user.email}. Current URL: ${page.url()}`);
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
