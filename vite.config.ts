import { defineConfig } from "vite-plus";

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
      "**/node_modules/**",
      "**/dist/**",
      "TODO/**",
      "CHANGELOG.md",
      "**/*.lock",
      "**/turbo.jsonc",
      ".agents/skills",
      "packages/db/drizzle/**",
      "apps/console/src/lib/gen/**",
      "apps/web/src/components/ui/**",
      "packages/ui/src/components/ai-elements/**",
      "packages/ui/src/components/better-upload/**",
      "packages/ui/src/components/diceui/**",
      "packages/ui/src/components/magicui/**",
      "packages/ui/src/components/reui/**",
      "packages/ui/src/components/shadcn/**",
      "packages/ui/src/components/tiptap/**",
      "packages/ui/src/components/voice/**",
      "packages/ui/src/components/flowkit-ui",
      "packages/ui/src/styles/**",
    ],
  },
  lint: {
    options: { typeAware: true, typeCheck: true },
    plugins: ["typescript", "react", "import", "vitest"],
    categories: {},
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
    ignorePatterns: [
      "**/node_modules/**",
      "**/dist/**",
      "TODO/**",
      "CHANGELOG.md",
      "**/*.lock",
      "**/turbo.jsonc",
      ".agents/skills",
      "packages/db/drizzle/**",
      "apps/console/src/lib/gen/**",
      "apps/web/src/components/ui/**",
      "packages/ui/src/components/ai-elements/**",
      "packages/ui/src/components/better-upload/**",
      "packages/ui/src/components/diceui/**",
      "packages/ui/src/components/magicui/**",
      "packages/ui/src/components/reui/**",
      "packages/ui/src/components/shadcn/**",
      "packages/ui/src/components/tiptap/**",
      "packages/ui/src/components/voice/**",
      "packages/ui/src/components/flowkit-ui",
      "packages/ui/src/styles/**",
    ],
  },
  run: {
    cache: true,
  },
});
