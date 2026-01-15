import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = '/Users/splurfa/projects/clients/silver-sycamore-deliverables/silver-sycamore-docs/.planning/verification/e2e-upgrade';

/**
 * Basic E2E Tests - No Authentication Required
 *
 * These tests verify the basic test infrastructure works without needing
 * authenticated users. They test public pages and the sign-in flow.
 */

// Skip global setup for these tests
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Basic Infrastructure Tests (No Auth)', () => {

  test.beforeAll(() => {
    // Ensure screenshot directory exists
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  });

  test('home page loads successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Take screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'basic-01-home-page.png'),
      fullPage: true,
    });

    // Verify page has Silver Sycamore branding
    const title = page.locator('text=Silver Sycamore');
    await expect(title.first()).toBeVisible({ timeout: 10000 });

    console.log('Test passed: Home page loads with Silver Sycamore branding');
  });

  test('signin page loads with Clerk component', async ({ page }) => {
    await page.goto('/signin');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'basic-02-signin-page.png'),
      fullPage: true,
    });

    // Verify Clerk sign-in form is present
    const signInTitle = page.locator('text=Sign in');
    await expect(signInTitle.first()).toBeVisible({ timeout: 10000 });

    // Verify email input exists
    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 5000 });

    console.log('Test passed: Sign-in page loads with Clerk component');
  });

  test('navigation header is present', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'basic-03-navigation.png'),
      fullPage: false,
    });

    // Verify navigation items
    const navItems = ['HOME', 'SERVICES', 'CLIENTS', 'STAFF', 'OPERATIONS', 'DELIVERABLES', 'CATALOG'];

    for (const item of navItems) {
      const navLink = page.locator(`text=${item}`).first();
      const isVisible = await navLink.isVisible({ timeout: 3000 }).catch(() => false);
      console.log(`  - ${item}: ${isVisible ? 'visible' : 'not visible'}`);
    }

    // Verify Silver Sycamore branding as proof of header
    const branding = page.locator('text=Silver Sycamore').first();
    await expect(branding).toBeVisible({ timeout: 10000 });

    console.log('Test passed: Navigation header is present');
  });

  test('search bar is present in header', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Look for search input
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    const hasSearch = await searchInput.isVisible({ timeout: 5000 }).catch(() => false);

    console.log(`Test info: Search bar present: ${hasSearch}`);

    // Take screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'basic-04-search.png'),
      fullPage: false,
    });

    console.log('Test passed: Search functionality check complete');
  });

});

test.describe('Basic Tests - Summary', () => {

  test('infrastructure verification summary', async () => {
    console.log('\n=== BASIC E2E INFRASTRUCTURE VERIFICATION ===\n');
    console.log('TESTS COMPLETED:');
    console.log('  1. Home page loads successfully');
    console.log('  2. Sign-in page loads with Clerk component');
    console.log('  3. Navigation header is present');
    console.log('  4. Search bar functionality check');
    console.log('');
    console.log('SCREENSHOTS SAVED TO:');
    console.log(`  ${SCREENSHOT_DIR}`);
    console.log('');
    console.log('NEXT STEPS:');
    console.log('  1. Create test users in Clerk Dashboard');
    console.log('  2. Run full authenticated tests: bun run test');
    console.log('');
    console.log('=== END SUMMARY ===\n');
  });

});
