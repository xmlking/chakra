import { defineEnv } from "@vite-env/core";
import { preset as db } from "@workspace/db/env";
import { z } from "zod";

/**
 * IMPORTANT
 *
 * If you update this file, remember to run root task: `vp install`
 * That trigger: `"postinstall": "vite-env types && vite-env generate"` task,
 * to regenerate: `.env.example`,  `vite-env.d.ts` files.
 */
export default defineEnv({
  presets: [db],
  server: {
    CONTACT_EMAIL: z.email(),
  },
  client: {
    VITE_APP_NAME: z.string().min(3),
    VITE_CONSOLE_URL: z.url(),
  },
});
