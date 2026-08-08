import {
  AuiProvider,
  AuiConfig,
  AssistantRuntimeProvider,
  Suggestions,
  Tools,
  useAui,
  WebSpeechDictationAdapter,
} from "@assistant-ui/react";
import { AssistantChatTransport, useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { McpManagerResource, defineConnector } from "@assistant-ui/react-mcp";
import { createFileRoute } from "@tanstack/react-router";
import { ModelSelector } from "@workspace/ui/components/assistant-ui/model-selector";
import { Thread } from "@workspace/ui/components/assistant-ui/thread";
import { ThreadListSidebar } from "@workspace/ui/components/assistant-ui/threadlist-sidebar";
import type { FC } from "react";

import toolkit from "#features/support/tools/toolkit";

const MCP_CONNECTORS = [
  defineConnector({
    id: "better-auth",
    name: "Better Auth",
    url: "https://mcp.better-auth.com/mcp",
    auth: { type: "none" },
  }),
];

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

function SupportChat() {
  const aui = useAui();
  const config = AuiConfig({
    mcp: McpManagerResource({ connectors: MCP_CONNECTORS }),
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
    <AuiProvider extends={aui} config={config}>
      <main className="flex h-[calc(100dvh-var(--header-height))] flex-col">
        <div className="relative flex flex-1 flex-col">
          {/* <SidebarTrigger className="absolute top-4 left-4" /> */}
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
        </div>
        <ThreadListSidebar side="right" showHeader={false} showFooter={false} className="h-full" />
      </main>
    </AuiProvider>
  );
}

function RouteComponent() {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
    }),
    adapters: {
      dictation: new WebSpeechDictationAdapter({
        language: "en-US", // default: browser language
        continuous: true, // keep recording after pauses (default: true)
        interimResults: true, // emit interim transcripts (default: true)
      }),
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SupportChat />
    </AssistantRuntimeProvider>
  );
}
