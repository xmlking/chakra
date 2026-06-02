import { createFileRoute } from "@tanstack/react-router";
import { start } from "workflow/api";

import { mySimpleWorkflow } from "../../workflows/hello";

export const Route = createFileRoute("/api/workflow")({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Trigger the workflow
          const result = await start(mySimpleWorkflow, ["TanStack Start"]);
          return new Response(JSON.stringify({ success: true, result }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
