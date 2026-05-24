import { createIsomorphicFn } from "@tanstack/react-start";

/**
 * Usage:
 * const isDev = getIsDev();
 */
export const getIsDev = createIsomorphicFn()
  .server(() => process.env.NODE_ENV !== "production")
  .client(() => import.meta.env.DEV);
