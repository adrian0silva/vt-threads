import type { NextRequest } from "next/server";

import * as forumService from "@/services/forum.service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const forum = await forumService.getForumBySlug(slug);

  if (!forum) {
    return new Response(JSON.stringify({ error: "Forum not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(forum), {
    headers: { "Content-Type": "application/json" },
  });
}
