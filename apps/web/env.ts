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
    CONTACT_EMAIL: z.email(),
  },
  client: {
    VITE_APP_NAME: z.string().min(3),
    VITE_APP_URL: z.url(),
  },
});
