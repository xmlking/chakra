import { createEmailClient } from "@opencoredev/email-sdk";
import { capturePlugin } from "@opencoredev/email-sdk/plugins/capture";
import { failingProvider, memoryProvider } from "@opencoredev/email-sdk/testing";
import { describe, it, expect } from "vite-plus/test";

describe("Email client", () => {
  it("should fall back to another provider", async () => {
    const backup = memoryProvider("backup");
    const emailClient = createEmailClient({
      adapters: [failingProvider("primary"), backup],
      fallback: ["backup"],
    });

    const response = await emailClient.send({
      from: "test@example.com",
      to: "user@example.com",
      subject: "Fallback",
      text: "Hello",
    });

    expect(response.provider).toBe("backup");
    expect(backup.raw?.sent).toHaveLength(1);
  });

  it("should capture with plugin", async () => {
    const memory = memoryProvider();
    const emailClient = createEmailClient({
      adapters: [memory],
      plugins: [capturePlugin()],
    });

    await emailClient.send({
      from: "test@example.com",
      to: "user@example.com",
      subject: "Welcome",
      text: "Hello",
    });

    expect(emailClient.capture.events).toHaveLength(2);
    expect(memory.raw?.sent).toHaveLength(1);
  });
});
