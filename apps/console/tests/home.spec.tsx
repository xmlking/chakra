import { useTheme, type UseThemeProps } from "@lonik/themer";
import { useHydrated } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { render } from "vitest-browser-react";

vi.mock("@lonik/themer", () => ({
  useTheme: vi.fn<typeof useTheme>(() => ({
    theme: "system",
    setTheme: vi.fn<UseThemeProps["setTheme"]>(),
    themes: ["system", "light", "dark"],
  })),
}));

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useHydrated: vi.fn<typeof useHydrated>(() => true),
  };
});

import { Route } from "../src/routes/index.tsx";

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

  it("renders the theme switcher", async () => {
    const { getByTitle } = await render(<Home />);

    await expect.element(getByTitle(/theme: system/i)).toBeInTheDocument();
  });
});
