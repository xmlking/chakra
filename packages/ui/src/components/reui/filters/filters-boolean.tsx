import type { FilterValueDisplayContext } from "#components/reui/filters/filters-types"

export function formatBooleanFilterValue(
  value: unknown,
  labels: { true: string; false: string; empty: string } = {
    true: "on",
    false: "off",
    empty: "any value",
  },
): string {
  if (value === true) return labels.true
  if (value === false) return labels.false
  return labels.empty
}

export function matchesBooleanFilter(
  raw: unknown,
  operator: string,
  values: unknown[],
): boolean | null {
  const isEmpty =
    raw === null || raw === undefined || (typeof raw === "string" && raw.trim() === "")
  if (operator === "empty") return isEmpty
  if (operator === "not_empty") return !isEmpty
  if (typeof raw !== "boolean") return null

  const value = values[0]
  if (typeof value !== "boolean") return null

  switch (operator) {
    case "is":
      return raw === value
    case "is_not":
      return raw !== value
    default:
      return null
  }
}

export function getBooleanFilterValueText(
  { value }: FilterValueDisplayContext,
  labels?: { true: string; false: string; empty: string },
): string {
  return formatBooleanFilterValue(value, labels)
}
