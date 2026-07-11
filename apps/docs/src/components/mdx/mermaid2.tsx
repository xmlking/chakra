import { renderMermaidSVG, type RenderOptions } from "beautiful-mermaid";

// Map the diagram's colors onto Fumadocs theme variables. beautiful-mermaid
// emits these as CSS custom properties on the SVG (e.g. --fg: var(...)), and
// the SVG's internals reference them, so diagrams follow light/dark with no
// client JS — the SVG is rendered to a string at build time.
const THEME: RenderOptions = {
  transparent: true,
  fg: "var(--color-fd-foreground)",
  line: "var(--color-fd-border)",
  accent: "var(--color-fd-primary)",
  muted: "var(--color-fd-muted-foreground)",
  surface: "var(--color-fd-card)",
  border: "var(--color-fd-border)",
};

function prepareSvg(raw: string): string {
  return (
    raw
      // Drop the embedded Google Fonts @import so diagrams stay self-contained.
      .replace(/@import url\([^)]*\);?/g, "")
      // Scale the SVG down to the content width instead of overflowing.
      .replace(/<svg\b([^>]*?)\bstyle="/, '<svg$1style="max-width:100%;height:auto;')
  );
}

export function Mermaid({ chart, label }: { chart: string; label?: string }) {
  const svg = prepareSvg(renderMermaidSVG(chart.trim(), THEME));
  return (
    <figure
      aria-label={label}
      style={{
        margin: "1.5rem 0",
        padding: "1.25rem",
        overflowX: "auto",
        border: "1px solid var(--color-fd-border)",
        borderRadius: "0.75rem",
        background: "color-mix(in oklab, var(--color-fd-card) 40%, transparent)",
      }}
    >
      <div
        style={{ margin: "0 auto", width: "fit-content", maxWidth: "100%" }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </figure>
  );
}
