import { z } from "zod";

import { auth } from "@/lib/auth";
import * as threadService from "@/services/thread.service";

const createThreadSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  forumId: z.string().uuid(),
});

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();
  const validation = createThreadSchema.safeParse(body);

  if (!validation.success) {
    return new Response(JSON.stringify({ error: validation.error.message }), {
      status: 400,
    });
  }

  const { title, description, forumId } = validation.data;

  const thread = await threadService.createThread({
    title,
    description,
    forumId,
    userId: session.user.id,
  });

  return new Response(JSON.stringify(thread), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET() {
  const result = await threadService.listThreads({
    filter: "all",
    page: 1,
    per: 100,
    sessionUserId: null,
  });
  return new Response(JSON.stringify(result.threads), {
    headers: { "Content-Type": "application/json" },
  });
}
