# Auth

## Role model

- `superAdmin`: global application administrator; not an organization member role.
- `admin`: organization administrator/member role.
- `owner`: organization owner.
- `member`: organization member.

Use Better Auth's admin permission API for global `superAdmin` permissions and
the organization permission API for `admin`, `owner`, and `member` permissions.

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
bunx auth@latest generate --config packages/auth/src/index.ts --output packages/db/src/schema/copy_me_auth.ts -y
```

Tests

> [!IMPORTANT]
> database should be up for tests. start: `docker compose up`

```shell
vp test packages/auth
```

## Plugins

- [better-auth-referral](https://github.com/marinedotsh/better-auth-referral) - A Better Auth plugin for adding user referrals to your app.
