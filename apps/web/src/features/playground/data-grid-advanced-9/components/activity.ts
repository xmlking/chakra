import {
  SERVICES,
  TECHNICIAN_BY_ID,
  VENDOR_BY_ID,
  type Kitchen,
  type Visit,
} from "./data"
import { formatDay } from "./plan-math"

export type EventKind =
  "booked" | "confirmed" | "moved" | "done" | "cancelled" | "edited"

export interface PlanEvent {
  id: string
  kitchenId: string
  kind: EventKind
  title: string
  detail?: string
  /** The job sheet number of a signed-off visit. */
  report?: string
  /** "You" for this session; the technician on a signed-off visit. */
  actor: string
  avatar?: string
  /** "Oct 9", or "Today, 9:31 AM" for a change made this session. */
  when: string
  /** Newest first: ISO day, then the session step. */
  sortKey: string
}

/** A fixed demo clock: this session's changes start at 9:30 AM, a minute apart. */
export function sessionTime(step: number) {
  const minutes = 9 * 60 + 30 + step
  const hour = Math.floor(minutes / 60) % 24
  const label = `${hour % 12 || 12}:${String(minutes % 60).padStart(2, "0")}`
  return `Today, ${label} ${hour < 12 ? "AM" : "PM"}`
}

/** Signed-off visits, newest first, as the job sheets recorded them. */
export function serviceRecords(kitchen: Kitchen, visits: Visit[]): PlanEvent[] {
  return visits
    .filter((visit) => visit.status === "done")
    .map((visit) => {
      const tech = TECHNICIAN_BY_ID.get(visit.technicianId)
      return {
        id: `rec_${visit.id}`,
        kitchenId: kitchen.id,
        kind: "done" as const,
        title: `${SERVICES[visit.service].label} done`,
        detail: visit.notes || undefined,
        report: visit.report,
        actor: tech?.name ?? "Unassigned",
        avatar: tech?.avatar,
        when: formatDay(visit.date),
        sortKey: visit.date,
      }
    })
    .sort((a, b) => b.sortKey.localeCompare(a.sortKey))
}

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`

/** Saves the signed-off visits as a CSV, the record an inspector asks for. */
export function downloadHistory(kitchen: Kitchen, visits: Visit[]) {
  const rows = visits
    .filter((visit) => visit.status === "done")
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((visit) => {
      const tech = TECHNICIAN_BY_ID.get(visit.technicianId)
      const vendor = tech ? VENDOR_BY_ID.get(tech.vendorId) : undefined
      return [
        visit.date,
        SERVICES[visit.service].label,
        tech?.name ?? "",
        vendor?.name ?? "",
        visit.report ?? "",
        visit.notes,
      ]
    })
  const header = ["Date", "Service", "Technician", "Vendor", "Report", "Notes"]
  const csv = [header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
  const link = document.createElement("a")
  link.href = url
  link.download = `${kitchen.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-service-history.csv`
  link.click()
  URL.revokeObjectURL(url)
  return rows.length
}