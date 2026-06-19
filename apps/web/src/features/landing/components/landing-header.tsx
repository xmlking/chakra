import { Link } from "@tanstack/react-router";
import { Button, buttonVariants } from "@workspace/ui/components/shadcn/button";
import { ThemeSwitcher } from "@workspace/ui/components/theme-switcher";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowRightIcon, BoxIcon, MenuIcon } from "lucide-react";

// import { ModeToggle } from "#components/mode-toggle";

const navLinks = [
  { label: "Product", href: "/#features" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "/about" },
  { label: "Docs", href: "/#docs" },
];

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BoxIcon className="size-4" />
          </span>
          <span className="text-base font-semibold tracking-tight">Acme</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* <ModeToggle /> */}
          <ThemeSwitcher />
          <Link
            to="/auth/$path"
            params={{ path: "sign-in" }}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            Sign in
          </Link>
          <Link to="/dashboard" className={buttonVariants({ size: "sm" })}>
            Open app
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
