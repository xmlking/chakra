import { Badge } from "@workspace/ui/components/reui/badge";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";

import { UI_ICONS } from "./icons";
import { CELL_KINDS, plural, type CellKind } from "./plan-math";
import { STATUS_FACE, StatusTile } from "./value-faces";

/** The tile at menu-row size: 20px, the same face the matrix draws. */
const MENU_TILE = "[--icon-tile-icon-size:--spacing(3)] [--icon-tile-size:--spacing(5)]";

/** The check sits just before the counts, so the counts close the row. */
const CHECK_BEFORE_COUNT = "pe-1.5 [&_[data-slot=dropdown-menu-checkbox-item-indicator]]:end-7";

/** The matrix draws visits only, so the key lists the visit statuses. */
const MENU_KINDS = CELL_KINDS.filter((kind) => kind !== "due");

/** The status filter, which is also the matrix key: picked statuses keep
 *  those kitchens and fade other tiles. */
export function StatusBand({
  counts,
  focus,
  onFocusChange,
}: {
  counts: Record<CellKind, number>;
  focus: ReadonlySet<CellKind>;
  onFocusChange: (next: CellKind[]) => void;
}) {
  const picked = MENU_KINDS.filter((kind) => focus.has(kind)).length;
  const toggle = (kind: CellKind, checked: boolean) =>
    onFocusChange(MENU_KINDS.filter((item) => (item === kind ? checked : focus.has(item))));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            aria-label={
              picked > 0 ? `Status, ${plural(picked, "status", "statuses")} picked` : "Status"
            }
          />
        }
      >
        Status
        {picked > 0 ? (
          <Badge variant="outline" radius="full" className="tabular-nums max-sm:hidden">
            {picked}
          </Badge>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-auto min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Show visits in view</DropdownMenuLabel>
          {MENU_KINDS.map((kind) => (
            <DropdownMenuCheckboxItem
              key={kind}
              checked={focus.has(kind)}
              className={CHECK_BEFORE_COUNT}
              onCheckedChange={(checked) => toggle(kind, checked === true)}
            >
              <StatusTile kind={kind} className={MENU_TILE} />
              {STATUS_FACE[kind].label}
              <span className="ms-auto ps-10 text-xs font-semibold text-foreground tabular-nums">
                {counts[kind]}
              </span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* A footer action, not a status: it clears the picks above. */}
        <div className="flex justify-end">
          {/* Held still on press: at the menu's foot the stock 1px nudge
              reads as the button dropping into the padding. */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="active:translate-y-0"
            onClick={() => onFocusChange([])}
          >
            {UI_ICONS.clearFilter}
            Show All
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Icon only below md, where the toolbar's full labels would wrap it. */
const ICON_BELOW_MD = "max-md:aspect-square max-md:px-0";

/** Books every unbooked due day in view, with the lightest certified crews. */
export function BookAllButton({
  unbooked,
  onBookAll,
}: {
  unbooked: number;
  onBookAll: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className={ICON_BELOW_MD}
      disabled={unbooked === 0}
      aria-label={`Book all ${plural(unbooked, "unbooked visit")}`}
      onClick={onBookAll}
    >
      {UI_ICONS.book}
      <span className="max-md:sr-only">Book All</span>
    </Button>
  );
}
