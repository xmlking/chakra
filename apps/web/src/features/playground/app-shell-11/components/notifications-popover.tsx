import { Badge } from "@workspace/ui/components/reui/badge";
import { Rating } from "@workspace/ui/components/reui/rating";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@workspace/ui/components/shadcn/avatar";
import { Button } from "@workspace/ui/components/shadcn/button";
import { ButtonGroup } from "@workspace/ui/components/shadcn/button-group";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/shadcn/popover";
import { Progress } from "@workspace/ui/components/shadcn/progress";
import { ScrollArea } from "@workspace/ui/components/shadcn/scroll-area";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/shadcn/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/shadcn/tooltip";
import { cn } from "cn";
import {
  MessageSquareIcon,
  PaperclipIcon,
  UserPlusIcon,
  CreditCardIcon,
  ShieldAlertIcon,
  SparklesIcon,
  RocketIcon,
  ActivityIcon,
  AlertCircleIcon,
  CircleCheckIcon,
  LinkIcon,
  StarIcon,
  ThumbsUpIcon,
  UsersIcon,
  SmileIcon,
  CalendarIcon,
  DownloadIcon,
  CheckCheckIcon,
  BellIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import {
  NOTIFICATIONS,
  type Notification,
  type NotificationGroupMember,
  type NotificationType,
  type NotificationVariant,
} from "./data";

const NOTIFICATION_ICONS: Record<NotificationType, ReactNode> = {
  mention: <MessageSquareIcon aria-hidden="true" />,
  comment: <MessageSquareIcon aria-hidden="true" />,
  share: <PaperclipIcon aria-hidden="true" />,
  invite: <UserPlusIcon aria-hidden="true" />,
  billing: <CreditCardIcon aria-hidden="true" />,
  security: <ShieldAlertIcon aria-hidden="true" />,
  feature: <SparklesIcon aria-hidden="true" />,
  deployment: <RocketIcon aria-hidden="true" />,
  usage: <ActivityIcon aria-hidden="true" />,
  system: <AlertCircleIcon aria-hidden="true" />,
  task: <CircleCheckIcon aria-hidden="true" />,
  approval: <CircleCheckIcon aria-hidden="true" />,
  integration: <LinkIcon aria-hidden="true" />,
  achievement: <StarIcon aria-hidden="true" />,
  feedback: <ThumbsUpIcon aria-hidden="true" />,
  team_join: <UsersIcon aria-hidden="true" />,
  reaction: <SmileIcon aria-hidden="true" />,
  review: <StarIcon aria-hidden="true" />,
  event: <CalendarIcon aria-hidden="true" />,
};

const VARIANT_COLORS: Record<NotificationVariant, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

// ── Notification Avatar Group ──

function NotifAvatarGroup({
  members,
  count,
}: {
  members: NotificationGroupMember[];
  count?: number;
}) {
  return (
    <AvatarGroup className="mt-1.5 -space-x-1">
      {members.map((m) => (
        <Avatar key={m.src} className="size-5">
          <AvatarImage src={m.src} alt={m.fallback} />
          <AvatarFallback className="text-[9px]">{m.fallback}</AvatarFallback>
        </Avatar>
      ))}
      {count && count > 0 ? (
        <AvatarGroupCount className="size-5 text-[9px] leading-none">+{count}</AvatarGroupCount>
      ) : null}
    </AvatarGroup>
  );
}

// ── Segmented Meta Badge ──

function MetaBadge({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <span className="inline-flex h-[18px] shrink-0 items-center overflow-hidden rounded-sm border border-border/60 text-[10px] font-medium">
      <span className="flex h-full items-center border-r border-border/50 bg-muted/60 px-1.5 leading-none text-muted-foreground">
        {label}
      </span>
      <span
        className={cn("flex h-full items-center px-1.5 leading-none", color || "text-foreground")}
      >
        {value}
      </span>
    </span>
  );
}

// ── Mini Progress Bar ──

function MiniProgress({
  value,
  variant = "default",
}: {
  value: number;
  variant?: "default" | "success";
}) {
  const indicatorColor =
    variant === "success"
      ? "**:data-[slot=progress-indicator]:bg-success"
      : value >= 80
        ? "**:data-[slot=progress-indicator]:bg-warning"
        : "**:data-[slot=progress-indicator]:bg-primary";

  return (
    <div className="relative mt-1.5 h-1 overflow-hidden rounded-full bg-muted/55">
      <div
        className="pointer-events-none absolute inset-0 text-muted-foreground opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, currentColor 0, currentColor 1px, transparent 0, transparent 4px)",
        }}
      />
      <Progress
        value={value}
        className={cn(
          "absolute inset-0 gap-0",
          "**:data-[slot=progress-track]:h-full **:data-[slot=progress-track]:rounded-none **:data-[slot=progress-track]:bg-transparent",
          "**:data-[slot=progress-indicator]:rounded-none",
          indicatorColor,
        )}
      />
    </div>
  );
}

// ── Notification Item ──

function NotificationItem({ notification }: { notification: Notification }) {
  const {
    type,
    variant = "info",
    title,
    body,
    time,
    unread,
    avatar,
    username,
    link,
    badge,
    actions,
    attachment,
    meta,
    progress,
    avatarGroup,
    avatarGroupCount,
    rating,
    eventDate,
    eventTime,
    progressVariant,
  } = notification;

  const iconColor = VARIANT_COLORS[variant];
  const hasAvatar = Boolean(avatar);
  const hasActions = Boolean(actions?.length);
  const hasInteractiveChildren = hasActions || Boolean(attachment);

  const content = (
    <>
      {/* Left column: Avatar or Icon */}
      <div className="shrink-0">
        {hasAvatar ? (
          <Avatar size="sm">
            <AvatarImage src={avatar?.src} alt={avatar?.fallback} />
            <AvatarFallback>{avatar?.fallback}</AvatarFallback>
          </Avatar>
        ) : (
          <div className={cn("flex size-6 items-center justify-center [&_svg]:size-4", iconColor)}>
            {NOTIFICATION_ICONS[type]}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-1">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs leading-snug text-foreground">
            {username && <span className="font-medium text-primary">{username}</span>}{" "}
            {hasAvatar ? (
              <>
                {title} {link && <span className="font-medium text-primary">{link}</span>}
              </>
            ) : (
              <span className="font-medium">{title}</span>
            )}
          </p>
          {badge && (
            <Badge variant="outline" size="sm">
              {badge}
            </Badge>
          )}
        </div>

        {/* Body */}
        {body && <p className="line-clamp-2 text-xs text-muted-foreground">{body}</p>}

        {/* Avatar group */}
        {avatarGroup && avatarGroup.length > 0 && (
          <NotifAvatarGroup members={avatarGroup} count={avatarGroupCount} />
        )}

        {/* Star rating */}
        {rating !== undefined && <Rating rating={rating} size="sm" className="mt-0.5" />}

        {/* Event date/time chip */}
        {(eventDate || eventTime) && (
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-sm border border-border/50 bg-muted/50 px-2 py-1 text-[11px] text-muted-foreground">
            <CalendarIcon aria-hidden="true" className="size-3 shrink-0 opacity-60" />
            {eventDate && <span className="font-medium text-foreground">{eventDate}</span>}
            {eventTime && <span className="opacity-70">{eventTime}</span>}
          </div>
        )}

        {/* Progress bar */}
        {progress !== undefined && <MiniProgress value={progress} variant={progressVariant} />}

        {/* Attachment */}
        {attachment && (
          <div className="flex items-center gap-1 py-1">
            <ButtonGroup>
              <Button variant="outline" size="xs">
                <PaperclipIcon aria-hidden="true" />
                {attachment.name}
                <span className="opacity-60">({attachment.size})</span>
              </Button>
              <Button variant="outline" size="icon-xs" aria-label="Download">
                <DownloadIcon aria-hidden="true" />
              </Button>
            </ButtonGroup>
          </div>
        )}

        {/* Actions */}
        {hasActions && (
          <div className="flex items-center gap-1 py-1">
            {actions?.map((action) => (
              <Button
                key={action.label}
                size="xs"
                variant={action.variant === "outline" ? "outline" : "default"}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {/* Timestamp + Meta badge on the same line */}
        <div className="flex items-center gap-2 pt-0.5">
          <p className="text-[11px] text-muted-foreground">{time}</p>
          {meta && <MetaBadge label={meta.label} value={meta.value} color={meta.color} />}
        </div>
      </div>
    </>
  );

  return (
    <div className="relative">
      {/* Unread indicator: top-right dot on the row */}
      {unread && (
        <span
          className="pointer-events-none absolute top-3 right-3 z-10 size-1.5 rounded-full bg-primary ring-1 ring-background"
          aria-hidden="true"
        />
      )}
      {hasInteractiveChildren ? (
        <div className="flex w-full items-start gap-2 p-2 text-left">{content}</div>
      ) : (
        <Button
          variant="ghost"
          className="h-auto w-full items-start justify-start rounded-none p-2 text-left whitespace-normal"
        >
          {content}
        </Button>
      )}
    </div>
  );
}

// ── Notifications Panel ──

function NotificationsPanel() {
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Badge size="xs" className="rounded-full!">
              {unreadCount}
            </Badge>
          )}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="opacity-60 hover:opacity-100"
                  aria-label="Mark all as read"
                />
              }
            >
              <CheckCheckIcon className="size-3.5" aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent>Mark all as read</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Content */}
      <div className="relative flex max-h-full">
        <ScrollArea className="max-h-[320px] grow">
          {NOTIFICATIONS.map((notification, index) => (
            <div key={notification.id}>
              <NotificationItem notification={notification} />
              {index < NOTIFICATIONS.length - 1 && <Separator className="opacity-60" />}
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="border-t border-border/60 px-2 py-1">
        <Button variant="ghost" size="sm" className="w-full text-xs">
          View all notifications
        </Button>
      </div>
    </>
  );
}

// ── Notifications Popover ──

export function NotificationsPopover() {
  const hasUnread = NOTIFICATIONS.some((n) => n.unread);

  return (
    <SidebarGroup className="py-0">
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger
                aria-label="Open notifications"
                render={<SidebarMenuButton tooltip="Notifications" />}
              >
                <span className="relative flex shrink-0 items-center justify-center">
                  <BellIcon aria-hidden="true" />
                  {hasUnread && (
                    <span
                      className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-sidebar-primary ring-2 ring-sidebar"
                      aria-hidden="true"
                    />
                  )}
                </span>
                <span>Notifications</span>
              </PopoverTrigger>

              <PopoverContent side="right" align="start" sideOffset={8} className="w-80 gap-0 p-0">
                <NotificationsPanel />
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
