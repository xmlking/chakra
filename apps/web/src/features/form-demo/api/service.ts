"use server";

import { createServerFn } from "@tanstack/react-start";
import { sleep } from "@workspace/shared/helpers";
import { z } from "zod";

import { errorHandlingMiddleware } from "../../../server/middleware/error";
import { projectDeleteSchema, projectSchema } from "../schema";

export const createProject = createServerFn({ method: "POST" })
  .middleware([errorHandlingMiddleware])
  .validator(projectSchema)
  .handler(async ({ data: parsedInput }) => {
    console.debug(parsedInput);
    await sleep(2000);
    return { success: true, data: "Project created successfully" };
  });

export const updateProject = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.number().int().positive({ message: "Invalid project ID" }),
      value: projectSchema,
    }),
  )
  .handler(async ({ data: parsedInput }) => {
    // do something with the data
    console.debug(parsedInput);
    await sleep(2000);

    return {
      success: true,
      message: "Project updated successfully",
    };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .validator(projectDeleteSchema)
  .handler(async ({ data: parsedInput }) => {
    // do something with the data
    console.debug(parsedInput);
    await sleep(2000);

    return {
      success: true,
      message: "Project deleted successfully",
    };
  });
