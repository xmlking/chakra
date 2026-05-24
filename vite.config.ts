import { RECOMMENDED_RULES, TANSTACK_START_RULES } from "oxlint-plugin-react-doctor";
import { /*configDefaults,*/ defineConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";

const reactDoctorRules = {
  ...RECOMMENDED_RULES,
  ...TANSTACK_START_RULES,
};

export default defineConfig({
  staged: {
    "*": "vp check --fix",
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
      // stylesheet: "./apps/console/src/app/globals.css",
      stylesheet: "./packages/ui/src/styles/globals.css",
      attributes: ["class", "className"],
      functions: ["clsx", "cn"],
    },
    ignorePatterns: [
      "TODO/**",
      "CHANGELOG.md",
      ".agents/skills",
      "**/src/routeTree.gen.ts",
      "packages/db/drizzle/**",
      "apps/console/src/lib/gen/**",
      "apps/web/src/components/ui/**",
      "packages/ui/src/components/**",
      "!packages/ui/src/components/form/**",
      "!packages/ui/src/components/sumo/**",
      "packages/ui/src/styles/**",
    ],
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
    jsPlugins: [{ name: "react-doctor", specifier: "oxlint-plugin-react-doctor" }],
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
    },
    overrides: [
      {
        files: ["apps/*/src/router.tsx", "apps/*/src/server.ts", "*.config.ts"],
        rules: {
          "no-default-export": "off",
        },
      },
    ],
    ignorePatterns: [
      "**/node_modules/**",
      "**/dist/**",
      "TODO/**",
      "CHANGELOG.md",
      "**/*.lock",
      ".agents/skills",
      "**/src/routeTree.gen.ts",
      "packages/db/drizzle/**",
      "apps/console/src/lib/gen/**",
      "apps/web/src/components/ui/**",
      "packages/ui/src/components/**",
      "!packages/ui/src/components/form/**",
      "!packages/ui/src/components/sumo/**",
      "packages/ui/src/styles/**",
    ],
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/src/**/*.{test,spec,stories}.{ts,tsx}",
        "apps/web/src/icons/**",
        "packages/ui/src/components/**",
      ],
    },
    projects: [
      {
        test: {
          name: "server",
          include: ["**/src/**/*.{test,spec}.ts"],
          // exclude: [...configDefaults.exclude, "src/**/*.{test,spec}.tsx"],
          environment: "node",
          // setupFiles: ["src/test-setup.ts"],
        },
      },
      {
        test: {
          name: "browser",
          include: ["**/src/**/*.{test,spec}.tsx"],
          browser: {
            enabled: true,
            headless: !!process.env.CI,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
          // globalSetup: ["src/test-global-setup.ts"],
        },
      },
    ],
  },
  run: {
    cache: true,
  },
});
