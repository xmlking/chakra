import { createCsrfMiddleware } from "@tanstack/react-start";

export const csrfMiddleware = createCsrfMiddleware({
  // origin: "https://app.example.com",
  filter: (ctx) => ctx.handlerType === "serverFn",
});
