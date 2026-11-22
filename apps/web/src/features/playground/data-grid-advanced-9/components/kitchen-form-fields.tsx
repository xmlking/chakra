import { useState } from "react"
import { cn } from "cn"

import { Button } from "@workspace/ui/components/shadcn/button"
import { Calendar } from "@workspace/ui/components/shadcn/calendar"
import { Checkbox } from "@workspace/ui/components/shadcn/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/shadcn/field"
import { Input } from "@workspace/ui/components/shadcn/input"
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/shadcn/toggle-group"

import {
  MANAGER_BY_ID,
  MANAGERS,
  SERVICE_IDS,
  SERVICES,
  TODAY,
  VOLUME_LABEL,
  VOLUMES,
  type Kitchen,
  type KitchenDraft,
} from "./data"
import { UI_ICONS } from "./icons"
import { formatDay, fromIsoDay, toIsoDay } from "./plan-math"
import { PersonFace } from "./value-faces"

export const NAME_LIMIT = 40

export type KitchenErrors = Partial<
  Record<"name" | "address" | "managerId" | "services", string>
>

export const KITCHEN_ERROR_ORDER: (keyof KitchenErrors)[] = [
  "name",
  "address",
  "managerId",
  "services",
]

/** The input id behind each error. */
export const KITCHEN_ERROR_INPUT: Record<keyof KitchenErrors, string> = {
  name: "name",
  address: "address",
  managerId: "manager",
  services: `service-${SERVICE_IDS[0]}`,
}

export function validateKitchen(
  draft: KitchenDraft,
  kitchens: Kitchen[],
  /** The kitchen being edited, so its own name is not a clash. */
  editingId: string | null
): KitchenErrors {
  const errors: KitchenErrors = {}
  const name = draft.name.trim()
  if (!name) errors.name = "Add the kitchen's name."
  else if (name.length > NAME_LIMIT)
    errors.name = `Keep the name under ${NAME_LIMIT} characters.`
  else if (
    kitchens.some(
      (item) =>
        item.id !== editingId && item.name.toLowerCase() === name.toLowerCase()
    )
  )
    errors.name = "Another kitchen already has this name."
  if (!draft.address.trim())
    errors.address = "Add the street address the crews drive to."
  if (!MANAGER_BY_ID.has(draft.managerId))
    errors.managerId = "Pick the area manager who hosts visits."
  if (draft.services.length === 0)
    errors.services = "Keep at least one service in the plan."
  return errors
}

/** A kitchen with history joins on its real cycle: the day each service was
 *  last done, never a future one. A second click on the day clears it. */
function LastDonePicker({
  id,
  label,
  value,
  disabled,
  onPick,
}: {
  id: string
  label: string
  value: string | undefined
  disabled: boolean
  onPick: (day: string | undefined) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            aria-label={`${label} last done, ${value ? formatDay(value) : "never"}`}
            className="w-24 shrink-0 justify-start font-normal"
          />
        }
      >
        <span className="text-muted-foreground inline-flex shrink-0">
          {UI_ICONS.calendar}
        </span>
        <span
          className={cn(
            "truncate tabular-nums",
            !value && "text-muted-foreground"
          )}
        >
          {value ? formatDay(value) : "Never"}
        </span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value ? fromIsoDay(value) : undefined}
          defaultMonth={fromIsoDay(value ?? TODAY)}
          disabled={(date) => toIsoDay(date) > TODAY}
          onSelect={(date) => {
            setOpen(false)
            onPick(date ? toIsoDay(date) : undefined)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

const MANAGER_ITEMS = MANAGERS.map((person) => ({
  value: person.id,
  label: person.name,
}))

export function KitchenFormFields({
  idPrefix,
  values,
  errors,
  editing,
  onChange,
}: {
  idPrefix: string
  values: KitchenDraft
  /** Shown only after a refused save; editing never nags before that. */
  errors: KitchenErrors
  editing: boolean
  onChange: (patch: Partial<KitchenDraft>) => void
}) {
  const hood = SERVICES.hood.cycle

  return (
    <FieldGroup className="gap-5">
      <Field data-invalid={errors.name ? true : undefined}>
        <FieldLabel htmlFor={`${idPrefix}-name`}>Name</FieldLabel>
        <Input
          id={`${idPrefix}-name`}
          value={values.name}
          maxLength={NAME_LIMIT + 10}
          placeholder="Neighborhood and concept"
          autoComplete="off"
          aria-invalid={errors.name ? true : undefined}
          onChange={(event) => onChange({ name: event.target.value })}
        />
        {errors.name ? <FieldError>{errors.name}</FieldError> : null}
      </Field>

      <Field data-invalid={errors.address ? true : undefined}>
        <FieldLabel htmlFor={`${idPrefix}-address`}>Address</FieldLabel>
        <Input
          id={`${idPrefix}-address`}
          value={values.address}
          maxLength={80}
          placeholder="Street and city"
          autoComplete="street-address"
          aria-invalid={errors.address ? true : undefined}
          onChange={(event) => onChange({ address: event.target.value })}
        />
        {errors.address ? <FieldError>{errors.address}</FieldError> : null}
      </Field>

      <Field data-invalid={errors.managerId ? true : undefined}>
        <FieldLabel htmlFor={`${idPrefix}-manager`}>Area Manager</FieldLabel>
        <Select
          value={values.managerId || null}
          items={MANAGER_ITEMS}
          onValueChange={(next) => {
            const match = MANAGERS.find((person) => person.id === next)
            if (match) onChange({ managerId: match.id })
          }}
        >
          <SelectTrigger
            id={`${idPrefix}-manager`}
            className="w-full"
            aria-invalid={errors.managerId ? true : undefined}
          >
            {/* The render function owns the empty text, which the trigger mutes. */}
            <SelectValue>
              {(id: string | null) => {
                const person = id ? MANAGER_BY_ID.get(id) : undefined
                return person ? (
                  <PersonFace person={person} />
                ) : (
                  "Pick a manager"
                )
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" alignItemWithTrigger={false}>
            <SelectGroup>
              {MANAGERS.map((person) => (
                <SelectItem key={person.id} value={person.id}>
                  <PersonFace person={person} meta={person.role} />
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.managerId ? <FieldError>{errors.managerId}</FieldError> : null}
      </Field>

      <Field>
        <FieldLabel id={`${idPrefix}-volume-label`}>Cooking Volume</FieldLabel>
        <ToggleGroup
          variant="outline"
          spacing={0}
          aria-labelledby={`${idPrefix}-volume-label`}
          value={[values.volume]}
          onValueChange={(value) => {
            // Pressing the active option keeps it: a kitchen always has one.
            const match = VOLUMES.find((volume) => volume === value[0])
            if (match) onChange({ volume: match })
          }}
        >
          {VOLUMES.map((volume) => (
            <ToggleGroupItem key={volume} value={volume}>
              {VOLUME_LABEL[volume]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <FieldDescription>
          Sets the hood cycle: every {hood.high} days at high volume,{" "}
          {hood.moderate} at moderate
        </FieldDescription>
      </Field>

      <FieldSet data-invalid={errors.services ? true : undefined}>
        <FieldLegend variant="label">Services</FieldLegend>
        <FieldDescription>
          {editing
            ? "Unchecking a service cancels its open visits"
            : "Set when each was last done; without a date it is due today"}
        </FieldDescription>
        <FieldGroup className="gap-3">
          {SERVICE_IDS.map((id) => {
            const checked = values.services.includes(id)
            const cycle = SERVICES[id].cycle[values.volume]
            return (
              <Field key={id} orientation="horizontal">
                <Checkbox
                  id={`${idPrefix}-service-${id}`}
                  checked={checked}
                  aria-invalid={errors.services ? true : undefined}
                  onCheckedChange={(next) =>
                    onChange({
                      services: SERVICE_IDS.filter((item) =>
                        item === id
                          ? next === true
                          : values.services.includes(item)
                      ),
                    })
                  }
                />
                {/* With a date picker beside it the cycle sits under the
                    name, so a long name never wraps on a phone. */}
                <FieldLabel
                  htmlFor={`${idPrefix}-service-${id}`}
                  className={cn(
                    "flex-1 font-normal",
                    editing
                      ? "justify-between"
                      : "flex-col items-start gap-1 whitespace-nowrap"
                  )}
                >
                  {SERVICES[id].label}
                  <span className="text-muted-foreground text-xs tabular-nums">
                    Every {cycle} days
                  </span>
                </FieldLabel>
                {editing ? null : (
                  <LastDonePicker
                    id={`${idPrefix}-last-${id}`}
                    label={SERVICES[id].label}
                    value={values.priorDone[id]}
                    disabled={!checked}
                    onPick={(day) =>
                      onChange({
                        priorDone: { ...values.priorDone, [id]: day },
                      })
                    }
                  />
                )}
              </Field>
            )
          })}
        </FieldGroup>
        {errors.services ? <FieldError>{errors.services}</FieldError> : null}
      </FieldSet>
    </FieldGroup>
  )
}