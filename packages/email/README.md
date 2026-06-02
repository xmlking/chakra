# Transactional Emails

We use [Resend](https://resend.com/) to send transactional emails and fallback to SMTP.
The templates, located in `@workspace/email`, are powered by [React Email](https://react.email/) - a collection of high-quality, unstyled components for creating beautiful emails using React and TypeScript.

1. [React-email](https://resend.com/) - Emails react components
2. [Email SDK](https://email-sdk.dev/) - fallback/retry compatible **EmailClient**

## Resend Email Integration Setup Guide

### Overview

**Resend** is a modern email API built for developers. This integration replaces the console email service with real email delivery for production environments.

### Prerequisites

1. A Resend account ([Sign up here](https://resend.com/))
2. A verified domain in Resend (for production)

## Step 1: Get Your Resend API Key

1. **Sign up/Login** to [Resend](https://resend.com/)
2. **Navigate to API Keys** in your dashboard
3. **Create a new API key**:
   - Name: `astra` (or your project name)
   - Permission: `Sending access` (recommended) or `Full access`
4. **Copy the API key** - you'll need this for configuration

> [!IMPORTANT]
> ⚠️ **Important**: Store your API key securely and never commit it to version control!

## Step 2: Domain Setup (Production)

For production emails, you need to verify your domain:

1. **Add your domain** in the Resend dashboard
2. **Add DNS records** as instructed by Resend:
   - SPF record
   - DKIM record
   - DMARC record (optional but recommended)
3. **Verify the domain** once DNS propagates

> [!TIP]
> For development/testing, you can use Resend's test email address: `delivered@resend.dev`

> [!TIP]
> If you wish to use a resend account without a custom domain, you can use `onboarding@resend.dev` to send emails.

## Sending Emails

To send an email, you can use the `resend` object, which is imported from the `@repo/email` package:

```tsx title="apps/console/app/contact/actions/contact.tsx"
import { resend } from "@repo/email";

await resend.emails.send({
  from: env.EMAIL_FROM,
  // from: 'sender@acme.com',
  to: "recipient@acme.com",
  subject: "The email subject",
  text: "The email text",
});
```

## Email Templates

The `email` package is separated from the app folder for two reasons:

1. We can import the templates into the `email` app, allowing for previewing them in the UI; and
2. We can import both the templates and the SDK into our other apps and use them to send emails.

Resend and React Email play nicely together. For example, here's how you can send a transactional email using a React email template:

```tsx title="apps/console/src/actions/contact.tsx"
import { resend } from "@repo/email";
import { ContactTemplate } from "@repo/email/templates/contact";

await resend.emails.send({
  from: "sender@acme.com",
  to: "recipient@acme.com",
  subject: "The email subject",
  react: <ContactTemplate name={name} email={email} message={message} />,
});
```

## Previewing Emails

To preview the emails templates, simply run:

> Known [issue](https://github.com/resend/react-email/issues/2276)

```shell
turbo run @repo/email#dev
```

Other supported commands

```shell
turbo run @repo/email#build
turbo run @repo/email#export
turbo run @repo/email#clean
turbo run @repo/email#typecheck
```
