"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Check } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";

import { ThemeSwitcherPreview } from "#features/home/components/theme-switcher-preview";

const REGISTRY_URL = "https://tweakcn-picker.vercel.app/r/nextjs/theme-system.json";

const PACKAGE_MANAGERS = [
  { id: "pnpm", label: "pnpm", command: "pnpm dlx shadcn@latest add" },
  { id: "npx", label: "npm", command: "npx shadcn@latest add" },
  { id: "bun", label: "bun", command: "bunx --bun shadcn@latest add" },
  { id: "yarn", label: "yarn", command: "npx shadcn@latest add" },
] as const;

const INSTALL_COMMAND = `${PACKAGE_MANAGERS[0].command} ${REGISTRY_URL}`;

const TERMINAL_LINES = [
  { text: "Fetching registry...", delay: 600 },
  { text: "Found 43 themes", delay: 400 },
  { text: "Installing next-themes...", delay: 300 },
  { text: "Creating theme files...", delay: 400 },
  { text: "  + 43 theme CSS files", delay: 200 },
  { text: "  + components/theme-provider.tsx", delay: 150 },
];

const SUCCESS_LINE = "Done! Theme system ready.";

// oxlint-disable-next-line react-doctor/prefer-useReducer
export function HeroSection() {
  const [typedCommand, setTypedCommand] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);

  useEffect(() => {
    if (typedCommand.length < INSTALL_COMMAND.length) {
      const timeout = setTimeout(
        () => {
          setTypedCommand(INSTALL_COMMAND.slice(0, typedCommand.length + 1));
        },
        25 + Math.random() * 20,
      );
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      setTimeout(() => showTerminalLinesSequence(), 400);
    }
  }, [typedCommand]);

  const showTerminalLinesSequence = async () => {
    await TERMINAL_LINES.reduce(
      (promise, line) =>
        promise.then(() =>
          new Promise<void>((resolve) => setTimeout(resolve, line.delay)).then(() => {
            setTerminalLines((prev) => [...prev, line.text]);
          }),
        ),
      Promise.resolve(),
    );
    await new Promise((resolve) => setTimeout(resolve, 300));
    setShowSuccess(true);
    // Show component preview
    await new Promise((resolve) => setTimeout(resolve, 600));
    setShowPreview(true);
    // Open main menu
    await new Promise((resolve) => setTimeout(resolve, 400));
    setShowMainMenu(true);
    // Open sub menu with themes
    await new Promise((resolve) => setTimeout(resolve, 500));
    setShowSubMenu(true);
  };

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/50 to-background">
      <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-[0.02]" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-12 flex flex-col items-center text-center">
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            43+ themes
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Add a complete theme picker to your shadcn/ui app with a single command. OKLCH colors,
            custom fonts, light & dark modes for every theme.
          </p>
        </div>

        <div className="pb-16">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-0">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 lg:items-start">
              {/* Terminal */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden rounded-xl border-2 bg-zinc-950 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-2 sm:px-4 sm:py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="ml-2 font-mono text-xs text-zinc-500">Terminal</span>
                  </div>
                </div>

                <div className="h-56 overflow-hidden p-3 font-mono text-[11px] sm:h-60 sm:p-4 sm:text-xs md:text-sm">
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 text-emerald-400">$</span>
                    <div className="flex-1 break-all">
                      <span className="text-zinc-200">{typedCommand}</span>
                      {isTyping && (
                        <m.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="ml-0.5 inline-block h-3.5 w-1.5 bg-zinc-200 align-middle"
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-0.5">
                    <AnimatePresence>
                      {terminalLines.map((line, i) => (
                        <m.div
                          // oxlint-disable-next-line react-doctor/no-array-index-as-key
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15 }}
                          className={cn(
                            "text-zinc-400",
                            line.startsWith("  +") && "text-cyan-400",
                            line.startsWith("Found") && "text-emerald-400",
                            line.startsWith("Installing") && "text-amber-400",
                            line.startsWith("Creating") && "text-amber-400",
                          )}
                        >
                          {line}
                        </m.div>
                      ))}
                    </AnimatePresence>

                    <AnimatePresence>
                      {showSuccess && (
                        <m.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-2 flex items-center gap-2 border-t border-zinc-800 pt-2 text-emerald-400"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>{SUCCESS_LINE}</span>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </m.div>

              {/* Theme Switcher Preview - shows the actual component with menus */}
              <div
                className={cn(
                  "flex min-h-[420px] items-start justify-start transition-opacity duration-300 sm:min-h-[450px]",
                  showPreview ? "opacity-100" : "opacity-0",
                )}
              >
                <m.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ThemeSwitcherPreview showMainMenu={showMainMenu} showSubMenu={showSubMenu} />
                </m.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
