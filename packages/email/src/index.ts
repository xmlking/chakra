import { createEmailClient, EmailValidationError, type EmailMessage } from "@opencoredev/email-sdk";
import { resend } from "@opencoredev/email-sdk/resend";
import { smtp } from "@opencoredev/email-sdk/smtp";
import { log } from "evlog";
import { render } from "react-email";

import { ENV } from "../env";

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
function createClient() {
  const { RESEND_API_KEY } = ENV;
  if (!RESEND_API_KEY) {
    throw new EmailValidationError("Resend email is not configured: set RESEND_API_KEY.");
  }

  return createEmailClient({
    telemetry: false,
    adapters: [
      resend({ apiKey: ENV.RESEND_API_KEY! }),
      smtp({
        host: ENV.SMTP_HOST!,
        port: ENV.SMTP_PORT!,
        ...(ENV.SMTP_USER &&
          ENV.SMTP_PASS && {
            auth: {
              user: ENV.SMTP_USER,
              pass: ENV.SMTP_PASS,
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
        log.info({
          source: "email",
          action: "attempt",
          adapter: event.adapter,
          attempt: event.attempt,
        });
      },
      onRetry(event) {
        log.warn({
          source: "email",
          action: "retry",
          adapter: event.adapter,
          nextAttempt: event.nextAttempt,
        });
      },
      onError(event) {
        log.error({
          source: "email",
          action: "error",
          adapter: event.adapter,
          error: event.error,
        });
      },
      afterSend(event) {
        // Graph answers 202 with no message id; Exchange message trace is the
        // way to follow the message past that point.
        log.info({
          source: "email",
          action: "sent",
          adapter: event.adapter,
        });
      },
    },
  });
}

let client: ReturnType<typeof createClient> | undefined;

/**
 * Builds the MS Graph client on first send rather than at import, so modules that only import
 * `sendMail` (and the tests and CI runs that load them without MS Graph config) don't throw.
 */
export const email = {
  send: (...args: Parameters<ReturnType<typeof createClient>["send"]>) =>
    (client ??= createClient()).send(...args),
};

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
