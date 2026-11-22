import { useState } from "react"

import { Button } from "@workspace/ui/components/shadcn/button"
import { Calendar } from "@workspace/ui/components/shadcn/calendar"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/shadcn/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/shadcn/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/shadcn/select"
import { Textarea } from "@workspace/ui/components/shadcn/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/shadcn/toggle-group"

import {
  dayNumber,
  SERVICE_IDS,
  SERVICES,
  TECHNICIAN_BY_ID,
  techniciansFor,
  TODAY,
  TODAY_DAY,
  VENDOR_BY_ID,
  WINDOW_LABEL,
  WINDOWS,
  type Kitchen,
  type ServiceId,
  type Visit,
  type VisitDraft,
  type VisitWindow,
} from "./data"
import { UI_ICONS } from "./icons"
import {
  formatDay,
  formatLongDay,
  fromIsoDay,
  toIsoDay,
  type ServiceState,
} from "./plan-math"
import { PersonFace } from "./value-faces"

export const NOTES_LIMIT = 160

export type VisitErrors = Partial<
  Record<"kitchenId" | "service" | "date" | "technicianId", string>
>

/** The first invalid field, in reading order, takes focus on a refused save. */
export const VISIT_ERROR_ORDER: (keyof VisitErrors)[] = [
  "kitchenId",
  "service",
  "date",
  "technicianId",
]

/** The input id behind each error. */
export const VISIT_ERROR_INPUT: Record<keyof VisitErrors, string> = {
  kitchenId: "kitchen",
  service: "service",
  date: "date",
  technicianId: "technician",
}

export function validateVisit(
  draft: VisitDraft,
  kitchen: Kitchen | undefined,
  /** Days this kitchen already has a visit on, the edited one left out. */
  taken: ReadonlySet<string>,
  /** The service's open visit at this kitchen, the edited one left out. */
  open: Visit | null,
  /** The kitchen the technician is already at in this slot. */
  crewAt: string | null
): VisitErrors {
  const errors: VisitErrors = {}
  if (!kitchen) errors.kitchenId = "Pick the kitchen to visit."
  if (!draft.service) errors.service = "Pick the service to book."
  // One open visit per service: a second booking would double the crew.
  else if (open)
    errors.service = `Already ${dayNumber(open.date) < TODAY_DAY ? "missed" : "booked"} for ${formatLongDay(open.date)}. Move that visit instead.`
  if (!draft.date || draft.date < TODAY)
    errors.date = "Pick today or a later day."
  else if (kitchen && taken.has(draft.date))
    errors.date = `${kitchen.name} already has a visit that day.`
  const tech = TECHNICIAN_BY_ID.get(draft.technicianId)
  if (!tech || (draft.service && tech.service !== draft.service))
    errors.technicianId = "Pick a technician certified for this service."
  else if (crewAt)
    errors.technicianId = `${tech.name} is at ${crewAt} then. Pick another time or technician.`
  return errors
}

const STATUS_OPTIONS = [
  { value: "proposed", label: "Awaiting" },
  { value: "confirmed", label: "Confirmed" },
] as const

export function VisitFormFields({
  idPrefix,
  values,
  errors,
  editing,
  kitchens,
  taken,
  stateOf,
  suggest,
  onChange,
}: {
  idPrefix: string
  values: VisitDraft
  /** Shown only after a refused save; editing never nags before that. */
  errors: VisitErrors
  /** An edit keeps its kitchen and service; only the booking moves. */
  editing: boolean
  kitchens: Kitchen[]
  taken: ReadonlySet<string>
  /** The service's cycle at the picked kitchen, for the due hint. */
  stateOf: (kitchenId: string, service: ServiceId) => ServiceState | null
  /** The certified technician with the lightest week. */
  suggest: (service: ServiceId, iso: string, window: VisitWindow) => string
  onChange: (patch: Partial<VisitDraft>) => void
}) {
  const [dateOpen, setDateOpen] = useState(false)
  const kitchen = kitchens.find((item) => item.id === values.kitchenId)
  const services = kitchen
    ? SERVICE_IDS.filter((id) => kitchen.services.includes(id))
    : []
  const service = values.service || null
  const techs = service ? techniciansFor(service) : []
  const state = kitchen && service ? stateOf(kitchen.id, service) : null

  const kitchenItems = kitchens.map((item) => ({
    value: item.id,
    label: item.name,
  }))
  // A service with an open visit says so up front; booking it again is refused.
  const serviceItems = services.map((id) => {
    const open = kitchen ? stateOf(kitchen.id, id) : null
    const visit = open?.booked ?? open?.missed
    return {
      value: id,
      label: SERVICES[id].label,
      meta: visit
        ? `${open?.booked ? "Booked" : "Missed"} ${formatDay(visit.date)}`
        : null,
    }
  })
  const techItems = techs.map((tech) => ({ value: tech.id, label: tech.name }))
  const windowItems = WINDOWS.map((id) => ({
    value: id,
    label: WINDOW_LABEL[id],
  }))

  const pickService = (next: ServiceId) =>
    onChange({
      service: next,
      window: SERVICES[next].window,
      technicianId: suggest(next, values.date || TODAY, SERVICES[next].window),
    })

  return (
    <FieldGroup className="gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field data-invalid={errors.kitchenId ? true : undefined}>
          <FieldLabel htmlFor={`${idPrefix}-kitchen`}>Kitchen</FieldLabel>
          <Select
            value={values.kitchenId || null}
            items={kitchenItems}
            disabled={editing}
            onValueChange={(next) => {
              const match = kitchens.find((item) => item.id === next)
              if (!match) return
              const keep =
                values.service !== "" && match.services.includes(values.service)
              onChange(
                keep
                  ? { kitchenId: match.id }
                  : { kitchenId: match.id, service: "", technicianId: "" }
              )
            }}
          >
            <SelectTrigger
              id={`${idPrefix}-kitchen`}
              className="w-full"
              aria-invalid={errors.kitchenId ? true : undefined}
            >
              <SelectValue placeholder="Pick a kitchen" />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              <SelectGroup>
                {kitchenItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.kitchenId ? (
            <FieldError>{errors.kitchenId}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={errors.service ? true : undefined}>
          <FieldLabel htmlFor={`${idPrefix}-service`}>Service</FieldLabel>
          <Select
            value={values.service || null}
            items={serviceItems}
            disabled={editing || !kitchen}
            onValueChange={(next) => {
              const match = services.find((id) => id === next)
              if (match) pickService(match)
            }}
          >
            <SelectTrigger
              id={`${idPrefix}-service`}
              className="w-full"
              aria-invalid={errors.service ? true : undefined}
            >
              <SelectValue
                placeholder={
                  kitchen ? "Pick a service" : "Pick a kitchen first"
                }
              />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              <SelectGroup>
                {serviceItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                    {item.meta ? (
                      <span className="text-muted-foreground ms-auto ps-4 text-xs tabular-nums">
                        {item.meta}
                      </span>
                    ) : null}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.service ? <FieldError>{errors.service}</FieldError> : null}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field data-invalid={errors.date ? true : undefined}>
          <FieldLabel htmlFor={`${idPrefix}-date`}>Date</FieldLabel>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger
              render={
                <Button
                  id={`${idPrefix}-date`}
                  type="button"
                  variant="outline"
                  aria-invalid={errors.date ? true : undefined}
                  className="w-full justify-start font-normal"
                />
              }
            >
              <span className="text-muted-foreground inline-flex shrink-0">
                {UI_ICONS.reschedule}
              </span>
              {values.date ? (
                <span className="truncate tabular-nums">
                  {formatLongDay(values.date)}
                </span>
              ) : (
                <span className="text-muted-foreground truncate">
                  Pick a day
                </span>
              )}
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                required
                selected={values.date ? fromIsoDay(values.date) : undefined}
                defaultMonth={fromIsoDay(values.date || TODAY)}
                disabled={(date) => {
                  const iso = toIsoDay(date)
                  return iso < TODAY || taken.has(iso)
                }}
                onSelect={(date) => {
                  setDateOpen(false)
                  onChange({ date: toIsoDay(date) })
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.date ? (
            <FieldError>{errors.date}</FieldError>
          ) : state ? (
            <FieldDescription>
              {state.lapsed ? "Lapsed" : "Due"} {formatLongDay(state.due)}
            </FieldDescription>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor={`${idPrefix}-window`}>Time</FieldLabel>
          <Select
            value={values.window}
            items={windowItems}
            onValueChange={(next) => {
              const match = WINDOWS.find((id) => id === next)
              if (match) onChange({ window: match })
            }}
          >
            <SelectTrigger id={`${idPrefix}-window`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              <SelectGroup>
                {windowItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field data-invalid={errors.technicianId ? true : undefined}>
        <FieldLabel htmlFor={`${idPrefix}-technician`}>Technician</FieldLabel>
        <Select
          value={values.technicianId || null}
          items={techItems}
          disabled={!service}
          onValueChange={(next) => {
            const match = techs.find((tech) => tech.id === next)
            if (match) onChange({ technicianId: match.id })
          }}
        >
          <SelectTrigger
            id={`${idPrefix}-technician`}
            className="w-full"
            aria-invalid={errors.technicianId ? true : undefined}
          >
            {/* One line in the trigger; the vendor shows in the list. The
                render function owns the empty text, which the trigger mutes. */}
            <SelectValue>
              {(id: string | null) => {
                const tech = id ? TECHNICIAN_BY_ID.get(id) : undefined
                if (tech) return <PersonFace person={tech} />
                return service ? "Pick a technician" : "Pick a service first"
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" alignItemWithTrigger={false}>
            <SelectGroup>
              {techs.map((tech) => (
                <SelectItem key={tech.id} value={tech.id}>
                  <PersonFace
                    person={tech}
                    meta={VENDOR_BY_ID.get(tech.vendorId)?.name}
                  />
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.technicianId ? (
          <FieldError>{errors.technicianId}</FieldError>
        ) : service ? (
          <FieldDescription>
            Only crews certified for {SERVICES[service].label.toLowerCase()}
          </FieldDescription>
        ) : null}
      </Field>

      <Field>
        <FieldLabel id={`${idPrefix}-status-label`}>Status</FieldLabel>
        <ToggleGroup
          variant="outline"
          spacing={0}
          aria-labelledby={`${idPrefix}-status-label`}
          value={[values.status]}
          onValueChange={(value) => {
            // Pressing the active option keeps it: a booking always has one.
            const match = STATUS_OPTIONS.find(
              (option) => option.value === value[0]
            )
            if (match) onChange({ status: match.value })
          }}
        >
          {STATUS_OPTIONS.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <FieldDescription>
          Confirmed once the vendor has said yes to the day
        </FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor={`${idPrefix}-notes`}>
          Notes for the Crew
        </FieldLabel>
        <Textarea
          id={`${idPrefix}-notes`}
          value={values.notes}
          maxLength={NOTES_LIMIT}
          placeholder="Access, parking, who to ask for"
          onChange={(event) => onChange({ notes: event.target.value })}
        />
      </Field>
    </FieldGroup>
  )
}