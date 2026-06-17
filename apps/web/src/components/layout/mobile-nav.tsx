import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/shadcn/button";
import { ScrollArea } from "@workspace/ui/components/shadcn/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/shadcn/sheet";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

import { navGroups } from "#config/sidebar.config";

import { CommandSearch } from "./command-search";
import { NavGroupSection } from "./nav-group";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  function handleClose() {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation menu"
          />
        }
      >
        <MenuIcon className="size-5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0" showCloseButton={false}>
        <SheetHeader className="h-16 flex-row items-center justify-between border-b px-4 py-0">
          <SheetTitle render={<Link to="/" onClick={handleClose} />}>Chakra</SheetTitle>
        </SheetHeader>

        <div className="px-3 py-2">
          <CommandSearch />
        </div>

        <ScrollArea className="flex-1 px-3 py-2">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-4">
            {navGroups.map((group) => (
              <NavGroupSection key={group.label} group={group} onItemClick={handleClose} />
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
