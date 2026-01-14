import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Silver Sycamore/);
  });

  test('should navigate to all main sections', async ({ page }) => {
    await page.goto('/');

    // Test Services link
    await page.getByRole('link', { name: 'Services' }).first().click();
    await expect(page).toHaveURL(/\/services/);

    // Test Clients link
    await page.getByRole('link', { name: 'Clients' }).first().click();
    await expect(page).toHaveURL(/\/clients/);

    // Test Staff link
    await page.getByRole('link', { name: 'Staff' }).first().click();
    await expect(page).toHaveURL(/\/staff/);

    // Test Operations link
    await page.getByRole('link', { name: 'Operations' }).first().click();
    await expect(page).toHaveURL(/\/operations/);
  });

  test('should show breadcrumbs on category pages', async ({ page }) => {
    await page.goto('/services');
    await expect(page.locator('nav').filter({ hasText: 'Home' })).toBeVisible();
  });
});
