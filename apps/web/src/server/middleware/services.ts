import { createMiddleware } from "@tanstack/react-start";

import { eventBusService } from "#server/services/event-bus.server";

/**
 * Injects the Postgres event bus singleton as `context.eventBus`. Request
 * middleware, so it works on server routes as well as server functions.
 */
export const eventBusMiddleware = createMiddleware().server(({ next }) =>
  next({ context: { eventBus: eventBusService } }),
);
