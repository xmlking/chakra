import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/shadcn/dialog";
import { Menu } from "lucide-react";
import { useState } from "react";

import { navigation } from "./nav-config";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
          <Menu className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="fixed inset-y-0 left-0 h-screen w-72 max-w-[85vw] rounded-none border-r p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Astra</DialogTitle>
        </DialogHeader>

        <nav className="flex flex-col gap-1 p-3">
          {navigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeProps={{
                className: "bg-accent text-accent-foreground",
              }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <item.icon className="size-4 shrink-0" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </DialogContent>
    </Dialog>
  );
}
