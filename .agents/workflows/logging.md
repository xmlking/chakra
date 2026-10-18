---
description: How to add useful, privacy-safe observability with evlog in Chakra's TanStack Start app
---

# Logging Workflow

Use this workflow when adding or changing server behavior, API endpoints, server functions, background tasks, or other operations where logs help diagnose production behavior. Do not add logs to every function or to presentational UI components by default.

## Logging Setup

Chakra uses `evlog` across the web app and shared server packages:

- `evlog/vite` is configured in `apps/web/vite.config.ts`. Client console capture is disabled; client events use the `/api/_evlog/ingest` transport.
- `evlog/nitro/v3` is configured in `apps/web/nitro.config.ts` to capture request-wide events. Health, ingest, asset, and build routes are excluded.
- The root TanStack Start route uses `evlogErrorHandler` to report unhandled server errors.
- A Nitro plugin identifies authenticated users for evlog request context. The app's auth middleware also tags the request synchronously where needed.
- Development logs are drained to `.evlog/logs/` (or memory in a Cloudflare Worker).

Do not add a second logging framework, a Sentry reporting path, or custom OpenTelemetry spans as part of ordinary feature work. There is no need to duplicate request-wide logging or user identification in each handler.

## 1. Use evlog for Meaningful Server Events

Import `log` from `evlog` in server-side code, including TanStack Start server functions and route handlers, Nitro plugins/tasks, and shared server packages:

```typescript
import { log } from "evlog";

log.info({ action: "order:created", orderId, organizationId });
```

Log meaningful business or operational events: a state change, an external-service interaction, a retry, or a failure that is handled locally. Include useful identifiers and safe operational context. Avoid logging routine function entry/exit or duplicating the automatic request event.

Use the appropriate level:

- `log.info` for significant successful operations.
- `log.warn` for recoverable or unusual conditions, such as a retry.
- `log.error` for failures that this code handles or cannot propagate to the app's error handler.
- `log.debug` for temporary or intentionally detailed diagnostics.

Follow the structured object style used in the app:

```typescript
log.warn({ action: "event-bus:reconnect", attempt, delayMs });
log.error({ action: "event-bus:publish", channel, error });
```

## 2. Preserve Error Semantics

Use TanStack Start's server functions, middleware, and route handlers for server work. When an error can propagate to the existing root `evlogErrorHandler`, let it propagate rather than catching it just to log and rethrow; this avoids duplicate error events.

If code handles an error locally (for example, to retry or return a controlled API response), log it once with relevant context. Do not silently swallow errors, return success-shaped fallbacks, or expose internal error details to clients. API handlers should return an appropriate HTTP status for failures.

## 3. Protect Sensitive Data

Do not log credentials, tokens, request bodies containing secrets, or unnecessary personal data. Prefer stable identifiers such as `userId`, `organizationId`, and resource IDs. The auth middleware explicitly masks email when identifying users; preserve that behavior and do not add raw email addresses to event fields.

## 4. Verify

Before finishing observability-related changes:

- [ ] Events use `evlog` structured fields and appropriate levels.
- [ ] Logs add useful context without duplicating request-wide events.
- [ ] Sensitive values are excluded.
- [ ] Errors are either propagated to the root handler or logged once when handled locally.
- [ ] API failures return an appropriate non-success HTTP status.
- [ ] Run `vp check` when code changes are included.
