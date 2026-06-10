import { defineConfig } from "drizzle-kit";
/**
 * Drizzle ORM configuration for the Cloudflare D1 database.
 *
 * See {@link https://orm.drizzle.team/docs/drizzle-config-file}
 * See {@link https://orm.drizzle.team/llms.txt}
 */

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  casing: "snake_case",
  verbose: true,
  strict: true,
});
