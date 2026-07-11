import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookIcon, HistoryIcon, RssIcon } from "lucide-react";

// import { Logo } from "./components/logo";

export const SITE_URL = "https://xmlking.github.io/chakra";

export const OG_IMAGE =
  "https://raw.githubusercontent.com/xmlking/chakra/main/apps/docs/public/og.png";

// HINT: use `basePath` setting in waku.config.ts. Defaults to  "/".
const basePath = import.meta.env.BASE_URL;

export const baseOptions: BaseLayoutProps = {
  githubUrl: "https://github.com/xmlking/chakra",

  nav: {
    title: (
      <>
        {/* <Logo className="size-6" /> */}
        <img
          src={`${basePath}logo.svg`}
          alt="logo"
          width={24}
          height={24}
          className="brightness-0 dark:brightness-100"
        />
        <span className="font-semibold">Chakra</span>
        {/* <img
          alt="logo"
          src={`${basePath}logo2.svg`}
          width={64}
          height={64}
          className="mb-1 size-8 rounded-full shadow-sm shadow-black dark:invert"
        />
        <span>
          <span className="border-fd-primary border-b-2 font-mono uppercase">Chakra</span>
          <br />
          <span className="text-fd-muted-foreground text-xs font-normal">The agent guru</span>
        </span> */}
      </>
    ),
  },
  links: [
    {
      text: "Documentation",
      url: "/docs",
      icon: <BookIcon />,
      active: "nested-url",
    },
    {
      text: "Blog",
      url: "/blog",
      icon: <RssIcon />,
      active: "nested-url",
    },
    {
      text: "Changelog",
      url: "/changelog",
      icon: <HistoryIcon />,
      active: "nested-url",
    },
    {
      text: "Developer",
      url: "/docs/developer",
    },
    {
      text: "OpenAPI",
      url: "/docs/openapi",
    },
    {
      text: "For LLMs",
      type: "menu",
      items: [
        {
          text: "llms.txt",
          url: `${basePath}llms.txt`,
          description: "Outline of the documentation",
          external: true,
        },
        {
          text: "llms-full.txt",
          url: `${basePath}llms-full.txt`,
          description: "Full text of the documentation",
          external: true,
        },
        {
          text: "sitemap.xml",
          url: `${basePath}sitemap.xml`,
          description: "Sitemap",
          external: true,
        },
      ],
    },
  ],
};
