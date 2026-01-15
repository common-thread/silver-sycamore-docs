/**
 * Playwright Global Setup for E2E Tests
 *
 * This script runs before all tests to:
 * 1. Create test user accounts via the UI (using Convex Auth Password provider)
 * 2. Save authenticated browser state for reuse across tests
 *
 * Test users:
 * - e2e-staff-{date}@test.com (staff) - Primary test account
 * - e2e-manager-{date}@test.com (manager) - For approval workflows
 *
 * Prerequisites:
 * - Convex backend must have JWT_PRIVATE_KEY environment variable set
 * - Development server must be running or will be started by webServer config
 */
import { chromium, type FullConfig, type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Generate unique emails per day to avoid conflicts from previous test runs
const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, "");

const TEST_USERS = {
  staff: {
    email: `e2e-staff-${datePrefix}@test.com`,
    password: "TestPassword123!",
    role: "staff" as const,
  },
  manager: {
    email: `e2e-manager-${datePrefix}@test.com`,
    password: "TestPassword123!",
    role: "manager" as const,
  },
};

const AUTH_DIR = path.join(__dirname, ".auth");
const STORAGE_STATE_PATH = path.join(AUTH_DIR, "user.json");

async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL || "http://localhost:3001";

  console.log("[Global Setup] Starting E2E test setup...");
  console.log(`[Global Setup] Base URL: ${baseURL}`);

  // Ensure .auth directory exists
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Log all console errors for debugging
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log(`[Browser Error] ${msg.text().slice(0, 500)}`);
    }
  });

  // Log page errors
  page.on("pageerror", (error) => {
    console.log(`[Page Error] ${error.message}`);
  });

  try {
    // Create and authenticate primary test user
    console.log(`[Global Setup] Setting up: ${TEST_USERS.staff.email}`);
    await createOrSignInUser(page, baseURL, TEST_USERS.staff);

    // Verify authentication
    if (!(await verifyAuthentication(page, baseURL))) {
      throw new Error("Primary user authentication verification failed");
    }

    console.log("[Global Setup] Primary user authenticated");

    // Save authenticated state for tests
    await context.storageState({ path: STORAGE_STATE_PATH });
    console.log(`[Global Setup] Auth state saved to ${STORAGE_STATE_PATH}`);

    // Create manager user in separate context
    const managerContext = await browser.newContext();
    const managerPage = await managerContext.newPage();

    console.log(`[Global Setup] Setting up: ${TEST_USERS.manager.email}`);
    await createOrSignInUser(managerPage, baseURL, TEST_USERS.manager);
    await managerContext.close();

    console.log("[Global Setup] Setup complete!");
  } catch (error) {
    console.error("[Global Setup] Failed:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function createOrSignInUser(
  page: Page,
  baseURL: string,
  user: { email: string; password: string }
): Promise<void> {
  await page.goto(`${baseURL}/signin`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);

  console.log(`[Auth] Current URL: ${page.url()}`);

  // Try creating account first - click "Create Account" tab
  const createTab = page.getByRole("button", { name: "Create Account" }).first();
  console.log(`[Auth] Create Account tab visible: ${await createTab.isVisible()}`);
  if (await createTab.isVisible()) {
    await createTab.click();
    await page.waitForTimeout(500);
  }

  await page.getByPlaceholder("you@example.com").fill(user.email);
  await page.getByPlaceholder("Enter your password").fill(user.password);

  console.log(`[Auth] Attempting to create account for ${user.email}`);
  await page.locator('button[type="submit"]').click();

  // Wait for response and check for errors
  await page.waitForTimeout(5000);

  // Check for error messages
  const errorText = await page.locator('div[style*="rgba(185, 74, 72"]').textContent().catch(() => null);
  if (errorText) {
    console.log(`[Auth] Create account error: ${errorText}`);
  }

  // Navigate to homepage and check for auth state
  await page.goto(`${baseURL}/`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);

  // Check for notification bell which indicates authenticated state
  const notificationBell = page.locator('button[title="Notifications"]');
  let isAuthenticated = await notificationBell.isVisible({ timeout: 5000 }).catch(() => false);
  console.log(`[Auth] After create attempt, authenticated: ${isAuthenticated}`);

  if (isAuthenticated) {
    console.log(`[Auth] Account created successfully`);
    return;
  }

  // Try signing in (account may exist from previous run)
  console.log(`[Auth] Account creation failed, trying sign in...`);
  await page.goto(`${baseURL}/signin`);
  await page.waitForLoadState("networkidle");

  const signInTab = page.getByRole("button", { name: "Sign In" }).first();
  if (await signInTab.isVisible()) {
    await signInTab.click();
    await page.waitForTimeout(500);
  }

  await page.getByPlaceholder("you@example.com").fill(user.email);
  await page.getByPlaceholder("Enter your password").fill(user.password);

  console.log(`[Auth] Attempting sign in for ${user.email}`);
  await page.locator('button[type="submit"]').click();

  await page.waitForTimeout(5000);

  // Check for error messages
  const signInError = await page.locator('div[style*="rgba(185, 74, 72"]').textContent().catch(() => null);
  if (signInError) {
    console.log(`[Auth] Sign in error: ${signInError}`);
  }

  // Navigate to homepage and check for auth state
  await page.goto(`${baseURL}/`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);

  isAuthenticated = await notificationBell.isVisible({ timeout: 5000 }).catch(() => false);
  console.log(`[Auth] After sign in attempt, authenticated: ${isAuthenticated}`);

  if (!isAuthenticated) {
    // Take screenshot for debugging
    await page.screenshot({ path: path.join(AUTH_DIR, "auth-failure.png") });
    throw new Error(`Authentication failed for ${user.email}`);
  }
}

async function verifyAuthentication(page: Page, baseURL: string): Promise<boolean> {
  await page.goto(`${baseURL}/`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  return !page.url().includes("signin");
}

export default globalSetup;
