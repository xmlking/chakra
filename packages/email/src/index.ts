import { createEmailClient, type EmailMessage } from "@opencoredev/email-sdk";
import { resend } from "@opencoredev/email-sdk/resend";
import { smtp } from "@opencoredev/email-sdk/smtp";
import { render } from "react-email";
import { env } from "virtual:env/server";

/**
 * Usage:
 *
 *  await email.send(message, {
 *    adapter: "resend",
 *    fallback: { adapters: ["smtp"] },
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
      ...(env.SMTP_USER &&
        env.SMTP_PASS && {
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          },
        }),
    }),
  ],
  retry: {
    maxAttempts: 2,
  },
  defaultAdapter: "resend",
  fallback: {
    adapters: ["smtp"],
  },
  hooks: {
    beforeSend(event) {
      console.log("email.attempt", event.adapter, event.attempt);
    },
    onRetry(event) {
      console.warn("email.retry", event.adapter, event.nextAttempt);
    },
    onError(event) {
      console.error("email.error", event.adapter, event.error);
    },
    afterSend(event) {
      console.log("email.sent", event.adapter, event.response.id);
    },
  },
});

type EmailMessageWithReactBase = Omit<EmailMessage, "html" | "text">;

type EmailMessageWithReact = EmailMessageWithReactBase &
  (
    | { react: React.ReactNode; html?: string; text?: string }
    | { react?: never; html: string; text?: string }
    | { react?: never; html?: never; text: string }
  );

// Helper functions
export async function sendMail(payload: EmailMessageWithReact): Promise<void> {
  const { react, html: payloadHtml, text: payloadText, ...rest } = payload;

  let html: string | undefined;
  if (react) {
    html = await render(react);
  } else if (payloadHtml) {
    html = payloadHtml;
  } else if (payloadText) {
    html = payloadText;
  }

  const message: EmailMessage = {
    ...rest,
    text: payloadText ?? "",
    html: html ?? "",
  };

  await email.send(message);
}

// Ref: https://email-sdk.dev/docs/reference/errors
export {
  type EmailMessage,
  EmailValidationError,
  EmailAdapterNotFoundError,
  EmailAdapterError,
  EmailSdkError,
} from "@opencoredev/email-sdk";
