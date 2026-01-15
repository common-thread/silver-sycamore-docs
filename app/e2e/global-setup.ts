/**
 * Playwright Global Setup for E2E Tests with Clerk Authentication
 *
 * This script runs before all tests to:
 * 1. Seed test users via Clerk Backend SDK (auto-verified emails)
 * 2. Sign in test users via @clerk/testing helpers
 * 3. Save authenticated browser state for reuse across tests
 *
 * Test users are automatically created if they don't exist:
 * - e2e-staff@silversycamore.test (staff) - Primary test account
 * - e2e-manager@silversycamore.test (manager) - For approval workflows
 */

import { clerkSetup } from "@clerk/testing/playwright";
import { chromium, type FullConfig, type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
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

  // Step 2: Initialize Clerk testing
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
 * Sign in a user using Clerk's SignIn UI
 * Uses setupClerkTestingToken to bypass bot detection
 */
async function signInWithClerk(
  page: Page,
  baseURL: string,
  user: { email: string; password: string }
): Promise<void> {
  // Navigate to sign-in page
  await page.goto(`${baseURL}/signin`, { timeout: 60000 });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(3000);

  console.log(`[Auth] Navigated to: ${page.url()}`);

  // Take screenshot before trying to find inputs
  await page.screenshot({
    path: path.join(AUTH_DIR, `signin-page-${user.email.split("@")[0]}.png`),
    fullPage: true,
  });

  // Find the email input field
  const inputSelectors = [
    'input[name="identifier"]',
    'input[type="email"]',
    'input[type="text"]',
    'input[autocomplete="email"]',
    'input[autocomplete="username"]',
  ];

  let inputField = null;
  for (const selector of inputSelectors) {
    const input = page.locator(selector).first();
    if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
      inputField = input;
      console.log(`[Auth] Found email input using selector: ${selector}`);
      break;
    }
  }

  if (!inputField) {
    await page.screenshot({
      path: path.join(AUTH_DIR, `clerk-ui-${user.email.split("@")[0]}.png`),
      fullPage: true,
    });
    throw new Error("Email input not found on sign-in page");
  }

  // Enter email
  await inputField.click();
  await inputField.fill("");
  await inputField.fill(user.email);
  await page.waitForTimeout(500);
  console.log(`[Auth] Entered email: ${user.email}`);

  // Click continue/next button
  const continueButton = page
    .locator('button:has-text("Continue"), button:has-text("Next")')
    .first();
  if (await continueButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await continueButton.click();
    console.log("[Auth] Clicked Continue/Next button");
    await page.waitForTimeout(3000);
  }

  // Take screenshot after clicking continue
  await page.screenshot({
    path: path.join(AUTH_DIR, `after-continue-${user.email.split("@")[0]}.png`),
    fullPage: true,
  });

  // Check if we were redirected to Google OAuth
  const currentUrl = page.url();
  if (currentUrl.includes("accounts.google.com")) {
    throw new Error(
      "Redirected to Google OAuth - password authentication may not be enabled"
    );
  }

  // Check for errors indicating user doesn't exist
  const pageContent = await page.content();
  if (
    pageContent.toLowerCase().includes("couldn't find") ||
    pageContent.toLowerCase().includes("no account found") ||
    pageContent.toLowerCase().includes("doesn't exist")
  ) {
    throw new Error(
      `User ${user.email} not found. The Clerk Backend SDK should have created this user.`
    );
  }

  // Enter password
  const passwordInput = page.locator('input[type="password"]').first();
  if (
    !(await passwordInput.isVisible({ timeout: 5000 }).catch(() => false))
  ) {
    await page.screenshot({
      path: path.join(AUTH_DIR, `no-password-${user.email.split("@")[0]}.png`),
      fullPage: true,
    });
    throw new Error("Password field not found after entering email");
  }

  await passwordInput.fill(user.password);
  console.log("[Auth] Entered password");

  // Click sign in / continue button
  const submitButton = page
    .locator(
      'button[type="submit"], button:has-text("Continue"), button:has-text("Sign in")'
    )
    .first();
  await submitButton.click();
  console.log("[Auth] Clicked submit");

  // Wait for redirect
  try {
    await page.waitForURL((url) => !url.pathname.includes("signin"), {
      timeout: 15000,
    });
    console.log(`[Auth] Redirected to: ${page.url()}`);
  } catch {
    // Check if there's an error message
    const errorAfterSubmit = page
      .locator(
        '[data-clerk-error], .cl-formFieldErrorText, [class*="formFieldError"], [class*="alert"]'
      )
      .first();
    if (
      await errorAfterSubmit.isVisible({ timeout: 2000 }).catch(() => false)
    ) {
      const errorText = await errorAfterSubmit.textContent();
      throw new Error(`Sign-in failed: ${errorText}`);
    }
    await page.screenshot({
      path: path.join(AUTH_DIR, `signin-timeout-${user.email.split("@")[0]}.png`),
      fullPage: true,
    });
    throw new Error("Sign-in redirect timeout");
  }

  // Verify authentication
  const isAuthenticated = await verifyAuthentication(page);
  if (!isAuthenticated) {
    await page.screenshot({
      path: path.join(AUTH_DIR, `auth-verify-${user.email.split("@")[0]}.png`),
      fullPage: true,
    });
    throw new Error("Authentication verification failed");
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
