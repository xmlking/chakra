import { Pin, TriangleAlert } from "lucide-react";

export function RenewalsRiskOverviewHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TriangleAlert className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold">Renewals risk</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Use this queue to prioritize <span className="font-mono text-foreground">renewals</span>
        that may need attention. Each row brings account and owner details together with its sales
        stage, risk signals, health, <span className="font-mono text-foreground">ARR</span>, renewal
        date, and alerts.
      </p>
      <div className="space-y-1.5 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">Read the risk indicators together</p>
        <p className="text-[11px] text-muted-foreground">
          Signals call out known risk factors; the health bar ranges from 0–100 (green at 75+, amber
          at 55–74, and rose below 55). Alerts show an issue count and a short summary. Use these
          with the days remaining and <span className="font-mono text-foreground">ARR</span> to
          focus follow-up.
        </p>
      </div>
      <div className="flex items-start gap-1.5 rounded-md bg-muted/40 px-2.5 py-2">
        <Pin className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-[11px] text-muted-foreground">
          Pin important renewals to keep them at the top of the table. The pinned summary shows how
          many renewals are pinned and their combined ARR; row actions include opening a renewal,
          creating a save plan, scheduling an executive review, or copying a brief.
        </p>
      </div>
    </div>
  );
}
