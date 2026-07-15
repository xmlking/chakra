# DB

**Data Access Layer** with [Drizzle ORM](https://orm.drizzle.team/) and Postgres Database.

## Setup

Drizzle Kit ships installable [Agent Skills](https://skills.sh/) amd MCP for AI coding assistants

Install in your project's root:

```shell
bunx drizzle-kit skills
```

Or use MCP

```shell
bunx drizzle-kit mcp
```

## Development

- Run the unit tests:

```bash
vp test packages/db
```

- Build the library:

```bash
vp build packages/db
```

## Database

Start Database and other docker services

```shell
# Start database
docker compose up

# Stop database after use.
docker compose down

# (Danger) you can remove all data and reset database with:
docker compose down -v
```

### DB Schema Setup

To generate Database schema (one-time)

> [!NOTE]
> if you get `We've found duplicated index name across public schema` error for `generate` commands,
> you have to remove generated file: `packages/db/src/schema/copy_me_auth.ts` and rerun.

```shell
# `for first time`, generating schema, use `--name=init`
rm -fR packages/db/drizzle
vp run @workspace/db#generate --name=init
# `for first time`, generate empty migration file
# to write your own custom SQL functions/DDL
vp run @workspace/db#generate --custom --name=extra
#  Generate migrations for subsequent schema changes
vp run @workspace/db#generate
```

To apply `migrations` to local database and `seed` sample data

```shell
# Apply migrations to local database
vp run @workspace/db#migrate
# Apply migrations to local database
vp run @workspace/db#seed
```

Start DB Viewer App to see the data

```shell
vp run @workspace/db#studio
```

### Production Database Setup

To Apply `migrations` and `seeds` in production env (i.e., `.env.production`)

```shell
NODE_ENV=production turbo run @workspace/db#migrate
NODE_ENV=production turbo run @workspace/db#seed
NODE_ENV=production turbo run @workspace/db#studio
```
