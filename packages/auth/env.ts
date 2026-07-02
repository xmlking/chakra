import { defineEnv, type EnvPreset } from "@vite-env/core";
import { preset as db } from "@workspace/db/env";
import { preset as email } from "@workspace/email/env";
import { z } from "zod";

export const preset = {
  client: {
    VITE_APP_NAME: z.string().min(3),
    VITE_BETTER_AUTH_URL: z.url(),
    VITE_GOOGLE_CLIENT_ID: z.string().optional(),
    VITE_TURNSTILE_ENABLED: z.stringbool().default(false),
    VITE_TURNSTILE_SITE_KEY: z.string(),
  },
  server: {
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_JWT_EXPIRATION_TIME: z.string().default("30m"),

    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),

    MICROSOFT_CLIENT_ID: z.string().optional(),
    MICROSOFT_CLIENT_SECRET: z.string().optional(),
    MICROSOFT_TENANT_ID: z.string().optional(),

    TURNSTILE_SECRET_KEY: z.string(),
  },
} as const satisfies EnvPreset;

export default defineEnv({
  presets: [db, email],
  ...preset,
});
