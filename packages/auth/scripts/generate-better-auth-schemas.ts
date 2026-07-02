import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { generateSchema } from "auth/api";
import { getAdapter } from "better-auth/db/adapter";

import { auth } from "../src/index";

async function run() {
  try {
    const adapter = await getAdapter(auth.options);
    const result = await generateSchema({
      adapter,
      options: auth.options,
      file: resolve(import.meta.dirname, "../../db/src/schema/copy_me_auth.ts"),
    } as Parameters<typeof generateSchema>[0]);

    if (result && result.code) {
      // 3. Write the code to your explicit project schema location
      await writeFile(result.fileName, result.code, "utf-8");
      console.log(`✅ Successfully generated auth schema at: ${result.fileName}`);
    } else {
      console.error("❌ Generation failed: Code output was empty.");
    }
  } catch (error) {
    console.error("❌ Error generating programmatic schema:", error);
    process.exit(1);
  }
}

await run();
