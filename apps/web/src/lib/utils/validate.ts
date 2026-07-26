import { setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";

export function validate<T>(schema: z.ZodType<T>) {
  return (data: T): T => {
    const { success, error: zodError, data: parsedData } = schema.safeParse(data);

    if (!success) {
      setResponseStatus(400);
      throw zodError;
    }

    return parsedData;
  };
}
