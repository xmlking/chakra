import {
  formatFilterDate,
  parseFilterDate,
  resolveFilterDate,
  toFilterDateValue,
  type DateFilterValue,
  type FilterDateValue,
} from "#components/reui/filters/filters-date"
import type { FilterEditorProps } from "#components/reui/filters/filters-types"
import { Button } from "#components/shadcn/button"
import { Calendar } from "#components/shadcn/calendar"
import { Input } from "#components/shadcn/input"
import { useState } from "react"
import type { KeyboardEvent } from "react"

const DAY_GRID = "p-0 [--cell-size:--spacing(7)] [&_.rdp-month]:gap-2 [&_tbody_tr]:mt-1"

const RANGE_PRESETS: { label: string; value: [FilterDateValue, FilterDateValue] }[] = [
  {
    label: "Last 7 days",
    value: [{ relative: { unit: "day", offset: -6 } }, { relative: { unit: "day", offset: 0 } }],
  },
  {
    label: "Last 30 days",
    value: [{ relative: { unit: "day", offset: -29 } }, { relative: { unit: "day", offset: 0 } }],
  },
]

export function DateFilterEditor(props: FilterEditorProps<DateFilterValue>) {
  if (props.operator.arity === "none") return null
  return props.operator.arity === "range" ? (
    <DateRangeFilterEditor {...props} />
  ) : (
    <SingleDateFilterEditor {...props} />
  )
}

function DateRangeFilterEditor({
  value,
  onValueChange,
  commit,
  cancel,
  autoFocusProps,
  labels,
}: FilterEditorProps<DateFilterValue>) {
  const range = Array.isArray(value) ? value : []
  const from = range[0] ? resolveFilterDate(range[0]) : null
  const to = range[1] ? resolveFilterDate(range[1]) : null

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="grid grid-cols-2 gap-1.5">
        {RANGE_PRESETS.map(({ label, value }, index) => (
          <Button
            key={label}
            {...(index === 0 ? autoFocusProps : {})}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => commit(value)}
          >
            {label}
          </Button>
        ))}
      </div>
      <Calendar
        mode="range"
        numberOfMonths={2}
        className={DAY_GRID}
        selected={{ from: from ?? undefined, to: to ?? undefined }}
        defaultMonth={from ?? undefined}
        onSelect={(selected) => {
          if (!selected?.from) return
          onValueChange([
            toFilterDateValue(selected.from),
            toFilterDateValue(selected.to ?? selected.from),
          ])
        }}
      />
      <div className="-mx-2 flex items-center justify-end gap-1.5 border-t px-2 pt-2">
        <Button type="button" variant="ghost" size="sm" onClick={cancel}>
          {labels.discard}
        </Button>
        <Button type="button" size="sm" disabled={!from} onClick={() => commit()}>
          {labels.apply}
        </Button>
      </div>
    </div>
  )
}

function SingleDateFilterEditor({
  field,
  value,
  onValueChange,
  commit,
  cancel,
  autoFocusProps,
}: FilterEditorProps<DateFilterValue>) {
  const singleValue = Array.isArray(value) ? value[0] : value
  const selectedDate = singleValue ? resolveFilterDate(singleValue) : null
  const displayValue = singleValue ? formatFilterDate(singleValue) : ""
  const [inputDraft, setInputDraft] = useState({ source: displayValue, text: displayValue })
  const inputValue = inputDraft.source === displayValue ? inputDraft.text : displayValue
  const parsedValue = parseFilterDate(inputValue)

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault()
      commit(parsedValue ?? singleValue)
    } else if (event.key === "Escape") {
      event.preventDefault()
      event.stopPropagation()
      cancel()
    }
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <Input
        {...autoFocusProps}
        value={inputValue}
        placeholder="today, next friday..."
        aria-label={field.label}
        onChange={(event) => {
          const nextInput = event.target.value
          const parsed = parseFilterDate(nextInput)
          const source = parsed ? formatFilterDate(parsed) : displayValue
          setInputDraft({ source, text: nextInput })
          if (parsed) onValueChange(parsed)
        }}
        onKeyDown={handleKeyDown}
      />
      <Calendar
        mode="single"
        className={DAY_GRID}
        selected={selectedDate ?? undefined}
        defaultMonth={selectedDate ?? undefined}
        onSelect={(date) => {
          if (date) commit(toFilterDateValue(date))
        }}
      />
    </div>
  )
}
