"use server";

import { createServerFn } from "@tanstack/react-start";
import { sleep } from "@workspace/shared/helpers";
import { z } from "zod";

import { projectDeleteSchema, projectSchema } from "../schema";

export const createProject = createServerFn({ method: "POST" })
  .validator(projectSchema)
  .handler(async ({ data: parsedInput }) => {
    try {
      // do something with the data
      console.debug(parsedInput);
      await sleep(2000);

      return {
        success: true,
        message: "Project created successfully",
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          message: "Validation failed",
          errors: error.flatten().fieldErrors as Record<string, string[]>,
        };
      }
      throw error;
    }
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
