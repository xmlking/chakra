import { defineEnv, type EnvPreset } from "@vite-env/core";
import { z } from "zod";

export const preset = {
  server: {
    DATABASE_URL: z.url(),
    DB_POOL_MIN: z.coerce.number().int().min(1).max(200).default(10),
    DB_POOL_MAX: z.coerce.number().int().min(1).max(200).default(10),
    DB_POOL_SSL: z.stringbool().default(false),
    BETTER_AUTH_ADMINS: z
      .string()
      .transform((s) => s.split(","))
      .pipe(z.array(z.uuidv7()).min(1)),
    BETTER_AUTH_ADMIN_EMAIL: z.email(),
    BETTER_AUTH_ADMIN_PASSWORD: z.string(),
    SHARED_ORGANIZATION_ID: z.uuidv7(),
  },
} as const satisfies EnvPreset;

export default defineEnv({
  ...preset,
});
