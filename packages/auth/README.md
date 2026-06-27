# Auth

## Commands

Update `better-auth` database schema, whenever auth config changed

> will generate `packages/db/src/schema/copy_me_auth.ts`
> Diff and copy it to `auth.ts`
> We replace `pg_catalog.gen_random_uuid()` with `uuidv7()` in `packages/db/src/schema/copy_me_auth.ts` before copy to `auth.ts`

```shell
vp run @workspace/auth#generate-schema
```

Alternative way to generate updated `better-auth` database schema, run from product **root**:

```shell
bunx @better-auth/cli@latest generate --config packages/auth/src/index.ts --output packages/db/src/schema/copy_me_auth.ts -y
```

Tests

> [!IMPORTANT]
> database should be up for tests. start: `docker compose up`

```shell
vp test packages/auth
```
