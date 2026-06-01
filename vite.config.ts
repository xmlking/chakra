import {
  RECOMMENDED_RULES,
  TANSTACK_QUERY_RULES,
  TANSTACK_START_RULES,
} from "oxlint-plugin-react-doctor";
import { /*configDefaults,*/ defineConfig } from "vite-plus";
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
  "**/vite-env.d.ts",
  "**/src/routeTree.gen.ts",
  "packages/db/drizzle/**",
  "apps/console/src/lib/gen/**",
  "apps/web/src/components/ui/**",
  "packages/ui/src/components/**",
  "!packages/ui/src/components/form/**",
  "!packages/ui/src/components/sumo/**",
  "packages/ui/src/styles/**",
  "apps/docs/waku.config.ts",
  // "apps/docs/src/routes/__root.tsx",
  // "apps/docs/src/components/ai/search.tsx",
  // "apps/docs/src/routes/docs/$.tsx",
];
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
          allowExportNames: ["Route"],
        },
      ],
    },
    overrides: [
      {
        files: ["apps/*/src/router.tsx", "apps/*/src/server.ts", "*.config.ts", "env.ts"],
        rules: {
          "no-default-export": "off",
        },
      },
    ],
    ignorePatterns,
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/{src,tests}/**/*.{test,spec,stories}.{ts,tsx}",
        "apps/web/src/icons/**",
        "packages/ui/src/components/**",
      ],
    },
    projects: [
      {
        test: {
          name: "server",
          include: ["**/{src,tests}/**/*.{test,spec}.ts"],
          includeSource: ["packages/shared/{src,tests}/**/*.{js,ts}"],
          // exclude: [...configDefaults.exclude, "**/{src,tests}/**/*.{test,spec}.tsx"],
          environment: "node",
          // setupFiles: ["tests/test-setup.ts"],
        },
      },
      {
        test: {
          name: "browser",
          include: ["**/{src,tests}/**/*.{test,spec}.tsx"],
          browser: {
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
      "web:dev": {
        command: "vp dev apps/web",
        dependsOn: ["@workspace/i18n#build"],
      },
    },
  },
});
