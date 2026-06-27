import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { Session } from "@workspace/auth/client";
import { getLocale } from "@workspace/i18n/runtime";

import { Providers } from "#components/providers";
import { siteConfig } from "#config/site.config";

// import appCss from "@workspace/ui/globals.css?url";
import appCss from "../styles.css?url";

interface MyRouterContext {
  queryClient: QueryClient;
  // TODO https://github.com/masrurimz/shadcn-tanstack-start-landing-page/tree/main
  //  user: Awaited<ReturnType<typeof getUserFn>>;
  session: Session;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    // Other redirect strategies are possible; see
    // https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#offline-redirect
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", getLocale());
    }
  },
  // server: {
  //   middleware: [createMiddleware().server(evlogErrorHandler)],
  // },

  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: siteConfig.title },
      { name: "description", content: siteConfig.description },
      {
        name: "keywords",
        content:
          "tanstack router, tanstack start, dark mode, light mode, theme provider, useTheme, SSR, FOUC",
      },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#0f766e" },
      { name: "application-name", content: siteConfig.name },
      { property: "og:site_name", content: siteConfig.name },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:title", content: siteConfig.title },
      { property: "og:description", content: siteConfig.description },
      { property: "og:image", content: siteConfig.og },
      { property: "og:image:alt", content: "Chakra logo" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: siteConfig.title },
      { name: "twitter:description", content: siteConfig.description },
      { name: "twitter:image", content: siteConfig.og },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
    ],
    scripts: [
      {
        children: `(function(){var s=localStorage.getItem('theme');if(s){document.documentElement.setAttribute('data-theme',s);}else{var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',d?'default-dark':'default-light');}})();`,
      },
    ],
  }),
  shellComponent: RootDocument,
});

// oxlint-disable-next-line react-doctor/only-export-components
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Query",
              render: <ReactQueryDevtoolsPanel />,
              defaultOpen: true,
            },
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
