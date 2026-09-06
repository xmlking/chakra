import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { ENV } from "../env";
import { DrizzleQueryLogger } from "./logger";
import { relations } from "./relations";
import { authRelations } from "./schema/auth";

const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  min: ENV.DB_POOL_MIN,
  max: ENV.DB_POOL_MAX,
  ssl: ENV.DB_POOL_SSL,
});
export const db = drizzle({
  client: pool,
  relations: { ...relations, ...authRelations },
  logger: process.env.NODE_ENV !== "production" ? new DrizzleQueryLogger() : false,
  jit: true,
});

export * from "drizzle-orm";
