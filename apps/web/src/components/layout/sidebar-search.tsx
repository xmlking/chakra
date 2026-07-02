import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/shadcn/input-group";
import { SidebarGroup, SidebarGroupContent } from "@workspace/ui/components/shadcn/sidebar";
import { useKBar } from "kbar";
import { CommandIcon, SearchIcon } from "lucide-react";

export function SidebarSearch() {
  const { query } = useKBar();

  return (
    <SidebarGroup className="px-0 py-0 group-data-[collapsible=icon]:hidden">
      <SidebarGroupContent>
        <InputGroup className="h-9 cursor-pointer bg-sidebar" onClick={() => query.toggle()}>
          <InputGroupInput
            placeholder="Search..."
            readOnly
            className="cursor-pointer"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") query.toggle();
            }}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground select-none">
              <CommandIcon className="size-3" />K
            </kbd>
          </InputGroupAddon>
        </InputGroup>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
