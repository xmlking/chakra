/**
 * `pg` parses Postgres `interval` columns into a `postgres-interval` object
 * (with a `toPostgres()` method), not the plain string Drizzle's column type
 * declares. This reformats either shape back into a re-parseable interval
 * string for display and for form default values.
 */
export function formatInterval(value: unknown): string {
  if (value && typeof value === "object" && "toPostgres" in value) {
    return (value as { toPostgres: () => string }).toPostgres();
  }
  if (typeof value === "string") return value;
  return "";
}
