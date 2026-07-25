import { createSerializationAdapter } from "@tanstack/react-router";
import { TAGGED_ERROR_CONSTRUCTORS } from "@workspace/shared/errors";
import { createError, EvlogError, parseError } from "evlog";
import { ZodError } from "zod";

export const evlogErrorAdapter = createSerializationAdapter({
  key: "evlogError",
  test: (error: unknown): error is EvlogError => error instanceof EvlogError,
  toSerializable: (error) => {
    const { raw: _raw, ...rest } = parseError(error);
    return rest;
  },
  fromSerializable: (value) => createError(value),
});

import { isTaggedError } from "better-result";

export const taggedErrorAdapter = createSerializationAdapter({
  key: "taggedError",
  test: isTaggedError,
  toSerializable: (err) => ({
    _tag: err._tag,
    message: err.message,
    stack: err.stack,
  }),
  fromSerializable: (pojo) => {
    const ErrorClass = TAGGED_ERROR_CONSTRUCTORS[pojo._tag];
    if (ErrorClass) {
      const err = new ErrorClass({ message: pojo.message }) as any;
      err._tag = pojo._tag;
      err.stack = pojo.stack;
      return err;
    }

    // Fallback to generic error with _tag property
    const err = new Error(pojo.message) as any;
    err._tag = pojo._tag;
    err.stack = pojo.stack;
    return err;
  },
});

export const zodErrorAdapter = createSerializationAdapter({
  key: "zodError",
  test: (value: unknown): value is ZodError => value instanceof ZodError,

  toSerializable: (error) => error.issues as any[], // Serialize issues array
  fromSerializable: (issues) => new ZodError(issues), // Reconstruct client-side error
});
