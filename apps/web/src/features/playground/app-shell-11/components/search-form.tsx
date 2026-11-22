import { useEffect, useId, useState, type ComponentProps } from "react"

import { Button } from "@workspace/ui/components/shadcn/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/shadcn/dialog"
import { Input } from "@workspace/ui/components/shadcn/input"
import { Kbd } from "@workspace/ui/components/shadcn/kbd"
import {
  SidebarGroup,
  SidebarGroupContent,
} from "@workspace/ui/components/shadcn/sidebar"
import { SearchIcon } from "lucide-react"

export function SearchForm({ ...props }: ComponentProps<"form">) {
  const [open, setOpen] = useState(false)
  const searchInputId = useId()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <form {...props}>
      {/* Sidebar */}
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="group/search relative">
          <Button
            id="search"
            type="button"
            variant="ghost"
            className="border-input text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground focus-visible:bg-sidebar-accent/70 focus-visible:text-sidebar-foreground h-8 w-full justify-start bg-transparent pl-7 font-normal shadow-none transition-[width,color,background-color] duration-200 ease-linear in-data-[state=collapsed]:w-8! in-data-[state=collapsed]:pl-4! in-data-[state=collapsed]:text-transparent"
            onClick={() => setOpen(true)}
          >
            Search...
          </Button>
          <SearchIcon aria-hidden="true" className="text-sidebar-foreground/50 group-hover/search:text-sidebar-foreground/70 pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 transition-colors select-none" />
          <Kbd className="border-sidebar-border/60 text-sidebar-foreground/55 absolute top-1/2 right-2 -translate-y-1/2 border bg-transparent in-data-[state=collapsed]:hidden">
            ⌘K
          </Kbd>
        </SidebarGroupContent>
      </SidebarGroup>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Search your workspace content.</DialogDescription>
        </DialogHeader>
        <DialogContent className="max-w-md px-4 py-2 **:data-[slot=dialog-close]:top-1/2 **:data-[slot=dialog-close]:right-3 **:data-[slot=dialog-close]:-translate-y-1/2 **:data-[slot=dialog-close]:opacity-60">
          <div className="relative flex items-center gap-3">
            <SearchIcon aria-hidden="true" className="pointer-events-none size-4 opacity-60 select-none" />
            <Input
              id={searchInputId}
              className="h-10 border-none p-0 shadow-none outline-none focus-visible:ring-0"
              autoFocus
              placeholder="Search handoffs, notes, and playbooks..."
              aria-label="Search Atlas Desk"
            />
          </div>
        </DialogContent>
      </Dialog>
    </form>
  )
}