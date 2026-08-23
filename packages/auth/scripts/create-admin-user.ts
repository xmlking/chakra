import { APIError } from "better-auth/api";
import { env } from "virtual:env/server";

import { auth } from "../src/index";

function exitWithError(message: string): never {
  console.error(`Error: ${message}`);
  process.exit(1);
}

async function run() {
  try {
    const result = await auth.api.createUser({
      body: {
        email: env.BETTER_AUTH_ADMIN_EMAIL,
        password: env.BETTER_AUTH_ADMIN_PASSWORD,
        name: "Super Admin",
        role: "admin",
        data: {
          emailVerified: true,
        },
      },
    });

    console.log("✅ Admin user created successfully.");
    if (result.user?.id) {
      console.log(`User ID: ${result.user.id}`);
    }
    console.log(`Email: ${result.user?.email}`);
    console.log(`Role: ${result.user?.role}`);
    process.exit(0);
  } catch (error) {
    if (error instanceof APIError) {
      exitWithError(error.message);
    }
    if (error instanceof Error) {
      exitWithError(error.message);
    }
    exitWithError("❌ Failed to create admin user.");
  }
}

await run();
