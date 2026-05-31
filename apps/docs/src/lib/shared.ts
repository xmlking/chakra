import { env } from "virtual:env/client";

export const appName = env.VITE_APP_NAME || "Tanstack Start";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: "fuma-nama",
  repo: "fumadocs",
  branch: "main",
};
