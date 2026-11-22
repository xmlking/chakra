import {
  defaultInboxLabels,
  formatRelativeTime,
  InboxPanel,
  useInbox,
  type InboxFetchClient,
  type InboxNotification,
} from "@byo-oss/notifications/react";
import { Badge } from "@workspace/ui/components/reui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/shadcn/popover";
import { cn } from "cn";
import { BellIcon } from "lucide-react";
import { useState } from "react";

import {
  INBOX_NOTIFICATION_TYPES,
  type InboxNotificationStyle,
} from "#lib/inbox-notification-types";

/** Lookup by the stored `type` string, which may be one this build doesn't know. */
const STYLES: Partial<Record<string, InboxNotificationStyle>> = INBOX_NOTIFICATION_TYPES;

/** Unknown types: bell icon, no status badge. */
const DEFAULT_STYLE: InboxNotificationStyle = {
  icon: BellIcon,
  tile: "bg-muted text-muted-foreground",
};

export function InboxNotificationItem({
  notification,
  onSelect,
}: {
  notification: InboxNotification;
  onSelect: (notification: InboxNotification) => void;
}) {
  const { icon: Icon, tile, status } = STYLES[notification.type] ?? DEFAULT_STYLE;

  return (
    <button
      type="button"
      title={notification.title}
      onClick={() => onSelect(notification)}
      className="flex w-full min-w-0 items-center gap-3 overflow-hidden px-3 py-2.5 text-left hover:bg-accent/50"
    >
      <span
        className={cn("relative flex size-8 shrink-0 items-center justify-center rounded-md", tile)}
      >
        <Icon className="size-4" aria-hidden="true" />
        {notification.read ? null : (
          <span
            data-testid="unread-dot"
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-primary ring-2 ring-popover"
          />
        )}
      </span>
      <span className="min-w-0 flex-1">
        {notification.read ? null : <span className="sr-only">Unread: </span>}
        <span
          className={cn(
            "block truncate text-sm",
            notification.read ? "text-muted-foreground" : "font-medium",
          )}
        >
          {notification.title}
        </span>
        <span className="mt-1 flex items-center gap-2">
          {status ? (
            <Badge variant={status.variant} radius="full">
              {status.label}
            </Badge>
          ) : null}
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </span>
      </span>
    </button>
  );
}

/**
 * Header inbox: `@byo-oss/notifications`' `useInbox` + `InboxPanel` in a shadcn
 * Popover, with rows that lead with an icon, the file name and a status badge.
 * `InboxButton`'s `renderItem` can't be used for this: a custom row replaces the
 * default button and gets no access to `markRead`.
 */
export function AppInbox({
  client,
  onNavigate,
  buttonClassName,
}: {
  client: InboxFetchClient;
  onNavigate: (href: string) => void;
  buttonClassName?: string;
}) {
  const [view, setView] = useState<"unread" | "all">("unread");
  const inbox = useInbox(client, { filter: view });

  const select = (notification: InboxNotification) => {
    void inbox.markRead(notification.id).catch(() => {});
    if (notification.href) onNavigate(notification.href);
  };

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) void inbox.refresh();
      }}
    >
      <PopoverTrigger
        aria-label={defaultInboxLabels.notifications}
        className={cn("relative", buttonClassName)}
      >
        <BellIcon aria-hidden="true" />
        {inbox.unreadCount > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
            {defaultInboxLabels.badge(inbox.unreadCount)}
          </span>
        ) : null}
      </PopoverTrigger>
      <span className="sr-only" aria-live="polite">
        {inbox.unreadCount > 0 ? defaultInboxLabels.unreadCount(inbox.unreadCount) : ""}
      </span>
      <PopoverContent align="end" className="w-auto gap-0 bg-transparent p-0 shadow-none ring-0">
        <InboxPanel
          // the panel's list scroller is `overflow-y-auto`, which also lets wide rows scroll sideways
          className="[&_.overflow-y-auto]:overflow-x-hidden"
          inbox={inbox}
          view={view}
          onViewChange={setView}
          renderItem={(notification) => (
            <InboxNotificationItem notification={notification} onSelect={select} />
          )}
        />
      </PopoverContent>
    </Popover>
  );
}
