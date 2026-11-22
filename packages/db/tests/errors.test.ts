import { DrizzleError, DrizzleQueryError } from "drizzle-orm";
import { DatabaseError } from "pg";
import { describe, expect, it } from "vite-plus/test";

import { DbInternalError, DbNotFoundError, PgErrorCode, getDbErrorMessage } from "../src/errors";

/** A Drizzle query error wrapping a Postgres error, as the driver surfaces it. */
function queryError(fields: { code?: string; constraint?: string; column?: string }) {
  const pgError = new DatabaseError("pg failure", 0, "error");
  Object.assign(pgError, fields);
  return new DrizzleQueryError("select 1", [], pgError);
}

describe("getDbErrorMessage", () => {
  it.each([
    [
      PgErrorCode.UNIQUE_VIOLATION,
      "A duplicate entry was found for a unique field.",
      "users_email_key",
    ],
    [
      PgErrorCode.FOREIGN_KEY_VIOLATION,
      "A foreign key violation occurred. The record you are trying to link does not exist.",
      "orders_user_fk",
    ],
    [PgErrorCode.CHECK_VIOLATION, "A check constraint was violated.", "price_positive"],
  ])("maps %s to a message and its constraint", (code, message, constraint) => {
    expect(getDbErrorMessage(queryError({ code, constraint }))).toEqual({ message, constraint });
  });

  it("reports the column for a not-null violation", () => {
    expect(
      getDbErrorMessage(queryError({ code: PgErrorCode.NOT_NULL_VIOLATION, column: "email" })),
    ).toEqual({
      message: "A required field is missing. The column 'email' cannot be null.",
      constraint: "email",
    });
  });

  it.each([
    [
      PgErrorCode.INVALID_TEXT_REPRESENTATION,
      "The data provided is in an invalid format (e.g., not a valid UUID).",
    ],
    [PgErrorCode.SYNTAX_ERROR, "There's a syntax error in the database query."],
    [
      PgErrorCode.CONNECTION_FAILURE,
      "Database connection failed. The database may be unavailable.",
    ],
    [PgErrorCode.UNDEFINED_TABLE, "A referenced table does not exist in the database."],
  ])("maps %s without a constraint", (code, message) => {
    expect(getDbErrorMessage(queryError({ code }))).toEqual({ message, constraint: null });
  });

  it("returns null for a missing constraint", () => {
    expect(
      getDbErrorMessage(queryError({ code: PgErrorCode.UNIQUE_VIOLATION })).constraint,
    ).toBeNull();
  });

  it("falls back to the driver message for an unmapped or missing code", () => {
    const expected = { message: "A database error occurred: pg failure", constraint: null };
    expect(getDbErrorMessage(queryError({ code: PgErrorCode.DISK_FULL }))).toEqual(expected);
    expect(getDbErrorMessage(queryError({}))).toEqual(expected);
  });

  it("uses the message of a plain Drizzle or JS error", () => {
    expect(getDbErrorMessage(new DrizzleError({ message: "drizzle broke" })).message).toBe(
      "drizzle broke",
    );
    expect(getDbErrorMessage(new Error("boom"))).toEqual({ message: "boom", constraint: null });
    expect(getDbErrorMessage(new Error(""))).toEqual({
      message: "An unexpected error occurred.",
      constraint: null,
    });
  });

  it("handles a non-error value", () => {
    expect(getDbErrorMessage("nope")).toEqual({
      message: "An unknown error occurred.",
      constraint: null,
    });
  });
});

describe("db tagged errors", () => {
  it("builds a not-found message from the id and entity type", () => {
    const error = new DbNotFoundError({ id: "42", entityType: "abcd" });
    expect(error._tag).toBe("NotFoundError");
    expect(error.message).toBe("Not found: 42 abcd");
  });

  it("tags internal errors", () => {
    expect(new DbInternalError({ message: "x" })._tag).toBe("DbInternalError");
  });
});
