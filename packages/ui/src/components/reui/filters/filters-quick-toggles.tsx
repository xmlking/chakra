import { createFilterRule } from "#components/reui/filters/filters-query"
import type { FilterQuery } from "#components/reui/filters/filters-types"
import { Badge } from "#components/shadcn/badge"
import { Tabs, TabsList, TabsTrigger } from "#components/shadcn/tabs"
import { ToggleGroup, ToggleGroupItem } from "#components/shadcn/toggle-group"

/** Sentinel for "no value selected" in exclusive mode; never written into the query. */
const ALL_VALUE = "__all__"
/** Sentinel for "a restriction exists but doesn't map to a single known tab". */
const UNRESOLVED_VALUE = "__unresolved__"

/** One quick-filter chip/tab: its raw value, label, and an optional row count badge. */
export interface FilterQuickToggleOption {
  value: string
  label: string
  count?: number
}

export interface FilterQuickTogglesProps {
  /** Field path segment these chips control, e.g. `"status"`. */
  field: string
  options: FilterQuickToggleOption[]
  query: FilterQuery
  onQueryChange: (query: FilterQuery) => void
  /** Underline tabs (ReUI data-grid-filtering style) with a built-in "All", instead of multi-select chips. */
  exclusive?: boolean
  /** Row count badge for the built-in "All" tab; exclusive mode only. */
  allCount?: number
  className?: string
  ariaLabel?: string
}

/**
 * Values currently applied to `field` by any positive (non-negated) `is` /
 * `is_any_of` rule, so a toggle lights up even when the same condition was
 * built manually through the full filter editor. Root-level only, matching
 * the scope `buildFieldRules` writes to.
 */
function getActiveValues(query: FilterQuery, field: string): string[] {
  const values: string[] = []
  for (const node of query.rules) {
    if (node.type !== "rule" || node.negated || node.path[0] !== field) continue
    const rule = node
    if (rule.operator === "is" && typeof rule.value === "string") {
      values.push(rule.value)
    } else if (rule.operator === "is_any_of" && Array.isArray(rule.value)) {
      values.push(...rule.value.filter((value): value is string => typeof value === "string"))
    }
  }
  return values
}

/** Replaces `field`'s rule(s) with one covering `selected`, or drops it once empty. */
function buildFieldRules(query: FilterQuery, field: string, selected: string[]) {
  const rules = query.rules.filter((node) => node.type !== "rule" || node.path[0] !== field)
  if (selected.length > 0) {
    rules.push(
      createFilterRule({
        id: `${field}-quick`,
        path: [field],
        operator: selected.length === 1 ? "is" : "is_any_of",
        value: selected.length === 1 ? selected[0] : selected,
      }),
    )
  }
  return rules
}

/**
 * One-click filter toggles for a single select field. Renders independent
 * multi-select chips by default (`ToggleGroup`), or mutually exclusive
 * underline tabs with counts via `exclusive` (`Tabs`) — matching the ReUI
 * data-grid-filtering-2 tab pattern using only components already in the repo.
 */
export function FilterQuickToggles({
  field,
  options,
  query,
  onQueryChange,
  exclusive = false,
  allCount,
  className,
  ariaLabel,
}: FilterQuickTogglesProps) {
  const activeValues = getActiveValues(query, field)
  const label = ariaLabel ?? `${field} quick filters`

  if (exclusive) {
    const fieldRules = query.rules.filter((node) => node.type === "rule" && node.path[0] === field)
    // "All" only means no root-level rule restricts the field; anything that
    // doesn't collapse to exactly one rule with one known option leaves every
    // tab unselected instead of falsely highlighting "All".
    const activeTab =
      fieldRules.length === 0
        ? ALL_VALUE
        : fieldRules.length === 1 &&
          activeValues.length === 1 &&
          options.some((option) => option.value === activeValues[0])
          ? activeValues[0]
          : UNRESOLVED_VALUE
    const handleTabChange = (nextTab: string) => {
      const selected = nextTab === ALL_VALUE ? [] : [nextTab]
      onQueryChange({ ...query, rules: buildFieldRules(query, field, selected) })
    }

    return (
      <Tabs value={activeTab} onValueChange={handleTabChange} className={className}>
        <TabsList variant="line" aria-label={label}>
          <TabsTrigger value={ALL_VALUE}>
            All
            {allCount !== undefined ? <Badge variant="secondary">{allCount}</Badge> : null}
          </TabsTrigger>
          {options.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {option.label}
              {option.count !== undefined ? <Badge variant="secondary">{option.count}</Badge> : null}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    )
  }

  const handleValueChange = (nextValues: string[]) => {
    onQueryChange({ ...query, rules: buildFieldRules(query, field, nextValues) })
  }

  return (
    <ToggleGroup
      multiple
      spacing={0}
      variant="outline"
      size="sm"
      value={activeValues}
      onValueChange={handleValueChange}
      className={className}
      aria-label={label}
    >
      {options.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value}>
          {option.label}
          {option.count !== undefined ? <Badge variant="secondary">{option.count}</Badge> : null}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}