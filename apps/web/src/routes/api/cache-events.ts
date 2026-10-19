import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@workspace/auth";

import { ENV } from "#env";
import { eventBus } from "#server/services/event-bus";

const encoder = new TextEncoder();

export const Route = createFileRoute("/api/cache-events")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!ENV.DATABASE_URL) {
          return Response.json({ error: "cache event stream is unavailable" }, { status: 503 });
        }

        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
          return Response.json({ error: "unauthorized" }, { status: 401 });
        }

        const organizationId = session.session.activeOrganizationId;
        if (!organizationId) {
          return Response.json({ error: "active organization required" }, { status: 403 });
        }

        let dispose = () => {};
        const body = new ReadableStream<Uint8Array>({
          start(controller) {
            let closed = false;
            let unsubscribe = () => {};
            let heartbeat: ReturnType<typeof setInterval> | undefined;
            let reconnectCount = eventBus.getMetrics().connection.reconnect_count;
            let abort = () => {};

            const close = (closeController: boolean) => {
              if (closed) return;
              closed = true;
              unsubscribe();
              if (heartbeat) clearInterval(heartbeat);
              request.signal.removeEventListener("abort", abort);
              if (closeController) controller.close();
            };
            abort = () => close(true);
            const send = (event: string, data: unknown) => {
              if (closed) return;
              controller.enqueue(
                encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
              );
            };

            unsubscribe = eventBus.on("cache:invalidate", ({ data }) => {
              if (data.organizationId === organizationId) {
                send("invalidate", data);
              }
            });
            heartbeat = setInterval(() => {
              if (closed) return;
              const currentReconnectCount = eventBus.getMetrics().connection.reconnect_count;
              if (currentReconnectCount !== reconnectCount) {
                reconnectCount = currentReconnectCount;
                send("ready", {});
              }
              controller.enqueue(encoder.encode(": keep-alive\n\n"));
            }, 20_000);
            request.signal.addEventListener("abort", abort, { once: true });
            dispose = () => close(false);
            send("ready", {});
            if (request.signal.aborted) abort();
          },
          cancel() {
            dispose();
          },
        });

        return new Response(body, {
          headers: {
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "Content-Type": "text/event-stream; charset=utf-8",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
