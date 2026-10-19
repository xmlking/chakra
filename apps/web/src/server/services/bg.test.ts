import { log } from "evlog";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { eventBus } from "#server/services/event-bus";

import { doBackgroundWork } from "./bg";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("doBackgroundWork", () => {
  it("logs the event bus metrics when the scheduled job runs", async () => {
    const metrics = eventBus.getMetrics();
    const getMetrics = vi.spyOn(eventBus, "getMetrics").mockReturnValue(metrics);
    const info = vi.spyOn(log, "info").mockImplementation(() => {});

    await doBackgroundWork({});

    expect(getMetrics).toHaveBeenCalledOnce();
    expect(info).toHaveBeenCalledWith(
      expect.objectContaining({
        job: "onramp-webhooks-check",
        eventBusMetrics: metrics,
      }),
    );
  });
});
