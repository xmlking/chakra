import { describe, it, expect, beforeEach } from "vite-plus/test";

import * as m from "../src/paraglide/messages.js"; // Adjust path based on your outdir
import { setLocale, getLocale, locales, baseLocale } from "../src/paraglide/runtime.js";

describe("i18n Messages", () => {
  beforeEach(async () => {
    // Reset to base locale before each test
    await setLocale("en");
  });

  describe("Locale Configuration", () => {
    it("should have English as base locale", () => {
      expect(baseLocale).toBe("en");
    });

    it("should support English and Dutch locales", () => {
      expect(locales).toContain("en");
      expect(locales).toContain("de");
      expect(locales).toHaveLength(2);
    });

    it("should default to English locale", () => {
      expect(getLocale()).toBe("en");
    });

    it("should switch to Dutch locale", async () => {
      await setLocale("de", { reload: false });
      expect(getLocale()).toBe("de");
    });
  });

  it("should return the correct English greeting", () => {
    expect(getLocale()).toBe("en");

    // m.greeting() is the compiled function from your messages
    const result = m.greeting({ name: "Alice" });
    expect(result).toBe("Hello Alice!");
  });

  it("should support switching to another locale", async () => {
    await setLocale("de");
    expect(getLocale()).toBe("de");

    const result = m.greeting({ name: "Alice" });
    expect(result).toBe("Hallo Alice!"); // Assuming German is configured
  });
});
