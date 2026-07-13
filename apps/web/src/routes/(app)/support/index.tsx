import { AssistantRuntimeProvider, Suggestions, Tools, useAui } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { createFileRoute } from "@tanstack/react-router";
import { Thread } from "@workspace/ui/components/assistant-ui/thread";

import toolkit from "#features/support/tools/toolkit";
// import toolkit from "#features/support/tools/toolkit2";

export const Route = createFileRoute("/(app)/support/")({
  component: RouteComponent,
});

function RouteComponent() {
  const runtime = useChatRuntime();
  // Register the toolkit
  const aui = useAui({
    tools: Tools({ toolkit }),
    suggestions: Suggestions([
      {
        title: "What's the weather",
        label: "in Tokyo right now?",
        prompt: "What's the weather in Tokyo?",
      },
      {
        title: "Tell me a fun fact",
        label: "about any topic",
        prompt: "Tell me a fun fact about space.",
      },
    ]),
  });

  return (
    <AssistantRuntimeProvider aui={aui} runtime={runtime}>
      <main className="flex h-[calc(100dvh-var(--header-height))] flex-col">
        <Thread />
      </main>
    </AssistantRuntimeProvider>
  );
}
