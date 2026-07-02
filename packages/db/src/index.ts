import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "virtual:env/server";

import { relations } from "./relations";
import { authRelations } from "./schema/auth";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  min: env.DB_POOL_MIN,
  max: env.DB_POOL_MAX,
  ssl: env.DB_POOL_SSL,
});
export const db = drizzle({
  client: pool,
  relations: { ...relations, ...authRelations },
  logger: import.meta.env.DEV,
  jit: true,
});

export * from "drizzle-orm";
