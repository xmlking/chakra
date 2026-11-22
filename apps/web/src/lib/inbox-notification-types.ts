import type { BadgeProps } from "@workspace/ui/components/reui/badge";
import { MailIcon, ReplyIcon, type LucideIcon } from "lucide-react";

export interface InboxNotificationStyle {
  icon: LucideIcon;
  tile: string;
  status?: { label: string; variant: BadgeProps["variant"] };
}

function DefineInboxNotificationTypes<const TTypes extends Record<string, InboxNotificationStyle>>(
  types: TTypes,
): TTypes {
  return types;
}
export const INBOX_NOTIFICATION_TYPES = DefineInboxNotificationTypes({
  new_message: {
    icon: MailIcon,
    tile: "bg-blue-100 text-blue-800",
    status: { label: "New", variant: "secondary" },
  },
  message_reply: {
    icon: ReplyIcon,
    tile: "bg-green-100 text-green-800",
    status: { label: "Reply", variant: "destructive" },
  },
});
