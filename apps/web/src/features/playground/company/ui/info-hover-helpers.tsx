import { Building2Icon, ChartNoAxesCombinedIcon, FilterIcon, InfoIcon } from "lucide-react";

export function CompanyOverviewHelp() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Building2Icon className="size-4 text-primary" aria-hidden="true" />
        <p className="text-sm font-semibold">Company pipeline</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Review company accounts across their pipeline stage, status, priority, ownership, health,
        and renewal timing. The active and at-risk totals summarize the full company list.
      </p>
      <div className="flex flex-col gap-1.5 rounded-md border bg-muted/40 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <ChartNoAxesCombinedIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <p className="text-[11px] font-medium">Account signals</p>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Compare health, ARR, close probability, renewal date, and activity to prioritize
          follow-up. Add custom attributes with the column picker when you need more account
          context.
        </p>
      </div>
      <div className="flex items-start gap-1.5 rounded-md bg-muted/40 px-2.5 py-2">
        <FilterIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-[11px] text-muted-foreground">
          Filter the current rows, open a company to review or edit its details, and use Settings to
          adjust density, column lines, row stripes, and visible columns.
        </p>
      </div>
      <div className="flex items-start gap-1.5">
        <InfoIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-[11px] text-muted-foreground">
          Select rows to use bulk actions. The selection and table layout stay separate from the
          company details sheet.
        </p>
      </div>
    </div>
  );
}
