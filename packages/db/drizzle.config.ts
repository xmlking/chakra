import { defineConfig } from "drizzle-kit";

/**
 * Drizzle ORM configuration for the Cloudflare D1 database.
 *
 * See {@link https://orm.drizzle.team/docs/drizzle-config-file}
 * See {@link https://orm.drizzle.team/llms.txt}
 *
 * drizzle-kit runs outside Vite, so start it via `varlock run -- drizzle-kit …`
 * (see package.json scripts) for ENV to be populated.
 */
import { ENV } from "./env";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.DATABASE_URL,
  },
  schemaFilter: ["public"],
  verbose: true,
  strict: true,
});
