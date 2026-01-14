import { test, expect } from '@playwright/test';

test.describe('Documents', () => {
  test('services page should load', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByRole('heading', { name: /Services/i })).toBeVisible();
  });

  test('clients page should load', async ({ page }) => {
    await page.goto('/clients');
    await expect(page.getByRole('heading', { name: /Clients/i })).toBeVisible();
  });

  test('staff page should load', async ({ page }) => {
    await page.goto('/staff');
    await expect(page.getByRole('heading', { name: /Staff/i })).toBeVisible();
  });

  test('operations page should load', async ({ page }) => {
    await page.goto('/operations');
    await expect(page.getByRole('heading', { name: /Operations/i })).toBeVisible();
  });

  test('deliverables page should load', async ({ page }) => {
    await page.goto('/deliverables');
    await expect(page.getByRole('heading', { name: /Deliverables/i })).toBeVisible();
  });

  test('catalog page should load', async ({ page }) => {
    await page.goto('/catalog');
    await expect(page.getByRole('heading', { name: /Catalog/i })).toBeVisible();
  });
});
