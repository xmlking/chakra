import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/shadcn/button";
// import { Separator } from "@workspace/ui/components/shadcn/separator";
import { ThemeSwitcher } from "@workspace/ui/components/theme-switcher";

import { ModeToggle } from "#components/mode-toggle";

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center">
            <span className="text-lg font-bold tracking-tight">Chakra</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={
              <a
                href="https://xmlking.github.io/chakra/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
              />
            }
            className="hidden sm:flex"
          >
            Docs
          </Button>

          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={
              <a
                href="https://github.com/xmlking/chakra"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
              />
            }
          >
            <span className="hidden sm:inline">GitHub</span>
          </Button>

          {/* <Separator orientation="vertical" className="mx-1 h-6" /> */}

          <ModeToggle />
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}
