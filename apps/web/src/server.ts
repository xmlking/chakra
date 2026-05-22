import { wrapFetchWithSentry } from "@sentry/tanstackstart-react";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

import { paraglideMiddleware } from "#paraglide/server";

export default createServerEntry(
  wrapFetchWithSentry({
    fetch(req: Request) {
      return paraglideMiddleware(req, ({ request }) => handler.fetch(request));
    },
  }),
);
