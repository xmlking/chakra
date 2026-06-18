import { createFileRoute } from "@tanstack/react-router";

import { HeroSection } from "#features/theme/components/hero-section";
import { ThemesSection } from "#features/theme/components/themes-section";

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
