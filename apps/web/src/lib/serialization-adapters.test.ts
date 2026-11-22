import { ForbiddenError } from "@workspace/shared/errors";
import { TaggedError } from "better-result";
import { createError, EvlogError } from "evlog";
import { describe, expect, it } from "vite-plus/test";
import { z, ZodError } from "zod";

import { evlogErrorAdapter, taggedErrorAdapter, zodErrorAdapter } from "./serialization-adapters";

type Adapter = {
  test: (value: unknown) => boolean;
  toSerializable: (value: never) => unknown;
  fromSerializable: (value: never) => unknown;
};

/** Serialize and rebuild `value` the way the router does across the server/client boundary. */
function roundTrip(adapter: unknown, value: unknown) {
  const { toSerializable, fromSerializable } = adapter as Adapter;
  // Deliberately JSON, not structuredClone: the payload must survive the JSON wire format.
  // oxlint-disable-next-line react-doctor/no-json-parse-stringify-clone
  const wire = JSON.parse(JSON.stringify(toSerializable(value as never)));
  return fromSerializable(wire as never);
}

describe("evlogErrorAdapter", () => {
  it("round-trips an evlog error", () => {
    const error = createError({ message: "Payment failed", status: 402, why: "Card declined" });
    const adapter = evlogErrorAdapter as unknown as Adapter;

    expect(adapter.test(error)).toBe(true);
    expect(adapter.test(new Error("plain"))).toBe(false);

    const rebuilt = roundTrip(evlogErrorAdapter, error);
    expect(rebuilt).toBeInstanceOf(EvlogError);
    expect(rebuilt).toMatchObject({ message: "Payment failed", status: 402 });
  });
});

describe("taggedErrorAdapter", () => {
  it("rebuilds a registered tagged error as its own class", () => {
    const error = new ForbiddenError({ message: "No active organization" });
    expect((taggedErrorAdapter as unknown as Adapter).test(error)).toBe(true);

    const rebuilt = roundTrip(taggedErrorAdapter, error);
    expect(rebuilt).toBeInstanceOf(ForbiddenError);
    expect(rebuilt).toMatchObject({ _tag: "ForbiddenError", message: "No active organization" });
    expect((rebuilt as Error).stack).toBe(error.stack);
  });

  it("falls back to an Error carrying the tag for unregistered tags", () => {
    class UnregisteredError extends TaggedError("UnregisteredError")<{ message: string }> {}

    const rebuilt = roundTrip(taggedErrorAdapter, new UnregisteredError({ message: "odd" }));
    expect(rebuilt).toBeInstanceOf(Error);
    expect(rebuilt).not.toBeInstanceOf(UnregisteredError);
    expect(rebuilt).toMatchObject({ _tag: "UnregisteredError", message: "odd" });
  });
});

describe("zodErrorAdapter", () => {
  it("round-trips a ZodError through its issues", () => {
    const error = z.object({ name: z.string().min(2) }).safeParse({ name: "a" }).error;
    const adapter = zodErrorAdapter as unknown as Adapter;

    expect(adapter.test(error)).toBe(true);
    expect(adapter.test(new Error("plain"))).toBe(false);

    const rebuilt = roundTrip(zodErrorAdapter, error);
    expect(rebuilt).toBeInstanceOf(ZodError);
    expect((rebuilt as ZodError).issues).toEqual(error?.issues);
  });
});
