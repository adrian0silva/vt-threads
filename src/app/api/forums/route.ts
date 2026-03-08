import type { NextRequest } from "next/server";

import * as forumService from "@/services/forum.service";

export async function GET(_req: NextRequest) {
  const forums = await forumService.listForums();
  return new Response(JSON.stringify(forums), {
    headers: { "Content-Type": "application/json" },
  });
}
