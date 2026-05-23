import { expect, test } from "vite-plus/test";
import { page } from "vite-plus/test/browser";
import { render } from "vitest-browser-react";

import { HelloWorld } from "./hello-world.tsx";

const body = page.elementLocator(document.body);

test("renders name", async () => {
  const { getByText } = await render(<HelloWorld name="Vitest" />);
  await body.click();
  await expect.element(getByText("Hello Vitest!")).toBeVisible();
});
