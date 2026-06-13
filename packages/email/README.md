# Transactional Emails

This is usually where you store transactional email related code of your application to organize and simplify things.
This also allows for using the email templates you make anywhere on your codebase by just installing with the monorepo setup.

The `email` package is separated from the app folder for two reasons:

1. We can import the templates into the `email` app, allowing for previewing them in the UI; and
2. We can import both the templates and the SDK into our other apps and use them to send emails.

## SDK

1. [React-email](https://react.email/) - Provides collection of high-quality, unstyled react components for creating beautiful emails using React and TypeScript.
2. [Email SDK](https://email-sdk.dev/) - One email SDK for every provider. Retry transient failures without changing code.

The templates, located in `@workspace/email`, are powered by [React Email](https://react.email/)

We use [Email SDK](https://email-sdk.dev/) to send transactional emails which internally use [Resend](https://resend.com/) and fallback to SMTP.

## Providers

1. [Resend](https://resend.com/)
2. [SMTP](https://datatracker.ietf.org/doc/html/rfc5321)
3. [Cloudflare Email Sending](https://developers.cloudflare.com/email-service/)

## Usage

Resend and React Email play nicely together. For example, here's how you can send a transactional email using a React email template:

```tsx title="apps/web/src/actions/contact.tsx"
import { email } from "@workspace/email";
import { VercelInviteUserEmail } from "@workspace/email/vercel-invite-user";
import { render } from "react-email";

const html = await render(<VercelInviteUserEmail />);

const message = {
  from: "Acme <hello@acme.com>",
  to: "user@example.com",
  subject: "Welcome",
  html: html,
};

await email.send(message, {
  adapter: "resend",
  fallbackAdapters: ["smtp"],
});

const result = await email.send(
  {
    from: "Acme <hello@acme.com>",
    to: [{ email: "user@example.com", name: "Ada" }],
    cc: "billing@example.com",
    replyTo: "support@example.com",
    subject: "Welcome",
    html: "<p>Your workspace is ready.</p>",
    headers: {
      "X-Template": "welcome",
    },
    tags: [{ name: "type", value: "welcome" }],
    attachments: [
      {
        filename: "welcome.txt",
        content: "Welcome to Acme.",
        contentType: "text/plain",
      },
    ],
  },
  {
    idempotencyKey: "welcome:user_123",
  },
);

console.log(result.provider, result.messageId);
```

## Previewing Emails

A live preview right in your browser so you don't need to keep sending real emails during development.

To preview the emails templates, simply run:

> Known [issue](https://github.com/resend/react-email/issues/2276)

```shell
vp run @workspace/email#dev
```

Other supported commands

```shell
vp run @workspace/email#build
vp run @workspace/email#export
vp run @workspace/email#clean
vp run @workspace/email#cli --help
```

## Email-SDK CLI

```shell
bun run --filter @workspace/email cli version
bun run --filter @workspace/email cli doctor --adapter resend

bun run --filter @workspace/email cli send \
  --adapter resend \
  --from "Acme <hello@acme.com>" \
  --to "user@example.com" \
  --subject "Hello" \
  --text "It works" \
  --dry-run
```

## Add better-auth email templates

To `add/update` **better-auth-ui** email `templates`, run the following commands:

```shell
cd packages/email
# better-auth-ui email templates
bunx shadcn@latest add  -p emails https://better-auth-ui.com/r/email-verification-email.json
bunx shadcn@latest add  -p emails https://better-auth-ui.com/r/magic-link-email.json
bunx shadcn@latest add  -p emails https://better-auth-ui.com/r/reset-password-email.json
bunx shadcn@latest add  -p emails https://better-auth-ui.com/r/password-changed-email.json
bunx shadcn@latest add  -p emails https://better-auth-ui.com/r/email-changed-email.json
bunx shadcn@latest add  -p emails https://better-auth-ui.com/r/otp-email.json
bunx shadcn@latest add  -p emails https://better-auth-ui.com/r/new-device-email.json
bunx shadcn@latest add  -p emails https://better-auth-ui.com/r/organization-invitation-email.json
```
