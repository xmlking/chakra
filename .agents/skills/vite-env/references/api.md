# API Reference

## Exports from `@vite-env/core`

| Export                | From                     | Purpose                                |
| --------------------- | ------------------------ | -------------------------------------- |
| `defineEnv()`         | `@vite-env/core`         | Define env schema with Zod             |
| `defineStandardEnv()` | `@vite-env/core`         | Define env schema with Standard Schema |
| `ViteEnv()`           | `@vite-env/core/plugin`  | Vite plugin (default export)           |
| `vercel`              | `@vite-env/core/presets` | Vercel platform preset (~27 vars)      |
| `railway`             | `@vite-env/core/presets` | Railway platform preset (~18 vars)     |
| `netlify`             | `@vite-env/core/presets` | Netlify platform preset (~16 vars)     |

## Type Inference from Zod

The plugin inspects Zod schemas at build-time and generates precise TypeScript types in `vite-env.d.ts`:

| Zod Schema                                | Generated Type             |
| ----------------------------------------- | -------------------------- |
| `z.string()`                              | `readonly KEY: string`     |
| `z.url()`                                 | `readonly KEY: string`     |
| `z.coerce.number()`                       | `readonly KEY: number`     |
| `z.stringbool()`                          | `readonly KEY: boolean`    |
| `z.enum(['a', 'b'])`                      | `readonly KEY: 'a' \| 'b'` |
| `z.string().optional()`                   | `readonly KEY?: string`    |
| `z.string().default('x')`                 | `readonly KEY: string`     |
| `z.coerce.number().int().min(1).max(100)` | `readonly KEY: number`     |

## Virtual Modules

### `virtual:env/client`

Exports a frozen object containing only `VITE_`-prefixed variables. Safe for browser bundles.

```typescript
// Generated module shape
export const env: Readonly<{
  VITE_API_URL: string;
  VITE_APP_NAME: string;
  VITE_DEBUG: boolean;
}>;
```

### `virtual:env/server`

Exports a frozen object containing all validated variables (server + client). Guarded from client environments.

```typescript
// Generated module shape
export const env: Readonly<{
  DATABASE_URL: string;
  JWT_SECRET: string;
  VITE_API_URL: string;
  VITE_APP_NAME: string;
  VITE_DEBUG: boolean;
}>;
```

## Plugin Lifecycle

The plugin hooks into Vite's build lifecycle:

1. **`configResolved`** — loads `env.ts` via jiti
2. **`buildStart`** — loads `.env*` files, validates schema, generates `vite-env.d.ts`
3. **`resolveId`** — intercepts `virtual:env/*` imports, checks access permissions
4. **`load`** — serves virtual module contents as frozen objects
5. **`generateBundle`** (client builds only) — scans chunks for server value leaks
6. **`configureServer`** (dev only) — watches `.env*` files, revalidates with HMR

## Leak Detection

Runs at `generateBundle` on client builds only:

- Scans all output chunks for server variable **values**
- Fails the build if a match is found (value must be ≥ 8 characters)
- Skips short values (< 8 chars) to avoid false positives
- Skips non-string values (numbers, booleans)

## Access Protection Modes

Controls what happens when `virtual:env/server` is imported from a client environment:

| Mode      | Behavior                                                       |
| --------- | -------------------------------------------------------------- |
| `'error'` | Hard build failure                                             |
| `'warn'`  | Build succeeds, exit code 1, writes `vite-env-warnings.log`    |
| `'stub'`  | Returns a module that throws at runtime (for isomorphic files) |

Default is `'warn'` (changes to `'error'` in 1.0.0).

## Dev Mode Behavior

- Watches `.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local`
- 150ms debounce on file changes
- Revalidates schema on change
- Invalidates virtual modules + triggers full page reload on success
- Non-fatal warning on validation failure (dev server keeps running)

## `defineEnv()` Shape

```typescript
defineEnv({
  presets?: EnvPreset[],    // Platform presets (vercel, railway, netlify)
  server: {                 // Server-only variables (no VITE_ prefix)
    [key: string]: ZodType,
  },
  client: {                 // Client variables (VITE_ prefix required)
    [key: string]: ZodType,
  },
})
```

## `defineStandardEnv()` Shape

```typescript
defineStandardEnv({
  server: {
    [key: string]: StandardSchemaV1, // Valibot, ArkType, etc.
  },
  client: {
    [key: string]: StandardSchemaV1,
  },
})
```

Note: presets are not supported with Standard Schema definitions.
