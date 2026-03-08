import type { NextRequest } from "next/server";

import * as threadService from "@/services/thread.service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const thread = await threadService.getThreadForApi(slug);

  if (!thread) {
    return new Response(JSON.stringify({ error: "Thread not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(thread), {
    headers: { "Content-Type": "application/json" },
  });
}
