import { fileURLToPath } from "node:url";

import { createOpenAPI } from "fumadocs-openapi/server";

export const openapi = createOpenAPI({
  // the OpenAPI schema, you can also give it an external URL.
  input: [fileURLToPath(new URL("../../../../content/openapi.json", import.meta.url))],
  proxyUrl: "/api/proxy",
});
