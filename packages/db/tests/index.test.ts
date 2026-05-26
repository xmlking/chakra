import { expect, test } from "vite-plus/test";

export function fn() {
  return "Hello, tsdown!";
}

test("fn", () => {
  expect(fn()).toBe("Hello, tsdown!");
});
