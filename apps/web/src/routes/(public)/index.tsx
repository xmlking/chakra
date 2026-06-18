import { createFileRoute } from "@tanstack/react-router";

import { CtaSection } from "#features/landing/components/cta-section";
import { Features } from "#features/landing/components/features";
import { Hero } from "#features/landing/components/hero";

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
