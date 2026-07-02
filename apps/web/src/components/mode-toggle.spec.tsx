import { useHydrated } from "@tanstack/react-router";
import { useTheme, type UseThemeProps } from "next-themes";
import { afterAll, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import { render } from "vitest-browser-react";

import { ModeToggle } from "./mode-toggle.tsx";

const mockSetTheme = vi.fn<UseThemeProps["setTheme"]>();

vi.mock("next-themes", () => ({
  useTheme: vi.fn<typeof useTheme>(),
}));

vi.mock("@tanstack/react-router", () => ({
  useHydrated: vi.fn<typeof useHydrated>(),
}));

describe("ModeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useHydrated).mockReturnValue(true);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("renders light variant", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "default-light",
      setTheme: mockSetTheme,
      themes: ["default-light", "default-dark"],
    });

    const screen = await render(<ModeToggle />);

    await expect
      .element(screen.getByRole("button", { name: /theme: default-light/i }))
      .toBeInTheDocument();
  });

  it("renders dark variant", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "default-dark",
      setTheme: mockSetTheme,
      themes: ["default-light", "default-dark"],
    });

    const screen = await render(<ModeToggle />);

    await expect
      .element(screen.getByRole("button", { name: /theme: default-dark/i }))
      .toBeInTheDocument();
  });

  it("toggles *-light to *-dark on click", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "default-light",
      setTheme: mockSetTheme,
      themes: ["default-light", "default-dark"],
    });

    const screen = await render(<ModeToggle />);

    await userEvent.click(screen.getByRole("button"));

    expect(mockSetTheme).toHaveBeenCalledWith("default-dark");
  });

  it("toggles *-dark to *-light on click", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "default-dark",
      setTheme: mockSetTheme,
      themes: ["default-light", "default-dark"],
    });

    const screen = await render(<ModeToggle />);

    await userEvent.click(screen.getByRole("button"));

    expect(mockSetTheme).toHaveBeenCalledWith("default-light");
  });

  it("toggles custom *-dark theme to *-light", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "ocean-dark",
      setTheme: mockSetTheme,
      themes: ["default-light", "default-dark", "ocean-dark", "ocean-light"],
    });

    const screen = await render(<ModeToggle />);

    await userEvent.click(screen.getByRole("button"));

    expect(mockSetTheme).toHaveBeenCalledWith("ocean-light");
  });

  it("toggles custom *-light theme to *-dark", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "ocean-light",
      setTheme: mockSetTheme,
      themes: ["default-light", "default-dark", "ocean-dark", "ocean-light"],
    });

    const screen = await render(<ModeToggle />);

    await userEvent.click(screen.getByRole("button"));

    expect(mockSetTheme).toHaveBeenCalledWith("ocean-dark");
  });

  it("does not render icon when not hydrated", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "default-light",
      setTheme: mockSetTheme,
      themes: ["default-light", "default-dark"],
    });

    vi.mocked(useHydrated).mockReturnValue(false);

    const screen = await render(<ModeToggle />);

    await expect.element(screen.getByRole("button")).toBeInTheDocument();

    expect(document.querySelector("svg")).toBeNull();
  });
});
