import { Frame, FrameHeader, FramePanel, FrameTitle } from "@workspace/ui/components/reui/frame";
import { Progress } from "@workspace/ui/components/shadcn/progress";
import { SidebarGroup } from "@workspace/ui/components/shadcn/sidebar";

const AI_USAGE = {
  used: 312,
  total: 400,
  label: "AI Drafts",
  resetLabel: "Draft credits refresh with the workspace cycle",
} as const;

export function SpendingLimit() {
  const pct = Math.round((AI_USAGE.used / AI_USAGE.total) * 100);
  const freePct = 100 - pct;

  return (
    <SidebarGroup className="overflow-hidden group-data-[collapsible=icon]:hidden">
      <Frame
        spacing="xs"
        dense
        className="mx-auto shrink-0 overflow-hidden bg-sidebar-accent/60 md:w-[230px]"
      >
        <FrameHeader>
          <FrameTitle className="text-xs text-foreground">{AI_USAGE.label}</FrameTitle>
        </FrameHeader>
        <FramePanel className="space-y-2">
          <p className="text-xs leading-snug text-muted-foreground">{AI_USAGE.resetLabel}</p>

          <div className="relative h-1.5 overflow-hidden rounded-sm bg-muted/55">
            <div
              className="pointer-events-none absolute inset-0 text-sidebar-foreground opacity-10"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-45deg, currentColor 0, currentColor 1px, transparent 0, transparent 4px)",
              }}
            />
            <Progress
              value={pct}
              className="absolute inset-0 gap-0 **:data-[slot=progress-indicator]:rounded-none **:data-[slot=progress-indicator]:bg-success **:data-[slot=progress-track]:h-full **:data-[slot=progress-track]:rounded-none **:data-[slot=progress-track]:bg-transparent"
            />
          </div>

          <div className="flex items-center justify-between text-xs leading-none text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sidebar-foreground">{pct}%</span>
              <span>Used</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sidebar-foreground">{freePct}%</span>
              <span>Free</span>
            </div>
          </div>
        </FramePanel>
      </Frame>
    </SidebarGroup>
  );
}
