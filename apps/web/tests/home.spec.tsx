import { describe, expect, it, vi } from "vite-plus/test";
import { render } from "vitest-browser-react";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

import { Route } from "../src/routes/index.tsx";

const Home = Route.options.component!;

describe("Home route", () => {
  it("renders the hero kicker and headline", async () => {
    const { getByText } = await render(<Home />);

    await expect.element(getByText("TanStack Start Base Template")).toBeInTheDocument();
    await expect.element(getByText("Start simple, ship quickly.")).toBeInTheDocument();
  });

  it("renders the About link to the about route", async () => {
    const { getByRole } = await render(<Home />);

    const aboutLink = getByRole("link", { name: /about this starter/i });
    await expect.element(aboutLink).toBeInTheDocument();
    await expect.element(aboutLink).toHaveAttribute("href", "/about");
  });

  it("renders the feature cards", async () => {
    const { getByText } = await render(<Home />);

    await expect.element(getByText("Type-Safe Routing")).toBeInTheDocument();
    await expect.element(getByText("Server Functions")).toBeInTheDocument();
    await expect.element(getByText("Streaming by Default")).toBeInTheDocument();
    await expect.element(getByText("Tailwind Native")).toBeInTheDocument();
  });

  it("renders the project overview card", async () => {
    const { getByText } = await render(<Home />);

    await expect.element(getByText("Project Overview")).toBeInTheDocument();
    await expect.element(getByText(/Track progress and recent activity/i)).toBeInTheDocument();
  });
});
