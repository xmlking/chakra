import { defineEnv } from "@vite-env/core";
import { preset as auth } from "@workspace/auth/env";
import { preset as db } from "@workspace/db/env";
import { preset as email } from "@workspace/email/env";
import { preset as storage } from "@workspace/storage/env";
import { z } from "zod";

/**
 * IMPORTANT
 *
 * If you update this file, remember to run root task: `vp install`
 * That trigger: `"postinstall": "vite-env types && vite-env generate"` task,
 * to regenerate: `.env.example`,  `vite-env.d.ts` files.
 */
export default defineEnv({
  presets: [db, email, auth, storage],
  server: {
    OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY cannot be empty").startsWith("sk-"),
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
  },
  client: {
    VITE_FF_ENABLE_DARK_MODE: z.stringbool().default(false),
  },
});
