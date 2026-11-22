import { cn } from "cn"

import { Button } from "@workspace/ui/components/shadcn/button"

import { ICON_ON_PHONE, UI_ICONS } from "./icons"
import { plural } from "./plan-math"
import { DotSeparator } from "./value-faces"

/** Takes the toolbar's slot at the same height, so rows never shift. Every
 *  action works on the selected kitchens inside the current window. */
export function SelectionBar({
  count,
  awaiting,
  unbooked,
  onConfirm,
  onBook,
  onRemove,
  onClear,
}: {
  count: number
  awaiting: number
  unbooked: number
  onConfirm: () => void
  onBook: () => void
  onRemove: (origin: HTMLElement) => void
  onClear: () => void
}) {
  return (
    <div
      role="region"
      aria-label="Selected kitchens"
      className="bg-muted/40 flex flex-wrap items-center justify-between gap-2 px-(--frame-panel-header-px) py-(--frame-panel-header-py)"
    >
      <p className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-foreground font-medium tabular-nums">
          {plural(count, "kitchen")} selected
        </span>
        <DotSeparator />
        <span className="text-muted-foreground tabular-nums">
          {awaiting} awaiting
        </span>
        <DotSeparator />
        <span className="text-muted-foreground tabular-nums">
          {unbooked} unbooked
        </span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={awaiting === 0}
          className={ICON_ON_PHONE}
          onClick={onConfirm}
        >
          {UI_ICONS.confirm}
          <span className="max-sm:sr-only">Confirm All</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={unbooked === 0}
          className={ICON_ON_PHONE}
          onClick={onBook}
        >
          {UI_ICONS.book}
          <span className="max-sm:sr-only">Book All</span>
        </Button>
        <Button
          type="button"
          variant="destructive"
          // Outlined in its own tone, so it reads as a button beside the
          // outline ones; the soft red fill stays.
          className={cn(
            "border-destructive/30 dark:border-destructive/40",
            ICON_ON_PHONE
          )}
          onClick={(event) => onRemove(event.currentTarget)}
        >
          {UI_ICONS.trash}
          <span className="max-sm:sr-only">Remove</span>
        </Button>
        <Button type="button" variant="outline" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  )
}