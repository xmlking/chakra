import {
  AssistantRuntimeProvider,
  Suggestions,
  Tools,
  useAui,
  WebSpeechDictationAdapter,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { createFileRoute } from "@tanstack/react-router";
import { ModelSelector } from "@workspace/ui/components/assistant-ui/model-selector";
import { Thread } from "@workspace/ui/components/assistant-ui/thread";
import type { FC } from "react";

import toolkit from "#features/support/tools/toolkit";
// import toolkit from "#features/support/tools/toolkit2";

// @ts-ignore TODO
// oxlint-disable-next-line no-unused-vars
const ComposerAction: FC = () => {
  return (
    <div className="flex items-center gap-1">
      <ModelSelector
        models={[
          { id: "gpt-5.4-nano", name: "GPT-5.4 Nano", description: "Fast and efficient" },
          { id: "gpt-5.4-mini", name: "GPT-5.4 Mini", description: "Balanced performance" },
          { id: "gpt-5.5", name: "GPT-5.5", description: "Most capable", efforts: true },
        ]}
        defaultValue="gpt-5.4-nano"
        defaultEffort="medium"
        size="sm"
      />
    </div>
  );
};

export const Route = createFileRoute("/(app)/support/")({
  component: RouteComponent,
});

function RouteComponent() {
  const runtime = useChatRuntime({
    adapters: {
      dictation: new WebSpeechDictationAdapter({
        language: "en-US", // default: browser language
        continuous: true, // keep recording after pauses (default: true)
        interimResults: true, // emit interim transcripts (default: true)
      }),
    },
  });
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
        <Thread
        // composerStart={
        //   <ModelSelector
        //     models={models}
        //     defaultValue="gpt-5.4-nano"
        //     defaultEffort="medium"
        //     size="sm"
        //     contentClassName="min-w-56"
        //   />
        // }
        />
      </main>
    </AssistantRuntimeProvider>
  );
}
