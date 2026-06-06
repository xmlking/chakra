import { defineEnv } from "@vite-env/core";
import { z } from "zod";

/**
 * IMPORTANT
 *
 * If you update this file, remember to run root task: `vp install`
 * That trigger: `"postinstall": "vite-env types && vite-env generate"` task,
 * to regenerate: `.env.example`,  `vite-env.d.ts` files.
 */
export default defineEnv({
  server: {
    OPENROUTER_API_KEY: z.string().min(1),
    OPENROUTER_MODEL: z.string().min(1),
    GITHUB_APP_ID: z.string().min(1),
    GITHUB_APP_PRIVATE_KEY: z.string().min(1), // IMPORTANT: private keys must be in PKCS#8 format
    GITHUB_APP_WEBHOOK_SECRET: z.string().optional(),
  },
  client: {
    VITE_APP_NAME: z.string().min(3),
    VITE_CONSOLE_URL: z.url(),
    VITE_DOCS_URL: z.url(),
    VITE_WEB_URL: z.url(),
    VITE_DEBUG: z.stringbool().default(false),
    VITE_GITHUB_REPO: z.string().min(3),
    VITE_GITHUB_OWNER: z.string().min(3),
    VITE_DOCS_CATEGORY: z.string().min(3),
  },
});
