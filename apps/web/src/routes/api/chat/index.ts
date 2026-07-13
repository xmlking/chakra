import { openai } from "@ai-sdk/openai";
import { AISDKToolkit, type AISDKToolkitToolsOptions } from "@assistant-ui/react-ai-sdk";
import { createFileRoute } from "@tanstack/react-router";
import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  toUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
  type ToolSet,
} from "ai";
import { env } from "virtual:env/server";

import toolkit from "#features/support/tools/toolkit";
// import toolkit from "#features/support/toolkit2";

type ChatInput = {
  tools: AISDKToolkitToolsOptions["frontend"];
  messages: UIMessage[];
};

const aiToolkit = new AISDKToolkit({ toolkit });

// HINT: OPENAI_API_KEY is not prefixed with VITE_ , so we have to do:
process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;

const system = `
You are a helpful assistant with access to tools.
`;
export const Route = createFileRoute("/api/chat/")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, tools }: ChatInput = await request.json();

        try {
          const result = streamText({
            model: openai("gpt-5.4-nano"),
            system,
            // maxOutputTokens: 4096,
            stopWhen: stepCountIs(5),
            messages: await convertToModelMessages(messages),
            tools: (await aiToolkit.tools({ frontend: tools })) as ToolSet,
          });

          return createUIMessageStreamResponse({
            stream: toUIMessageStream({ stream: result.stream }),
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "AI Error";
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});
