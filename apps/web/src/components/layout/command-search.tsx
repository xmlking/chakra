"use client";

import { useNavigate } from "@tanstack/react-router";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@workspace/ui/components/shadcn/command";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { navGroups } from "#config/sidebar.config";

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function handleSelect(url: string) {
    if (url === "#") return;
    setOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    void navigate({ to: url as any });
  }

  return (
    <>
      <button
        type="button"
        aria-label="Search (⌘K)"
        onClick={() => setOpen(true)}
        className="flex h-9 w-full items-center gap-2 rounded-md border border-border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <SearchIcon className="size-3.5 shrink-0" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="pointer-events-none hidden items-center gap-0.5 rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground select-none sm:flex">
          <span>⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search pages, settings..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {navGroups.map((group, i) => (
              <span key={group.label || i}>
                {i > 0 && <CommandSeparator />}
                <CommandGroup heading={group.label || undefined}>
                  {group.items.flatMap((item) => {
                    const rows = [];

                    if (item.url !== "#") {
                      rows.push(
                        <CommandItem
                          key={item.title}
                          value={item.title}
                          onSelect={() => handleSelect(item.url)}
                        >
                          {item.icon && <item.icon className="size-4 shrink-0" />}
                          {item.title}
                          {item.shortcut && (
                            <CommandShortcut>{item.shortcut.join("")}</CommandShortcut>
                          )}
                        </CommandItem>,
                      );
                    }

                    if (item.items?.length) {
                      for (const sub of item.items) {
                        if (sub.url !== "#") {
                          rows.push(
                            <CommandItem
                              key={sub.title}
                              value={`${item.title} ${sub.title}`}
                              onSelect={() => handleSelect(sub.url)}
                            >
                              {sub.icon && <sub.icon className="size-4 shrink-0" />}
                              <span className="text-muted-foreground">{item.title}</span>
                              <span>/</span>
                              {sub.title}
                            </CommandItem>,
                          );
                        }
                      }
                    }

                    return rows;
                  })}
                </CommandGroup>
              </span>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
