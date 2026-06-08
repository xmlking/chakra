import { defineConfig } from "drizzle-kit";
/**
 * Drizzle ORM configuration for the Cloudflare D1 database.
 *
 * See {@link https://orm.drizzle.team/docs/drizzle-config-file}
 * See {@link https://orm.drizzle.team/llms.txt}
 */
import { env } from "virtual:env/server";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
