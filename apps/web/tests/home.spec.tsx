import { useHydrated } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { render } from "vitest-browser-react";

beforeEach(() => {
  vi.stubGlobal("__APP_VERSION__", "1.0.0");
  vi.stubGlobal("__GIT_TAG__", "1.0.0");
  vi.stubGlobal("__GIT_SHA__", "xyz");
  vi.stubGlobal("__GIT_TIME__", new Date().toISOString());
});

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useHydrated: vi.fn<typeof useHydrated>(() => true),
  };
});

import { Route } from "../src/routes/(public)/index.tsx";

const Home = Route.options.component!;

describe("Home route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the project overview card", async () => {
    const { getByText } = await render(<Home />);

    await expect.element(getByText("Project Overview")).toBeInTheDocument();
    await expect.element(getByText(/Track progress and recent activity/i)).toBeInTheDocument();
  });
});
