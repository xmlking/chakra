import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { createFileRoute } from "@tanstack/react-router";
import { Thread } from "@workspace/ui/components/assistant-ui/thread";

export const Route = createFileRoute("/(app)/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  const runtime = useChatRuntime();

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread />
    </AssistantRuntimeProvider>
  );
}
