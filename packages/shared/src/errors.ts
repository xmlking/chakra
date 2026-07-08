import { TaggedError } from "better-result";

/**
 * Tagged Errors
 * Usage: https://github.com/dmmulroy/better-result?tab=readme-ov-file#tagged-errors
 */

// Factory API: TaggedError("Tag")<Props>()
export class NetworkError extends TaggedError("NetworkError")<{
  url: string;
  status: number;
  message: string;
}>() {
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
}>() {}

export type AppError = NetworkError | ValidationError;

export class AiInternalError extends TaggedError("AiInternalError")<{
  message: string;
}>() {}

export type AiError = AiInternalError;
