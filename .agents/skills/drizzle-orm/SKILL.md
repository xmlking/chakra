---
name: drizzle-orm
description: Use when defining Drizzle ORM schemas, writing queries, setting up the database client, or adding new tables in a PostgreSQL project.
license: MIT
metadata:
  author: pyyupsk
  version: "1.0"
---

# Drizzle ORM

Type-safe ORM patterns for PostgreSQL with Drizzle.

## Schema Structure

One file per table under `src/db/schema/`, re-export all from `index.ts`:

```tree
src/
├── index.ts          # singleton db instance
└── schema/
    ├── index.ts      # export * from each table file
    ├── users.ts
    └── posts.ts
```

```ts
// src/db/schema/index.ts
export * from "./users";
export * from "./posts";
```

## Naming

| Layer       | Convention        | Example      |
| ----------- | ----------------- | ------------ |
| DB table    | plural snake_case | `blog_posts` |
| TS variable | camelCase         | `blogPosts`  |
| DB column   | snake_case        | `user_id`    |
| TS column   | camelCase         | `userId`     |

## Reusable Timestamps

```ts
export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
};

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  ...timestamps,
});
```

## Enum Pattern

`as const` array — never TypeScript enums:

```ts
export const userRoles = ["admin", "user", "moderator"] as const;
export const userRoleEnum = pgEnum("user_role", userRoles);
```

## Type Inference

Always infer — never define manually:

```ts
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

## Query Style

- `db.query` (RQB) — relation queries with `with:`
- `db.select` — custom projections or complex joins

## Singleton DB Instance

```ts
// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Database = PostgresJsDatabase<typeof schema>;

let database: Database | undefined;

function getDb(): Database {
  if (!database) {
    database = drizzle(postgres(process.env.DATABASE_URL!), { schema });
  }
  return database;
}

export const db = getDb();
```

## Common Mistakes

- Defining types manually instead of using `$inferSelect` / `$inferInsert`
- Using TypeScript `enum` instead of `as const` array for pgEnum
- Forgetting `$onUpdateFn` on `updatedAt` — Drizzle won't auto-update it
- Creating `db` per-request — always use the lazy singleton
