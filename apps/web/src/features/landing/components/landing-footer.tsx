import { BoxIcon } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BoxIcon className="size-4" />
          </span>
          <span className="text-sm font-semibold">Acme</span>
        </div>
        <p className="text-sm text-muted-foreground" suppressHydrationWarning={true}>
          © {new Date().getFullYear()} Acme Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
