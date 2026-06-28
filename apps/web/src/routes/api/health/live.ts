import process from "node:process";

import { createFileRoute } from "@tanstack/react-router";
import { env } from "virtual:env/server";

declare const __APP_VERSION__: string;
declare const __GIT_TAG__: string;
declare const __GIT_SHA__: string;
declare const __GIT_TIME__: string;

export const Route = createFileRoute("/api/health/live")({
  server: {
    handlers: {
      GET: () => {
        const body = {
          appVersion: __APP_VERSION__,
          buildSha: __GIT_SHA__,
          buildTag: __GIT_TAG__,
          buildTime: __GIT_TIME__,
          environment: process.env.NODE_ENV,
          status: "healthy",
          timestamp: new Date().toISOString(),
          uptimeMs: Math.floor(process.uptime() * 1000),
          url: env.VITE_WEB_URL,
        };

        return Response.json(body);
      },
    },
  },
});
