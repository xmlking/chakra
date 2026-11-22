export function sanitizeSlug(value: string) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")
}
