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
    Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  };
});

import { Route } from "../src/routes/(public)/index.tsx";

const Home = Route.options.component!;

describe("Home route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the hero section", async () => {
    const { getByText } = await render(<Home />);

    await expect.element(getByText(/Ship faster with one workspace/i)).toBeInTheDocument();
  });

  it("renders the features section", async () => {
    const { getByText } = await render(<Home />);

    await expect.element(getByText(/Everything your team needs to ship/i)).toBeInTheDocument();
  });
});
