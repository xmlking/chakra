import { useHydrated } from "@tanstack/react-router";
import { useTheme, type UseThemeProps } from "next-themes";
import { afterAll, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import { render } from "vitest-browser-react";

import { ThemeSwitcher } from "./theme-switcher.tsx";

const mockSetTheme = vi.fn<UseThemeProps["setTheme"]>();

vi.mock("next-themes", () => ({
  useTheme: vi.fn<typeof useTheme>(),
}));

vi.mock("@tanstack/react-router", () => ({
  useHydrated: vi.fn<typeof useHydrated>(),
}));

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useHydrated).mockReturnValue(true);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("renders system theme by default", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: undefined,
      setTheme: mockSetTheme,
      themes: ["system", "light", "dark"],
    });

    const screen = await render(<ThemeSwitcher />);

    await expect
      .element(screen.getByRole("button", { name: /theme: system/i }))
      .toBeInTheDocument();
  });

  it("renders light theme", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
      themes: ["system", "light", "dark"],
    });

    const screen = await render(<ThemeSwitcher />);

    await expect.element(screen.getByRole("button", { name: /theme: light/i })).toBeInTheDocument();
  });

  it("renders dark theme", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
      themes: ["system", "light", "dark"],
    });

    const screen = await render(<ThemeSwitcher />);

    await expect.element(screen.getByRole("button", { name: /theme: dark/i })).toBeInTheDocument();
  });

  it("cycles from system -> light", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "system",
      setTheme: mockSetTheme,
      themes: ["system", "light", "dark"],
    });

    const screen = await render(<ThemeSwitcher />);

    await userEvent.click(screen.getByRole("button"));

    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("cycles from light -> dark", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
      themes: ["system", "light", "dark"],
    });

    const screen = await render(<ThemeSwitcher />);

    await userEvent.click(screen.getByRole("button"));

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("cycles from dark -> system", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
      themes: ["system", "light", "dark"],
    });

    const screen = await render(<ThemeSwitcher />);

    await userEvent.click(screen.getByRole("button"));

    expect(mockSetTheme).toHaveBeenCalledWith("system");
  });

  it("does not render icon when not hydrated", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
      themes: ["system", "light", "dark"],
    });

    vi.mocked(useHydrated).mockReturnValue(false);

    const screen = await render(<ThemeSwitcher />);

    await expect.element(screen.getByRole("button")).toBeInTheDocument();

    expect(document.querySelector("svg")).toBeNull();
  });
});
