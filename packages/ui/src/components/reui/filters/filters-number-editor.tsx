import { cn } from "cn"
import { Button } from "#components/shadcn/button"
import { Slider } from "#components/shadcn/slider"
import type { FilterEditorProps } from "#components/reui/filters/filters-types"
import type { KeyboardEvent } from "react"

import { normalizeNumberFilterRange, type NumberFilterScale } from "./filters-number"

export function createNumberSliderEditor(scale: NumberFilterScale) {
  const { min, max, step, format } = scale

  return function NumberSliderEditor({
    value,
    onValueChange,
    commit,
    cancel,
    labels,
    field,
    operator,
    autoFocusProps,
  }: FilterEditorProps<number | number[]>) {
    if (operator.arity === "none") return null

    const dual = operator.arity === "range"
    const range = normalizeNumberFilterRange(value, scale)
    const single =
      typeof value === "number" && Number.isFinite(value) ? value : min
    const current = dual ? range : single
    const reading = dual
      ? labels.valueRange(format(range[0]), format(range[1]))
      : format(single)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault()
        commit(current)
      } else if (event.key === "Escape") {
        event.preventDefault()
        event.stopPropagation()
        cancel()
      }
    }

    return (
      <div className={cn("flex w-64 flex-col gap-2 p-2", field.className)}>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-muted-foreground min-w-0 truncate text-xs font-medium">
            {field.label}
          </span>
          <span className="shrink-0 text-sm font-medium tabular-nums">{reading}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
            {format(min)}
          </span>
          <Slider
            {...autoFocusProps}
            className="min-w-0 flex-1"
            value={dual ? range : [single]}
            min={min}
            max={max}
            step={step}
            onValueChange={(next) => {
              const nextValues = typeof next === "number" ? [next] : [...next]
              onValueChange(dual ? nextValues : nextValues[0])
            }}
            onKeyDown={onKeyDown}
          />
          <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
            {format(max)}
          </span>
        </div>
        <div className="flex items-center justify-end gap-1.5 pt-1">
          <Button variant="ghost" size="sm" onClick={cancel}>
            {labels.discard}
          </Button>
          <Button size="sm" onClick={() => commit(current)}>
            {labels.apply}
          </Button>
        </div>
      </div>
    )
  }
}
