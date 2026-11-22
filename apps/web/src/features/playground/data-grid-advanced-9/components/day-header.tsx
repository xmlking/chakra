import { useRef, useState, type MouseEvent } from "react"
import { cn } from "cn"

import { Button } from "@workspace/ui/components/shadcn/button"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/shadcn/item"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@workspace/ui/components/shadcn/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/shadcn/tooltip"

import { isoOf, SERVICES, TECHNICIAN_BY_ID, TODAY_DAY } from "./data"
import { UI_ICONS } from "./icons"
import { usePlanActions, usePlanView } from "./plan-context"
import {
  CELL_KINDS,
  dateOfMonth,
  formatLongDay,
  monthYearOf,
  plural,
  weekdayLetters,
} from "./plan-math"
import {
  CAP_BOX,
  CAP_TRUNCATE,
  DotSeparator,
  STATUS_FACE,
  StatusTile,
} from "./value-faces"

/** Every day sits in the same tile-wide box, so all headers share one
 *  baseline and one spine with the tiles. The face stays bare: the header
 *  cell carries the wash, and its ::after makes the whole cell the target. */
const DAY_FACE =
  "h-auto w-6 cursor-pointer flex-col items-center gap-1.5 px-0 py-1.5 text-xs hover:bg-transparent dark:hover:bg-transparent aria-expanded:bg-transparent after:absolute after:inset-0"

/** 4px row inset, 1px border, 5px padding: the tile lands on the title's
 *  10px spine; 8px above and below gives the two lines room. */
const ROW_INSET = "hover:bg-muted px-1.25 py-2 text-left"

/** The tile centres on the two lines instead of riding the first one. */
const MEDIA_CENTRED =
  "group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center"

/** The popup is portaled but bubbles through React to the th; a press inside
 *  it must not reach the grid. */
const stopGridPress = (event: MouseEvent) => event.stopPropagation()

/** Date over weekday; a click lists the day across every kitchen. */
export function DayHeader({ offset }: { offset: number }) {
  const actions = usePlanActions()
  const { windowStart, plans, kitchens } = usePlanView()
  const [open, setOpen] = useState(false)
  // The month and year on hover; held back while the run sheet is open.
  const [hint, setHint] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  // Set when a row opens a sheet, which then owns focus.
  const handedOff = useRef(false)
  const day = windowStart + offset
  const iso = isoOf(day)
  const today = day === TODAY_DAY

  const entries = open
    ? kitchens
        .flatMap((kitchen) => {
          const cell = plans.get(kitchen.id)?.cells.get(day)
          return cell ? [{ kitchen, cell }] : []
        })
        .sort(
          (a, b) =>
            CELL_KINDS.indexOf(a.cell.kind) - CELL_KINDS.indexOf(b.cell.kind)
        )
    : []
  const unbooked = entries.filter(({ cell }) => cell.kind === "due").length
  const summary = [
    ...(today ? ["Today"] : []),
    ...(entries.length > unbooked
      ? [plural(entries.length - unbooked, "visit")]
      : []),
    ...(unbooked > 0 ? [`${unbooked} unbooked`] : []),
  ]

  const handOff = () => {
    handedOff.current = true
    setOpen(false)
    return triggerRef.current
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) handedOff.current = false
        setOpen(next)
      }}
    >
      {/* The popover trigger leads: a tooltip trigger outside it would
          swallow the click. */}
      <Tooltip open={hint && !open} onOpenChange={setHint}>
        <PopoverTrigger
          render={
            <TooltipTrigger
              render={
                <Button
                  ref={triggerRef}
                  type="button"
                  variant="ghost"
                  aria-label={`${formatLongDay(iso)}${today ? ", today" : ""}`}
                  data-today={today || undefined}
                  className={DAY_FACE}
                />
              }
            />
          }
        >
          <span className={cn(CAP_BOX, "font-medium tabular-nums")}>
            {dateOfMonth(day)}
          </span>
          <span
            className={cn(
              CAP_BOX,
              "font-normal",
              !today &&
                "text-muted-foreground group-hover/button:text-foreground group-aria-expanded/button:text-foreground"
            )}
          >
            {weekdayLetters(day)}
          </span>
        </PopoverTrigger>
        <TooltipContent>{monthYearOf(day)}</TooltipContent>
      </Tooltip>
      <PopoverContent
        align="center"
        className="w-80"
        ref={popupRef}
        // The popup takes focus, not its first row: Tab walks the rows.
        initialFocus={popupRef}
        finalFocus={() => !handedOff.current}
        onMouseDown={stopGridPress}
      >
        {/* The day and its count on one line, the count at the end. */}
        <PopoverHeader className="flex-row items-center justify-between gap-3">
          <PopoverTitle className="shrink-0">{formatLongDay(iso)}</PopoverTitle>
          <PopoverDescription className="flex min-w-0 items-center justify-end gap-2">
            {summary.length === 0 ? <span>No visits</span> : null}
            {summary.map((part, index) => (
              <span key={part} className="flex items-center gap-2">
                {index > 0 ? <DotSeparator /> : null}
                {part}
              </span>
            ))}
          </PopoverDescription>
        </PopoverHeader>
        {entries.length > 0 ? (
          // Rows sit 4px in from the popup's sides, and its foot when nothing
          // follows, 4px apart; past eight visits the list scrolls.
          <ItemGroup className="-mx-1.5 max-h-96 min-h-0 w-auto gap-1 overflow-y-auto last:-mb-1.5">
            {entries.map(({ kitchen, cell }) => {
              const tech = cell.visit
                ? TECHNICIAN_BY_ID.get(cell.visit.technicianId)
                : undefined
              return (
                <Item
                  key={kitchen.id}
                  size="xs"
                  className={ROW_INSET}
                  render={
                    <button
                      type="button"
                      onClick={() => actions.openKitchen(kitchen.id, handOff())}
                    />
                  }
                >
                  <ItemMedia className={MEDIA_CENTRED}>
                    <StatusTile kind={cell.kind} />
                  </ItemMedia>
                  <ItemContent className="min-w-0">
                    <ItemTitle className="w-full">
                      {/* Cap-trimmed lines: the row's air is the padding, not leading. */}
                      <span className={CAP_TRUNCATE}>
                        <span className="sr-only">
                          {STATUS_FACE[cell.kind].label},{" "}
                        </span>
                        {kitchen.name}
                      </span>
                    </ItemTitle>
                    <ItemDescription className="mt-2 flex min-w-0 items-center gap-1.5">
                      <span className={CAP_TRUNCATE}>
                        {SERVICES[cell.service].label}
                      </span>
                      <DotSeparator />
                      <span className={CAP_TRUNCATE}>
                        {cell.visit ? (tech?.name ?? "Unassigned") : "Unbooked"}
                      </span>
                    </ItemDescription>
                  </ItemContent>
                </Item>
              )
            })}
          </ItemGroup>
        ) : null}
        {/* Nothing can be booked into the past. */}
        {day >= TODAY_DAY ? (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => actions.openBooking({ date: iso }, handOff())}
            >
              {UI_ICONS.book}
              Book Visit
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}