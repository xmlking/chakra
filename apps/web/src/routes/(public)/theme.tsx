import { createFileRoute } from "@tanstack/react-router";

import { HeroSection } from "#features/home/components/hero-section";
import { ThemesSection } from "#features/home/components/themes-section";

export const Route = createFileRoute("/(public)/theme")({
  component: ThemeRoute,
});

function ThemeRoute() {
  return (
    <>
      <HeroSection />
      <ThemesSection />
    </>
  );
}
