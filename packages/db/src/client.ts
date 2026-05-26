import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "virtual:env/server";

import { relations } from "./relations";

// You can specify any property from the node-postgres connection options
// Ref: https://orm.drizzle.team/docs/connect-overview
// const pool = db.$client;

const pool = new pg.Pool({ connectionString: env.DATABASE_URL, min: 10, max: 10 });
export const db = drizzle({ client: pool, relations, logger: import.meta.env.DEV });

// export const db = drizzle({
//   connection: {
//     connectionString: env.DATABASE_URL,
//     // ssl: true,
//   },
//   schema: { ...schema },
//   casing: "snake_case",
//   logger: env.NODE_ENV === NodeEnv.DEVELOPMENT,
// });
