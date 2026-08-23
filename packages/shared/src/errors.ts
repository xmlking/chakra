import { TaggedError } from "better-result";

/**
 * Tagged Errors
 * Usage: https://github.com/dmmulroy/better-result?tab=readme-ov-file#tagged-errors
 */

// Factory API: TaggedError("Tag")<Props>
export class NetworkError extends TaggedError("NetworkError")<{
  url: string;
  status: number;
  message: string;
}> {
  constructor(args: { url: string; status: number }) {
    super({
      ...args,
      message: `Request to ${args.url} failed with ${args.status}`,
    });
  }
}

export class ValidationError extends TaggedError("ValidationError")<{
  field: string;
  message: string;
}> {}

export class NotFoundError extends TaggedError("NotFoundError")<{
  message: string;
}> {}

export class UnauthorizedError extends TaggedError("UnauthorizedError")<{
  message: string;
}> {}

export class ForbiddenError extends TaggedError("ForbiddenError")<{
  message: string;
}> {}

export class RateLimitError extends TaggedError("RateLimitError")<{
  message: string;
}> {}

export class AiInternalError extends TaggedError("AiInternalError")<{
  message: string;
}> {}

export class DatabaseError extends TaggedError("DatabaseError")<{
  message: string;
}> {}

export type AppError =
  | NetworkError
  | ValidationError
  | NotFoundError
  | UnauthorizedError
  | ForbiddenError
  | RateLimitError
  | AiInternalError
  | DatabaseError;

// Map error tags to their constructors
// TODO: keep this Record updated as you add new tagged errors
export const TAGGED_ERROR_CONSTRUCTORS: Record<string, new (props: any) => any> = {
  NetworkError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  RateLimitError,
  AiInternalError,
  DatabaseError,
};
