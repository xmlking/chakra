import { describe, expect, it } from "vite-plus/test";

import { hostnameRegex, ipAddress } from "../src/regex.ts";

/** Milliseconds to test `input` once. */
function timeTest(regex: RegExp, input: string) {
  const start = performance.now();
  regex.test(input);
  return performance.now() - start;
}

describe("ipAddress", () => {
  it.each(["192.168.1.1", " 10.0.0.255 ", "::1", "2001:db8::8a2e:370:7334", "fe80::1%eth0"])(
    "accepts %s",
    (value) => {
      expect(ipAddress.test(value)).toBe(true);
    },
  );

  it.each(["256.1.1.1", "1.2.3", "fe80::1%", "fe80::1%eth 0", "not-an-ip"])(
    "rejects %s",
    (value) => {
      expect(ipAddress.test(value)).toBe(false);
    },
  );

  // `(%.+)?\s*$` let `.+` and `\s*` split trailing whitespace every possible way, so a long
  // whitespace run after `%` that fails to match took quadratic time (ReDoS).
  it("rejects a long whitespace run after the zone index in linear time", () => {
    expect(timeTest(ipAddress, `::1%${" ".repeat(50_000)}\nx`)).toBeLessThan(50);
  });
});

describe("hostnameRegex", () => {
  it.each(["localhost", "example.com", "abc-123", "a.b-c.d"])("accepts %s", (value) => {
    expect(hostnameRegex.test(value)).toBe(true);
  });

  it.each(["-abc", "abc-", "a..b", "exa mple.com", ""])("rejects %j", (value) => {
    expect(hostnameRegex.test(value)).toBe(false);
  });

  it("rejects long invalid input in linear time", () => {
    expect(timeTest(hostnameRegex, `${"aa-".repeat(20_000)}!`)).toBeLessThan(50);
  });
});
