import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const AUTH_DIR = path.join(__dirname, 'e2e', '.auth');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  // Global setup seeds test users via Clerk Backend SDK and saves authenticated state
  // Uses @clerk/backend to create users and @clerk/testing for auth
  globalSetup: './e2e/global-setup.ts',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
  },

  outputDir: './e2e/test-results',

  projects: [
    // Basic tests - no authentication required
    {
      name: 'basic',
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: /basic\.spec\.ts/,
    },
    // Setup project - runs global setup for authenticated tests
    {
      name: 'setup',
      testMatch: /global-setup\.ts/,
    },
    // Staff user tests - most tests run as staff
    {
      name: 'staff-tests',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(AUTH_DIR, 'staff.json'),
      },
      dependencies: ['setup'],
      testMatch: /.*\.spec\.ts/,
      testIgnore: [/basic\.spec\.ts/, /.*manager.*\.spec\.ts/],
    },
    // Manager user tests - for approval workflows
    {
      name: 'manager-tests',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(AUTH_DIR, 'manager.json'),
      },
      dependencies: ['setup'],
      testMatch: /.*manager.*\.spec\.ts/,
    },
  ],

  webServer: {
    command: 'bun dev --port 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
