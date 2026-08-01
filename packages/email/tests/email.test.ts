import { EmailAdapterError, createEmailClient } from "@opencoredev/email-sdk";
import { capturePlugin } from "@opencoredev/email-sdk/plugins/capture";
import { failingAdapter, memoryAdapter } from "@opencoredev/email-sdk/testing";
import { describe, it, expect } from "vite-plus/test";
import { vi } from "vite-plus/test";

import { email, sendMail } from "../src/index";

describe("Email client", () => {
  it("should capture a successful send", async () => {
    const memory = memoryAdapter();
    const emailClient = createEmailClient({
      adapters: [memory],
      telemetry: false,
    });

    await emailClient.send({
      from: "test@example.com",
      to: "user@example.com",
      subject: "Welcome",
      text: "Hello",
    });

    expect(memory.raw?.sent).toHaveLength(1);
    expect(memory.raw?.sent[0]?.message.subject).toBe("Welcome");
  });

  it("should fall back on not_sent delivery failure", async () => {
    const primary = failingAdapter(
      "primary",
      new EmailAdapterError("Rejected before acceptance", {
        adapter: "primary",
        retryable: false,
        delivery: "not_sent",
      }),
    );
    const backup = memoryAdapter("backup");

    const emailClient = createEmailClient({
      adapters: [primary, backup],
      fallback: { adapters: ["backup"] },
      telemetry: false,
    });

    const result = await emailClient.send({
      from: "test@example.com",
      to: "user@example.com",
      subject: "Fallback",
      text: "Hello",
    });

    expect(result.adapter).toBe("backup");
    expect(backup.raw?.sent).toHaveLength(1);
  });

  it("should stop on unknown delivery without explicit config", async () => {
    const primary = failingAdapter(
      "primary",
      new EmailAdapterError("Possible duplicate", {
        adapter: "primary",
        retryable: false,
        delivery: "unknown",
      }),
    );
    const backup = memoryAdapter("backup");

    const emailClient = createEmailClient({
      adapters: [primary, backup],
      fallback: { adapters: ["backup"] },
      telemetry: false,
    });

    await expect(
      emailClient.send({
        from: "test@example.com",
        to: "user@example.com",
        subject: "Unknown delivery",
        text: "Hello",
      }),
    ).rejects.toThrow("All configured email adapters failed");

    expect(backup.raw?.sent).toHaveLength(0);
  });

  it("should capture lifecycle events with plugin", async () => {
    const memory = memoryAdapter();
    const emailClient = createEmailClient({
      adapters: [memory],
      plugins: [capturePlugin()],
      telemetry: false,
    });

    await emailClient.send({
      from: "test@example.com",
      to: "user@example.com",
      subject: "Lifecycle",
      text: "Hello",
    });

    expect(emailClient.capture.events).toHaveLength(2);
    expect(emailClient.capture.events[0]?.type).toBe("beforeSend");
    expect(emailClient.capture.events[1]?.type).toBe("afterSend");
    expect(memory.raw?.sent).toHaveLength(1);
  });

  it("should use text when html is not provided", async () => {
    const spy = vi.spyOn(email, "send").mockResolvedValue({
      id: "test-id",
      adapter: "test",
    } as never);

    await sendMail({
      from: "test@example.com",
      to: "user@example.com",
      subject: "Hello",
      text: "Hello world",
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        subject: "Hello",
        text: "Hello world",
        html: "Hello world",
      }),
    );

    spy.mockRestore();
  });

  it("should prioritize html over text when both are provided", async () => {
    const spy = vi.spyOn(email, "send").mockResolvedValue({
      id: "test-id",
      adapter: "test",
    } as never);

    await sendMail({
      from: "test@example.com",
      to: "user@example.com",
      subject: "Hello",
      html: "<p>html body</p>",
      text: "fallback text",
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        subject: "Hello",
        html: "<p>html body</p>",
        text: "fallback text",
      }),
    );

    spy.mockRestore();
  });

  it("should prioritize react over text when both are provided", async () => {
    const spy = vi.spyOn(email, "send").mockResolvedValue({
      id: "test-id",
      adapter: "test",
    } as never);

    await sendMail({
      from: "test@example.com",
      to: "user@example.com",
      subject: "Hello",
      text: "fallback text",
      react: "<p>rendered react</p>",
    } as never);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        subject: "Hello",
        text: "fallback text",
      }),
    );
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining("rendered react"),
      }),
    );

    spy.mockRestore();
  });

  it("should throw when no content is provided", async () => {
    await expect(
      sendMail({
        from: "test@example.com",
        to: "user@example.com",
        subject: "Hello",
      } as never),
    ).rejects.toThrow("Email message requires either html or text content");
  });
});
