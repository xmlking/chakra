import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "virtual:env/server";

import * as relations from "./relations";
// oxlint-disable-next-line react-doctor/no-barrel-import
import * as schema from "./schema";

// You can specify any property from the node-postgres connection options
// Ref: https://orm.drizzle.team/docs/connect-overview
// const pool = db.$client;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  min: env.DB_POOL_MIN,
  max: env.DB_POOL_MAX,
  ssl: env.DB_POOL_SSL,
});
export const db = drizzle({
  client: pool,
  schema: { ...schema, ...relations },
  casing: "snake_case",
  logger: import.meta.env.DEV,
});

export * from "drizzle-orm";
