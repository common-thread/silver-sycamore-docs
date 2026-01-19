/**
 * Screenshot all pages in the app and collect console errors
 *
 * Run with: bunx playwright test screenshot-pages.ts --config=screenshot-pages.config.ts
 * Or standalone: bun run screenshot-pages.ts
 */

import { chromium, type ConsoleMessage } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, '..', '.planning', 'screenshots');

// Static routes that don't require dynamic params
const STATIC_ROUTES = [
  { path: '/', name: 'home' },
  { path: '/events', name: 'events' },
  { path: '/services', name: 'services' },
  { path: '/operations', name: 'operations' },
  { path: '/procedures', name: 'procedures' },
  { path: '/references', name: 'references' },
  { path: '/checklists', name: 'checklists' },
  { path: '/guides', name: 'guides' },
  { path: '/workspace', name: 'workspace' },
  { path: '/workspace/shared', name: 'workspace-shared' },
  { path: '/catalog', name: 'catalog' },
  { path: '/style-guide', name: 'style-guide' },
  { path: '/components', name: 'components' },
  { path: '/signin', name: 'signin' },
  { path: '/suggestions', name: 'suggestions' },
  { path: '/suggestions/new', name: 'suggestions-new' },
  { path: '/suggestions/review', name: 'suggestions-review' },
  { path: '/clients', name: 'clients' },
  { path: '/deliverables', name: 'deliverables' },
  { path: '/deliverables/recipe-app', name: 'deliverables-recipe-app' },
  { path: '/deliverables/wedding-app', name: 'deliverables-wedding-app' },
  { path: '/staff', name: 'staff' },
  { path: '/brand', name: 'brand' },
  { path: '/brand/recipe-app', name: 'brand-recipe-app' },
  { path: '/brand/wedding-app', name: 'brand-wedding-app' },
];

interface PageResult {
  route: string;
  name: string;
  status: 'success' | 'error' | 'redirect';
  screenshotPath?: string;
  consoleErrors: string[];
  consoleWarnings: string[];
  networkErrors: string[];
  loadTime: number;
  finalUrl?: string;
  httpStatus?: number;
}

async function screenshotAllPages() {
  // Ensure screenshot directory exists
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  console.log(`\n========================================`);
  console.log(`Screenshot Pages Script`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Output: ${SCREENSHOT_DIR}`);
  console.log(`========================================\n`);

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  const results: PageResult[] = [];

  for (const route of STATIC_ROUTES) {
    const page = await context.newPage();
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];
    const networkErrors: string[] = [];

    // Collect console messages
    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    // Collect network errors
    page.on('requestfailed', (request) => {
      networkErrors.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText}`);
    });

    const url = `${BASE_URL}${route.path}`;
    console.log(`Visiting: ${route.path}`);

    const startTime = Date.now();
    let httpStatus: number | undefined;

    try {
      const response = await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      httpStatus = response?.status();
      const loadTime = Date.now() - startTime;
      const finalUrl = page.url();

      // Wait a bit more for any dynamic content
      await page.waitForTimeout(1000);

      // Take screenshot
      const screenshotName = `${route.name}.png`;
      const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      const isRedirect = finalUrl !== url && !finalUrl.startsWith(url);

      results.push({
        route: route.path,
        name: route.name,
        status: isRedirect ? 'redirect' : 'success',
        screenshotPath: screenshotName,
        consoleErrors,
        consoleWarnings,
        networkErrors,
        loadTime,
        finalUrl: isRedirect ? finalUrl : undefined,
        httpStatus,
      });

      const statusIcon = consoleErrors.length > 0 ? '!' : (isRedirect ? '->' : 'OK');
      console.log(`  [${statusIcon}] ${loadTime}ms - HTTP ${httpStatus}${isRedirect ? ` -> ${finalUrl}` : ''}`);

      if (consoleErrors.length > 0) {
        console.log(`  Console errors: ${consoleErrors.length}`);
      }

    } catch (error) {
      const loadTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      results.push({
        route: route.path,
        name: route.name,
        status: 'error',
        consoleErrors: [errorMessage, ...consoleErrors],
        consoleWarnings,
        networkErrors,
        loadTime,
        httpStatus,
      });

      console.log(`  [ERROR] ${errorMessage}`);
    }

    await page.close();
  }

  await browser.close();

  // Generate report
  generateReport(results);

  return results;
}

function generateReport(results: PageResult[]) {
  console.log(`\n========================================`);
  console.log(`SUMMARY REPORT`);
  console.log(`========================================\n`);

  const successful = results.filter(r => r.status === 'success');
  const redirected = results.filter(r => r.status === 'redirect');
  const errors = results.filter(r => r.status === 'error');
  const withConsoleErrors = results.filter(r => r.consoleErrors.length > 0);

  console.log(`Total pages: ${results.length}`);
  console.log(`Successful: ${successful.length}`);
  console.log(`Redirected: ${redirected.length}`);
  console.log(`Failed: ${errors.length}`);
  console.log(`With console errors: ${withConsoleErrors.length}`);

  if (errors.length > 0) {
    console.log(`\n--- FAILED PAGES ---`);
    for (const result of errors) {
      console.log(`\n${result.route}:`);
      for (const error of result.consoleErrors) {
        console.log(`  - ${error}`);
      }
    }
  }

  if (redirected.length > 0) {
    console.log(`\n--- REDIRECTED PAGES ---`);
    for (const result of redirected) {
      console.log(`${result.route} -> ${result.finalUrl}`);
    }
  }

  if (withConsoleErrors.length > 0) {
    console.log(`\n--- PAGES WITH CONSOLE ERRORS ---`);
    for (const result of withConsoleErrors) {
      if (result.status !== 'error') {
        console.log(`\n${result.route} (${result.consoleErrors.length} errors):`);
        for (const error of result.consoleErrors.slice(0, 5)) {
          console.log(`  - ${error.substring(0, 150)}${error.length > 150 ? '...' : ''}`);
        }
        if (result.consoleErrors.length > 5) {
          console.log(`  ... and ${result.consoleErrors.length - 5} more`);
        }
      }
    }
  }

  // Write JSON report
  const reportPath = path.join(SCREENSHOT_DIR, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);
  console.log(`Screenshots saved to: ${SCREENSHOT_DIR}/`);
}

// Run the script
screenshotAllPages().catch(console.error);
