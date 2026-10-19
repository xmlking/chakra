import type { FilterValueDisplayContext } from "#components/reui/filters/filters-types"
import type { FilterOperator } from "#components/reui/filters/filters-types"

export interface NumberFilterScale {
  min: number
  max: number
  step: number
  format: (value: number) => string
}

export function normalizeNumberFilterRange(
  value: unknown,
  scale: NumberFilterScale,
): [number, number] {
  const range = Array.isArray(value) ? value : []
  const from = readFiniteNumber(range[0])
  const to = readFiniteNumber(range[1])
  if (from === null && to === null) return [scale.min, scale.max]
  return [from ?? scale.min, to ?? scale.max]
}

function MiniTrack({
  min,
  max,
  from,
  to,
}: {
  min: number
  max: number
  from: number
  to: number
}) {
  const span = max - min
  const at = (value: number) =>
    span <= 0 || !Number.isFinite(value)
      ? 0
      : Math.min(Math.max((value - min) / span, 0), 1)
  const start = at(from)
  const end = Math.max(start, at(to))

  return (
    <span
      aria-hidden="true"
      className="bg-muted relative inline-block h-1 w-8 shrink-0 rounded-full"
    >
      <span
        className="bg-primary absolute inset-y-0 rounded-full"
        style={{ left: `${start * 100}%`, right: `${(1 - end) * 100}%` }}
      />
    </span>
  )
}

function readNumberBand(
  scale: NumberFilterScale,
  { value, operator, labels }: FilterValueDisplayContext
) {
  const { min, max, format } = scale
  if (Array.isArray(value)) {
    const from = readFiniteNumber(value[0])
    const to = readFiniteNumber(value[1])
    if (from === null && to === null) return null
    const [rangeFrom, rangeTo] = normalizeNumberFilterRange(value, scale)
    return { from: rangeFrom, to: rangeTo, text: labels.valueRange(format(rangeFrom), format(rangeTo)) }
  }
  if (typeof value !== "number" || !Number.isFinite(value)) return null

  const upward = operator.value === "gte" || operator.value === "gt"
  return {
    from: upward ? value : min,
    to: upward ? max : value,
    text: format(value),
  }
}

export function createNumberSliderDisplay(
  scale: NumberFilterScale,
  empty: string,
) {
  const { min, max, format } = scale

  return {
    renderValue: (context: FilterValueDisplayContext) => {
      const band = readNumberBand(scale, context)
      if (!band) return empty

      return (
        <span className="flex items-center gap-1.5">
          <MiniTrack min={min} max={max} from={band.from} to={band.to} />
          <span className="flex items-baseline gap-1">
            <span className="tabular-nums">{band.text}</span>
            {band.text.includes(format(max)) ? null : (
              <span className="text-muted-foreground text-xs tabular-nums">
                / {format(max)}
              </span>
            )}
          </span>
        </span>
      )
    },
    valueText: (context: FilterValueDisplayContext) =>
      readNumberBand(scale, context)?.text ?? empty,
  }
}

export function matchesNumberFilter(
  raw: unknown,
  operator: string,
  values: unknown[],
): boolean | null {
  const isEmpty =
    raw === null || raw === undefined || (typeof raw === "string" && raw.trim() === "")
  if (operator === "empty") return isEmpty
  if (operator === "not_empty") return !isEmpty

  const number = readFiniteNumber(raw)
  if (number === null) return null

  if (operator === "between" || operator === "not_between") {
    const from = readFiniteNumber(values[0])
    const to = readFiniteNumber(values[1])
    if (from === null || to === null) return null
    const inRange = number >= from && number <= to
    return operator === "between" ? inRange : !inRange
  }

  const value = readFiniteNumber(values[0])
  if (value === null) return null

  switch (operator) {
    case "eq":
      return number === value
    case "neq":
      return number !== value
    case "gt":
      return number > value
    case "gte":
      return number >= value
    case "lt":
      return number < value
    case "lte":
      return number <= value
    default:
      return null
  }
}

function readFiniteNumber(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null
  if (typeof value === "string" && value.trim() === "") return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

export function formatNumberFilterValue(
  values: unknown[],
  operator: FilterOperator,
  format: (value: number) => string = String,
): string {
  if (operator.arity === "range") {
    const from = readFiniteNumber(values[0])
    const to = readFiniteNumber(values[1])
    if (from === null && to === null) return ""
    if (from === null) return to === null ? "" : format(to)
    if (to === null) return format(from)
    return `${format(from)} - ${format(to)}`
  }

  const value = readFiniteNumber(values[0])
  return value === null ? "" : format(value)
}
