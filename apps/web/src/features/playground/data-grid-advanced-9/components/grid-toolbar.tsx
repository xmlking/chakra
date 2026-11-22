import { useState, type ReactNode, type RefObject } from "react"
import { cn } from "cn"

import { Button } from "@workspace/ui/components/shadcn/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/shadcn/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/shadcn/select"

import { SERVICE_IDS, SERVICES, type ServiceId } from "./data"
import { UI_ICONS } from "./icons"
import { SettingsMenu, type GridSettings } from "./settings-menu"

const ALL = "all"

const SERVICE_ITEMS = [
  { value: ALL, label: "All Services", short: "All" },
  ...SERVICE_IDS.map((id) => ({
    value: id,
    label: SERVICES[id].label,
    short: SERVICES[id].short,
  })),
]

export interface GridToolbarProps {
  searchRef: RefObject<HTMLInputElement | null>
  searchQuery: string
  onSearchChange: (value: string) => void
  /** One service through every cell, count and coverage; null is all. */
  lens: ServiceId | null
  onLensChange: (lens: ServiceId | null) => void
  settings: GridSettings
  onSettingsChange: (patch: Partial<GridSettings>) => void
  /** The status filter, beside the fields. */
  status: ReactNode
  /** Row actions before Settings, at the end of the row. */
  actions: ReactNode
}

export function GridToolbar({
  searchRef,
  searchQuery,
  onSearchChange,
  lens,
  onLensChange,
  settings,
  onSettingsChange,
  status,
  actions,
}: GridToolbarProps) {
  // On a phone the field folds into a square button until it is used.
  const [searchOpen, setSearchOpen] = useState(false)
  const showSearch = searchOpen || searchQuery.length > 0
  const service =
    SERVICE_ITEMS.find((item) => item.value === (lens ?? ALL)) ??
    SERVICE_ITEMS[0]

  return (
    <div className="flex flex-wrap items-center gap-2 px-(--frame-panel-header-px) py-(--frame-panel-header-py)">
      {showSearch ? null : (
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Search kitchens"
          className="sm:hidden"
          onClick={() => {
            setSearchOpen(true)
            requestAnimationFrame(() => searchRef.current?.focus())
          }}
        >
          {UI_ICONS.search}
        </Button>
      )}
      <InputGroup
        className={cn("w-full sm:w-64", !showSearch && "max-sm:hidden")}
        // Leaving an empty field folds it back into the button on a phone.
        onBlur={(event) => {
          if (
            searchQuery.length === 0 &&
            !event.currentTarget.contains(event.relatedTarget)
          )
            setSearchOpen(false)
        }}
      >
        <InputGroupAddon align="inline-start">
          {UI_ICONS.search}
        </InputGroupAddon>
        <InputGroupInput
          ref={searchRef}
          placeholder="Kitchen, manager or crew..."
          aria-label="Search kitchens"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {searchQuery.length > 0 ? (
          <InputGroupAddon align="inline-end">
            {/* Focus goes back to the field: the button unmounts, and a
                phone folds the field only when focus leaves it. */}
            <InputGroupButton
              aria-label="Clear search"
              size="icon-xs"
              onClick={() => {
                onSearchChange("")
                searchRef.current?.focus()
              }}
            >
              {UI_ICONS.close}
            </InputGroupButton>
          </InputGroupAddon>
        ) : null}
      </InputGroup>

      <Select
        value={lens ?? ALL}
        items={SERVICE_ITEMS}
        onValueChange={(value) => {
          const next = SERVICE_IDS.find((id) => id === value)
          onLensChange(next ?? null)
        }}
      >
        {/* Below md the short name shows, so the toolbar keeps one row. */}
        <SelectTrigger className="w-44 max-md:w-28" aria-label="Service">
          <SelectValue>
            <span className="md:hidden">{service.short}</span>
            <span className="max-md:hidden">{service.label}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          <SelectGroup>
            <SelectLabel>Show visits for</SelectLabel>
            {SERVICE_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {status}

      <div className="ms-auto flex shrink-0 items-center gap-2">
        {actions}
        <SettingsMenu settings={settings} onChange={onSettingsChange} />
      </div>
    </div>
  )
}