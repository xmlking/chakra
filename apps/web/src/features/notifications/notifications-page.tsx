"use client";

import { useRouter } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/shadcn/tabs";
import { BellIcon } from "lucide-react";

import { useNotificationStore } from "./store";
import type { Notification } from "./store";
import { NotificationCard } from "./ui/notification-card";

const actionRoutes: Record<string, string> = {
  workspace: "/dashboard/workspaces",
  product: "/dashboard/product",
  billing: "/dashboard/billing",
  open: "/dashboard/kanban",
  support: "/support",
};

function NotificationsList({ items }: { items: Notification[] }) {
  const { markAsRead } = useNotificationStore();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <BellIcon className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No notifications</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((notification) => (
        <NotificationCard
          key={notification.id}
          id={notification.id}
          title={notification.title}
          body={notification.body}
          status={notification.status}
          createdAt={notification.createdAt}
          actions={notification.actions}
          onMarkAsRead={markAsRead}
          onAction={(notifId, actionId) => {
            const route = actionRoutes[actionId];
            if (route) {
              markAsRead(notifId);
              void router.navigate({ to: route });
            }
          }}
        />
      ))}
    </div>
  );
}

export function NotificationsPage() {
  const { notifications, markAllAsRead } = useNotificationStore();

  const unreadNotifications = notifications.filter((n) => n.status === "unread");
  const readNotifications = notifications.filter((n) => n.status === "read");

  return (
    <div className="container-wrapper">
      <Button variant="outline" size="sm" onClick={markAllAsRead}>
        Mark all as read
      </Button>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadNotifications.length})</TabsTrigger>
          <TabsTrigger value="read">Read ({readNotifications.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <NotificationsList items={notifications} />
        </TabsContent>
        <TabsContent value="unread" className="mt-4">
          <NotificationsList items={unreadNotifications} />
        </TabsContent>
        <TabsContent value="read" className="mt-4">
          <NotificationsList items={readNotifications} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
