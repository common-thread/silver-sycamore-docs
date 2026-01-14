import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display document library title', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Silver Sycamore Document Library/i })).toBeVisible();
  });

  test('should show category grid', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Browse Documents')).toBeVisible();
  });

  test('should have working category links', async ({ page }) => {
    await page.goto('/');
    const servicesLink = page.locator('a').filter({ hasText: 'Services' }).first();
    await expect(servicesLink).toBeVisible();
  });
});
