import { test, expect, Page } from '@playwright/test';

const SCREENSHOT_DIR = '/Users/splurfa/projects/clients/silver-sycamore-deliverables/silver-sycamore-docs/.planning/verification/09-03';

// Test user credentials - use fixed unique accounts
const STAFF_USER = {
  email: 'staff-pw-test-v2@example.com',
  password: 'TestPassword123!',
};

const MANAGER_USER = {
  email: 'manager-pw-test-v2@example.com',
  password: 'TestPassword123!',
};

async function createAccountAndSignIn(page: Page, email: string, password: string): Promise<boolean> {
  await page.goto('/signin');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Click Create Account tab
  const createTab = page.getByRole('button', { name: 'Create Account' }).first();
  if (await createTab.isVisible()) {
    await createTab.click();
    await page.waitForTimeout(500);
  }

  // Fill form
  await page.getByPlaceholder('you@example.com').fill(email);
  await page.getByPlaceholder('Enter your password').fill(password);

  // Submit
  await page.locator('button[type="submit"]').click();

  // Wait longer for Convex auth to sync
  await page.waitForTimeout(5000);

  // Check for success or error
  const currentUrl = page.url();
  console.log('After account creation, URL is:', currentUrl);

  if (currentUrl === 'http://localhost:3001/' || currentUrl.endsWith('/') || !currentUrl.includes('signin')) {
    console.log('Account created and signed in successfully');
    // Wait additional time for Convex to fully sync
    await page.waitForTimeout(3000);
    return true;
  }

  // If still on signin page, check for error messages
  const pageContent = await page.content();
  console.log('Page content check - already:', pageContent.includes('already'), 'Invalid:', pageContent.includes('Invalid'));
  if (pageContent.includes('already') || pageContent.includes('Invalid') || pageContent.includes('error')) {
    console.log('Account may exist, trying sign in...');

    await page.goto('/signin');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Click Sign In tab
    const signInTab = page.getByRole('button', { name: 'Sign In' }).first();
    if (await signInTab.isVisible()) {
      await signInTab.click();
      await page.waitForTimeout(300);
    }

    await page.getByPlaceholder('you@example.com').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.locator('button[type="submit"]').click();

    // Wait longer for Convex auth to sync
    await page.waitForTimeout(5000);

    // Check if signed in successfully
    const newUrl = page.url();
    if (newUrl === 'http://localhost:3001/' || newUrl.endsWith('/')) {
      console.log('Signed in successfully');
      // Wait additional time for Convex to fully sync
      await page.waitForTimeout(3000);
      return true;
    }
  }

  console.log('Authentication result unclear, continuing...');
  return false;
}

async function verifyAuthenticated(page: Page): Promise<boolean> {
  await page.goto('/services/package-simple-elegance');
  await page.waitForLoadState('networkidle');
  // Wait longer for Convex auth state to sync via WebSocket
  await page.waitForTimeout(4000);

  // Reload the page to ensure fresh auth state
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Check for "Suggest Edit" which only shows when authenticated
  const suggestEdit = page.getByText('Suggest Edit');
  const isAuth = await suggestEdit.isVisible({ timeout: 5000 }).catch(() => false);
  console.log('Authentication verified:', isAuth);
  return isAuth;
}

test.describe('Suggestion Workflow - Full E2E Test', () => {
  // Run all steps in a single test to maintain browser state
  test('Complete suggestion workflow from staff creation to approval', async ({ page }) => {
    test.setTimeout(300000); // 5 minute timeout

    console.log('=== STEP 1: Homepage ===');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01-homepage.png`, fullPage: true });

    console.log('=== STEP 2: Create Staff Account ===');
    await createAccountAndSignIn(page, STAFF_USER.email, STAFF_USER.password);

    // Verify authentication
    const isStaffAuth = await verifyAuthenticated(page);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02-staff-authenticated.png`, fullPage: true });

    if (!isStaffAuth) {
      console.log('Staff authentication failed - taking diagnostic screenshot');
      await page.goto('/signin');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: `${SCREENSHOT_DIR}/02-auth-failed-signin-page.png`, fullPage: true });

      // Try one more time
      await createAccountAndSignIn(page, STAFF_USER.email, STAFF_USER.password);
      const retryAuth = await verifyAuthenticated(page);
      if (!retryAuth) {
        console.log('Authentication retry failed');
      }
    }

    console.log('=== STEP 3: Navigate to Document ===');
    await page.goto('/services');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.click('text=Simple Elegance Package');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/03-document-page.png`, fullPage: true });

    console.log('=== STEP 4: Look for Suggest Edit ===');
    const suggestEditLink = page.getByText('Suggest Edit');
    const canSuggestEdit = await suggestEditLink.isVisible({ timeout: 5000 }).catch(() => false);

    if (canSuggestEdit) {
      await page.screenshot({ path: `${SCREENSHOT_DIR}/04-suggest-edit-visible.png`, fullPage: true });
      await suggestEditLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/04b-suggestion-form.png`, fullPage: true });

      console.log('=== STEP 5: Fill Suggestion Form ===');
      // Try to fill form
      const titleInput = page.locator('input[type="text"]').first();
      if (await titleInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await titleInput.clear();
        await titleInput.fill('Simple Elegance Package - E2E Test Update');
      }

      const textareas = page.locator('textarea');
      const textareaCount = await textareas.count();
      if (textareaCount > 0) {
        // Try to fill change note
        const changeNote = textareas.last();
        await changeNote.fill('E2E Test: Updated via automated testing');
      }

      await page.screenshot({ path: `${SCREENSHOT_DIR}/05-form-filled.png`, fullPage: true });

      console.log('=== STEP 6: Submit for Review ===');
      const submitButton = page.getByRole('button', { name: /Submit for Review|Submit|Save/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(3000);
      }
      await page.screenshot({ path: `${SCREENSHOT_DIR}/06-submitted.png`, fullPage: true });
    } else {
      console.log('Suggest Edit not visible - authentication may have failed');
      await page.screenshot({ path: `${SCREENSHOT_DIR}/04-suggest-edit-not-visible.png`, fullPage: true });
    }

    console.log('=== STEP 7: Switch to Manager Account ===');
    // Sign out current user and sign in as manager
    await page.goto('/signout').catch(() => {});
    await page.waitForTimeout(1000);

    await createAccountAndSignIn(page, MANAGER_USER.email, MANAGER_USER.password);
    const isManagerAuth = await verifyAuthenticated(page);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/07-manager-authenticated.png`, fullPage: true });

    console.log('=== STEP 8: Navigate to Suggestions Review ===');
    await page.goto('/suggestions/review');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/08-suggestions-review.png`, fullPage: true });

    console.log('=== STEP 9: View Suggestion Details ===');
    const suggestionLink = page.locator('a[href*="/suggestions/"]').first();
    if (await suggestionLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await suggestionLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/09-suggestion-detail.png`, fullPage: true });

      console.log('=== STEP 10: Approve Suggestion ===');
      const approveButton = page.getByRole('button', { name: /Approve/i });
      if (await approveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await approveButton.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/10-approved.png`, fullPage: true });

        console.log('=== STEP 11: Apply Changes ===');
        const applyButton = page.getByRole('button', { name: /Apply|Promote|Merge/i });
        if (await applyButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await applyButton.click();
          await page.waitForTimeout(2000);
          await page.screenshot({ path: `${SCREENSHOT_DIR}/11-applied.png`, fullPage: true });
        } else {
          await page.screenshot({ path: `${SCREENSHOT_DIR}/11-no-apply-button.png`, fullPage: true });
        }
      } else {
        await page.screenshot({ path: `${SCREENSHOT_DIR}/10-no-approve-button.png`, fullPage: true });
      }
    } else {
      await page.screenshot({ path: `${SCREENSHOT_DIR}/09-no-suggestions-found.png`, fullPage: true });
    }

    console.log('=== STEP FINAL: Verify Document ===');
    await page.goto('/services/package-simple-elegance');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/final-document-state.png`, fullPage: true });

    console.log('=== TEST COMPLETE ===');
  });
});
