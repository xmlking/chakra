import { renderMermaidSVG } from "beautiful-mermaid";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";

export async function Mermaid({ chart }: { chart: string }) {
  try {
    const svg = renderMermaidSVG(chart, {
      bg: "var(--color-fd-background)",
      fg: "var(--color-fd-foreground)",
      // Edge/message labels default to a too-dim bg/fg mix; use the theme's muted-foreground for a softer, legible gray.
      muted: "var(--color-fd-muted-foreground)",
      accent: "var(--color-fd-primary)",
      surface: "var(--color-fd-card)",
      border: "var(--color-fd-border)",

      interactive: true,
      transparent: true,
    });

    return <div dangerouslySetInnerHTML={{ __html: svg }} />;
  } catch {
    return (
      <CodeBlock title="Mermaid">
        <Pre>{chart}</Pre>
      </CodeBlock>
    );
  }
}
