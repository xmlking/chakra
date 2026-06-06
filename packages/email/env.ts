import { defineEnv, type EnvPreset } from "@vite-env/core";
import { z } from "zod";

export const preset = {
  server: {
    // Your verified sending domain (e.g., notifications@yourdomain.com)
    // Must be a verified domain in your Resend dashboard
    EMAIL_FROM: z.email().default("onboarding@resend.dev"),
    // Where contact form submissions should be sent
    CONTACT_EMAIL: z.email().optional(), // e.g., "team@yourdomain.com",
    // User for testing only, without sending to real user's email
    EMAIL_TO: z.email().default("delivered@resend.dev"),

    // Your Resend API key (get it from https://resend.com/api-keys)
    RESEND_API_KEY: z.string().optional(), // e.g., "re_xxxxxxxxx"
    // Webhook signing secret (get it from https://resend.com/webhooks)
    RESEND_WEBHOOK_SECRET: z.string().optional(), // e.g., "whsec_xxxxxxxxx"
    // Audience ID for contacts/segments examples (get from https://resend.com/audiences)
    RESEND_AUDIENCE_ID: z.string().optional(),
    //Template ID for template examples (get from https://resend.com/templates)
    RESEND_TEMPLATE_ID: z.string().optional(),
    // Redirect URL for double opt-in confirmation
    CONFIRM_REDIRECT_URL: z.url().optional(), // e.g., "https://yourdomain.com/confirm"

    // Sendgrid server config - required only if you use Sendgrid as an email provider
    SENDGRID_API_KEY: z.string().optional(),
    // Plunk server config - required only if you use Plunk as an email provider
    PLUNK_API_KEY: z.string().optional(),
    // Postmark server config - required only if you use Postmark as an email provider
    POSTMARK_API_KEY: z.string().optional(),

    // SMTP server config
    SMTP_HOST: z.string(), // e.g., "smtp.resend.com"
    SMTP_PORT: z.coerce.number().min(1).max(65535), // 587 (465 if secure: true)
    SMTP_SECURE: z.stringbool().default(false),
    SMTP_USER: z.string().optional(), // e.g., "resend"
    SMTP_PASS: z.string().optional(), // RESEND_API_KEY
  },
} as const satisfies EnvPreset;

export default defineEnv({
  ...preset,
});
