import { expect, test } from "vite-plus/test";

import { fn } from "../src/helpers.ts";

test("fn", () => {
  expect(fn()).toBe("Hello, tsdown!");
});
