// import { definePlugin } from "nitro";

// import { env } from "virtual:env/server";

// oxlint-disable-next-line import/no-default-export
// export default definePlugin(async () => {
//   if (env.WORKFLOW_TARGET_WORLD === "@workflow-worlds/redis") {
//     if (!env.REDIS_URI) {
//       console.error("REDIS_URI is not set, skipping Redis World...");
//       return;
//     }
//     // Dynamic import to avoid edge runtime bundling issues
//     console.log("Starting Redis World...");
//     const { createWorld } = await import("@workflow-worlds/redis");
//     await createWorld({
//       redisUrl: env.REDIS_URI,
//     }).start?.();
//     console.log("Redis World started");
//   }
// });
