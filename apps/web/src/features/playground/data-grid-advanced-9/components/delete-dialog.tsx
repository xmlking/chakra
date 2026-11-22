import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/shadcn/alert-dialog"

import { type Visit } from "./data"
import { plural } from "./plan-math"

/** Centred by layout, not the stock -50% translate: an odd height lands that on
 *  a half pixel and smears every 1px separator across two rows. */
const CRISP_CENTER = "inset-0 m-auto h-fit translate-x-0 translate-y-0"

/** One confirm for a row, the sheet and the selection bar. */
export type PendingRemoval = {
  ids: string[]
  /** The kitchen's name for one row; the count speaks for a batch. */
  name: string | null
  visitCount: number
  origin: HTMLElement | null
}

export function RemoveKitchensDialog({
  open,
  onOpenChange,
  pending,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Kept while the dialog closes, so the exit animation keeps its copy. */
  pending: PendingRemoval | null
  onConfirm: () => void
}) {
  const count = pending?.ids.length ?? 0
  const noun = count === 1 ? "Kitchen" : "Kitchens"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        size="sm"
        className={CRISP_CENTER}
        finalFocus={() =>
          pending?.origin?.isConnected ? pending.origin : true
        }
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {noun}?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-foreground font-medium">
              {pending?.name ?? plural(count, "kitchen")}
            </span>{" "}
            {count === 1 ? "leaves" : "leave"} the plan with{" "}
            <span className="tabular-nums">
              {plural(pending?.visitCount ?? 0, "visit")}
            </span>
            , history included. You can undo it straight after.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Remove {count === 1 ? noun : `${count} ${noun}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export type PendingCancel = {
  visit: Visit
  /** "Pest Control at Pilsen Taqueria on Wed, Oct 14" */
  label: string
  origin: HTMLElement | null
}

export function CancelVisitDialog({
  open,
  onOpenChange,
  pending,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  pending: PendingCancel | null
  onConfirm: () => void
}) {
  // A signed-off visit is a record; removing it rewinds the cycle.
  const record = pending?.visit.status === "done"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        size="sm"
        className={CRISP_CENTER}
        finalFocus={() =>
          pending?.origin?.isConnected ? pending.origin : true
        }
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            {record ? "Delete Record?" : "Cancel Visit?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-foreground font-medium">
              {pending?.label}
            </span>{" "}
            {record
              ? "leaves the history, and the cycle counts from the visit before it."
              : "comes off the plan, and its cycle shows as unbooked again."}{" "}
            You can undo it straight after.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            {record ? "Delete Record" : "Cancel Visit"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}