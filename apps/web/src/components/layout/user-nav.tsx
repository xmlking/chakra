import { useAuth, useSession } from "@better-auth-ui/react";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/shadcn/avatar";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import {
  BellIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LifeBuoyIcon,
  LogOutIcon,
  MessageSquareIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

import { ThemeSwitcher } from "#components/theme-switcher";

export function UserNav() {
  const { authClient } = useAuth();
  const { data: session } = useSession(authClient);
  const user = session?.user;

  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  return (
    <div className="flex flex-col gap-1 px-2 pb-2">
      <Separator className="mb-1" />

      {/* Support & Feedback */}
      <a
        href="https://github.com/xmlking/chakra/issues"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <LifeBuoyIcon className="size-4" />
        Support
      </a>

      <button
        type="button"
        className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label="Send Feedback"
      >
        <MessageSquareIcon className="size-4" />
        Feedback
      </button>

      <Separator className="my-1" />

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" className="h-auto w-full justify-start px-3 py-2" />}
        >
          <Avatar size="sm">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-medium tracking-normal normal-case">
              {user?.name ?? "Loading..."}
            </p>
            <p className="truncate text-xs font-normal tracking-normal text-muted-foreground normal-case">
              {user?.email ?? ""}
            </p>
          </div>

          <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent side="top" align="start" sideOffset={8} className="w-64">
          <div className="flex items-center gap-2 px-3 py-2">
            <Avatar size="sm">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            render={<Link to="/settings/$path" params={{ path: "account" }} />}
            nativeButton={false}
          >
            <UserIcon />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link to="/settings/$path" params={{ path: "account" }} />}
            nativeButton={false}
          >
            <SettingsIcon />
            Account Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link to="/settings/$path" params={{ path: "billing" }} />}
            nativeButton={false}
          >
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link to="/settings/$path" params={{ path: "notifications" }} />}
            nativeButton={false}
          >
            <BellIcon />
            Notifications
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Theme
            </span>
            <ThemeSwitcher />
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            render={<Link to="/auth/$path" params={{ path: "sign-out" }} />}
            nativeButton={false}
          >
            <LogOutIcon />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
