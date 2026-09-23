import { varlockVitePlugin } from "@varlock/vite-integration";
import { workflow as workflowTest } from "@workflow/vitest";
import {
  RECOMMENDED_RULES,
  TANSTACK_QUERY_RULES,
  TANSTACK_START_RULES,
} from "oxlint-plugin-react-doctor";
import { /*configDefaults,*/ configDefaults, defineConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";

const reactDoctorRules = {
  ...RECOMMENDED_RULES,
  ...TANSTACK_QUERY_RULES,
  ...TANSTACK_START_RULES,
};

const ignorePatterns = [
  "TODO/**",
  "CHANGELOG.md",
  ".agents/skills",
  ".claude/skills",
  "apps/*/env.ts",
  "packages/*/env.ts",
  "**/src/routeTree.gen.ts",
  "packages/db/drizzle/**",
  "apps/web/src/lib/gen/**",
  "packages/ui/src/hooks/**",
  "packages/ui/src/lib/auth/**",
  "packages/ui/src/hooks/**",
  "packages/ui/src/components/**",
  "!packages/ui/src/components/form/**",
  "!packages/ui/src/components/sumo/**",
  "packages/ui/src/styles/**",
];
export default defineConfig({
  staged: {
    "*.{js,ts,jsx,tsx,vue,svelte,json,jsonc,css,md,mdx}": "vp check --fix",
    // Fail the commit if any resolved sensitive value appears in a staged file.
    // The root schema declares no secrets, so the app schemas are the entry points.
    "*": " varlock scan --staged --path apps/web/ --path apps/docs/",
  },
  fmt: {
    sortPackageJson: {
      sortScripts: true,
    },
    sortImports: {
      ignoreCase: true,
      newlinesBetween: true,
      order: "asc",
    },
    sortTailwindcss: {
      // stylesheet: "./apps/web/src/app/globals.css",
      stylesheet: "./packages/ui/src/styles/globals.css",
      attributes: ["class", "className"],
      functions: ["clsx", "cn"],
    },
    ignorePatterns,
  },
  lint: {
    options: { typeAware: true, typeCheck: true },
    plugins: [
      "typescript",
      "oxc",
      "react",
      "react-perf",
      "node",
      "import",
      "vitest",
      "jsx-a11y",
      "promise",
    ],
    jsPlugins: [
      { name: "react-doctor", specifier: "oxlint-plugin-react-doctor" },
      { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
    ],
    categories: {
      correctness: "error",
    },
    env: {
      builtin: true,
    },
    settings: {
      react: {
        version: "19.2.6",
      },
      tailwindcss: {
        callees: ["clsx", "cva", "cn"],
      },
    },
    rules: {
      ...reactDoctorRules,
      "no-default-export": "error",
      "vite-plus/prefer-vite-plus-imports": "error",
      "react/only-export-components": [
        "warn",
        {
          allowExportNames: ["Route", "loader", "meta", "links", "headers", "action"],
          customHOCs: ["createFileRoute", "createLazyFileRoute", "createRootRouteWithContext"],
        },
      ],
    },
    overrides: [
      {
        files: ["apps/*/src/router.tsx", "apps/*/src/server.ts", "*.config.ts", "*.config.ts"],
        rules: {
          "no-default-export": "off",
        },
      },
      {
        files: ["apps/*/src/routes/**/*.{ts,tsx}"],
        rules: {
          "react-doctor/only-export-components": "off",
        },
      },
      {
        files: ["packages/email/emails/**/*.tsx"],
        rules: {
          "import/no-default-export": "off",
        },
      },
    ],
    ignorePatterns,
  },
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    // Vitest v4 compatibility: keep separate Vite servers for inline projects.
    // Remove when plugins and config hooks can run once for shared projects.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#inline-projects-share-the-vite-server-by-default
    sharedViteServer: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/{src,tests}/**/*.{test,spec,stories}.{ts,tsx}",
        "packages/ui/src/components/**",
        "packages/email/.react-email/**",
      ],
    },
    exclude: ["**/.react-email/*"],
    projects: [
      {
        // Vitest v4 compatibility: keep this inline project independent of the root config.
        // Remove to inherit root options, including plugins and setup files.
        // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
        // https://vitest.dev/guide/migration/#inline-projects-inherit-the-root-config-by-default
        extends: false,
        plugins: [varlockVitePlugin({ rootDir: "apps/web" }), workflowTest()],
        test: {
          // Vitest v4 compatibility: preserve mock call history.
          // Remove after tests no longer rely on calls from setup or earlier tests.
          // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
          // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
          clearMocks: false,
          name: "server",
          include: ["**/{src,tests}/**/*.{test,spec}.ts"],
          includeSource: ["packages/shared/{src,tests}/**/*.{js,ts}"],
          exclude: [
            ...configDefaults.exclude,
            "**/{src,tests}/**/*.{test,spec}.tsx",
            "**/.react-email/*",
          ],
          environment: "node",
          // setupFiles: ["tests/test-setup.ts"],
        },
      },
      {
        // Vitest v4 compatibility: keep this inline project independent of the root config.
        // Remove to inherit root options, including plugins and setup files.
        // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
        // https://vitest.dev/guide/migration/#inline-projects-inherit-the-root-config-by-default
        extends: false,
        test: {
          // Vitest v4 compatibility: preserve mock call history.
          // Remove after tests no longer rely on calls from setup or earlier tests.
          // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
          // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
          clearMocks: false,
          name: "browser",
          include: ["**/{src,tests}/**/*.{test,spec}.tsx"],
          exclude: [
            ...configDefaults.exclude,
            "**/{src,tests}/**/*.{test,spec}.ts",
            "**/.react-email/*",
          ],
          browser: {
            locators: {
              // Vitest v4 compatibility: keep partial, case-insensitive locator matching.
              // Remove after updating locators for full, case-sensitive matches.
              // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
              // https://vitest.dev/guide/migration/#locators-are-strict-by-default
              exact: false,
            },
            enabled: true,
            headless: !!process.env.CI,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
          // globalSetup: ["tests/test-global-setup.ts"],
        },
      },
    ],
  },
  run: {
    cache: true,
    tasks: {
      "docs:dev": {
        command: "vp run docs#dev",
        dependsOn: [{ task: "build", from: ["dependencies", "devDependencies"] }],
      },
      "docs:build": {
        command: "vp run docs#build",
        dependsOn: [{ task: "build", from: ["dependencies", "devDependencies"] }],
      },
    },
  },
});
