import { Button } from "@workspace/ui/components/shadcn/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
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
import { Switch } from "@workspace/ui/components/shadcn/switch"

import { UI_ICONS } from "./icons"

export type GridDensity = "compact" | "comfortable"

export interface GridSettings {
  density: GridDensity
  columnLines: boolean
  rowStripes: boolean
}

// Column lines start on: they draw the day grid the eye reads across.
export const DEFAULT_GRID_SETTINGS: GridSettings = {
  density: "compact",
  columnLines: true,
  rowStripes: false,
}

const DENSITY_OPTIONS: { value: GridDensity; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
]

const ID = "data-grid-advanced-9-settings"

function SwitchRow({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <Field
      orientation="horizontal"
      className="min-h-9 items-center justify-between gap-3"
    >
      <FieldLabel htmlFor={id} className="text-sm font-normal">
        {label}
      </FieldLabel>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </Field>
  )
}

export function SettingsMenu({
  settings,
  onChange,
}: {
  settings: GridSettings
  onChange: (patch: Partial<GridSettings>) => void
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Settings"
          >
            {UI_ICONS.settings}
          </Button>
        }
      />
      <PopoverContent align="end" className="w-72">
        <FieldGroup>
          <FieldSet className="gap-1">
            <FieldLegend variant="label">Appearance</FieldLegend>
            <Field
              orientation="horizontal"
              className="min-h-9 items-center justify-between gap-3"
            >
              <FieldLabel
                htmlFor={`${ID}-density`}
                className="text-sm font-normal"
              >
                Density
              </FieldLabel>
              <Select
                value={settings.density}
                items={DENSITY_OPTIONS}
                onValueChange={(value) => {
                  const next = DENSITY_OPTIONS.find(
                    (option) => option.value === value
                  )
                  if (next) onChange({ density: next.value })
                }}
              >
                <SelectTrigger id={`${ID}-density`} className="w-36 shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false}>
                  <SelectGroup>
                    {DENSITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <SwitchRow
              id={`${ID}-column-lines`}
              label="Column lines"
              checked={settings.columnLines}
              onCheckedChange={(columnLines) => onChange({ columnLines })}
            />
            <SwitchRow
              id={`${ID}-row-stripes`}
              label="Row stripes"
              checked={settings.rowStripes}
              onCheckedChange={(rowStripes) => onChange({ rowStripes })}
            />
          </FieldSet>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  )
}