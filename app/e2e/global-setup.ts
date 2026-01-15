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

  // Log auth-related console errors for debugging
  page.on("console", (msg) => {
    if (msg.type() === "error" && msg.text().includes("auth")) {
      console.log(`[Browser] ${msg.text().slice(0, 200)}`);
    }
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

  // Try creating account first
  const createTab = page.getByRole("button", { name: "Create Account" }).first();
  if (await createTab.isVisible()) {
    await createTab.click();
    await page.waitForTimeout(500);
  }

  await page.getByPlaceholder("you@example.com").fill(user.email);
  await page.getByPlaceholder("Enter your password").fill(user.password);
  await page.locator('button[type="submit"]').click();

  // Wait for response
  await page.waitForTimeout(5000);

  if (!page.url().includes("signin")) {
    return; // Account created successfully
  }

  // Try signing in (account may exist from previous run)
  await page.goto(`${baseURL}/signin`);
  await page.waitForLoadState("networkidle");

  const signInTab = page.getByRole("button", { name: "Sign In" }).first();
  if (await signInTab.isVisible()) {
    await signInTab.click();
    await page.waitForTimeout(500);
  }

  await page.getByPlaceholder("you@example.com").fill(user.email);
  await page.getByPlaceholder("Enter your password").fill(user.password);
  await page.locator('button[type="submit"]').click();

  await page.waitForTimeout(5000);

  if (page.url().includes("signin")) {
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
