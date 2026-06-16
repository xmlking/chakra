export function HomeFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Powered by{" "}
              <a
                href="https://tweakcn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                tweakcn
              </a>
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
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

            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              shadcn/ui
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
