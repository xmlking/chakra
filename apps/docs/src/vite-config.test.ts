import { expect, it, vi } from "vite-plus/test";

import config from "../vite.config";

vi.mock("../env", () => ({ ENV: { DOCS_BASE_PATH: "/" } }));

it("dedupes Waku so FumaPress shares the docs router context", () => {
  expect(config.resolve?.dedupe).toContain("waku");
});
