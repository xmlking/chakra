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
  },
  client: {
    VITE_APP_NAME: z.string().min(3),
    VITE_CONSOLE_URL: z.url(),
    VITE_DOCS_URL: z.url(),
    VITE_WEB_URL: z.url(),
    VITE_DEBUG: z.stringbool().default(false),
  },
});
