import { describe, expect, it, vi } from "vite-plus/test";

// No Resend config, as in CI where RESEND_API_KEY is unset.
vi.mock("../env", () => ({ ENV: {} }));

describe("email client without Resend config", () => {
  it("can be imported, so modules that only import sendMail still load", async () => {
    await expect(import("../src/index")).resolves.toBeDefined();
  });

  it("fails when a message is actually sent", async () => {
    const { sendMail, EmailValidationError } = await import("../src/index");

    await expect(
      sendMail({ from: "a@example.com", to: "b@example.com", subject: "s", text: "t" }),
    ).rejects.toBeInstanceOf(EmailValidationError);
  });
});
