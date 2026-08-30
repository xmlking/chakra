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
    AI_GATEWAY_API_KEY: z.string().min(1).optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    // postgres workflow
    WORKFLOW_TARGET_WORLD: z.string().min(1).default("@workflow/world-postgres"),
    WORKFLOW_POSTGRES_URL: z.string().min(1),
    WORKFLOW_POSTGRES_JOB_PREFIX: z.string().min(1).default("chakra_job_"),
    WORKFLOW_POSTGRES_WORKER_CONCURRENCY: z.coerce.number().int().min(1).default(10),
    WORKFLOW_POSTGRES_MAX_POOL_SIZE: z.coerce.number().int().min(1).default(12),
  },
  client: {
    VITE_FF_ENABLE_DARK_MODE: z.stringbool().default(false),
  },
});
