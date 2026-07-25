// import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { ForbiddenError } from "@workspace/shared/errors";

import { authMiddleware } from "./auth";

export const adminRequiredMiddleware = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .server(({ next, context }) => {
    if (context.session.user.role !== "admin") {
      // Admin access required
      throw new ForbiddenError({ message: "Admin access required" });
      // throw redirect({
      //   to: "/auth/$path",
      //   params: { path: "sign-in" },
      //   search: { redirectTo: location.href },
      // });
    }
    return next();
  });
