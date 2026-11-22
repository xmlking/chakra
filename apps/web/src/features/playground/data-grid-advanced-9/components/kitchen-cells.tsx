import { Badge } from "@workspace/ui/components/reui/badge";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";

import { MANAGER_BY_ID, TODAY_DAY, type Kitchen, type Visit } from "./data";
import { UI_ICONS } from "./icons";
import { usePlanActions, usePlanView, type KitchenView } from "./plan-context";
import { WINDOW_DAYS } from "./plan-math";
import { CoverageBar, CoverageNote } from "./value-faces";

/** Awaiting visits from today to the window's end: what Confirm can act on. */
export function awaitingInWindow(plan: KitchenView | undefined, windowStart: number) {
  if (!plan) return [];
  const visits: Visit[] = [];
  const from = Math.max(windowStart, TODAY_DAY);
  for (let day = from; day < windowStart + WINDOW_DAYS; day++) {
    const cell = plan.cells.get(day);
    if (cell?.visit && cell.kind === "proposed") visits.push(cell.visit);
  }
  return visits;
}

export function KitchenCell({ kitchen }: { kitchen: Kitchen }) {
  const { openKitchen } = usePlanActions();
  const manager = MANAGER_BY_ID.get(kitchen.managerId);
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <button
        type="button"
        data-cell-interactive=""
        onClick={(event) => openKitchen(kitchen.id, event.currentTarget)}
        className="cursor-pointer truncate text-start font-medium text-foreground underline-offset-2 transition-colors hover:text-primary hover:underline"
      >
        {kitchen.name}
      </button>
      <span className="truncate text-xs text-muted-foreground">
        {manager?.name ?? "No manager"}
      </span>
    </div>
  );
}

export function CoverageCell({ kitchen }: { kitchen: Kitchen }) {
  const { plans } = usePlanView();
  const plan = plans.get(kitchen.id);
  if (!plan) return null;
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <CoverageBar coverage={plan.coverage} />
      <CoverageNote coverage={plan.coverage} />
    </div>
  );
}

export function ActionsCell({ kitchen }: { kitchen: Kitchen }) {
  const actions = usePlanActions();
  const { plans, windowStart } = usePlanView();
  const awaiting = awaitingInWindow(plans.get(kitchen.id), windowStart);
  // Menu items unmount on select, so focus returns to the row's trigger.
  const origin = () => document.querySelector<HTMLElement>(`[data-row-actions="${kitchen.id}"]`);

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              data-row-actions={kitchen.id}
              aria-label={`Actions for ${kitchen.name}`}
            />
          }
        >
          {UI_ICONS.more}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-auto">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Kitchen</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => actions.openKitchen(kitchen.id, origin())}>
              {UI_ICONS.view}
              View Kitchen
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.editKitchen(kitchen.id, origin())}>
              {UI_ICONS.edit}
              Edit Kitchen
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Visits</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => actions.openBooking({ kitchenId: kitchen.id }, origin())}
            >
              {UI_ICONS.book}
              Book Visit
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={awaiting.length === 0}
              onClick={() => actions.confirmVisits(awaiting)}
            >
              {UI_ICONS.confirm}
              Confirm Awaiting
              {awaiting.length > 0 ? (
                <Badge variant="outline" className="ms-auto tabular-nums">
                  {awaiting.length}
                </Badge>
              ) : null}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => actions.requestRemoveKitchens([kitchen.id], origin())}
            >
              {UI_ICONS.trash}
              Remove Kitchen
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
