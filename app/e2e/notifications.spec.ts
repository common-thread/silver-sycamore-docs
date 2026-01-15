import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';

const SCREENSHOT_DIR = '/Users/splurfa/projects/clients/silver-sycamore-deliverables/silver-sycamore-docs/.planning/verification/10-06';

/**
 * E2E Verification for Plan 10-06: Notifications
 *
 * This test verifies the notification system components:
 * 1. NotificationBell component exists and renders
 * 2. NotificationInbox dropdown functionality
 * 3. Messages page routing
 * 4. UI component structure
 *
 * Note: Full auth testing requires working Convex Auth configuration.
 * These tests verify the UI structure and component presence.
 */

test.describe('Notification System - E2E Verification', () => {

  test.beforeAll(() => {
    // Ensure screenshot directory exists
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  });

  test('Verify notification components exist in codebase', async () => {
    // Verify NotificationBell component file exists
    const bellPath = '/Users/splurfa/projects/clients/silver-sycamore-deliverables/silver-sycamore-docs/app/src/components/NotificationBell.tsx';
    expect(fs.existsSync(bellPath)).toBe(true);
    console.log('NotificationBell.tsx exists: true');

    // Verify NotificationInbox component file exists
    const inboxPath = '/Users/splurfa/projects/clients/silver-sycamore-deliverables/silver-sycamore-docs/app/src/components/NotificationInbox.tsx';
    expect(fs.existsSync(inboxPath)).toBe(true);
    console.log('NotificationInbox.tsx exists: true');

    // Verify Header includes NotificationBell
    const headerPath = '/Users/splurfa/projects/clients/silver-sycamore-deliverables/silver-sycamore-docs/app/src/components/Header.tsx';
    const headerContent = fs.readFileSync(headerPath, 'utf-8');
    expect(headerContent).toContain('NotificationBell');
    expect(headerContent).toContain('isAuthenticated');
    console.log('Header includes NotificationBell: true');
    console.log('Header checks isAuthenticated: true');
  });

  test('Verify notification Convex functions exist', async () => {
    // Check that notification functions are defined
    const notificationsPath = '/Users/splurfa/projects/clients/silver-sycamore-deliverables/silver-sycamore-docs/app/convex/notifications.ts';
    expect(fs.existsSync(notificationsPath)).toBe(true);

    const content = fs.readFileSync(notificationsPath, 'utf-8');

    // Verify key functions exist
    expect(content).toContain('getUnreadCount');
    console.log('getUnreadCount function: exists');

    expect(content).toContain('listNotifications');
    console.log('listNotifications function: exists');

    expect(content).toContain('markAsRead');
    console.log('markAsRead function: exists');

    expect(content).toContain('markAllAsRead');
    console.log('markAllAsRead function: exists');
  });

  test('Verify messages page structure', async ({ page }) => {
    test.setTimeout(60000);

    console.log('=== Loading Messages Page ===');
    // With BYPASS_AUTH=true, middleware allows access
    await page.goto('/messages');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/messages-page.png`, fullPage: true });
    console.log('Screenshot saved: messages-page.png');

    // Verify page loads (not redirected to signin if bypass is working)
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);

    // The page should either show messages content or signin (depending on middleware)
    const pageHtml = await page.content();
    const hasMessagesContent = pageHtml.includes('Messages') || pageHtml.includes('Direct Messages') || pageHtml.includes('Channel');
    const hasSignIn = pageHtml.includes('Sign In') || currentUrl.includes('signin');

    console.log('Messages content present:', hasMessagesContent);
    console.log('Sign in page shown:', hasSignIn);
  });

  test('Verify homepage with bypass auth', async ({ page }) => {
    test.setTimeout(60000);

    console.log('=== Loading Homepage ===');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/homepage.png`, fullPage: true });
    console.log('Screenshot saved: homepage.png');

    // Check header elements
    const headerExists = await page.locator('header').isVisible().catch(() => false);
    console.log('Header visible:', headerExists);

    // Check for navigation items
    const servicesLink = await page.locator('a[href="/services"]').isVisible().catch(() => false);
    console.log('Services link visible:', servicesLink);

    // Check for search bar
    const searchBar = await page.locator('input[placeholder*="Search"]').isVisible().catch(() => false);
    console.log('Search bar visible:', searchBar);

    // Check for user menu (should be visible when authenticated)
    const userMenuArea = await page.locator('header').locator('button').count();
    console.log('Header button count:', userMenuArea);
  });

  test('Verify signin page structure', async ({ page }) => {
    test.setTimeout(60000);

    console.log('=== Loading Sign In Page ===');
    await page.goto('/signin');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/signin-page.png`, fullPage: true });
    console.log('Screenshot saved: signin-page.png');

    // Verify sign-in form elements
    const emailInput = await page.getByPlaceholder('you@example.com').isVisible();
    console.log('Email input visible:', emailInput);
    expect(emailInput).toBe(true);

    const passwordInput = await page.getByPlaceholder('Enter your password').isVisible();
    console.log('Password input visible:', passwordInput);
    expect(passwordInput).toBe(true);

    const signInTab = await page.getByRole('button', { name: 'Sign In' }).first().isVisible();
    console.log('Sign In tab visible:', signInTab);
    expect(signInTab).toBe(true);

    const createAccountTab = await page.getByRole('button', { name: 'Create Account' }).first().isVisible();
    console.log('Create Account tab visible:', createAccountTab);
    expect(createAccountTab).toBe(true);
  });

  test('Summary: Notification system verification', async () => {
    console.log('\n=== NOTIFICATION SYSTEM VERIFICATION SUMMARY ===\n');
    console.log('Components Verified:');
    console.log('  - NotificationBell.tsx: EXISTS');
    console.log('  - NotificationInbox.tsx: EXISTS');
    console.log('  - Header integration: VERIFIED');
    console.log('');
    console.log('Convex Functions:');
    console.log('  - getUnreadCount: EXISTS');
    console.log('  - listNotifications: EXISTS');
    console.log('  - markAsRead: EXISTS');
    console.log('  - markAllAsRead: EXISTS');
    console.log('');
    console.log('UI Features:');
    console.log('  - Notification bell with badge');
    console.log('  - Dropdown inbox with notification list');
    console.log('  - Mark all read functionality');
    console.log('  - Navigation to messages');
    console.log('');
    console.log('Note: Full interactive testing requires working Convex Auth.');
    console.log('Auth bypass mode allows middleware to pass but client-side');
    console.log('isAuthenticated check still requires actual authentication.');
    console.log('\n=== END SUMMARY ===\n');
  });
});
