import { createContext, useContext } from "react"

import {
  type Kitchen,
  type ServiceId,
  type Technician,
  type Visit,
} from "./data"
import { type CellKind, type Coverage, type KitchenPlan } from "./plan-math"

export interface BookPrefill {
  kitchenId?: string
  service?: ServiceId
  date?: string
}

export interface PlanActions {
  /** origin: the control that opened it, which takes focus back on close. */
  openKitchen: (kitchenId: string, origin: HTMLElement | null) => void
  editKitchen: (kitchenId: string, origin: HTMLElement | null) => void
  requestRemoveKitchens: (ids: string[], origin: HTMLElement | null) => void
  openBooking: (prefill: BookPrefill | null, origin: HTMLElement | null) => void
  editVisit: (visitId: string, origin: HTMLElement | null) => void
  confirmVisits: (visits: Visit[]) => void
  /** Signs a visit off on the day the crew came, with its job sheet. */
  markDone: (visit: Visit, signOff: { date: string; report: string }) => void
  moveVisit: (visit: Visit, iso: string) => void
  requestCancelVisit: (visit: Visit, origin: HTMLElement | null) => void
  /** The certified technician with the lightest week, read from every visit. */
  suggestTechnician: (service: ServiceId, iso: string) => Technician
}

export interface KitchenView extends KitchenPlan {
  coverage: Coverage
  /** Visits of this kitchen, all services, for the reschedule calendar. */
  visits: Visit[]
}

export interface PlanView {
  windowStart: number
  plans: Map<string, KitchenView>
  /** Kinds the status band singles out; empty shows every kind at full ink. */
  focus: ReadonlySet<CellKind>
  /** The grid's rows in order, every page: a day header lists across them. */
  kitchens: Kitchen[]
}

const ActionsContext = createContext<PlanActions | null>(null)
const ViewContext = createContext<PlanView | null>(null)

export const PlanActionsProvider = ActionsContext.Provider
export const PlanViewProvider = ViewContext.Provider

export function usePlanActions() {
  const actions = useContext(ActionsContext)
  if (!actions)
    throw new Error("Plan cells must render inside PlanActionsProvider")
  return actions
}

export function usePlanView() {
  const view = useContext(ViewContext)
  if (!view) throw new Error("Plan cells must render inside PlanViewProvider")
  return view
}