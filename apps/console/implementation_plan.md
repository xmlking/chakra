# Build Simple Workflow in Console Module

This plan outlines the integration of the [Workflow SDK](https://workflow-sdk.dev) into the `console` module to build a simple durable workflow.

## Background Context

The workflow SDK allows us to build durable, resilient, and observable background tasks and AI agents. The user wants to build a simple workflow within the `console` application, which uses TanStack Start, Vite, and Bun.

## User Review Required

- **Plugin Integration**: We will add the Workflow SDK Vite plugin to `apps/console/vite.config.ts`.
- **Workflow Endpoint**: We will create a simple demonstration workflow (e.g., a "hello world" with a simulated sleep/delay) to prove the integration works.

## Open Questions

> [!IMPORTANT]
>
> - Should the workflow be exposed as an API route (e.g., `/api/workflow`) or as a TanStack Start Server Function?
> - The `workflow` package is already in `apps/console/package.json`. The web documentation suggests the Vite plugin is imported from `workflow/vite`. Is this the exact import you want me to use in `vite.config.ts`?

## Proposed Changes

### Configuration

#### [MODIFY] [vite.config.ts](file:///d:/Work/antigravity_projects/chakra/apps/console/vite.config.ts)

- Add the `workflow` plugin from the `workflow` SDK to the Vite plugins array. The documentation recommends putting it early in the array.

### Application Logic

#### [NEW] [workflow.ts](file:///d:/Work/antigravity_projects/chakra/apps/console/src/routes/api/workflow.ts)

- Create a simple workflow using the `"use workflow"` directive.
- The workflow will accept simple inputs, perform a mock asynchronous step (e.g. `step.sleep('1s')`), and return a result.
- We will set up this file according to TanStack Start's API route format (or server function format, based on your feedback).

## Verification Plan

### Automated Tests

- Run `vp check` and `vp build` in the root workspace to ensure the Vite configuration builds successfully and types are correct.

### Manual Verification

- Trigger the workflow via a simple API call in development (`vp dev`) and verify that it executes successfully without errors.
