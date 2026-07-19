import type { StudioConfig } from "better-auth-studio";

import { auth } from "./src/index.tsx";

const config: StudioConfig = {
  auth,
  basePath: "/api/studio",
  metadata: {
    title: "Better Auth Studio",
    theme: "dark",
  },
  access: {
    roles: ["admin"],
    allowEmails: ["admin@chakra.ai"],
  },
};

export default config;
