import { createServerFn } from "@tanstack/react-start";
// import { db } from "@workspace/db";

import { ensureSession } from "./auth.functions";

export const createPost = createServerFn({ method: "POST" })
  .inputValidator((data: { title: string }) => data)
  .handler(async ({ data }) => {
    const session = await ensureSession();
    // const post = await db.settings.create({
    //   title: data.title,
    //   authorId: session.user.id,
    // });

    // return post;
    return { session, data };
  });
