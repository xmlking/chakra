import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@workspace/db";
import { betterAuth } from "better-auth";
import { captcha, testUtils } from "better-auth/plugins";
import { env } from "virtual:env/server";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  advanced: {
    database: {
      generateId: false, // 👈 Tells Better Auth to let the database handle IDs
    },
  },
  baseURL: env.VITE_BETTER_AUTH_URL,
  emailAndPassword: { enabled: true },
  plugins: [
    captcha({
      provider: "cloudflare-turnstile", // or google-recaptcha, hcaptcha, captchafox
      // secretKey: env.TURNSTILE_SECRET_KEY,
      secretKey: process.env.TURNSTILE_SECRET_KEY!,
    }),
    ...(process.env.VITEST === "true" ? [testUtils()] : []),
  ],
});
