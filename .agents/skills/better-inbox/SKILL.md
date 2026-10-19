---
name: better-inbox
description: Use the better-inbox Better Auth plugin for in-app notifications. Covers server setup, migrations, organization delivery, InboxButton, InboxPanel, useInbox, and notification schema/indexing.
---

# better-inbox

`better-inbox` is a Better Auth plugin for in-app notifications stored in the application's own
database through the Better Auth adapter. Use it for user- or organization-scoped in-app inbox
notifications, not as a hosted notification service or durable event queue.

## When to use

- Configuring the `inbox()` server plugin or `inboxClient()` client plugin
- Sending a notification from trusted server code
- Organization fan-out, roles, and exclusions
- Building an inbox with `InboxButton`, `InboxPanel`, or `useInbox`
- Listing, reading, and counting notifications
- Notification migrations or database indexing

## Version guidance

This skill tracks the upstream README on `main`. Before implementing an API in an existing project,
check its installed `better-inbox` version and confirm the API is supported there. The latest
README's migration syntax and some notification options may differ from older installed versions.
Do not upgrade dependencies unless requested.

## Setup

Add the plugin to Better Auth:

```ts
import { inbox } from "better-inbox";

export const auth = betterAuth({
  plugins: [inbox()],
});
```

Create the plugin's `notification` table using the project's existing Better Auth migration
workflow. The current upstream README uses:

```sh
npx @better-auth/cli migrate --config path/to/auth.ts
```

For Drizzle or Prisma, use `generate` instead of `migrate` when the schema changes should be reviewed
and applied through the ORM's migration workflow. Point `--config` at the Better Auth config when
the CLI cannot auto-detect it.

Configure the client:

```ts
import { inboxClient } from "better-inbox/client";

export const authClient = createAuthClient({
  plugins: [inboxClient()],
});
```

## Sending notifications

Notification sending is server-only. Call `auth.api.notify()` from trusted server code such as a
server action, verified webhook, or cron handler. Do not expose it through an unnecessary public
HTTP route.

User notification:

```ts
await auth.api.notify({
  body: {
    userId,
    type: "comment.reply",
    title: "Someone replied to your comment",
    href: `/posts/${postId}#comment-${commentId}`,
    data: { commentId },
  },
});
```

Organization fan-out requires the Better Auth organization plugin. It creates one notification per
matching organization member:

```ts
await auth.api.notify({
  body: {
    organizationId,
    roles: ["owner", "admin"],
    excludeUserIds: [actorUserId],
    type: "billing.payment_failed",
    title: "Payment failed — update your card",
    href: "/settings/billing",
  },
});
```

`roles` and `excludeUserIds` are optional and apply only to organization fan-out. If the filters
exclude every member, the result is `{ count: 0, notifications: [] }`; an organization with no
members still throws. Fan-out defaults to a 1,000-member cap; configure `inbox({ maxFanout })` only
when the workload requires a different limit.

To notify one member in an organization's context, pass both `userId` and `organizationId`. The
user must be a member; the created row is stamped with the organization id and is available under
that org's notification filter. `roles` and `excludeUserIds` are rejected with `userId`.

Provide `userId`, `organizationId`, or both: `organizationId` alone fans out to the org, while
`userId` plus `organizationId` sends one notification in that organization's context. `body`,
`href`, and JSON `data` are optional.

## Reading and mutating notifications

Session endpoints only return or mutate notifications belonging to the authenticated caller.

```ts
const result = await auth.api.listNotifications({
  headers,
  query: {
    filter: "unread", // "unread" | "all"
    limit: 20, // maximum 100
    offset: 0,
    organizationId,
  },
});
// result: { notifications, hasMore }

await auth.api.markRead({ headers, body: { id } });
await auth.api.markAllRead({ headers, body: { organizationId } });
const { count } = await auth.api.unreadCount({ headers, query: { organizationId } });
```

The `organizationId` scope on `markAllRead` is optional. Client methods are available on
`authClient.inbox`: `list`, `markRead`, `markAllRead`, and `unreadCount`.

## React UI

`InboxButton` provides the trigger, unread badge, and panel:

```tsx
<InboxButton
  client={authClient}
  onNavigate={(href) => router.navigate({ href })}
  organizationId={organizationId}
/>
```

For TanStack Start/Router, pass the complete `href` to `router.navigate({ href })` and mount the
button in a persistent root layout to avoid remounts during navigation.

Useful `InboxButton` props include `renderItem`, `pollInterval` (default 30 seconds; unread count
only, paused while the tab is hidden), `refreshOnFocus` (default `true`), `filter`,
`organizationId`, `className`, and `buttonClassName`. The component opens on the Unread tab, with All
second; providing `filter` locks the list and hides the tabs. Opening the panel always refreshes.
When the tab becomes visible, a full refresh is skipped if data is less than five seconds old.

`useInbox(authClient, options)` exposes
`notifications`, `unreadCount`, `isLoading`, `hasMore`, `loadMore`, `markRead`, `markAllRead`,
`refresh`, and `refreshIfStale`. Options include `pollInterval`, `pageSize`, `filter`,
`organizationId`, and `refreshOnFocus`. Concurrent `refresh()` calls share one request;
`refreshIfStale()` skips when data is less than five seconds old.

`<InboxPanel inbox={useInbox(...)} />` renders the panel without the bell. Its tabs can be controlled
with `view` and `onViewChange`; uncontrolled, it defaults to Unread.

Preserve these `useInbox` behaviors:

- Polling refreshes only the unread count; focus and panel open trigger a full refresh.
- `filter: "unread"` fetches unread rows from the server, so `pageSize` is the count of unread rows,
  not the number of rows to filter client-side.
- `markRead` and `markAllRead` are optimistic. A locally read row may remain until the next refresh.
- `loadMore()` accounts for locally held unread rows; changing `filter` refetches.

The components use shadcn CSS variables but do not require shadcn or add runtime dependencies.
`InboxButton` renders its own button; do not wrap it in another button. Use `buttonClassName` to
replace its trigger styling.

Tailwind v4 excludes `node_modules` from class scanning by default. Add the package's built assets to
the CSS source list (path relative to the CSS file):

```css
@source "../node_modules/better-inbox/dist";
```

## Schema and performance

The notification record includes `id`, `userId`, optional `organizationId`, `type`, `title`,
optional `body`, `href`, and JSON `data`, `read`, and `createdAt`.

Once notification volume warrants it, add a manual index on `(userId, createdAt)`. Plugin schemas
cannot declare this index; for Drizzle:

```ts
index("notification_user_created_idx").on(table.userId, table.createdAt)
```

## Delivery expectations

The package does not provide email or push channels, preferences, digests, or realtime WebSockets.
Its inbox refreshes through polling and tab-visibility refresh. Do not promise immediate delivery
unless the application separately implements realtime updates.

EventBus is also not durable. If a notification must never be missed, create it in the persisted
webhook/workflow path or use durable event processing rather than relying only on a transient
EventBus subscriber.

## Implementation rules

1. Keep notification creation in trusted server code.
2. Use `auth.api.notify()` for server-side delivery; do not expose it publicly without a specific
   architectural need.
3. Confirm the Better Auth organization plugin is enabled before organization delivery.
4. Validate organization/user membership for targeted sends; never trust an unverified org id.
5. Respect the organization fan-out cap and account for empty organizations.
6. Use session-scoped read and mutation APIs; do not expose arbitrary notification rows.
7. Preserve optimistic read behavior and unread pagination semantics.
8. Add the recommended `(userId, createdAt)` index when appropriate.
9. Do not require shadcn just because the component uses its CSS variables.
10. Do not assume realtime delivery; distinguish polling from any app-owned realtime transport.
