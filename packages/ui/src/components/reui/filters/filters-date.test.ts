import { describe, expect, it } from "vite-plus/test"

import {
  DATE_FILTER_OPERATORS,
  formatDateFilterValue,
  matchesDateFilter,
} from "./filters-date"

const now = new Date(2026, 3, 1, 12)

describe("matchesDateFilter", () => {
  it("exposes the standard date operator labels", () => {
    expect(DATE_FILTER_OPERATORS.map(({ label }) => label)).toEqual([
      "is",
      "is not",
      "is before",
      "is after",
      "is on or before",
      "is on or after",
      "is between",
      "is not between",
      "is empty",
      "is not empty",
    ])
  })

  it("matches exact, relative, and Date values by calendar day", () => {
    expect(matchesDateFilter("2026-04-10", "is", [{ date: "2026-04-10" }], now)).toBe(true)
    expect(matchesDateFilter("2026-04-11", "is", [{ date: "2026-04-10" }], now)).toBe(false)
    expect(matchesDateFilter("2026-04-11", "is_not", [{ date: "2026-04-10" }], now)).toBe(true)
    expect(matchesDateFilter(new Date(2026, 3, 10, 18), "is", [{ date: "2026-04-10" }], now)).toBe(
      true,
    )
    expect(
      matchesDateFilter("2026-04-03", "is", [{ relative: { unit: "day", offset: 2 } }], now),
    ).toBe(true)
  })

  it("matches date bounds and inclusive ranges", () => {
    expect(matchesDateFilter("2026-04-09", "is_before", [{ date: "2026-04-10" }], now)).toBe(true)
    expect(matchesDateFilter("2026-04-10", "is_after", [{ date: "2026-04-09" }], now)).toBe(true)
    expect(
      matchesDateFilter("2026-04-10", "is_on_or_before", [{ date: "2026-04-10" }], now),
    ).toBe(true)
    expect(
      matchesDateFilter("2026-04-10", "is_on_or_after", [{ date: "2026-04-10" }], now),
    ).toBe(true)
    expect(
      matchesDateFilter(
        "2026-04-10",
        "between",
        [{ date: "2026-04-10" }, { date: "2026-04-20" }],
        now,
      ),
    ).toBe(true)
    expect(
      matchesDateFilter(
        "2026-04-21",
        "not_between",
        [{ date: "2026-04-10" }, { date: "2026-04-20" }],
        now,
      ),
    ).toBe(true)
  })

  it("matches empty values and leaves invalid conditions unanswered", () => {
    expect(matchesDateFilter(null, "empty", [], now)).toBe(true)
    expect(matchesDateFilter("", "empty", [], now)).toBe(true)
    expect(matchesDateFilter("2026-04-10", "empty", [], now)).toBe(false)
    expect(matchesDateFilter(null, "not_empty", [], now)).toBe(false)
    expect(matchesDateFilter("2026-04-10", "not_empty", [], now)).toBe(true)
    expect(matchesDateFilter("not-a-date", "is", [{ date: "2026-04-10" }], now)).toBe(null)
    expect(matchesDateFilter("2026-04-10", "between", [{ date: "2026-04-01" }], now)).toBe(null)
  })

  it("formats selected dates and ranges for filter chips", () => {
    expect(formatDateFilterValue([{ date: "2026-04-10" }], DATE_FILTER_OPERATORS[0])).toBe(
      "Apr 10, 2026",
    )
    expect(
      formatDateFilterValue(
        [{ date: "2026-04-10" }, { date: "2026-04-20" }],
        DATE_FILTER_OPERATORS[6],
      ),
    ).toBe("Apr 10, 2026 - Apr 20, 2026")
  })
})
