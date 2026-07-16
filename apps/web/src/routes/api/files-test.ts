import { createFileRoute } from "@tanstack/react-router";
import { files } from "@workspace/storage";

export const Route = createFileRoute("/api/files-test")({
  server: {
    handlers: {
      GET: async () => {
        // List with cursor pagination
        const { items, cursor } = await files.list({ prefix: "reports/", limit: 50 });
        console.log({ items, cursor });
        const url = await files.url("reports/q1.pdf", { expiresIn: 300 });
        const capabilities = files.capabilities;

        const body = {
          url,
          capabilities,
        };

        return Response.json(body);
      },
    },
  },
});
