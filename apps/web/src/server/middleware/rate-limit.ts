import { createMiddleware } from "@tanstack/react-start";
import { RateLimitError } from "@workspace/shared";

import { createTokenBucketManager } from "#lib/utils/rate-limit";

import { authMiddleware } from "./auth";

const bucket = createTokenBucketManager<string>(30, 1);

export const rateLimitMiddleware = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    if (!bucket.consume(context.session.user.id, 1))
      throw new RateLimitError({ message: "429: Too many requests" });
    return next();
  });
