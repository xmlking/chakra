---
name: vite-env
description: Use when adding env variables to a Vite project, setting up env validation, debugging env errors, or importing from virtual:env/*. Provides type-safe env with build-time leak detection.
license: MIT
metadata:
  author: pyyupsk
  version: "1.0"
---

# vite-env

Type-safe environment variable management for Vite 8. Define once in `env.ts`, import typed values from `virtual:env/client` and `virtual:env/server`.

## When to Activate

- User asks to add, modify, or remove environment variables in a Vite project
- Project has `@vite-env/core` in dependencies
- User references `virtual:env/client` or `virtual:env/server`
- User wants env validation, type safety, or leak detection
- User is migrating from raw `import.meta.env` to typed env
- Build fails with env validation or leak detection errors

## Setup Workflow

When setting up vite-env in a new project, follow these steps in order:

### Step 1 — Install

```bash
bun add @vite-env/core
bun add -d zod
```

For Standard Schema (Valibot) instead of Zod:

```bash
bun add @vite-env/core valibot
```

### Step 2 — Create `env.ts` at project root

```typescript
import { defineEnv } from "@vite-env/core";
import { z } from "zod";

export default defineEnv({
  server: {
    DATABASE_URL: z.url(),
    JWT_SECRET: z.string().min(32),
  },
  client: {
    VITE_API_URL: z.url(),
    VITE_APP_NAME: z.string().min(1),
  },
});
```

### Step 3 — Register the plugin

```typescript
// vite.config.ts
import ViteEnv from "@vite-env/core/plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [ViteEnv()],
});
```

### Step 4 — Start dev server to generate types

```bash
bun run dev
```

This generates `vite-env.d.ts` automatically. Commit this file.

## Adding a New Environment Variable

1. **Decide scope** — is it a server secret or client-visible?
2. **Add to `env.ts`:**
   - Server vars → `server` object, **no** `VITE_` prefix
   - Client vars → `client` object, **must** have `VITE_` prefix
3. **Add the value** to `.env` (or `.env.local` for secrets)
4. **Import** from the correct virtual module:
   - Client code → `import { env } from 'virtual:env/client'`
   - Server/SSR code → `import { env } from 'virtual:env/server'`
5. **Restart dev server** — types regenerate automatically

## Common Workflows

### Using platform presets

```typescript
import { defineEnv } from "@vite-env/core";
import { vercel } from "@vite-env/core/presets"; // also: railway, netlify

export default defineEnv({
  presets: [vercel],
  server: { ... },
  client: { ... },
});
```

Presets add platform-injected vars (e.g. `VERCEL_URL`, `VERCEL_ENV`). User definitions override preset values.

### Using Standard Schema (Valibot)

```typescript
import { defineStandardEnv } from "@vite-env/core";
import * as v from "valibot";

export default defineStandardEnv({
  server: {
    DATABASE_URL: v.pipe(v.string(), v.url()),
  },
  client: {
    VITE_API_URL: v.pipe(v.string(), v.url()),
  },
});
```

### CLI commands (no dev server needed)

```bash
vite-env check       # Validate env against schema
vite-env generate    # Generate .env.example from schema
vite-env types       # Regenerate vite-env.d.ts
```

## Common Pitfalls

### Client vars MUST have `VITE_` prefix

```typescript
// ✗ WRONG — will not be available in client
client: {
  API_URL: z.url(),
}

// ✓ CORRECT
client: {
  VITE_API_URL: z.url(),
}
```

### Server vars MUST NOT have `VITE_` prefix

```typescript
// ✗ WRONG — secrets with VITE_ prefix leak to client bundle
server: {
  VITE_DATABASE_URL: z.url(),
}

// ✓ CORRECT
server: {
  DATABASE_URL: z.url(),
}
```

### Never import `virtual:env/server` in client code

```typescript
// ✗ WRONG — triggers access protection
// src/components/App.vue
import { env } from "virtual:env/server";

// ✓ CORRECT — use client module
import { env } from "virtual:env/client";
```

### Don't access env via `import.meta.env` when vite-env is set up

```typescript
// ✗ WRONG — bypasses validation, untyped
const url = import.meta.env.VITE_API_URL;

// ✓ CORRECT — validated and typed
import { env } from "virtual:env/client";
const url = env.VITE_API_URL;
```

### Missing `.env` value fails the build

If a required variable is missing, the build fails with a validation error. Either:

- Add the value to `.env`
- Mark it optional in schema: `z.string().optional()`
- Provide a default: `z.string().default('fallback')`

## Plugin Options

```typescript
ViteEnv({
  configFile: "./env.ts", // path to env definition
  serverEnvironments: ["ssr"], // environments allowed to import virtual:env/server
  onClientAccessOfServerModule: "warn", // 'error' | 'warn' | 'stub'
});
```

## Environment Variable Priority

```text
1. process.env          (CI secrets always win)
2. .env.[mode].local
3. .env.[mode]
4. .env.local
5. .env
```

## References

- [API Reference](references/api.md) — full type inference rules, plugin hooks, and module structure
