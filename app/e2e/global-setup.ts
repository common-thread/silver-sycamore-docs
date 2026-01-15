/**
 * Playwright Global Setup for E2E Tests with Clerk Authentication
 *
 * This script runs before all tests to:
 * 1. Sign in test users via Clerk's SignIn UI
 * 2. Save authenticated browser state for reuse across tests
 *
 * IMPORTANT: Test users must be created manually in Clerk Dashboard:
 * 1. Go to Clerk Dashboard > Users > Create User
 * 2. Create users with these credentials:
 *    - e2e-staff@test.local / TestPassword123!
 *    - e2e-manager@test.local / TestPassword123!
 * 3. Enable email+password authentication in Clerk settings
 *
 * Test users:
 * - e2e-staff@test.local (staff) - Primary test account
 * - e2e-manager@test.local (manager) - For approval workflows
 */
import { chromium, type FullConfig, type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const TEST_USERS = {
  staff: {
    email: "e2e-staff@test.local",
    password: "TestPassword123!",
    role: "staff" as const,
  },
  manager: {
    email: "e2e-manager@test.local",
    password: "TestPassword123!",
    role: "manager" as const,
  },
};

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

  const browser = await chromium.launch({ headless: true });

  try {
    // Setup staff user
    console.log(`[Global Setup] Setting up staff user: ${TEST_USERS.staff.email}`);
    const staffContext = await browser.newContext();
    const staffPage = await staffContext.newPage();
    setupPageLogging(staffPage, "staff");

    await createOrSignInUser(staffPage, baseURL, TEST_USERS.staff);
    await staffContext.storageState({ path: STAFF_STORAGE_STATE });
    console.log(`[Global Setup] Staff auth state saved to ${STAFF_STORAGE_STATE}`);
    await staffContext.close();

    // Setup manager user
    console.log(`[Global Setup] Setting up manager user: ${TEST_USERS.manager.email}`);
    const managerContext = await browser.newContext();
    const managerPage = await managerContext.newPage();
    setupPageLogging(managerPage, "manager");

    await createOrSignInUser(managerPage, baseURL, TEST_USERS.manager);
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
    await debugPage.screenshot({ path: path.join(AUTH_DIR, "setup-failure.png"), fullPage: true });
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
 * Attempts to sign in a user. If the user doesn't exist (detected by error message),
 * creates the user first via sign-up flow.
 */
async function createOrSignInUser(
  page: Page,
  baseURL: string,
  user: { email: string; password: string }
): Promise<void> {
  // Try sign-in first
  const signInResult = await attemptSignIn(page, baseURL, user);

  if (signInResult === "success") {
    console.log(`[Auth] User ${user.email} signed in successfully`);
    return;
  }

  if (signInResult === "user_not_found") {
    console.log(`[Auth] User ${user.email} not found in Clerk.`);
    console.log(`[Auth] Please create test users manually in Clerk Dashboard:`);
    console.log(`[Auth]   1. Go to https://dashboard.clerk.com > Your App > Users`);
    console.log(`[Auth]   2. Click "Create User" and add:`);
    console.log(`[Auth]      - Email: ${user.email}`);
    console.log(`[Auth]      - Password: ${user.password}`);
    console.log(`[Auth]   3. Ensure email+password authentication is enabled in Clerk settings`);
    throw new Error(`Test user ${user.email} does not exist. Please create it in Clerk Dashboard.`);
  }

  // If sign-in failed for other reasons, throw error
  throw new Error(`Sign-in failed for ${user.email}: ${signInResult}`);
}

/**
 * Attempts to sign in a user via Clerk's SignIn component.
 * Returns "success", "user_not_found", or an error message.
 */
async function attemptSignIn(
  page: Page,
  baseURL: string,
  user: { email: string; password: string }
): Promise<string> {
  // Navigate to sign-in page
  await page.goto(`${baseURL}/signin`, { timeout: 60000 });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(3000);

  console.log(`[Auth] Navigated to: ${page.url()}`);

  // Take screenshot before trying to find inputs
  await page.screenshot({ path: path.join(AUTH_DIR, `signin-page-${user.email.split("@")[0]}.png`), fullPage: true });

  // Find the email input field - try multiple selectors
  // Clerk and Google OAuth may use different input types
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
    await page.screenshot({ path: path.join(AUTH_DIR, `clerk-ui-${user.email.split("@")[0]}.png`), fullPage: true });
    console.log("[Auth] Email input not found, checking page structure...");
    return "email_input_not_found";
  }

  // Clear any existing value and enter email
  await inputField.click();
  await inputField.fill("");
  await inputField.fill(user.email);
  await page.waitForTimeout(500);
  console.log(`[Auth] Entered email: ${user.email}`);

  // Click continue/next button (Clerk may use "Continue" or "Next")
  const continueButton = page.locator('button:has-text("Continue"), button:has-text("Next")').first();
  if (await continueButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await continueButton.click();
    console.log("[Auth] Clicked Continue/Next button");
    await page.waitForTimeout(3000);
  }

  // Take screenshot after clicking continue
  await page.screenshot({ path: path.join(AUTH_DIR, `after-continue-${user.email.split("@")[0]}.png`), fullPage: true });

  // Check if we were redirected to Google OAuth (user not found or Google-only auth)
  const currentUrl = page.url();
  if (currentUrl.includes("accounts.google.com")) {
    console.log("[Auth] Redirected to Google OAuth - user might not exist or only Google auth is enabled");
    return "user_not_found";
  }

  // Check if we got an error message indicating user doesn't exist
  const errorSelectors = [
    '[data-clerk-error]',
    '.cl-formFieldErrorText',
    '[class*="formFieldError"]',
    '[class*="error"]',
    'p:has-text("couldn\'t find")',
    'p:has-text("not found")',
    'div:has-text("no account")',
  ];

  for (const selector of errorSelectors) {
    const errorElement = page.locator(selector).first();
    if (await errorElement.isVisible({ timeout: 1000 }).catch(() => false)) {
      const errorText = await errorElement.textContent();
      console.log(`[Auth] Error detected with selector ${selector}: ${errorText}`);
      if (errorText?.toLowerCase().includes("couldn't find") ||
          errorText?.toLowerCase().includes("not found") ||
          errorText?.toLowerCase().includes("no account") ||
          errorText?.toLowerCase().includes("doesn't exist")) {
        return "user_not_found";
      }
    }
  }

  // Enter password
  const passwordInput = page.locator('input[type="password"]').first();
  if (!(await passwordInput.isVisible({ timeout: 5000 }).catch(() => false))) {
    // Check for user not found error again with broader search
    const pageContent = await page.content();
    if (pageContent.toLowerCase().includes("couldn't find") ||
        pageContent.toLowerCase().includes("no account found") ||
        pageContent.toLowerCase().includes("doesn't exist")) {
      console.log("[Auth] User not found detected in page content");
      return "user_not_found";
    }
    await page.screenshot({ path: path.join(AUTH_DIR, `no-password-${user.email.split("@")[0]}.png`), fullPage: true });
    return "password_field_not_found";
  }

  await passwordInput.fill(user.password);
  console.log("[Auth] Entered password");

  // Click sign in / continue button
  const submitButton = page.locator('button[type="submit"], button:has-text("Continue"), button:has-text("Sign in")').first();
  await submitButton.click();
  console.log("[Auth] Clicked submit");

  // Wait for either redirect or error
  try {
    await page.waitForURL((url) => !url.pathname.includes("signin"), { timeout: 10000 });
    console.log(`[Auth] Redirected to: ${page.url()}`);
  } catch {
    // Check if there's an error message
    const errorAfterSubmit = page.locator('[data-clerk-error], .cl-formFieldErrorText, [class*="formFieldError"], [class*="alert"]').first();
    if (await errorAfterSubmit.isVisible({ timeout: 2000 }).catch(() => false)) {
      const errorText = await errorAfterSubmit.textContent();
      console.log(`[Auth] Error after submit: ${errorText}`);
      return `error: ${errorText}`;
    }
    await page.screenshot({ path: path.join(AUTH_DIR, `signin-timeout-${user.email.split("@")[0]}.png`), fullPage: true });
    return "redirect_timeout";
  }

  // Verify authentication
  if (await verifyAuthentication(page)) {
    return "success";
  }

  await page.screenshot({ path: path.join(AUTH_DIR, `auth-verify-${user.email.split("@")[0]}.png`), fullPage: true });
  return "verification_failed";
}

/**
 * Verifies that the user is authenticated by checking for authenticated UI elements.
 */
async function verifyAuthentication(page: Page): Promise<boolean> {
  await page.waitForTimeout(2000);

  // Check for UserButton or NotificationBell which indicate logged-in state
  const isAuthenticated = await page.locator('button[title="Notifications"], [data-clerk-user-button], .cl-userButtonTrigger').first()
    .isVisible({ timeout: 5000 })
    .catch(() => false);

  return isAuthenticated;
}

export default globalSetup;
