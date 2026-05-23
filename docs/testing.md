# Playwright Tests

This directory contains end-to-end tests for the website using Playwright with TypeScript.

## Running Tests

### Basic Commands

```shell
# Run all tests
bun test

# Run tests with UI mode (interactive)
bun test:ui

# Run tests in headed mode (see browser)
bun test:headed

# Run tests in debug mode
bun test:debug

# Show test report
bun test:report
```

### Running Specific Tests

```shell
# Run a specific test file
bun test tests/home.spec.ts

# Run tests matching a pattern
bun test --grep "home page"

# Run tests in a specific browser
bun test --project=chromium
```

## Test Structure

- `example.spec.ts` - Basic example tests
- `home.spec.ts` - Home page functionality tests

## Writing Tests

Tests are written in TypeScript and use Playwright's testing framework. Each test file should:

1. Import `test` and `expect` from `@playwright/test`
2. Use descriptive test names
3. Include proper assertions
4. Handle async operations correctly

### Example Test Structure

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should do something", async ({ page }) => {
    // Test implementation
    await expect(page.locator("selector")).toBeVisible();
  });
});
```

## Configuration

The Playwright configuration is in `playwright.config.ts` at the root of the project. It includes:

- Test directory: `./tests`
- Base URL: `http://localhost:5173`
- Browser configurations for Chromium, Firefox, and WebKit
- Web server setup to start the dev server before tests

## Best Practices

1. Use semantic selectors (data-testid, role, etc.) when possible
2. Write tests that are independent and can run in any order
3. Use descriptive test names that explain what is being tested
4. Group related tests using `test.describe()`
5. Use `test.beforeEach()` for common setup
6. Keep tests focused and avoid testing multiple things in one test
