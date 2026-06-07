# Auth

## Commands

Update `better-auth` database schema, whenever auth config changed

> will generate `packages/db/src/schema/copy_me_auth.ts`, very and copy it to `auth.ts`

```shell
vp run @workspace/auth#generate-schema
```

Alternative way to generate updated `better-auth` database schema, run from product **root**:

```shell
bunx @better-auth/cli@latest generate --config packages/auth/src/index.ts --output packages/db/src/schema/copy_me_auth.ts -y
```

Tests

```shell
vp test packages/auth
```
