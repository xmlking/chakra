import { docs, blog } from "collections/server";
import { loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

import { openapi } from "./openapi";
import { docsRoute } from "./shared";

export const source = loader(
  {
    docs: docs.toFumadocsSource(),
    blog: blog.toFumadocsSource({
      baseDir: "blog",
    }),
    openapi: await openapi.staticSource({
      baseDir: "openapi/(generated)",
    }),
  },
  {
    baseUrl: docsRoute,
    plugins: [lucideIconsPlugin(), openapi.loaderPlugin()],
  },
);

export function markdownPathToSlugs(segs: string[]) {
  if (segs.length === 0) return [];

  const out = [...segs];
  out[out.length - 1] = out[out.length - 1].replace(/\.md$/, "");
  if (out.length === 1 && out[0] === "index") out.pop();
  return out;
}

export function slugsToMarkdownPath(slugs: string[]) {
  const segments = [...slugs];
  if (segments.length === 0) {
    segments.push("index.md");
  } else {
    segments[segments.length - 1] += ".md";
  }

  return {
    segments,
    url: `${docsRoute}/${segments.join("/")}`,
  };
}

export async function getLLMText(page: (typeof source)["$inferPage"]) {
  if (page.type === "openapi") return JSON.stringify(page.data.getSchema(), null, 2);

  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})

${processed}`;
}
