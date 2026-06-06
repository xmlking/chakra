import { betterAuth } from "better-auth";
import { captcha } from "better-auth/plugins";
import { env } from "virtual:env/server";

export const auth = betterAuth({
  plugins: [
    captcha({
      provider: "cloudflare-turnstile", // or google-recaptcha, hcaptcha, captchafox
      secretKey: env.TURNSTILE_SECRET_KEY,
    }),
  ],
});
