"use client";

import { sortedThemes } from "@workspace/ui/lib/themes-config";

import { ThemeCard } from "#features/home/components/theme-card";

export function ThemesSection() {
  return (
    <section id="themes" className="border-b bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose Your Theme</h2>
          <p className="mt-4 text-muted-foreground">Click any theme to preview it live.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedThemes.map((t) => (
            <ThemeCard
              key={t.name}
              name={t.name}
              title={t.title}
              primaryLight={t.primaryLight}
              primaryDark={t.primaryDark}
              fontSans={t.fontSans}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
