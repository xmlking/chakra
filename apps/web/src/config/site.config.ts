import { ENV } from "#env";
import type { SiteConfig } from "#types";

export const siteConfig: SiteConfig = {
  name: ENV.APP_NAME,
  title: `Agent Management App | ${ENV.APP_NAME}`,
  description: "A control plane for enterprise agentic assets",
  origin: "https://chakra.vercel.dev",
  keywords: [
    "Agents",
    "AI",
    "Evals",
    "Knowledge Graph",
    "MCP",
    "RAG",
    "LLM",
    "Observability",
    "Full-Stack",
  ],
  og: "https://chakra.vercel.dev/og.png",
  creator: {
    name: "chakra_agi",
    url: "https://github.com/xmlking",
  },
  socials: {
    github: "https://github.com/xmlking/chakra",
    x: "https://x.com/xmlking",
  },
};
