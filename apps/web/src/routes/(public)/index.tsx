import { createFileRoute } from "@tanstack/react-router";

import { CtaSection } from "#features/landing/ui/cta-section";
import { Features } from "#features/landing/ui/features";
import { Hero } from "#features/landing/ui/hero";

export const Route = createFileRoute("/(public)/")({
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <>
      <Hero />
      <Features />
      <CtaSection />
    </>
  );
}
