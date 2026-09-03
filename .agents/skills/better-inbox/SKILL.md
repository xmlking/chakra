---
name: better-inbox
description: Use the better-inbox Better Auth plugin for in-app notifications. Covers server setup, client setup, React UI, notification sending, organization fan-out, session-scoped reads/mutations, useInbox, and notification schema/indexing.
---

# better-inbox

`better-inbox` is a Better Auth plugin for in-app notifications. Notifications are stored as rows in the application's own database through the Better Auth adapter. Notifications can be addressed to a Better Auth user or fan-out to members of a Better Auth organization.

## When to use

Use this skill when implementing or reviewing:

- Better Auth in-app notifications
- Notification creation from server code
- User  or organization scoped notification delivery
- Notification inbox/list/read/unread functionality
- The `better-inbox` React components or `useInbox` hook
- Notification pagination, polling, or optimistic read state
- Database indexing for notifications

## Installation and server setup

Install:

```bash
npm install better-inbox
```

Configure the Better Auth server:

```ts
// lib/auth.ts
import { inbox } from "better-inbox";

export const auth = betterAuth({
  plugins: [inbox()],
});
```

Then run the Better Auth migration:

```bash
npx auth@latest migrate
```

This creates the `notification` table.

### Important

Notification sending is **server-only**. Do not expose `auth.api.notify()` through an unnecessary HTTP route.

## Client setup

Configure the Better Auth client:

```ts
// lib/auth-client.ts
import { inboxClient } from "better-inbox/client";

export const authClient = createAuthClient({
  plugins: [inboxClient()],
});
```

## React UI

Use `InboxButton` from `better-inbox/react`:

```tsx
import { InboxButton } from "better-inbox/react";

<InboxButton
  client={authClient}
  onNavigate={(href) => router.push(href)}
/>
```

It uses shadcn CSS variables but does not require shadcn itself.

## Sending notifications

Send directly from trusted server code:

```ts
await auth.api.notify({
  body: {
    userId,
    type: "comment.reply",
    title: "Someone replied to your comment",
    href: "/comments/123",
    body: "Open the comment to view the reply.",
    data: {
      commentId: "123",
    },
  },
});
```

A notification targets exactly one of `userId` or `organizationId`.

### Organization fan-out

With the Better Auth organization plugin enabled:

```ts
await auth.api.notify({
  body: {
    organizationId,
    roles: ["owner", "admin"],
    type: "billing.payment_failed",
    title: "Payment failed",
  },
});
```

Organization notifications create one notification row per matching member.

The fan-out is capped by `maxFanout`. Configure it when necessary:

```ts
inbox({ maxFanout: 1000 })
```

Do not assume unlimited organization fan-out.

## Reading and mutating notifications

All operations are session-scoped to the caller.

List:

```ts
const result = await auth.api.listNotifications({
  headers,
  query: {
    filter: "unread", // "unread" | "all"
    limit: 20,
    offset: 0,
    organizationId,
  },
});
```

Result:

```ts
{
  notifications,
  hasMore,
}
```

Mark one read:

```ts
await auth.api.markRead({
  headers,
  body: { id },
});
```

Mark all read:

```ts
await auth.api.markAllRead({
  headers,
  body: { organizationId },
});
```

Unread count:

```ts
const result = await auth.api.unreadCount({
  headers,
  query: { organizationId },
});
```

The same operations are available on the client:

```ts
authClient.inbox.list
authClient.inbox.markRead
authClient.inbox.markAllRead
authClient.inbox.unreadCount
```

## React hook

Use `useInbox` for an interactive inbox:

```tsx
const {
  notifications,
  unreadCount,
  isLoading,
  hasMore,
  loadMore,
  markRead,
  markAllRead,
  refresh,
} = useInbox(authClient, {
  pollInterval: 30000,
  pageSize: 20,
  filter: "unread",
  organizationId,
});
```

Behavior to preserve:

- Polling refreshes the unread count.
- Window focus and panel open trigger a full refresh.
- `markRead` and `markAllRead` are optimistic.
- `filter: "unread"` fetches unread rows only.
- With the unread filter, `pageSize` is the number of unread rows returned.
- Locally-read rows can remain until `refresh()`.
- `loadMore()` offsets by unread rows already held.
- Changing `filter` refetches.
- `InboxButton` accepts the same `filter` prop and hides its all/unread tabs when `filter` is `"unread"`.

## Notification fields

The notification record contains:

- `id`
- `userId`
- `organizationId` (optional)
- `type`
- `title`
- `body` (optional)
- `href` (optional)
- `data` (optional JSON)
- `read`
- `createdAt`

## Database/indexing guidance

The package recommends a manual database index on:

```text
(userId, createdAt)
```

This is useful for the common user notification timeline/read queries.

## Styling and dependencies

The React components use shadcn CSS variables such as:

- `bg-popover`
- `text-muted-foreground`

The package has zero runtime dependencies and does not require shadcn.

## Implementation rules for coding agents

1. Keep notification creation on the server; do not turn it into a public HTTP endpoint unless the application has a specific architectural reason.
2. Use Better Auth's `auth.api.notify()` for server-side delivery.
3. When notifying an organization, verify that the Better Auth organization plugin is configured.
4. Treat `userId` and `organizationId` as mutually exclusive notification targets.
5. Respect `maxFanout` for organization notifications.
6. Use session-scoped read/mutation APIs rather than directly exposing arbitrary notification rows to clients.
7. Preserve optimistic read behavior when building UI around `useInbox`.
8. Be careful when using the unread filter: pagination offsets are based on unread rows held locally.
9. Add the recommended `(userId, createdAt)` index for production workloads.
10. Do not assume shadcn is required just because the components use shadcn CSS variables.

## Quick reference

| Task | API |
|---|---|
| Install | `npm install better-inbox` |
| Server plugin | `inbox()` |
| Migration | `npx auth@latest migrate` |
| Client plugin | `inboxClient()` |
| Send notification | `auth.api.notify()` |
| List | `auth.api.listNotifications()` |
| Mark one read | `auth.api.markRead()` |
| Mark all read | `auth.api.markAllRead()` |
| Unread count | `auth.api.unreadCount()` |
| React UI | `InboxButton` |
| React state | `useInbox()` |
| Organization fan-out | `organizationId` + optional `roles` |
| Fan-out limit | `maxFanout` |
| Recommended index | `(userId, createdAt)` |
