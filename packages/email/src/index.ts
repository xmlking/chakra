import { createEmailClient } from "@opencoredev/email-sdk";
import { resend } from "@opencoredev/email-sdk/resend";
import { smtp } from "@opencoredev/email-sdk/smtp";
import { env } from "virtual:env/server";

/**
 * Usage:
 *
 *  await email.send(message, {
 *    adapter: "resend",
 *    fallbackAdapters: ["smtp"],
 *    idempotencyKey: "receipt:order_123",
 *  })
 *
 */
export const email = createEmailClient({
  adapters: [
    resend({ apiKey: env.RESEND_API_KEY! }),
    smtp({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER!,
        pass: env.SMTP_PASS!,
      },
    }),
  ],
  retry: {
    retries: 1,
  },
  defaultAdapter: "resend",
  fallback: ["smtp"],
  hooks: {
    beforeSend(event) {
      console.log("email.attempt", event.provider, event.attempt);
    },
    onRetry(event) {
      console.warn("email.retry", event.provider, event.nextAttempt);
    },
    onError(event) {
      console.error("email.error", event.provider, event.error);
    },
    afterSend(event) {
      console.log("email.sent", event.provider, event.response.id);
    },
  },
});

// Ref: https://email-sdk.dev/docs/reference/errors
export {
  EmailMessage,
  EmailValidationError,
  EmailProviderNotFoundError,
  EmailProviderError,
  EmailSdkError,
} from "@opencoredev/email-sdk";
