export function fn() {
  return "Hello, tsdown!";
}

export function formatStringToDate(inputString: string, locale = "en") {
  const date = new Date(inputString);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const isUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if the value is a Date object.
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?(Z|[+-]\d{2}:\d{2})?$/;

/**
 * Check if the value is a string that represents an ISO date string.
 */
export function isIsoDateString(value: string): boolean {
  return ISO_DATE_REGEX.test(value);
}

if (import.meta.vitest) {
  /**
   * in-source testing
   * RUN: vp test -t "test helpers"
   */
  const { it, expect } = import.meta.vitest;

  it("test helpers", () => {
    expect(isIsoDateString("2023-10-10T10:10:10Z")).toBe(true);
    expect(isDate(new Date())).toBe(true);
    expect(isUrl("https://example.com")).toBe(true);
    expect(isUrl("not-a-url")).toBe(false);
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
