import { Link } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";

import type { NavItem } from "#types/index";

type NavItemProps = {
  item: NavItem;
  indent?: boolean;
  onClick?: () => void;
};

export function NavItem({ item, indent = false, onClick }: NavItemProps) {
  const content = (
    <>
      {item.icon && <item.icon className="size-4 shrink-0" />}
      <span className="flex-1 truncate">{item.title}</span>
    </>
  );

  const baseClass = cn(
    "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
    indent && "pl-9",
  );

  if (item.url === "#" || item.disabled) {
    return (
      <span
        className={cn(baseClass, item.disabled && "cursor-not-allowed opacity-50")}
        aria-disabled={item.disabled}
      >
        {content}
      </span>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={item.url as any}
      activeProps={{ className: "bg-accent text-accent-foreground" }}
      className={baseClass}
      onClick={onClick}
    >
      {content}
    </Link>
  );
}
