import { migrate } from "drizzle-orm/postgres-js/migrator";

import { db } from "../src";

const pool = db.$client;

async function run() {
  if (!process.env.DB_MIGRATING) {
    throw new Error('You must set DB_MIGRATING to "true" when running migrations');
  }

  console.log("⏳ Running migrations...");

  console.time("🌱 Database migrated");
  await migrate(db, { migrationsFolder: "../drizzle" });
  console.timeEnd("🌱 Database migrated");
}

try {
  await run();
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  await pool.end();
}
