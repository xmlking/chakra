import { log } from "evlog";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { eventBusService } from "#server/services/event-bus.server";

import task from "./event-bus-metrics";

type Run = (event: { payload: object; context: object }) => Promise<unknown>;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("event-bus-metrics task", () => {
  it("logs the event bus metrics, hands the work to waitUntil, and succeeds", async () => {
    const metrics = eventBusService.getMetrics();
    const getMetrics = vi.spyOn(eventBusService, "getMetrics").mockReturnValue(metrics);
    const info = vi.spyOn(log, "info").mockImplementation(() => {});
    const waitUntil = vi.fn<(promise: Promise<unknown>) => void>();

    const result = await (task.run as unknown as Run)({ payload: {}, context: { waitUntil } });

    expect(result).toEqual({ result: "Success" });
    expect(waitUntil).toHaveBeenCalledWith(expect.any(Promise));
    expect(getMetrics).toHaveBeenCalledOnce();
    expect(info).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "event-bus-metrics",
        eventBusMetrics: metrics,
      }),
    );
  });
});
