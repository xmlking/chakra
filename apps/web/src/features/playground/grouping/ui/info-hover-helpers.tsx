import { LayersIcon, ListFilterIcon, NewspaperIcon, Settings2Icon } from "lucide-react";

export function ProductionDeskOverviewHelp() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <NewspaperIcon className="size-4 text-primary" aria-hidden="true" />
        <p className="text-sm font-semibold">Production Desk</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Track stories from drafting through readiness for the{" "}
        <span className="font-medium text-foreground">Northline Review</span>. The story and
        unchecked counts reflect the currently visible set.
      </p>
      <div className="flex flex-col gap-1.5 rounded-md border bg-muted/40 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <LayersIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <p className="text-[11px] font-medium">Organize the desk</p>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Group stories by stage, desk, or issue. Each section has its own sortable table, and empty
          groups stay visible while filters are applied.
        </p>
      </div>
      <div className="flex items-start gap-1.5 rounded-md bg-muted/40 px-2.5 py-2">
        <ListFilterIcon
          className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <p className="text-[11px] text-muted-foreground">
          Search stories and filter by desk or placement. Clear the filters to restore the complete
          production list.
        </p>
      </div>
      <div className="flex items-start gap-1.5">
        <Settings2Icon
          className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <p className="text-[11px] text-muted-foreground">
          Display settings control density, story slugs, and visible columns. Each section&apos;s
          add button starts a story for that group.
        </p>
      </div>
    </div>
  );
}
