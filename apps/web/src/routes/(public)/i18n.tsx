import logo from "/logo.svg";
import { createFileRoute } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { m } from "@workspace/i18n/messages";

import { LocaleSwitcher } from "#components/locale-switcher";

export const Route = createFileRoute("/(public)/i18n")({
  component: App,
});

// FIXME: https://github.com/ascorbic/unpic-img/issues/862
// oxlint-disable-next-line react/only-export-components
function App() {
  return (
    <div className="text-center">
      <header className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#282c34] text-[calc(10px+2vmin)] text-white">
        <Image
          src={logo}
          alt="Logo"
          layout="constrained"
          height={40}
          aspectRatio={1}
          className="pointer-events-none h-[40vmin] animate-[spin_20s_linear_infinite]"
        />
        <p>{m.example_message({ username: "TanStack Router" })}</p>
        <a
          className="text-[#61dafb] hover:underline"
          href="https://inlang.com/m/gerre34r/library-inlang-paraglideJs"
          target="_blank"
          rel="noopener noreferrer"
        >
          {m.learn_router()}
        </a>
        <div className="mt-3">
          <LocaleSwitcher />
        </div>
      </header>
    </div>
  );
}
