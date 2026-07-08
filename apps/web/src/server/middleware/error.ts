import { createMiddleware } from "@tanstack/react-start";
import { isTaggedError } from "better-result";
import { log } from "evlog";
import { ZodError } from "zod";

import type { FieldErrors, ServerResponse } from "#types";

// Convert Zod field errors to array of messages per field
const formatZodFieldErrors = (fieldErrors: Record<string, any>): FieldErrors => {
  const result: FieldErrors = {};

  for (const [field, issues] of Object.entries(fieldErrors)) {
    if (Array.isArray(issues) && issues.length > 0) {
      result[field] = issues.map((i) => i?.message || "Invalid field");
    }
  }

  return result;
};

const toResponse = (data: ServerResponse): Response => {
  const status = data.success ? 200 : data.type === "validation" ? 422 : 500;
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

export const errorHandlingMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    // 1. Handle ZodError from validators
    if (error instanceof ZodError) {
      const { fieldErrors } = error.flatten();
      const formatted = formatZodFieldErrors(fieldErrors as Record<string, any>);

      return toResponse({
        success: false,
        type: "validation" as const,
        fieldErrors: formatted,
      });
    }

    // 2. Handle TaggedError
    if (isTaggedError(error)) {
      // Generic TaggedError handling
      log.error({ action: "middleware", error });
      return toResponse({
        success: false,
        type: "server" as const,
        message: error.message,
        code: error._tag,
      });
    }

    // 3. Generic error fallback
    log.error({ action: "middleware", error });
    return toResponse({
      success: false,
      type: "server" as const,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
      code: error instanceof Error ? error.name : "UNKNOWN_ERROR",
    });
  }
});
