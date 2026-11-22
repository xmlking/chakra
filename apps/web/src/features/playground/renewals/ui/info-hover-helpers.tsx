import { ClipboardCheckIcon, Info } from "lucide-react";

export function RenewalsOverviewHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ClipboardCheckIcon className="size-4 text-primary" aria-hidden="true" />
        <p className="text-sm font-semibold">Renewal review</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Use this table to review upcoming renewals by account, owner, stage, and renewal window.
        Compare annual recurring revenue (ARR) and expansion upside with health, risk, usage trends,
        invoice readiness, and sponsor status to decide where to follow up.
      </p>
      <div className="space-y-1.5 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">Health and risk</p>
        <p className="text-[11px] text-muted-foreground">
          Health scores of 75 and above are Healthy, 55–74 are Watchlist, and below 55 are At risk.
          Risk is tracked separately as Low, Medium, High, or Critical.
        </p>
      </div>
      <div className="space-y-1.5 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">Review and update</p>
        <p className="text-[11px] text-muted-foreground">
          Filter by account, segment, stage, risk, renewal window, or owner. Select rows to update
          their owner and stage together; row actions let you open an account, create a brief, or
          escalate a review.
        </p>
      </div>
      <div className="flex items-start gap-1.5 rounded-md bg-muted/40 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-[11px] text-muted-foreground">
          Use table settings to change density, resize or move columns, and show or hide optional
          columns such as usage, invoice status, sponsor status, and region.
        </p>
      </div>
    </div>
  );
}
