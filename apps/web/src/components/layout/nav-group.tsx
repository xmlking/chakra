import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/shadcn/collapsible";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";

import type { NavGroup, NavItem } from "#types/index";

import { NavItem as NavItemComponent } from "./nav-item";

type NavGroupProps = {
  group: NavGroup;
  onItemClick?: () => void;
};

function CollapsibleNavItem({ item, onItemClick }: { item: NavItem; onItemClick?: () => void }) {
  const hasChildren = item.items && item.items.length > 0;
  const [open, setOpen] = useState(item.isActive ?? false);

  if (!hasChildren) {
    return <NavItemComponent item={item} onClick={onItemClick} />;
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        )}
      >
        {item.icon && <item.icon className="size-4 shrink-0" />}
        <span className="flex-1 truncate text-left">{item.title}</span>
        <ChevronRightIcon
          className={cn("size-4 shrink-0 transition-transform duration-200", open && "rotate-90")}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-ending-style:animate-out data-ending-style:fade-out data-starting-style:animate-in data-starting-style:fade-in">
        <div className="mt-1 flex flex-col gap-0.5 pl-4">
          {item.items!.map((sub) => (
            <NavItemComponent key={sub.title} item={sub} indent onClick={onItemClick} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function NavGroupSection({ group, onItemClick }: NavGroupProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {group.label && (
        <p className="mb-1 px-3 text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
          {group.label}
        </p>
      )}
      {group.items.map((item) => (
        <CollapsibleNavItem key={item.title} item={item} onItemClick={onItemClick} />
      ))}
    </div>
  );
}
