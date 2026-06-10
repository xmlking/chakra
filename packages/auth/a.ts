import { db } from "@workspace/db";
import { env } from "virtual:env/server";

console.log(env.BETTER_AUTH_ADMIN_EMAIL);
console.log(db.$client);
