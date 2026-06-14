const DEFAULT_REDIRECT = "/dashboard";
const AUTH_PATH_PATTERN = /^\/auth(\/|$|[?#])/;

export function safeRedirect(input: unknown): string {
  if (typeof input !== "string" || input.length === 0) {
    return DEFAULT_REDIRECT;
  }
  if (!input.startsWith("/")) {
    return DEFAULT_REDIRECT;
  }
  // Block protocol-relative and backslash-escaped paths to avoid open redirect.
  if (input.startsWith("//") || input.startsWith("/\\")) {
    return DEFAULT_REDIRECT;
  }
  // Don't loop back into the auth flow.
  if (AUTH_PATH_PATTERN.test(input)) {
    return DEFAULT_REDIRECT;
  }
  return input;
}
