import { matchesBooleanFilter } from "@workspace/ui/components/reui/filters/filters-boolean";
import { matchesDateFilter } from "@workspace/ui/components/reui/filters/filters-date";
import { matchesNumberFilter } from "@workspace/ui/components/reui/filters/filters-number";

import type { AttributeType } from "./data";

export function matchesCompanyFilterValue(
  fieldValue: unknown,
  operator: string,
  values: unknown[],
  attributeType?: AttributeType,
): boolean | null {
  if (
    attributeType === "number" ||
    attributeType === "currency" ||
    attributeType === "percent" ||
    attributeType === "rating"
  ) {
    return matchesNumberFilter(fieldValue, operator, values);
  }
  if (attributeType === "checkbox") {
    return matchesBooleanFilter(fieldValue, operator, values);
  }
  if (attributeType === "date") {
    return matchesDateFilter(fieldValue, operator, values);
  }

  const list = Array.isArray(fieldValue) ? fieldValue.map(String) : null;

  switch (operator) {
    case "is":
    case "is_any_of":
      return values.some((value) => String(value) === String(fieldValue));
    case "is_not":
    case "is_none_of":
      return !values.some((value) => String(value) === String(fieldValue));
    case "contains": {
      const tokens = values.map((value) => String(value).trim()).filter(Boolean);
      if (tokens.length === 0) return null;
      return tokens.some((token) => String(fieldValue).toLowerCase().includes(token.toLowerCase()));
    }
    case "not_contains":
      return !values.some((value) =>
        String(fieldValue).toLowerCase().includes(String(value).toLowerCase()),
      );
    case "starts_with":
      return values.some((value) =>
        String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase()),
      );
    case "ends_with":
      return values.some((value) =>
        String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase()),
      );
    case "has_any_of":
      return list ? values.some((value) => list.includes(String(value))) : false;
    case "has_all_of":
      return list ? values.every((value) => list.includes(String(value))) : false;
    case "has_none_of":
      return list ? !values.some((value) => list.includes(String(value))) : true;
    case "empty":
      return fieldValue === "" || fieldValue == null || list?.length === 0;
    case "not_empty":
      return fieldValue !== "" && fieldValue != null && list?.length !== 0;
    default:
      return null;
  }
}
