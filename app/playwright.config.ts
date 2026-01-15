import { defineConfig, devices } from '@playwright/test';

// Check if we're running notification tests specifically (static tests don't need server)
const isStaticTestOnly = process.argv.includes('notifications.spec.ts');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  // Global setup creates test users and saves authenticated state
  // Skip for static-only tests to avoid Clerk initialization errors
  globalSetup: isStaticTestOnly ? undefined : './e2e/global-setup.ts',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
    // Pre-authenticated state from global-setup.ts
    // Only use when global setup is enabled
    ...(isStaticTestOnly ? {} : { storageState: './e2e/.auth/user.json' }),
  },
  outputDir: './e2e/test-results',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Skip webServer for static-only tests
  ...(isStaticTestOnly
    ? {}
    : {
        webServer: {
          command: 'bun dev --port 3001',
          url: 'http://localhost:3001',
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
        },
      }),
});
