import { Link } from "@tanstack/react-router";

export function HomeFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Powered by{" "}
              <a
                href="https://tanstack.com/start/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                TanStack Start
              </a>
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link to="/about">About</Link>
            <Link to="/i18n">i18n</Link>
            <a
              href="https://github.com/xmlking/chakra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>

            <a
              href="https://xmlking.github.io/chakra/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
