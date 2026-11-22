import { Fragment } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu"
import { SidebarMenuAction } from "@workspace/ui/components/shadcn/sidebar"
import { ITEM_ACTIONS } from "./data"
import { MoreHorizontalIcon } from "lucide-react"

export function ItemActionMenu({ label }: { label: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuAction showOnHover aria-label={`Actions for ${label}`} />
        }
      >
        <MoreHorizontalIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      {/* Content */}
      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={4}
        className="w-44"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {ITEM_ACTIONS.map((action) => (
            <Fragment key={action.id}>
              {action.destructive && <DropdownMenuSeparator />}
              <DropdownMenuItem
                variant={action.destructive ? "destructive" : "default"}
                className="[&_svg]:size-3.5 [&_svg]:opacity-60"
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            </Fragment>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}